// Query with explicit connection
var sql = require('msnodesql');
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'juj');

var conn_str = "Driver={SQL Server Native Client 11.0};Server=(local);Database=JUJ;Trusted_Connection={Yes}";

var sale_schema = mongoose.Schema({transaction_id: 'string', sale_price: 'Number'});

var Sale = db.model('Sale', sale_schema);


sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT TOP 10 transaction_id, sale_price FROM Sales", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            console.log("transaction_id: " + results.rows[i][0] + " sale_price: " + results.rows[i][1]);
            var sale = new Sale({transaction_id: results.rows[i][0], sale_price: results.rows[i][1]});
            sale.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
    });
});