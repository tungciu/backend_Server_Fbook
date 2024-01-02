const db = require('../Connect/Conectdb');
const NOTIFICATION = function (FeedBack) {
    this.IDNoti = FeedBack.IDNoti;
    this.title = FeedBack.title;
    this.IDUser = FeedBack.IDUser;
    this.IDBook = FeedBack.IDBook;
    this.Create_at = FeedBack.Create_at;
}


NOTIFICATION.get_all = function (result) {

    // Đảm bảo db đã được khởi tạo và kết nối trước khi thực hiện truy vấn
    if (db.state === 'disconnected') {
        db.connect();
    } const query = `
        SELECT NOTIFICATION.*, Book.BookName, Users.UserName
        FROM NOTIFICATION
        LEFT JOIN Book ON NOTIFICATION.IDBook = Book.IDBook
        LEFT JOIN Users ON NOTIFICATION.IDUser = Users.IDUser
        ORDER BY NOTIFICATION.Create_at DESC;
    `;
    // Execute the query
    db.query(query, function (err, NOTIFICATION) {
        if (err) {
            result(null);
        } else {
            result(NOTIFICATION);
        }
    });
};

NOTIFICATION.create = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("INSERT INTO NOTIFICATION SET ?", data, function (err, NOTIFICATION) {
        if (err) {
            console.error("Lỗi khi chèn dữ liệu vào bảng NOTIFICATION:", err);
            result(null);
        } else {
            result({ IDNoti: NOTIFICATION.insertId, ...data });
        }
    });
};
// get theo idboook
NOTIFICATION.get_by_user_id = function (id, result) {

    // Đảm bảo db đã được khởi tạo và kết nối trước khi thực hiện truy vấn
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT NOTIFICATION.*, Book.BookName, Users.UserName
        FROM NOTIFICATION
        LEFT JOIN Book ON NOTIFICATION.IDBook = Book.IDBook
        LEFT JOIN Users ON NOTIFICATION.IDUser = Users.IDUser
        WHERE NOTIFICATION.IDUser = ?
        ORDER BY NOTIFICATION.Create_at DESC;
    `;

    db.query(query, [id], function (err, NOTIFICATION) {
        if (err) {
            console.error("Lỗi khi truy vấn dữ liệu NOTIFICATION theo  IDUser:", err);
            result(null);
        } else {
            result(NOTIFICATION);
        }
    });
};

NOTIFICATION.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("DELETE FROM NOTIFICATION WHERE IDNoti = ?", id, function (err, NOTIFICATION) {
        if (err) {
            result(null);
        } else {
            result("XOA THANH CONG fe CO ID " + id);
        }
    });
}

module.exports=NOTIFICATION;