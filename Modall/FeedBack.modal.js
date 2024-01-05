const db = require('../Connect/Conectdb');
const FeedBack = function (FeedBack) {
    this.IDFeedBack = FeedBack.IDFeedBack;
    this.Rate = FeedBack.Rate;
    this.Comment = FeedBack.Comment;
    this.IDUser = FeedBack.IDUser;
    this.IDBook = FeedBack.IDBook;
    this.Create_at = FeedBack.Create_at;
}


FeedBack.get_all = function (result) {

    // Đảm bảo db đã được khởi tạo và kết nối trước khi thực hiện truy vấn
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT FeedBack.*, Book.BookName,Users.UserName
        FROM FeedBack
        LEFT JOIN Book ON FeedBack.IDBook = Book.IDBook
        LEFT JOIN Users ON FeedBack.IDUser = Users.IDUser
        ORDER BY FeedBack.Create_at DESC;
    `;

    db.query(query, function (err, FeedBack) {
        if (err) {
            result(null);
        } else {
            result(FeedBack);
        }
    });
};

FeedBack.create = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("INSERT INTO FeedBack SET ?", data, function (err, FeedBack) {
        if (err) {
            console.error("Lỗi khi chèn dữ liệu vào bảng FeedBack:", err);
            result(null);
        } else {
            result({ IDFeedBack: FeedBack.insertId, ...data });
        }
    });
};
// get theo idboook
FeedBack.get_by_book_id = function (bookId, result) {

    // Đảm bảo db đã được khởi tạo và kết nối trước khi thực hiện truy vấn
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT FeedBack.*, Book.BookName, Users.UserName
        FROM FeedBack
        LEFT JOIN Book ON FeedBack.IDBook = Book.IDBook
        LEFT JOIN Users ON FeedBack.IDUser = Users.IDUser
        WHERE FeedBack.IDBook = ?
        ORDER BY FeedBack.Create_at DESC;
    `;

    db.query(query, [bookId], function (err, FeedBack) {
        if (err) {
            console.error("Lỗi khi truy vấn dữ liệu FeedBack theo ID sách:", err);
            result(null);
        } else {
            result(FeedBack);
        }
    });
};

FeedBack.search = function (keyword, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT FeedBack.*, Book.BookName, Users.UserName
        FROM FeedBack
        LEFT JOIN Book ON FeedBack.IDBook = Book.IDBook
        LEFT JOIN Users ON FeedBack.IDUser = Users.IDUser
        WHERE 
            Book.BookName LIKE ? OR
            Users.UserName LIKE ? OR
            FeedBack.Rate LIKE ?;
    `;

    const searchKeyword = `%${keyword}%`;

    db.query(query, [searchKeyword, searchKeyword, searchKeyword], function (err, FeedBack) {
        if (err) {
            result(null);
        } else {
            result(FeedBack);
        }
    });
};

FeedBack.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("DELETE FROM FeedBack WHERE IDFeedBack = ?", id, function (err, FeedBack) {
        if (err) {
            result(null);
        } else {
            result("XOA THANH CONG fe CO ID " + id);
        }
    });
}
// tính tb sao tại đây
FeedBack.averageRatingByBookId = function (bookId, result) {
    // Đảm bảo db đã được khởi tạo và kết nối trước khi thực hiện truy vấn
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT AVG(Rate) AS AverageRating
        FROM FeedBack
        WHERE IDBook = ?;
    `;

    db.query(query, [bookId], function (err, averageRating) {
        if (err) {
            console.error("Lỗi khi tính trung bình đánh giá sách:", err);
            result(null);
        } else {
            // Kiểm tra nếu giá trị trả về là null hoặc undefined, thì đặt là "0.0"
            const formattedRating = (averageRating[0].AverageRating !== null && averageRating[0].AverageRating !== undefined)
                ? parseFloat(averageRating[0].AverageRating).toFixed(1)
                : "0.0";

            result(formattedRating);
        }
    });
};



module.exports=FeedBack;