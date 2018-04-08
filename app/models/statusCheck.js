
/* !
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Status schema
 */

var statusSchema = new Schema({
  code: { type: String, default: '' },
  status: { type: String, default: '' },
  date: { type: Date, default: '' },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

statusSchema.method({

});

/**
 * Statics
 */

statusSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('Status', statusSchema);
