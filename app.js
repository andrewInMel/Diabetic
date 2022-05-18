const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();

/* routes */
const greetingRoutes = require("./routes/greetingRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const patientRoutes = require("./routes/patientRoutes.js");
const clinicianRoutes = require("./routes/clinicianRoutes.js");

/* other setup */
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

/* template engine configuration */
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "patient",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");

/* custom helper */
const hbs = exphbs.create({});
hbs.handlebars.registerHelper("validation", (current, min, max) => {
  if (current && min && max) {
    return Number(current) < Number(min) || Number(current) > Number(max);
  } else {
    return false;
  }
});
hbs.handlebars.registerHelper("in", (type, required) => {
  return required.includes(type);
});
hbs.handlebars.registerHelper("checkComment", (comments) => {
  return comments.length !== 0;
});
hbs.handlebars.registerHelper("gt", function (a, b) {
  return a > b ;
});
hbs.handlebars.registerHelper("eq", function(a, b){
	return a === b ;
});
hbs.handlebars.registerHelper("getTime", (timestamp) => {
  return timestamp.slice(11);
});

/* session configuration */
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 43200000,
      // secure: true,
      // httpOnly: true,
    },
  })
);

/* passport configuration */
require("./config/passportConfig");
app.use(passport.initialize());
app.use(passport.session());

/* routes */
app.use("/", greetingRoutes);
app.use("/auth", authRoutes);
app.use("/patient", patientRoutes);
app.use("/clinician", clinicianRoutes);

/* listen on port process.env.PORT || 8080 */
app.listen(process.env.PORT || 8080);
