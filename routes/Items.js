const { Router } = require("express");
const { validationResult, check } = require("express-validator");
const router = Router();
const Item = require("../models/itemsModel");

// creating route to fetch all Items from db -------------no login require

router.get("/allItems", async (req, res) => {
  const Items = await Item.find();
  res.send(Items);
});

// Creating Route for adding New Product

router.get(
  "/AddItem",
  [
    check("Image", "Please Add Image of Your Product").notEmpty(),
    check("Name", "Please Add Title of Your Product").notEmpty(),
    check("Price", "Please Add Image of Your Product").notEmpty(),
    check("Rating", "Please Add Rating of Your Product").notEmpty(),
    check("Category", "Please Add Category of Your Product").notEmpty(),
    check("Keywords", "Please Add atleast 1 TAG").notEmpty(),
  ],
  async (req, res) => {
    // checking validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json({ errors: result.array() });
    }
    // adding product
    try {
      const { Image, Name, Price, Rating, Keywords, Category } = req.body;
      const ItemAdd = await Item.create({
        Image: Image,
        Price: Price,
        Name: Name,
        Rating: Rating,
        Keywords: Keywords,
        Category: Category,
      });
      res.send(ItemAdd);
    } catch (error) {
      res.send("Internal error");
    }
  }
);

// Route To delete any product from list
router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const product = await Item.findByIdAndDelete(req.params.id);
    res.send("Product Deleted");
  } catch (error) {
    console.log(error);
    res.send("Internal error");
  }
});

// creating route to update and edit product
router.put(
  "/editproduct/:id",
  [
    check("Image", "Please Add Image of Your Product").notEmpty(),
    check("Name", "Please Add Title of Your Product").notEmpty(),
    check("Price", "Please Add Image of Your Product").notEmpty(),
    check("Rating", "Please Add Rating of Your Product").notEmpty(),
    check("Category", "Please Add Category of Your Product").notEmpty(),
    check("Keywords", "Please Add atleast 1 TAG").notEmpty(),
  ],
  async (req, res) => {
    // checking validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.json({ errors: result.array() });
    }
    const { Image, Name, Price, Rating, Keywords, Category } = req.body;
    try {
      const product = await Item.findById(req.params.id);
      if (!product) {
        return res.send("Product not found");
      }
      const editProduct = {};
      if (Image) {
        editProduct.Image = Image;
      }
      if (Name) {
        editProduct.Name = Name;
      }
      if (Rating) {
        editProduct.Rating = Rating;
      }
      if (Price) {
        editProduct.Price = Price;
      }
      if (Keywords) {
        editProduct.Keywords = Keywords;
      }
      if (Category) {
        editProduct.Category = Category;
      }
      const updatedProduct = await Item.findByIdAndUpdate(
        req.params.id,
        { $set: editProduct },
        { new: true }
      );
      res.send(updatedProduct);
    } catch (error) {
      console.log(error);
      res.send("Internal error");
    }
  }
);

module.exports = router;
