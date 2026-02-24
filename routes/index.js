import express from "express";

import MakersRoute from "./MakersRoute.js";
import RtoRoute from "./RtoRoute.js";
import VehicleRoute from "./VehicleRoute.js";

const router = express.Router();

// Mount them under /api/v1
router.use("/", MakersRoute);
router.use("/rto", RtoRoute);
router.use("/vehicle", VehicleRoute);

export default router;
