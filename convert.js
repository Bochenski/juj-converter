// Query with explicit connection
var sql = require('msnodesql');
var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'juj');

var conn_str = "Driver={SQL Server Native Client 11.0};Server=(local);Database=JUJ;Trusted_Connection={Yes}";

var sale_schema = mongoose.Schema({transaction_id: 'String', 
                                    sale_price: 'Number', 
                                    date_of_sale: 'Date',
                                    stock_code:'String',
                                    quantity:'Number',
                                    shop_code:'String',
                                    transaction_type:'String',
                                    cost_price:'Number',
                                    vat_rate:'Number',
                                    week_num:'Number'});

var running_cost_schema = mongoose.Schema({
    shop_code:'String',
    date:'Date',
    shop_cost:'Number',
    staff_cost:'Number',
    staff_id:'String',
    week_num:'Number',
    weekly_shop_cost:'Number'
})

var Sale = db.model('Sale', sale_schema);
var RunningCost = db.model('RunningCost', running_cost_schema);

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT transaction_id, sale_price, date_of_sale, stock_code, quantity, shop_code, transaction_type, cost_price, vat_rate, week_num FROM Sales", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            var sale = new Sale({transaction_id: results.rows[i][0], 
                                sale_price: results.rows[i][1],
                                date_of_sale: results.rows[i][2],
                                stock_code: results.rows[i][3],
                                quantity: results.rows[i][4],
                                shop_code: results.rows[i][5],
                                transaction_type: results.rows[i][6],
                                cost_price: results.rows[i][7],
                                vat_rate: results.rows[i][8],
                                week_num: results.rows[i][9]});
            sale.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
        console.log('all done');
    });
    conn.queryRaw("SELECT shop_code,date,shop_cost,staff_cost,staff_id,week_num,
                    weekly_shop_cost FROM Running_Cost", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            var cost = new RunningCost({shop_code: results.rows[i][0], 
                                date: results.rows[i][1],
                                shop_cost: results.rows[i][2],
                                staff_cost: results.rows[i][3],
                                staff_id: results.rows[i][4],
                                week_num: results.rows[i][5],
                                weekly_shop_cost: results.rows[i][6]
                            });
            cost.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
        console.log('all done');
    });
});