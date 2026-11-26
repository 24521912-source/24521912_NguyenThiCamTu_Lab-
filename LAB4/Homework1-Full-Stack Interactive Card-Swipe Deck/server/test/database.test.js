import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  connectDatabase,
  disconnectDatabase,
} from '../src/config/database.js';

test('Database configuration rejects an empty URI', async () => {
  await assert.rejects(
    () => connectDatabase(''),
    /MONGODB_URI is required/,
  );
});

test('Database connection rejects an unavailable server', async () => {
  try {
    await assert.rejects(
      () =>
        connectDatabase(
          'mongodb://127.0.0.1:1/swipe_deck_test',
        ),
    );
  } finally {
    await disconnectDatabase();
  }
});