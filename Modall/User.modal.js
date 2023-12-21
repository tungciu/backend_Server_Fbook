const db=require("../Connect/Conectdb");
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator'); // Cài đặt bằng cách sử dụng: npm install otp-generator
const twilio = require('twilio');
var JWT = require("../Connect/_JWT");
const Users=function(Users){
    this.IDUser=Users.IDUser;
    this.UserName=Users.UserName;
    this.PassWord=Users.PassWord
    this.Email=Users.Email;
    this.Birthday=Users.Birthday;
    this.Phone=Users.Phone;
    this.otp=Users.otp;
    this.Create_at=Users.Create_at;
    this.img = Users.img;
}

Users.get_all = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Users ORDER BY Create_at DESC", function (err, Users) {
        if (err) {
            result(null);
        } else {
            result(Users);
        }
    });
}

Users.getByid = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Users WHERE IDUser = ?", id, function (err, Users) {
        if (err || Users.length == 0) {
            result(null);
        } else {
            result(Users[0]);
        }
    });
}


Users.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("DELETE FROM Users WHERE IDUser = ?", id, function (err, IDUser) {
        if (err) {
            result(null);
        } else {
            result("XOA THANH CONG User CO ID " + id);
        }
    });
}

Users.create=function(data,result){
    // Hash mật khẩu trước khi thêm vào cơ sở dữ liệu
    bcrypt.hash(data.PassWord, 10, function (err, hashedPassword) {
        if (err) {
            result(null);
        } else {
            // Thay thế mật khẩu chưa mã hóa bằng mật khẩu đã được mã hóa
            data.PassWord = hashedPassword;
    db.query("INSERT INTO Users SET ?", data,function(err,Users){
        if(err){
            result(null);
        }
        else{
            result({IDUser: Users.insertId, ...data});
        }
    });
        }
    });
}


// Hàm sinh OTP
const generateOTP = () => {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
};
// Hàm gửi OTP qua SMS sử dụng Twilio
const sendOTP = (phone, otp) => {
    const accountSid = 'AC6925df19b81134d3c0affaf1f673667e';
    const authToken = '912aac40364adc6a0cf52e61d46bf421';
    const twilioPhone = "+12058902672";  // Thay thế bằng số điện thoại Twilio đã xác nhận của bạn

    const client = new twilio(accountSid, authToken);

    return client.messages.create({
        body: `Mã OTP của bạn là: ${otp}`,
        from: twilioPhone,
        to: phone
    });
};

Users.verifyOTP = function (data, result) {
    db.query("SELECT * FROM Users WHERE Phone = ? AND otp = ?", [data.Phone, data.otp], function (err, Users) {
        if (err || Users.length === 0) {
            result(false); // Xác nhận OTP thất bại
        } else {
            const userInfo = {
                IDUser: Users[0].IDUser,
                UserName: Users[0].UserName,
                Email: Users[0].Email,
                Birthday: Users[0].Birthday,
                Create_at:Users[0].Create_at,
                Phone: Users[0].Phone,
                // Thêm các thông tin khác bạn muốn gửi về
            };
            // result(true ); // Xác nhận OTP thành công
            result({ user: userInfo, message:"Thanh cong" },true);
        }
    });
};

Users.update=function(array,result){
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("UPDATE Users SET UserName=?,PassWord=?,Email=?,Birthday=?,Phone=?,Create_at=?,img=? WHERE IDUser=?", [array.UserName,array.PassWord,array.Email,array.Birthday,array.Phone,array.Create_at,array.img,array.IDUser],function(err,Admin){
        if(err){
            result(null);
        }
        else{
            result(array);

        }
    });
}
Users.search = function (keyword, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    const query = "SELECT * FROM Users WHERE UserName LIKE ? OR IDUser = ?";
    const searchKeyword = `%${keyword}%`;
    db.query(query, [searchKeyword, keyword], function (err, Users) {
        if (err) {
            result(null);
        } else {
            result(Users);
        }
    });
}

// Users.check_login = function (data, result) {
//     if (db.state === 'disconnected') {
//         db.connect();
//     }
//
//     // Sử dụng prepared statement để tránh SQL injection
//     db.query(
//         "SELECT * FROM Users WHERE Email = ?",
//         [data.Email],
//         function (err, Users) {
//             if (err) {
//                 console.error('Lỗi trong quá trình truy vấn đăng nhập:', err);
//                 result(null);
//             } else {
//                 if (Users.length === 0) {
//                     // Không tìm thấy người dùng
//                     result(null);
//                 } else {
//                     // Tạo và lưu trữ OTP mới
//                     const otp = generateOTP();
//                     db.query("UPDATE Users SET otp = ? WHERE Email = ?", [otp, data.Email], function (err) {
//                         if (err) {
//                             console.error('Lỗi khi cập nhật OTP:', err);
//                             result(null);
//                         } else {
//                             // Gửi OTP qua SMS
//                             sendOTP(Users[0].Phone, otp);
//                             console.log("OPT LÀ:" +otp)
//                             // So sánh mật khẩu (đã được băm)
//                             const hashedPasswordFromDB = Users[0].PassWord;
//                             result(Users[0]);
//                         }
//                     });
//                 }
//             }
//         }
//     );
// };
Users.check_login = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    // Sử dụng prepared statement để tránh SQL injection
    db.query(
        "SELECT * FROM Users WHERE Email = ?",
        [data.Email],
        function (err, Users) {
            if (err) {
                console.error('Lỗi trong quá trình truy vấn đăng nhập:', err);
                result(null);
            } else {
                if (Users.length === 0) {
                    // Không tìm thấy người dùng
                    result(null);
                } else {
                    // So sánh mật khẩu (đã được băm)
                    const hashedPasswordFromDB = Users[0].PassWord;
                    result(Users[0]);
                }
            }
        }
    );
};

//update theo sdt
Users.update = function (array, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    if (array.Phone) {
        // Nếu có sự thay đổi trong số điện thoại, thì kiểm tra xem số điện thoại mới đã tồn tại chưa
        db.query("SELECT * FROM Users WHERE Phone = ? AND IDUser != ?", [array.Phone, array.IDUser], function (err, existingUser) {
            if (err) {
                result(null);
            } else if (existingUser.length > 0) {
                // Số điện thoại đã tồn tại cho một người dùng khác
                result(null);
            } else {
                // Tiến hành cập nhật nếu số điện thoại hợp lệ
                updateUser();
            }
        });
    } else {
        // Nếu không có thay đổi trong số điện thoại, tiến hành cập nhật ngay lập tức
        updateUser();
    }

    function updateUser() {
        db.query("UPDATE Users SET UserName=?, PassWord=?, Email=?, Birthday=?, Phone=?, Create_at=?,img=? WHERE IDUser=?", [array.UserName, array.PassWord, array.Email, array.Birthday, array.Phone,array.Create_at,array.img, array.IDUser], function (err, Admin) {
            if (err) {
                result(null);
            } else {
                result(array);
            }
        });
    }
};
// update info
Users.updateUserInfo = function (array, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    // Trước khi thực hiện cập nhật, kiểm tra xem người dùng có tồn tại không
    db.query("SELECT * FROM Users WHERE IDUser=?", [array.IDUser], function (selectErr, selectResult) {
        if (selectErr) {
            result(null);
        } else {
            if (selectResult.length === 0) {
                // Người dùng không tồn tại
                result(null);
            } else {
                // Người dùng tồn tại, thực hiện cập nhật
                db.query("UPDATE Users SET UserName=?, Birthday=?,img=? WHERE IDUser=?", [array.UserName, array.Birthday,array.img, array.IDUser], function (updateErr, updateResult) {
                    if (updateErr) {
                        result(null);
                    } else {
                        result(array);
                    }
                });
            }
        }
    });
};
// forgotpas
Users.changePassword = function (IDUser, newPassword, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newPassword, salt, function (err, hash) {
            if (err) {
                result(err, null);
            } else {
                db.query("UPDATE Users SET PassWord = ? WHERE IDUser = ?", [hash, IDUser], function (err, res) {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, res);
                    }
                });
            }
        });
    });
};


module.exports = Users;