import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "../../user/entity/user.entity";
  
  @Entity("follower")
  export class FollowerEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    followid!: string;
  
    @Column()
    follower_username!: string;
  
    @ManyToOne(() => User, (user) => user.item)
    user!: User;
  }
  