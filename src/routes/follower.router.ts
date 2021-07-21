import Router from "express";
import { FollowerController } from "../controllers/follower.controller";

const followerinforouter = Router();

followerinforouter.post("/addFollower", FollowerController.addFollower);
followerinforouter.post("/getFollower", FollowerController.getFollower);

export { followerinforouter };
