import { join } from "path";
import { ConnectionOptions } from "typeorm";
import { User } from "./database/user/entity/user.entity";
import { FollowingEntity } from './database/following/entity/following.entity';
import { UserPostsEntity } from "./database/user_info/entity/user_info.entity";
import { FollowerEntity } from './database/follower/entity/follower.entity';


const connectionOptions: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "postgres",
  entities: [User, FollowingEntity,UserPostsEntity, FollowerEntity],
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  logging: false,
  logger: "debug",
  migrations: [join(__dirname, "src/migration/*/.ts")],
};

export = connectionOptions;