var Users=require('../Modall/User.modal');
var bcrypt = require('bcrypt');
var JWT = require("../Connect/_JWT");
exports.get_list=function(req,res){
    Users.get_all(function(data){
        res.send({result:data});
    })
}

exports.detail=function(req,res){
    Users.getByid(req.params.id,function(respnse){
        res.send({result:respnse});
    });

}

exports.remove_Users=function(req,res){
    var id=req.params.id;
    Users.remove(id,function(respnse){
        res.send({result:respnse});
    });
}
exports.update_Users=function(req,res){
    var data=req.body;
    Users.update(data,function (respnse){
        res.send({result:respnse});
    });
}

exports.add_Users = function (req, res) {
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

            Users.create(data, function (response) {
                res.send({ result: response });
            });
        }
    });
}

exports.login = function (req, res) {
    var data = req.body;
    Users.check_login(data, async function (user) {
        if (user) {
            // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
            bcrypt.compare(data.PassWord, user.PassWord, async function (err, result) {
                if (result) {
                    // Mật khẩu chính xác, trả về thông tin người dùng và yêu cầu nhập OTP
                    const userInfo = {
                        IDUser: user.IDUser,
                        UserName: user.UserName,
                        Email: user.Email,
                        Birthday: user.Birthday,
                        Phone: user.Phone,
                        // Thêm các thông tin khác bạn muốn gửi về
                    };
                    const _token = await JWT.make(userInfo);
                    res.send({ result: { token: _token, user: userInfo,message: 'Vui lòng nhập OTP để đăng nhập' }, status: true });
                    // res.send({ result: { user: userInfo, message: 'Vui lòng nhập OTP để đăng nhập' } });
                } else {
                    // Mật khẩu không chính xác
                    res.send({ result: "Mật khẩu không chính xác", status: false });
                }
            });
        } else {
            // Người dùng không tồn tại
            res.send({ result: "Người dùng không tồn tại", status: false });
        }
    });
};
// làm very otp tại đay

// exports.login = function (req, res) {
//     var data = req.body;
//     Users.chekc_login(data, async function (user) {
//         if (user) {
//             // So sánh mật khẩu đã nhập với mật khẩu đã mã hóa trong cơ sở dữ liệu
//             bcrypt.compare(data.PassWord, user.PassWord, async function (err, result) {
//                 if (result) {
//                     // Mật khẩu chính xác, tạo token và gửi về client cùng với thông tin người dùng
//                     const userInfo = {
//                         IDUser: user.IDUser,
//                         UserName: user.UserName,
//
//                         Email:user.Email,
//                        Birthday:user.Birthday,
//                        Phone:user.Phone,
//                         // thêm các thông tin khác bạn muốn gửi về
//                     };
//
//                     const _token = await JWT.make(userInfo);
//                     res.send({ result: { token: _token, user: userInfo }, status: true });
//                 } else {
//                     // Mật khẩu không chính xác
//                     res.send({ result: "Mật khẩu không chính xác", status: false });
//                 }
//             });
//         } else {
//             // Người dùng không tồn tại
//             res.send({ result: "Người dùng không tồn tại", status: false });
//         }
//     });
// };
