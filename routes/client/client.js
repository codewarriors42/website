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
const Events = require("../../models/event");

let blogPage = 1;

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
  let members = await Member.find().sort({ pos: 1 });
  res.render("client/members.ejs", { members: members });
});

router.get("/resources", async (req, res) => {
  let resources = await Resource.find();
  res.render("client/resources", { resources: resources });
});

router.get("/archives", async (req, res) => {
  return res.redirect("/archives/Creative%20Work");
});

router.get("/archives/:category", async (req, res) => {
  let allArchives = await Archive.find({ category: req.params.category }).sort({
    year: -1,
  });

  if (allArchives.length === 0) {
    return res.redirect("/404");
  }

  let allEvents = [];
  let prEvents = [];
  let getEvents = await Events.find();
  for (let event of getEvents) {
    prEvents.push(event.name);
  }

  for (let event of prEvents) {
    for (let archive of allArchives) {
      if (archive.event == event) {
        if (!allEvents.includes(event)) allEvents.push(event);
      }
    }
  }

  let events = allEvents;
  let obj = {};
  for (let event of events) {
    let archivesForComp = await Archive.find({
      event: event,
      category: req.params.category,
    }).sort({ year: -1 });
    obj[event.toString()] = archivesForComp;
  }

  res.render("client/archive", {
    obj: obj,
    events: events,
    category: req.params.category,
  });
});

// router.get("/blog/:id", async (req, res) => {
//   let blog = await Blog.findById(req.params.id);
//   let allBlogs = await Blog.find();

//   let titles = {};
//   for (let blog of allBlogs) {
//     titles[blog.title] = blog.id;
//   }

//   let years = [];
//   for (let blog of allBlogs) {
//     if (!years.includes(blog.updatedAt.getFullYear())) {
//       years.push(blog.updatedAt.getFullYear());
//     }
//   }

//   res.render("client/blo", {
//     blog: blog,
//     titles: titles,
//     years: years,
//   });
// });

// router.get("/blogs", async (req, res) => {
//   let allBlogs = await Blog.find();
//   let noBlog = false;
//   if (allBlogs.length == 0) {
//     noBlog = true;
//   }
//   let blogs;
//   let titles = {};
//   for (let blog of allBlogs) {
//     titles[blog.title] = blog.id;
//   }

//   let pages = Math.ceil(Object.keys(titles).length / 6);

//   if (req.query.page) {
//     if (parseInt(req.query.page)) {
//       blogPage = parseInt(req.query.page);
//     }
//   } else {
//     blogPage = 1;
//   }

//   blogs = await Blog.find()
//     .sort({ createdAt: -1 })
//     .skip(6 * blogPage - 6)
//     .limit(6);

//   let years = [];
//   for (let blog of blogs) {
//     if (!years.includes(blog.updatedAt.getFullYear())) {
//       years.push(blog.updatedAt.getFullYear());
//     }
//   }

//   res.render("client/blog", {
//     blogs: blogs,
//     titles: titles,
//     pages: pages,
//     activePage: blogPage,
//     years: years,
//     noBlog: noBlog,
//   });
// });

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

router.get("/soBig", async (req, res) => {
  let resources = await Resource.find();
  res.render("client/soBig", { resources: resources });
});

// EXPORT
module.exports = router;
