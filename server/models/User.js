import mongoose from "mongoose";

const roles = ["patient", "donor", "organization", "bloodBank"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: String,
    email: { type: String, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    address: String,
    state: String,
    district: String,
    googleMapLink: String,
    age: Number,
    gender: String,
    bloodGroup: String,
    organs: [String],
    rewardPoints: { type: Number, default: 0 },
    hospitalName: String,
    contactPerson: String,
    website: String,
    organizationId: String,
    profileStatus: {
      type: String,
      enum: ["Incomplete", "Completed"],
      default: "Incomplete",
    },
  },
  { timestamps: true }
);

/* ================= Helper function ================= */
function calculateProfileStatus(data) {
  let isComplete = false;

  if (data.role === "patient" || data.role === "donor") {
    isComplete =
      !!data.name &&
      !!data.email && !!data.phone &&
      !!data.age &&
      !!data.gender &&
      !!data.bloodGroup;
  } else if (data.role === "organization") {
    isComplete =
      !!data.name &&
      !!data.email && !!data.phone &&
      !!data.address &&
      !!data.state &&
      !!data.district &&
      !!data.googleMapLink;
  } else if (data.role === "bloodBank") {
    isComplete =
      !!data.name &&
      !!data.email && !!data.phone &&
      !!data.address &&
      !!data.state &&
      !!data.district &&
      !!data.googleMapLink;
  }

  return isComplete ? "Completed" : "Incomplete";
}

/* ================= Pre-save hook ================= */
userSchema.pre("save", function () {
  this.profileStatus = calculateProfileStatus(this);
});

/* ================= Pre-findOneAndUpdate hook ================= */
userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  if (!update) return;

  // Fetch the current document from DB
  const docToUpdate = await this.model.findOne(this.getQuery());

  // Merge existing data with updated fields
  const mergedData = { ...docToUpdate.toObject(), ...update };

  // Recalculate profileStatus
  update.profileStatus = calculateProfileStatus(mergedData);

  this.setUpdate(update);
});

/* ================= Pre-updateOne hook ================= */
userSchema.pre("updateOne", { document: false, query: true }, async function () {
  const update = this.getUpdate();
  if (!update) return;

  const docToUpdate = await this.model.findOne(this.getQuery());
  const mergedData = { ...docToUpdate.toObject(), ...update };

  update.profileStatus = calculateProfileStatus(mergedData);
  this.setUpdate(update);
});

const User = mongoose.model("User", userSchema);

export default User;
