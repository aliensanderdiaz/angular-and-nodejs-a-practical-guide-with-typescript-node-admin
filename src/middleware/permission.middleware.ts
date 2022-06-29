import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";

export const AuthMiddleware = async (access: string) => {
    return async (req: Request, res: Response, next: Function) => {
    
    }
}