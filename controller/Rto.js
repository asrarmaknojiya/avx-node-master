import { errorResponse, paginatedResponse } from "../utils/response.util.js";
import RtoStateData from "../models/RtoStateDataModel.js";
import RtoData from "../models/RtoDataModel.js";

export const getAllStates = async (req, res) => {
    try {
        let { page = 1, limit = 10, sortBy = "displayOrder", sortDir = "asc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const doc = await RtoStateData.findOne();
        if (!doc) {
            return errorResponse(res, "No states found", null, 404);
        }

        let states = [...doc.detail];
        const dir = sortDir === "desc" ? -1 : 1;

        states.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1 * dir;
            if (a[sortBy] > b[sortBy]) return 1 * dir;
            return 0;
        });

        const totalCount = states.length;
        const start = (page - 1) * limit;
        const end = page * limit;
        const paginated = states.slice(start, end);

        const formattedStates = paginated.map((state) => ({
            displayOrder: state.displayOrder,
            isChallan: state.isChallan,
            challanFaqSlug: state.challanFaqSlug,
            slug: state.slug,
            stateId: state.state_id,
            stateCode: state.state_code,
            stateName: state.state_name,
            stateImage: state.state_image
        }));

        return paginatedResponse(res, "States fetched successfully", formattedStates, page, limit, totalCount);

    } catch (err) {
        console.error("Error in getAllStates:", err);
        return errorResponse(res, err.message, null, 500);
    }
};

export const getAllRtoDataByStateId = async (req, res) => {
    try {
        const stateId = parseInt(req.params.stateId);
        let { page = 1, limit = 10, sortBy = "display_order", sortDir = "asc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const doc = await RtoData.findOne({ stateId });
        if (!doc) {
            return errorResponse(res, "No RTO data found for this state", null, 404);
        }

        let rtos = [...doc.detail];
        const dir = sortDir === "desc" ? -1 : 1;

        rtos.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1 * dir;
            if (a[sortBy] > b[sortBy]) return 1 * dir;
            return 0;
        });

        const totalCount = rtos.length;
        const start = (page - 1) * limit;
        const end = page * limit;
        const paginated = rtos.slice(start, end);

        const formatted = paginated.map(item => ({
            rtoId: item.rto_id,
            rtoCode: item.rto_code,
            rtoName: item.rto_name,
            isPopular: item.is_popular,
            displayOrder: item.display_order
        }));

        const responseData = {
            stateId: doc.stateId,
            rtoName: doc.rtoName,
            detail: formatted
        };

        return paginatedResponse(
            res,
            "RTO data fetched successfully",
            responseData,
            page,
            limit,
            totalCount
        );

    } catch (err) {
        console.error("Error in getAllRtoDataByStateId:", err);
        return errorResponse(res, err.message, null, 500);
    }
};
