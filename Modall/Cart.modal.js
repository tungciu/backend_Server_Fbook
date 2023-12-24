const db=require('../Connect/Conectdb');

const Cart = function (Cart) {
    this.IDCart = Cart.IDCart;
    this.IDBook = Cart.IDBook;
    this.IDUser=Cart.IDUser;
    this.status=Cart.status;

}
Cart.get_all = function (result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Cart", function (err, Cart) {
        if (err) {
            result(null);
        } else {
            result(Cart);
        }
    });
}

Cart.getByid = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("SELECT * FROM Cart WHERE IDCart = ?", id, function (err, Cart) {
        if (err || Cart.length == 0) {
            result(null);
        } else {
            result(Cart[0]);
        }
    });
}

Cart.remove = function (id, result) {
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("DELETE FROM Cart WHERE IDCart = ?", id, function (err, Cart) {
        if (err) {
            result(null);
        } else {
            result("XOA THANH CONG Cart CO ID " + id);
        }
    });
}


Cart.create=function(data,result){
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("INSERT INTO Cart SET ?", data,function(err,Cart){
        if(err){
            result(null);
        }
        else{
            result({IDCart: Cart.insertId, ...data});
        }
    });
}
Cart.update=function(array,result){
    if (db.state === 'disconnected') {
        db.connect();
    }
    db.query("UPDATE Cart SET IDBook=?, IDUser=?, status=? WHERE IDCart=?", [array.IDBook,array.IDCart,array.IDUser,array.status,],function(err,Cart){
        if(err){
            result(null);
        }
        else{
            result(array);

        }
    });
}
