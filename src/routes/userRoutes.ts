import express from "express";
import UserController from "../controllers/UserController";
import { isAuthenticated } from "../utils/auth";

export default (router: express.Router) => {
  router.post("/check-email", UserController.checkEmailAvailability);
  router.post("/users/register/admin", UserController.registerAdmin);
  router.post("/users/register/user", UserController.registerUser);
  router.get("/users/otp/send", UserController.sendOtp);
  router.put("/users/otp/verification", UserController.otpVerification);
  router.post(
    "/users/password/initiate-reset",
    UserController.initiatePasswordReset
  );
  router.put("/users/password/change", UserController.changePassword);
  router.post("/users/login", UserController.signIn);
  router.post("/users/logout", UserController.signOut);
  router.put(
    "/users/:userId/update",
    isAuthenticated,
    UserController.updateUser
  );
  router.put(
    "/users/:userId/update-avatar",
    isAuthenticated,
    UserController.updateUserAvatar
  );
  router.get(
    "/users/get/:userId",
    isAuthenticated,
    UserController.fetchUserById
  );
  router.get("/users/all", isAuthenticated, UserController.fetchUsers);
};
