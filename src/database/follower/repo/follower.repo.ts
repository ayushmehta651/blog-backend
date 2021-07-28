import { Request, Response } from "express";
import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { UserRepository } from "../../user/repo/user.repo";
import { FollowerEntity } from "../entity/follower.entity";

@EntityRepository(FollowerEntity)
export class FollowerRepository extends Repository<FollowerEntity> {
  //!Add the user to follower
  async addTofollower(req: Request, res: Response) {
    //!friendusername :- who followed me
    //!myusername :- you
    let { myusername, friendusername } = req.body;

    try {
      let userrepo = getCustomRepository(UserRepository);
      let user = await userrepo.findOne({ username: myusername });
      let friendUser = await userrepo.findOne({ username: friendusername });

      if (user) {
        if (friendUser) {
          let follower = new FollowerEntity();
          follower.user = myusername;
          follower.follower_username = friendusername;

          await follower.save();

          return res.send({
            added: true,
            message: "Follower Added!",
          });
        } else {
          return res.send({
            added: false,
            message: "Your Friend is not using this App!",
          });
        }
      } else {
        return res.send({
          added: false,
          message: "User Not found!",
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        added: false,
        message: "User not found!",
      });
    }
  }

  //!Fetch follower of particular user
  async fetchFollower(req: Request, res: Response) {
    let { username } = req.body;
    try {
      let userrepo = getCustomRepository(UserRepository);
      let user = await userrepo.findOne({ username: username });

      if (user) {
        let userFollower = await this.createQueryBuilder("follower")
          .select()
          .leftJoin("follower.user", "user")
          .where("user.username = :username", { username: user?.username })
          .getMany();

        return res.send({
          received: true,
          count: userFollower.length,
          data: userFollower,
        });
      } else {
        return res.send({
          received: false,
          count: 0,
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
