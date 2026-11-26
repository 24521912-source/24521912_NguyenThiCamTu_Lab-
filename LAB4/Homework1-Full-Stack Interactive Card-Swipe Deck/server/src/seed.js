import 'dotenv/config';

import {
  connectDatabase,
  disconnectDatabase,
} from './config/database.js';

import Profile from './models/Profile.js';
import Swipe from './models/Swipe.js';
import profiles from './data/profiles.js';

async function seedProfiles() {
  try {
    await connectDatabase();

    await Profile.init();
    await Swipe.init();

    const operations = profiles.map((profile) => ({
      updateOne: {
        filter: {
          id: profile.id,
        },
        update: {
          $setOnInsert: profile,
        },
        upsert: true,
      },
    }));

    const result = await Profile.bulkWrite(operations);

    const totalProfiles = await Profile.countDocuments();

    console.log('Profile seeding completed.');
    console.log(`Inserted profiles: ${result.upsertedCount}`);
    console.log(`Total profiles: ${totalProfiles}`);
  } catch (error) {
    console.error('Profile seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

await seedProfiles();