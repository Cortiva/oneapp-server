import express from "express";
import EmployeeDeviceController from "../controllers/EmployeeDeviceController";
import { isAuthenticated, isITManager } from "../utils/auth";

export default (router: express.Router) => {
  router.post(
    "/employee/devices/assign",
    isITManager,
    EmployeeDeviceController.assignDevice
  );
  router.put(
    "/employee/devices/:id/retrieve",
    isITManager,
    EmployeeDeviceController.retrieveDevice
  );
  router.get(
    "/employee/devices/get/:id",
    isAuthenticated,
    EmployeeDeviceController.fetchEmployeeDeviceById
  );
  router.get(
    "/employee/devices/all",
    isITManager,
    EmployeeDeviceController.fetchEmployeeDevices
  );
};
