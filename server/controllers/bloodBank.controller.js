import User from "../models/User.js";

// GET all blood banks
export const getAllBloodBanks = async (req, res) => {
  try {
    const bloodBanks = await User.find({ role: "bloodBank" })
      .select(
        "name phone website address state district googleMapLink email role"
      ); // explicitly include fields

    res.status(200).json(bloodBanks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET blood bank profile
export const getBloodBankProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const bloodBank = await User.findById(id).select("-password");

    if (!bloodBank || bloodBank.role !== "bloodBank") {
      return res.status(404).json({ message: "Blood bank not found" });
    }

    res.status(200).json(bloodBank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE blood bank profile (FULL)
// UPDATE blood bank profile (including address fields)
export const updateBloodBankProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const bloodBank = await User.findById(id);

    if (!bloodBank || bloodBank.role !== "bloodBank") {
      return res.status(404).json({ message: "Blood bank not found" });
    }

    const {
      name,
      email,
      password,
      phone,
      website,
      organizationId,
      address,
      state,
      district,
      googleMapLink,
    } = req.body;

    // Common fields
    if (name) bloodBank.name = name;
    if (email) bloodBank.email = email;
    if (phone) bloodBank.phone = phone;

    // Optional password
    if (password && password.trim() !== "") {
      bloodBank.password = password; // ⚠️ hash in production
    }

    // Blood bank specific fields
    if (website) bloodBank.website = website;
    if (organizationId) bloodBank.organizationId = organizationId;

    // Address fields
    if (address) bloodBank.address = address;
    if (state) bloodBank.state = state;
    if (district) bloodBank.district = district;
    if (googleMapLink) bloodBank.googleMapLink = googleMapLink;

    await bloodBank.save();

    // Return updated blood bank without password
    const updatedBloodBank = await User.findById(id).select(
      "-password"
    );

    res.status(200).json({
      message: "Blood bank profile updated successfully",
      bloodBank: updatedBloodBank,
    });
  } catch (error) {
    // Duplicate email / phone error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or phone already exists" });
    }

    res.status(500).json({ message: error.message });
  }
};
