import { NextFunction, Request, Response } from 'express';
import { environment } from '../../environment';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers['x-api-key'] === environment.API_KEY) {
    next();
  }
  else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
