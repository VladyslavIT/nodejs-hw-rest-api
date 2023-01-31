const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { v4 } = require("uuid");

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "temp"));
  },
  filename: function (req, file, callback) {
    callback(null, file.v4());
  },
});

const upload = multer({
  storage,
});

app.listen(3000, () => {
  console.log("Port listen on 3000");
});

module.exports = upload;
