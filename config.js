// config.js
require("dotenv").config();

const ENV = process.env.TEST_ENV || "staging";

module.exports = {
  users: {
    mentee: {
      email: 'serena+mentee@57blocks.com',
      password:'ohHello123456',
    },
    mentor: {
      email: 'serena+mentor@57blocks.com',
      password:'ohHello123456',
    },
  },
  baseURL: process.env.BASE_URL || "https://ohhello-qa.web.app",
};