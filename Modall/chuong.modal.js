const db = require('../Connect/Conectdb');
const Chuong = function (Chuong) {
    this.IDchuong = Chuong.IDchuong;
    this.IDBook = Chuong.IDBook;
    this.chuongso = Chuong.chuongso;
    this.title = Chuong.title;
    this.content = Chuong.content;
    this.Create_at = Chuong.Create_at;

}


Chuong.get_all = function (result) {
    // Đảm bảo db đã được khởi tạo và kết nối trước khi thực hiện truy vấn
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Chuong.*, Book.BookName
        FROM Chuong
        LEFT JOIN Book ON Chuong.IDBook = Book.IDBook
        ORDER BY Chuong.Create_at DESC;
    `;

    db.query(query, function (err, ChuongwithBookname) {
        if (err) {
            result(null);
        } else {
            result(ChuongwithBookname);
        }
    });
}
//lấy thoe id boook
Chuong.getChuongByIdBook = function (idBook, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    // Sử dụng INNER JOIN để kết hợp thông tin từ cả hai bảng
    // Sử dụng WHERE để lấy chỉ những chương thuộc vào sách có IDBook tương ứng
    db.query("SELECT Chuong.*, Book.BookName, Book.Author, Book.PublishYear FROM Chuong INNER JOIN Book ON Chuong.IDBook = Book.IDBook WHERE Chuong.IDBook = ?", [idBook], function (err, chuongList) {
        if (err) {
            console.error(err);
            result(null);
        } else {
            result(chuongList);
        }
    });
}

//
// Chuong.create=function(data,result){
//     if (db.state === 'disconnected') {
//         db.connect();
//     }
//         db.query("INSERT INTO Chuong SET ?", data,function(err,Chuong){
//         if(err){
//             result(null);
//         }
//         else{
//             result({IDchuong: Chuong.insertId, ...data});
//         }
//     });
// }
Chuong.create = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("INSERT INTO Chuong SET ?", data, function (err, Chuong) {
        if (err) {
            console.error("Lỗi khi chèn dữ liệu vào bảng Book:", err);
            result(null);
        } else {
            result({ IDchuong: Chuong.insertId, ...data });
        }
    });
};
Chuong.update=function(array,result){
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("UPDATE Chuong SET IDBook=?, chuongso=?, title=?,content=?,Create_at=? WHERE IDchuong=?", [array.IDBook,array.chuongso,array.title,array.content,array.Create_at,array.IDchuong],function(err,Cart){
        if(err){
            result(null);
        }
        else{
            result(array);

        }
    });
}
Chuong.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("DELETE FROM Chuong WHERE IDchuong = ?", id, function (err, Bill) {
        if (err) {
            result(null);
        } else {
            result("XOA THANH CONG Chuong CO ID " + id);
        }
    });
}
// Chuong.get_all = function (result) {
//     if (db.state === 'disconnected') {
//         db.connect();
//     }
//     // Sử dụng INNER JOIN để kết hợp thông tin từ cả hai bảng
//     db.query("SELECT Chuong.*, Book.BookName FROM Chuong INNER JOIN Book ON Chuong.IDBook = Book.IDBook", function (err, Cart) {
//         if (err) {
//             result(null);
//         } else {
//             result(Cart);
//         }
//     });
// }
module.exports = Chuong;
