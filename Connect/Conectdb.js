var mysql = require("mysql2");

var pool = mysql.createPool({
    connectionLimit: 10,
    host: "sql.freedb.tech",
    user: "freedb_tungcun",
    password: "a9YF7DQxy%j@y9P",
    database: "freedb_Fbook_server",
    connectTimeout: 400000,
});

// Khi pool kết nối thành công
pool.on("connect", function () {
    console.log("Connected to database successfully");
});

// Khi pool gặp lỗi kết nối
pool.on("error", function (err) {
    console.error("Error connecting to database:", err.message);
});

// Khi một connection được lấy từ pool
pool.on("acquire", function (connection) {
    console.log("Connection %d acquired", connection.threadId);
});

// Khi một connection được trả về pool
pool.on("release", function (connection) {
    console.log("Connection %d released", connection.threadId);
});

// var db = pool.promise();
module.exports = pool;
