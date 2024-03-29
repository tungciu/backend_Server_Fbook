const db=require("../Connect/Conectdb");
const bcrypt = require('bcrypt');
const Admin = function (Admin) {
    this.IDAdmin = Admin.IDAdmin;
    this.AdminName = Admin.AdminName;
    this.PassWord = Admin.PassWord;
    this.Email = Admin.Email;
    this.Phone = Admin.Phone;
}
Admin.get_all = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Admin", function (err, Admin) {
        if (err) {
            result(null);
        } else {
            result(Admin);
        }
    });
}

Admin.getByid = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Admin WHERE IDAdmin = ?", id, function (err, Admin) {
        if (err || Admin.length == 0) {
            result(null);
        } else {
            result(Admin[0]);
        }
    });
}

Admin.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("DELETE FROM Admin WHERE IDAdmin = ?", id, function (err, IDAdmin) {
        if (err) {
            result(null);
        } else {
            result("XOA THANH CONG Admin CO ID " + id);
        }
    });
}

Admin.create = function (data, result) {
    // Hash mật khẩu trước khi thêm vào cơ sở dữ liệu
    bcrypt.hash(data.PassWord, 10, function (err, hashedPassword) {
        if (err) {
            result(null);
        } else {
            // Thay thế mật khẩu chưa mã hóa bằng mật khẩu đã được mã hóa
            data.PassWord = hashedPassword;

            db.query("INSERT INTO Admin SET ?", data, function (err, Admin) {
                if (err) {
                    result(null);
                } else {
                    result({ IDAdmin: Admin.insertId, ...data });
                }
            });
        }
    });
}
Admin.update=function(array,result){
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("UPDATE Admin SET AdminName=?,PassWord=?,Email=?,Phone=? WHERE IDAdmin=?", [array.AdminName,array.PassWord,array.Email,array.Phone,array.IDAdmin],function(err,Admin){
        if(err){
            result(null);
        }
        else{
            result(array);

        }
    });
}

Admin.chekc_login = function (data, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    // Sử dụng prepared statement để tránh SQL injection
    db.query(
        "SELECT * FROM Admin WHERE Email = ?",
        [data.Email],
        function (err, Admins) {
            if (err) {
                console.error('Error during login query:', err);
                result(null);
            } else {
                if (Admins.length === 0) {
                    // Không tìm admin

                    result(null);
                } else {
                    // So sánh mật khẩu (đã được băm)
                    const hashedPasswordFromDB = Admins[0].PassWord;
                    result(Admins[0]);
                }
            }
        }
    );
};
// đổi mật khẩu theo email hoặc sđt
Admin.changePassword = function (identifier, newPassword, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    const condition = identifier.includes('@') ? 'Email' : 'Phone';

    // Tìm admin dựa trên email hoặc số điện thoại
    db.query(
        `SELECT * FROM Admin WHERE ${condition} = ?`,
        [identifier],
        function (err, Admins) {
            if (err) {
                console.error('Error during change password query:', err);
                result({ success: false, message: 'Thông báo lỗi chi tiết', error: err });

                // result({ success: false });
            } else {
                if (Admins.length === 0) {
                    // Không tìm thấy admin với email hoặc số điện thoại cung cấp
                    result({ success: false });
                } else {
                    const adminID = Admins[0].IDAdmin;

                    // Hash mật khẩu mới
                    bcrypt.hash(newPassword, 10, function (err, hashedPassword) {
                        if (err) {
                            result({ success: false });
                        } else {
                            // Cập nhật mật khẩu mới vào cơ sở dữ liệu
                            db.query(
                                "UPDATE Admin SET PassWord = ? WHERE IDAdmin = ?",
                                [hashedPassword, adminID],
                                function (err, updatedAdmin) {
                                    if (err) {
                                        result({ success: false });
                                    } else {
                                        result({ success: true });
                                    }
                                }
                            );
                        }
                    });
                }
            }
        }
    );
};
module.exports=Admin;