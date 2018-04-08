const StatusCheck = require('../models/statusCheck');
var request = require('request');
/**
 * GET /m/:name
 * Send Message Page for public user
 */
exports.getStatuses = (req, res, next) => {
    StatusCheck.find({} , (err, statuses) => {
        if (err) {
            return next(err);
        }
        if (!statuses) {
            // 204 - no content
            return res.status(204).send('No content');
        }
        return res.status(200).send(statuses);
    }).sort({ date:-1 });
};

/* Test create*/
exports.testAddNew = (req, res, next) => {
    var st = new StatusCheck({ code: 'ahaha', status:'test', date: Date() });
    st.save((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).send('OK');
    });
};

/* Make a requisition to sistemas.quixada.ufc*/
exports.makereq = (req, res, next) => {
    console.log('Trying To HIT https://httpstat.us/200');
    request('https://hdasdsdfarfqrft.us/400',{ timeout:'30000' }, function (error, response) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (error){
            var st = new StatusCheck({ code: error.Error, status:'OFFLINE', date: Date() });
            st.save((err) => {
                if (err) {
                    return next(err);
                }
                // return res.status(200).send('OK');
            });
        }
        if (response && response.statusCode){
            if (response.statusCode.toString().startsWith('2')){
                var st = new StatusCheck({ code: response.statusCode, status:'ONLINE', date: Date() });
                st.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    // return res.status(200).send('OK');
                });
            }
            else {
                var st = new StatusCheck({ code: response.statusCode, status:'PROBLEM', date: Date() });
                st.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    // return res.status(200).send('OK');
                });
            }
        }
    });
/* 
    var st = new StatusCheck({ code: 'ahaha', status:'test', date: Date() });
    st.save((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).send('OK');
    }); */
};
