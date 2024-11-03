import status from "http-status";
import { decrypt } from "../utils/encryption";
import userService from "./user.service";
import { TipeToken, User, UserRole } from "@prisma/client";
import prisma from "../client";
import tokenService from "./token.service";
import config from "../config";
import select from "../utils/select";
import ApiError from "../utils/error";
import { ResponTokenAuth } from "../type/respon";
import { randomUUID } from "crypto";

const loginWithEmailPasswd = async (email: string, password: string): Promise<Omit<User, "pwdHash">> => {
	if (email == config.superuser.name && password == config.superuser.pwd) {
		const adminTokenTemp = randomUUID();
		return {
			id: adminTokenTemp,
			email: config.superuser.name,
			username: config.superuser.name.split(".")[0],
			role: UserRole.ADMIN,
		} as User;
	}
	const user = await userService.getUserByEmail(email, ["id", "fullname", "email", "pwdHash", "username", "role"]);
	if (!user || !(await decrypt(password, user.pwdHash))) {
		throw new ApiError(status.UNAUTHORIZED, "incorrect email or password");
	}
	return select.exclude(user, ["pwdHash"]) as Omit<User, "pwdHash">;
};

const logout = async (refreshToken: string) => {
	try {
		const token = await prisma.token.findFirst({
			where: { token: refreshToken, type: TipeToken.REFRESH },
		});
		await prisma.token.delete({ where: { id: token!.id } });
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "token not found");
	}
};

const refreshAuth = async (refreshToken: string): Promise<ResponTokenAuth> => {
	try {
		const token = await tokenService.verifyToken(refreshToken, TipeToken.REFRESH);
		const { userId } = token;
		await prisma.token.delete({ where: { id: token.id } });
		return tokenService.genAuthToken({ userId: userId });
	} catch (error) {
		throw new ApiError(status.UNAUTHORIZED, "unauthorized");
	}
};

export default { loginWithEmailPasswd, logout, refreshAuth };
