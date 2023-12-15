var express = require('express');
var router = express.Router();
var Usernmodal = require("../Modall/User.modal");
const { query } = require('express');
const { json } = require('express');
const { search } = require('../Modall/User.modal');

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
            res.status(404).send('Không tìm thấy Usernmodal');
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

// Tạo (thêm) một admin mới
router.post('/add', function(req, res, next) {
    const data = req.body; // Dữ liệu từ phần thân yêu cầu
    data.Create_at
    Usernmodal.create(data, function(result) {
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

// update info
// router.put('/updateprofile/:id', function(req, res, next) {
//     var userID = req.params.id;
//     var newName = req.body.newName;
//     var newBirthday = req.body.newBirthday;
//
//     Usernmodal.updateUserInfo(userID, newName, newBirthday, function(err, result) {
//         if (err) {
//             res.status(500).send({ error: "Error updating user info" });
//         } else {
//             res.send({ success: true, message: "User info updated successfully" });
//         }
//     });
// });

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
// dổi pas
router.put('/change_password/:id', function(req, res, next) {
    const id = req.params.id;
    const newPassword = req.body.newPassword; // Mật khẩu mới từ phần thân yêu cầu

    // Kiểm tra mật khẩu mới có được cung cấp hay không
    if (!newPassword) {
        res.status(400).json({ status: false, message: 'Vui lòng cung cấp mật khẩu mới' });
        return;
    }

    // Thay đổi mật khẩu và cập nhật vào cơ sở dữ liệu
    Usernmodal.changePassword(id, newPassword, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).json({ status: false, message: 'Lỗi máy chủ nội bộ' });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ status: false, message: 'Không tìm thấy người dùng' });
            } else {
                res.json({ status: true, message: 'Đổi mật khẩu thành công' });
            }
        }
    });
});

module.exports = router;
