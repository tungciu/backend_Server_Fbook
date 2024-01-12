var Admin = require('../Modall/Admin.modal')
var bcrypt = require('bcrypt');
var JWT = require("../Connect/_JWT");

exports.get_list=function(req,res){
    Admin.get_all(function(data){
        res.send({result:data});
    });
};

exports.detail=function(req,res){
    Admin.getByid(req.params.id,function(respnse){
        res.send({result:respnse});
    });

}

exports.remove_Admin=function(req,res){
    var id=req.params.id;
    Admin.remove(id,function(respnse){
        res.send({result:respnse});
    });
}
exports.update_Admin=function(req,res){
    var data=req.body;
    Admin.update(data,function (respnse){
        res.send({result:respnse});
    });
}

exports.add_Admin = function (req, res) {
    var data = req.body;
    if (!data.PassWord) {
        res.status(400).send({ result: 'Mật khẩu không được để trống' });
        return;
    }
    bcrypt.hash(data.PassWord, 10, function (err, hash) {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).send({ result: 'Internal Server Error' });
        } else {
            data.PassWord = hash;

            Admin.create(data, function (response) {
                res.send({ result: response });
            });
        }
    });
}

//
// exports.login = function (req, res) {
//     var data = req.body;
//     Admin.chekc_login(data, async function (Admin) {
//         if (Admin) {
//             // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
//             bcrypt.compare(data.PassWord, Admin.PassWord, async function (err, result) {
//                 if (result) {
//                     // Mật khẩu chính xác, tạo token và gửi về client
//                     const _token = await JWT.make(Admin);
//                     res.send({ result: _token, status: true });
//                 } else {
//                     // Mật khẩu không chính xác
//                     res.send({ result: "mk k chinh xac", status: false });
//                 }
//             });
//         } else {
//             // Người dùng không tồn tại
//             res.send({ result: "không tồn tại", status: false });
//         }
//     });
// };
exports.login = function (req, res) {
    var data = req.body;
    Admin.chekc_login(data, async function (Admin) {
        if (Admin) {
            // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
            bcrypt.compare(data.PassWord, Admin.PassWord, async function (err, result) {
                if (result) {
                    // Mật khẩu chính xác, tạo token và gửi về client
                    const _token = await JWT.make(Admin);
                    res.send({ result: _token, status: true });
                } else {
                    // Mật khẩu không chính xác
                    res.send({ result: "Mật khẩu không chính xác", status: false });
                }
            });
        } else {
            // Người dùng không tồn tại
            res.send({ result: "Không tồn tại người dùng", status: false });
        }
    });
};
// đôi
