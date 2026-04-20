const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = {
  single: upload.single.bind(upload),
  array: upload.array.bind(upload),
};