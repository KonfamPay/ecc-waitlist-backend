const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db')

const app = express()
app.use(express.json())

//db connection
let db
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("App listening on port 3000")
    })
    db = getDb()
  }
})

app.post('/books', (req,res) => {
  const book = req.body

  db.collection('books')
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result)
    })
    .catch(err => res.status(500).json({error: "Could not create a new document"}))
})

app.get("/books", (req,res) => {
  let books = []
  //reference a document in the database
  db.collection('waitlist')
    .find() //find() returns a cursor | toArray fetches all the documents and pushes it in an array and forEach iterates the documents at a time and allows us to process each of them individually
    .sort({ author: 1 })
    .forEach(book => books.push(book))
    .then(() => {
      res.status(200).json(books)
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not fetch the documents' })
    })
})

app.get('/books/:id', (req, res) => {
  
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
    .findOne({_id: ObjectId(req.params.id)})
    .then(doc => {
      res.status(200).json(doc)
    })
    .catch(err => {
      res.status(500).json({ error: "Could not fetch the document" })
    })
  }else{
    res.status(500).json({error:"The id of this book is not valid"})
  }
  
})



app.delete('/books/:id', (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
    .deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({ error: "Could not delete the document" })
    })
  }else{
    res.status(500).json({error:"The id of this book is not valid"})
  }
})

app.patch('/books/:id', (req,res) => { 
  const updates = req.body
  if (ObjectId.isValid(req.params.id)) {
    db.collection('books')
    .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({ error: "Could not update the document" })
    })
  }else{
    res.status(500).json({error:"The id of this book is not valid"})
  }
})