import { vehicleQuestServiceClient } from "../gRPC/grpcClient.js";

// existing
export const filterVehicleSellRequest = (data) =>
  new Promise((resolve, reject) => {
    vehicleQuestServiceClient.filterVehicle({ ...data }, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    });
  });

// NEW: home page vehicles
export const getHomePageVehicles = (data) =>
  new Promise((resolve, reject) => {
    vehicleQuestServiceClient.getHomePageVehicles({ ...data }, (error, response) => {
      if (error) return reject(error);
      resolve(response);
    });
  });

export default {
  filterVehicleSellRequest,
  getHomePageVehicles, // <- export it
};
