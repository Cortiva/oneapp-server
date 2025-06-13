import express from "express";
import EmployeeController from "../controllers/EmployeeController";
import { isAuthenticated, isITManager } from "../utils/auth";

export default (router: express.Router) => {
  router.post(
    "/employees/onboard",
    isITManager,
    EmployeeController.onboardEmployee
  );
  router.put(
    "/employees/:id/update",
    isITManager,
    EmployeeController.updateEmployee
  );
  router.put(
    "/employees/:id/update-avatar",
    isITManager,
    EmployeeController.updateEmployeeAvatar
  );
  router.get(
    "/employees/get/:employeeId",
    isAuthenticated,
    EmployeeController.fetchEmployeeById
  );
  router.get("/employees/all", isITManager, EmployeeController.fetchEmployees);
};
