import express from "express";
import generalRoutes from "./generalRoutes";
import userRoutes from "./userRoutes";
import employeeRoutes from "./employeeRoutes";
import deviceRoutes from "./deviceRoutes";
import employeeDeviceRoutes from "./employeeDeviceRoutes";

const router = express.Router();

export default (): express.Router => {
  generalRoutes(router);
  userRoutes(router);
  employeeRoutes(router);
  deviceRoutes(router);
  employeeDeviceRoutes(router);

  return router;
};
