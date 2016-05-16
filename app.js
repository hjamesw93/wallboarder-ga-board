var googleapis = require('googleapis'),
    JWT = googleapis.auth.JWT,
    analytics = googleapis.analytics('v3'),
    config = require('./config/config'),
    argv = require('minimist')(process.argv.slice(2)),
    forEach = require('async-foreach').forEach,
    request = require('request');

try {
    var data = (argv.data ? require(argv.data) : require('./config/data.json')),
        queries = data.queries;
} catch (e) {
    console.log("Data file not found!");
    process.exit(1);
}

if (!data.queries) {
    console.log("Invalid data file!");
    process.exit(1);
}

var wb = {
    title: data.title,
    url_slug: data.url,
    autoLayout: true,
    elems: [{id: 'wb_0', tagName: 'H1', innerText: data.title}]
};

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

    forEach(queries, function(item, index, arr) {
        item.params.auth = authClient;
        var done = this.async();
        analytics.data.ga.get(item.params, function(err, res) {
            if (err) console.log(err);
            else {
                var rows = [item.thead];
                Array.prototype.push.apply(rows, res.rows);

                wb.elems.push({
                    id: 'wb_'+ index,
                    tagName: 'table',
                    title: item.title,
                    struct: { rows: rows }
                });
                done();
            }
        });

    }, function(notAborted, res) {
        console.log(wb);

        request.post({url: config.WB_APP.URL + '/api/v1/upsert', form: {wb: wb}}, function(err){
            if (!err) return true;
        });
    });

});
