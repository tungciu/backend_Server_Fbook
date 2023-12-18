const db=require('../Connect/Conectdb');

const Favorite = function (Favorite) {
    this.IDFavorite = Favorite.IDFavorite;
    this.IDUser = Favorite.IDUser;
    this.IDBook = Favorite.IDBook;
};
Favorite.get_all = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Favorite", function (err, Favorite) {
        if (err) {
            result(null);
        } else {
            result(Favorite);
        }
    });
}

Favorite.getByid = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Favorite WHERE IDFavorite = ?", id, function (err, Favorite) {
        if (err || Favorite.length == 0) {
            result(null);
        } else {
            result(Favorite[0]);
        }
    });
}

    // Favorite.remove = function (id, result) {
    //     if (db.state === 'disconnected') {
    //         db.connect();
    //     }
    //     db.query("DELETE FROM Favorite WHERE IDFavorite = ?", id, function (err, Favorite) {
    //         if (err) {
    //             result(null);
    //         } else {
    //             result("XOA THANH CONG IDFavorite CO ID " + id);
    //         }
    //     });
    // }
// Favorite.remove = function (id, userId, result) {
//     if (db.state === 'disconnected') {
//         db.connect();
//     }
//     db.query("DELETE FROM Favorite WHERE IDFavorite = ? AND IDUser = ?", [id, userId], function (err, Favorite) {
//         if (err) {
//             result(null);
//         } else {
//             result("XOA THANH CONG IDFavorite CO ID " + id + " CUA USER CO ID " + userId);
//         }
//     });
// }
Favorite.remove = function (id, userId, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    db.query("DELETE FROM Favorite WHERE IDFavorite = ? AND IDUser = ?", [id, userId], function (err, Favorite) {
        if (err) {
            result({ Status: 'fail' }); // Trả về đối tượng JSON với trạng thái 'fail'
        } else {
            if (Favorite.affectedRows > 0) {
                result({ Status: true }); // Trả về đối tượng JSON với trạng thái 'true' nếu có dòng bị ảnh hưởng
            } else {
                result({ Status: 'fail' }); // Trả về đối tượng JSON với trạng thái 'fail' nếu không có dòng nào bị ảnh hưởng (không có dữ liệu được xóa)
            }
        }
    });
}

    Favorite.create = function (data, result) {
        if (db.state === 'disconnected') {
            db.connect();
        }
        db.query("INSERT INTO Favorite SET ?", data, function (err, Favorite) {
            if (err) {
                result(null);
            } else {
                result({IDFavorite: Favorite.insertId, ...data});
            }
        });
    }
    Favorite.update = function (array, result) {
        if (db.state === 'disconnected') {
            db.connect();
        }
        db.query("UPDATE Favorite SET IDBook=?, IDUser=? WHERE IDFavorite=?", [array.IDBook, array.IDUser, array.IDFavorite], function (err, Favorite) {
            if (err) {
                result(null);
            } else {
                result(array);

            }
        });
    };

Favorite.getByUserId = function (userId, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }

    db.query(
        "SELECT Favorite.IDFavorite, Favorite.IDUser, Favorite.IDBook, Book.*, Category.CatName FROM Favorite JOIN Book ON Favorite.IDBook = Book.IDBook JOIN Category ON Book.IDCat = Category.IDCat WHERE Favorite.IDUser = ?",
        userId,
        function (err, favorites) {
            if (err) {
                result(null);
            } else {
                // Chuyển đổi dữ liệu trả về từ cơ sở dữ liệu thành định dạng yêu cầu
                const formattedFavorites = favorites.map((fav) => {
                    return {
                        IDFavorite: fav.IDFavorite,
                        IDUser: fav.IDUser,
                        IDBook: fav.IDBook,
                        BookName: fav.BookName,
                        Author: fav.Author,
                        PublishYear: fav.PublishYear,
                        PriceBook: fav.PriceBook,
                        Discription: fav.Discription,
                        ImageBook: fav.ImageBook,
                        Create_at: fav.Create_at,
                        Chapter: fav.Chapter,
                        IDCat: fav.IDCat,
                        CatName: fav.CatName, // Thay thế IDCat bằng CatName
                    };
                });

                result({ result: formattedFavorites });
            }
        }
    );
};




module.exports=Favorite;