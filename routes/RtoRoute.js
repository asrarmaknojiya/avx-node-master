import express from "express";
import * as RtoController from "../controller/Rto.js";

const router = express.Router();

router.get("/states", RtoController.getAllStates);
router.get("/data/:stateId", RtoController.getAllRtoDataByStateId);

export default router;
