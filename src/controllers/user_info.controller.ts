import { Request, Response } from "express";
import dotenv from "dotenv";
import { getManager } from "typeorm";
import { UserPostsRepository } from "../database/user_info/repo/user_info.repo";

dotenv.config();

export class UserPostsController {
  static async addpost(req: Request, res: Response) {
    let connectionmanager =
      getManager().getCustomRepository(UserPostsRepository);
    await connectionmanager.addBlog(req, res);
  }
  static async getpost(req: Request, res: Response) {
    let connectionmanager =
      getManager().getCustomRepository(UserPostsRepository);
    await connectionmanager.fetchBlog(req, res);
  }
  static async deletepost(req: Request, res: Response) {
    let connectionmanager =
      getManager().getCustomRepository(UserPostsRepository);
    await connectionmanager.deleteBlog(req, res);
  }
}
