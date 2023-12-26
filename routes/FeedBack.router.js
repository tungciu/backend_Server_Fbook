var express = require('express');
const FeedBackmodal = require("../Modall/FeedBack.modal");
var router = express.Router();

router.get('/get_list', function(req, res, next) {
    FeedBackmodal.get_all(function(data) {
        res.send({ result: data });
    });
});
router.post('/add', function(req, res, next) {
    // Lấy dữ liệu từ request body
    var newData = req.body;

    // Thêm thời gian hiện tại vào newData.Create_at
    newData.Create_at = new Date();

    FeedBackmodal.create(newData, function(result) {
        if (result) {
            res.send({ result: result });
        } else {
            res.status(500).send({ error: "Lôi them fe" });
        }
    });
});
// thei id book
router.get('/get_idbook/:bookId', function(req, res, next) {
    const bookId = req.params.bookId;

    FeedBackmodal.get_by_book_id(bookId, function(data) {
        if (data) {
            res.send({ result: data });
        } else {
            res.status(500).send({ error: "Lỗi khi lấy danh sách phản hồi theo ID sách" });
        }
    });
});
// tìm kiếm theo user name,book name,so sao
router.get('/search', function(req, res, next) {
    const userName = req.query.userName;
    const bookName = req.query.bookName;
    const rate = req.query.rate;

    FeedBackmodal.search(userName, bookName, rate, function(data) {
        if (data) {
            res.send({ result: data });
        } else {
            res.status(500).send({ error: "Lỗi khi tìm kiếm phản hồi" });
        }
    });
});

router.get('/search/:keyword', function(req, res, next) {
    const keyword = req.params.keyword;
    FeedBackmodal.search(keyword, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy kết quả');
        } else {
            res.json(result);
        }
    });
});

router.delete('/delete/:id', function(req, res, next) {
    const id = req.params.id;
    FeedBackmodal.remove(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy FE');
        } else {
            res.send(result);
        }
    });
});

// sao tb
router.get('/average_rating/:idBook', function(req, res, next) {
    const bookId = req.params.idBook;

    FeedBackmodal.averageRatingByBookId(bookId, function(averageRating,result) {
        if (averageRating !== null) {
            res.send({ averageRating: averageRating, });
        } else {
            res.status(500).send({ error: "Lỗi khi lấy trung bình đánh giá sao cho sách." });
        }
    });
});

module.exports=router;