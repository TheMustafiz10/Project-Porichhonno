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