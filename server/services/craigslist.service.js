const craigslist = require('node-craigslist');

const FREE_CATEGORY_CODE = 'zip';
const client = new craigslist.Client();
const craigslistService = {};

craigslistService.findFree = async ({
    city,
    item
}) => {
    return await client.search({
        city,
        category: FREE_CATEGORY_CODE
    }, item);
};

module.exports = craigslistService;
