import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const PackageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', PackageSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/q-amchain');
    console.log('Connected to DB');
    
    const count = await Package.countDocuments();
    console.log('Total packages:', count);
    
    const activePackages = await Package.find({ status: 'active', isDeleted: false });
    console.log('Active, non-deleted packages:', activePackages.length);
    
    if (activePackages.length > 0) {
        console.log('Sample package:', JSON.stringify(activePackages[0], null, 2));
    }
    
    const hiddenCount = await Package.countDocuments({ isHidden: true });
    console.log('Explicitly hidden packages:', hiddenCount);

    const nonHiddenCount = await Package.countDocuments({ isHidden: false });
    console.log('Explicitly non-hidden packages:', nonHiddenCount);

    const missingHiddenFieldCount = await Package.countDocuments({ isHidden: { $exists: false } });
    console.log('Packages missing isHidden field:', missingHiddenFieldCount);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
