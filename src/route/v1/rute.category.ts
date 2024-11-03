import { Router } from "express";
import categoryController from "../../controller/category.controller";

const router = Router();

router.route("/").get(categoryController.getCategoryList).post(categoryController.createCategory);
router
	.route("/:id")
	.get(categoryController.getCategoryDetail)
	.put(categoryController.updateCategory)
	.delete(categoryController.deleteCategory);

export default router;
