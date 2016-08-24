var config = {};

config.mongoURI = {
  development: 'mongodb://localhost:27017/hamco-dev',
  test: 'mongodb://localhost:27017/hamco-test',
  production: process.env.MONGODB_URI
}

module.exports = config;