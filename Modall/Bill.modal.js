const db=require('../Connect/Conectdb');
const axios = require('axios');

const querystring = require("querystring");
import('dateformat').then((dateFormatModule) => {
    const dateFormat = dateFormatModule;
    // Bây giờ bạn có thể sử dụng dateFormat trong mã nguồn của bạn
});
const crypto = require("crypto");


const Bill = function (Bill) {
    this.IDBill = Bill.IDBill;
    this.Status = Bill.Status;
    this.PriceTotal = Bill.PriceTotal;
    this.IDUser = Bill.IDUser;
    this.IDBook = Bill.IDBook;
    this.Create_at = Bill.Create_at;
};
Bill.getTopSellingBooks = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Book.IDBook, Book.BookName, Book.ImageBook, Book.PriceBook, COUNT(Bill.IDBook) AS TotalSold
        FROM Bill
        INNER JOIN Book ON Bill.IDBook = Book.IDBook
        WHERE Bill.Status = 'Đã thanh toán'
        GROUP BY Book.IDBook
        ORDER BY TotalSold DESC
        LIMIT 10;
    `;

    db.query(query, function (err, topSellingBooks) {
        if (err) {
            result(null);
        } else {
            console.log("Kết quả top sách bán chạy nhất:", topSellingBooks);

            result(topSellingBooks);
        }
    });
};


// thanh toan
function sortObject(obj) {
    return Object.keys(obj).sort().reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
}

// Trong hàm Bill.prototype.createPaymentUrl
Bill.prototype.createPaymentUrl = async function (data, callback) {
    const paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    if (!data.IDBill) {
        callback("IDBill không hợp lệ");
        return;
    }
    // Tạo dữ liệu thanh toán
    const paymentData = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: 'IOMBN37N',
        vnp_Amount: data.PriceTotal * 100,
        vnp_CreateDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        vnp_CurrCode: 'VND',
        vnp_IpAddr: '13.160.92.202',
        vnp_Locale: 'vi-VN',
        vnp_OrderInfo: `Thanh toán đơn hàng ${data.IDBill}`, // Cập nhật để sử dụng IDBill
        vnp_ReturnUrl: 'https://domain.vn/VnPayReturn',
        vnp_TxnRef: data.IDBill, // Giả sử data.IDBill là duy nhất cho mỗi giao dịch

        // Thêm các tham số tùy chọn khác nếu cần
    };

    // Tính checksum
    const secretKey = 'FTHVDDVHWYFGMOUHOBZDQILOKXOBYWOF';
    const sortedData = Object.keys(paymentData).sort().reduce((acc, key) => {
        acc[key] = paymentData[key];
        return acc;
    }, {});
    const querystring = require('querystring');
    const query = querystring.stringify(sortedData);
    const checksum = require('crypto').createHmac('SHA256', secretKey).update(query).digest('hex');
    paymentData.vnp_SecureHash = checksum.toUpperCase();

    // Ghi log dữ liệu thanh toán để kiểm tra lỗi
    console.log("Dữ liệu thanh toán:", paymentData);

    // Gửi yêu cầu POST đến VNPAY
    try {
        const response = await axios.post(paymentUrl, paymentData);
        callback(null, { redirectUrl: response.request.res.responseUrl });
    } catch (error) {
        console.error("Lỗi khi tạo URL thanh toán VNPAY:", error);
        callback("Lỗi máy chủ nội bộ");
    }
};




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

// Bill.create = function (data, result) {
//     if (db.state === 'disconnected') {
//         db.connect();
//     }
//     db.query("INSERT INTO Bill SET ?", data, function (err, Bill) {
//         if (err) {
//             console.error("Error inserting into Bill table:", err);
//             result(null);
//         } else {
//             result({ IDBill: Bill.insertId, ...data });
//         }
//     });
// };
Bill.create = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("INSERT INTO Bill SET ?", data, function (err, newBill) {
        if (err) {
            console.error("Error inserting into Bill table:", err);
            result(null);
        } else {
            const billInstance = new Bill({ IDBill: newBill.insertId, ...data });
            result(billInstance);
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
            Status = 'Đã thanh toán' AND
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


Bill.getbookPaid = function (IDUser, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Book.*, Bill.PriceTotal, Bill.Create_at
        FROM Bill
        INNER JOIN Book ON Bill.IDBook = Book.IDBook
        WHERE Bill.IDUser = ? AND Bill.Status = 'Đã thanh toán';
    `;

    db.query(query, IDUser, function (err, paidBooks) {
        if (err) {
            result(null);
        } else {
            result(paidBooks);
        }
    });
};
//

Bill.getPaidBillsByUserID = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const query = `
        SELECT Bill.IDBill, Book.BookName, Bill.PriceTotal, Bill.Status, Bill.Create_at
        FROM Bill
        INNER JOIN Book ON Bill.IDBook = Book.IDBook
        WHERE Bill.IDUser = ? AND Bill.Status = 'Đã thanh toán'
    `;

    db.query(query, [id], function (err, paidBills) {
        if (err) {
            result(null);
        } else {
            result(paidBills);
        }
    });
};


module.exports=Bill;