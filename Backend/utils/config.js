require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const FRONTEND_URL = process.env.FRONTEND_URL;

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET,
    EMAIL,
    EMAIL_PASSWORD,
    FRONTEND_URL
};