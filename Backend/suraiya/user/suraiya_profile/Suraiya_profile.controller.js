import SuraiyaProfile from './Suraiya_profile.model.js';

export const seedSuraiyaProfile = async (req, res) => {
  try {
    const defaultEmail = 'suraiya.student@porichhonno.local';

    // Reuse existing seeded profile to avoid creating duplicates on repeated calls.
    let profile = await SuraiyaProfile.findOne({ email: defaultEmail });

    if (!profile) {
      profile = await SuraiyaProfile.create({
        name: 'Suraiya Student',
        email: defaultEmail,
        phone: '+8801000000000',
        location: 'Dhaka, Bangladesh',
        bio: 'Eco-warrior in training!',
        totalRecycledItems: 12,
        ecoPoints: 120,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Seed profile ready',
      data: profile,
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getSuraiyaProfile = async (req, res) => {
  try {
    const user = await SuraiyaProfile.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateSuraiyaProfile = async (req, res) => {
  try {
    const { name, phone, location, bio } = req.body;

    const updatedUser = await SuraiyaProfile.findByIdAndUpdate(
      req.params.id,
      { name, phone, location, bio },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (_error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createSuraiyaProfile = async (req, res) => {
  try {
    const { name, email, phone, location, bio } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required fields',
      });
    }

    const existingUser = await SuraiyaProfile.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const newUser = await SuraiyaProfile.create({
      name,
      email,
      phone: phone || '',
      location: location || '',
      bio: bio || '',
      totalRecycledItems: 0,
      ecoPoints: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      data: newUser,
    });
  } catch (error) {
    console.error('Create Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user profile',
    });
  }
};