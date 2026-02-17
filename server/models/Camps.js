import mongoose from "mongoose";

const campSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Blood Donation Camp"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to Blood Bank or Organization
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: String,
    district: String,
    googleMapLink: String, // optional, for exact location
    date: {
      type: Date,
      required: true, // camp date
    },
    time: {
      type: String, // e.g., "10:00 AM - 4:00 PM"
      required: true,
    },
    description: String, // optional details
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.model("Camp", campSchema);
