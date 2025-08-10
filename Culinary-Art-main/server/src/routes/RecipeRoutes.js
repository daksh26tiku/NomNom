const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const verifyToken = require("../controllers/authMiddleware");

const {
  createRecipe,
  getRecipesByUser,
  getRecipesByCategory,
  getSearchedRecipes,
  getUniqueKeywords,
  addComment,
  addLike,
  getRecipeById,
  getUserLikedRecipes,
  getMostLikedRecipes,
  getAllRecipes,
  getRecipeByKeywords,
  editRecipe,
  deleteRecipe,
  getOtherRecipes,
  addBookmark,
  getUserBookmarkedRecipes,
} = require("../controllers/RecipeController");

const RPstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/recipeImages");
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

  const imageUrl = `/recipeImages/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: "File uploaded successfully!",
    file: req.file,
    imageUrl: imageUrl, // <-- include the path relative to the server
  });
});

// public routes
router.get("/all-recipes", getAllRecipes);
router.get("/other-recipes/:excludeId", getOtherRecipes);
router.get("/categories", getRecipesByCategory);
router.get("/keywords", getUniqueKeywords);
router.post("/keyword-recipes", getRecipeByKeywords);
router.get("/search", getSearchedRecipes);
router.get("/single-recipe/:id", getRecipeById);
router.get("/popular-recipes", getMostLikedRecipes);

// protected routes
router.use(verifyToken);

router.post("/create", createRecipe);
router.put("/edit/:id", editRecipe);
router.get("/user-recipes", getRecipesByUser);
router.get("/user-liked-recipes", getUserLikedRecipes);
router.get("/user-bookmarked-recipes", getUserBookmarkedRecipes);
router.delete("/delete-recipe/:id", deleteRecipe);
router.put("/like-recipe", addLike);
router.put("/bookmark-recipe", addBookmark);
router.put("/comment-recipe", addComment);

module.exports = router;
