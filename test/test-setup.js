const mongoose = require('mongoose');

beforeAll(async () => {
    const testDbUrl = 'mongodb://localhost:27017/the-spot-test';
    await mongoose.connect(testDbUrl);
});

// Add this afterAll hook
afterAll(async () => {
    await mongoose.connection.close();
});