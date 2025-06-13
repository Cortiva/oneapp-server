import { Request, Response } from "express";
import logger from "../utils/logger";
import utils from "../utils";
import { employeeService } from "../services/EmployeeService";

class EmployeeController {
  /**
   * Onboard a new employee
   * @param req
   * @param res
   */
  static async onboardEmployee(req: Request, res: Response): Promise<void> {
    const {
      firstName,
      lastName,
      email,
      staffId,
      phoneNumber,
      officeLocation,
      onboardedById,
      role,
      avatar,
    } = req.body;

    const response = await employeeService.onboardEmployee(
      firstName,
      lastName,
      email,
      staffId,
      phoneNumber,
      officeLocation,
      onboardedById,
      role as
        | "DEVELOPER"
        | "DESIGNER"
        | "SALES"
        | "MARKETING"
        | "HUMAN_RESOURCES"
        | "FINANCE",
      avatar
    );

    if (response.success) {
      logger.info(`Employee onboarding was successful: ${email}`);
    } else {
      logger.warn(`Employee onboarding failed: ${email} - ${response.message}`);
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
   * Update existing employee
   * @param req
   * @param res
   */
  static async updateEmployee(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, officeLocation, role } = req.body;

    const response = await employeeService.updateEmployee(
      id,
      firstName,
      lastName,
      phoneNumber,
      officeLocation,
      role as
        | "DEVELOPER"
        | "DESIGNER"
        | "SALES"
        | "MARKETING"
        | "HUMAN_RESOURCES"
        | "FINANCE"
    );

    if (response.success) {
      logger.info(`Employee update was successful`);
    } else {
      logger.warn(`Employee update failed: - ${response.message}`);
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
   * Update employee avatar
   * @param req
   * @param res
   */
  static async updateEmployeeAvatar(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.params;
    const { avatar } = req.body;

    const response = await employeeService.updateEmployeeAvatar(id, avatar);

    if (response.success) {
      logger.info(`Employee avatar update was successful:`);
    } else {
      logger.warn(`Employee avatar update failed: - ${response.message}`);
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
   * Fetch Employee by ID
   * @param req
   * @param res
   */
  static async fetchEmployeeById(req: Request, res: Response): Promise<void> {
    const { employeeId } = req.params;

    const response = await employeeService.getEmployeeById(employeeId);

    if (response.success) {
      logger.info(`Employee: ${employeeId} record fetch was successful`);
    } else {
      logger.warn(
        `Employee: ${employeeId} record fetch failed - ${response.message}`
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
   * Fetch Employees for Admin and IT Manager
   * @param req
   * @param res
   */
  static async fetchEmployees(req: Request, res: Response): Promise<void> {
    const { searchTerm } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await employeeService.getEmployees(
      page,
      limit,
      searchTerm
    );

    if (response.success) {
      logger.info(`Employees fetched was successful`);
    } else {
      logger.warn(`Employees fetched failed - ${response.message}`);
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

export default EmployeeController;
