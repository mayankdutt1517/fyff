const { Schema, model } = require("mongoose");

const itemsSchema = new Schema({
  Image: { type: String, required: true },
  Name: { type: String, required: true },
  Rating: { type: Number, required: true },
  Price: { type: Number, required: true },
  Category: { type: String, required: true },
  Keywords: { type: Array, required: true },
});

const item = model("Item", itemsSchema);

module.exports = item;
