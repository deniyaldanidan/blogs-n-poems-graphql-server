import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

const app = express();
const PORT = 3500;
const httpServer = http.createServer(app);

const typeDefs = `#graphql

    type Blog{
        name:  String
        author: String
        content: String
    }

    # Query type list all of the available queries that clients can execute
    type Query{
        blogs: [Blog] # blogs query returns array of zero or more blogs
    }

`;

// Data
const blogsData = [
  {
    name: "Oh captian",
    author: "Salone",
    content: "This is a sample content for 'Oh Captain!'",
  },
  {
    name: "She Is",
    author: "Priscilla Adams",
    content: "This is a sample content for 'She Is'",
  },
];

const resolvers = {
  Query: {
    blogs: () => blogsData,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// Define Middleware's here
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define Auth API

// Define Graphql API
app.use("/graphql", expressMiddleware(server));

// Define Master-Error Handlers Here

// app.listen(PORT, (error) => {
//   if (error) {
//     throw new Error("App failed to start");
//   }
//   console.log(`Server running on Port ${PORT}`);
// });

await new Promise<void>((resolve) => {
  httpServer.listen({ port: PORT }, resolve);
});

console.log(`Server is running on port: ${PORT}`);
