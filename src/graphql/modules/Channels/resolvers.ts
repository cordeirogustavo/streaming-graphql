import { IYogaContext } from "@/interfaces/yoga-context";
import { GraphQLError } from "graphql";
import utils from "../../../utils/handle-errors"

export default {
  Query: {
    channel: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const channel = await ctx.prisma.channels.findUnique({
          include: { playlists: true, videos: true },
          where: { id_channel: args.id_channel, deleted_at: null },
        });
        return channel || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    channels: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        return await ctx.prisma.channels.findMany({
          include: { playlists: true, videos: true },
          where: { deleted_at: null },
          orderBy: { name: "asc" },
        });
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    deletedChannels: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const channel = await ctx.prisma.channels.findMany({
          where: { NOT: [{deleted_at: null}] },
        });
        return channel || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },
  Mutation: {
    createChannel: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        return await ctx.prisma.channels.create({
          data: {
            ...args.data,
          },
        });
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    updateChannel: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_channel, data } = args;
        return await ctx.prisma.channels.update({
          where: { id_channel: parseInt(id_channel) },
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
    deleteChannel: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_channel } = args;
        const result = await ctx.prisma.channels.update({
          where: { id_channel: parseInt(id_channel), deleted_at: null },
          data: {
            deleted_at: new Date(),
          }
        });        
        return `Channel deleted: ${result.id_channel}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    reactivateChannel: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_channel } = args;
        const result = await ctx.prisma.channels.update({
          where: { id_channel: parseInt(id_channel) },
          data: {
            deleted_at: null,
          }
        });        
        return `Channel reactivated: ${result.id_channel}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },

}