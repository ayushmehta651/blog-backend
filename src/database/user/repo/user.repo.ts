import { Request, Response } from "express";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async fetchUser(req: Request, res: Response) {
    let jwt_secret = process.env.JWT_SECRET as string;
    let tokendata = req.headers.authorization as string;
    jwt.verify(tokendata, jwt_secret, async (error: any, authData: any) => {
      if (error) {
        console.log(error);
        return res.send({
          error: error,
          data: null,
        });
      } else {
        let data = await this.createQueryBuilder("user").select().getMany();
        return res.send({
          confidentialData: data,
          authData: authData,
        });
      }
    });
  }

  //! fetch usernames
  async fetchUsernames(req: Request, res: Response) {
    try {
      let users = await this.createQueryBuilder("user")
        .select("user.username")
        .getMany();
      if (users.length === 0) {
        return res.send({
          received: true,
          filled: false,
          data: "Oops! No Data found",
        });
      } else {
        return res.send({
          received: true,
          filled: true,
          data: users,
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

  async login(req: Request, res: Response) {
    let { useremail, newuserpassword } = req.body;
    let isValidated = validateEmail(useremail);
    let jwt_secret = process.env.JWT_SECRET as string;

    if (!isValidated) {
      return res.send({
        authentication: false,
        data: "Invalid email",
      });
    } else {
      //! Find the user password from the database
      let findUserPasswordFromDb = await this.createQueryBuilder("user")
        .select("user.userpassword")
        .where("user.useremail = :query", { query: useremail })
        .getOne();

      //! Find the user id from the database
      let userUsername = await this.createQueryBuilder("user")
        .select("user.username")
        .where("user.useremail = :query", { query: useremail })
        .getOne();

      bcrypt.compare(
        newuserpassword,
        findUserPasswordFromDb?.userpassword as string,
        (error: any, isPasswordMatched: any) => {
          //console.log(newuserpassword, findUserPasswordFromDb?.userpassword);
          if (error) {
            return res.send({
              authentication: false,
              data: error,
              username: null,
            });
          }
          if (!isPasswordMatched) {
            return res.send({
              authentication: false,
              data: "Incorrect password",
              username: null,
            });
          }
          if (isPasswordMatched) {
            jwt.sign(
              {
                useremail: useremail,
              },
              jwt_secret,
              {
                expiresIn: "2h",
              },
              async (error: any, authdata: any) => {
                if (error) {
                  return res.send({
                    authentication: false,
                    data: error,
                    username: null,
                  });
                } else {
                  return res.send({
                    authentication: true,
                    data: authdata,
                    username: userUsername,
                  });
                }
              }
            );
          }
        }
      );
    }
  }

  async signUp(req: Request, res: Response) {
    let { username, useremail, userpassword } = req.body;
    let isvalidated = validateEmail(useremail);
    let jwt_secret = process.env.JWT_SECRET as string;

    if (!isvalidated) {
      return res.send({
        authentication: false,
        data: "Invalid Email",
      });
    }

    let emailExists =
      (await this.createQueryBuilder("user")
        .where("user.useremail = :query", { query: useremail })
        .getCount()) > 0;

    if (emailExists) {
      return res.send({
        authentication: false,
        data: "Email is taken, Try another one!",
      });
    } else {
      const salt = await bcrypt.genSalt(10);

      await bcrypt.hash(
        userpassword,
        salt,
        async (error: any, hashedpassword: any) => {
          if (error) {
            console.log(error);
            return res.send({
              authentication: false,
              data: error,
            });
          } else {
            let user = new User();
            user.username = username;
            user.userpassword = hashedpassword;
            user.useremail = useremail;
            await this.save(user);

            // create JWT => Sign jwt
            // let userid = this.createQueryBuilder("user")
            //   .select(user.id)
            //   .where("user.useremail = :query", {
            //     query: useremail,
            //   })
            //   .getOne();

            jwt.sign(
              {
                //payload
                useremail: useremail,
              },
              jwt_secret,
              {
                expiresIn: "10h",
              },
              async (error: any, authData: any) => {
                if (error) {
                  console.log(error);
                  return res.send({
                    authentication: false,
                    data: error,
                  });
                } else {
                  return res.send({
                    authentication: true,
                    data: authData,
                  });
                }
              }
            );
          }
        }
      );
    }
  }

  async decodeUserData(req: Request, res: Response) {
    let jwt_secret = process.env.JWT_SECRET as string;
    let tokendata = req.headers.authorization as string;
    jwt.verify(tokendata, jwt_secret, async (error: any, authData: any) => {
      if (error) {
        console.log(error);
        return res.send({
          error: error,
          data: null,
        });
      } else {
        return res.send({
          received: true,
          data: authData,
        });
      }
    });
  }
}

function validateEmail(useremail: any) {
  let re = /\S+@\S+\.\S+/;
  return re.test(useremail);
}
