import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema(
  {
    make_id: { type: Number, required: true },
    years: { type: Number },
    models: [
      {
        model_id: { type: Number, required: true },
        make_id: { type: Number, required: true },
        model_name: { type: String, required: true },
        model_display: { type: String, required: true },
        body_type: { type: String },
        is_popular: { type: String, enum: ["yes", "no"], default: "no" },
        feed_img: { type: String, default: "" },
        status: { type: String, default: "Active" }
      }
    ]
  },
  { timestamps: true }
);

const Model = mongoose.model("Model", ModelSchema);

export default Model;
