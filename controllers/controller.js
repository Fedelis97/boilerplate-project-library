const { ObjectId } = require("mongodb");

class MyController {

    constructor(db) {
        this.db = db; // Store db instance
        this.collection = db.collection('books');
    }


    addBook = async function (book) {
        try {
            const result = await this.collection.insertOne({
                title: book.title,
                commentcount: 0,
                comments: []
            })

            return { _id: result.insertedId, title: book.title }

        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    }

    getBooks = async function (book) {
        try {
            if (book) {
                return await this.collection.findOne({ _id: new ObjectId(book) }); // Use findOne() instead of find()

            } else {
                return await this.collection.find({}).toArray();
            }
        } catch (e) {
            console.log(e)
            throw new Error(e)
        }
    }

    addCommentToBook = async function (bookId, comment) {
        try {
            const result = await this.collection.findOneAndUpdate(
                { _id: new ObjectId(bookId) },
                { $push: { comments: comment } },
                { returnDocument: 'after' }
            );

            return result;
        } catch (err) {
            console.error('Error in addCommentToBook:', err);
            throw err;
        }
    }


    deleteBooks = async function (bookId) {
        try {
            console.log('boo', bookId)
            if (bookId) {
                return await this.collection.findOneAndDelete(
                    { _id: new ObjectId(bookId) }
                );
            }
            else {
                return await this.collection.deleteMany({})
            }


        } catch (e) {
            console.log('error', e)
            throw new Error(e)
        }
    }

}

module.exports = MyController;
