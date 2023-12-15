const db=require('../Connect/Conectdb');
const axios = require('axios');
const querystring = require("querystring");
const Bill = function (Bill) {
    this.IDBill = Bill.IDBill;
    this.Status = Bill.Status;
    this.PriceTotal = Bill.PriceTotal;
    this.IDUser = Bill.IDUser;
    this.IDBook = Bill.IDBook;
    this.Create_at = Bill.Create_at;
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
//
// Bill.prototype.createPaymentUrl = async function (data, callback) {
//     const paymentUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
//
//     // Tạo dữ liệu thanh toán
//     // const paymentData = {
//     //     vnp_TmnCode: 'IOMBN37N',
//     //     vnp_Amount: data.PriceTotal * 100, // Phải nhân 100 để chuyển đổi sang đơn vị tiền tệ VND
//     //     vnp_Command: 'pay',
//     //
//     // };
//     const paymentData = {
//         vnp_TmnCode: 'IOMBN37N',
//         vnp_Amount: data.PriceTotal * 100,
//         vnp_Command: 'pay',
//         vnp_OrderInfo: 'Thông tin đơn hàng',
//         vnp_OrderType: 'Loại đơn hàng',
//         vnp_Locale: 'vi-VN',
//         vnp_ReturnUrl: 'URL chuyển hướng sau khi thanh toán',
//         // Các trường khác nếu cần thiết
//     };
//     // Tính checksum
//     const secretKey = 'FTHVDDVHWYFGMOUHOBZDQILOKXOBYWOF';
//     const sortedData = Object.keys(paymentData).sort().reduce((acc, key) => {
//         acc[key] = paymentData[key];
//         return acc;
//     }, {});
//     const querystring = require('querystring');
//     const query = querystring.stringify(sortedData);
//     const checksum = require('crypto').createHmac('SHA256', secretKey).update(query).digest('hex');
//     paymentData.vnp_SecureHash = checksum.toUpperCase();
//
//     // Log the paymentData for debugging
//     console.log("Payment Data to VNPAY:", paymentData);
//
//     // Gửi yêu cầu POST đến VNPAY
//     try {
//
//         const response = await axios.post(paymentUrl, paymentData);
//
//         callback(null, { redirectUrl: response.request.res.responseUrl });
//     } catch (error) {
//         console.error("Error creating VNPAY payment URL:", error);
//         callback("Internal Server Error");
//     }
// };
Bill.prototype.createPaymentUrl = async function (data, callback) {
    const paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"

    // Tạo dữ liệu thanh toán
    const paymentData = {
        vnp_TmnCode: 'IOMBN37N',
        vnp_Amount: data.PriceTotal * 100,
        vnp_Command: 'pay',
        vnp_OrderInfo: `Thanh toán đơn hàng ${data.IDBill}`,
        vnp_Locale: 'vi-VN',
        vnp_TransDate: new Date().toISOString().slice(0, 19).replace("T", " "), // Kiểm tra và điều chỉnh định dạng thời gian
        // Thêm các trường khác nếu cần thiết
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

    // Log the paymentData for debugging
    console.log("Payment Data:", paymentData);

    // Gửi yêu cầu POST đến VNPAY
    try {
        const response = await axios.post(paymentUrl, paymentData);
        callback(null, { redirectUrl: response.request.res.responseUrl });
    } catch (error) {
        console.error("Error creating VNPAY payment URL:", error);
        callback("Internal Server Error");
    }
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
// vnpay

module.exports=Bill;