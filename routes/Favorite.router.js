var express = require('express');
var router = express.Router();
var Favoritemodal = require("../Modall/Favorite.modal");


// Lấy tất cả admins
router.get('/get_list', function(req, res, next) {
    Favoritemodal.get_all(function(data) {
        res.send({ result: data });
    });
});


// Lấy một admin cụ thể bằng ID
router.get('/get_id/:id', function(req, res, next) {
    const id = req.params.id;
    Favoritemodal.getByid(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Favorite');
        } else {
            res.json(result);
        }
    });
});
// Lấy một admin cụ thể bằng ID user
router.get('/byiduser/:id', function(req, res, next) {
    const id = req.params.id;
    Favoritemodal.getByUserId(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Favorite');
        } else {
            res.json(result);
        }
    });
});


router.delete('/delete/:id/:userId', function(req, res, next) {
    const id = req.params.id;
    const userId = req.params.userId;

    Favoritemodal.remove(id, userId, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Favorite');
        } else {
            res.send(result);
        }
    });
});

router.post('/add', function(req, res, next) {
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    Favoritemodal.create(data, function(result) {
        if (result === null) {
            res.status(500).json({ Status: 'fail' }); // Trả về đối tượng JSON với trạng thái 'fail'
        } else {
            res.json({ Status: true, result: result }); // Trả về đối tượng JSON với trạng thái 'true' và dữ liệu kết quả
        }
    });
});

// Cập nhật (update) một admin hiện tại theo ID
router.put('/update/:id', function(req, res, next) {
    const id = req.params.id;
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    Favoritemodal.update({ ...data, IDFavorite: id }, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Favorite');
        } else {
            res.json(result);
        }
    });
});
// xóa theo id user

module.exports = router;
