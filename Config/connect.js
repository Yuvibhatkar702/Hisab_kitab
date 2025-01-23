const mongoose = require('mongoose');

async function connect(){
    await mongoose.connect("mongodb+srv://yuvibhatkar702:jKhv3eN70R4qPpv3@khatabook.edzhy.mongodb.net/?retryWrites=true&w=majority&appName=KhataBook");
}

connect()
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...', err));  

module.exports = connect;