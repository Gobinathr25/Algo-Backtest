var mysql = require("mysql");
// Requiring the module
const reader = require("xlsx");
// Reading our test file
const file = reader.readFile("./NIFTY BANK.xlsx");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "banknifty",
});
const sheets = file.SheetNames;
con.connect(function (err) {
  if (err) throw err;
  for (let i = 0; i < sheets.length; i++) {
    const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach((res) => {
      //console.log(res);
      // console.log(res.date.split(" ")[0]);'
      var sql =
        "INSERT INTO bn_hist (dt, tim, Open, Close, High, Low) VALUES ('" +
        res.date.split(" ")[0] +
        "', '" +
        res.date.split(" ")[1].split("+")[0] +
        "','" +
        res.open +
        "','" +
        res.close +
        "','" +
        res.high +
        "','" +
        res.low +
        "')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        console.log(res.date.split(" ")[1].split("+")[0]);
      });
    });
  }

  console.log(" Server Connected!");
});

// Printing data
//console.log(data);
