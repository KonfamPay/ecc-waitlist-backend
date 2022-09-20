const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db')
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express()
app.use(express.json())

//db connection
let db
connectToDb((err) => {
  if (!err) {
    app.listen(3001, () => {
      console.log("App listening on port 3001")
    })
    db = getDb()
  }
})

app.use(cors());

app.post('/waitlist', async (req,res) => {
  const email = req.body

  db.collection('waitlist')
    .insertOne(email)
    .then((result) => {
      res.status(201).json(result)
    })
    .catch(err => res.status(500).json({error: "Could not create a new document"}))
    if (!email) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "adetunjiadeyinka29@gmail.com",
      pass: "tvgcjaqkdchssgin",
    },
  });

  // Create mail options
  const mailOptions = {
    from: "adetunjiadeyinka29@gmail.com",
    to: email,
    replyTo: "adetunjiadeyinka29@gmail.com",
    subject: ` — Contact Form: adetunjiadeyinka.com`,
    text: email,
    html: `
      <h1>Hello there</h1>
      <h2>Email:</h2>
      <p>${email}</p>
    `,
  };
  try {
    addTo();
    // Send email
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(200).json({ message: "Email sent" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

app.get("/waitlist", (req,res) => {
  let waitlist = []
  //reference a document in the database
  db.collection('waitlist')
    .find()
    .sort({ email: 1 })
    .forEach(email => waitlist.push(email))
    .then(() => {
      res.status(200).json(waitlist)
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not fetch the documents' })
    })
})