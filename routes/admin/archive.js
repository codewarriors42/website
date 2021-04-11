const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Archive = require("../../models/archive");
const methodOverride = require("method-override");
const multer = require("multer");
const Grid = require("gridfs-stream");
const path = require("path");
const mongoose = require("mongoose");
const uuid = require("uuid");
const sharp = require("sharp");
const fs = require("fs");
const Comp = require("../../models/comp");

// SETTINGS
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
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
  let archives = await Archive.find();
  let user = await User.findById(req.user.id);
  res.render("archive/all", { archives: archives, user: user });
});

// Add
router.get("/add", checkSupreme, async (req, res) => {
  let comps = await Comp.find();
  res.render("archive/add", { comps: comps });
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
    let links = [];

    if (body.linkPlatform) {
      let lPlatforms = body.linkPlatform;
      let lURL = body.linkURL;

      if (Array.isArray(lPlatforms)) {
        for (let i = 0; i < lPlatforms.length; i++) {
          let link = {
            platform: lPlatforms[i],
            URL: lURL[i],
          };
          links.push(link);
        }
      } else {
        links = [
          {
            platform: lPlatforms,
            URL: lURL,
          },
        ];
      }
    } else {
      links = [];
    }

    let archive = new Archive({
      title: body.title,
      links: links,
      event: body.event,
      year: body.year,
      category: body.category,
      competition: body.competition,
      contributors: body.contributors,
      image: filename,
    });

    await archive.save();
    res.redirect("/admin/archives");
  } catch (err) {
    res.redirect("/err");
    fs.unlink("no file", (err) => {});
  }
});

// Delete
router.get("/delete/:id", checkSupreme, async (req, res) => {
  let archive = await Archive.findById(req.params.id);
  gfs.remove(
    { filename: archive.image, root: "fs" },
    async (err, gridStore) => {
      if (err) {
        res.send(err);
      } else {
        await Archive.deleteOne({ _id: req.params.id });
        res.redirect("/admin/archives");
      }
    }
  );
});

// Edit
router.get("/edit/:id", checkSupreme, async (req, res) => {
  let archive = await Archive.findById(req.params.id);
  let comps = await Comp.find();
  res.render("archive/edit", { archive: archive, comps: comps });
});
router.put(
  "/edit/:id",
  checkSupreme,
  upload.single("img"),
  async (req, res) => {
    let body = req.body;
    let links = [];

    if (body.linkPlatform) {
      let lPlatforms = body.linkPlatform;
      let lURL = body.linkURL;

      if (Array.isArray(lPlatforms)) {
        for (let i = 0; i < lPlatforms.length; i++) {
          let link = {
            platform: lPlatforms[i],
            URL: lURL[i],
          };
          links.push(link);
        }
      } else {
        links = [
          {
            platform: lPlatforms,
            URL: lURL,
          },
        ];
      }
    } else {
      links = [];
    }

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

        let archive = await Archive.findById(req.params.id);
        gfs.remove(
          { filename: archive.image, root: "fs" },
          async (err, gridStore) => {
            if (err) {
              res.send(err);
            } else {
              await Archive.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    title: body.title,
                    links: links,
                    year: body.year,
                    event: body.event,
                    competition: body.competition,
                    category: body.category,
                    contributors: body.contributors,
                    image: filename,
                  },
                }
              );
            }
          }
        );
      } else {
        await Archive.updateOne(
          { _id: req.params.id },
          {
            $set: {
              title: body.title,
              links: links,
              year: body.year,
              event: body.event,
              competition: body.competition,
              contributors: body.contributors,
              category: body.category,
            },
          }
        );
      }

      res.redirect("/admin/archives");
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
