import vehicleService from "../services/VehicleService.js";
import { sendResponse } from "../Utils/responseHandler.js";
import { FilterSellVehicleRequestDto } from "../DTOs/FilterSellVehicleRequestDto.js";
import { HomePageVehiclesRequestDto } from "../DTOs/HomePageVehiclesRequestDto.js";
import { convertGrpcResponse } from "../Utils/convertGrpcResponse.js";

export async function filterVehicleSellRequest(req, res) {
  try {
    const { error, value } = FilterSellVehicleRequestDto.validate(req.body);
    if (error) {
      return sendResponse(res, "error", 400, error.details[0].message);
    }

    const data = value;

    const responseData = await vehicleService.filterVehicleSellRequest(data);

    return res.json(convertGrpcResponse(responseData));
  } catch (error) {
    return sendResponse(res, "error", 500, error.message);
  }
}

export async function getHomePageVehicles(req, res) {
  try {
    const { value, error } = HomePageVehiclesRequestDto.validate(req.query, { abortEarly: false });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      return sendResponse(res, 400, "error", message);
    }

    const grpcResp = await vehicleService.getHomePageVehicles(value);
    const data = convertGrpcResponse(grpcResp);

    return sendResponse(res, 200, "success", data);
  } catch (err) {
    console.error("getHomePageVehicles error:", err);
    return sendResponse(res, 500, "error", "Internal server error");
  }
}


export default {
  filterVehicleSellRequest,
  getHomePageVehicles,
};