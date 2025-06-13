import express from "express";
import GeneralController from "../controllers/GeneralController";

export default (router: express.Router) => {
  router.get("/health-check", GeneralController.healthCheck);
};
