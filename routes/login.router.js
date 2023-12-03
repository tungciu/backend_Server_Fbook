var express = require('express');
var router = express.Router();
var UsersController = require("../Controller/Users.controller");
const Usernmodal = require("../Modall/User.modal");
var Admincontroler = require("../Controller/Admin.controller");
const Adminmodal = require("../Modall/Admin.modal");
var JWT = require("../Connect/_JWT");


router.post("/login", UsersController.login);

router.get("/check_token", async function (req, res) {
    try {
        // Lấy token từ header "Authorization"
        const _token = req.header("Authorization");

        if (!_token) {
            throw new Error("Token not provided");
        }

        const data = await JWT.check(_token);
        res.send({ data: data });
    } catch (error) {
        res.send({ data: "Mã token không hợp lệ" });
    }
});
router.post('/add', function (req, res, next) {
    const userData = req.body;
    console.log('Dữ liệu người dùng từ yêu cầu:', userData);

    Usernmodal.create(userData, function (result) {
        if (result === null) {
            console.error('Lỗi máy chủ nội bộ');
            res.status(500).send('Lỗi máy chủ nội bộ');
        } else {
            res.json(result);
        }
    });
});

// admin



router.post("/login_admin", Admincontroler.login);
//verifyOTP
// Trong file router.js hoặc tương tự
router.post('/verify_otp', function (req, res, next) {
    const userData = req.body;

    Usernmodal.verifyOTP(userData, function (isVerified) {
        if (isVerified) {
            res.json({ message: 'Xác nhận OTP thành công' });
        } else {
            res.status(400).json({ message: 'Xác nhận OTP thất bại' });
        }
    });
});

module.exports = router;
