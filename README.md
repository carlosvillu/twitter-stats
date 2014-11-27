twitter stats
=============

Twitter statistics

### Install

Dependencies: 

* nodeJS 0.10
* npm 1.4

#### How to install

        $ git clone https://github.com/carlosvillu/twitter-stats
        $ cd twitter-stats
        $ npm install

#### How to use

Basic use involves a csv in the filesystem. To view all stats use the following instruction,

		$ DEBUG=twtstats:* node inde.js
		
It is also possible to use an online csv file as a data source.

		$ DEBUG=twtstats:* URL_CSV=https://dl.dropboxusercontent.com/u/1478817/blackfriday2013.csv node index.js
		
Last, to get a verbose output, use `DEBUG=*`

### Description

The goal of this script is to show a statistical study on the impact of day of the week and time slots on a series of tweet aspects. Specifically, number of retweets and number of favorites. The script also includes a bespoke index that combines these two aspects, assigning different weights to retweets and favorites: `Favs+(2xRtwts)`.

Additionally, the script includes information about Twitter use as a function of day of the week and time slot.



