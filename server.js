const express = require("express");
const { connect } = require("mongoose");
require("dotenv").config();
const usercontroller = require("./routes/usercontrollers");
const items = require("./routes/Items");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.json());

app.use(cors());
app.use("/api/user", usercontroller);
app.use("/api/products", items);

app.use(express.static(path.join(__dirname, "./frontend/dist")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});

connect(process.env.URI)
  .then(
    app.listen(3000, () =>
      console.log(`server running on port ${process.env.port}`)
    )
  )
  .catch((error) => console.log(error));
