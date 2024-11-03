import { UserRole } from "@prisma/client";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env") });

const allRole = { [UserRole.USER]: ["getNews", "getUsers"], [UserRole.ADMIN]: ["getUsers", "manageUsers", "manageNews"] };
const roles = Object.keys(allRole);
const roleRights = new Map(Object.entries(allRole));
const superuser = { name: process.env.ADMIN_USER, pwd: process.env.ADMIN_PWD };
const appConfig = {
	port: process.env.PORT,
	jwt: {
		secret: process.env.JWT_SECRET,
		exp: process.env.JWT_EXP,
		exp_in_days: process.env.JWT_EXP_DAYS,
	},
	salt: Number(process.env.SALT),
};

export default { roles, roleRights, superuser, appConfig };
