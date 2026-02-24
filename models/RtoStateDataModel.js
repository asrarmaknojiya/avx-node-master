import mongoose from "mongoose";

const detailSchema = new mongoose.Schema(
  {
    displayOrder: { type: Number, required: true },
    isChallan: { type: String, enum: ["yes", "no"], default: "no" },
    challanFaqSlug: { type: String },
    slug: { type: String, required: true },
    state_id: { type: Number, required: true },
    state_code: { type: String, required: true },
    state_name: { type: String, required: true },
    state_image: { type: String }
  },
  { _id: false }
);

const RtoStateSchema = new mongoose.Schema(
  {
    detail: [detailSchema]
  },
  { timestamps: true }
);

const RtoStateData = mongoose.model("RtoStateData", RtoStateSchema, "rtoStateData");

export default RtoStateData;
