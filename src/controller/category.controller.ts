import { Request, Response, NextFunction } from "express";
import status from "http-status";
import categoryService from "../service/category.service";
import select from "../utils/select";
import ApiError from "../utils/error";

const createCategory = async (req: Request, res: Response) => {
	const { name } = req.body;
	const categoryBaru = await categoryService.createCategory(name);
	res.status(status.CREATED).send(categoryBaru);
};

const getCategoryList = async (req: Request, res: Response) => {
	const filter = select.pick(req.query, ["name"]);
	const option = select.pick(req.query, ["limit", "page"]);
	const result = await categoryService.getCategoryList(filter, option);
	res.status(status.OK).send(result);
};

const getCategoryDetail = async (req: Request, res: Response) => {
	try {
		const category = await categoryService.getCategoryById(req.params.id);
		res.send(category);
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "category not found");
	}
};

const updateCategory = async (req: Request, res: Response) => {
	const updated = await categoryService.editCategory(req.params.id, req.body);
	res.send(updated);
};

const deleteCategory = async (req: Request, res: Response) => {
	await categoryService.deleteCategory(req.params.id);
	res.status(status.NO_CONTENT).send();
};

export default { createCategory, getCategoryDetail, getCategoryList, updateCategory, deleteCategory };
