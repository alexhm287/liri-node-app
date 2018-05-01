

require("dotenv").config();
var keys = require("./keys");

var fs = require('fs');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

 var spotify = new Spotify(keys.spotify);

 var omdbUrl = "https://www.omdbapi.com/?apikey="+ keys.omdb.id  + "&type=movie&plot=short&t=";

 var responder = function(err, response, body) {
 		var title = body.Title;
 		if (!title) {
 			mylogger("movie not found!");
 			return;
 		}
      	var year = body.Year;
      	var imdb = body.imdbRating; 
      	var ratings = body.Ratings;
      	var rottenTRating = "";
      	if (ratings) {
	      	for (var i = 0; i<ratings.length; i++) {
	      		var r = ratings[i];
	      		if (r.Source == "Rotten Tomatoes") {
	      			rottenTRating = r.Value;
	      		}
	      	}
	      }
      	var country = body.Country;
      	var language = body.Language;
      	var actors = body.Actors;
      	//var genre = body.Genre;
      	var plot = body.Plot;	      	
      	//var poster = body.Poster;
      	mylogger("title " + title);
      	mylogger("year " + year);
      	mylogger("imdb " +imdb);
      	mylogger("rotten tomatoes rating " + rottenTRating);
      	mylogger("country " + country);
      	mylogger("language " + language);
      	mylogger("actors " + actors);
      	mylogger("plot " + plot);

      }

function mylogger(txt) {
	console.log(txt);
	writeToLog(txt);
}

function getSongFromSpot(song) {
	if (!song) {
		song = "The Sign by Ace of Base";
	}

	spotify.search({ type: 'track', query: song}, function(err, data) {
			  if (err) {
			    return mylogger('Error occurred: ' + err);
			  }
			 var track = data.tracks.items[0];
			 var artists = track.artists;
			 var aString = "";
			 for (var i = 0; i<artists.length; i++) {
			 		var a = artists[i];
			 		aString += a.name + ", "; 
			 }
			 mylogger("artists: " + aString);
			 mylogger("track name: " + track.name);
			 mylogger("song preview link: " + track.href);
			 mylogger("track album name: " + track.album.name);
			
			});
}


 function getMovieData(search) {
 	var request = require('request');
 	request.post(omdbUrl + search, {json: true}, responder);

	
}
 
function writeToLog(logEntry) {
	fs.appendFile('log.txt', logEntry + "\n", function(err) {  
        // console.log(logEntry);
	});
}

 //console.log(process.argv);

 //console.log(process.argv[2]);

 var cmd = process.argv[2];
 mylogger(cmd);

 var client = new Twitter(keys.twitter);

function mult(a, b) {
	var m = a * b;
	return m;
}



if (cmd == "my-tweets") {
	mylogger("retrieving tweets");
	var params = {screen_name: 'playadisco', count:20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    for (var i = 0 ; i<tweets.length; i++) {
	    	var tweet = tweets[i];
	    	mylogger(tweet.created_at);
	    	mylogger(tweet.text);
	    }
	  }
	});
}
// need to make sure it's getting the song from spotify , what's my node command? 
else if (cmd == "do-what-it-says") {	
	var song = "";
	var randomTxt;
	fs.readFile('./random.txt', function read(err, data) {
	    if (err) {
	        throw err;
	    }
	    randomTxt = data + "";
	  
		var s = randomTxt.split(",");
		if (s[0] === "spotify-this-song") {
			song = s[1];
		}

		getSongFromSpot(song);
	});

	
}
else if (cmd == "movie-this") {	
	var movie = process.argv[3];
	if (!movie) {
		movie = "Mr. Nobody";
	}
	getMovieData(movie);
	
}
else if (cmd == "spotify-this-song") {
	var song = process.argv[3];
	getSongFromSpot(song)

}

// this part already done , just for handling errors. 
else {
	mylogger("command not recognized: " + cmd );
}







