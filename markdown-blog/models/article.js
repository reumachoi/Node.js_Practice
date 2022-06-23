const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurifier = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurifier(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});

//데이터 모델을 저장,삭제,수정때마다 validate하기전 pre() 콜백함수 실행
articleSchema.pre("validate", function () {
  if (this.title) {
    this.slug = slugify(this.title, {
      //slugify : 텍스트를 url주소로 변환
      lower: true, //소문자 변환
      strict: true, //특수문자 제거
    });
  }

  if (this.markdown) {
    //https://niharraoteblog.netlify.app/vue-markdown-editor
    //링크 참고하면 변환된 HTML을 검사해서 안전한지 확인하기위해 DOMpurity를 사용하는 듯.
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown));
  }
});

module.exports = mongoose.model("Article", articleSchema);
