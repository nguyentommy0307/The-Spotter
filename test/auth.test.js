const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('User Authentication Routes', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should allow a new user to register and logs them in', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/spotters');
    });

    it('should allow a registered user to log in', async () => {
        await User.register(new User({ username: 'loginuser', email: 'login@example.com' }), 'password123');

        const response = await request(app)
            .post('/login')
            .send({
                username: 'loginuser',
                password: 'password123'
            });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/spotters');
    });
});