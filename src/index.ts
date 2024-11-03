import { Server } from "http";
import prisma from "./client";
import app from "./app";
import config from "./config";

let server: Server;
prisma.$connect().then(() => {
	console.log("konek ke [DB PostgreSQL]");

	server = app.listen(config.appConfig.port, () => console.log(`⚡️[server]: Server is running at https://localhost:3000`));
});

const exitHandler = () => {
	if (server) {
		server.close(() => {
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: unknown) => {
	exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
	if (server) {
		server.close();
	}
});
