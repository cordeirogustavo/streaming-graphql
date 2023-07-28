import { IYogaContext } from "@/interfaces/yoga-context";
import { GraphQLError } from "graphql";
import utils from "../../../utils/handle-errors"

export default {
  Query: {
    playlistVideo: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const playlistVideo = await ctx.prisma.playlistVideos.findUnique({
          include: { 
            videos: true, 
            playlists: true 
          },
          where: { 
            id_video_id_playlist: {
              id_video: parseInt(args.id_video),
              id_playlist: parseInt(args.id_playlist),
            }
          },
        });
        return playlistVideo || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    playlistVideos: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const playlistVideo = await ctx.prisma.playlistVideos.findMany({
          include: { 
            videos: true, 
            playlists: true 
          },
          where: { 
            id_playlist: parseInt(args.id_playlist)
          }
        });
        return playlistVideo || null;
      } catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
  },
  Mutation: {
    createPlaylistVideo: async (parent: any, args: any, ctx: IYogaContext) => {
      try {
        const { data } = args;
        return await ctx.prisma.playlistVideos.create({
          data: {
            id_video: parseInt(data.id_video),
            id_playlist: parseInt(data.id_playlist),
          },
        });
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    },
    removeVideoFromPlaylist: async (parent: any, args: any, ctx: IYogaContext, info: any) => {
      try {
        const { id_video, id_playlist } = args;
        const result = await ctx.prisma.playlistVideos.delete({
          where: { 
            id_video_id_playlist: {
              id_video: parseInt(id_video),
              id_playlist: parseInt(id_playlist),
            }
          },
        });        
        return `Video removed from playlist: ${result.id_video}`;
      
      }
      catch (err: any) {
        throw new GraphQLError(utils.handlePrismaErrors(err));
      }
    }
  },

}