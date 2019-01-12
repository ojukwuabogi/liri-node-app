require("dotenv").config();

// Grab keys from keys.js
var keys = require("./keys");

// Twitter and Spotify API LOAD 
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// File System Client 
var fs = require('fs');

// OMBA DATA //
var request = require('request');

var twitClient = new Twitter(keys.twitter);
var spotClient = new Spotify(keys.spotify); //changed var from spotify

// PROCESS ARGUMENT #2 //
var command = process.argv[2];

// PASS INFO on SPOTIFY or MOVIE API to ARRAY //
var pass = process.argv[3];

// Recent Tweets
function twitGet(){
	twitClient.get('statuses/user_timeline',function(error, tweets, response){
		if(error) throw error;
			for (var i = 0; i < tweets.length; i++){
				console.log(tweets[i].created_at + ": " + tweets[i].user.screen_name + " says: " + tweets[i].text);			
		}
	})
};

// Spotify Request
function spotGet(){
	spotClient.search({type:'track', query: pass}, function(err, data){
		if(err){
            console.log('Error occurred: ' + err);
			return;			
		}
		var results = data.tracks.items;

		console.log ("Found: " + results.length+" results matching "+pass);

		for(var i = 0; i < results.length; i++){
			console.log(" ");
			console.log("Artist: "+results[i].artists[0].name);
			console.log("Song Name: "+results[i].name);
			console.log("Spotify Link: "+results[i].preview_url);
			console.log("Album: "+results[i].album.name);
		}
	})
}

// Movie API Request
function moviGet(){
	request("http://www.omdbapi.com/?t=" + pass + "&y=&plot=short&apikey=trilogy", function(error, response, body){
		if(!error && response.statusCode == 200){

			// JSON Parsed 
            var info = JSON.parse(body);
            
			console.log("Title: " + info.Title);
			console.log("Release Year: " + info.Year);
            console.log("IMDB Rating: " + info.imdbRating);
            console.log("Roteen Tomatoes Rating: " + info.tomatoRating);
			console.log("Production Country: " + info.Country);
            console.log("Language: " + info.Language);
            console.log("Synopsis: "  +info.Plot);
			console.log("Actors; " + info.Actors);
		}
	})
}

// Spotify text
function spotIt(){
	fs.readFile("random.txt", "utf8", function(error, data){

	// Splits and Puts in Array
	var dataArr = data.split(","); 
	command = dataArr[0];
	pass = dataArr[1];
	switch(command){
		case "my tweets":
		twitGet();
		break;
		case "spotify-this-song":
		spotGet();
		break;
		case "movie_this":
		moviGet();
		break;
		}
	})
}

// Switch Commands
	switch(command){
		case "my-tweets":
		twitGet();
		break;
		case "spotify-this-song":
		if(pass == undefined){
			   pass = 'The Sign';
		}
		spotGet();
		break;
		case "movie-this":
		if(pass == undefined){
			   pass = 'Mr. Nobody';
		}
		moviGet();
		break;
		case "do-what-it-says":
		spotIt();
		break;
	}