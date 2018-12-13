const express = require('express');
const FreeRoutes = require('./free.route');
const OauthRoutes = require('./oauth.route');

const router = express.Router();

/**
 * API Health status
 */
router.get('/', (req, res) => {
  res.status(200).send('ok');
});

// routes
router.use('/free', FreeRoutes);

router.use('/oauth', OauthRoutes);

module.exports = router;
