/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/Book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      try {
        const books = await Book.find(); // Fetch all books from the database
        const formattedBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length // Calculate the number of comments
        }));
        res.json(formattedBooks);
      } catch (err) {
        res.json({ error: "Error retrieving books" });
      }
    })

    
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) return res.send('missing required field title');
      const newBook = new Book({title});
      try {
        const savedBook = await newBook.save();
        res.json({"_id":savedBook._id, "title":savedBook.title, "commentcount": 0});
      } catch(err){
        res.json({error: 'Error saving book'});
      }
    })
    
    .delete(async (req, res) => {
      try {
        await Book.deleteMany();
        res.send('complete delete successful');
      } catch (err) {
        res.json({error: 'Error deleting all books'});
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res)=> {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await Book.findById(bookid);
        res.json({"comments":book.comments, "_id": book._id, "title": book.title, "commentcount": book.commentcount});
      } catch (err) {
        res.send("no book exists")
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
    
      if (!comment) return res.send('missing required field comment');
    
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
    
        book.comments.push(comment);
        await book.save();
        res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const deletedBook = await Book.findByIdAndDelete(bookid);
        if (!deletedBook) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
  
};
