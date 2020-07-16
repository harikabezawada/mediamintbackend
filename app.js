var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var MongoClient=require("mongodb").MongoClient
var app = express();
var fs=require("fs");
var readline=require("readline")
var stream=require("stream");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var port=process.env.port||3000;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
   res.status(err.status || 500);
   res.render('error');
  
  
});

MongoClient.connect("mongodb+srv://harika:harika123@cluster0-v8yps.mongodb.net/userData?retryWrites=true&w=majority", { promiseLibrary: Promise }, (err, db) => {

  if (err) {
    console.log(`Failed to connect to the database. ${err.stack}`);
  }
  app.locals.db = db;
  app.listen(port, () => {
   console.log(`Node.js app is listening at http://localhost:${port}`);
    insertData()
  });
});
function insertData(){
 
  console.log('connected  to db')

 // console.log("tttt")
  var arr=[]
  var instream=fs.createReadStream("data.txt")
  var outstream=new stream()
  var rl=readline.createInterface(instream,outstream)
  rl.on('line',function(line){
//console.log(line.split(","))
var str=line.split(",")
for(let i=0;i<str.length;i++){
  arr.push({name:str[i]})
}
//console.log(arr)
//app.locals.db.insertMany(arr)

  })

}
app.post("/user",function(req,res){
  app.locals.db.find({"name":{ "$in": req.body.name}}).exec(function(err,res){
    console.log(res)
  })
})
    
  
 


module.exports = app;
