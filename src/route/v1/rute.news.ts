import { Router } from "express";
import newsController from "../../controller/news.controller";

const router = Router();

router.route("/").get(newsController.getNewsList).post(newsController.createNews);
router.route("/:id").get(newsController.getNewsDetail).put(newsController.updateNews).delete(newsController.deleteNews);

export default router;
