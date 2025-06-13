import prisma from "../utils/prismaClient";
import utils from "../utils";
import { StatusCodes } from "http-status-codes";
import { ApiResponseBuilder } from "../utils/apiResponse";
import logger from "../utils/logger";

class EmployeeDeviceService {
  /**
   * Assign a device to an employee
   * @param employeeId
   * @param deviceId
   * @param assignedOn
   * @param assignedById
   * @param remark
   * @returns
   */
  async assignDevice(
    employeeId: string,
    deviceId: string,
    assignedOn: string,
    assignedById: string,
    remark: string
  ): Promise<any> {
    try {
      const requiredFields = {
        employeeId: "Employee ID is required",
        deviceId: "Device ID is required",
        assignedOn: "Assigned on is required",
        assignedById: "AssignedBy Id is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, {
        employeeId,
        deviceId,
        assignedOn,
        assignedById,
      });

      if (errors.length > 0) {
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.UNPROCESSABLE_ENTITY,
          errors
        );
      }

      const device = await prisma.device.findFirst({
        where: { id: deviceId },
      });

      if (device?.totalUnits! < 1) {
        return ApiResponseBuilder.error(
          `No available units for this device`,
          StatusCodes.UNPROCESSABLE_ENTITY,
          errors
        );
      }

      const response = await prisma.employeeDevice.create({
        data: {
          employeeId,
          deviceId,
          assignedOn,
          assignedById,
          remark,
        },
      });

      // Update device count
      await prisma.device.update({
        where: { id: deviceId },
        data: {
          totalUnits: { decrement: 1 },
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Device assignment successfully"
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
   * retrieve a device from an employee
   * @param employeeId
   * @param deviceId
   * @param retrievedOn
   * @param retrievedById
   * @param remark
   * @returns
   */
  async retrieveDevice(
    id: string,
    deviceId: string,
    retrievedOn: string,
    retrievedById: string,
    remark: string
  ): Promise<any> {
    try {
      const requiredFields = {
        id: "ID is required",
        deviceId: "Device ID is required",
        retrievedOn: "Retrieved on is required",
        retrievedById: "RetrievedBy Id is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, {
        id,
        deviceId,
        retrievedOn,
        retrievedById,
      });

      if (errors.length > 0) {
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.UNPROCESSABLE_ENTITY,
          errors
        );
      }

      const device = await prisma.device.findFirst({
        where: { id: deviceId },
      });

      if (!device) {
        return ApiResponseBuilder.error(
          `Device not found`,
          StatusCodes.NOT_FOUND,
          errors
        );
      }

      const employeeDevice = await prisma.employeeDevice.findFirst({
        where: { id, isRetrieved: false },
      });

      if (!employeeDevice) {
        return ApiResponseBuilder.error(
          `Employee device not found`,
          StatusCodes.NOT_FOUND,
          errors
        );
      }

      const response = await prisma.employeeDevice.update({
        where: { id },
        data: {
          isRetrieved: !!true,
          retrievedOn,
          retrievedById,
          remark,
        },
      });

      // Update device count
      await prisma.device.update({
        where: { id: deviceId },
        data: {
          totalUnits: { increment: 1 },
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Device retrieval successfully"
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
   * Get employee device by ID
   * @param id
   * @returns
   */
  async getEmployeeDeviceById(id: string): Promise<any> {
    try {
      const record = await prisma.employeeDevice.findFirst({
        where: { id },
        include: { device: true, assignedBy: true, retrievedBy: true },
      });

      if (!record) {
        return ApiResponseBuilder.error(
          `Record not found`,
          StatusCodes.NOT_FOUND
        );
      }

      return ApiResponseBuilder.success(
        record,
        "record fetch was successful",
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
   * Get all Employee Devices - Admin and IT Manager
   * @param page
   * @param limit
   * @param searchTerm
   * @returns
   */
  async getEmployeeDevices(page: number, limit: number): Promise<any> {
    try {
      // Calculate the number of records to skip
      const skip = (page - 1) * limit;

      const record = await prisma.employeeDevice.findMany({
        include: { device: true, assignedBy: true, retrievedBy: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      const total = await prisma.employeeDevice.count();
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
        "Employee Devices fetch was successful",
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

export const employeeDeviceService = new EmployeeDeviceService();
