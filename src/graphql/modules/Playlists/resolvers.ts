import { IYogaContext } from "@/interfaces/yoga-context";
import { GraphQLError } from "graphql";
import utils from "../../../utils/handle-errors"

export default {
  Query: {
    playlist: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const playlist = await ctx.prisma.playlists.findUnique({
          include: {
            playlistVideos: {
              include: { videos: true },
            },
          },
          where: { id_playlist: args.id_playlist, deleted_at: null },
        });
        return playlist || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    playlists: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        return await ctx.prisma.playlists.findMany({
          include: {
            playlistVideos: {
              include: { videos: true },
            },
          },
          where: { deleted_at: null },
          orderBy: { name: "asc" },
        });
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    deletedPlaylists: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const channel = await ctx.prisma.playlists.findMany({
          where: { NOT: [{deleted_at: null}] },
        });
        return channel || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },
  Mutation: {
    createPlaylist: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const { data } = args;
        return await ctx.prisma.playlists.create({
          data: {
            name: data.name,
            description: data.description,
            id_channel: parseInt(data.id_channel),
          },
        });
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    updatePlaylist: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_playlist, data } = args;
        return await ctx.prisma.playlists.update({
          where: { id_playlist: parseInt(id_playlist) },
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
    deletePlaylist: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_playlist } = args;
        const result = await ctx.prisma.playlists.update({
          where: { id_playlist: parseInt(id_playlist), deleted_at: null },
          data: {
            deleted_at: new Date(),
          }
        });        
        return `Channel deleted: ${result.id_playlist}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    reactivatePlaylist: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_playlist } = args;
        const result = await ctx.prisma.playlists.update({
          where: { id_playlist: parseInt(id_playlist) },
          data: {
            deleted_at: null,
          }
        });        
        return `Playlist reactivated: ${result.id_playlist}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },

}