import httpStatus from "http-status";

import { ErrorRequestHandler } from "express";
import ApiError from "../utils/error";

// export default ErrorHandler;
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	let { status, msg } = err;
	if (!err.isOperational) {
		status = httpStatus.INTERNAL_SERVER_ERROR;
		msg = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}
	console.log(res.locals.errMsg);

	res.locals.errorMessage = err.msg;
	const respon = { code: status, message: msg };

	res.status(status).send(respon);
};

export default errorHandler;
