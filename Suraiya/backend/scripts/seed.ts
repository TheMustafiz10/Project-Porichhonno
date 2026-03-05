import { connectToDatabase } from '../config/database';
import { ScrapRate } from '../models/ScrapRate';
import { EcoTip } from '../models/EcoTip';
import { User } from '../models/User';

async function seed() {
  try {
    await connectToDatabase();

    console.log('🌱 Seeding database...\n');

    // Seed Scrap Rates
    console.log('📊 Seeding scrap rates...');
    await ScrapRate.deleteMany({});
    const scrapRates = await ScrapRate.insertMany([
      { materialType: 'PAPER', pricePerKg: 5, lastUpdated: new Date() },
      { materialType: 'PLASTIC', pricePerKg: 12, lastUpdated: new Date() },
      { materialType: 'METAL', pricePerKg: 25, lastUpdated: new Date() },
      { materialType: 'GLASS', pricePerKg: 3, lastUpdated: new Date() },
      { materialType: 'ELECTRONICS', pricePerKg: 50, lastUpdated: new Date() },
      { materialType: 'ORGANIC', pricePerKg: 2, lastUpdated: new Date() },
    ]);
    console.log(`✅ Created ${scrapRates.length} scrap rates\n`);

    // Seed Eco Tips
    console.log('💡 Seeding eco tips...');
    await EcoTip.deleteMany({});
    const ecoTips = await EcoTip.insertMany([
      {
        title: 'Rinse Before Recycling',
        content: 'Always rinse food containers before placing them in recycling bins to prevent contamination.',
        category: 'Recycling',
        icon: '🧼',
        isActive: true,
      },
      {
        title: 'Compost Food Scraps',
        content: 'Turn your kitchen waste into nutrient-rich compost for plants instead of throwing it away.',
        category: 'Composting',
        icon: '🌱',
        isActive: true,
      },
      {
        title: 'Remove Bottle Caps',
        content: 'Separate caps from plastic bottles before recycling as they may require different processing.',
        category: 'Recycling',
        icon: '🍶',
        isActive: true,
      },
      {
        title: 'Flatten Cardboard Boxes',
        content: 'Break down cardboard boxes to save space in recycling bins and make collection more efficient.',
        category: 'Recycling',
        icon: '📦',
        isActive: true,
      },
      {
        title: 'Use Reusable Bags',
        content: 'Bring your own bags when shopping to reduce plastic waste and help the environment.',
        category: 'Waste Reduction',
        icon: '🛍️',
        isActive: true,
      },
      {
        title: 'E-Waste Recycling',
        content: 'Take old electronics to specialized e-waste centers instead of throwing them in regular trash.',
        category: 'Recycling',
        icon: '💻',
        isActive: true,
      },
      {
        title: 'Turn Off Lights',
        content: 'Save energy by turning off lights when leaving a room and using natural daylight when possible.',
        category: 'Energy',
        icon: '💡',
        isActive: true,
      },
      {
        title: 'Fix Leaky Faucets',
        content: 'A dripping faucet can waste thousands of gallons per year. Repair leaks promptly.',
        category: 'Water',
        icon: '💧',
        isActive: true,
      },
      {
        title: 'Choose Reusable Over Disposable',
        content: 'Opt for reusable containers, utensils, and straws instead of single-use plastic items.',
        category: 'Waste Reduction',
        icon: '🥤',
        isActive: true,
      },
      {
        title: 'Buy Bulk When Possible',
        content: 'Purchasing items in bulk reduces packaging waste and often saves money too.',
        category: 'Waste Reduction',
        icon: '🛒',
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${ecoTips.length} eco tips\n`);

    // Create default user
    console.log('👤 Creating default user...');
    await User.deleteMany({ username: 'default-user' });
    const defaultUser = await User.create({
      _id: 'default-user',
      username: 'default-user',
      email: 'user@porichhonno.com',
      password: 'temporary', // In production, this would be hashed
      avatar: '🌿',
      totalPoints: 0,
      totalCo2Saved: 0,
      totalRecycledKg: 0,
      streak: 0,
      badges: [
        { name: 'New Recycler', icon: '🌱', earnedAt: new Date() },
      ],
    });
    console.log(`✅ Created user: ${defaultUser.username}\n`);

    console.log('✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
