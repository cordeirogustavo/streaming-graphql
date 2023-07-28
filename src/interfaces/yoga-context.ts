import { PrismaClient } from "@prisma/client";

export interface IYogaContext {
  prisma: PrismaClient;
  request: Request;
}