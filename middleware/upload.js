const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s/g, "");

    cb(null, uniqueName);
  },
});

// Allow images + PDF
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpg|jpeg|png|pdf)$/i;

  const extValid = allowedExtensions.test(
    path.extname(file.originalname)
  );

  const mimeValid = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ].includes(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and PDF files are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;