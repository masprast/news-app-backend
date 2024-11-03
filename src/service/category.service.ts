import status from "http-status";
import prisma from "../client";
import ApiError from "../utils/error";
import { Prisma } from "@prisma/client";
import moment from "moment";

const createCategory = async (name: string) => {
	if (await getCategoryByName(name)) {
		throw new ApiError(status.BAD_REQUEST, "category already exist");
	}
	return prisma.category.create({ data: { name } });
};

const getCategoryByName = async (name: string) => {
	try {
		return prisma.category.findUnique({ where: { name } });
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "category not found");
	}
};

const getCategoryById = async (id: string) => {
	try {
		return prisma.category.findUnique({ where: { id } });
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "category not found");
	}
};

const getCategoryList = async (filter: object, option: { limit?: number; page?: number }) => {
	const page = option.page ?? 1;
	const limit = option.limit ?? 20;
	return await prisma.category.findMany({ where: filter, skip: page * limit, take: limit });
};

const editCategory = async (id: string, data: Prisma.CategoryUpdateInput) => {
	try {
		if (!(await getCategoryById(id))) {
			throw new ApiError(status.NOT_FOUND, "category not found");
		}
		data.updatedAt = moment().toDate();
		return await prisma.category.update({ where: { id }, data: data });
	} catch (error) {
		throw new ApiError(status.BAD_REQUEST, "update gagal");
	}
};

const deleteCategory = async (id: string) => {
	try {
		const cat = await getCategoryById(id);
		await prisma.category.delete({ where: { id: cat?.id } });
		return cat;
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "not found");
	}
};

export default { createCategory, getCategoryById, getCategoryByName, getCategoryList, editCategory, deleteCategory };
