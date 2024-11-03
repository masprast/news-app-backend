import { Request, Response, NextFunction } from "express";
import status from "http-status";
import newsService from "../service/news.service";
import select from "../utils/select";
import ApiError from "../utils/error";

const createNews = async (req: Request, res: Response) => {
	const { title, detail } = req.body;
	const newsBaru = await newsService.createNews(title, detail);
	res.status(status.CREATED).send(newsBaru);
};

const getNewsList = async (req: Request, res: Response) => {
	const filter = select.pick(req.query, ["name"]);
	const option = select.pick(req.query, ["limit", "page"]);
	const result = await newsService.getNewsList(filter, option);
	res.status(status.OK).send(result);
};

const getNewsDetail = async (req: Request, res: Response) => {
	try {
		const news = await newsService.getNewsById(req.params.id);
		res.send(news);
	} catch (error) {
		throw new ApiError(status.NOT_FOUND, "News not found");
	}
};

const updateNews = async (req: Request, res: Response) => {
	const updated = await newsService.editNews(req.params.id, req.body);
	res.send(updated);
};

const deleteNews = async (req: Request, res: Response) => {
	await newsService.deleteNews(req.params.id);
	res.status(status.NO_CONTENT).send();
};

export default { createNews, getNewsDetail, getNewsList, updateNews, deleteNews };
