import { Request, Response } from "express";

class GeneralController {
  static async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({ message: "Server is healthy" });
  }
}

export default GeneralController;
