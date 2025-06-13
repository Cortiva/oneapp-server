import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import config from "../utils/config";
import utils from "../utils";
import { StatusCodes } from "http-status-codes";
import { ApiResponseBuilder } from "../utils/apiResponse";
import logger from "../utils/logger";
import { emailService } from "./emailService";

class UserService {
  /**
   * Check if email is available
   * @param email
   * @returns
   */
  async checkEmailAvailability(email: string): Promise<any> {
    try {
      // Check if email has been taken by another user
      var emailTaken = await prisma.user.findUnique({
        where: { email: email },
      });

      if (emailTaken) {
        return ApiResponseBuilder.error(
          "Email address already taken by another user",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      return ApiResponseBuilder.success(
        null,
        "Email address available",
        StatusCodes.OK
      );
    } catch (error: any) {
      logger.error(`Failed to confirm email: ${email} availability`);
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Register new admin
   * @param firstName
   * @param lastName
   * @param email
   * @param password
   * @param staffId
   * @param phoneNumber
   * @param officeLocation
   * @returns
   */
  async createAdminUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    staffId: string,
    phoneNumber: string,
    officeLocation: string
  ): Promise<any> {
    try {
      const requiredFields = {
        firstName: "First name is required",
        lastName: "Last name is required",
        email: "Email address is required",
        password: "Password is required",
        staffId: "Staff ID is required",
        phoneNumber: "Phone number is required",
        officeLocation: "Office location is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, {
        firstName,
        lastName,
        email,
        password,
        staffId,
        phoneNumber,
        officeLocation,
      });

      if (errors.length > 0) {
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.UNPROCESSABLE_ENTITY,
          errors
        );
      }

      if (!utils.validateEmail(email)) {
        return ApiResponseBuilder.error(
          `Email address: '${email}' is not valid`,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      // Check if email has been taken by another user
      var emailTaken = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailTaken) {
        return ApiResponseBuilder.error(
          "Email address already taken by another user",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          staffId,
          phoneNumber,
          officeLocation,
          accountStatus: "ACTIVE",
          role: "ADMIN",
        },
      });

      const response = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return ApiResponseBuilder.success(response, "User created successfully");
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Register new user
   * @param firstName
   * @param lastName
   * @param email
   * @param password
   * @param role
   * @param res
   */
  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    staffId: string,
    phoneNumber: string,
    officeLocation: string
  ): Promise<any> {
    try {
      const requiredFields = {
        firstName: "First name is required",
        lastName: "Last name is required",
        email: "Email address is required",
        password: "Password is required",
        staffId: "Staff ID is required",
        phoneNumber: "Phone number is required",
        officeLocation: "Office location is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, {
        firstName,
        lastName,
        email,
        password,
        staffId,
        phoneNumber,
        officeLocation,
      });

      if (errors.length > 0) {
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.UNPROCESSABLE_ENTITY,
          errors
        );
      }

      if (!utils.validateEmail(email)) {
        return ApiResponseBuilder.error(
          `Email address: '${email}' is not valid`,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      // Check if email has been taken by another user
      var emailTaken = await prisma.user.findUnique({
        where: { email: email },
      });

      if (emailTaken) {
        return ApiResponseBuilder.error(
          "Email address already taken by another user",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      const otp = utils.generateOtp();
      const otpExpirationTime = utils.addMinutesToDate(5);

      // register user after sending email
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          staffId,
          phoneNumber,
          officeLocation,
          accountStatus: "INACTIVE",
          verificationCode: utils.hashOtp(otp),
          verificationCodeExpiresAt: otpExpirationTime,
          role: "IT_MANAGER",
        },
      });

      // Send email to user with OTP for account validation
      await emailService.sendVerificationEmail(
        "welcome",
        "Welcome!!!",
        `${firstName} ${lastName}`,
        email,
        otp
      );

      const response = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      return ApiResponseBuilder.success(response, "User created successfully");
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Send OTP to user email
   * @param email
   * @returns result
   */
  async sendOtp(email: string): Promise<any> {
    try {
      const requiredFields = {
        email: "Email address is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, { email });

      if (errors.length > 0) {
        logger.error(
          `You have missing required fields`,
          StatusCodes.NOT_FOUND,
          errors
        );
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.NOT_FOUND,
          errors
        );
      }

      // Check if record exists
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return ApiResponseBuilder.error(
          `The provided email address does not belong to any user`,
          StatusCodes.NOT_FOUND
        );
      }

      const otp = utils.generateOtp();
      const otpExpirationTime = utils.addMinutesToDate(5);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          verificationCode: utils.hashOtp(otp),
          verificationCodeExpiresAt: otpExpirationTime,
        },
      });

      // Send email to user with OTP for account validation
      await emailService.sendVerificationEmail(
        "accountVerification",
        "Account Verification",
        `${user.firstName} ${user.lastName}`,
        user.email,
        otp
      );

      return ApiResponseBuilder.success(`OTP successfully sent to: ${email}`);
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Initiate Password Reset
   * @param email
   * @returns result
   */
  async initiatePasswordReset(email: string): Promise<any> {
    try {
      const requiredFields = {
        email: "Email address is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, { email });

      if (errors.length > 0) {
        logger.error(
          `You have missing required fields`,
          StatusCodes.NOT_FOUND,
          errors
        );
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.NOT_FOUND,
          errors
        );
      }

      // Check if record exists
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return ApiResponseBuilder.error(
          `The provided email address does not belong to any user`,
          StatusCodes.NOT_FOUND
        );
      }

      const otp = utils.generateOtp();
      const otpExpirationTime = utils.addMinutesToDate(5);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          verificationCode: utils.hashOtp(otp),
          verificationCodeExpiresAt: otpExpirationTime,
        },
      });

      // Send email to user with OTP for account validation
      await emailService.sendPasswordResetEmail(
        "passwordReset",
        "Initiated Password Reset",
        `${user.firstName} ${user.lastName}`,
        user.email,
        otp
      );

      return ApiResponseBuilder.success(`OTP successfully sent to: ${email}`);
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Validate OTP
   * @param email
   * @param otp
   * @returns
   */
  async otpVerification(
    email: string,
    otp: string,
    type: "ONBOARDING" | "PASSWORD"
  ): Promise<any> {
    try {
      const requiredFields = {
        email: "Email address is required",
        otp: "OTP is required",
        type: "Verification type is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, {
        email,
        otp,
        type,
      });

      if (errors.length > 0) {
        logger.error(
          `You have missing required fields`,
          StatusCodes.NOT_FOUND,
          errors
        );
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.NOT_FOUND,
          errors
        );
      }

      // Check if record exists
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return ApiResponseBuilder.error(
          "Record not found. Nothing to verify",
          StatusCodes.NOT_FOUND
        );
      }

      const hashedOtp = utils.hashOtp(otp);
      if (type === "ONBOARDING") {
        if (user.verificationCode !== hashedOtp) {
          return ApiResponseBuilder.error(
            "Provided OTP is invalid",
            StatusCodes.UNPROCESSABLE_ENTITY
          );
        }

        // check if OTP is expired
        const isInPast = utils.isTimeInPast(user.verificationCodeExpiresAt!);

        if (isInPast) {
          return ApiResponseBuilder.error(
            `Provided OTP has expired ::: ${user.verificationCodeExpiresAt!}`,
            StatusCodes.UNPROCESSABLE_ENTITY
          );
        }
      } else {
        if (user.verificationCode !== hashedOtp) {
          return ApiResponseBuilder.error(
            "Provided OTP is invalid",
            StatusCodes.UNPROCESSABLE_ENTITY
          );
        }

        // check if OTP is expired
        const isInPast = utils.isTimeInPast(user.verificationCodeExpiresAt!);

        if (isInPast) {
          return ApiResponseBuilder.error(
            `Provided OTP has expired ::: ${user.verificationCodeExpiresAt!}`,
            StatusCodes.UNPROCESSABLE_ENTITY
          );
        }
      }

      // Update user record
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          accountStatus: "ACTIVE",
          isActive: !!true,
        },
      });

      return ApiResponseBuilder.success("Validation was successful");
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Change password
   * @param email
   * @param password
   * @returns
   */
  async changePassword(email: string, password: string): Promise<any> {
    try {
      const requiredFields = {
        email: "Email address is required",
        password: "Password is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, {
        email,
        password,
      });

      if (errors.length > 0) {
        logger.error(
          `You have missing required fields`,
          StatusCodes.NOT_FOUND,
          errors
        );
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.NOT_FOUND,
          errors
        );
      }
      // Fetch user from the database
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return ApiResponseBuilder.error(
          `User not found :::: ${email}`,
          StatusCodes.NOT_FOUND
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 8);

      // Update password in the database
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, updatedAt: new Date() },
      });

      // Send email to user confirming password change
      await emailService.sendPasswordChangedEmail(
        "passwordChanged",
        "Password Changed",
        `${user.firstName} ${user.lastName}`,
        user.email,
        new Date().toString()
      );

      return ApiResponseBuilder.success("Password change was  successful");
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Sign user in
   * @param email
   * @param password
   * @returns
   */
  async signIn(email: string, password: string): Promise<any> {
    try {
      logger.info(`Email: ${email}, Password: ${password}`);
      if (!email || !password) {
        return ApiResponseBuilder.error(
          "Email and password are required",
          StatusCodes.UNAUTHORIZED
        );
      }

      // Check if account status okay to use
      const userSuspended = await prisma.user.findFirst({
        where: {
          email: email,
          accountStatus: "SUSPENDED",
        },
      });

      if (userSuspended) {
        return ApiResponseBuilder.error(
          "This account has been suspended, please contact support for reactivation.",
          StatusCodes.FORBIDDEN
        );
      }

      const userData = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          accountStatus: true,
          createdAt: true,
          avatar: true,
          lastLogin: true,
          role: true,
          isActive: true,
          staffId: true,
          phoneNumber: true,
          officeLocation: true,
        },
      });

      if (!userData) {
        return ApiResponseBuilder.error(
          "Invalid Email or password",
          StatusCodes.UNAUTHORIZED
        );
      }

      const user = await prisma.user.update({
        where: { email },
        data: {
          lastLogin: new Date(),
        },
      });

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return ApiResponseBuilder.error(
          "Invalid Email or password",
          StatusCodes.UNAUTHORIZED
        );
      }

      const jwtSecret = config.JWT_SECRET as string;

      const jwtData = {
        id: userData?.id,
        role: userData?.role,
      };

      const token = jwt.sign(jwtData, jwtSecret, { expiresIn: "7d" });

      // Encrypt the token
      const responseData = {
        user: userData,
        token,
      };

      return ApiResponseBuilder.success(responseData, "Login successful");
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Sign user out
   * @param token
   * @returns
   */
  async signOut(token: string): Promise<any> {
    try {
      // Handle missing token
      if (!token) {
        return ApiResponseBuilder.error(
          "Token is required for sign out",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const hashToken = utils.hashToken(token);

      // Add token to the blacklist
      await prisma.tokenBlacklist.create({
        data: { token: hashToken },
      });

      return ApiResponseBuilder.success("Log out was successful");
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Update existing user
   * @param userId
   * @param firstName
   * @param lastName
   * @param phoneNumber
   * @param officeLocation
   */
  async updateUser(
    userId: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    officeLocation?: string
  ): Promise<any> {
    try {
      // Update record
      const response = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          phoneNumber,
          officeLocation,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          accountStatus: true,
          createdAt: true,
          avatar: true,
          lastLogin: true,
          role: true,
          isActive: true,
          staffId: true,
          phoneNumber: true,
          officeLocation: true,
        },
      });

      return ApiResponseBuilder.success(response, "User update was successful");
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Update existing user avatar
   * @param userId
   * @param avatar
   */
  async updateUserAvatar(userId: string, avatar: string): Promise<any> {
    try {
      // Update record
      const response = await prisma.user.update({
        where: { id: userId },
        data: {
          avatar: avatar,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          accountStatus: true,
          createdAt: true,
          avatar: true,
          lastLogin: true,
          role: true,
          isActive: true,
          staffId: true,
          phoneNumber: true,
          officeLocation: true,
        },
      });

      return ApiResponseBuilder.success(
        response,
        "User avatar update was successful"
      );
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Get user by ID
   * @param userId
   * @returns
   */
  async getUserById(userId: string): Promise<any> {
    try {
      const record = await prisma.user.findFirst({
        where: {
          id: userId,
          accountStatus: {
            not: "SUSPENDED",
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          accountStatus: true,
          createdAt: true,
          avatar: true,
          lastLogin: true,
          role: true,
          isActive: true,
          staffId: true,
          phoneNumber: true,
          officeLocation: true,
        },
      });

      return ApiResponseBuilder.success(
        record,
        "User fetch was successful",
        StatusCodes.OK
      );
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }

  /**
   * Get all users - Admin
   * @param page
   * @param limit
   * @param searchTerm
   * @returns
   */
  async getUsers(
    page: number,
    limit: number,
    searchTerm: string
  ): Promise<any> {
    try {
      // Calculate the number of records to skip
      const skip = (page - 1) * limit;

      // Base where clause
      const where: any = {
        isDeleted: false,
      };

      // Add search condition if searchTerm is provided
      if (searchTerm) {
        where.OR = [
          { firstName: { contains: searchTerm, mode: "insensitive" } },
          { lastName: { contains: searchTerm, mode: "insensitive" } },
          { accountStatus: { contains: searchTerm, mode: "insensitive" } },
          { role: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ];
      }

      const record = await prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          accountStatus: true,
          createdAt: true,
          avatar: true,
          lastLogin: true,
          role: true,
          isActive: true,
          staffId: true,
          phoneNumber: true,
          officeLocation: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      const totalUsers = await prisma.user.count({
        where,
      });
      const pagination = {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      };

      const response = {
        data: record,
        pagination,
      };

      return ApiResponseBuilder.success(
        response,
        "Users fetch was successful",
        StatusCodes.OK
      );
    } catch (error: any) {
      logger.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
      return ApiResponseBuilder.error(
        "Request failed",
        StatusCodes.INTERNAL_SERVER_ERROR,
        process.env.NODE_ENV === "development" ? [error.message] : undefined
      );
    }
  }
}

export const userService = new UserService();
