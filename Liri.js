require("dotenv").config();
var keys = require("./keys")
var axios = require("axios")
var Spotify = require("node-spotify-api")
var moment = require("moment")
var fs = require("fs")

// liri.js can take in one of the following commands from Homework Instructions:


// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

// Concert this for bands in town is seen below.
var concert = function(artist){
    var region = ""
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    
    //console.log(queryUrl);
    
    axios.get(queryUrl).then(function(response){
        var concertInfo = response.data
        //if working request 
        if (response.status === 200) {
            
        
            console.log(artist + " concert information:")
            //below is for loop
            for (var i=0; i < concertInfo.length; i++) {
                
                region = concertInfo[i].venue.region
                

                console.log("Venue: " + concertInfo[i].venue.name);
                console.log("Location: " + concertInfo[i].venue.city + ", " + region);
                console.log("Date: " + concertInfo[i].datetime);
            }
        }
        //console.log(response.data);
    })
}

// search spotify and return information
var spotifyThisSong = function(song){
    // Default "The Sign" by Ace of Base
    if (!song){
        song = "The Sign Ace of Base"
    }

    var spotify = new Spotify(keys.spotify); // accessing our spotify key information

    spotify.search({type: "track", query: song, limit: 1}, function (err, data){
        if (err) {
            return console.log(err)
        }

        // Need to return Artist(s), Song Name, Album, Preview link of song from Spotify
        var songInfo = data.tracks.items[0]
        console.log(songInfo.artists[0].name)
        console.log(songInfo.name)
        console.log(songInfo.album.name)
        console.log(songInfo.preview_url)
    })
}

// This will take a movie, search IMDb and return information
var movieThis = function(movie){
    // Default should be "Mr. Nobody"
    if (!movie){
        movie = "Mr.+Nobody"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"; //key is trilogy as asked in instructions
    //console.log(queryUrl);

    // request for response not working/ Was not able to get the below to work.
    axios.get(queryUrl, function(err, response, body){
        // Might delete the if and just have a .then
        if (!err && response.statusCode === 200) {
            // Need to return: Title, Year, IMDB Rating, Rotten Tomatoes Rating, Country, 
            var movieInfo = JSON.parse(response)

            console.log("Title: " + movieInfo.Title)
            console.log("Release year: " + movieInfo.Year)
            console.log("IMDB Rating: " + movieInfo.imdbRating)
            console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
            console.log("Country: " + movieInfo.Country)
            console.log("Language: " + movieInfo.Language)
            console.log("Plot: " + movieInfo.Plot)
            console.log("Actors: " + movieInfo.Actors)
        }
    })
}

// Using the `fs` Node package, LIRI will take the text inside of random.txt
// and then use it to call one of LIRI's commands.
var doWhatItSays = function(){

    // read from file
    fs.readFile("random.txt", "utf8", function (err, data) {
        if(err){
            return console.log(err)
        }
        
        var dataArr = data.split(",")

        // call appropriate function and pass arguement
        runAction(dataArr[0], dataArr[1])
    });
}

// below writes to log file 
var outputData = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err){
        if(err){
            return console.log(err)
        } 
    })
}
//switch below
var runAction = function(func, parm) {
    switch (func) {
        case "concert-this":
            concert(parm)
            break
        case "spotify-this-song":
            spotifyThisSong(parm)
            break
        case "movie-this":
            movieThis(parm)
            break
        case "do-what-it-says":
            doWhatItSays()
            break
        default:
            outputData("That is not a command that I recognize, please try again.") 
    }
}

runAction(process.argv[2], process.argv[3])

