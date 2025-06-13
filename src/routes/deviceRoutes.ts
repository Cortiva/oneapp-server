import express from "express";
import DeviceController from "../controllers/DeviceController";
import { isAuthenticated, isITManager } from "../utils/auth";

export default (router: express.Router) => {
  router.post("/devices/add", isITManager, DeviceController.addDevice);
  router.put("/devices/:id/update", isITManager, DeviceController.updateDevice);
  router.put(
    "/devices/:id/images",
    isITManager,
    DeviceController.addDeviceImages
  );
  router.put(
    "/devices/:id/units",
    isITManager,
    DeviceController.addDeviceUnits
  );
  router.delete(
    "/devices/:id/delete",
    isITManager,
    DeviceController.deleteDevice
  );
  router.get(
    "/devices/get/:id",
    isAuthenticated,
    DeviceController.fetchDeviceById
  );
  router.get("/devices/all", isITManager, DeviceController.fetchDevices);
};
