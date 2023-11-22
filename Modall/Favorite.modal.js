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


module.exports=Favorite;