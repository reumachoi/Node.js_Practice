const express = require("express");
const articleRouter = require("./routes/articles");
const app = express();

app.set("view engine", "ejs");

// localhost:4000/articles
app.use("/articles", articleRouter);

// localhost:4000
app.get("/", (req, res) => {
  const articles = [
    {
      title: "Test Articles",
      createdAt: new Date(),
      desc: "Test desc",
    },
    {
      title: "Test Articles2",
      createdAt: new Date(),
      desc: "Test desc2",
    },
  ];
  res.render("articles/index", { articles: articles });
});

app.listen(4000);
