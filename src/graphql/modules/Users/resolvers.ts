import { IYogaContext } from "@/interfaces/yoga-context";
import { GraphQLError } from "graphql";
import utils from "../../../utils/handle-errors"

export default {
  Query: {
    user: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const user = await ctx.prisma.users.findUnique({
          where: { id_user: args.id_user, deleted_at: null },
        });
        return user || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    users: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        return await ctx.prisma.users.findMany({
          where: { deleted_at: null },
          orderBy: { name: "asc" },
        });
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    deletedUsers: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const user = await ctx.prisma.users.findMany({
          where: { NOT: [{deleted_at: null}] },
        });
        return user || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },
  Mutation: {
    createUser: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        return await ctx.prisma.users.create({
          data: {
            ...args.data,
          },
        });
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    updateUser: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_user, data } = args;
        return await ctx.prisma.users.update({
          where: { id_user: parseInt(id_user) },
          data: {
            ...data,
            updated_at: new Date(),
          },
        });
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    deleteUser: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_user } = args;
        const result = await ctx.prisma.users.update({
          where: { id_user: parseInt(id_user), deleted_at: null },
          data: {
            deleted_at: new Date(),
          }
        });        
        return `User deleted: ${result.id_user}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    reactivateUser: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_user } = args;
        const result = await ctx.prisma.users.update({
          where: { id_user: parseInt(id_user) },
          data: {
            deleted_at: null,
          }
        });        
        return `User reactivated: ${result.id_user}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },

}