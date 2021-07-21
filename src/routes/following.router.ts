import Router from "express";
import { FollowingController } from '../controllers/following.controller';

const followinginforouter = Router();

followinginforouter.post("/addFollowing", FollowingController.addFollowing);
followinginforouter.post("/getFollowing", FollowingController.getFollowing);

export { followinginforouter };
