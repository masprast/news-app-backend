import { Strategy, ExtractJwt, VerifyCallback } from "passport-jwt";
import config from "../config";
import prisma from "../client";
import ApiError from "../utils/error";
import status from "http-status";
import { TipeToken } from "@prisma/client";

const jwtOptions = { secretOrKey: config.appConfig.jwt.secret!, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() };

const jwtVerify: VerifyCallback = async (payload, done) => {
	try {
		if (payload.type !== TipeToken.ACCESS) {
			throw new ApiError(status.UNAUTHORIZED, "unauthorized");
		}
		const user = await prisma.user.findUnique({
			select: { id: true, email: true, username: true, role: true },
			where: { id: payload.sub },
		});
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

export const jwtStrategy = new Strategy(jwtOptions, jwtVerify);
