var debug = require( 'debug' ),
    verbose = debug( 'twtstats-verbose' ),
    log = debug( 'twtstats:main' ),
    path = require( 'path' ),
    readline = require('readline'),
    request = require( 'request' ),
    Stream = require('stream'),
    fs = require( 'fs' ),
    Tweet = require( './entities/tweet' ),
		Matrix = require( './entities/matrix' ),
		stats = require( './libs/stats' ),
    tweets = [],
    tweetsLength = 0,
    inStream, outStream;

var DAYS = 7,
    HOUR_RANGE = 4,
    URL_CSV = process.env.URL_CSV || null;

outStream = new Stream();
outStream.readable = true;
outStream.writable = true;
inStream = URL_CSV ? request.get( URL_CSV ) 
                   : fs.createReadStream( path.join( __dirname, 'db',  'blackfriday2013.csv' ) );

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
        matrixIndexRetwts, matrixIndexFavs, matrixIndexWeight, matrixTwetsPerDayAndHour,
        bestScoreInWeekForRetwts, bestScoreInWeekForFavs, bestScoreInWeekForWeigth, bestScoreInWeekForTwetsPerDayHour,
        bestScoreNextDayForRetwts, bestScoreNextDayForFavs, bestScoreNextDayForWeigth, bestScoreNextDayForTwetsPerDayHour;

		log( 'Sample %d tweets', tweets.length );
    verbose( "Tweets: %j", tweets );

		buckets = stats.distribution( tweets, Array.apply(null, /*7 Days X 4 Hours_Rage*/ Array( DAYS * HOUR_RANGE ) ).map( function(){ return []; } ) );

    // To create the matrix first I get the median using a specific key. After that, percentages are calculated using the max. value in the array. 
		matrixIndexRetwts = new Matrix( stats.scale( stats.median( buckets, 'retwts' ) ), HOUR_RANGE, DAYS, 'Index Retwts' );
		matrixIndexFavs = new Matrix( stats.scale( stats.median( buckets, 'favs' ) ), HOUR_RANGE, DAYS, 'Index Favs' );
		matrixIndexWeight = new Matrix( stats.scale( stats.median( buckets, 'weight' ) ), HOUR_RANGE, DAYS, 'Index Weight' );

    bestScoreInWeekForRetwts = matrixIndexRetwts.bestScore();
    bestScoreInWeekForFavs = matrixIndexFavs.bestScore();
    bestScoreInWeekForWeigth = matrixIndexWeight.bestScore(); 

    bestScoreNextDayForRetwts = matrixIndexRetwts.bestScore( ( new Date().getDay() + 1 ) % DAYS );
    bestScoreNextDayForFavs = matrixIndexRetwts.bestScore( ( new Date().getDay() + 1 ) % DAYS );
    bestScoreNextDayForWeigth = matrixIndexRetwts.bestScore( ( new Date().getDay() + 1 ) % DAYS );

    //BONUS: When the people is more active in twitter  
    matrixTwetsPerDayAndHour = new Matrix( buckets.map( function( bucket ){ return bucket.length } ), HOUR_RANGE, DAYS, 'Tweets Per Day/Hour (Bonus)' );
    bestScoreInWeekForTwetsPerDayHour = matrixTwetsPerDayAndHour.bestScore();
    bestScoreNextDayForTwetsPerDayHour = matrixTwetsPerDayAndHour.bestScore( ( new Date().getDay() + 1 ) % DAYS );

    log( "\n%s\n", matrixIndexRetwts.print() );
    log( "On %s. at %s is the optimal combination to get retwts", bestScoreInWeekForRetwts.day, bestScoreInWeekForRetwts.range );
    log( "Tomorrow %s. at %s is the optimal combination to get retwts", bestScoreNextDayForRetwts.day, bestScoreNextDayForRetwts.range );

    log( "\n%s\n", matrixIndexFavs.print() );
    log( "On %s. at %s is the optimal combination to get favs", bestScoreInWeekForFavs.day, bestScoreInWeekForFavs.range );
    log( "Tomorrow %s. at %s is the optimal combination to get favs", bestScoreNextDayForFavs.day, bestScoreNextDayForFavs.range );

    log( "\n%s\n", matrixIndexWeight.print() );
    log( "On %s. at %s is the optimal combination to get the best tweets", bestScoreInWeekForWeigth.day, bestScoreInWeekForWeigth.range );
    log( "Tomorrow %s. at %s is the optimal combination to get the best tweets", bestScoreNextDayForWeigth.day, bestScoreNextDayForWeigth.range );

    log( "\n%s\n", matrixTwetsPerDayAndHour.print() );
    log( "On %s. at %s the people is more active in twitter", bestScoreInWeekForTwetsPerDayHour.day, bestScoreInWeekForTwetsPerDayHour.range );
    log( "Tomorrow %s. at %s the people is more active in twitter", bestScoreNextDayForTwetsPerDayHour.day, bestScoreNextDayForTwetsPerDayHour.range );

  } );
