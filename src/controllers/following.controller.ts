import { Request, Response } from "express";
import dotenv from "dotenv";
import { getManager } from "typeorm";
import { FollowingRepository } from "../database/following/repo/following.repo";

dotenv.config();

export class FollowingController {
  static async addFollowing(req: Request, res: Response) {
    let connectionmanager =
      getManager().getCustomRepository(FollowingRepository);
    await connectionmanager.addTofollowing(req, res);
  }
    static async getFollowing(req: Request, res: Response) {
      let connectionmanager =
        getManager().getCustomRepository(FollowingRepository);
      await connectionmanager.fetchFollowing(req, res);
    }
}
