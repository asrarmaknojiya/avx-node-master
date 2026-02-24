import express from "express";
import * as MakerController from "../controller/Makers.js";

const router = express.Router();

// Makers
router.get("/makers", MakerController.getAllMakers);
router.get("/makers/:makerId", MakerController.getMakerById);
router.get("/makers/:makerId/years", MakerController.getModelYearsByMakeId);
router.get("/makers/:makerId/models", MakerController.getAllModelsByMakerId);
router.get("/makers/:makerId/year/:year/models", MakerController.getModelsByMakeIdAndYear);

// Variants
router.get("/model-id/:modelId/year/:year/fuel-type", MakerController.getFuelTypesByModelIdAndYear);
router.get("/transmission-types", MakerController.getTransmissionTypesByModelIdYearAndFuelType);
router.get("/variants", MakerController.getVariantsByModelIdYearFuelAndTransmission);
router.get("/variant-by-id", MakerController.getVariantById);


//for filters
router.get("/search/makers", MakerController.getSearchAllMakers);
// router.get("/search/makers/:makerId/models", MakerController.getAllModelsSearchByMakerId);
router.get("/search/models", MakerController.getAllModelsSearchByMakerId);
// router.get("/search/model-id/:modelId/year/:year/fuel-type", MakerController.getFuelTypesSearchByModelIdAndYear);
router.get("/search/fuel-types", MakerController.getFuelTypesSearchByModelId);
// router.get("/search/transmission-types", MakerController.getTransmissionTypesSearchByModelIdYearAndFuelType);
// router.get("/search/transmission-types", MakerController.getTransmissionTypesSearchByMakerId);
router.get("/search/transmission-types", MakerController.getTransmissionTypesSearchByModelId);
router.get("/search/variants", MakerController.getVariantsByModelIdFuel);
router.get("/search/body-types", MakerController.getBodyTypesSearchByModelId);



export default router;




