const StatusCheck = require('../models/statusCheck');
var request = require('request');
var schedule = require('node-schedule');

var URLS_TO_VERIFY = process.env.URLS_TO_CHECK;
const REQUEST_INTERVAL = process.env.REQUEST_INTERVAL;

// this is where the magic happens
schedule.scheduleJob(REQUEST_INTERVAL, function (){
    makereq();
});

/**
 * GET /m/:name
 * Send Message Page for public user
 */
exports.getStatuses = (req, res, next) => {
    StatusCheck.find({}, (err, statuses) => {
        if (err) {
            return next(err);
        }
        if (!statuses) {
            // 204 - no content
            return res.status(204).send('No content');
        }
        return res.status(200).send(statuses);
    }).sort({
        date: -1
    });
};

/* Test create*/
exports.testAddNew = (req, res, next) => {
    var st = new StatusCheck({
        code: 'ahaha',
        status: 'test',
        date: Date()
    });
    st.save((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).send('OK');
    });
};

/* Make a requisition to sistemas.quixada.ufc*/
var makereq = (req, res, next) => {
    URLS_TO_VERIFY = JSON.parse(URLS_TO_VERIFY);
    console.log(URLS_TO_VERIFY);
    URLS_TO_VERIFY.forEach(targetUrl => {
        console.log('Trying To HIT: ' + targetUrl);
        request(targetUrl, {
            timeout: '30000'
        }, function (error, response) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            if (error) {
                var st = new StatusCheck({
                    code: error.Error,
                    status: 'OFFLINE',
                    date: Date(),
                    address: targetUrl,
                });
                st.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    // return res.status(200).send('OK');
                });
            }
            if (response && response.statusCode) {
                if (response.statusCode.toString().startsWith('2')) {
                    var st = new StatusCheck({
                        code: response.statusCode,
                        status: 'ONLINE',
                        date: Date(),
                        address: targetUrl,
                    });
                    st.save((err) => {
                        if (err) {
                            return next(err);
                        }
                        // return res.status(200).send('OK');
                    });
                } else {
                    var st = new StatusCheck({
                        code: response.statusCode,
                        status: 'PROBLEM',
                        date: Date(),
                        address: targetUrl,
                    });
                    st.save((err) => {
                        if (err) {
                            return next(err);
                        }
                        // return res.status(200).send('OK');
                    });
                }
            }
        });
    });    

};