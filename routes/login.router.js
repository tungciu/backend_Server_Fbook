var express = require('express');
var router = express.Router();
var UsersController = require("../Controller/Users.controller");
const Usernmodal = require("../Modall/User.modal");
var Admincontroler = require("../Controller/Admin.controller");
const Adminmodal = require("../Modall/Admin.modal");
var JWT = require("../Connect/_JWT");
const bcrypt = require('bcrypt');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//updalod img
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imageData = req.file.buffer;
        const imageName = Date.now() + '_' + req.file.originalname;
        const imagePath = 'public/uploads/' + imageName;
        require('fs').writeFile(imagePath, imageData, (err) => {
            if (err) {
                console.error("Lỗi khi ghi ảnh:", err);
                res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
            } else {
            }
        });

        // Tiếp theo, bạn có thể lưu imagePath vào cơ sở dữ liệu tùy thuộc vào yêu cầu của bạn.

        // Gửi đường dẫn ảnh trả về cho client
        const imageUrl = '/uploads/' + imageName; // Đường dẫn ảnh trong public/uploads
        res.status(200).json({ imageUrl: imageUrl });
    } catch (error) {
        console.error("Lỗi khi xử lý ảnh:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post('/add', function(req, res, next) {
    // Lấy dữ liệu từ request body
    var newData = req.body;

    Usernmodal.create(newData, function(result) {
        if (result) {
            image = req.body.image;
            res.send({ result: result });

        } else {
            res.status(500).send({ error: "Mail hoạc sđt đã tồn tại" });
        }
    });
});

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
// router.post('/add', function (req, res, next) {
//     const userData = req.body;
//     console.log('Dữ liệu người dùng từ yêu cầu:', userData);
//
//     Usernmodal.create(userData, function (result) {
//         if (result === null) {
//             console.error('Lỗi máy chủ nội bộ');
//             res.status(500).send('Lỗi máy chủ nội bộ');
//         } else {
//             res.json(result);
//         }
//     });
// });

router.put('/update/:id', async function(req, res, next) {
    const id = req.params.id;
    const data = req.body;

    // Mã hóa mật khẩu nếu có sự thay đổi
    if (data.PassWord) {
        const hashedPassword = await bcrypt.hash(data.PassWord, 10);
        data.PassWord = hashedPassword;
    }

    Usernmodal.update({ ...data, IDUser: id }, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy User');
        } else {
            res.json(result);
        }
    });
});
// update theo sdt
router.put('/update_phone/:phone', async function(req, res, next) {
    const phone = req.params.phone;
    const data = req.body;

    // Mã hóa mật khẩu nếu có sự thay đổi
    if (data.PassWord) {
        const hashedPassword = await bcrypt.hash(data.PassWord, 10);
        data.PassWord = hashedPassword;
    }

    Usernmodal.update({ ...data, Phone: phone }, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy User');
        } else {
            res.json(result);
        }
    });
});




router.post("/login_admin", Admincontroler.login);
//verifyOTP
// Trong file router.js hoặc tương tự
router.post('/verify_otp', function (req, res, next) {
    const data  = req.body;

    Usernmodal.verifyOTP(data, function (result) {
        if (result) {
            // Xác nhận OTP thành công, trả về thông tin người dùng và token
            res.send({ result:result});
        } else {
            // Xác nhận OTP thất bại
            res.send({ result: 'Xác nhận OTP thất bại' });
        }
    });
});

module.exports = router;
