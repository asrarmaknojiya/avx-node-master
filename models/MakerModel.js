import mongoose from "mongoose";

const MakerSchema = new mongoose.Schema(
    {
        logo: { type: String, required: true },
        status: { type: String, default: "Active" },
        luxuryCar: { type: String, default: null },
        make_id: { type: Number, required: true },
        make_name: { type: String, required: true },
        display_order: { type: Number, default: 0 },
        make_display: { type: String, required: true },
        is_popular: { type: String, enum: ["yes", "no"], default: "no" },
    },
    { timestamps: true }
);

const Maker = mongoose.model("Maker", MakerSchema);

export default Maker;