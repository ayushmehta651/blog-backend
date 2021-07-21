import { Request, Response } from "express";
import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { UserPostsEntity } from "../entity/user_info.entity";
import { UserRepository } from "../../user/repo/user.repo";

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

  //!fetch particular user posts
  async fetchBlog(req: Request, res: Response) {
    let { username } = req.body;
    let userrepo = getCustomRepository(UserRepository);
    let user = await userrepo.findOne({ username: username });

    if (user) {
      try {
        let userPosts = await this.createQueryBuilder("userposts")
          .select()
          .leftJoin("userposts.user", "user")
          .where("user.username = :username", { username: user?.username })
          .getMany();

        if (userPosts.length === 0) {
          return res.send({
            received: true,
            filled: false,
            data: "Oops! No Data found",
          });
        } else {
          return res.send({
            received: true,
            filled: true,
            data: userPosts,
          });
        }
      } catch (error) {
        return res.send({
          received: false,
          filled: false,
          data: "Something went wrong!",
        });
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
