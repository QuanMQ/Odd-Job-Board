const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// *Load config
dotenv.config({ path: "./config/config.env" });

// *Test DB
const connectDB = require("./config/database");
connectDB
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// *Passport config
require("./config/passport")(passport);

const app = express();

// *Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// *Method override
app.use(methodOverride("_method"));

// *Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// *Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// *Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// *Sessions
app.use(
  session({
    secret: "keyboard cat",
    store: new SequelizeStore({
      db: connectDB,
    }),
    saveUninitialized: false,
    resave: false,
    proxy: true,
  })
);

// *Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// *Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// *Static folder
app.use(express.static(path.join(__dirname, "public")));

// *Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/access", require("./routes/access"));
app.use("/jobs", require("./routes/jobs"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
