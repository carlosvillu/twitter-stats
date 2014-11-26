var debug = require( 'debug' )( 'twtstats' ),
    path = require( 'path' ),
    readline = require('readline'),
    Stream = require('stream'),
    fs = require( 'fs' ),
    Tweet = require( './entities/tweet' ),
    tweets = [],
    tweetsLength = 0,
    inStream, outStream;

outStream = new Stream();
outStream.readable = true;
outStream.writable = true;
inStream = fs.createReadStream( path.join( __dirname, 'db',  'blackfriday2013.csv' ) ); 

readline.createInterface( { input: inStream, output: outStream, terminal: false} )
  .on( 'line', function( line ){
    var twt = line.split( /\t/ ),
        favs = parseInt( twt[4], 10 ),
        retwts = parseInt( twt[3], 10 )
        date = twt[5];
    if( favs && retwts && date )
    {
      //debug( "[%s]favs(%s) retweets(%s) date(%s)", twt[0], twt[4], twt[3], twt[5] );
      tweets[tweetsLength++] = new Tweet( retwts, favs, date );
    }
  } )
  .on( 'close', function(){
    debug( "Tweets: %d", tweets.length );
  } );
