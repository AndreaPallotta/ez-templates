import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import app from '../app.js';

const request = supertest(app);

describe('Testing to see if test framework works', () => {
    it('It should work', () => {
        assert.strictEqual(1, 1);
    });
});

describe('GET /test/test-get/:username', () => {
    it('It should require auth token', async () => {
        await request.get('/test/test-get/john_doe').expect(401);
    });
});

describe('POST /test/test-post', () => {
    it('Should expect 200 OK', async () => {
        const data = { email: 'test@example.com', password: 'password123' };

        const response = await request
            .post('/test/test-post')
            .send(data)
            .expect(200);

        assert.strictEqual(
            response.headers['content-type'],
            'application/json; charset=utf-8'
        );
        assert.ok(response.body.authToken);
        assert.ok(response.body.refreshToken);
    });
});
