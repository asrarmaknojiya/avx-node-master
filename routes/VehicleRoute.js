import express from "express";
import { filterVehicleSellRequest, getHomePageVehicles } from "../controller/Vehicle.js";

const router = express.Router();

router.post("/sellVehicle/filter", filterVehicleSellRequest);

router.get("/homePageVehicles", getHomePageVehicles);

export default router;
