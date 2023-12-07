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

    Favorite.remove = function (id, result) {
        if (db.state === 'disconnected') {
            db.connect();
        }
        db.query("DELETE FROM Favorite WHERE IDFavorite = ?", id, function (err, Favorite) {
            if (err) {
                result(null);
            } else {
                result("XOA THANH CONG IDFavorite CO ID " + id);
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
// id user
// Favorite.getByUserId = function (userId, result) {
//     if (db.state === 'disconnected') {
//         db.connect();
//     }
//     db.query("SELECT * FROM Favorite WHERE IDUser = ?", userId, function (err, Favorites) {
//         if (err) {
//             result(null);
//         } else {
//             result(Favorites);
//         }
//     });
// };
Favorite.getByUserId = function (userId, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query(
        "SELECT Favorite.IDFavorite, Favorite.IDUser, Book.* FROM Favorite JOIN Book ON Favorite.IDBook = Book.IDBook WHERE Favorite.IDUser = ?",
        userId,
        function (err, Favorites) {
            if (err) {
                result(null);
            } else {
                // Chuyển đổi dữ liệu trước khi trả về
                const formattedFavorites = Favorites.map(favorite => {
                    return {
                        "IDFavorite": favorite.IDFavorite,
                        "IDUser": favorite.IDUser,
                        "Book": {
                            "IDBook": favorite.IDBook,
                            "BookName": favorite.BookName,
                            "Author": favorite.Author,
                            "PublishYear": favorite.PublishYear,
                            "PriceBook": favorite.PriceBook,
                            "Discription": favorite.Discription,
                            "ImageBook": favorite.ImageBook,
                            "Create_at": favorite.Create_at,
                            "Chapter": favorite.Chapter,
                            "IDCat": favorite.IDCat,
                            "isFavourite": favorite.isFavourite
                        }
                    };
                });
                result(formattedFavorites);
            }
        }
    );
};

module.exports=Favorite;