import { Request, Response } from "express";
import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { UserRepository } from "../../user/repo/user.repo";
import { FollowingEntity } from "../entity/following.entity";

@EntityRepository(FollowingEntity)
export class FollowingRepository extends Repository<FollowingEntity> {
  //!Add the user to following
  async addTofollowing(req: Request, res: Response) {
    //!username :- whom you followed
    //!myusername :- you
    let { myusername, friendusername } = req.body;

    try {
      let userrepo = getCustomRepository(UserRepository);
      let user = await userrepo.findOne({ username: myusername });
      let friendUser = await userrepo.findOne({ username: friendusername });

      if (user) {
        if (friendUser) {
          let following = new FollowingEntity();
          following.user = myusername;
          following.following_username = friendusername;

          await following.save();

          return res.send({
            added: true,
            message: "Following Added!",
          });
        } else {
          return res.send({
            added: false,
            message: "Your Friend is not using this App!",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.send({
        added: false,
        message: "User not found!",
      });
    }
  }

  //!Fetch following of particular user
  async fetchFollowing(req: Request, res: Response) {
    let { username } = req.body;
    try {
      let userrepo = getCustomRepository(UserRepository);
      let user = await userrepo.findOne({ username: username });

      if (user) {
        let userFollowing = await this.createQueryBuilder("following")
          .select()
          .leftJoin("following.user", "user")
          .where("user.username = :username", { username: user?.username })
          .getMany();

        return res.send({
          received: true,
          count: userFollowing.length,
          data: userFollowing,
        });
      } else {
        return res.send({
          received: false,
          count: -1,
          message: "Wrong username!",
        });
      }
    } catch (error) {
      res.send({
        received: false,
        data: "Something went wrong!",
      });
    }
  }
}
