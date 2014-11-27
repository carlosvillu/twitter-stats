var debug = require( 'debug' ),
    verbose = debug( 'verbose:twtstats' ),
    Tweet;

Tweet = function( retwts, favs, date ){
  this._retwts = retwts;
  this._favs = favs;
  this._range = this.__rangeFromDate( date );
  this._day = this.__dayFromDate( date )
	this._weight = favs + ( 2 * retwts ); // Retwt are more important than the favs
};

Tweet.prototype.attr = function( key ){
	return this[ '_' + key ] || null;
};

/**
 * 00:00 - 06:00 => 0
 * 06:00 - 12:00 => 1
 * 12:00 - 18:00 => 2
 * 18:00 - 00:00 => 3
 * */
Tweet.prototype.__rangeFromDate = function( date ){
  var hours = new Date( date ).getHours();
  return parseInt( hours/6, 10 );
};

/**
 * Sunday is zero and saturday is six
 * */
Tweet.prototype.__dayFromDate = function( date ){
  return new Date( date ).getDay(); // Sunday based
};

module.exports = Tweet;
