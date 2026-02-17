import User from "../models/User.js";


export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await User.find({ role: "organization" })
      .select(
        "name phone website address state district googleMapLink email role"
      ); // explicitly include fields

    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET organization profile
export const getOrganizationProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await User.findById(id).select("-password");

    if (!organization || organization.role !== "organization") {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE organization profile (ALL FIELDS)
export const updateOrganizationProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await User.findById(id);

    if (!organization || organization.role !== "organization") {
      return res.status(404).json({ message: "Organization not found" });
    }

    const allowedFields = [
      "name",
      "email",
      "password",
      "phone",
      "hospitalName",
      "contactPerson",
      "website",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        organization[field] = req.body[field];
      }
    });

    await organization.save();

    const updatedOrg = organization.toObject();
    delete updatedOrg.password;

    res.status(200).json({
      message: "Profile updated successfully",
      organization: updatedOrg,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
