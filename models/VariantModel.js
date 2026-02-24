import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    model_id: { type: Number, required: true },
    year: { type: Number, required: true },

    details: {
      type: Map, // dynamic keys for fuel types (Petrol, Diesel, etc.)
      of: [
        {
          exShowroomPriceFlag: { type: Boolean, default: false },
          key: { type: String },        // e.g., "transmission_type"
          title: { type: String },      // e.g., "Automatic"
          value: { type: String },      // e.g., "AT"

          variants: [
            {
              variant_id: { type: Number, required: true },
              parent_id: { type: Number, default: 0 },
              model_id: { type: Number, required: true },
              variant_name: { type: String, required: true },
              variant_name_short: { type: String },
              variant_display_name: { type: String },
              transportation_category: { type: String },
              transmission_type: { type: String },
              fuel_type: { type: String },
              status: { type: String, default: "Active" },
              tax_value: { type: String },
              ex_showroom_price: { type: Number, default: 0 }
            }
          ]
        }
      ]
    }
  },
  { timestamps: true }
);

const Variant = mongoose.model("Variant", VariantSchema);

export default Variant;
