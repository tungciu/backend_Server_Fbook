const db=require('../Connect/Conectdb');

const Bill = function (Bill) {
    this.IDBill = Bill.IDBill;
    this.Status = Bill.Status;
    this.PriceTotal = Bill.PriceTotal;
    this.IDUser = Bill.IDUser;
    this.IDBook = Bill.IDBook;
    this.Create_at = Bill.Create_at;

}
Bill.get_all = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Bill.*, Book.BookName, Users.UserName
        FROM Bill
        LEFT JOIN Book ON Bill.IDBook = Book.IDBook
        LEFT JOIN Users ON Bill.IDUser = Users.IDUser
    `;

    db.query(query, function (err, billlWithCategories) {
        if (err) {
            result(null);
        } else {
            result(billlWithCategories);
        }
    });
};

Bill.getByid = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Bill WHERE IDBill = ?", id, function (err, Bill) {
        if (err || Bill.length == 0) {
            result(null);
        } else {
            result(Bill[0]);
        }
    });
}

Bill.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("DELETE FROM Bill WHERE IDBill = ?", id, function (err, Bill) {
        if (err) {
            result(null);
        } else {
            result("XOA THANH CONG Bill CO ID " + id);
        }
    });
}
Bill.search = function (keyword, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Bill.*, Book.BookName, Users.UserName
        FROM Bill
        LEFT JOIN Book ON Bill.IDBook = Book.IDBook
        LEFT JOIN Users ON Bill.IDUser = Users.IDUser
        WHERE 
            Book.BookName LIKE ? OR
            Bill.status LIKE ? OR
            Bill.PriceTotal LIKE ?;
    `;

    const searchKeyword = `%${keyword}%`;

    db.query(query, [searchKeyword, searchKeyword, searchKeyword], function (err, Bills) {
        if (err) {
            result(null);
        } else {
            result(Bills);
        }
    });
};

Bill.create = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("INSERT INTO Bill SET ?", data, function (err, Bill) {
        if (err) {
            console.error("Error inserting into Bill table:", err);
            result(null);
        } else {
            result({ IDBill: Bill.insertId, ...data });
        }
    });
};


// Thêm vào đối tượng Bill theo ngày
Bill.getTotalByDateRange = function (startDate, endDate, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT 
            SUM(PriceTotal) AS total,
            COUNT(*) AS totalOrders
        FROM Bill
        WHERE
            Status = 'Paid' AND
            Create_at BETWEEN ? AND ?;
    `;

    db.query(query, [startDate, endDate], function (err, total) {
        if (err) {
            result(null);
        } else {
            result({
                total: total[0].total || 0,
                totalOrders: total[0].totalOrders || 0
            });

        }
    });
};

// Thêm vào đối tượng Bill theo tháng
Bill.getTotalByMonth = function (year, month, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const firstDayOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(year, month, 0).toISOString().split('T')[0];

    // Gọi hàm getTotalByDateRange để sử dụng lại logic thống kê theo ngày
    Bill.getTotalByDateRange(firstDayOfMonth, lastDayOfMonth, result);
};



module.exports=Bill;