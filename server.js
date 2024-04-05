const express = require("express");
const mongoose = require("mongoose");
const shortUrls = require("./models/shortUrls");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

//Use ejs engine
app.set("view engine", "ejs");
//Connecting Database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected Succesfully");
    app.listen(process.env.PORT || 5000);
  })
  .catch((error) => console.log(error));

//To help use body parse
app.use(express.urlencoded({ extended: false }));

//To
app.get("/", async (req, res) => {
    /* If browser back button was used, flush cache */
  const shortUrl = await shortUrls.find();
  res.render("index", { shortUrls: shortUrl });
});

app.post("/shortUrls", async (req, res) => {
  await shortUrls.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await shortUrls.findOne({ short: req.params.shortUrl });
  console.log(req.params.shortUrl);
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});
/* If browser back button was used, flush cache */
