import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getManager } from "typeorm";
import { UserRepository } from "../database/user/repo/user.repo";


dotenv.config();

export class AuthenticationController {
  static async signUp(req: Request, res: Response) {
    let connectionmanager = getManager().getCustomRepository(UserRepository);
    await connectionmanager.signUp(req, res);
  }
  static async login(req: Request, res: Response) {
    let connectionmanager = getManager().getCustomRepository(UserRepository);
    await connectionmanager.login(req, res);
  }
  static async decodeUserData(req: Request, res: Response) {
    let connectionmanager = getManager().getCustomRepository(UserRepository);
    await connectionmanager.decodeUserData(req, res);
  }
  static async getAllUsers(req: Request, res: Response) {
    let connectionmanager =
      getManager().getCustomRepository(UserRepository);
    await connectionmanager.fetchUsernames(req, res);
  }
}