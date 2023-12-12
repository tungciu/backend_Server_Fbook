var express = require('express');
var router = express.Router();
var Billnmodal = require("../Modall/Bill.modal");
var momoPayment = require('../Connect/momo-payment')

// Lấy tất cả admins
router.get('/get_list', function(req, res, next) {
    Billnmodal.get_all(function(data) {
        res.send({ result: data });
    });
});


// Lấy một admin cụ thể bằng ID
router.get('/get_list/:id', function(req, res, next) {
    const id = req.params.id;
    Billnmodal.getByid(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Bill');
        } else {
            res.json(result);
        }
    });
});

// Xóa một admin theo ID
router.delete('/delete/:id', function(req, res, next) {
    const id = req.params.id;
    Billnmodal.remove(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Bill');
        } else {
            res.send(result);
        }
    });
});

// Tạo (thêm) một admin mới
router.post('/add', function(req, res, next) {
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    Billnmodal.create(data, function(result) {
        if (result === null) {
            res.status(500).json({ Status: 'fail' }); // Trả về đối tượng JSON với trạng thái 'fail'
        } else {
            res.json({ Status: true, result: result }); // Trả về đối tượng JSON với trạng thái 'true' và dữ liệu kết quả
        }
    });
});


// router.post('/add-with-momo', async function (req, res, next) {
//     try {
//         const orderInfo = {
//             orderId: 'your_order_id', // Thay đổi theo định dạng của ứng dụng bạn
//             orderDescription: 'your_order_description', // Thay đổi theo định dạng của ứng dụng bạn
//             amount: req.body.amount, // Lấy số tiền từ dữ liệu yêu cầu
//         };
//
//         // Gọi hàm thanh toán Momo
//         const paymentResult = await momoPayment.initiatePayment(orderInfo);
//
//         // Nếu thanh toán Momo thành công, thêm mới vào cơ sở dữ liệu
//         if (paymentResult.errorCode === '0') {
//             const data = {
//                 ...req.body,
//                 // Thêm các trường khác nếu cần
//             };
//
//             // Gọi hàm thêm mới từ modal
//             Billnmodal.create(data, function (result) {
//                 if (result === null) {
//                     res.status(500).send('Lỗi máy chủ nội bộ');
//                 } else {
//                     res.json({ paymentResult, newBill: result });
//                 }
//             });
//         } else {
//             // Xử lý khi thanh toán Momo không thành công
//             res.status(400).json({ error: 'Thanh toán Momo không thành công', paymentResult });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Lỗi Nội Bộ Server');
//     }
// });
// Cập nhật (update) một admin hiện tại theo ID
router.put('/update/:id', function(req, res, next) {
    const id = req.params.id;
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    Billnmodal.update({ ...data, IDBill: id }, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Bill');
        } else {
            res.json(result);
        }
    });
});
// api tìm kiếm
router.get('/search/:keyword', function(req, res, next) {
    const keyword = req.params.keyword;
    Billnmodal.search(keyword, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy kết quả');
        } else {
            res.json(result);
        }
    });
});


router.get('/bydate/:startDate/:endDate', function(req, res, next) {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;

    Billnmodal.getTotalByDateRange(startDate, endDate, function(result) {
        if (result === null) {
            res.status(404).send('Không có dữ liệu thống kê cho khoảng thời gian này');
        } else {
            res.json({ total: result });
        }
    });
})

router.get('/bymonth/:year/:month', function(req, res, next) {
    const year = req.params.year;
    const month = req.params.month;

    Billnmodal.getTotalByMonth(year, month, function(result) {
        if (result === null) {
            res.status(404).send('Không có dữ liệu thống kê cho tháng này');
        } else {
            res.json({ total: result });
        }
    });
});


module.exports = router;
