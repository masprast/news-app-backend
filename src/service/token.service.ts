import jwt from "jsonwebtoken";
import moment, { Moment } from "moment";
import config from "../config";
import prisma from "../client";
import { TipeToken, Token } from "@prisma/client";
import ApiError from "../utils/error";
import status from "http-status";
import { ResponTokenAuth } from "../type/respon";

moment().utcOffset(7, true);
const appConfig = config.appConfig.jwt;
const genereateToken = (userId: string, expire: Moment, type: TipeToken, secret = appConfig.secret) => {
	const payload = { sub: userId, iat: moment().unix() * 1000, exp: expire.unix() * 1000 + 25200000, type };
	console.log(new Date(payload.exp).toISOString());

	return new Promise((resolve, reject) => {
		return jwt.sign(payload, secret!, (err, token) => {
			if (err) reject(err);
			else resolve(`Bearer ${token}`);
		});
	});
};

const saveToken = async (token: string, userId: string, expire: Moment, type: TipeToken) => {
	return prisma.token.create({ data: { token: token, userId: userId, expire: expire.toDate(), type: type } });
};

const verifyToken = async (token: string, type: TipeToken): Promise<Token> => {
	try {
		const payload = jwt.verify(token, appConfig.secret!);
		const userId = payload.sub?.toString();
		const tokenData = await prisma.token.findFirst({ where: { token, type, userId: userId } });
		return tokenData!;
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "token not found");
	}
};

const genAuthToken = async (user: { userId: string }) => {
	const accessTokenExp = moment().add(appConfig.exp);
	const accessToken = await genereateToken(user.userId, accessTokenExp, TipeToken.ACCESS);

	const refreshTokenExp = moment().add(appConfig.exp_in_days);
	const refreshToken = await genereateToken(user.userId, refreshTokenExp, TipeToken.REFRESH);
	saveToken(refreshToken as string, user.userId, refreshTokenExp, TipeToken.REFRESH);

	return {
		access: { token: accessToken, expires: accessTokenExp.toDate() },
		refresh: { token: refreshToken, expires: refreshTokenExp.toDate() },
	} as ResponTokenAuth;
};

export default { genAuthToken, verifyToken };
