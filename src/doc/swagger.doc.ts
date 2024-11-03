import { name, author, version } from "../../package.json";
import config from "../config";

const swaggerDef = {
	openapi: "3.0.0",
	info: { title: `${name} API doc`, version: version, author: `${author}` },
	servers: [{ url: `http://localhost:${config.appConfig.port}/v1` }],
};

export default swaggerDef;
