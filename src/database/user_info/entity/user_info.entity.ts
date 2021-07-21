import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/entity/user.entity";

@Entity("userposts")
export class UserPostsEntity extends BaseEntity{
  @PrimaryGeneratedColumn("increment")
  id!: string;

  @Column()
  title! : string;

  @Column()
  blog!: string;

  @ManyToOne(() => User, (user) => user.info, {
    cascade: ["update"],
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user!: User;
}
