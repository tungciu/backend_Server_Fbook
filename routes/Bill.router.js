var express = require('express');
var router = express.Router();
var Billnmodal = require("../Modall/Bill.modal");


// router.post('/add', function(req, res, next) {
//     const data = req.body;
//     Billnmodal.create(data, async function(result) {
//         if (result === null) {
//             res.status(500).json({ Status: 'fail' });
//         } else {
//             // Tạo URL thanh toán và chuyển hướng người dùng đến trang thanh toán
//             await result.createPaymentUrl(data, function(paymentError, paymentData) {
//                 if (paymentError === null) {
//                     res.json({ Status: true, result: result, paymentData: paymentData });
//                 } else {
//                     res.status(500).json({ Status: 'fail', error: paymentError });
//                 }
//             });
//         }
//     });
// });
// Trong hàm router.post('/add')
router.post('/add', function(req, res, next) {
    const data = req.body;
    Billnmodal.create(data, async function(result) {
        if (result === null) {
            res.status(500).json({ Status: 'fail' });
        } else {
            // Tạo URL thanh toán và chuyển hướng người dùng đến trang thanh toán
            await result.createPaymentUrl(result, function(paymentError, paymentData) {
                if (paymentError === null) {
                    res.json({ Status: true, result: result, paymentData: paymentData });
                } else {
                    res.status(500).json({ Status: 'fail', error: paymentError });
                }
            });
        }
    });
});

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

// Tạo (thêm)
// router.post('/add', function(req, res, next) {
//     const data = req.body; // Dữ liệu từ phần thân yêu cầu
//     Billnmodal.create(data, function(result) {
//         if (result === null) {
//             res.status(500).json({ Status: 'fail' }); // Trả về đối tượng JSON với trạng thái 'fail'
//         } else {
//             res.json({ Status: true, result: result }); // Trả về đối tượng JSON với trạng thái 'true' và dữ liệu kết quả
//         }
//     });
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

// Thêm vào router
router.get('/getbookpaid/:id', function(req, res, next) {
    const id = req.params.id;
    Billnmodal.getbookPaid(id, function(result) {
        if (result === null) {
            res.status(404).send('Không có sách nào được thanh toán cho người dùng có ID này');
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
