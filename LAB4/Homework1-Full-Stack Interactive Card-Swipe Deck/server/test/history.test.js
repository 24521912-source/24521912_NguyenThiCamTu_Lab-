import {
  after,
  before,
  beforeEach,
  test,
} from 'node:test';

import assert from 'node:assert/strict';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';

import app from '../src/app.js';

import {
  connectDatabase,
  disconnectDatabase,
} from '../src/config/database.js';

import Profile from '../src/models/Profile.js';
import Swipe from '../src/models/Swipe.js';

const databaseName =
  `swipe_deck_history_test_${randomUUID().replaceAll('-', '')}`;

const uri =
  `mongodb://127.0.0.1:27018/${databaseName}`;

const sessionId = 'history-test-session';

let server;
let baseUrl;

before(async () => {
  await connectDatabase(uri);

  await Profile.init();
  await Swipe.init();

  await Profile.insertMany([
    {
      id: 'test-profile-01',
      name: 'Test Profile One',
      age: 22,
      bio: 'A fictional test profile.',
      avatar: '/avatars/test-01.svg',
    },
    {
      id: 'test-profile-02',
      name: 'Test Profile Two',
      age: 23,
      bio: 'A fictional test profile.',
      avatar: '/avatars/test-02.svg',
    },
  ]);

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

    if (
      mongoose.connection.readyState === 1 &&
      mongoose.connection.name === databaseName
    ) {
      await mongoose.connection.dropDatabase();
    }
  } finally {
    await disconnectDatabase();
  }
});

async function request(path, options = {}) {
  const response = await fetch(
    `${baseUrl}${path}`,
    options,
  );

  return {
    status: response.status,
    data: await response.json(),
  };
}

async function createSwipe(
  profileId,
  action = 'LIKE',
  targetSession = sessionId,
) {
  const result = await request('/api/swipe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId: targetSession,
      profileId,
      action,
    }),
  });

  assert.equal(result.status, 201);

  return result.data;
}

function getHistory(targetSession = sessionId) {
  return request(
    `/api/swipe/history/${targetSession}`,
  );
}

function undoSwipe(
  expectedActionId,
  targetSession = sessionId,
) {
  return request(
    `/api/swipe/history/${targetSession}/last`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expectedActionId,
      }),
    },
  );
}

test('GET history returns an empty array', async () => {
  const result = await getHistory();

  assert.equal(result.status, 200);
  assert.deepEqual(result.data, []);
});

test('GET history returns actions in chronological order', async () => {
  const first = await createSwipe('test-profile-01');

  const second = await createSwipe(
    'test-profile-02',
    'PASS',
  );

  const result = await getHistory();

  assert.equal(result.status, 200);

  assert.deepEqual(
    result.data.map((entry) => entry.id),
    [first.id, second.id],
  );
});

test('GET history isolates different sessions', async () => {
  const first = await createSwipe('test-profile-01');

  await createSwipe(
    'test-profile-02',
    'PASS',
    'another-session',
  );

  const result = await getHistory();

  assert.equal(result.data.length, 1);
  assert.equal(result.data[0].id, first.id);
});

test('DELETE removes only the latest action', async () => {
  const first = await createSwipe('test-profile-01');

  const second = await createSwipe(
    'test-profile-02',
    'PASS',
  );

  const result = await undoSwipe(second.id);

  assert.equal(result.status, 200);
  assert.equal(result.data.id, second.id);

  const history = await getHistory();

  assert.deepEqual(
    history.data.map((entry) => entry.id),
    [first.id],
  );

  assert.equal(await Swipe.countDocuments(), 1);
});

test('DELETE rejects an invalid action identifier', async () => {
  const result = await undoSwipe('invalid-id');

  assert.equal(result.status, 400);
});

test('DELETE returns 404 when history is empty', async () => {
  const id = new mongoose.Types.ObjectId().toString();

  const result = await undoSwipe(id);

  assert.equal(result.status, 404);
});

test('DELETE rejects an outdated action identifier', async () => {
  const first = await createSwipe('test-profile-01');

  await createSwipe('test-profile-02');

  const result = await undoSwipe(first.id);

  assert.equal(result.status, 409);
  assert.equal(await Swipe.countDocuments(), 2);
});

test('DELETE supports repeated LIFO undo', async () => {
  const first = await createSwipe('test-profile-01');

  const second = await createSwipe(
    'test-profile-02',
    'PASS',
  );

  assert.equal(
    (await undoSwipe(second.id)).status,
    200,
  );

  assert.equal(
    (await undoSwipe(first.id)).status,
    200,
  );

  const history = await getHistory();

  assert.deepEqual(history.data, []);
});

test('A restored profile can be swiped again', async () => {
  const first = await createSwipe('test-profile-01');

  assert.equal(
    (await undoSwipe(first.id)).status,
    200,
  );

  const second = await createSwipe(
    'test-profile-01',
    'PASS',
  );

  assert.notEqual(second.id, first.id);

  const history = await getHistory();

  assert.equal(history.data.length, 1);
  assert.equal(history.data[0].action, 'PASS');
});

test('Undo does not remove another session action', async () => {
  const first = await createSwipe('test-profile-01');

  const other = await createSwipe(
    'test-profile-02',
    'PASS',
    'another-session',
  );

  assert.equal(
    (await undoSwipe(first.id)).status,
    200,
  );

  const history = await getHistory('another-session');

  assert.equal(history.data.length, 1);
  assert.equal(history.data[0].id, other.id);
});