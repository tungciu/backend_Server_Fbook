const db = require("../Connect/Conectdb");

const Book = function (Book) {
    this.IDBook = Book.IDBook;
    this.BookName = Book.BookName;
    this.Author = Book.Author;
    this.PublishYear = Book.PublishYear;
    this.PriceBook = Book.PriceBook;
    this.Discription = Book.Discription;
    this.ImageBook = Book.ImageBook;
    this.Create_at = Book.Create_at;
    this.Chapter = Book.Chapter;

    this.IDCat = Book.IDCat;


};
Book.get_all = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Book.*, Category.CatName
        FROM Book
        LEFT JOIN Category ON Book.IDCat = Category.IDCat
    `;

    db.query(query, function (err, booksWithCategories) {
        if (err) {
            result(null);
        } else {
            result(booksWithCategories);
        }
    });
};

// Book.get_all = function (result) {
//     if (db.state === 'disconnected') {
//         db.connect();
//     }
//     db.query("SELECT * FROM Book", function (err, Book) {
//         if (err) {
//             result(null);
//         } else {
//             result(Book);
//         }
//     });
// };

Book.getByid = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Book WHERE IDBook = ?", id, function (err, Book) {
        if (err || Book.length == 0) {
            result(null);
        } else {
            result(Book[0]);
        }
    });
};

Book.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("DELETE FROM Book WHERE IDBook = ?", id, function (err, IDBook) {
        if (err) {
            result(null);
        } else {
            result("XOA THANH CONG Book CO ID " + id);
        }
    });
};

Book.create = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("INSERT INTO Book SET ?", data, function (err, Book) {
        if (err) {
            console.error("Lỗi khi chèn dữ liệu vào bảng Book:", err);
            result(null);
        } else {
            result({ IDBook: Book.insertId, ...data });
        }
    });
};


Book.update = function (array, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query(
        "UPDATE Book SET BookName=?,Author=?,PublishYear=?,PriceBook=?,Discription=?,ImageBook=?,IDCat=?,Chapter=?,Create_at=?  WHERE IDBook=?",
        [
            array.BookName,
            array.Author,
            array.PublishYear,
            array.PriceBook,
            array.Discription,
            array.ImageBook,
            array.IDCat,
            array.Chapter,
            array.Create_at,  // Hãy đảm bảo rằng đây là timestamp hoặc datetime hợp lệ

            array.IDBook,
        ],
        function (err, updateResult) {
            if (err) {
                console.error("Lỗi khi cập nhật Sách:", err);
                result(null);
            } else {
                result(array);
            }
        }
    );
};
//

Book.search = function (keyword, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT * FROM Book
        WHERE 
            BookName LIKE ? OR
            Author LIKE ? OR
            PublishYear LIKE ? OR
            IDCat LIKE ? OR
            PriceBook LIKE ?;
    `;

    const searchKeyword = `%${keyword}%`;

    db.query(query, [searchKeyword, searchKeyword, searchKeyword, searchKeyword, searchKeyword], function (err, Books) {
        if (err) {
            result(null);
        } else {
            result(Books);
        }
    });
};
module.exports = Book;
