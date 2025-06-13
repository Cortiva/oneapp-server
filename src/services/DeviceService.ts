import prisma from "../utils/prismaClient";
import utils from "../utils";
import { StatusCodes } from "http-status-codes";
import { ApiResponseBuilder } from "../utils/apiResponse";
import logger from "../utils/logger";

class DeviceService {
  /**
   * Added a new device
   * @param model
   * @param manufacturer
   * @param screenSize
   * @param processor
   * @param ram
   * @param storage
   * @param units
   * @returns
   */
  async addDevice(
    model: string,
    manufacturer: string,
    screenSize: string,
    processor: string,
    ram: number,
    storage: string,
    units: number,
    location: any
  ): Promise<any> {
    try {
      const requiredFields = {
        model: "Device model is required",
        manufacturer: "Device manufacturer is required",
        screenSize: "Device screen size is required",
        processor: "Device processor is required",
        ram: "Device RAM is required",
        storage: "Device storage is required",
        units: "Total units is required",
        location: "Location is required",
      };
      const errors = utils.validateRequiredFields(requiredFields, {
        model,
        manufacturer,
        screenSize,
        processor,
        ram,
        storage,
        units,
        location,
      });

      if (errors.length > 0) {
        return ApiResponseBuilder.error(
          `You have missing required fields`,
          StatusCodes.UNPROCESSABLE_ENTITY,
          errors
        );
      }

      // Check if device already exists
      var exists = await prisma.device.findFirst({
        where: {
          model,
          manufacturer,
          screenSize,
          processor,
          ram,
          storage,
        },
      });

      if (exists) {
        return ApiResponseBuilder.error(
          "This device already exists, kindly update the device total units instead.",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const response = await prisma.device.create({
        data: {
          model,
          manufacturer,
          screenSize,
          processor,
          ram,
          storage,
          totalUnits: units,
          location,
        },
      });

      return ApiResponseBuilder.success(response, "Device added successfully");
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
   * Update existing device
   * @param id
   * @param model
   * @param manufacturer
   * @param screenSize
   * @param processor
   * @param ram
   * @param storage
   * @param units
   * @param location
   * @returns
   */
  async updateDevice(
    id: string,
    model?: string,
    manufacturer?: string,
    screenSize?: string,
    processor?: string,
    ram?: number,
    storage?: string,
    units?: number,
    location?: any
  ): Promise<any> {
    try {
      if (!id) {
        return ApiResponseBuilder.error(
          `ID is required`,
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const exists = await prisma.device.findFirst({
        where: { id },
      });
      if (!exists) {
        return ApiResponseBuilder.error(
          "Device record not found",
          StatusCodes.NOT_FOUND
        );
      }

      const response = await prisma.device.update({
        where: { id },
        data: {
          model,
          manufacturer,
          screenSize,
          processor,
          ram,
          storage,
          totalUnits: units,
          location,
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Device updated successfully"
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
   * Add device images
   * @param id
   * @param images
   * @returns
   */
  async addDeviceImages(id: string, images: string[]): Promise<any> {
    try {
      if (!id) {
        return ApiResponseBuilder.error(
          "Device ID is required",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      if (!images) {
        return ApiResponseBuilder.error(
          "Device images are required",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const exists = await prisma.device.findFirst({
        where: { id },
      });
      if (!exists) {
        return ApiResponseBuilder.error(
          "Device record not found",
          StatusCodes.NOT_FOUND
        );
      }

      const response = await prisma.device.update({
        where: { id },
        data: {
          images,
          updatedAt: new Date(),
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Device images added successfully"
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
   * Add device unites
   * @param id
   * @param unites
   * @returns
   */
  async addDeviceUnits(id: string, units: number): Promise<any> {
    try {
      if (!id) {
        return ApiResponseBuilder.error(
          "Device ID is required",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      if (!units) {
        return ApiResponseBuilder.error(
          "Device units are required",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const exists = await prisma.device.findFirst({
        where: { id },
      });
      if (!exists) {
        return ApiResponseBuilder.error(
          "Device record not found",
          StatusCodes.NOT_FOUND
        );
      }

      const response = await prisma.device.update({
        where: { id },
        data: {
          totalUnits: { increment: units },
          updatedAt: new Date(),
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Device units added successfully"
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
   * Add device unites
   * @param id
   * @param unites
   * @returns
   */
  async deleteDevice(id: string): Promise<any> {
    try {
      if (!id) {
        return ApiResponseBuilder.error(
          "Device ID is required",
          StatusCodes.UNPROCESSABLE_ENTITY
        );
      }

      const exists = await prisma.device.findFirst({
        where: { id },
      });
      if (!exists) {
        return ApiResponseBuilder.error(
          "Device record not found",
          StatusCodes.NOT_FOUND
        );
      }

      const response = await prisma.device.update({
        where: { id },
        data: {
          isDeleted: !!true,
          updatedAt: new Date(),
        },
      });

      return ApiResponseBuilder.success(
        response,
        "Device units deleted successfully"
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
   * Get device by ID
   * @param deviceId
   * @returns
   */
  async getDeviceById(deviceId: string): Promise<any> {
    try {
      const record = await prisma.device.findFirst({
        where: { id: deviceId, isDeleted: false },
      });

      return ApiResponseBuilder.success(
        record,
        "Device fetch was successful",
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
   * Get all Devices - Admin and IT Manager
   * @param page
   * @param limit
   * @param searchTerm
   * @returns
   */
  async getDevices(
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
          { model: { contains: searchTerm, mode: "insensitive" } },
          { manufacturer: { contains: searchTerm, mode: "insensitive" } },
          { screenSize: { contains: searchTerm, mode: "insensitive" } },
          { processor: { contains: searchTerm, mode: "insensitive" } },
          { ram: { contains: searchTerm, mode: "insensitive" } },
          { storage: { contains: searchTerm, mode: "insensitive" } },
          { status: { contains: searchTerm, mode: "insensitive" } },
        ];
      }

      const record = await prisma.device.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      const total = await prisma.device.count({
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
        "Devices fetch was successful",
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

export const deviceService = new DeviceService();
