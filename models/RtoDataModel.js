import mongoose from "mongoose";

// Subdocument schema for detail array
const rtoDetailSchema = new mongoose.Schema(
  {
    rto_id: { type: Number, required: true },
    rto_code: { type: String, required: true },
    rto_name: { type: String, required: true },
    is_popular: { type: Boolean, default: false },
    display_order: { type: Number, default: 0 },
  },
  { _id: false } // prevent automatic _id on subdocument
);

// Main schema
const rtoDataSchema = new mongoose.Schema(
  {
    stateId: { type: Number, required: true },
    rtoName: { type: String, required: true },
    detail: [rtoDetailSchema],
  },
  { timestamps: true }
);

// Export model
const RtoData = mongoose.model("RtoData", rtoDataSchema, "rtoData");

export default RtoData;
