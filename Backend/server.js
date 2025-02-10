const mongoose = require('mongoose');
const { MONGODB_URI, PORT } = require('./utils/config');
const app = require('./app');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to the database...');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => console.log('Error connecting to the database', err));