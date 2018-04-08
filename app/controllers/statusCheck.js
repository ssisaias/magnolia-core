const StatusCheck = require('../models/statusCheck');

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
    });
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
