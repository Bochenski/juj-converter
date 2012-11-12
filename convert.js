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
});

var shop_stock_sales_totals_schema = mongoose.Schema({
    shop_code:'String',
    stock_code:'String',
    quantiy_sold:'Number',
    quantity_in_stock:'Number',
});

var shop_schema = mongoose.Schema({
    description: 'String',
    weekly_running_cost: 'String'
});

var staff_schema = mongoose.Schema({
    tag: 'String',
    name: 'String',
    description: 'String',
    daily_cost: 'Number'
});

var stock_schema = mongoose.Schema({
    stock_code: 'String',
    description: 'String',
    retail_value: 'Number',
    external_code: 'String',
    category: 'String',
    average_cost: 'Number',
    quantity_for_average: 'Number',
    is_average_cost_static: 'Boolean',
    is_active: 'Boolean',
});

var stock_category_schema = mongoose.Schema({
    tag: 'String',
    description: 'String'
});

var stock_entry_schema = mongoose.Schema({
    date_of_entry: 'Date',
    stock_code: 'String',
    quantity: 'Number',
    shop_code: 'String',
    unit_price: 'Number',
    transaction_id: 'Number',
    include_in_average: 'Boolean'
});

var Sale = db.model('Sale', sale_schema);
var RunningCost = db.model('RunningCost', running_cost_schema);
var ShopStockSalesTotals = db.model('ShopStockSalesTotals', shop_stock_sales_totals_schema);
var Shop = db.model('Shop', shop_schema);
var Staff = db.model('Staff', staff_schema);
var Stock = db.model('Stock', stock_schema);
var StockCategory = db.model('StockCategory', stock_category_schema);
var StockEntry = db.model('StockEntry', stock_entry_schema);

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
        console.log('Sales done');
    });
});

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT shop_code, date, shop_cost, staff_cost, staff_id, week_num, weekly_shop_cost FROM Running_Cost", function (err, results) {
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
        console.log('Running Costs done');
    });
});

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }

    conn.queryRaw("SELECT shop_code, stock_code, quantity_sold, quantity_in_stock FROM Shop_Stock_Sales_Totals", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            var row = new ShopStockSalesTotals({shop_code: results.rows[i][0], 
                                stock_code: results.rows[i][1],
                                quantity_sold: results.rows[i][2],
                                quantity_in_stock: results.rows[i][3]
                            });
            row.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
        console.log('Shop_Stock_Sales_Totals done');
    });
});

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT description, weekly_running_cost FROM Shops", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            var row = new Shop({description: results.rows[i][0], 
                                weekly_running_cost: results.rows[i][1]
                            });
            row.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
        console.log('Shops done');
    });
});

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT id, name, description, daily_cost FROM Staff", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            var row = new Staff({tag: results.rows[i][0], 
                                name: results.rows[i][1],
                                description: results.rows[i][2],
                                daily_cost: results.rows[i][3]
                            });
            row.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
        console.log('Staff done');
    });
});

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT stock_code, description, retail_value, external_code, category, average_cost, quantity_for_average, is_average_cost_static, is_active FROM Stock", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            var row = new RunningCost({stock_code: results.rows[i][0], 
                                description: results.rows[i][1],
                                retail_value: results.rows[i][2],
                                external_code: results.rows[i][3],
                                category: results.rows[i][4],
                                average_cost: results.rows[i][5],
                                quantity_for_average: results.rows[i][6],
                                is_average_cost_static: results.rows[i][7],
                                is_active: results.rows[i][8]
                            });
            row.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
        console.log('Stock done');
    });
});

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT id, description FROM Stock_Category", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            var row = new Shop({tag: results.rows[i][0], 
                                description: results.rows[i][1]
                            });
            row.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
        console.log('Stock Category done');
    });
});

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT date_of_entry, stock_code, quantity, shop_code, unit_price, transaction_id, include_in_average FROM Stock_Entry", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            var row = new RunningCost({date_of_entry: results.rows[i][0], 
                                stock_code: results.rows[i][1],
                                quantity: results.rows[i][2],
                                shop_code: results.rows[i][3],
                                unit_price: results.rows[i][4],
                                transaction_id: results.rows[i][5],
                                include_in_average: results.rows[i][6]
                            });
            row.save(function (err) {
                if (err) {
                    console.log('there was an error');
                }
            })
        }
        console.log('Stock Entry done');
    });
});