import Camp from "../models/Camps.js";
import User from "../models/User.js";

// ---------- CREATE a camp ----------
export const createCamp = async (req, res) => {
  try {
    const { name, createdBy, address, state, district, googleMapLink, date, time, description } = req.body;

    // Validate required fields
    if (!name || !createdBy || !address || !date || !time) {
      return res.status(400).json({ message: "Name, creator, address, date, and time are required" });
    }

    // Check if creator exists
    const user = await User.findById(createdBy);
    if (!user) return res.status(404).json({ message: "Creator not found" });

    const camp = await Camp.create({
      name,
      createdBy,
      address,
      state,
      district,
      googleMapLink,
      date,
      time,
      description,
    });

    res.status(201).json({ message: "Camp created successfully", camp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- GET all camps ----------
export const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find()
      .populate("createdBy", "name role email phone") // show creator info
      .sort({ date: 1 }); // sort by upcoming date
    res.status(200).json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- GET single camp by ID ----------
export const getCampById = async (req, res) => {
  try {
    const { id } = req.params;
    const camp = await Camp.findById(id).populate("createdBy", "name role email phone");
    if (!camp) return res.status(404).json({ message: "Camp not found" });
    res.status(200).json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- UPDATE a camp ----------
export const updateCamp = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const camp = await Camp.findById(id);
    if (!camp) return res.status(404).json({ message: "Camp not found" });

    Object.keys(updates).forEach(key => {
      camp[key] = updates[key];
    });

    await camp.save();
    res.status(200).json({ message: "Camp updated successfully", camp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- DELETE a camp ----------
export const deleteCamp = async (req, res) => {
  try {
    const { id } = req.params;
    const camp = await Camp.findByIdAndDelete(id);
    if (!camp) return res.status(404).json({ message: "Camp not found" });
    res.status(200).json({ message: "Camp deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
