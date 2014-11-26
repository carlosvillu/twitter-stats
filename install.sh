DIR_BASE=`pwd`
CSV_FILE="blackfriday2013.csv"
CSV_URL="https://dl.dropboxusercontent.com/u/1478817/blackfriday2013.csv"

if [ ! -f "$DIR_BASE/db/$CSV_FILE" ]
then
  wget -O "$DIR_BASE/db/$CSV_FILE" $CSV_URL 
fi
