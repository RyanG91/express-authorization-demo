// dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

const { initializePassport, requireJwt } = require('./middleware/auth')

const app = express();

// parse json
app.use(bodyParser.json());

app.use(initializePassport)
app.use(cors())

// mongoose
mongoose.connect('mongodb://admin:admin1@ds125021.mlab.com:25021/bookmarks-', (err) => {
  if (err) {
    console.log('Error connecting to database', err);
  } else {
    console.log('Connected to database!');
  }
});

app.use('/auth', require('./routes/auth'))
app.use('/bookmarks', requireJwt, require('./routes/bookmarks'))

app.listen(process.env.PORT || 3000, () => console.log('Listening on http://localhost:3000'));
