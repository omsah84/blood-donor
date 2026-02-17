import User from "../models/User.js";

// GET patient profile
export const getPatientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await User.findById(id).select("-password");

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE patient profile (FULL)
export const updatePatientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await User.findById(id);

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }

    const {
      name,
      email,
      password,
      phone,
      age,
      gender,
      bloodGroup,
      organs,
    } = req.body;

    // Common fields
    if (name) patient.name = name;
    if (email) patient.email = email;
    if (phone) patient.phone = phone;

    // Password update (optional)
    if (password && password.trim() !== "") {
      patient.password = password; // ⚠️ hash in production
    }

    // Patient-specific fields
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (organs) patient.organs = organs;

    await patient.save();

    // Return updated patient without password
    const updatedPatient = await User.findById(id).select("-password");

    res.status(200).json({
      message: "Patient profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    // Handle duplicate email / phone
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or phone already exists" });
    }

    res.status(500).json({ message: error.message });
  }
};
