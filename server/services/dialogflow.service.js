const dialogflow = require('dialogflow');
const uuidv4 = require('uuid/v4');

const sessionClient = new dialogflow.SessionsClient({ keyFilename: './certs/credentials.json' });

const dialogflowService = {};

dialogflowService.getProducts = (query) => {
    // You can find your project ID in your Dialogflow agent settings
    const projectId = 'online-shopping-63720'; //https://dialogflow.com/docs/agents#settings
    const sessionId = uuidv4();
    const creds = 'credentials.json';
    const languageCode = 'en-US';

    // Define session path
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    return sessionClient
        .detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult;
            // console.log(result);
            if (result.intent != null && result.intent.displayName == "product.search") {

                if (result.parameters.fields.product.listValue.values.length === 0) {
                    console.log("Couldn't understand Product! Need Annotation for: " + result.queryText);
                    return null;
                } else {
                    products = [];
                    params = result.parameters.fields;
                    if (params.color.listValue.values.length === 0) {
                        params.product.listValue.values.forEach(function (d) {
                            products.push(d.stringValue);
                        });
                    } else {
                        for (var i = 0; i < params.product.listValue.values.length; i++) {
                            col_prod = params.color.listValue.values[i].stringValue;
                            name_prod = params.product.listValue.values[i].stringValue;
                            products.push(col_prod + " " + name_prod);
                        }
                    }
                    return products;
                }
            }
            else if (result.action === 'input.unknown') {
                console.log("Weird Request!");
                return null;
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}

module.exports = dialogflowService;
