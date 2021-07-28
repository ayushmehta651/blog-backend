import { Request, Response } from "express";
import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { UserPostsEntity } from "../entity/user_info.entity";
import { UserRepository } from "../../user/repo/user.repo";
import { FollowingRepository } from "../../following/repo/following.repo";

@EntityRepository(UserPostsEntity)
export class UserPostsRepository extends Repository<UserPostsEntity> {
  //! Adding posts in database
  async addBlog(req: Request, res: Response) {
    let { username, title, blog } = req.body;

    try {
      let userrepo = getCustomRepository(UserRepository);
      let user = await userrepo.findOne({ username: username });

      if (user) {
        let blogItem = new UserPostsEntity();
        blogItem.user = user;
        blogItem.title = title;
        blogItem.blog = blog;

        await blogItem.save();

        return res.send({
          added: true,
          message: "Post Added!",
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

  //!fetch particular user's following
  async fetchBlog(req: Request, res: Response) {
    let { username } = req.body; //!account's username
    let userrepo = getCustomRepository(UserRepository);
    let followingrepo = getCustomRepository(FollowingRepository);
    let user = await userrepo.findOne({ username: username });

    if (user) {
      try {
        let userFollowing = await followingrepo
          .createQueryBuilder("following")
          .select()
          .leftJoin("following.user", "user")
          .where("user.username = :username", { username: username })
          .getMany();

        let promises = userFollowing.map(async (ele) => {
          let name: String;
          name = ele.following_username;

          //!fetch blogs of each person
          let post = await this.createQueryBuilder("userposts")
            .select()
            .where("userposts.userUsername = :username", { username: name })
            .getMany();

          return { post, name };
        });

        Promise.all(promises).then(function (results) {
          return res.send({
            data: results,
            received: true,
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  //!Delete post of a particular user
  async deleteBlog(req: Request, res: Response) {
    let { postId } = req.body;

    try {
      await this.createQueryBuilder("userposts")
        .delete()
        .where("userposts.id = :id", { id: postId })
        .execute()
        .then((data: any) => {
          return res.send({
            deleted: true,
            message: "Deleted",
          });
        });
    } catch (error) {
      return res.send({
        deleted: false,
        message: "Something went wrong!",
      });
    }
  }
}
function typeOf(indiVidiual: UserPostsEntity[]): any {
  throw new Error("Function not implemented.");
}
