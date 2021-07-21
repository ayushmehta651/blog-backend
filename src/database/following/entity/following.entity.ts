import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entity/user.entity";

@Entity("following")
export class FollowingEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  followid!: string;

  @Column()
  following_username!: string;

  @ManyToOne(() => User, (user) => user.item)
  user!: User;
}
