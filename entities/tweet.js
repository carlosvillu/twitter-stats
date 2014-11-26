var Tweet;

Tweet = function( retwts, favs, date ){
  this._retwts = retwts;
  this._favs = favs;
  this._range = this.__rangeFromDate( date );
  this._day = this.__dayFromDate( date )
};

Tweet.prototype.__rangeFromDate = function( date ){};
Tweet.prototype.__dayFromDate = function( date ){};

module.exports = Tweet;
