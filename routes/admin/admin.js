const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const Member = require("../../models/member");
const Alumni = require("../../models/alumni");
const Contact = require("../../models/contact");
const Faq = require("../../models/faq");
const Event = require("../../models/event");
const methodOverride = require("method-override");
const multer = require("multer");
const Grid = require("gridfs-stream");
const path = require("path");
const mongoose = require("mongoose");
const uuid = require("uuid");
const tinify = require("tinify");
tinify.key = "g0n8WvvQ9w2vZp0kXChwcGHgK4z5B0bQ";
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
router.get("/", async (req, res) => {
  let user = await User.findById(req.user.id);
  res.render("home/admin", { user: user });
});

// Get All
router.get("/users", async (req, res) => {
  let users = await User.find();
  let user = await User.findById(req.user.id);
  res.render("manage/users", { users: users, visitor: user });
});
router.get("/members", async (req, res) => {
  let members = await Member.find().sort({ pos: 1 });
  let user = await User.findOne({ _id: req.user.id });
  res.render("manage/members", { members: members, user: user });
});
router.get("/alumnis", async (req, res) => {
  let alumnis = await Alumni.find();
  let user = await User.findById(req.user.id);
  res.render("manage/alumnis", { alumnis: alumnis, user: user });
});
router.get("/contacts", async (req, res) => {
  let contacts = await Contact.find();
  let user = await User.findById(req.user.id);
  res.render("manage/contacts", { contacts: contacts, user: user });
});
router.get("/faq", async (req, res) => {
  let faqs = await Faq.find();
  let user = await User.findById(req.user.id);
  res.render("manage/faqs", { faqs: faqs, user: user });
});
router.get("/events", async (req, res) => {
  let events = await Event.find();
  let user = await User.findById(req.user.id);
  res.render("manage/events", { events: events, user: user });
});

// ADD
router.get("/add-user", checkSupreme, (req, res) => {
  res.render("add/add-user", { message: false });
});
router.post("/add-user", checkSupreme, async (req, res) => {
  let body = req.body;
  let username = body.username;
  let password = await bcrypt.hash(body.password, 10);

  let user = new User({
    username: username,
    password: password,
    name: body.name,
    isSupreme: false,
  });

  try {
    await user.save();
    res.redirect("users");
  } catch (err) {
    if (err.code == 11000) {
      res.render("add/add-user", { message: "Username is Taken" });
    } else {
      res.send(err);
    }
  }
});

router.get("/add-member", checkSupreme, (req, res) => {
  res.render("add/add-member");
});
router.post(
  "/add-member",
  checkSupreme,
  upload.single("img"),
  async (req, res) => {
    // Compress
    try {
      let source = tinify.fromFile(req.file.filename);
      await source.toFile("toConvert.jpg");
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
      let socials = [];

      if (body.socialPlatform) {
        let sPlatforms = body.socialPlatform;
        let sURL = body.socialURL;

        if (Array.isArray(sPlatforms)) {
          for (let i = 0; i < sPlatforms.length; i++) {
            let social = {
              platform: sPlatforms[i],
              URL: sURL[i],
            };
            socials.push(social);
          }
        } else {
          socials = [
            {
              platform: sPlatforms,
              URL: sURL,
            },
          ];
        }
      } else {
        socials = [];
      }

      let member = new Member({
        name: body.name,
        event: body.event,
        socials: socials,
        image: filename,
        pos: parseInt(body.pos),
      });

      await member.save();
      res.redirect("/admin/members");
    } catch (err) {
      res.redirect("/err");
      fs.unlink("no file", (err) => {});
    }
  }
);

router.get("/add-alumni", checkSupreme, (req, res) => {
  res.render("add/add-alumni");
});
router.post(
  "/add-alumni",
  checkSupreme,
  upload.single("img"),
  async (req, res) => {
    // Compress
    try {
      let source = tinify.fromFile(req.file.filename);
      await source.toFile("toConvert.jpg");
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

      let socials = [];
      if (body.socialPlatform) {
        let sPlatforms = body.socialPlatform;
        let sURL = body.socialURL;

        if (Array.isArray(sPlatforms)) {
          for (let i = 0; i < sPlatforms.length; i++) {
            let social = {
              platform: sPlatforms[i],
              URL: sURL[i],
            };
            socials.push(social);
          }
        } else {
          socials = [
            {
              platform: sPlatforms,
              URL: sURL,
            },
          ];
        }
      } else {
        socials = [];
      }

      let alumni = new Alumni({
        name: body.name,
        post: body.post,
        year: body.year,
        current: body.current,
        socials: socials,
        image: filename,
      });

      await alumni.save();
      res.redirect("/admin/alumnis");
    } catch {
      res.redirect("/err");
      fs.unlink("no file", (err) => {});
    }
  }
);

router.get("/add-contact", checkSupreme, (req, res) => {
  res.render("add/add-contact");
});
router.post("/add-contact", checkSupreme, async (req, res) => {
  let contact = new Contact({
    post: req.body.post,
    mail: req.body.mail,
  });

  try {
    contact.save();
    res.redirect("/admin/contacts");
  } catch (err) {
    res.send(err);
  }
});

router.get("/add-faq", checkSupreme, (req, res) => {
  res.render("add/add-faq");
});
router.post("/add-faq", checkSupreme, async (req, res) => {
  let body = req.body;

  let faq = new Faq({
    question: body.question,
    answer: body.answer,
  });

  try {
    faq.save();
    res.redirect("/admin/faq");
  } catch (err) {
    res.send(err);
  }
});

router.get("/add-event", checkSupreme, (req, res) => {
  res.render("add/add-event");
});
router.post("/add-event", checkSupreme, async (req, res) => {
  let event = new Event({
    name: req.body.name,
  });

  try {
    event.save();
    res.redirect("/admin/events");
  } catch (err) {
    res.send(err);
  }
});

// DELETE
router.get("/delete-user/:id", checkSupreme, async (req, res) => {
  await User.deleteOne({ _id: req.params.id });
  res.redirect("/admin/users");
});
router.get("/delete-member/:id", checkSupreme, async (req, res) => {
  let member = await Member.findById(req.params.id);
  gfs.remove({ filename: member.image, root: "fs" }, async (err, gridStore) => {
    if (err) {
      res.send(err);
    } else {
      await Member.deleteOne({ _id: req.params.id });
      res.redirect("/admin/members");
    }
  });
});
router.get("/delete-alumni/:id", checkSupreme, async (req, res) => {
  let alumni = await Alumni.findById(req.params.id);
  gfs.remove({ filename: alumni.image, root: "fs" }, async (err, gridStore) => {
    if (err) {
      res.send(err);
    } else {
      await Alumni.deleteOne({ _id: req.params.id });
      res.redirect("/admin/alumnis");
    }
  });
});
router.get("/delete-contact/:id", checkSupreme, async (req, res) => {
  await Contact.deleteOne({ _id: req.params.id });
  res.redirect("/admin/contacts");
});
router.get("/delete-faq/:id", checkSupreme, async (req, res) => {
  await Faq.deleteOne({ _id: req.params.id });
  res.redirect("/admin/faq");
});
router.get("/delete-event/:id", checkSupreme, async (req, res) => {
  await Event.deleteOne({ _id: req.params.id });
  res.redirect("/admin/events");
});

// EDIT
router.get("/edit-profile", async (req, res) => {
  let user = await User.findById(req.user.id);
  res.render("edit/edit-profile", { user: user, message: false });
});
router.put("/edit-profile", async (req, res) => {
  let body = req.body;
  let user = await User.findById(req.user.id);

  try {
    if (await bcrypt.compare(body.oldPassword, user.password)) {
      let hashedPassword = await bcrypt.hash(body.password, 10);
      let username = body.username;
      let password = hashedPassword;

      await User.updateOne(
        { _id: req.user.id },
        {
          $set: {
            username: username,
            password: password,
          },
        }
      );
      res.redirect("/admin");
    } else {
      res.render("edit/edit-profile", {
        user: user,
        message: "Incorrect Password",
      });
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/change-name", checkSupreme, async (req, res) => {
  let user = await User.findById(req.user.id);
  res.render("edit/change-name", { user: user });
});
router.put("/change-name", checkSupreme, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          name: req.body.name,
        },
      }
    );
  } catch (err) {
    res.send(err);
  }

  res.redirect("/admin");
});

router.get("/edit-user/:id", checkSupreme, async (req, res) => {
  let user = await User.findById(req.params.id);
  res.render("edit/edit-user", { user: user });
});
router.put("/edit-user/:id", checkSupreme, async (req, res) => {
  await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
      },
    }
  );
  res.redirect("/admin/users");
});

router.get("/edit-member/:id", checkSupreme, async (req, res) => {
  let member = await Member.findById(req.params.id);
  res.render("edit/edit-member", { member: member });
});
router.put(
  "/edit-member/:id",
  checkSupreme,
  upload.single("img"),
  async (req, res) => {
    let body = req.body;
    let socials = [];
    if (body.socialPlatform) {
      let sPlatforms = body.socialPlatform;
      let sURL = body.socialURL;

      if (Array.isArray(sPlatforms)) {
        for (let i = 0; i < sPlatforms.length; i++) {
          let social = {
            platform: sPlatforms[i],
            URL: sURL[i],
          };
          socials.push(social);
        }
      } else {
        socials = [
          {
            platform: sPlatforms,
            URL: sURL,
          },
        ];
      }
    } else {
      socials = [];
    }

    try {
      if (req.file) {
        // Compress
        let source = tinify.fromFile(req.file.filename);
        await source.toFile("toConvert.jpg");
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

        let member = await Member.findById(req.params.id);
        gfs.remove(
          { filename: member.image, root: "fs" },
          async (err, gridStore) => {
            if (err) {
              res.send(err);
            } else {
              await Member.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    name: body.name,
                    event: body.event,
                    socials: socials,
                    image: filename,
                    pos: parseInt(body.pos),
                  },
                }
              );
            }
          }
        );
      } else {
        await Member.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: body.name,
              event: body.event,
              socials: socials,
              pos: parseInt(body.pos),
            },
          }
        );
      }
      res.redirect("/admin/members");
    } catch (err) {
      res.redirect("/err");
      fs.unlink("no file", (err) => {});
    }
  }
);

router.get("/edit-alumni/:id", checkSupreme, async (req, res) => {
  let alumni = await Alumni.findById(req.params.id);
  res.render("edit/edit-alumni", { alumni: alumni });
});
router.put(
  "/edit-alumni/:id",
  checkSupreme,
  upload.single("img"),
  async (req, res) => {
    let body = req.body;
    let socials = [];
    if (body.socialPlatform) {
      let sPlatforms = body.socialPlatform;
      let sURL = body.socialURL;

      if (Array.isArray(sPlatforms)) {
        for (let i = 0; i < sPlatforms.length; i++) {
          let social = {
            platform: sPlatforms[i],
            URL: sURL[i],
          };
          socials.push(social);
        }
      } else {
        socials = [
          {
            platform: sPlatforms,
            URL: sURL,
          },
        ];
      }
    } else {
      socials = [];
    }

    try {
      if (req.file) {
        // Compress
        let source = tinify.fromFile(req.file.filename);
        await source.toFile("toConvert.jpg");
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

        let alumni = await Alumni.findById(req.params.id);
        gfs.remove(
          { filename: alumni.image, root: "fs" },
          async (err, gridStore) => {
            if (err) {
              res.send(err);
            } else {
              await Alumni.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    name: body.name,
                    post: body.post,
                    socials: socials,
                    year: body.year,
                    current: body.current,
                    image: filename,
                  },
                }
              );
            }
          }
        );
      } else {
        await Alumni.updateOne(
          { _id: req.params.id },
          {
            $set: {
              name: body.name,
              post: body.post,
              socials: socials,
              year: body.year,
              current: body.current,
            },
          }
        );
      }

      res.redirect("/admin/alumnis");
    } catch (err) {
      res.redirect("/err");
      fs.unlink("no file", (err) => {});
    }
  }
);

router.get("/edit-contact/:id", checkSupreme, async (req, res) => {
  let contact = await Contact.findById(req.params.id);
  res.render("edit/edit-contact", { contact: contact });
});
router.put("/edit-contact/:id", checkSupreme, async (req, res) => {
  await Contact.updateOne(
    { _id: req.params.id },
    {
      $set: {
        post: req.body.post,
        mail: req.body.mail,
      },
    }
  );
  res.redirect("/admin/contacts");
});

router.get("/edit-faq/:id", checkSupreme, async (req, res) => {
  let faq = await Faq.findById(req.params.id);
  res.render("edit/edit-faq", { faq: faq });
});
router.put("/edit-faq/:id", checkSupreme, async (req, res) => {
  await Faq.updateOne(
    { _id: req.params.id },
    {
      $set: {
        question: req.body.question,
        answer: req.body.answer,
      },
    }
  );
  res.redirect("/admin/faq");
});

router.get("/edit-event/:id", checkSupreme, async (req, res) => {
  let event = await Event.findById(req.params.id);
  res.render("edit/edit-event", { event: event });
});
router.put("/edit-event/:id", checkSupreme, async (req, res) => {
  await Event.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
      },
    }
  );
  res.redirect("/admin/events");
});

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
