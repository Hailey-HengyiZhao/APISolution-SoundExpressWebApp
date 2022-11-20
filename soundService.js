const fs = require("fs");
const env = require("dotenv");
env.config();
const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "mxhagusa",
  "mxhagusa",
  "RcTbStCUZ0o9lp5bBZYvSoS0eGFuX8RL",
  {
    host: "peanut.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

//album model
var Album = sequelize.define("Album", {
  albumID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: Sequelize.STRING,
  artist: Sequelize.STRING,
  albumCover: Sequelize.STRING,
  year: Sequelize.INTEGER,
});

//genre model
var Genre = sequelize.define("Genre", {
  genreID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  genre: Sequelize.STRING,
});

//song model
var Song = sequelize.define("Song", {
  songID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: Sequelize.STRING,
  songFile: Sequelize.STRING,
});

// relationship between Album and Genre: Album belongs to Genre
Song.belongsTo(Album, { foreignKey: "albumID" });
Album.belongsTo(Genre, { foreignKey: "genreID" });

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    // fs.readFile("./data/albums.json", "utf8", (err, data) => {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     // console.log(data)
    //     albums = JSON.parse(data);
    //     fs.readFile("./data/genres.json", "utf8", (err, data) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         // console.log(data)
    //         genres = JSON.parse(data);
    //         resolve("Success!");
    //       }
    //     });
    //   }
    // });

    sequelize
      .sync()
      .then(() => {
        console.log("Database sync completed");
        resolve();
      })
      .catch((err) => {
        console.log("Database sync failed! Error: " + err);
        reject();
      });
  });
};

module.exports.getAlbums = () => {
  return new Promise((resolve, reject) => {
    Album.findAll()
      .then((albumData) => {
        resolve(albumData);
      })
      .catch((err) => {
        console.log("CAN'T FIND ALBUM! ERROR" + err);
        reject();
      });
  });
};

module.exports.getAlbumById = (id) => {
  return new Promise((resolve, reject) => {
    Album.findAll({
      where: {
        albumID: id,
      },
    })
      .then((album) => {
        resolve(album);
      })
      .catch((err) => {
        console.log("CAN'T FIND ALBUM BY ID! ERROR" + err);
        reject();
      });
  });
};

module.exports.getGenres = () => {
  return new Promise((resolve, reject) => {
    Genre.findAll()
      .then((genreData) => {
        resolve(genreData);
      })
      .catch((err) => {
        console.log("CAN'T FIND GENRES! ERROR" + err);
        reject();
      });
  });
};

module.exports.addGenre = (genre) => {
  return new Promise((resolve, reject) => {
    Genre.create(genre)
      .then(() => {
        console.log("Genre created");
        resolve();
      })
      .catch((err) => {
        console.log("GENRE CREATION ERROR! Error: " + err);
        reject();
      });
  });
};

module.exports.addAlbum = (album) => {
  return new Promise((resolve, reject) => {
    Album.create(album)
      .then(() => {
        console.log("Album created");
        resolve();
      })
      .catch((err) => {
        console.log("ALBUM CREATION ERROR! Error: " + err);
        reject();
      });
  });
};

module.exports.getAlbumsByGenre = (genreID) => {
  return new Promise((resolve, reject) => {
    Album.findAll({
      where: {
        genreID: genreID,
      },
    })
      .then((albums) => {
        resolve(albums);
      })
      .catch((err) => {
        console.log("CAN'T FIND ALBUM BY GENRE! Error: " + err);
        reject();
      });
  });
};

module.exports.deleteAlbum = (albumID) => {
  return new Promise((resolve, reject) => {
    Album.destroy({
      where: {
        albumID: albumID,
      },
    })
      .then(() => {
        console.log("Album deleted");
        resolve();
      })
      .catch((err) => {
        console.log("ALBUM DELETION ERROR! Error: " + err);
        reject();
      });
  });
};

module.exports.deleteGenre = (genreID) => {
  return new Promise((resolve, reject) => {
    Genre.destroy({
      where: {
        genreID: genreID,
      },
    })
      .then(() => {
        console.log("Genre deleted");
        resolve();
      })
      .catch((err) => {
        console.log("GENRE DELETION ERROR! Error: " + err);
        reject();
      });
  });
};

module.exports.getSongs = (albumID) => {
  return new Promise((resolve, reject) => {
    Song.findAll({
      where: {
        albumID: albumID,
      },
    })
      .then((songs) => {
        resolve(songs);
      })
      .catch((err) => {
        console.log("CAN'T FIND SONGS BY THIS ALBUM ID! ERROR" + err);
        reject();
      });
  });
};

module.exports.addSong= (song) => {
  return new Promise((resolve, reject) => {
    Song.create(song)
      .then(() => {
        console.log("Song created");
        resolve();
      })
      .catch((err) => {
        console.log("SONG CREATION ERROR! Error: " + err);
        reject();
      });
  });
};

module.exports.deleteGenre = (songID) => {
  return new Promise((resolve, reject) => {
    Song.destroy({
      where: {
        songID: songID,
      },
    })
      .then(() => {
        console.log("Song deleted");
        resolve();
      })
      .catch((err) => {
        console.log("SONG DELETION ERROR! Error: " + err);
        reject();
      });
  });
};

