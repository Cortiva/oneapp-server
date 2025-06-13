import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../utils/config";
import prisma from "../utils/prismaClient";
import logger from "./logger";

const jwtSecret = config.JWT_SECRET as string;

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

// Standardized response function
const handleResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any,
  errors?: any[]
) => {
  // Log error
  if (status === 500) {
    logger.error(` >> ${errors}`);
  } else {
    logger.warn(` >> ${message}`);
  }
  // log error to console dev
  if (process.env.NODE_ENV === "development") {
    console.log(` >> message: ${message}  \n >> errors: ${errors}`);
  }

  res.status(status).json({
    status,
    message,
    data,
    errors: errors || null,
    stack:
      process.env.NODE_ENV === "development" && errors instanceof Error
        ? errors.stack
        : undefined,
  });
};

// Utility function to validate required fields
const validateRequiredFields = (
  fields: Record<string, string>,
  body: Record<string, any>
) => {
  const errors = [];
  for (const [key, errorMessage] of Object.entries(fields)) {
    if (!body[key]) {
      errors.push(errorMessage);
    }
  }
  return errors;
};

const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 12);
  return encryptedPassword;
};

const isPasswordMatch = async (password: string, userPassword: string) => {
  const result = await bcrypt.compare(password, userPassword);
  return result;
};

const random = () => crypto.randomBytes(128).toString("base64");

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const addMinutesToDate = (minutes: number) => {
  const currentDate = new Date();
  // 1 minute = 60000 milliseconds
  const futureDate = new Date(currentDate.getTime() + minutes * 60000);
  return futureDate;
};

const isTimeInPast = (dateToCheck: Date) => {
  const currentDate = new Date();
  return dateToCheck < currentDate;
};

const hashOtp = (otp: string): string => {
  const hash = crypto.createHash("sha256");
  hash.update(otp);
  return hash.digest("hex");
};

const formatNumber = (number: number): string => {
  const numberWithDecimal = number.toLocaleString("en-US", {
    // style: "currency",
    // currency: "NGN", // You can change the currency code as needed
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return numberWithDecimal;
};

const getCurrentDate = (): string => {
  // Get current date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const day = currentDate.getDate();

  const date = `${year}-${month < 10 ? "0" : ""}${month}-${day}`;

  return date;
};

const getCurrentTime = (): string => {
  // Get current date
  const currentDate = new Date();
  // Get current time
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const time = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  return time;
};

const apiVersion = "/api/v1";

const validateToken = async (
  req: Request,
  res: Response
): Promise<{ status: boolean; message: string; userId: string }> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return {
      status: false,
      message: "Authentication failed: Token not found",
      userId: "",
    };
  }

  try {
    // Check if token is blacklisted
    const blacklisted = await prisma.tokenBlacklist.findUnique({
      where: { token: token },
    });

    if (blacklisted) {
      return {
        status: false,
        message: "Authentication failed: Invalid token",
        userId: "",
      };
    }

    // Verify token (using Promise-based verification)
    const decoded = await new Promise<any>((resolve, reject) => {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            reject(new Error("Token has expired"));
          } else {
            reject(new Error("Invalid token"));
          }
        } else {
          resolve(decoded);
        }
      });
    });

    req.user = decoded;
    return { status: true, message: "Token is valid", userId: decoded.id };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Authentication failed",
      userId: "",
    };
  }
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

const hashToken = (token: string): string => {
  return crypto.createHash("md5").update(token).digest("hex");
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export default {
  handleResponse,
  validateRequiredFields,
  encryptPassword,
  isPasswordMatch,
  generateOtp,
  random,
  addMinutesToDate,
  isTimeInPast,
  hashOtp,
  formatNumber,
  getCurrentTime,
  getCurrentDate,
  validateEmail,
  apiVersion,
  validateToken,
  hashToken,
};
