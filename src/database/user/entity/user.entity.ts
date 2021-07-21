import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserPostsEntity } from "../../user_info/entity/user_info.entity";

import { FollowingEntity } from "./../../following/entity/following.entity";
import { FollowerEntity } from '../../follower/entity/follower.entity';

@Entity("user")
export class User {
  // @PrimaryGeneratedColumn("increment")
  // id!: string;

  @Column({
    nullable: false,
    unique: true,
    primary: true,
  })
  username!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  useremail!: string;

  @Column({
    nullable: false,
    unique: false,
  })
  userpassword!: string;

  @OneToMany(() => FollowingEntity, (follow) => follow.user)
  @JoinColumn()
  item!: FollowingEntity[];

  @OneToMany(() => UserPostsEntity, (info) => info.user)
  @JoinColumn()
  info!: UserPostsEntity[];
}
