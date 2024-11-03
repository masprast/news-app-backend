import { NextFunction, Request, Response } from "express";
import authService from "../service/auth.service";
import status from "http-status";
import ApiError from "../utils/error";
import tokenService from "../service/token.service";

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const user = await authService.loginWithEmailPasswd(email, password);
		const token = await tokenService.genAuthToken({ userId: user.id });
		res.send({ user, token });
	} catch (error) {
		next(new ApiError(status.UNAUTHORIZED, "user tidak ada"));
	}
};

const logout = async (req: Request, res: Response) => {
	await authService.logout(req.body.refreshToken);
	res.status(status.NO_CONTENT).send();
};

const refreshToken = async (req: Request, res: Response) => {
	const token = await authService.refreshAuth(req.body.refreshToken);
	res.status(status.OK).send({ ...token });
};

export default { login, logout, refreshToken };
