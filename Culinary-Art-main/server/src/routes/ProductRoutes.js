const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getAllProducts,
  getSearchedProducts,
  getSingleProduct,
  getProductCategory,
  getFilteredProducts,
  getFilterData,
  createProduct,
} = require("../controllers/ProductController");
const verifyToken = require("../controllers/authMiddleware");

const RPstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/productImages");
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

  const imageUrl = `/productImages/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "File uploaded successfully!",
    file: req.file,
    imageUrl: imageUrl, // <-- include the path relative to the server
  });
});

// Get all products
router.get("/", getFilteredProducts); // Replace with the new filtered function

// Get filter data (categories and price range)
router.get("/filter-data", getFilterData);

// Get products by search term
router.get("/search/:name", getSearchedProducts);

// Get products by category
router.get("/category/:category", getProductCategory);

// Get single product
router.get("/single-product/:id", getSingleProduct);

router.use(verifyToken);

router.post("/create-product", createProduct);

module.exports = router;
