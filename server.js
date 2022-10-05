// const readFile = require("./readFile");

// readFile.readMyFile("./data/albums.json").then(function(data){
//     console.log(data);

// }).catch(function(err){
//     console.log("ERROR:"+err);
// })

const express = require("express");
const app = express();
const path = require("path");

const HTTP_PORT = process.env.PORT || 8080;
const soundService = require("./soundService"); //import soundService.js

function onHttpStart() {
  console.log("Express http sever listening on :" + HTTP_PORT);
}

app.use(express.static("public"));

app.get("/", (req, res) => {
  //res.send("Hello, welcome to soundExpress");
  //res.send("/about");
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/albums", (req, res) => {
  soundService
    .getAlbums()
    .then((albums) => {
      res.json(albums);
    })
    .catch((err) => {
      console.log(err);
      res.send("there's been a error!");
    });
});

app.get("/genres", (req, res) => {
  soundService
    .getGenres()
    .then((genres) => {
      res.json(genres);
    })
    .catch((err) => {
      console.log(err);
      res.send("there's been a error!");
    });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

//read the resource Step 1: Obtaining the Data
soundService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart()); //once the resource has been read, we listen the website
  })
  .catch((err) => {
    console.log(err);
  });
