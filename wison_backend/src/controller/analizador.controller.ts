import { Request, Response, NextFunction } from "express";
import * as userService from "../services/analizador.service";

export const getUsers = (req: Request, res: Response) => {
  const users = userService.getAll();
  res.json(users);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};