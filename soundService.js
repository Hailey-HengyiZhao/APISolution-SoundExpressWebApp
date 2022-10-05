const fs = require("fs");

let albums = [];
let genres = [];

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    //read data
    fs.readFile("./data/albums.json", "utf8", (err, data) => {
      if (err) {
        console.log("there's been an error!! ERROR: " + err);
        reject(err);
      } else {
        //console.log(data);
        albums = JSON.parse(data);

        //read the genre
        fs.readFile("./data/genres.json", "utf8", (err, data) => {
          if (err) {
            console.log("there's been an error!! ERROR: " + err);
            reject(err);
          } else {
            //console.log(data);
            genres = JSON.parse(data);

            //send back the file
            resolve("Success!");
          }
        });
      }
    });
  });
};

module.exports.getAlbums = () => {
  return new Promise((resolve, reject) => {
    if (albums.length > 0) resolve(albums);
    else reject("no albums");
  });
};

module.exports.getGenres = () => {
  return new Promise((resolve, reject) => {
    if (genres.length > 0) resolve(genres);
    else reject("no genres");
  });
};

module.exports.getAlbumById = (id) => {
  return new Promise((resolve, reject) => {
    let result;
    albums.forEach((album) => {
      if (album.id ==id) result = album;
    });
    if (result) {
      return resolve(result);
    } else {
      reject("no album matches!");
    }
  });
};
