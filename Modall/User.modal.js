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
    this.otp=Users.otp;
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


// Hàm sinh OTP
const generateOTP = () => {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
};
// Hàm gửi OTP qua SMS sử dụng Twilio
const sendOTP = (phone, otp) => {
    const accountSid = 'AC57808ac8b6514d5523761d451df13af4';
    const authToken = '583137acf688002a4bc776d46bcc0e83';
    const twilioPhone = "+12625814573";  // Thay thế bằng số điện thoại Twilio đã xác nhận của bạn

    const client = new twilio(accountSid, authToken);

    return client.messages.create({
        body: `Mã OTP của bạn là: ${otp}`,
        from: twilioPhone,
        to: phone
    });
};

Users.create = function (data, result) {
    bcrypt.hash(data.PassWord, 10, function (err, hashedPassword) {
        if (err) {
            console.error('Lỗi khi băm mật khẩu:', err);
            result(null);
        } else {
            data.PassWord = hashedPassword;

            // Sinh và lưu OTP vào cơ sở dữ liệu
            const otp = generateOTP();
            data.otp = otp;

            console.log('Dữ liệu trước khi thêm vào cơ sở dữ liệu:', data);

            db.query("INSERT INTO Users SET ?", data, function (err, Users) {
                if (err) {
                    console.error('Lỗi khi thêm người dùng vào cơ sở dữ liệu:', err);
                    result(null);
                } else {
                    // Gửi OTP đến điện thoại người dùng
                    sendOTP(data.Phone, otp)
                        .then(() => {
                            result({ IDUser: Users.insertId, ...data });
                        })
                        .catch((error) => {
                            console.error('Lỗi khi gửi OTP:', error);
                            result(null);
                        });
                }
            });
        }
    });
};

// Hàm xác nhận OTP trong quá trình đăng ký
Users.verifyOTP = function (data, result) {
    db.query("SELECT * FROM Users WHERE Phone = ? AND otp = ?", [data.Phone, data.otp], function (err, Users) {
        if (err || Users.length === 0) {
            result(false); // Xác nhận OTP thất bại
        } else {
            result(true); // Xác nhận OTP thành công
        }
    });
};
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

module.exports = Users;