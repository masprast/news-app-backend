import express from "express";
import auth from "../../middleware/auth";
import userController from "../../controller/user.controller";

const router = express.Router();

router
	.route("/")
	.get(auth("getUsers"), userController.getUserList)
	.post(userController.createUser)
	.delete(userController.deleteUser)
	.patch(userController.updateUser);

router.route("/:username").get(userController.getUserDetail);

export default router;
