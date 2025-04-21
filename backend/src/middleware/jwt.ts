import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { environment } from '../../environment';

export interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const jwtMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Verifica a API Key
  if (apiKey !== environment.API_KEY) {
    res.status(401).json({ message: 'API Key unauthorized' });
  }

    // Verifica o JWT
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token JWT unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, environment.JWT_SECRET) as { id: number };
      req.user = { id: decoded.id };
      next();
    } catch {
      res.status(403).json({ message: 'Token JWT unauthorized' });
    }
};
