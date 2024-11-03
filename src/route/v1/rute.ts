import { Router } from "express";
import ruteAuth from "./rute.auth";
import ruteUser from "./rute.user";
import ruteDoc from "./rute.doc";
import ruteCategory from "./rute.category";
import ruteNews from "./rute.news";

const router = Router();

const rute = [
	{ path: "/auth", route: ruteAuth },
	{ path: "/user", route: ruteUser },
	{ path: "/category", route: ruteCategory },
	{ path: "/news", route: ruteNews },
	{ path: "/docs", route: ruteDoc },
];

rute.forEach((r) => {
	router.use(r.path, r.route);
});
// // docs
// // router.get("/docs", (req, res) => {
// // 	res.sendStatus(200);
// // });
// router.use("/docs", doc);

// // ########## auth endpoint
// // login
// router.post("/login", async (req, res) => {
// 	res.send(req.body);
// });

// // logout
// router.post("/logout");

// // ########## user endpoint
// // user detail
// router.get("/:username");

// // list user
// router.get("/user");

// // create user
// router.post("/user");

// // update user
// router.put("/user/:username");

// // delete user
// router.delete("/user/:username");

// // ####### news endpoint
// // list & search news
// router.get("/news");

// // detail news
// router.get("/news/:id");

// // update news
// router.put("/news/:id");

// // delete news
// router.delete("/news/:id");

// // ######## category endpoint
// // list category
// router.get("/category");

// // create category
// router.post("/category");

// // detail category
// router.get("/category/:id");

// // update category
// router.put("/category/:id");

// // delete category
// router.delete("/category/:id");

export default router;
