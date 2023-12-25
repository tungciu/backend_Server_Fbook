var express = require('express');
var router = express.Router();
const Chuongmodal = require("../Modall/chuong.modal");



router.get('/get_list', function(req, res, next) {
    Chuongmodal.get_all(function(data) {
        res.send({ result: data });
    });
});

// theo id book
router.get('/get_chapters_idbook/:idBook', function(req, res, next) {
    const idBook = req.params.idBook;

    Chuongmodal.getChuongByIdBook(idBook, function(data) {
        res.send({ result: data });
    });
});
// theo id chuong
router.get('/get_chapters_idchuong/:idChuong', function(req, res, next) {
    const idChuong = req.params.idChuong;

    Chuongmodal.getChuongByIdChuong(idChuong, function(data) {
        res.send({ result: data });
    });
});

router.post('/add', function(req, res, next) {
    // Lấy dữ liệu từ request body
    var newData = req.body;

    // Thêm thời gian hiện tại vào newData.Create_at
    newData.Create_at = new Date();

    Chuongmodal.create(newData, function(result) {
        if (result) {
            res.send({ result: result });
        } else {
            res.status(500).send({ error: "Error creating new Chuong." });
        }
    });
});

//
// router.post('/add', function(req, res, next) {
//     const data = req.body; // Dữ liệu từ phần thân yêu cầu
//     Chuongmodal.create(data, function(result) {
//         if (result === null) {
//             res.status(500).send('Lỗi máy chủ nội bộ');
//         } else {
//             res.json(result);
//         }
//     });
// });
router.put('/update/:id', function(req, res, next) {
    const id = req.params.id;
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    data.Create_at = new Date()
    Chuongmodal.update({ ...data, IDchuong: id }, function(result) {
        if (result === null) {
            console.error('Không tìm thấy Chuong hoặc có lỗi từ cơ sở dữ liệu');
            res.status(404).send('Không tìm thấy Chuong hoặc có lỗi từ cơ sở dữ liệu');
        } else {
            console.log('Chuong đã được cập nhật:', result);
            res.json(result);
        }
    });
});
router.delete('/delete/:id', function(req, res, next) {
    const id = req.params.id;
    Chuongmodal.remove(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Chuong');
        } else {
            res.send(result);
        }
    });
});
module.exports=router;