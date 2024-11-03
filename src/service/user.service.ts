import { Prisma, User, UserRole } from "@prisma/client";
import status from "http-status";
import prisma from "../client";
import { encrypt } from "../utils/encryption";
import ApiError from "../utils/error";

const createUser = async (email: string, password: string, username?: string, role: UserRole = UserRole.USER) => {
	if (await getUserByEmail(email)) {
		throw new ApiError(status.BAD_REQUEST, `User dengan email ${email} sudah ada`);
	}
	return prisma.user.create({
		data: {
			email,
			username,
			pwdHash: await encrypt(password),
			role,
		},
	});
};

const getUserByEmail = async <Key extends keyof User>(
	email: string,
	keys: Key[] = ["id", "fullname", "username", "email", "role", "createdAt", "updatedAt"] as Key[]
) => {
	try {
		return (await prisma.user.findUnique({
			where: { email },
			select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
		})) as Promise<Pick<User, Key> | null>;
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "user tidak ada");
	}
};

const listUser = async <Key extends keyof User>(
	filter: object,
	option: { limit?: number; page?: number },
	keys: Key[] = ["id", "fullname", "username", "email", "role", "createdAt", "updatedAt"] as Key[]
): Promise<Pick<User, Key>[]> => {
	const page = option.page ?? 1;
	const limit = option.limit ?? 10;
	const users = await prisma.user.findMany({
		where: filter,
		select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
		skip: page * limit,
		take: limit,
	});

	return users as Pick<User, Key>[];
};

const getUserById = async <Key extends keyof User>(
	id: string,
	keys: Key[] = ["id", "email", "username", "fullname", "role", "createdAt", "updatedAt", "pwdHash"] as Key[]
) => {
	try {
		return prisma.user.findUnique({ where: { id }, select: keys.reduce((o, k) => ({ ...o, [k]: true }), {}) }) as Promise<Pick<
			User,
			Key
		> | null>;
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "user not found");
	}
};

const getUserByUsername = async <Key extends keyof User>(
	username: string,
	keys: Key[] = ["fullname", "username", "email", "role"] as Key[]
) => {
	try {
		return prisma.user.findUnique({
			where: { username },
			select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
		}) as Promise<Pick<User, Key> | null>;
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "user not found");
	}
};

const updateUserById = async <Key extends keyof User>(
	userid: string,
	data: Prisma.UserUpdateInput,
	keys: Key[] = ["id", "fullname", "username", "email", "role", "updatedAt"] as Key[]
) => {
	try {
		const user = await getUserById(userid, ["id", "email", "fullname", "role", "pwdHash"]);

		data.updatedAt = new Date(Date.now());
		const updated = await prisma.user.update({
			where: { id: user!.id },
			data: data,
			select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
		});
		return updated as Pick<User, Key> | null;
	} catch (error) {
		if (data.email && (await getUserByEmail(data.email as string))) {
			throw new ApiError(status.BAD_REQUEST, "email already exist");
		} else {
			throw new ApiError(status.NOT_FOUND, "not found");
		}
	}
};

const deleteUser = async (userid: string): Promise<User> => {
	try {
		const user = await getUserById(userid);
		await prisma.user.delete({ where: { id: user!.id } });
		return user!;
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "not found");
	}
};

export default { createUser, getUserByEmail, listUser, getUserByUsername, getUserById, updateUserById, deleteUser };
