var googleapis = require('googleapis'),
    JWT = googleapis.auth.JWT,
    analytics = googleapis.analytics('v3'),
    config = require('./config/config'),
    queries = require('./config/queries.json');



var authClient = new JWT(
    config.GA.SERVICE_ACCOUNT_EMAIL,
    config.GA.SERVICE_ACCOUNT_KEY_FILE,
    null,
    ['https://www.googleapis.com/auth/analytics.readonly']
);

authClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }

    queries.forEach(function(q) {
        q.auth = authClient;
        analytics.data.ga.get(q, function(err, res) {
            if (err) console.log(err);
            console.log(res.rows);
        });
    });

});


