import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";
import prisma from "../utils/prismaClient";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        accountStatus: string;
        avatar: string;
        role: string;
      };
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First try standard Authorization header
    let token = req.headers.authorization?.split(" ")[1];

    // Fallback for Swagger UI testing
    if (!token && req.headers["x-api-key"]) {
      token = req.headers["x-api-key"] as string;
    }

    if (!token) {
      throw new AppError("Authorization token missing", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        accountStatus: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 401);
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new AppError("User account is not active", 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar!,
      accountStatus: user.accountStatus,
      role: user.role,
    };

    next();
  } catch (error) {
    // Handle JWT errors specifically
    if (error instanceof jwt.JsonWebTokenError) {
      error = new AppError("Invalid token", 401);
    }

    // Use your error handler middleware
    next(error);
  }
};

export const isITManager = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First try standard Authorization header
    let token = req.headers.authorization?.split(" ")[1];

    // Fallback for Swagger UI testing
    if (!token && req.headers["x-api-key"]) {
      token = req.headers["x-api-key"] as string;
    }

    if (!token) {
      throw new AppError("Authorization token missing", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        accountStatus: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 401);
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new AppError("User account is not active", 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar!,
      accountStatus: user.accountStatus,
      role: user.role,
    };

    if (user.role !== "IT_MANAGER") {
      throw new AppError("Patient access required", 403);
    }

    next();
  } catch (error) {
    // Handle JWT errors specifically
    if (error instanceof jwt.JsonWebTokenError) {
      error = new AppError("Invalid token", 401);
    }

    // Use your error handler middleware
    next(error);
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First try standard Authorization header
    let token = req.headers.authorization?.split(" ")[1];

    // Fallback for Swagger UI testing
    if (!token && req.headers["x-api-key"]) {
      token = req.headers["x-api-key"] as string;
    }

    if (!token) {
      throw new AppError("Authorization token missing", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        accountStatus: true,
        role: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 401);
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new AppError("User account is not active", 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar!,
      accountStatus: user.accountStatus,
      role: user.role,
    };

    if (user.role !== "ADMIN") {
      throw new AppError("Admin access required", 403);
    }

    next();
  } catch (error) {
    // Handle JWT errors specifically
    if (error instanceof jwt.JsonWebTokenError) {
      error = new AppError("Invalid token", 401);
    }

    // Use your error handler middleware
    next(error);
  }
};
