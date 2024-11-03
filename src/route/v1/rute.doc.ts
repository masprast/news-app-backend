import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import swaggerDef from "../../doc/swagger.doc";

const router = express.Router();

const def = swaggerJSDoc({ swaggerDefinition: swaggerDef, apis: ["src/route/v1/*.ts"] });

router.use("/", swaggerUI.serve);
router.get("/", swaggerUI.setup(def, { explorer: true }));

export default router;
