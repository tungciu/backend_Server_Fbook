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
    db.query("SELECT * FROM Bill", function (err, Bill) {
        if (err) {
            result(null);
        } else {
            result(Bill);
        }
    });
}

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
        SELECT * FROM Bill
        WHERE 
            IDBook LIKE ? or
            status LIKE ?;
    `;

    const searchKeyword = `%${keyword}%`;

    db.query(query, [searchKeyword, searchKeyword], function (err, Bills) {
        if (err) {
            result(null);
        } else {
            result(Bills);
        }
    });
};

module.exports=Bill;