var express = require('express');
var router = express.Router();
var Usernmodal = require("../Modall/User.modal");
const { query } = require('express');
const { json } = require('express');
const bcrypt = require('bcrypt');
const { search } = require('../Modall/User.modal');
const JWT = require("../Connect/_JWT");
const multer = require("multer");
const Category = require("../Modall/Category.modal");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.put('/changepassword/:id', function(req, res, next) {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra xem có mật khẩu hiện tại và mật khẩu mới được cung cấp không
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ status: false, message: "Vui lòng cung cấp cả mật khẩu hiện tại và mật khẩu mới" });
    }

    // Thực hiện chức năng đổi mật khẩu
    Usernmodal.changePassword(id, currentPassword, newPassword, function(err) {
        if (err) {
            res.status(400).json({ status: false, message: err });
        } else {
            res.json({ status: true, message: "Mật khẩu đã được thay đổi thành công" });
        }
    });
});

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


// Lấy tất cả admins
router.get('/get_list', function(req, res, next) {
    Usernmodal.get_all(function(data) {
        res.send({ result: data });
    });
});

// Lấy một admin cụ thể bằng ID
router.get('/get_list/:id', function(req, res, next) {
    const id = req.params.id;
    Usernmodal.getByid(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy user');
        } else {
            res.json(result);
        }
    });
});

// Xóa một admin theo ID
router.delete('/delete/:id', function(req, res, next) {
    const id = req.params.id;
    Usernmodal.remove(id, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy Usernmodal');
        } else {
            res.send(result);
        }
    });
});


// });

router.post('/add', function(req, res, next) {
    // Lấy dữ liệu từ request body
    var newData = req.body;

    Usernmodal.create(newData, function(result) {
        if (result) {
            image = req.body.image;
            res.send({ result: result });

        } else {
            res.status(500).send({ error: "Error creating new Category." });
        }
    });
});
// Cập nhật (update) một admin hiện tại theo ID
router.put('/update/:id', function(req, res, next) {
    const id = req.params.id;
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    Usernmodal.update({ ...data, IDUser: id }, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy User');
        } else {
            res.json(result);
        }
    });
});
// api tìm kiếm
router.get('/search/:keyword', function(req, res, next) {
    const keyword = req.params.keyword;
    Usernmodal.search(keyword, function(result) {
        if (result === null) {
            res.status(404).send('Không tìm thấy kết quả');
        } else {
            res.json(result);
        }
    });
});


router.put('/updateprofile/:id', function(req, res, next) {
    const id = req.params.id;
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    Usernmodal.updateUserInfo({ ...data, IDUser: id }, function(result) {
        if (result === null) {
            res.status(404).json({ status: false, message: 'Không tìm thấy User' });
        } else {
            res.json({ status: true, message: "User info updated successfully", result: result });
        }
    });
});
// // dổi pas
// router.put('/change_password/:id', function(req, res, next) {
//     const id = req.params.id;
//     const newPassword = req.body.newPassword; // Mật khẩu mới từ phần thân yêu cầu
//
//     // Kiểm tra mật khẩu mới có được cung cấp hay không
//     if (!newPassword) {
//         res.status(400).json({ status: false, message: 'Vui lòng cung cấp mật khẩu mới' });
//         return;
//     }
//
//     // Thay đổi mật khẩu và cập nhật vào cơ sở dữ liệu
//     Usernmodal.changePassword(id, newPassword, function(err, result) {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ status: false, message: 'Lỗi máy chủ nội bộ' });
//         } else {
//             if (result.affectedRows === 0) {
//                 res.status(404).json({ status: false, message: 'Không tìm thấy người dùng' });
//             } else {
//                 res.json({ status: true, message: 'Đổi mật khẩu thành công' });
//             }
//         }
//     });
// });

// đổi theo ohone
// Ví dụ gọi hàm trong router
router.put('/change_password_by_phone/:phone', function(req, res, next) {
    const phone = req.params.phone;
    const newPassword = req.body.newPassword;

    Usernmodal.changePasswordByPhone(phone, newPassword, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).json({ status: false, message: 'Người dùng k tồn tại' });
        } else {
            if (result.message === "Mật khẩu đã được thay đổi thành công") {
                res.json({ status: true, message: result.message });
            } else {
                res.status(404).json({ status: false, message: result.message });
            }
        }
    });
});

module.exports = router;
