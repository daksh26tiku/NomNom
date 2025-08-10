const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/authMiddleware");
const multer = require("multer");
const path = require("path");

const {
  signUpVerification,
  createUser,
  loginUser,
  getUser,
  forgetPassVerification,
  resetPassword,
  updatePassword,
  editUser,
  getUserPublicInfo,
} = require("../controllers/UserController");

const RPstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/userImages");
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const datePrefix = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    const ext = path.extname(file.originalname);
    cb(null, `${datePrefix}_${file.originalname}${ext}`);
  },
});

const RPupload = multer({
  storage: RPstorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

router.post("/upload-image", RPupload.single("image"), (req, res) => {
  console.log("UPLOADING");
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const imageUrl = `/userImages/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "File uploaded successfully!",
    file: req.file,
    imageUrl: imageUrl, // <-- include the path relative to the server
  });
});

router.post("/signup-verification", signUpVerification);
router.post("/create-user", createUser);
router.post("/forget-password-verification", forgetPassVerification);
router.post("/reset-password", resetPassword);
router.post("/login", loginUser);
router.get("/user-public-info/:id", getUserPublicInfo);

//protected routes
router.use(verifyToken);

router.get("/user-info", getUser);
router.put("/edit-user-info", editUser);
router.patch("/update-password", updatePassword);

module.exports = router;
