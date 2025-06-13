import { Request, Response } from "express";
import logger from "../utils/logger";
import utils from "../utils";
import { deviceService } from "../services/DeviceService";

class DeviceController {
  /**
   * Add new device
   * @param req
   * @param res
   */
  static async addDevice(req: Request, res: Response): Promise<void> {
    const {
      model,
      manufacturer,
      screenSize,
      processor,
      ram,
      storage,
      units,
      location,
    } = req.body;

    const response = await deviceService.addDevice(
      model,
      manufacturer,
      screenSize,
      processor,
      ram,
      storage,
      units,
      location
    );

    if (response.success) {
      logger.info(`Device addition was successful`);
    } else {
      logger.warn(`Device addition failed - ${response.message}`);
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
   * Update existing device
   * @param req
   * @param res
   */
  static async updateDevice(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const {
      model,
      manufacturer,
      screenSize,
      processor,
      ram,
      storage,
      units,
      location,
    } = req.body;

    const response = await deviceService.updateDevice(
      id,
      model,
      manufacturer,
      screenSize,
      processor,
      ram,
      storage,
      units,
      location
    );

    if (response.success) {
      logger.info(`Device update was successful`);
    } else {
      logger.warn(`Device update failed: - ${response.message}`);
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
   * Update device images
   * @param req
   * @param res
   */
  static async addDeviceImages(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { images } = req.body;

    const response = await deviceService.addDeviceImages(id, images);

    if (response.success) {
      logger.info(`Device images update was successful:`);
    } else {
      logger.warn(`Device images update failed: - ${response.message}`);
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
   * Update device images
   * @param req
   * @param res
   */
  static async addDeviceUnits(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { units } = req.body;

    const response = await deviceService.addDeviceUnits(id, units);

    if (response.success) {
      logger.info(`Device units update was successful:`);
    } else {
      logger.warn(`Device units update failed: - ${response.message}`);
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
   * Update device images
   * @param req
   * @param res
   */
  static async deleteDevice(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await deviceService.deleteDevice(id);

    if (response.success) {
      logger.info(`Device delete was successful:`);
    } else {
      logger.warn(`Device delete failed: - ${response.message}`);
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
   * Fetch Device by ID
   * @param req
   * @param res
   */
  static async fetchDeviceById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const response = await deviceService.getDeviceById(id);

    if (response.success) {
      logger.info(`Device: ${id} record fetch was successful`);
    } else {
      logger.warn(`Device: ${id} record fetch failed - ${response.message}`);
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
  static async fetchDevices(req: Request, res: Response): Promise<void> {
    const { searchTerm } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await deviceService.getDevices(page, limit, searchTerm);

    if (response.success) {
      logger.info(`Devices fetched was successful`);
    } else {
      logger.warn(`Devices fetched failed - ${response.message}`);
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

export default DeviceController;
