const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors')
const connectDB = require('./src/db/db');
const app = express();
dotenv.config();
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/auth', require('./src/auth/route'));

app.get('/', (req, res) => {
  res.send('Server is running ... ');
});

const PORT = process.env.PORT || 3000;
connectDB();

function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Server failed');
    console.log(error);
  }
}

start();
