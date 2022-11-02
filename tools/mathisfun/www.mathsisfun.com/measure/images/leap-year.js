var w,my={};function leapyearMain(){var version='0.64'
w=360;var s='';s+='<div id="main" style="position:relative; width:'+w+'px; background-color: #cdf; margin:auto; display:block; border: 1px solid white; font: 16px Arial; border-radius: 10px;">';var cssLt='display:inline-block; width:130px; text-align: right; vertical-align: top; margin:5px;'
var cssRt='display:inline-block; width:110px;'
s+='<div style="margin: 12px;">'
s+='<div style="'+cssLt+'">Enter Year:</div>'
var d=new Date();var n=d.getFullYear();var nLeap=parseInt(n/4+0.999)*4
s+='<div style="'+cssRt+'"><input type="text" id="year" style="width:70px; text-align:center; font:20px Arial; "  value="'+nLeap+'" onKeyUp="go()" /></div>'
s+='</div>'
s+='<div style="text-align:center;">'
s+='<textarea type="text" id="result" style="width:96%; height: 120px; text-align:center; font:18px Arial; background-color: #def;  border-radius:10px; " /></textarea>'
s+='</div>'
s+='</div>';document.write(s);go()}
function go(){var nYear=parseInt(document.getElementById('year').value);var s=''
if(isNaN(nYear)||nYear<1582){msg('Enter a Year from 1582 onwards')
return}else{s+=leapYearMsg(nYear)
s+='\n'
if(leapYearQ(nYear)){s+=nYear+' IS a Leap Year'}else{s+=nYear+' is NOT a Leap Year'}}
msg(s)}
function leapYearMsg(n){var s=''
if(n%4){return 'not divisible by 4\n'}else{s+='divisible by 4\n'
if(n%100){s+='and not divisible by 100\n'
return s}else{s+='and divisible by 100\n'
if(n%400){s+='but not divisible by 400\n'
return s}else{s+='but also divisible by 400\n'
return s}}}}
function leapYearQ(n){if(n%4){return false}else{if(n%100){return true}else{return(n%400)?false:true}}}
function msg(s){var div=document.getElementById('result')
div.value=s}