import { Request, Response } from "express";
import userService from "../service/user.service";
import status from "http-status";
import select from "../utils/select";
import ApiError from "../utils/error";

const createUser = async (req: Request, res: Response) => {
	const { email, passwd, username, role } = req.body;
	const userBaru = await userService.createUser(email, passwd, username, role);
	res.status(status.CREATED).send(userBaru);
};

const getUserList = async (req: Request, res: Response) => {
	const filter = select.pick(req.query, ["fullname", "role"]);
	const option = select.pick(req.query, ["limit", "page"]);
	const result = await userService.listUser(filter, option);
	res.status(status.OK).send(result);
};

const getUserDetail = async (req: Request, res: Response) => {
	try {
		const user = await userService.getUserByUsername(req.params.username);
		res.send(user);
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "user not found");
	}
};

const updateUser = async (req: Request, res: Response) => {
	const updatedUser = await userService.updateUserById(req.params.userId, req.body);
	res.send(updatedUser);
};

const deleteUser = async (req: Request, res: Response) => {
	await userService.deleteUser(req.params.userId);
	res.status(status.NO_CONTENT).send();
};

export default { createUser, getUserList, getUserDetail, updateUser, deleteUser };
