require("dotenv").config();

// Grab keys from keys.js
var keys = require("./keys");

// Spotify API LOAD 

var Spotify = require('node-spotify-api');

// File System Client 
var fs = require('fs');

// OMBA DATA //iit
var request = require('request');
var spotClient = new Spotify(keys.spotify); //changed var from spotify

// PROCESS ARGUMENT #2 //
var command = process.argv[2];

// PASS INFO on SPOTIFY or MOVIE API to ARRAY //
var pass = process.argv[3];

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
		
		case "spotify-this-song":
		if(pass == undefined){
               
               pass =' Whats My Age Again by Blink-182';
              
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
    
   