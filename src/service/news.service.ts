import status from "http-status";
import prisma from "../client";
import ApiError from "../utils/error";
import { Prisma } from "@prisma/client";
import moment from "moment";

const createNews = async (title: string, detail: Buffer) => {
	if (await getNewsByName(title)) {
		throw new ApiError(status.BAD_REQUEST, "news already exist");
	}
	return prisma.news.create({ data: { title, detail } });
};

const getNewsByName = async (title: string) => {
	try {
		return prisma.news.findUnique({ where: { title } });
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "news not found");
	}
};

const getNewsById = async (id: string) => {
	try {
		return prisma.news.findUnique({ where: { id } });
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "news not found");
	}
};

const getNewsList = async (filter: object, option: { limit?: number; page?: number }) => {
	const page = option.page ?? 1;
	const limit = option.limit ?? 20;
	return await prisma.news.findMany({ where: filter, skip: page * limit, take: limit });
};

const editNews = async (id: string, data: Prisma.NewsUpdateInput) => {
	try {
		if (!(await getNewsById(id))) {
			throw new ApiError(status.NOT_FOUND, "news not found");
		}
		data.updatedAt = moment().toDate();
		return await prisma.news.update({ where: { id }, data: data });
	} catch (error) {
		throw new ApiError(status.BAD_REQUEST, "update gagal");
	}
};

const deleteNews = async (id: string) => {
	try {
		const cat = await getNewsById(id);
		await prisma.news.delete({ where: { id: cat?.id } });
		return cat;
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "not found");
	}
};

export default { createNews, getNewsById, getNewsByName, getNewsList, editNews, deleteNews };
