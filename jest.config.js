module.exports = {
    setupFilesAfterEnv: ['<rootDir>/test/test-setup.js'],
    testPathIgnorePatterns: [
        '<rootDir>/test/test-setup.js'
    ],
    
    testEnvironment: 'node',
};