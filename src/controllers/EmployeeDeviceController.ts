import { Request, Response } from "express";
import logger from "../utils/logger";
import utils from "../utils";
import { employeeDeviceService } from "../services/EmployeeDeviceService";

class EmployeeDeviceController {
  /**
   * Assign new device
   * @param req
   * @param res
   */
  static async assignDevice(req: Request, res: Response): Promise<void> {
    const { employeeId, deviceId, assignedOn, assignedById, remark } = req.body;

    const response = await employeeDeviceService.assignDevice(
      employeeId,
      deviceId,
      assignedOn,
      assignedById,
      remark
    );

    if (response.success) {
      logger.info(`Employee device assignment was successful`);
    } else {
      logger.warn(`Employee device assignment failed - ${response.message}`);
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
   * Retrieve an existing employee device
   * @param req
   * @param res
   */
  static async retrieveDevice(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { deviceId, retrievedOn, retrievedById, remark } = req.body;

    const response = await employeeDeviceService.retrieveDevice(
      id,
      deviceId,
      retrievedOn,
      retrievedById,
      remark
    );

    if (response.success) {
      logger.info(`Employee device retrieval was successful`);
    } else {
      logger.warn(`Employee device retrieval failed: - ${response.message}`);
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
   * Fetch Employee Device by ID
   * @param req
   * @param res
   */
  static async fetchEmployeeDeviceById(
    req: Request,
    res: Response
  ): Promise<void> {
    const { id } = req.params;

    const response = await employeeDeviceService.getEmployeeDeviceById(id);

    if (response.success) {
      logger.info(`Employee Device: ${id} record fetch was successful`);
    } else {
      logger.warn(
        `Employee Device: ${id} record fetch failed - ${response.message}`
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
   * Fetch Devices for Admin and IT Manager
   * @param req
   * @param res
   */
  static async fetchEmployeeDevices(
    req: Request,
    res: Response
  ): Promise<void> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await employeeDeviceService.getEmployeeDevices(
      page,
      limit
    );

    if (response.success) {
      logger.info(`Employee Devices fetched was successful`);
    } else {
      logger.warn(`Employee Devices fetched failed - ${response.message}`);
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

export default EmployeeDeviceController;
