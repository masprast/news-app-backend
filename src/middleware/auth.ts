import { User } from "@prisma/client";
import status from "http-status";
import config from "../config";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import ApiError from "../utils/error";

const verifyCallback =
	(req: any, permit: string[], resolve: (value?: unknown) => void, reject: (reason?: unknown) => void) =>
	async (err: unknown, user: User | false, info: unknown) => {
		console.log(info);
		if (err || info || !user) {
			return reject(new ApiError(status.UNAUTHORIZED, "harap login"));
		}
		req.user = user;
		if (permit.length) {
			const userRights = config.roleRights.get(user.role) ?? [];
			const hasRequiredRole = permit.every((rights) => userRights.includes(rights));
			if (!hasRequiredRole && req.params.username !== user.username) {
				return reject(new ApiError(status.FORBIDDEN, "forbidden"));
			}
		}
		resolve();
	};

const auth =
	(...permit: string[]) =>
	async (req: Request, res: Response, next: NextFunction) => {
		console.log(req.headers);

		return new Promise((resolve, reject) => {
			passport.authenticate("jwt", { session: false }, verifyCallback(req, permit, resolve, reject))(req, res, next);
		})
			.then(() => next())
			.catch((err) => next(err));
	};

// const protect = async (req: Request, res: Response, next: NextFunction) => {
// 	const bearer = req.headers.authorization;
// 	let token;
// 	if (bearer && bearer.startsWith("Bearer")) {
// 		token = bearer.split(" ")[1];
// 	}
// 	if (!token) {
// 		next(status.UNAUTHORIZED);
// 	}

// 	const decodedToken=await jwt
// };
// const auth = async (req: Request, res: Response, next: NextFunction) => {
// 	passport.authenticate("jwt", (err: Errback, user: User) => {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (!user) {
// 			return res.status(status.UNAUTHORIZED);
// 		}
// 		req.user = user;
// 		next();
// 	})(req, res, next);
// };

export default auth;
