var express = require('express');
var router = express.Router();
var Billnmodal = require("../Modall/Bill.modal");


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
            res.status(500).send('Lỗi máy chủ nội bộ');
        } else {
            res.json(result);
        }
    });
});

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
module.exports = router;
