var mysql = require('mysql');
var process = require('child_process');
var dbconfig=require('./config.js');

var db_config=dbconfig.db_config;
//select users
function QueryUsers(pageIndex,pageSize,callback){
 var connection=mysql.createConnection(db_config);
  connection.connect();
  console.log('select * from users limit '+pageIndex+ ','+pageSize );
  connection.query('select * from users limit '+pageIndex+ ','+pageSize ,function(err,results){
    if(err) throw err;
     console.log(results);
	 callback(results);
	 connection.end();
 });
}
//select Inbox
function QueryInbox(pageIndex,pageSize,callback){
  var connection=mysql.createConnection(db_config);
  connection.connect();
  // console.log('select * from users limit '+pageIndex+ ','+pageSize );
   var sql='select * from inbox limit '+pageIndex+ ','+pageSize;
   connection.query(sql,function(err,results){
    if(err) throw err;
     console.log(results);
	 callback(results);
	 connection.end();
 });
}

//shell delete user
function shDelUser(UserName,callback){
   process.exec('{ echo "root";  echo "root";  echo "deluser '+UserName+' "; sleep 1;  echo "quit"; } | telnet 192.168.1.86 4555 ',function(error,stdout,stderr){
     if(error!=null)console.log('exec error:'+error);
	 console.log(stdout);
	 if(callback!=null) callback(stdout);
   });
}

 function shCreateUser(UserName,Password,callback){process.exec(' { echo "root";  echo "root";  echo "adduser '+UserName+' '+Password+' "; sleep 1; echo "quit"; } | telnet 192.168.1.86 4555 ',
      function (error, stdout, stderr) {
        if (error != null) console.log('exec error: ' + error);
		console.log(stdout);
		if(callback!=null) callback(stdout);
    });
}

function shUpdatePassword(UserName,Password,callback){
  process.exec('{ echo "root";  echo "root";  echo "setpassword '+UserName+' '+Password+' "; sleep 1;  echo "quit"; } | telnet 192.168.1.86 4555 ',function(error,stdout,stderr){
    if(error!=null) console.log('exec error:'+error);
	console.log(stdout);
	if(callback!=null) callback(stdout);
  });
}

function ManagerLogin(UserName,Password,callback){
  var connection=mysql.createConnection(db_config);
  connection.connect();
  var sql="select count(*) as number from EmailManager where userName='"+UserName+"' and password ='"+Password+"' ";
  console.log(sql);
  connection.query(sql,function(err,results){
    if(err)throw err;
	console.log(results);
	if (callback!=null) callback(results);
	connection.end();
  });  
}

exports.login=function(req,res){
  var userName=req.body['username'];
  var password=req.body['password'];
  if(userName==null || password==null) res.render('login',{login:'error'});
  console.log(userName+'|'+password+"|"+{login:'error'});
  ManagerLogin(userName,password,function(results){
  // console.log(results.length);
  if(results[0].number==1){
     res.render('index',{index:'success'});
  }else{
    res.render('login',{login:'error'});
  }
  });
  
};

exports.list = function(req, res){
  var pageIndex=req.query.pageindex;
  var pageSize=req.query.pagesize;
  console.log(pageIndex+'|'+pageSize);
  QueryUsers(
    ((pageIndex!=null)?pageIndex:0)*((pageSize!=null)?pageSize:7),(pageSize!=null)?pageSize:7,
     function(result)
    {
	res.render('user',{users:result});
    });
};

exports.listinbox=function(req,res){
 var pageIndex=req.query.pageindex;
 var pageSize=req.query.pagesize;
 console.log(pageIndex+'|'+pageSize);
 QueryInbox(
 (pageIndex!=null)?pageIndex:0,(pageSize!=null)?pageSize:7,function(result){
   res.render('inbox',{inboxs:result});
 });
};

exports.update=function(req,res){
  var UserName=req.body['username'];
  var Password=req.body['password'];
  if(UserName==null || Password ==null) res.send(' username and password is not null');
  shUpdatePassword(UserName,Password,function(results){
    res.send(results);
  });
};

exports.remove=function(req,res){
  var UserName=req.query.username;
  if(UserName==null) res.send('username is not null');
  shDelUser(UserName,function(results){
   res.send(results);
  });
};

exports.add=function(req,res){
  var UserName =req.body['username'];
  var Password=req.body['password'];
  if(UserName==null || Password== null) res.send(' username and password is not null ');
  shCreateUser(UserName,Password,function(results){
  console.log(results);
   res.send(results);
});  
};
exports.adduser=function(req,res){
  res.render('edituser',{edituser:"add"});
}

/*******test********/
/*
QueryInbox(0,20,function(results){
   console.log(results);
});*/
/*
QueryUsers(0,20,function(results){
  console.log(results);
});*/
/*
shCreateUser('hell','123',function(results){
  console.log(results);
});*/
/*
shUpdatePassword('hell','hell',function(results){
  console.log(results);
});*/
/*
shDelUser('hell',function(results){
  console.log(results);
});*/




