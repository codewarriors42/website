const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Resource = require("../../models/resource");
const methodOverride = require("method-override");
const multer = require("multer");
const Grid = require("gridfs-stream");
const path = require("path");
const mongoose = require("mongoose");
const uuid = require("uuid");
const fs = require("fs");
const sharp = require("sharp");

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
    cb(null, `${uuid.v4()}-${Date.now()}` + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage, limits: { fileSize: 4194304 } });

// ROUTES
// All
router.get("/", async (req, res) => {
  let resources = await Resource.find();
  let user = await User.findById(req.user.id);
  res.render("manage/resources", { resources: resources, user: user });
});

// Make
router.get("/add", checkSupreme, (req, res) => {
  res.render("add/add-resource");
});
router.post("/add", checkSupreme, upload.array("img", 2), async (req, res) => {
  try {
    let filenames = [];

    // Compress
    for (let file of req.files) {
      await sharp(file.filename).toFile("toConvert.svg");
      let filename = `${uuid.v4()}-${Date.now()}.svg`;
      filenames.push(filename);
      const writeStream = gfs.createWriteStream(filename);
      await fs.createReadStream(`toConvert.svg`).pipe(writeStream);
      fs.unlink("toConvert.svg", (err) => {
        if (err) {
          res.send(err);
        }
      });
      fs.unlink(`${file.filename}`, (err) => {
        if (err) {
          res.send(err);
        }
      });
    }

    let resource = new Resource({
      name: req.body.name,
      link: req.body.link,
      dark: filenames[0],
      light: filenames[1],
    });

    await resource.save();
    res.redirect("/admin/resources");
  } catch (err) {
    console.log(err);
    // res.redirect("/err");
  }
});

// Delete
router.get("/delete/:id", checkSupreme, async (req, res) => {
  let resource = await Resource.findById(req.params.id);
  gfs.remove(
    { filename: resource.dark, root: "fs" },
    async (err, gridStore) => {
      if (err) {
        res.send(err);
      } else {
        await Resource.deleteOne({ _id: req.params.id });
      }
    }
  );
  gfs.remove(
    { filename: resource.light, root: "fs" },
    async (err, gridStore) => {
      if (err) {
        res.send(err);
      }
    }
  );
  res.redirect("/admin/resources");
});

// Edit
router.get("/edit/:id", checkSupreme, async (req, res) => {
  let resource = await Resource.findById(req.params.id);
  res.render("edit/edit-resource", { resource: resource });
});
// EDITING
router.put(
  "/edit/:id",
  checkSupreme,
  upload.fields([
    { name: "dark", maxCount: 1 },
    { name: "light", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let resource = await Resource.findById(req.params.id);
      if (!req.files.dark && !req.files.light) {
        await Resource.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: req.body.name,
              link: req.body.link,
            },
          }
        );
      } else if (req.files.dark && req.files.light) {
        gfs.remove(
          { filename: resource.dark, root: "fs" },
          async (err, gridStore) => {
            if (err) {
              res.send(err);
            }
          }
        );
        gfs.remove(
          { filename: resource.light, root: "fs" },
          async (err, gridStore) => {
            if (err) {
              res.send(err);
            }
          }
        );
        let filenames = [];

        // Compress
        for (let key of Object.keys(req.files)) {
          await sharp(req.files[key][0].filename).toFile("toConvert.svg");
          let filename = `${uuid.v4()}-${Date.now()}.svg`;
          filenames.push(filename);
          const writeStream = gfs.createWriteStream(filename);
          await fs.createReadStream(`toConvert.svg`).pipe(writeStream);
          fs.unlink("toConvert.svg", (err) => {
            if (err) {
              res.send(err);
            }
          });
          fs.unlink(`${req.files[key][0].filename}`, (err) => {
            if (err) {
              res.send(err);
            }
          });
        }
        await Resource.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: req.body.name,
              link: req.body.link,
              dark: filenames[0],
              light: filenames[1],
            },
          }
        );
      } else {
        let dark = false;
        if (req.files.dark) {
          dark = true;
        }
        let file = req.files.dark ? req.files.dark[0] : req.files.light[0];
        // Compress
        await sharp(file.filename).toFile("toConvert.svg");
        let filename = `${uuid.v4()}-${Date.now()}.svg`;
        const writeStream = gfs.createWriteStream(filename);
        await fs.createReadStream(`toConvert.svg`).pipe(writeStream);
        fs.unlink("toConvert.svg", (err) => {
          if (err) {
            res.send(err);
          }
        });
        fs.unlink(`${file.filename}`, (err) => {
          if (err) {
            res.send(err);
          }
        });

        if (dark) {
          gfs.remove(
            { filename: resource.dark, root: "fs" },
            async (err, gridStore) => {
              if (err) {
                res.send(err);
              }
            }
          );
          await Resource.updateOne(
            { _id: req.params.id },
            {
              $set: {
                name: req.body.name,
                link: req.body.link,
                dark: filename,
              },
            }
          );
        } else {
          gfs.remove(
            { filename: resource.light, root: "fs" },
            async (err, gridStore) => {
              if (err) {
                res.send(err);
              }
            }
          );
          await Resource.updateOne(
            { _id: req.params.id },
            {
              $set: {
                name: req.body.name,
                link: req.body.link,
                light: filename,
              },
            }
          );
        }
      }
      res.redirect("/admin/resources");
    } catch (err) {
      res.redirect("/err");
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
