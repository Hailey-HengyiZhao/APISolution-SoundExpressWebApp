const express = require("express");
const app = express();
const path = require("path");

const multer = require("multer");
const cloudinary = require("cloudinary");
const sstreamifier = require("streamifier");

const env = require("dotenv");
env.config();

const soundService = require("./soundService"); //import soundService.js

const HTTP_PORT = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: "dwleas0js", //process.env.CLOUD_NAME (private)
  api_key: "353252431234466",
  api_secret: "YYpEl4oJnukC1VSrQ1GYctxaGXU",
  secure: true,
});

const upload = multer(); // no {storage: storage}

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

app.get("/albums/new", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/albumForm.html"));
});

//get the specific id page
app.get("/albums/:id", (req, res) => {
  //console.log(req.params);
  soundService
    .getAlbumById(req.params.id)
    .then((album) => {
      res.json(album);
    })
    .catch((err) => {
      res.json(err);
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

//name of the middleware(file name)
app.post("/albums/new", upload.single("albumCover"), (res, req) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }

  function processPost(imageUrl) {
    req.body.albumCover = imageUrl;
    soundService.addAlbum(req.body).then(() => {
      res.redirect("/albums");
    });
    // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
  }
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
