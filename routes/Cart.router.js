var express = require('express');
var router = express.Router();
var Cartnmodal = require("../Modall/Cart.modal");


// Lấy tất cả admins
router.get('/get_list', function(req, res, next) {
    Cartnmodal.get_all(function(data) {
        res.send({ result: data });
    });
});


// Lấy một admin cụ thể bằng ID
router.get('/get_list/:id', function(req, res, next) {
    const id = req.params.id;
    Cartnmodal.getByid(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Cart');
        } else {
            res.json(result);
        }
    });
});

// Xóa một admin theo ID
router.delete('/delete/:id', function(req, res, next) {
    const id = req.params.id;
    Cartnmodal.remove(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Cart');
        } else {
            res.send(result);
        }
    });
});

// Tạo (thêm) một admin mới
router.post('/add', function(req, res, next) {
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    Cartnmodal.create(data, function(result) {
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
    Cartnmodal.update({ ...data, IDCart: id }, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Cart');
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
