if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dbURI = process.env.DB_URL;
const Grid = require("gridfs-stream");

// DB CONNECTION
async function connectDB() {
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  await app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
}
connectDB();

// GRIDFS SETTINGS
const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});

// SETTINGS
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

// ROUTES
// Client
app.use("/", require("./routes/client/client"));

// Imgs
app.get("/img/:filename", async (req, res) => {
  try {
    let file = await gfs.files.findOne({ filename: req.params.filename });
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  } catch (err) {
    res.redirect("/err");
  }
});

// Auth
app.use("/auth", checkNotAuthenticated, require("./routes/auth/auth"));
app.use("/logout", checkAuthenticated, require("./routes/auth/logout"));

// Admin
app.use("/admin", checkAuthenticated, require("./routes/admin/admin"));

// Admin/routes
app.use("/admin/blogs", checkAuthenticated, require("./routes/admin/blog"));
app.use(
  "/admin/resources",
  checkAuthenticated,
  require("./routes/admin/resource")
);
app.use(
  "/admin/archives",
  checkAuthenticated,
  require("./routes/admin/archive")
);

// Intra redirect
app.get("/intra_verification",(_,res) => {
  res.redirect("https://cwbotverification.herokuapp.com/");
});

// ERRORS
app.get("/err", (req, res) => {
  res.send("<h2 style='font-family: Helvetica'>Some Error has occured</h2>");
});
app.get("*", (req, res) => {
  res.render("client/404");
});

// MIDDLEWARE
function checkAuthenticated(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    res.redirect("/auth/login");
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.redirect("/auth/login");
      } else {
        req.user = user;
        next();
      }
    });
  }
}
function checkNotAuthenticated(req, res, next) {
  let token = req.cookies["auth-token"];

  if (token == null) {
    next();
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        next();
      } else {
        res.redirect("/");
        req.user = user;
      }
    });
  }
}
