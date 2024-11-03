import express from "express";
import bodyParser from "body-parser";
import rute from "./route/v1/rute";
import helmet from "helmet";
import cors from "cors";
import status from "http-status";
import passport from "passport";
import { jwtStrategy } from "./utils/passport";
import ErrorHandler from "./middleware/error";
import ApiError from "./utils/error";

const app = express();

// header hardening (security)
app.use(helmet());
// json request body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// enable cors middleware
app.use(cors());
app.options("*", cors());
// jwt auth
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
// v1 api routes
app.use("/v1", rute);
// error handling for unkown route
app.use((req, res, next) => {
	next(new ApiError(status.NOT_FOUND, "not found"));
});
// handle error
app.use(ErrorHandler);

export default app;
