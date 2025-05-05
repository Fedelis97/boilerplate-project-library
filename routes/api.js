/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      const myController = req.app.locals.myController;

      try {
        const result = await myController.getBooks()
        if (result.length > 0) { res.json(result) }
        else {
          res.send('no book exists');
        }
      } catch (e) {
        console.error(e);

        res.status(500).json({ message: 'Internal server error', error: e });
      };

    })


    .post(async function (req, res) {
      const myController = req.app.locals.myController;

      let title = req.body.title;

      if (!title) return res.send('missing required field title');

      try {
        const result = await myController.addBook({
          title
        })
        res.json(result)
      } catch (e) {
        console.error(e);

        res.status(500).json({ message: 'Internal server error', error: e });
      };
    })


    .delete(async function (req, res) {
      const myController = req.app.locals.myController;
      try {
        await myController.deleteBooks()
        return res.send('complete delete successful')
      } catch (e) {
        console.error(e);

        res.status(500).json({ message: 'Internal server error', error: e });
      };
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      const myController = req.app.locals.myController;

      try {
        const result = await myController.getBooks(bookid); // rename for clarity

        if (result) {
          res.json({
            _id: result._id,
            title: result.title,
            comments: result.comments
          });
        } else {
          res.send('no book exists');
        }
      } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e });
      }
    })


    .post(async function (req, res) {
      const bookId = req.params.id;
      const comment = req.body.comment;

      const myController = req.app.locals.myController;

      if (!comment) {
        return res.send('missing required field comment');
      }

      try {
        const book = await myController.getBooks(bookId);

        if (!book) {
          return res.send('no book exists');
        }

        // Delegate the comment update to the controller too
        const updatedBook = await myController.addCommentToBook(bookId, comment);

        res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments
        });

      } catch (err) {
        console.error(err);
        res.status(500).send('server error');
      }
    })


    .delete(async function (req, res) {
      let bookId = req.params.id;
      const myController = req.app.locals.myController;

      try {

        const book = await myController.deleteBooks(bookId);

        if (!book) { return res.send('no book exists') }
        else {
          return res.send('delete successful');

        }


      } catch (err) {
        console.error(err);
        res.status(500).send('server error');
      }
      //if successful response will be 'delete successful'
    });

};
