const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const connectDB = require("./config/database");

// *Load config
dotenv.config({ path: "./config/config.env" });

// *Passport config
require("./config/passport")(passport);

const app = express();

// *Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// *Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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

// *Routes
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
