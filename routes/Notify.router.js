var express = require('express');
const NotifyBackmodal = require("../Modall/Notify.modal");
const FeedBackmodal = require("../Modall/FeedBack.modal");

var router = express.Router();

router.get('/get_list', function(req, res, next) {
    NotifyBackmodal.get_all(function(data) {
        res.send({ result: data });
    });
});
router.post('/add', function(req, res, next) {
    // Lấy dữ liệu từ request body
    var newData = req.body;

    // Thêm thời gian hiện tại vào newData.Create_at
    newData.Create_at = new Date();

    NotifyBackmodal.create(newData, function(result) {
        if (result) {
            res.send({ result: result });
        } else {
            res.status(500).send({ error: "Lôi them fe" });
        }
    });
});
router.get('/get_iduser/:id', function(req, res, next) {
    const id = req.params.id;

    NotifyBackmodal.get_by_user_id(id, function(data) {
        if (data) {
            res.send({ result: data });
        } else {
            res.status(500).send({ error: "Lỗi khi lấy danh sách phản hồi theo ID user" });
        }
    });
});


router.delete('/delete/:id', function(req, res, next) {
    const id = req.params.id;
    NotifyBackmodal.remove(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Noty');
        } else {
            res.send(result);
        }
    });
});



module.exports=router;