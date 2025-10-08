const express = require("express");
const {
  getAllProduct,
  getProductCategory,
  addNewProduct,
  singleProduct,
} = require("../controller/ProductController");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/allproduct", getAllProduct);
router.get("/allcategory", getProductCategory);
router.post("/addproduct", upload.single("product_image"), addNewProduct);
router.get("/product/:productId", singleProduct);
module.exports = router;
