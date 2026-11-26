import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import app from '../src/app.js';

test('GET /api/health returns a successful response', async (t) => {
  const server = app.listen(0, '127.0.0.1');

  t.after(() => {
    return new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });

  await once(server, 'listening');

  const { port } = server.address();

  const response = await fetch(
    `http://127.0.0.1:${port}/api/health`,
  );

  const data = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(data, { status: 'ok' });
});