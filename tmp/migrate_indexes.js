import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const dropIndexes = async () => {
    try {
        console.log('--- Index Migration Started ---');
        console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Defined' : 'UNDEFINED');
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB!');

        const collection = mongoose.connection.collection('users');
        
        const indexesToDrop = [
            'email_1',
            'username_1',
            'refCode_1',
            'walletAddress_1',
            'phoneNumber_1',
            'identityNumber_1'
        ];

        console.log('Checking for indexes in "users" collection...');
        const currentIndexes = await collection.indexes();
        const currentIndexNames = currentIndexes.map(idx => idx.name);
        console.log('Found indexes:', currentIndexNames);

        for (const indexName of indexesToDrop) {
            if (currentIndexNames.includes(indexName)) {
                console.log(`>>> Attempting to drop index: ${indexName}...`);
                await collection.dropIndex(indexName);
                console.log(`✅ Index ${indexName} dropped successfully.`);
            } else {
                console.log(`ℹ️ Index ${indexName} not found, skipping.`);
            }
        }

        console.log('--- Migration Successfully Finished ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ MIGRATION ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

dropIndexes();
