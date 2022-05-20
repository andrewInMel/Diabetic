const express = require("express");
const router = express.Router();
const Patient = require("../models/patientModel.js");
const Clinician = require("../models/clinicianModel.js");
const Health = require("../models/healthModel.js");
const Data = require("../models/dataModel.js");
const Note = require("../models/clinicNoteModel.js");
const genPassword = require("../encryption/passwordEncrypt").genPassword;
const clinicianAuth = require("./authMiddleware.js").clinicianAuth;

/* get clinician login */
router.get("/", clinicianAuth, (req, res) => {
  res.redirect("/clinician/dashboard");
});

/* get clinician dashboard */
router.get("/dashboard", clinicianAuth, async (req, res) => {
  /* patients' records */
  const allPatients = await Patient.find({ clinician: req.user._id }).lean();
  const records = await getRecords(allPatients);
  /* render the page */
  res.render("clinDashboard", {
    layout: "clinician",
    style: "clinDashboard.css",
    patients: records,
    clinician: req.user,
  });
});

/* get comment list */
router.get("/comments", clinicianAuth, async (req, res) => {
  /* get all comments of the clinician's patients */
  const data = await Data.find({ clinicianAuth: req.user._id })
    .sort({ _id: -1 })
    .lean();
  /* keep data that has comment */
  const commentData = data
    .filter((oneData) => oneData.comment !== "" && oneData.comment != null)
    .map((node) => {
      node.date = node._id.getTimestamp().toLocaleDateString("en-AU", {
        timeZone: "Australia/Melbourne",
      });
      return node;
    });
  /* render the page */
  res.render("clinComments", {
    layout: "clinician",
    style: "clinComments.css",
    data: commentData,
    clinician: req.user,
  });
});

/******************
 * sprint 3 routes*
 ******************/

/* post register clinician */
router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  /* new clinician object */
  Clinician.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        res.status(500).json({ email: "User already exist" });
      } else {
        /* generate password hash */
        const { hash, salt } = genPassword(password);
        /* create a new user & store it in database */
        const newClinician = new Clinician({
          firstName: req.body.firstName,
          type: "clinician",
          lastName: req.body.lastName,
          email: email,
          hash: hash,
          salt: salt,
        });
        await newClinician.save();
        res.redirect("/clinician");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

/* post register patient data */
router.post("/patient-register", clinicianAuth, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const dobParts = req.body.dob.split("-");
  const dob = `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}`;
  Patient.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        res.status(500).json({ email: "User already exist" });
      } else {
        /* generate password hash */
        const { hash, salt } = genPassword(password);
        /* create a new user & store it in database */
        const newPatient = new Patient({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          clinician: req.user._id,
          gender: req.body.sex,
          dob: dob,
          type: "patient",
          email: email,
          hash: hash,
          salt: salt,
          startDate: new Date().getTime(),
          dayscompleted: 0,
          username: req.body.username,
          dataSet: {},
        });
        await newPatient.save();
        res.redirect("/clinician");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});
/* clinician reset password */
router.post("/post-settings", clinicianAuth, async (req, res) => {
  const clinician = await Clinician.findById(req.user._id);
  /* generate password hash */
  const { hash, salt } = genPassword(req.body.password);
  /* update password */
  clinician.salt = salt;
  clinician.hash = hash;
  await clinician.save();
  /* redirect to setting page */
  res.redirect("/clinician/settings");
});

/* get clinician setting */
router.get("/settings", clinicianAuth, (req, res) => {
  /* render the page */
  res.render("clinSettings", {
    layout: "clinician",
    style: "clinSettings.css",
    clinician: req.user,
  });
});

/* get clinician register patient */
router.get("/patient-register", clinicianAuth, (req, res) => {
  /* render the page */
  res.render("clinRegisterPatient", {
    layout: "clinician",
    style: "clinRegisterPatient.css",
    clinician: req.user,
  });
});

/* post clinician notes */
router.post("/clin-notes/:patientId", clinicianAuth, async (req, res) => {
  /* current date */
  const today = new Date();
  const date = today.toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
  });
  /* create new note */
  const newNode = new Note({
    clinician: req.user._id,
    patient: req.params.patientId,
    date: date,
    note: req.body.note,
  });
  await newNode.save();
  res.redirect(`/clinician/patients/${req.params.patientId}`);
});

/* get clinician notes page */
router.get("/notes-page/:patientId", clinicianAuth, async (req, res) => {
  /* all notes about a patient */
  const notes = await Note.find({
    clinician: req.user._id,
    patient: req.params.patientId,
  }).lean();
  /* patient detail */
  const patient = await Patient.findById(req.params.patientId).lean();
  res.render("clinPNotes", {
    layout: "clinician",
    style: "clinNotes.css",
    notes: notes,
    clinician: req.user,
    patient: patient,
  });
});

/* update patient support message */
router.post("/support-msg/:patientId", clinicianAuth, async (req, res) => {
  const patientId = req.params.patientId;
  const patient = await Patient.findById(patientId).exec();
  patient.supportMsg = req.body.message;
  const updatedPt = await patient.save();
  if (updatedPt) {
    res.redirect(`/clinician/patients/${patientId}`);
  }
});

/* patient today's detail page */
router.get("/patients/:patientId", clinicianAuth, async (req, res) => {
  /* current date */
  const date = new Date().toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
  });
  /* patient and today's data */
  const patient = await Patient.findById(req.params.patientId).lean();
  const healthDoc = await Health.findOne({
    patient: patient._id,
    date: date,
  })
    .populate("BGL")
    .populate("Insulin")
    .populate("Weight")
    .populate("Exercise")
    .lean();
  /* render the page */
  res.render("clinPToday", {
    layout: "clinician",
    style: "clinPToday.css",
    patient: patient,
    healthRd: healthDoc,
    clinician: req.user,
    age: getAge(patient.dob),
  });
});

/* patient past detail page */
router.get("/patients/past/:patientId", clinicianAuth, async (req, res) => {
  /* petient to work with */
  const patient = await Patient.findById(req.params.patientId).lean();
  /* historical health data */
  const healthDocs = await Health.find({ patient: patient._id })
    .populate("BGL")
    .populate("Insulin")
    .populate("Weight")
    .populate("Exercise")
    .lean();
  /* rearrange the data in prefered form */
  const allRecords = healthDocs.map((oneDoc) => {
    return { patient: patient, todayRd: oneDoc, comments: [] };
  });
  /* render the past page */
  res.render("clinPPast", {
    layout: "clinician",
    style: "clinPPast.css",
    patient: patient,
    allRecords: allRecords,
    clinician: req.user,
  });
});

/* post required time-series */
router.post("/patient/edit/:patientId", clinicianAuth, async (req, res) => {
  const patientId = req.params.patientId;
  const patient = await Patient.findById(patientId).exec();
  patient.dataSet = req.body;
  patient.markModified("dataSet");
  await patient.save();
  res.redirect(`/patients/:${patientId}`);
});

/********************
 * helper functions *
 ********************/

/* get health record */
const getRecords = (allPatients) => {
  /* current date */
  const date = new Date().toLocaleDateString("en-AU", {
    timeZone: "Australia/Melbourne",
  });
  /* map through patients' array, return desired data object */
  return Promise.all(
    allPatients.map(async (onePatient) => {
      const record = await Health.findOne({
        patient: onePatient._id,
        date: date,
      })
        .populate("BGL")
        .populate("Insulin")
        .populate("Weight")
        .populate("Exercise")
        .lean();
      const comments = [];
      if (record) {
        if (record.BGL && record.BGL.comment) {
          comments.push(record.BGL.comment);
        }
        if (record.Weight && record.Weight.comment) {
          comments.push(record.Weight.comment);
        }
        if (record.Insulin && record.Insulin.comment) {
          comments.push(record.Insulin.comment);
        }
        if (record.Exercise && record.Exercise.comment) {
          comments.push(record.Exercise.comment);
        }
      }
      return { patient: onePatient, todayRd: record, comments: comments };
    })
  );
};

/* get date */
const getAge = (dob) => {
  const today = new Date();
  const dateParts = dob.split("/");
  const birthDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
  var age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

module.exports = router;
