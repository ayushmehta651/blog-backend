import Router from "express";
import { UserPostsController } from "../controllers/user_info.controller";

const userinforouter = Router();

userinforouter.post("/addpost", UserPostsController.addpost);
userinforouter.post("/getpost", UserPostsController.getpost);
userinforouter.post("/deletepost", UserPostsController.deletepost);

export { userinforouter };
