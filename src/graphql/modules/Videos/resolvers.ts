import { IYogaContext } from "@/interfaces/yoga-context";
import { GraphQLError } from "graphql";
import utils from "../../../utils/handle-errors"

export default {
  Query: {
    video: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const video = await ctx.prisma.videos.findUnique({
          include: { channels: true },
          where: { id_video: args.id_video, deleted_at: null },
        });
        return video || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    videos: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        return await ctx.prisma.videos.findMany({
          include: { channels: true },
          where: { deleted_at: null },
          orderBy: { title: "asc" },
        });
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    deletedVideos: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const video = await ctx.prisma.videos.findMany({
          where: { NOT: [{deleted_at: null}] },
        });
        return video || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },
  Mutation: {
    createVideo: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        return await ctx.prisma.videos.create({
          data: {
            title: args.data.title,
            description: args.data.description,
            url: args.data.url,
            id_channel: parseInt(args.data.id_channel),
          },
        });
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    updateVideo: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_video, data } = args;
        return await ctx.prisma.videos.update({
          where: { id_video: parseInt(id_video) },
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
    deleteVideo: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_video } = args;
        const result = await ctx.prisma.videos.update({
          where: { id_video: parseInt(id_video), deleted_at: null },
          data: {
            deleted_at: new Date(),
          }
        });        
        return `Video deleted: ${result.id_video}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    reactivateVideo: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_video } = args;
        const result = await ctx.prisma.videos.update({
          where: { id_video: parseInt(id_video) },
          data: {
            deleted_at: null,
          }
        });        
        return `video reactivated: ${result.id_video}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },

}