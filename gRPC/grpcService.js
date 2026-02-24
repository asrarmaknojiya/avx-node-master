import { response } from "express";
import {
  vehicleQuestServiceClient,
} from "./grpcClient.js";




export const filterVehicleSellRequest = (data) => {
  return new Promise((resolve, reject) => {
    vehicleQuestServiceClient.FilterVehicleRequest({ ...data }, (error, response) => {
      if (error) {
        return reject(error);
      }
      resolve(response);
    });
  });
};
