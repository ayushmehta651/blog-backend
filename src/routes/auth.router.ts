import Router from "express";
import { AuthenticationController } from './../controllers/authentication.controller';

const authrouter = Router();

authrouter.get("/verify",AuthenticationController.decodeUserData);
authrouter.post("/signup", AuthenticationController.signUp);
authrouter.post("/login", AuthenticationController.login);
authrouter.get("/get-all-usernames", AuthenticationController.getAllUsers);


//authrouter.get("/fetch",AuthenticationController.fetchData);


export {authrouter};