const db=require("../Connect/Conectdb");
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator'); // Cài đặt bằng cách sử dụng: npm install otp-generator
const twilio = require('twilio');

const Users=function(Users){
    this.IDUser=Users.IDUser;
    this.UserName=Users.UserName;
    this.PassWord=Users.PassWord
    this.Email=Users.Email;
    this.Birthday=Users.Birthday;
    this.Phone=Users.Phone;
}

Users.get_all=function(result){
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Users", function (err, Users) {
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
//
//
// Users.create=function(data,result){
//     // Hash mật khẩu trước khi thêm vào cơ sở dữ liệu
//     bcrypt.hash(data.PassWord, 10, function (err, hashedPassword) {
//         if (err) {
//             result(null);
//         } else {
//             // Thay thế mật khẩu chưa mã hóa bằng mật khẩu đã được mã hóa
//             data.PassWord = hashedPassword;
//     db.query("INSERT INTO Users SET ?", data,function(err,Users){
//         if(err){
//             result(null);
//         }
//         else{
//             result({IDUser: Users.insertId, ...data});
//         }
//     });
//         }
//     });
// }

Users.create = function (data, result) {
    const generatedOTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    bcrypt.hash(data.PassWord, 10, function (err, hashedPassword) {
        if (err) {
            result(null);
        } else {
            data.PassWord = hashedPassword;

            // Lưu mã OTP trong cơ sở dữ liệu hoặc bộ lưu trữ tạm thời (như Redis) để xác minh sau này.

            db.query("INSERT INTO Users SET ?", data, function (err, Users) {
                if (err) {
                    result(null);
                } else {
                    result({ IDUser: Users.insertId, ...data });

                    // Gửi mã OTP đến số điện thoại người dùng bằng Twilio
                    sendOTPToUser(data.Phone, generatedOTP);
                }
            });
        }
    });
};


// Thêm hàm gửi mã OTP đến số điện thoại người dùng bằng Twilio
function sendOTPToUser(phone, otp) {
    const twilioClient = new twilio('YOUR_TWILIO_ACCOUNT_SID', 'YOUR_TWILIO_AUTH_TOKEN');

    twilioClient.messages.create({
        body: `Mã OTP của bạn là: ${otp}`,
        to: `+${phone}`, // Số điện thoại người dùng, Twilio yêu cầu định dạng số điện thoại "+123456789"
        from: 'YOUR_TWILIO_PHONE_NUMBER'
    }).then(message => {
        console.log(message.sid);
    }).catch(error => {
        console.error(error);
    });
}

Users.update=function(array,result){
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("UPDATE Users SET UserName=?,PassWord=?,Email=?,Birthday=?,Phone=? WHERE IDUser=?", [array.UserName,array.PassWord,array.Email,array.Birthday,array.Phone,array.IDUser],function(err,Admin){
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
Users.chekc_login = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    // Sử dụng prepared statement để tránh SQL injection
    db.query(
        "SELECT * FROM Users WHERE Email = ?",
        [data.Email],
        function (err, Users) {
            if (err) {
                console.error('Error during login query:', err);
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



module.exports=Users;