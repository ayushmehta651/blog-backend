import express from "express";
import "reflect-metadata";
import cors from "cors";
import dotenv from "dotenv";
import { authrouter } from "./routes/auth.router";
import { createConnection, ConnectionOptions } from "typeorm";
import config from "./ormconfig";
import { userinforouter } from "./routes/user_info.router";
import { followinginforouter } from "./routes/following.router";
import { followerinforouter } from "./routes/follower.router";

dotenv.config();

createConnection(config as ConnectionOptions)
  .then(async (connection) => {
    if (connection.isConnected) {
      console.log(`🐘 is connected!!`);
    }

    const app = express();
    const port = process.env.PORT || 8080;
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.set("port", port);

    app.get("/", (req, res) => {
      res.send("Blog API");
    });

    app.use("/user", authrouter);
    app.use("/userpost", userinforouter);
    app.use("/userfollowing", followinginforouter);
    app.use("/userfollower", followerinforouter);

    app.listen(app.get("port"), () => {
      console.log(`🚀 is rocking over ${app.get("port")}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
