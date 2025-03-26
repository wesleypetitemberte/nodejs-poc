import express, { Request, Response } from "express";
import { environment } from "../../environment";
import mysql from "mysql2";
import cors from "cors";

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

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
    } else {
        console.log("Conectado ao MySQL!");
    }
});

db.query(
    `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        age INT NOT NULL
    )`,
    (err) => {
        if (err) console.error("Erro ao criar tabela:", err);
    }
);

app.get("/users", (req: Request, res: Response) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.post("/users", (req: Request, res: Response) => {
    const { name, lastname, age } = req.body;
    db.query(
        "INSERT INTO users (name, lastname, age) VALUES (?, ?, ?)",
        [name, lastname, age],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: (result as any).insertId, name, lastname, age });
            }
        }
    );
});

app.put("/users/:id", (req: Request, res: Response) => {
    const { name, lastname, age } = req.body;
    const { id } = req.params;
    db.query(
        "UPDATE users SET name = ?, lastname = ?, age = ? WHERE id = ?",
        [name, lastname, age, id],
        (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: "Usuário atualizado com sucesso!" });
            }
        }
    );
});

app.delete("/users/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: "Usuário deletado com sucesso!" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
