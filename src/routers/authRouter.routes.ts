import express from "express";
import { APP_URLS } from "../helpers/constants.js";
import signUpController from "../controllers/signUp.controller.js";
import signInController from "../controllers/signIn.controller.js";
import refreshController from "../controllers/refresh.controller.js";
import logoutController from "../controllers/logout.controller.js";

const authRouter = express.Router();

// Routes comes here
authRouter.post(APP_URLS.auth.signUp, signUpController);
authRouter.post(APP_URLS.auth.signIn, signInController);
authRouter.put(APP_URLS.auth.refresh, refreshController);
authRouter.put(APP_URLS.auth.logOut, logoutController);

export default authRouter;
