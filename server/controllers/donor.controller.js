import User from "../models/User.js";

// GET donor profile
export const getDonorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await User.findById(id).select("-password");

    if (!donor || donor.role !== "donor") {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE donor profile (FULL)
export const updateDonorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const donor = await User.findById(id);

    if (!donor || donor.role !== "donor") {
      return res.status(404).json({ message: "Donor not found" });
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
    if (name) donor.name = name;
    if (email) donor.email = email;
    if (phone) donor.phone = phone;

    // Password update (optional)
    if (password && password.trim() !== "") {
      donor.password = password; // ⚠️ hash in production
    }

    // Donor-specific fields
    if (age) donor.age = age;
    if (gender) donor.gender = gender;
    if (bloodGroup) donor.bloodGroup = bloodGroup;
    if (organs) donor.organs = organs;

    await donor.save();

    // Return updated donor without password
    const updatedDonor = await User.findById(id).select("-password");

    res.status(200).json({
      message: "Donor profile updated successfully",
      donor: updatedDonor,
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
