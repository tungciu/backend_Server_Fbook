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
    this.Content=Book.Content;
    this.IDCat = Book.IDCat;


};
Book.get_by_idloai = function (idloai, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    const query = `
        SELECT Book.*, Category.CatName
        FROM Book
        LEFT JOIN Category ON Book.IDCat = Category.IDCat
        WHERE Book.IDCat = ?
    `;

    db.query(query, [idloai], function (err, booksWithCategories) {
        if (err) {
            result(null);
        } else {
            result(booksWithCategories);
        }
    });
};

Book.get_all = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Book.*, Category.CatName
        FROM Book
        LEFT JOIN Category ON Book.IDCat = Category.IDCat
        ORDER BY Book.Create_at DESC;  -- Thêm mệnh đề ORDER BY
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

    // Lấy thời gian hiện tại
    const currentTime = new Date();

    db.query(
        "UPDATE Book SET BookName=?,Author=?,PublishYear=?,PriceBook=?,Discription=?,ImageBook=?,IDCat=?,Chapter=?,Create_at=? ,Content=? WHERE IDBook=?",
        [
            array.BookName,
            array.Author,
            array.PublishYear,
            array.PriceBook,
            array.Discription,
            array.ImageBook,
            array.IDCat,
            array.Chapter,
            currentTime,  // Thay thế Create_at bằng thời gian hiện tại
            array.Content,
            array.IDBook,
        ],
        function (err, updateResult) {
            if (err) {
                console.error("Lỗi khi cập nhật Sách:", err);
                result(null);
            } else {
                // Sau khi cập nhật, sắp xếp lại danh sách theo thứ tự giảm dần của thời gian tạo
                const query = `
                    SELECT Book.*, Category.CatName
                    FROM Book
                    LEFT JOIN Category ON Book.IDCat = Category.IDCat
                    ORDER BY Book.Create_at DESC;
                `;

                db.query(query, function (err, booksWithCategories) {
                    if (err) {
                        result(null);
                    } else {
                        result(booksWithCategories);
                    }
                });
            }
        }
    );
};


Book.search = function (keyword, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Book.*, Category.CatName
        FROM Book
        LEFT JOIN Category ON Book.IDCat = Category.IDCat
        WHERE 
            Book.BookName LIKE ? OR
            Book.Author LIKE ? OR
            Book.PublishYear LIKE ? OR
            Category.CatName LIKE ? OR
            Book.PriceBook LIKE ?;
    `;

    const searchKeyword = `%${keyword}%`;

    db.query(query, [searchKeyword, searchKeyword, searchKeyword, searchKeyword, searchKeyword], function (err, booksWithCategories) {
        if (err) {
            result(null);
        } else {
            result(booksWithCategories);
        }
    });
};

module.exports = Book;
