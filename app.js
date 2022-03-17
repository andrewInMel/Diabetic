const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
/* routes */
const authRoutes = require("./routes/authRoutes.js");
const patientRoutes = require("./routes/patientRoutes.js");
//const clinicianRoutes = require("./routes/clinicianRoutes.js");

/* enviroment variable, access by process.env.Variable_Name */
require("dotenv").config();

/* express application */
const app = express();
/* bodyParser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* cors setup */
app.set("trust proxy", 1);

/* session setup */
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
app.use("/auth", authRoutes);
app.use("/api/patient", patientRoutes);
//app.use("/api/clinician", clinicianRoutes);

/* litsen on port process.env.PORT || 5000 */
app.listen(process.env.PORT || 8081);
