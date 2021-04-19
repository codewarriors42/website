const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Blog = require("../../models/blog");
const methodOverride = require("method-override");
const multer = require("multer");
const Grid = require("gridfs-stream");
const path = require("path");
const mongoose = require("mongoose");
const uuid = require("uuid");
const sharp = require("sharp");
const fs = require("fs");

router.use(methodOverride("_method"));

// GRIDFS SETTINGS
const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

const storage = multer.diskStorage({
  destination: ".",
  filename: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, `${uuid.v4()}-${Date.now()}` + path.extname(file.originalname));
    } else {
      cb(null, "no file");
    }
  },
});
const upload = multer({ storage: storage, limits: { fileSize: 4194304 } });

// ROUTES
// All
router.get("/", async (req, res) => {
  let blogs = await Blog.find();
  let user = await User.findById(req.user.id);
  res.render("blog/all", { blogs: blogs, user: user });
});

// Make
router.get("/add", checkSupreme, (req, res) => {
  res.render("blog/add");
});
router.post("/add", checkSupreme, upload.single("img"), async (req, res) => {
  // Compress
  try {
    await sharp(req.file.filename)
      .toFormat("jpeg")
      .jpeg({ quality: 40, force: true })
      .toFile("toConvert.jpg");
    let filename = `${uuid.v4()}-${Date.now()}.jpg`;
    const writeStream = gfs.createWriteStream(filename);
    await fs.createReadStream(`./toConvert.jpg`).pipe(writeStream);
    fs.unlink("toConvert.jpg", (err) => {
      if (err) {
        res.send(err);
      }
    });
    fs.unlink(`${req.file.filename}`, (err) => {
      if (err) {
        res.send(err);
      }
    });

    let body = req.body;
    let user = await User.findById(req.user.id);

    let blog = new Blog({
      title: body.title,
      content: body.content,
      author: user.name,
      image: filename,
    });

    blog.save();
    res.redirect("/admin/blogs");
  } catch (err) {
    res.redirect("/err");
    fs.unlink("no file", (err) => {});
  }
});

// Delete
router.get("/delete/:id", checkSupreme, async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  gfs.remove({ filename: blog.image, root: "fs" }, async (err, gridStore) => {
    if (err) {
      res.send(err);
    } else {
      await Blog.deleteOne({ _id: req.params.id });
      res.redirect("/admin/blogs");
    }
  });
});

// Edit
router.get("/edit/:id", checkSupreme, async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  res.render("blog/edit", { blog: blog });
});
router.put(
  "/edit/:id",
  checkSupreme,
  upload.single("img"),
  async (req, res) => {
    try {
      if (req.file) {
        // Compress
        await sharp(req.file.filename)
          .toFormat("jpeg")
          .jpeg({ quality: 40, force: true })
          .toFile("toConvert.jpg");
        let filename = `${uuid.v4()}-${Date.now()}.jpg`;
        const writeStream = gfs.createWriteStream(filename);
        await fs.createReadStream(`./toConvert.jpg`).pipe(writeStream);
        fs.unlink("toConvert.jpg", (err) => {
          if (err) {
            res.send(err);
          }
        });
        fs.unlink(`${req.file.filename}`, (err) => {
          if (err) {
            res.send(err);
          }
        });

        let blog = await Blog.findById(req.params.id);
        gfs.remove(
          { filename: blog.image, root: "fs" },
          async (err, gridStore) => {
            if (err) {
              res.send(err);
            } else {
              await Blog.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    title: req.body.title,
                    content: req.body.content,
                    image: filename,
                  },
                }
              );
            }
          }
        );
      } else {
        await Blog.updateOne(
          { _id: req.params.id },
          {
            $set: {
              title: req.body.title,
              content: req.body.content,
            },
          }
        );
      }
      res.redirect("/admin/blogs");
    } catch (err) {
      res.redirect("/err");
      fs.unlink("no file", (err) => {});
    }
  }
);

// MIDDLEWARE
async function checkSupreme(req, res, next) {
  let user = await User.findById(req.user.id);
  if (user.isSupreme) {
    next();
  } else {
    res.redirect("/admin");
  }
}

module.exports = router;
