import { Request, Response } from "express";
import dotenv from "dotenv";
import { getManager } from "typeorm";
import { FollowerRepository } from "../database/follower/repo/follower.repo";

dotenv.config();

export class FollowerController {
  static async addFollower(req: Request, res: Response) {
    let connectionmanager =
      getManager().getCustomRepository(FollowerRepository);
    await connectionmanager.addTofollower(req, res);
  }
  static async getFollower(req: Request, res: Response) {
    let connectionmanager =
      getManager().getCustomRepository(FollowerRepository);
    await connectionmanager.fetchFollower(req, res);
  }
}
