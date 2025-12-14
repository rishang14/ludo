import { Prisma, type User } from "@prisma/client";
import prisma from "../prisma";

export class UserRepo {
  public static async getAndKnowUser(email: string): Promise<User> {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new Error(`User Not Found with the email :${email}`);
    }
    return user;
  }

  public static async updateUserData(
    userId: string,
    data: Partial<User>
  ): Promise<User> {
    try {
      const updateUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...data,
        },
      });
      if (!updateUser) {
        throw new Error(
          `Something went wrong while updating the user : ${userId}`
        );
      }
      return updateUser;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error(`User not found: ${userId}`);
        }
      }
      throw error;
    }
  }

  public static async userOnGoingGame(email: string){
    const user = await this.getAndKnowUser(email);
    if (user.onGoingGame) {
     return {success:true, data:user.onGoingGame};
    } 
    return {success:false,data:null};;
  }
}
