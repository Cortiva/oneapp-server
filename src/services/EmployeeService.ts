import prisma from "../utils/prismaClient";
import utils from "../utils";
import { StatusCodes } from "http-status-codes";
import { ApiResponseBuilder } from "../utils/apiResponse";
import logger from "../utils/logger";

class EmployeeService {
  /**
   * Onboard a new employee
   * @param firstName
   * @param lastName
   * @param email
   * @param staffId
   * @param phoneNumber
   * @param officeLocation
   * @param onboardedById
   * @param role
   * @param avatar
   * @returns
   */
  async onboardEmployee(
    firstName: string,
    lastName: string,
    email: string,
    staffId: string,
    phoneNumber: string,
    officeLocation: string,
    onboardedById: string,
    role:
      | "DEVELOPER"
      | "DESIGNER"
      | "SALES"
      | "MARKETING"
      | "HUMAN_RESOURCES"
      | "FINANCE",
    avatar?: string
  ): Promise<any> {
    try {
      const requiredFields = {
        firstName: "First name is required",
        lastName: "Last name is required",
        email: "Email address is required",
        staffId: "Staff ID is required",
        phoneNumber: "Phone number is required",
        officeLocation: "Office location is required",
        onboardedById: "Onboarded by ID is required",
        role: "Role is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, {
        firstName,
        lastName,
        email,
        staffId,
        phoneNumber,
        officeLocation,
        onboardedById,
        role,
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
          "Email address already belongs to another employee",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const response = await prisma.employee.create({
        data: {
          firstName,
          lastName,
          email,
          staffId,
          phoneNumber,
          officeLocation,
          onboardedById,
          role,
          avatar,
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Employee onboarded successfully"
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
   * Update existing employee record
   * @param id
   * @param firstName
   * @param lastName
   * @param phoneNumber
   * @param officeLocation
   * @param role
   * @returns
   */
  async updateEmployee(
    id: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    officeLocation?: string,
    role?:
      | "DEVELOPER"
      | "DESIGNER"
      | "SALES"
      | "MARKETING"
      | "HUMAN_RESOURCES"
      | "FINANCE"
  ): Promise<any> {
    try {
      if (!id) {
        return ApiResponseBuilder.error(
          "Employee ID is required",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const exists = await prisma.employee.findFirst({
        where: { id },
      });
      if (!exists) {
        return ApiResponseBuilder.error(
          "Employee record not found",
          StatusCodes.NOT_FOUND
        );
      }

      const response = await prisma.employee.update({
        where: { id },
        data: {
          firstName,
          lastName,
          phoneNumber,
          officeLocation,
          role,
          updatedAt: new Date(),
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Employee record update successfully"
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
   * Update existing employee avatar
   * @param id
   * @param avatar
   * @returns
   */
  async updateEmployeeAvatar(id: string, avatar: string): Promise<any> {
    try {
      if (!id) {
        return ApiResponseBuilder.error(
          "Employee ID is required",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      if (!avatar) {
        return ApiResponseBuilder.error(
          "Employee avatar is required",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const exists = await prisma.employee.findFirst({
        where: { id },
      });
      if (!exists) {
        return ApiResponseBuilder.error(
          "Employee record not found",
          StatusCodes.NOT_FOUND
        );
      }

      const response = await prisma.employee.update({
        where: { id },
        data: {
          avatar,
          updatedAt: new Date(),
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Employee record update successfully"
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
   * Get employee by ID
   * @param employeeId
   * @returns
   */
  async getEmployeeById(employeeId: string): Promise<any> {
    try {
      const record = await prisma.employee.findFirst({
        where: { id: employeeId },
        select: {
          id: true,
          staffId: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          officeLocation: true,
          role: true,
          onboardingDate: true,
          onboardedBy: true,
          avatar: true,
          createdAt: true,
          devices: true,
        },
      });

      return ApiResponseBuilder.success(
        record,
        "Employee fetch was successful",
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
   * Get all Employees - Admin and IT Manager
   * @param page
   * @param limit
   * @param searchTerm
   * @returns
   */
  async getEmployees(
    page: number,
    limit: number,
    searchTerm: string
  ): Promise<any> {
    try {
      // Calculate the number of records to skip
      const skip = (page - 1) * limit;

      // Base where clause
      const where: any = {};

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

      const record = await prisma.employee.findMany({
        where,
        select: {
          id: true,
          staffId: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          officeLocation: true,
          role: true,
          onboardingDate: true,
          onboardedBy: true,
          avatar: true,
          createdAt: true,
          devices: {
            include: {
              device: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      const total = await prisma.employee.count({
        where,
      });
      const pagination = {
        total: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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

export const employeeService = new EmployeeService();
