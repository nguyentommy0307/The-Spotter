const request = require('supertest');
const app = require('../app');
const Spotter = require('../models/spotter');
const User = require('../models/user');
const mongoose = require('mongoose');

describe('Spotter CRUD Routes', () => {
    it('should NOT allow an unauthenticated user to create a gym', async () => {
        const response = await request(app)
            .post('/spotters')
            .send({
                spotter: {
                    title: 'Unauthorized Gym',
                    description: 'This should not be created',
                    location: 'Nowhere',
                    price: 1,
                    geometry: { type: 'Point', coordinates: [0, 0] }
                }
            });
        
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/login');
    });

    describe('when logged in', () => {
        let agent;

        beforeEach(async () => {
            await User.deleteMany({});
            agent = request.agent(app);
            await agent
                .post('/register')
                .send({
                    username: 'cruduser',
                    email: 'crud@example.com',
                    password: 'password123'
                });
        });
        
        beforeEach(async () => {
            await Spotter.deleteMany({});
        });

        it('should allow a logged-in user to create a new gym', async () => {
            const response = await agent
                .post('/spotters')
                .send({
                    spotter: {
                        title: 'New Test Gym',
                        description: 'A brand new gym',
                        location: 'Testville',
                        price: 50,
                        geometry: { type: 'Point', coordinates: [0, 0] }
                    }
                });

            expect(response.statusCode).toBe(302);
            const gym = await Spotter.findOne({ title: 'New Test Gym' });
            expect(gym).not.toBeNull();
        });

        it('should NOT allow a user to delete a gym they do not own', async () => {
            const otherGym = new Spotter({
                title: 'Other User Gym',
                author: new mongoose.Types.ObjectId(),
                geometry: { type: 'Point', coordinates: [1, 1] }
            });
            await otherGym.save();

            const response = await agent 
                .post(`/spotters/${otherGym._id}?_method=DELETE`);
                
            expect(response.statusCode).toBe(302);

            expect(response.headers.location).toBe(`/spotters/${otherGym._id}`);

            const gym = await Spotter.findById(otherGym._id);
            expect(gym).not.toBeNull();
        });
    });
});