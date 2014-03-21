

var fs=require('fs');
var xlsx=require('node-xlsx');

var obj=xlsx.parse(__dirname+'/myFile.xlsx');
var obj=xlsx.parse(fs.readFileSync(__dirname+'/myFile.xlsx'));

var len=obj.worksheets[0].data.length;
for(var i=0;i<len;i++){
	var col=obj.worksheets[0].data[i];
	var data=col[0];
    console.log(data.value);
 //console.log(col);
}
