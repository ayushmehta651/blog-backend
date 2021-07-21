import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { User } from "./database/user/entity/user.entity";
import { FollowingEntity } from "./database/following/entity/following.entity";
import { UserPostsEntity } from "./database/user_info/entity/user_info.entity";
import { FollowerEntity } from "./database/follower/entity/follower.entity";
import dotenv from "dotenv";

dotenv.config();
const connectionOptions: ConnectionOptions = {
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  type: "postgres",
  host: process.env.Host || "localhost",
  port: 5432 || process.env.DB_PORT,
  username: process.env.User || "postgres",
  password: process.env.DB_Password || "password",
  database: process.env.Database || "postgres",
  entities: [User, FollowingEntity, UserPostsEntity, FollowerEntity],
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  logging: false,
  logger: "debug",
  migrations: [join(__dirname, "src/migration/*/.ts")],
};

export = connectionOptions;
