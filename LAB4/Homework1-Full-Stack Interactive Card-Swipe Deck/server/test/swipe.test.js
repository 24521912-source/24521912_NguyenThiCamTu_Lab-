import {
  after,
  before,
  beforeEach,
  test,
} from 'node:test';

import assert from 'node:assert/strict';
import { once } from 'node:events';

import app from '../src/app.js';

import {
  connectDatabase,
  disconnectDatabase,
} from '../src/config/database.js';

import Profile from '../src/models/Profile.js';
import Swipe from '../src/models/Swipe.js';

const TEST_DATABASE_URI =
  'mongodb://127.0.0.1:27018/swipe_deck_test';

let server;
let baseUrl;

before(async () => {
  await connectDatabase(TEST_DATABASE_URI);

  await Profile.init();
  await Swipe.init();

  await Profile.deleteMany({});
  await Swipe.deleteMany({});

  await Profile.create({
    id: 'test-profile',
    name: 'Test Profile',
    age: 22,
    bio: 'A fictional test profile.',
    avatar: '/avatars/test.svg',
  });

  server = app.listen(0, '127.0.0.1');

  await once(server, 'listening');

  baseUrl =
    `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await Swipe.deleteMany({});
});

after(async () => {
  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    if (baseUrl) {
      await Swipe.deleteMany({});
      await Profile.deleteMany({});
    }
  } finally {
    await disconnectDatabase();
  }
});

async function postSwipe(payload) {
  const response = await fetch(
    `${baseUrl}/api/swipe`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return {
    status: response.status,
    data: await response.json(),
  };
}

function validPayload(overrides = {}) {
  return {
    sessionId: 'test-session',
    profileId: 'test-profile',
    action: 'LIKE',
    ...overrides,
  };
}

test('GET /api/profiles returns stored profiles', async () => {
  const response = await fetch(
    `${baseUrl}/api/profiles`,
  );

  const profiles = await response.json();

  assert.equal(response.status, 200);
  assert.equal(profiles.length, 1);
  assert.equal(profiles[0].id, 'test-profile');
});

test('POST /api/swipe persists a valid action', async () => {
  const result = await postSwipe(validPayload());

  assert.equal(result.status, 201);
  assert.equal(result.data.action, 'LIKE');
  assert.ok(result.data.id);

  const savedSwipe = await Swipe.findOne({
    sessionId: 'test-session',
    profileId: 'test-profile',
  }).lean();

  assert.ok(savedSwipe);
  assert.equal(savedSwipe.action, 'LIKE');
});

test('POST /api/swipe rejects an invalid action', async () => {
  const result = await postSwipe(
    validPayload({
      action: 'UNKNOWN',
    }),
  );

  assert.equal(result.status, 400);
  assert.equal(await Swipe.countDocuments(), 0);
});

test('POST /api/swipe rejects a missing sessionId', async () => {
  const result = await postSwipe(
    validPayload({
      sessionId: '',
    }),
  );

  assert.equal(result.status, 400);
});

test('POST /api/swipe rejects an invalid profileId', async () => {
  const result = await postSwipe(
    validPayload({
      profileId: null,
    }),
  );

  assert.equal(result.status, 400);
});

test('POST /api/swipe rejects an unknown profile', async () => {
  const result = await postSwipe(
    validPayload({
      profileId: 'missing-profile',
    }),
  );

  assert.equal(result.status, 404);
});

test('POST /api/swipe prevents duplicate actions', async () => {
  const first = await postSwipe(validPayload());
  const second = await postSwipe(validPayload());

  assert.equal(first.status, 201);
  assert.equal(second.status, 409);
  assert.equal(await Swipe.countDocuments(), 1);
});

test('Different sessions can swipe the same profile', async () => {
  const first = await postSwipe(validPayload());

  const second = await postSwipe(
    validPayload({
      sessionId: 'another-session',
      action: 'PASS',
    }),
  );

  assert.equal(first.status, 201);
  assert.equal(second.status, 201);
  assert.equal(await Swipe.countDocuments(), 2);
});

test('Concurrent duplicate requests create only one action', async () => {
  const results = await Promise.all([
    postSwipe(validPayload()),
    postSwipe(validPayload()),
  ]);

  const statuses = results
    .map((result) => result.status)
    .sort((first, second) => first - second);

  assert.deepEqual(statuses, [201, 409]);
  assert.equal(await Swipe.countDocuments(), 1);
});

test('Malformed JSON returns a 400 response', async () => {
  const response = await fetch(
    `${baseUrl}/api/swipe`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"action":',
    },
  );

  assert.equal(response.status, 400);
});