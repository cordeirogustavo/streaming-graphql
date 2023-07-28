import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { IYogaContext } from './interfaces/yoga-context';

const prisma = new PrismaClient();
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  context: ({ request }: IYogaContext) => {
    return {
      ...request,
      prisma
    }
  },
});

const server = createServer(yoga)

server.listen(5000, () =>
  console.log(
    `Server started, listening on port 5000 for incoming requests.`
  )
);