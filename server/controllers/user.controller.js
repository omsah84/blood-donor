import User from "../models/User.js";

// ---------- GET all users ----------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- GET profile by ID ----------
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------- UPDATE profile by ID ----------
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Extract fields from request body
    const {
      name,
      email,
      password,
      phone,
      age,
      gender,
      bloodGroup,
      organs,
      hospitalName,
      contactPerson,
      website,
      organizationId,
      address,
      state,
      district,
      googleMapLink,
    } = req.body;

    // ------------------- Update common fields -------------------
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (password && password.trim() !== "") user.password = password; // hash in production

    // ------------------- Role-specific updates -------------------
    if (user.role === "patient" || user.role === "donor") {
      if (age !== undefined) user.age = age;
      if (gender !== undefined) user.gender = gender;
      if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
      if (organs !== undefined) user.organs = organs;
      if (address !== undefined) user.address = address;
      if (state !== undefined) user.state = state;
      if (district !== undefined) user.district = district;
      if (googleMapLink !== undefined) user.googleMapLink = googleMapLink;
    }

    if (user.role === "organization") {
      if (hospitalName !== undefined) user.hospitalName = hospitalName;
      if (contactPerson !== undefined) user.contactPerson = contactPerson;
      if (website !== undefined) user.website = website;
      if (address !== undefined) user.address = address;
      if (state !== undefined) user.state = state;
      if (district !== undefined) user.district = district;
      if (googleMapLink !== undefined) user.googleMapLink = googleMapLink;
    }

    if (user.role === "bloodBank") {
      if (website !== undefined) user.website = website;
      if (organizationId !== undefined) user.organizationId = organizationId;
      if (address !== undefined) user.address = address;
      if (state !== undefined) user.state = state;
      if (district !== undefined) user.district = district;
      if (googleMapLink !== undefined) user.googleMapLink = googleMapLink;
    }

    // Save user (pre-save hook recalculates profileStatus automatically)
    await user.save();

    // Return updated user (exclude password)
    const updatedUser = await User.findById(id).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email or phone already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};
