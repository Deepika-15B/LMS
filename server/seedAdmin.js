const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillup';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ email: 'admin@skillup.com' });
    if (existingAdmin) {
       console.log('Admin already exists.');
       process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adminpassword', salt);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@skillup.com',
      password: hashedPassword,
      role: 'admin',
      fullName: 'System Administrator'
    });

    await adminUser.save();
    console.log('Admin user seeded successfully. credentials: admin@skillup.com / adminpassword');
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAdmin();
