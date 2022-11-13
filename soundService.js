const fs = require("fs");
const { title } = require("process");
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

var Genre = sequelize.define("Genre", {
  genreID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  genre: Sequelize.STRING,
});

Album.belongsTo(Genre, { foreignKey: "genreID" });

sequelize
  .authenticate()
  .then(function () {
    console.log("Connection has been established successfully.");
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

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
      .catch(() => {
        console.log("Database sync failed");
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
      .then((genreData) => {
        resolve(genreData);
      })
      .catch((err) => {
        console.log("CAN'T FIND GENRES! ERROR" + err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
      });
  });
};
