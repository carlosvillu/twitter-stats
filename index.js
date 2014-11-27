var debug = require( 'debug' ),
		sparkly = require( 'sparkly' ),
    verbose = debug( 'twtstats-verbose' ),
    log = debug( 'twtstats:main' ),
    path = require( 'path' ),
    readline = require('readline'),
    Stream = require('stream'),
    fs = require( 'fs' ),
    Tweet = require( './entities/tweet' ),
		Matrix = require( './libs/matrix' ),
		stats = require( './libs/stats' ),
    tweets = [],
    tweetsLength = 0,
    inStream, outStream;

outStream = new Stream();
outStream.readable = true;
outStream.writable = true;
inStream = fs.createReadStream( path.join( __dirname, 'db',  'blackfriday2013.csv' ) );

readline.createInterface( { input: inStream, output: outStream, terminal: false} )
  .on( 'line', function( line ){
    var twt = line.split( /,/ ),
        favs = parseInt( twt[4], 10 ),
        retwts = parseInt( twt[3], 10 ),
        date = twt[5];
    if( !isNaN(favs) && !isNaN(retwts) && date )
    {
      verbose( "[%s]favs(%s) retweets(%s) date(%s)", twt[0], twt[4], twt[3], twt[5] );
      tweets[tweetsLength++] = new Tweet( retwts, favs, date );
    } else {
			verbose( 'Invalid tweet %j', twt );
		}

  } )
  .on( 'close', function(){
		var buckets = [],
				twts_per_bucket = [],
				retwts_per_bucket = [],
				favs_per_bucket = [],
				weight_per_bucket = [],
				median_retwts_per_bucket = [],
				index_retwts_per_bucket = [];

		log( 'Sample %d tweets', tweets.length );
    verbose( "Tweets: %j", tweets );

		buckets = stats.distribution( tweets, Array.apply(null, /*7 Days X 4 Hours_Rage*/ Array( 28 ) ).map( function(){ return []; } ) );
		twts_per_bucket = buckets.map( function( bucket ){ return bucket.length; } );
		retwts_per_bucket = stats.acc( buckets, 'retwts' );
		favs_per_bucket = stats.acc( buckets, 'favs' );
		weight_per_bucket = stats.acc( buckets, 'weight' );
		log( "Twts per buckets %j", twts_per_bucket );
		log( "ReTwts per buckets %j", retwts_per_bucket );
		log( "Favs per buckets %j", favs_per_bucket );
		log( "Weight per buckets %j", weight_per_bucket );

		median_retwts_per_bucket = stats.median( buckets, 'retwts' );
		index_retwts_per_bucket = stats.scale( median_retwts_per_bucket );
		log( 'Median Retwts per buckets %j', median_retwts_per_bucket );
		log( 'Index Retwts per buckets %j', index_retwts_per_bucket );

		matrix = new Matrix( index_retwts_per_bucket, 4, 7, 'Index Retwts' );
		log( "\n %s", matrix.print() );


  } );
