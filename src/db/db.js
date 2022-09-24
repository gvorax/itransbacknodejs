const mongoose = require('mongoose');
require('dotenv').config({ path: 'MONGODB_URL' });

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://gvorax:Gvorax2002@cluster0.furor.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log('MongoDb connected');
  } catch (error) {
    console.error(error.message, 'MongoDB error');

    process.exit(1);
  }
};

module.exports = connectDB;
