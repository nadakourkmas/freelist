const express = require('express');
const craigslistService = require('../services/craigslist.service');
const mailerService = require('../services/mailer.service');
const dialogflowService = require('../services/dialogflow.service');

const router = express.Router();

const DEFAULT_CITY = 'vancouver';
const DEFAULT_ITEM = 'couch';

/**
 * GET /free
 */
router.get('/', async (req, res) => {
    const city = req.query.city || DEFAULT_CITY;
    const item = req.query.item || DEFAULT_ITEM;
    const email = req.query.email || 'fake@email.com';

    // dialog flowwing the item
    const dialogFlowedItem = await dialogflowService.getProducts(item) || [item];

    try {
        const listings = await craigslistService.findFree({ city, item: dialogFlowedItem[0] });

        // send notification email if there are no free items
        if (listings && listings.length == 0) {
            mailerService.sendWillNotifyEmail(email);
        }

        res.status(200).send(listings);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

/**
 * POST /free
 */
router.post('/', async (req, res) => {
    const firstSplit = req.body.text.split(" in ", 2);
    const secondSplit = firstSplit[1].split(" notify ", 2);

    const item = firstSplit[0] || DEFAULT_ITEM;
    const city = secondSplit[0] || DEFAULT_CITY;
    const email = secondSplit[1] || "";

    // dialog flowwing the item
    const dialogFlowedItem = await dialogflowService.getProducts(item) || [item];
    console.log('the item', dialogFlowedItem);

    try {
        const listings = await craigslistService.findFree({ city, item: dialogFlowedItem[0] });
        var text;
        // send notification email if there are no free items
        if (listings && listings.length == 0) {
            mailerService.sendWillNotifyEmail(email);
            text = "We couldn't find any listings, we'll send you an email when listings appear.";
        } else {
            text = "Here's some listings you might like:"
        }

        var attachments = [];

        for (listing of listings) {
            if (attachments.length >= 5) {
                break;
            }
            var jsonData = {};
            jsonData['text'] = `${listing.title}: ${listing.url}`;
            attachments.push(jsonData);
        }

        const response = {
            response_type: 'in_channel',
            channel: req.body.channel_id,
            text: text,
            attachments: attachments
        };
        
        res.status(200).send(response);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
