console.log('this is loaded'); // We have this working when running node in bash/terminal

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
