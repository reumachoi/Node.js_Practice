const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const app = express();

mongoose.connect("mongodb://localhost:27017/blog", {
  //기본으로 지원
  //useNewUrlParser, useUnifiedTopology, and useCreateIndex are true, and useFindAndModify is false
});

app.set("view engine", "ejs");

//미들웨어사용 (false-> 기본 내장 querystring 모듈 사용)
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

// localhost:4000
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});
// localhost:4000/articles
app.use("/articles", articleRouter);
app.listen(4000);
