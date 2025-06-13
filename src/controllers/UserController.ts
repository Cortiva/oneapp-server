import { Request, Response } from "express";
import { userService } from "../services/UserService";
import logger from "../utils/logger";
import utils from "../utils";

class UserController {
  /**
   * Check if email exists
   * @param req
   * @param res
   */
  static async checkEmailAvailability(
    req: Request,
    res: Response
  ): Promise<void> {
    const { email } = req.body;

    const response = await userService.checkEmailAvailability(email);

    if (response.success) {
      logger.info(`Email validation was successful: ${email}`);
    } else {
      logger.warn(`Email validation failed: ${email} - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Create an admin user
   * @param req
   * @param res
   */
  static async registerAdmin(req: Request, res: Response): Promise<void> {
    const {
      firstName,
      lastName,
      email,
      password,
      staffId,
      phoneNumber,
      officeLocation,
    } = req.body;

    const response = await userService.createAdminUser(
      firstName,
      lastName,
      email,
      password,
      staffId,
      phoneNumber,
      officeLocation
    );

    if (response.success) {
      logger.info(`Request was successful: ${email}`);
    } else {
      logger.warn(`Request failed: ${email} - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Create a new user
   * @param req
   * @param res
   */
  static async registerUser(req: Request, res: Response): Promise<void> {
    const {
      firstName,
      lastName,
      email,
      password,
      staffId,
      phoneNumber,
      officeLocation,
    } = req.body;

    const response = await userService.createUser(
      firstName,
      lastName,
      email,
      password,
      staffId,
      phoneNumber,
      officeLocation
    );

    if (response.success) {
      logger.info(`Request was successful: ${email}`);
    } else {
      logger.warn(`Request failed: ${email} - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Send OTP to user
   * @param req
   * @param res
   */
  static async sendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const response = await userService.sendOtp(email);

    if (response.success) {
      logger.info(`Request was successful: ${email}`);
    } else {
      logger.warn(`Request failed: ${email} - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Initiate password reset
   * @param req
   * @param res
   */
  static async initiatePasswordReset(
    req: Request,
    res: Response
  ): Promise<void> {
    const { email } = req.body;

    const response = await userService.initiatePasswordReset(email);

    if (response.success) {
      logger.info(`Password reset initiate was successful: ${email}`);
    } else {
      logger.warn(
        `Password reset initiate failed: ${email} - ${response.message}`
      );
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Initiate password reset
   * @param req
   * @param res
   */
  static async otpVerification(req: Request, res: Response): Promise<void> {
    const { email, otp, type } = req.body;

    const response = await userService.otpVerification(email, otp, type);

    if (response.success) {
      logger.info(`OTP verification was successful: ${email}`);
    } else {
      logger.warn(`OTP verification failed: ${email} - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Change password
   * @param req
   * @param res
   */
  static async changePassword(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const response = await userService.changePassword(email, password);

    if (response.success) {
      logger.info(`Password change was successful: ${email}`);
    } else {
      logger.warn(`Password change failed: ${email} - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Sign user in
   * @param req
   * @param res
   */
  static async signIn(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const response = await userService.signIn(email, password);

    if (response.success) {
      logger.info(`User sign in was successful: ${email}`);
    } else {
      logger.warn(`User sign in failed: ${email} - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Sign user out
   * @param req
   * @param res
   */
  static async signOut(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];

    const response = await userService.signOut(token!);

    if (response.success) {
      logger.info(`User sign out was successful`);
    } else {
      logger.warn(`User sign out failed - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Update user record
   * @param req
   * @param res
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { firstName, lastName, phoneNumber, officeLocation } = req.body;

    const response = await userService.updateUser(
      userId,
      firstName,
      lastName,
      phoneNumber,
      officeLocation
    );

    if (response.success) {
      logger.info(`User update was successful`);
    } else {
      logger.warn(`User update failed - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Update user avatar
   * @param req
   * @param res
   */
  static async updateUserAvatar(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { avatar } = req.body;

    const response = await userService.updateUserAvatar(userId, avatar);

    if (response.success) {
      logger.info(`User update avatar was successful`);
    } else {
      logger.warn(`User update avatar failed - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Fetch user by ID
   * @param req
   * @param res
   */
  static async fetchUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const response = await userService.getUserById(userId);

    if (response.success) {
      logger.info(`User: ${userId} record fetch was successful`);
    } else {
      logger.warn(`User: ${userId} record fetch failed - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }

  /**
   * Fetch users for Admin
   * @param req
   * @param res
   */
  static async fetchUsers(req: Request, res: Response): Promise<void> {
    const { searchTerm } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await userService.getUsers(page, limit, searchTerm);

    if (response.success) {
      logger.info(`Users fetched was successful`);
    } else {
      logger.warn(`Users fetched failed - ${response.message}`);
    }

    utils.handleResponse(
      res,
      response.statusCode,
      response.message,
      response.data,
      response.errorDetails
    );
  }
}

export default UserController;
