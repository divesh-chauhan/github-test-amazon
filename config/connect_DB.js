const mongoose = require('mongoose');

const connect_DB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Database connected successfully ✅');
    } catch (error) {
        console.log('Connection failed ❌', error);
    }
};


module.exports = connect_DB;