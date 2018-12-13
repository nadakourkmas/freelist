const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const logger = require('express-logger');

const app = express();
const port = 4000;//process.env.PORT || 4000;

// server logger
app.use(logger({path: "logfile.txt"}));

// setting json parsing of http requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// enabling cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// setting /api route as the default api route of the application
app.use('/api', routes);

// start listening for requests on the given port
app.listen(port, () => {
  console.log('Server running on port:' + port);
});

module.exports = app;
