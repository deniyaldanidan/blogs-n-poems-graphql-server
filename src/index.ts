import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import {
  APP_GRAPHQL_ERROR_CODES,
  APP_URLS,
  HTTP_STATUS,
} from "./helpers/constants.js";
import authRouter from "./routers/authRouter.routes.js";
import masterErrorHandler from "./middlewares/masterErrorHandler.js";
import zodValidationErrHandler from "./middlewares/zodValidationErrHandler.js";
import alreadyExistErrHandler from "./middlewares/alreadyExistErrorHandler.js";
import credentialsMissingErrHandler from "./middlewares/credentialsMissingErrHandler.js";
import unauthorizedErrorHandler from "./middlewares/UnAuthorizedErrHandler.js";
import resourceNotFoundErrHandler from "./middlewares/resourceNotFoundErrHandler.js";
import jsonParseErrHandler from "./middlewares/jsonParseErrHandler.js";
import gqlSchema from "./graphql/gqlSchema.js";
import resolvers from "./graphql/resolvers/resolvers.js";
import { AppContext } from "./helpers/types.js";
import { validateAccess } from "./helpers/auth.js";
import { ApolloServerErrorCode } from "@apollo/server/errors";
import sampleController from "./controllers/sampleController.controller.js";

const app = express();
const PORT = 3500;
const httpServer = http.createServer(app);

const server = new ApolloServer<AppContext>({
  typeDefs: gqlSchema,
  resolvers: resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError(formattedError, error) {
    // switch (formattedError?.extensions?.code) {
    // case ApolloServerErrorCode.GRAPHQL_PARSE_FAILED:
    // return { message: `Graphql ${formattedError.message}`, ...formattedError };
    // case APP_GRAPHQL_ERROR_CODES.zodBadUserInput:
    // return {
    // message: formattedError.message,
    // errDetails: formattedError.extensions.errDetails,
    // };
    // return formattedError;
    // case APP_GRAPHQL_ERROR_CODES.unAuthenticated:
    //   return { message: formattedError.message, ...formattedError };
    // case APP_GRAPHQL_ERROR_CODES.forbidden:
    //   return { message: formattedError.message, ...formattedError };
    // case APP_GRAPHQL_ERROR_CODES.badRequest:
    //   return { message: formattedError.message, ...formattedError };
    // case APP_GRAPHQL_ERROR_CODES.notFound:
    //   return { message: formattedError.message, ...formattedError };
    // default:
    // return formattedError;
    // }
    // console.log(error);
    return formattedError;
  },
  includeStacktraceInErrorResponses: false, // ! Change it to false when development is DONE And also return {message: Unknown Error happened}
});

await server.start();

// Define Middleware's here
app.use(cors());
app.use(cookieParser());
app.use(express.json(), jsonParseErrHandler);
app.use(express.urlencoded({ extended: false }));

// Define Auth API
app.use(APP_URLS.auth.base, authRouter);
app.get("/sample", sampleController); // ! Will delete this After the TRIAL
// Define Graphql API
app.use(
  "/graphql",
  expressMiddleware<AppContext>(server, {
    context: async ({ req }) => {
      return validateAccess(
        req.headers?.authorization || (req.headers?.Authorization as string),
      );
    },
  }),
);

// Define Master-Error Handlers Here
app.use(zodValidationErrHandler);
app.use(alreadyExistErrHandler);
app.use(unauthorizedErrorHandler);
app.use(resourceNotFoundErrHandler);

// CredentialsErr Handler - this will stop the app
app.use(credentialsMissingErrHandler);
// Master-Master-Error
app.use(masterErrorHandler);

// 404-handler
app.use((req, res, _) => {
  return res
    .status(HTTP_STATUS.notFound)
    .send(`Sorry, Requested resource "${req.method}:${req.path}" NOT FOUND!`);
});

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
