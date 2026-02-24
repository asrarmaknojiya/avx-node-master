import { successResponse, errorResponse, paginatedResponse } from "../utils/response.util.js";
import Maker from "../models/MakerModel.js";
import Model from "../models/ModelModel.js";
import Variant from "../models/VariantModel.js";

// GET all makers with pagination and sorting
export const getAllMakers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "display_order";
        const sortDir = req.query.sortDir === "desc" ? -1 : 1;

        const makers = await Maker.find(
            {},
            {
                make_id: 1,
                logo: 1,
                make_name: 1,
                make_display: 1,
                status: 1,
            }
        )
            .sort({ [sortBy]: sortDir })
            .skip(skip)
            .limit(limit);

        const formattedMakers = makers.map(maker => ({
            makeId: maker.make_id,
            logo: maker.logo,
            makeName: maker.make_name,
            makeDisplay: maker.make_display,
            status: maker.status
        }));

        const totalCount = await Maker.countDocuments();

        return paginatedResponse(res, "Makers fetched successfully", formattedMakers, page, limit, totalCount);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

// GET maker by ID
export const getMakerById = async (req, res) => {
    const id = parseInt(req.params.makerId);
    try {
        const maker = await Maker.findOne(
            { make_id: id },
            { make_id: 1, logo: 1, make_name: 1, make_display: 1, status: 1 }
        );

        if (!maker) return errorResponse(res, "Maker not found", null, 404);

        const formattedMaker = {
            makeId: maker.make_id,
            logo: maker.logo,
            makeName: maker.make_name,
            makeDisplay: maker.make_display,
            status: maker.status
        };

        return successResponse(res, "Maker fetched successfully", formattedMaker, null, 200);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

// GET model years by makerId
export const getModelYearsByMakeId = async (req, res) => {
    const makeId = parseInt(req.params.makerId);

    try {
        const models = await Model.find({ make_id: makeId }, { years: 1, _id: 0 });
        const yearsArray = models.map(m => m.years);
        const uniqueYears = [...new Set(yearsArray)].sort((a, b) => a - b);

        return successResponse(res, "Model years fetched successfully", uniqueYears, null, 200);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

// GET all models by makerId with pagination/sorting
export const getAllModelsByMakerId = async (req, res) => {
    const makeId = parseInt(req.params.makerId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "modelDisplayName";
    const sortDir = req.query.sortDir === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    try {
        const modelsData = await Model.find(
            { make_id: makeId },
            { "models.model_id": 1, "models.model_name": 1, "models.model_display": 1, _id: 0 }
        );

        let models = modelsData.flatMap(m =>
            m.models.map(mod => ({
                modelId: mod.model_id,
                modelName: mod.model_name,
                modelDisplayName: mod.model_display,
            }))
        );

        models = Array.from(new Map(models.map(m => [m.modelId, m])).values());

        models.sort((a, b) => {
            const fieldA = a[sortBy]?.toString().toLowerCase() || "";
            const fieldB = b[sortBy]?.toString().toLowerCase() || "";
            if (fieldA < fieldB) return -1 * sortDir;
            if (fieldA > fieldB) return 1 * sortDir;
            return 0;
        });

        const paginatedModels = models.slice(skip, skip + limit);

        return paginatedResponse(res, "Models fetched successfully", paginatedModels, page, limit, models.length);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

// GET models by makerId & year with pagination/sorting
export const getModelsByMakeIdAndYear = async (req, res) => {
    const makeId = parseInt(req.params.makerId);
    const year = parseInt(req.params.year);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "modelDisplay";
    const sortDir = req.query.sortDir === "desc" ? -1 : 1;
    const skip = (page - 1) * limit;

    try {
        const modelsData = await Model.find({ make_id: makeId, years: year }, { models: 1, _id: 0 });

        if (!modelsData || modelsData.length === 0) {
            return errorResponse(res, "Models not found for this makerId and year", null, 404);
        }

        let models = modelsData.flatMap(m =>
            m.models.map(mod => ({
                modelId: mod.model_id,
                makeId: mod.make_id,
                modelName: mod.model_name,
                modelDisplay: mod.model_display,
                bodyType: mod.body_type,
            }))
        );

        models = Array.from(new Map(models.map(m => [m.modelId, m])).values());

        models.sort((a, b) => {
            const fieldA = a[sortBy]?.toString().toLowerCase() || "";
            const fieldB = b[sortBy]?.toString().toLowerCase() || "";
            if (fieldA < fieldB) return -1 * sortDir;
            if (fieldA > fieldB) return 1 * sortDir;
            return 0;
        });

        const paginatedModels = models.slice(skip, skip + limit);

        return paginatedResponse(res, "Models fetched successfully", paginatedModels, page, limit, models.length);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

// GET fuel types
export const getFuelTypesByModelIdAndYear = async (req, res) => {
    const { modelId, year } = req.params;

    try {
        const variantData = await Variant.find({ model_id: parseInt(modelId), year: parseInt(year) });

        if (!variantData || variantData.length === 0) {
            return successResponse(res, "No variants found for this modelId and year", [], null, 200);
        }

        const detailsMap = variantData[0].details;
        const fuelTypes = Array.from(detailsMap.keys());

        return successResponse(res, "Fuel types fetched successfully", fuelTypes, null, 200);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

// GET transmission types
export const getTransmissionTypesByModelIdYearAndFuelType = async (req, res) => {
    const { modelId, year, fuelType } = req.query;

    try {
        if (!modelId || !year || !fuelType) {
            return errorResponse(res, "modelId, year and fuelType are required", null, 400);
        }

        const variantData = await Variant.findOne({
            model_id: parseInt(modelId),
            year: parseInt(year),
        });

        if (!variantData) return errorResponse(res, "VariantModel not found", null, 404);

        const fuelDetails = variantData.details.get(fuelType);

        if (!fuelDetails) return errorResponse(res, "Fuel type not found", null, 404);

        const transmissionTypes = fuelDetails.map(f => f.title);

        return successResponse(res, "Transmission types fetched successfully", transmissionTypes, null, 200);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

// GET variants
export const getVariantsByModelIdYearFuelAndTransmission = async (req, res) => {
    const {
        modelId,
        year,
        fuelType,
        transmissionType,
        page = 1,
        limit = 10,
        sortBy = "variantName",
        sortDir = "asc",
    } = req.query;

    try {
        if (!modelId || !year || !fuelType || !transmissionType) {
            return errorResponse(res, "All query params are required", null, 400);
        }

        const variantData = await Variant.findOne({
            model_id: parseInt(modelId),
            year: parseInt(year),
        });

        if (!variantData) return errorResponse(res, "VariantModel not found", null, 404);

        const fuelDetails = variantData.details.get(fuelType);

        if (!fuelDetails) return errorResponse(res, "Fuel type not found", null, 404);

        let variants = fuelDetails
            .filter(f => f.title === transmissionType)
            .flatMap(f => f.variants)
            .map(v => ({
                variantId: v.variant_id,
                modelId: v.model_id,
                variantName: v.variant_name,
                variantDisplayName: v.variant_display_name,
                transportationCategory: v.transportation_category,
                transmissionType: v.transmission_type,
                fuelType: v.fuel_type,
                exShowroomPrice: v.ex_showroom_price || null,
            }));

        if (variants.length === 0) return errorResponse(res, "No variants found", null, 404);

        const direction = sortDir.toLowerCase() === "desc" ? -1 : 1;

        variants.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1 * direction;
            if (a[sortBy] > b[sortBy]) return 1 * direction;
            return 0;
        });

        const pageNum = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const startIndex = (pageNum - 1) * pageSize;

        const paginatedVariants = variants.slice(startIndex, startIndex + pageSize);

        return paginatedResponse(res, "Variants fetched successfully", paginatedVariants, pageNum, pageSize, variants.length);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};

// GET variant by ID
export const getVariantById = async (req, res) => {
    const { modelId, year, fuelType, variantId } = req.query;

    try {
        if (!modelId || !year || !fuelType || !variantId) {
            return errorResponse(res, "All query params are required", null, 400);
        }

        const variantData = await Variant.findOne({
            model_id: parseInt(modelId),
            year: parseInt(year),
        });

        if (!variantData) return errorResponse(res, "VariantModel not found", null, 404);

        const fuelDetails = variantData.details.get(fuelType);

        if (!fuelDetails) return errorResponse(res, "Fuel type not found", null, 404);

        const variant = fuelDetails
            .flatMap(f => f.variants)
            .find(v => v.variant_id === parseInt(variantId));

        if (!variant) return errorResponse(res, "Variant not found", null, 404);

        const formattedVariant = {
            variantId: variant.variant_id,
            modelId: variant.model_id,
            variantName: variant.variant_name,
            variantDisplayName: variant.variant_display_name,
            transportationCategory: variant.transportation_category,
            transmissionType: variant.transmission_type,
            fuelType: variant.fuel_type,
            exShowroomPrice: variant.ex_showroom_price || null,
        };

        return successResponse(res, "Variant fetched successfully", formattedVariant, null, 200);
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};









/////for filter search




export const getSearchAllMakers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "display_order";
        const sortDir = req.query.sortDir === "desc" ? -1 : 1;
        const search = req.query.search?.trim();

        let filter = {};

        if (search) {
            filter.make_name = { $regex: search, $options: "i" };
        }

        const makers = await Maker.find(
            filter,
            {
                make_id: 1,
                logo: 1,
                make_name: 1,
                make_display: 1,
                status: 1,
            }
        )
            .sort({ [sortBy]: sortDir })
            .skip(skip)
            .limit(limit);

        const formattedMakers = makers.map(maker => ({
            makeId: maker.make_id,
            logo: maker.logo,
            makeName: maker.make_name,
            makeDisplay: maker.make_display,
            status: maker.status,
        }));

        const totalCount = await Maker.countDocuments(filter);

        return paginatedResponse(
            res,
            "Makers fetched successfully",
            formattedMakers,
            page,
            limit,
            totalCount
        );
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};




export const getAllModelsSearchByMakerId = async (req, res) => {
    try {
        const makeIdRaw = req.query.makerId;
        const makeId = makeIdRaw ? parseInt(makeIdRaw) : null;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || "modelDisplayName";
        const sortDir = req.query.sortDir === "desc" ? -1 : 1;

        const search = req.query.search?.trim();

        const baseQuery = makeId ? { make_id: makeId } : {};

        const modelsData = await Model.find(
            baseQuery,
            {
                "models.model_id": 1,
                "models.model_name": 1,
                "models.model_display": 1,
                _id: 0,
            }
        );

        let models = modelsData.flatMap(m =>
            (m.models || []).map(mod => ({
                modelId: mod.model_id,
                modelName: mod.model_name,
                modelDisplayName: mod.model_display,
            }))
        );

       
        if (search) {
            const searchLower = search.toLowerCase();
            models = models.filter(m =>
                m.modelName?.toLowerCase().includes(searchLower)
            );
        }

        
        models = Array.from(
            new Map(models.map(m => [m.modelId, m])).values()
        );

       
        models.sort((a, b) => {
            const fieldA = a[sortBy]?.toString().toLowerCase() || "";
            const fieldB = b[sortBy]?.toString().toLowerCase() || "";

            if (fieldA < fieldB) return -1 * sortDir;
            if (fieldA > fieldB) return 1 * sortDir;
            return 0;
        });

       
        const paginatedModels = models.slice(skip, skip + limit);

        return paginatedResponse(
            res,
            "Models fetched successfully",
            paginatedModels,
            page,
            limit,
            models.length
        );
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};






export const getFuelTypesSearchByModelId = async (req, res) => {
    try {
        const modelIdRaw = req.query.modelId;
        const modelId = modelIdRaw ? parseInt(modelIdRaw) : null;

        const search = req.query.search?.trim();

        const baseQuery = modelId ? { model_id: modelId } : {};

        const variantData = await Variant.find(baseQuery);

        let fuelTypes = variantData.flatMap(v =>
            Array.from(v?.details?.keys?.() || [])
        );

        
        fuelTypes = [...new Set(fuelTypes.map(f => f?.toString().trim()).filter(Boolean))];

        
        if (search) {
            const searchLower = search.toLowerCase();
            fuelTypes = fuelTypes.filter(fuel =>
                fuel.toLowerCase().includes(searchLower)
            );
        }

        if (!modelId) {
            fuelTypes = fuelTypes.slice(0, 6);
        }

        return successResponse(
            res,
            "Fuel types fetched successfully",
            fuelTypes,
            null,
            200
        );
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};



// GET transmission types
export const getTransmissionTypesSearchByModelId = async (req, res) => {
    try {
       
        const modelIdRaw = req.query.modelId;
        const modelId = modelIdRaw ? parseInt(modelIdRaw) : null;

        
        const search = req.query.search?.trim();

       
        const variantQuery = modelId ? { model_id: modelId } : {};

  
        const variantData = await Variant.find(variantQuery);

        
        let transmissionTypes = [];

        for (const v of variantData) {
            if (!v.details) continue;

            for (const fuelArr of v.details.values()) {
                if (!Array.isArray(fuelArr)) continue;

                for (const item of fuelArr) {
                    if (!item?.variants) continue;

                    for (const variant of item.variants) {
                        const t = variant?.transmission_type?.toString().trim();
                        if (t) transmissionTypes.push(t);
                    }
                }
            }
        }

        
        transmissionTypes = [...new Set(transmissionTypes)];

        
        if (search) {
            const searchLower = search.toLowerCase();
            transmissionTypes = transmissionTypes.filter(type =>
                type.toLowerCase().includes(searchLower)
            );
        }

        
        if (!modelId) {
            transmissionTypes = transmissionTypes.slice(0, 5);
        }

        return successResponse(
            res,
            "Transmission types fetched successfully",
            transmissionTypes,
            null,
            200
        );
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};










export const getVariantsByModelIdFuel = async (req, res) => {
    try {
        const {
            modelId,
            fuelType,
            page = 1,
            limit = 10,
            sortBy = "variantName",
            sortDir = "asc",
        } = req.query;

        const pageNum = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNum - 1) * pageSize;

       
        const variantQuery = modelId ? { model_id: parseInt(modelId) } : {};

        const variantData = await Variant.find(variantQuery);

        let variants = [];

       
        for (const v of variantData) {
            if (!v.details) continue;

            for (const [fuelKey, fuelArr] of v.details.entries()) {
             
                if (fuelType && fuelKey !== fuelType) continue;

                if (!Array.isArray(fuelArr)) continue;

                for (const item of fuelArr) {
                    if (!item?.variants) continue;

                    for (const vr of item.variants) {
                        variants.push({
                            variantId: vr.variant_id,
                            modelId: vr.model_id,
                            variantName: vr.variant_name,
                            variantDisplayName: vr.variant_display_name,
                            transportationCategory: vr.transportation_category,
                            transmissionType: vr.transmission_type,
                            fuelType: vr.fuel_type,
                            exShowroomPrice: vr.ex_showroom_price || null,
                        });
                    }
                }
            }
        }

       
        const direction = sortDir.toLowerCase() === "desc" ? -1 : 1;

        variants.sort((a, b) => {
            const A = a[sortBy]?.toString().toLowerCase() || "";
            const B = b[sortBy]?.toString().toLowerCase() || "";
            if (A < B) return -1 * direction;
            if (A > B) return 1 * direction;
            return 0;
        });

        
        const paginatedVariants = variants.slice(skip, skip + pageSize);

        return paginatedResponse(
            res,
            "Variants fetched successfully",
            paginatedVariants,
            pageNum,
            pageSize,
            variants.length
        );
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};






export const getBodyTypesSearchByModelId = async (req, res) => {
    try {
        // 🔹 optional modelId
        const modelIdRaw = req.query.modelId;
        const modelId = modelIdRaw ? parseInt(modelIdRaw) : null;

        // 🔹 optional search
        const search = req.query.search?.trim();

        // 🔹 fetch model docs
        const modelQuery = modelId
            ? { "models.model_id": modelId }
            : {};

        const modelDocs = await Model.find(
            modelQuery,
            { "models.body_type": 1, "models.model_id": 1, _id: 0 }
        );

        // 🔹 extract body types
        let bodyTypes = modelDocs.flatMap(doc =>
            (doc.models || [])
                .filter(m => !modelId || m.model_id === modelId)
                .map(m => m.body_type)
        );

        // 🔹 clean + dedupe
        bodyTypes = [
            ...new Set(
                bodyTypes
                    .map(b => b?.toString().trim())
                    .filter(Boolean)
            )
        ];

        // 🔍 optional search
        if (search) {
            const searchLower = search.toLowerCase();
            bodyTypes = bodyTypes.filter(type =>
                type.toLowerCase().includes(searchLower)
            );
        }

        // 🔹 fallback when no model selected
        if (!modelId) {
            bodyTypes = bodyTypes.slice(0, 9);
        }

        return successResponse(
            res,
            "Body types fetched successfully",
            bodyTypes,
            null,
            200
        );
    } catch (error) {
        return errorResponse(res, error.message, null, 500);
    }
};