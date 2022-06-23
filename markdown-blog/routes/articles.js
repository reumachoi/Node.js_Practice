const express = require("express");
const Article = require("./../models/article");
const router = express.Router();

//새 글 쓰기로 이동
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

//해당 글 수정하기로 이동
router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

//해당 글 더보기로 이동
router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

//글 저장
router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next(); //다음 미들웨어로 이동
  },
  saveArticleAndRedirect("new") //실행
);

//글 수정
router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`); //글저장 성공시 해당글 이동
    } catch (e) {
      console.log(e);
      res.render(`articles/${path}`, { article: article }); //실패시 들어온 path페이지 머물기
    }
  };
}

module.exports = router;
