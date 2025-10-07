// __tests__/app.test.js
const request = require('supertest');
const app = require('../app');

describe('App', () => {
    it('should respond with a 200 on the home page', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});