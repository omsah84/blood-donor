import bcrypt from "bcryptjs";
import User from "../models/User.js";


export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Require either email or phone
    if (!name || (!email && !phone) || !password || !role) {
      return res.status(400).json({ message: "Name, password, role, and either email or phone are required" });
    }

    // Check if user already exists with same email or phone for the role
    const userExists = await User.findOne({
      role,
      $or: [
        { email: email || null },
        { phone: phone || null }
      ]
    });

    if (userExists) {
      return res.status(400).json({ message: "User with this email or phone already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileStatus: user.profileStatus, // <-- added profile status
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const login = async (req, res) => {
  try {
    const { emailOrPhone, password, role } = req.body;

    // Require either email or phone along with password and role
    if (!emailOrPhone || !password || !role) {
      return res.status(400).json({ message: "Email or phone, password, and role are required" });
    }

    // Find user by email OR phone for the given role
    const user = await User.findOne({
      role,
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileStatus: user.profileStatus, // <-- added profile status
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
