if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// https://medium.com/@dhaniNishant/creating-limit-skip-between-exclude-functions-for-javascript-arrays-4d60a75aaae7
// https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
const express = require("express");
const router = express.Router();
const Member = require("../../models/member");
const Resource = require("../../models/resource");
const Contact = require("../../models/contact");
const Alumni = require("../../models/alumni");
const Archive = require("../../models/archive");
const Blog = require("../../models/blog");
const Faq = require("../../models/faq");

let blogPage = 1;
let archivePage = 1;

// FUNCTIONS
function limit(c) {
  return this.filter((x, i) => {
    if (i <= c - 1) {
      return true;
    }
  });
}
Array.prototype.limit = limit;

function skip(c) {
  return this.filter((x, i) => {
    if (i > c - 1) {
      return true;
    }
  });
}
Array.prototype.skip = skip;

// ROUTES
router.get("/", async (req, res) => {
  let faqs = await Faq.find();
  res.render("client/index", { faqs: faqs });
});

router.get("/members", async (req, res) => {
  let members = await Member.find();
  res.render("client/members.ejs", { members: members });
});

router.get("/resources", async (req, res) => {
  let resources = await Resource.find();
  res.render("client/resources", { resources: resources });
});

router.get("/archives/:category", async (req, res) => {
  let allArchives = await Archive.find({ category: req.params.category }).sort({
    year: -1,
  });

  let allComps = [];
  for (let archive of allArchives) {
    if (!allComps.includes(archive.competition)) {
      allComps.push(archive.competition);
    }
  }

  let pages = Math.ceil(allComps.length / 2);

  if (req.query.page) {
    if (parseInt(req.query.page)) {
      archivePage = parseInt(req.query.page);
    } else {
      if (req.query.page == "prev") {
        if (archivePage == 1) {
          console.log("no prev");
        } else {
          archivePage--;
        }
      } else {
        if (archivePage + 1 > pages) {
          console.log("no next");
        } else {
          archivePage++;
        }
      }
    }
  }

  let comps = allComps.skip(2 * archivePage - 2).limit(2);
  let obj = {};
  for (let comp of comps) {
    let archivesForComp = await Archive.find({
      competition: comp,
      category: req.params.category,
    });
    obj[comp] = archivesForComp;
  }

  res.render("client/archive", {
    pages: pages,
    activePage: archivePage,
    obj: obj,
    comps: comps,
    category: req.params.category,
  });
});

router.get("/blog/:id", async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  let allBlogs = await Blog.find();

  let titles = {};
  for (let blog of allBlogs) {
    titles[blog.title] = blog.id;
  }

  let years = [];
  for (let blog of allBlogs) {
    if (!years.includes(blog.updatedAt.getFullYear())) {
      years.push(blog.updatedAt.getFullYear());
    }
  }

  res.render("client/blo", {
    blog: blog,
    titles: titles,
    years: years,
  });
});

router.get("/blogs", async (req, res) => {
  let allBlogs = await Blog.find();
  let blogs;
  let titles = {};
  for (let blog of allBlogs) {
    titles[blog.title] = blog.id;
  }

  let pages = Math.ceil(Object.keys(titles).length / 6);

  if (req.query.page) {
    if (parseInt(req.query.page)) {
      blogPage = parseInt(req.query.page);
    } else if (req.query.page == "prev") {
      if (blogPage == 1) {
        console.log("no prev");
      } else {
        blogPage -= 1;
      }
    } else {
      if (blogPage + 1 > pages) {
        console.log("no next");
      } else {
        blogPage += 1;
      }
    }
  }

  blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(6 * blogPage - 6)
    .limit(6);

  let years = [];
  for (let blog of blogs) {
    if (!years.includes(blog.updatedAt.getFullYear())) {
      years.push(blog.updatedAt.getFullYear());
    }
  }

  res.render("client/blog", {
    blogs: blogs,
    titles: titles,
    pages: pages,
    activePage: blogPage,
    years: years,
  });
});

router.get("/contacts", async (req, res) => {
  let contacts = await Contact.find();
  res.render("client/contacts", { contacts: contacts });
});
router.get("/alumni", async (req, res) => {
  let years = [];
  let alumniByYear = {};
  let alumnis = await Alumni.find().sort({ year: -1 });
  for (let alumni of alumnis) {
    if (!years.includes(alumni.year)) {
      years.push(alumni.year);
    }
  }

  for (let year of years) {
    alumniByYear[year] = await Alumni.find({ year: year });
  }

  let sortedKeys = Object.keys(alumniByYear).sort((a, b) => b - a);

  res.render("client/alumni", { obj: alumniByYear, keys: sortedKeys });
});

// EXPORT
module.exports = router;
