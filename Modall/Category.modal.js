const db=require("../Connect/Conectdb");

const Category = function (Category) {
    this.IDCat = Category.IDCat;
    this.CatName = Category.CatName;
    this.img = Category.img;
};

Category.get_all = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Category", function (err, Category) {
        if (err) {
            console.error("Lỗi khi lấy danh sách Category:", err);
            result(null);
        } else {
            result(Category);
        }

    });
};
Category.create = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("INSERT INTO Category SET ?", data, function (err, Category) {
        if (err) {
            result(null);
        } else {
            result({ IDCat: Category.insertId, ...data });
        }

    });
};
Category.update = function (array, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query(
        "UPDATE Category SET CatName=?,img=? WHERE IDCat=?",
        [array.CatName, array.img, array.IDCat],
        function (err, Category) {
            if (err) {
                result(null);
            } else {
                result(array);
            }

        }
    );
};

Category.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query(
        "DELETE FROM Category WHERE IDCat = ?",
        id,
        function (err, Category) {
            if (err) {
                result(null);
            } else {
                result("XOA THANH CONG IDCat CO ID " + id);
            }

        }
    );
};

// Trong phương thức checkUsage của đối tượng Category
Category.checkUsage = function (idCat, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    // Kiểm tra xem danh mục có được sử dụng trong bảng Book không
    const bookQuery = `SELECT COUNT(*) AS bookCount FROM Book WHERE IDCat = ${db.escape(idCat)}`;
    db.query(bookQuery, function (err, bookResult) {
        if (err) {
            console.error("Lỗi khi kiểm tra trong bảng Book:", err);
            result(null);
        } else {
            // Trả về kết quả kiểm tra
            result({
                isUsedInBook: bookResult[0].bookCount > 0,
            });
        }
    });
};
module.exports=Category;