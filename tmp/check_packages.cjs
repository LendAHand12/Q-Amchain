const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/q-amchain'; // Assumed default

const PackageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', PackageSchema);

async function check() {
  try {
    console.log('Connecting to', uri);
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const count = await Package.countDocuments();
    console.log('Total packages:', count);
    
    const activePackages = await Package.find({ status: 'active', isDeleted: false });
    console.log('Active, non-deleted packages:', activePackages.length);
    
    if (activePackages.length > 0) {
        console.log('Sample package:', JSON.stringify(activePackages[0], null, 2));
    }
    
    const missingHiddenFieldCount = await Package.countDocuments({ isHidden: { $exists: false } });
    console.log('Packages missing isHidden field:', missingHiddenFieldCount);

    const hiddenCount = await Package.countDocuments({ isHidden: true });
    console.log('Explicitly hidden packages:', hiddenCount);

    const nonHiddenCount = await Package.countDocuments({ isHidden: false });
    console.log('Explicitly non-hidden packages:', nonHiddenCount);

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
