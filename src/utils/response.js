import { NextResponse } from "next/server";
import { STATUS_CODES } from "../config/constants.js";

export function successResponse(data = {}, message = "Success", statusCode = STATUS_CODES.OK, meta = {}) {
  const payload = {
    isSuccess: true,
    message,
    data,
    ...(meta.currentPageNo !== undefined ? { currentPageNo: meta.currentPageNo } : {}),
    ...(meta.totalRecords !== undefined ? { totalRecords: meta.totalRecords } : {}),
    ...(meta.totalPages !== undefined ? { totalPages: meta.totalPages } : {})
  };
  return NextResponse.json(payload, { status: statusCode });
}

export function errorResponse(message = "Something went wrong.", statusCode = STATUS_CODES.BAD_REQUEST, errors = null) {
  const payload = {
    isSuccess: false,
    message,
    ...(errors ? { errors } : {})
  };
  return NextResponse.json(payload, { status: statusCode });
}
