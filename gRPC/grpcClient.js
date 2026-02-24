import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATHS = [resolve(__dirname, "./proto/vehicleService.proto")];

const packageDefinitions = PROTO_PATHS.map((p) =>
  protoLoader.loadSync(p, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
);

const merged = Object.assign({}, ...packageDefinitions);
const myPackage = grpc.loadPackageDefinition(merged);

const VehicleQuestService = myPackage.com.avx.avx_grpc_service.VehicleService;

export const vehicleQuestServiceClient = new VehicleQuestService(
  "192.168.0.181:9095",
  grpc.credentials.createInsecure()
);

console.log(
  "vehicleQuestService available methods:",
  Object.keys(VehicleQuestService.service)
);
