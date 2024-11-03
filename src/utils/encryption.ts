import { genSalt, hash, compare } from "bcrypt";
import config from "../config";

export const encrypt = async (pwd: string) => {
	const salt = await genSalt(config.appConfig.salt);
	return await hash(pwd, salt);
};

export const decrypt = async (pwd: string, hash: string) => {
	return compare(pwd, hash);
};
