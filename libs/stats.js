var debug = require( 'debug' ),
    verbose = debug( 'twtstats-verbose' ),
		numbers = require( 'numbers' ),
    log = debug( 'twtstats:libs:stats' );

var HOUR_RANGE = 4;

module.exports = {
	distribution: function( twts, buckets ){
		buckets = twts.reduce( function(buckets, twt ){
			var day = twt.attr( 'day' ),
					range = twt.attr( 'range' ),
					index = parseInt( '' + ( ( day * HOUR_RANGE ) + range ), 10  ),
					bucket = buckets[ index ];

			bucket.push( twt );
			buckets[ index ] = bucket;
			return buckets;

		}, buckets );

		verbose( 'Distribution %j',buckets );
		return buckets;
	},

	acc: function( list, key ){
		return list.map( function( bucket ){
			return bucket.reduce( function( acc, twt ){
				return acc + twt.attr( key );
			}, 0 );
		} );
	},

	median: function( list, key ){
		return list.map( function( bucket ){
			return numbers.statistic.median( bucket.map( function( twt ){
				return twt.attr( key );
			} ) );
		} );
	},

	scale: function( list ){
		var max = Math.max.apply( Math, list.map( function( val ){ return val || 0; } ) );
		return list.map( function( value ){
			var val = value || 0;
			return parseFloat( ( ( val * 100 ) / max ).toFixed( 2 ) );
		} );
	}

};
