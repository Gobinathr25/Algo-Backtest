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
var stoploss, target, type, pos;
var status,exeTime,trigger;
var trig = false;
const sheets = file.SheetNames;
/*con.connect(function (err) {
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
        //console.log("1 record inserted");
        //console.log(res.date.split(" ")[1].split("+")[0]);
      });
    });
  }

  console.log(" Server Connected!");
});*/

con.connect(function (err) {
  if (err) throw err;
  con.query("select * from bn_hist", function (err, result, fields) {
    if (err) throw err;
    //console.log(result.length);

    for (var i = 2; i < result.length; i++) {
      //console.log(result[i]);
      trig = false;
      if (result[i].tim != "09:15:00" && result[i].tim != "09:20:00" && result[i].tim != "09:25:00" && result[i].tim != "09:30:00" && result[i].tim != "15:00:00" && result[i].tim != "15:05:00" && result[i].tim != "15:10:00" && result[i].tim != "15:15:00" && result[i].tim != "15:20:00" && result[i].tim != "15:25:00" && result[i].tim != "15:30:00") {
        if (result[i].CandleColor == "GREEN" && result[i - 1].CandleColor == "RED" && result[i - 2].CandleColor == "RED") {
          //BUY SIGNAL Pre-requiste
          
          if (result[i - 2].High > result[i - 1].High && result[i - 2].Low > result[i - 1].Low && result[i].Close < result[i - 1].Open && result[i].High < result[i - 1].High && result[i].Low < result[i - 1].Low) {
            //Triggering Condition for Buy 
            if (i <= result.length && (result[i + 1].Close > result[i].High || result[i + 1].High > result[i].High || result[i + 1].Open > result[i].High)) {
             // console.log("Buy ", result[i]);
             trig = true;
             type="Buy";
             pos=i;
              stoploss = result[i].Low;
              target = result[i].High + (3 * (result[i].High - result[i].Low));
              trigger = "Executed At " + result[i].High +"-"+"-" + result[i].dt + "-" + result[i].tim; 
              for (var j = i + 1; j < result.length; j++) {
                if (result[j].Close < result[i].Low || result[j].Low < result[i].Low) {
                  status = "STOP-LOSS  Price At"+ result[i].Low;
                  exeTime = "-" + result[j].dt + "-" + result[j].tim; 
                  i = j;
                  break;
                }
                if (result[j].High > target || result[j].Close > target) {
                  status = "TARGET At " +target;
                  exeTime = "-" + result[j].dt + "-" + result[j].tim;
                  i = j;
                  break;
                }
              }
              
            }
          }

        }
       
        if (result[i].CandleColor == "RED" && result[i - 1].CandleColor == "GREEN" && result[i - 2].CandleColor == "GREEN") {
          //SELL SIGNAL Pre-requiste
          if (result[i - 2].High < result[i - 1].High && result[i - 2].Low < result[i - 1].Low && result[i].Close > result[i - 1].Close && result[i].High > result[i - 1].High && result[i].Low > result[i - 1].Low) {
            //Triggering Condition for SELL 
            if (i <= result.length && (result[i + 1].Close < result[i].Low || result[i + 1].Low < result[i].Low || result[i + 1].Open < result[i].Low)) {
              //  console.log("SELL ",result[i]);
              //this.inseryByRecord();
              stoploss = result[i].High;
              target =  result[i].Low - (3 * (result[i].Low - result[i].High));
              trigger = "Executed At -" + result[i].Low +  "-" + result[i].dt + "-" + result[i].tim; 
              type = "Sell";
              trig = true;
              pos=i;
              for (var j = i + 1; j < result.length; j++) {
                if (result[j].Close > result[i].high || result[j].High  > result[i].High) {
                  status = "STOP-LOSS At -"+result[i].High;
                  exeTime = "-" + result[j].dt + "-" + result[j].tim;
                  i = j;
                  break;
                }
                if (result[j].Low < target || result[j].Close < target) {
                  status = "TARGET At - "+target;
                  exeTime = "-" + result[j].dt + "-" + result[j].tim;
                  i = j;
                  break;
                }
              }
              
            }
          }

        }
      }
      if(trig == true)
      console.log(pos + "-" + type + "-" + trigger + "-" + status +"-" + exeTime);

    }
    // console.log(result);
  });
});

// Printing data
//console.log(data);
