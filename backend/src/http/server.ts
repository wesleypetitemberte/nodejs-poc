import express, { Request, Response } from 'express';
import { environment } from '../../environment';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { apiKeyMiddleware } from 'src/middleware/auth';
import { AuthenticatedRequest, jwtMiddleware } from 'src/middleware/jwt';

const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, environment.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: environment.DB_HOST,
  user: environment.DB_USER,
  password: environment.DB_PASS,
  database: environment.DB_NAME,
});

const PORT = environment.PORT;
const apiURL = '/api/v1';

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

db.query(
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  err => {
    if (err) console.error('Erro ao criar tabela users:', err);
  }
);

// Tasks table
db.query(
  `CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  err => {
    if (err) console.error('Erro ao criar tabela tasks:', err);
  }
);


// REGISTRO DE USUÁRIO
app.post(apiURL + '/auth/register', apiKeyMiddleware, (req: Request, res: Response) => {
  const { email, password, password2 } = req.body;

  if (!email || !password || !password2) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    return;
  }

  if (password !== password2) {
    res.status(400).json({ error: 'As senhas não coincidem' });
    return;
  }

  bcrypt.hash(password, 10).then((hashedPassword) => {
    db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          if ((err as any).code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Email já cadastrado' });
            return;
          }
          res.status(500).json({ error: err.message });
          return;
        }

        const id = (result as any).insertId;
        const token = generateToken(id);
        res.status(201).json({ id, email, token });
      }
    );
  }).catch((err) => {
    res.status(500).json({ error: 'Erro ao processar a solicitação', err });
  });
});

// LOGIN
app.post(apiURL + '/auth/login', apiKeyMiddleware, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const user = (results as any)[0];
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = generateToken(user.id);
    res.json({ id: user.id, email: user.email, token });
  });
});

// FORGOT PASSWORD (Gera um código aleatório e salva no banco)
app.post(apiURL + '/auth/forgot-password', apiKeyMiddleware, (req: Request, res: Response) => {
  const { email } = req.body;
  const code = Math.random().toString(36).substring(2, 8); // Código simples

  db.query('UPDATE users SET code = ? WHERE email = ?', [code, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Email não encontrado' });
    }

    // Em um app real, você enviaria esse código por email
    res.json({ message: 'Código de recuperação gerado', code });
  });
});

app.get(apiURL + '/tasks', jwtMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;

  db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post(apiURL + '/tasks', jwtMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { customer, name, description, price } = req.body;
  const userId = req.user.id;

  db.query(
    'INSERT INTO tasks (user_id, customer, name, description, price) VALUES (?, ?, ?, ?, ?)',
    [userId, customer, name, description, price],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: (result as any).insertId, user_id: userId, customer, name, description, price });
      }
    }
  );
});

app.put(apiURL + '/tasks/:id', jwtMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { customer, name, description, price } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  db.query(
    'UPDATE tasks SET customer = ?, name = ?, description = ?, price = ? WHERE id = ? AND user_id = ?',
    [customer, name, description, price, id, userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if ((result as any).affectedRows === 0) {
        return res.status(403).json({ error: 'Sem permissão ou task não encontrada' });
      }
      res.status(200).json({ message: 'Task atualizada com sucesso!' });
    }
  );
});

app.delete(apiURL + '/tasks/:id', jwtMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if ((result as any).affectedRows === 0) {
      return res.status(403).json({ error: 'Sem permissão ou task não encontrada' });
    }
    res.status(200).json({ message: 'Task deletada com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
