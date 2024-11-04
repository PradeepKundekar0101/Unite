import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
}

export const authUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
     res.status(403).send({ message: 'Unauthorized' });
     return
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
     res.status(403).send({ message: 'Unauthorized' });
     return
  }
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const { userId, role } = decodedToken;
    if (!userId || !role) {
       res.status(403).send({ message: 'Invalid token' });
       return
    }
    req.userId = userId;
    req.role = role;
    next();
  } catch (error) {
     res.status(403).send({ message: 'Token expired or invalid' });
     return
  }
};
