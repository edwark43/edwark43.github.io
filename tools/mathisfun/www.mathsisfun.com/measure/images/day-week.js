var w,my={};function dayweekMain(){var version='0.63'
w=360;var s='';s+='<style>';s+='input[type="radio"] { display:none; }';s+='input[type="radio"]+label {background-color: #eee; padding:5px;  border: 1px solid blue; line-height:32px; }';s+='input[type="radio"]:checked+label {font-weight: bold; background-color: #ff6;}';s+='</style>';s+='<div id="main" style="position:relative; width:'+w+'px; background-color: white; margin:auto; display:block; border: 1px solid black; font: 16px Arial; border-radius: 10px;">';s+='<div style="text-align: center; margin-top:5px;"><b>Zeller\'s Algorithm</b></div>'
s+='<br>'
var cssLine='margin-bottom: 6px;'
var cssLt='display:inline-block; width:70px; text-align: right; vertical-align: top; margin:5px;'
var cssRt='display:inline-block; width:280px;'
s+='<div style="'+cssLine+'">'
s+='<div style="'+cssLt+'">Year:</div>'
s+='<div style="'+cssRt+'"><input type="text" id="year" style="width:70px; text-align:center; font:16px Arial;"  value="2000" onKeyUp="go()" /></div>'
s+='</div>'
s+='<div style="'+cssLine+'">'
s+='<div style="'+cssLt+'">Month:</div>'
my.months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];my.monthDays=[31,28,31,30,31,30,31,31,30,31,30,31];s+='<div style="'+cssRt+'">'
s+=radioHTML('month',my.months,'go')
s+='</div>'
s+='</div>'
s+='<div style="'+cssLine+'">'
s+='<div style="'+cssLt+'">Day:</div>'
my.days=[]
for(var i=1;i<=31;i++){var iStr=i
if(i<10)iStr='&nbsp;'+i+'&nbsp;'
my.days.push(iStr)}
s+='<div style="'+cssRt+'">'
s+=radioHTML('day',my.days,'go')
s+='</div>'
s+='</div>'
s+='<br>'
s+='<div style="text-align:center;">'
s+='<input type="text" id="result" style="width:97%; text-align:center; font:20px Arial; background-color: #def; border-radius:10px;"  value="" />'
s+='</div>'
s+='<br>'
s+='<div id="copyrt" style="font: 11px Arial; color: #6600cc; text-align:left; margin-left:5px; ">&copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);go()}
function go(){var nYear=parseInt(document.getElementById('year').value);var nMonth=radioGetIndex('month',my.months)+1
var nDay=radioGetIndex('day',my.days)+1
var daysInMonth=my.monthDays[nMonth-1]
if(nMonth==2&&isLeapYear(nYear))daysInMonth++
console.log('go',nYear,nMonth,nDay,daysInMonth,isLeapYear(nYear))
for(var i=29;i<=31;i++){if(i<=daysInMonth){document.getElementById('day'+(i-1)+'lbl').style.visibility='visible'}else{document.getElementById('day'+(i-1)+'lbl').style.visibility='hidden'}}
if(nDay>daysInMonth){msg('Enter a valid Day')}else{if(nYear<1582||nYear>4902){msg('Enter a Year between 1582 and 4902')}else{msg(dowMsg(nZeller(nYear,nMonth,nDay)))}}}
function nZeller(nYear,nMonth,nDay){if(nMonth>=3){nMonth-=2;}else{nMonth+=10;}
if((nMonth==11)||(nMonth==12))nYear--;var nCentury=parseInt(nYear/100);var nYear100=nYear%100;var h=0;h+=parseInt(nDay);h+=parseInt((13/5)*nMonth-0.2);h+=parseInt(nYear100);h+=parseInt(nYear100/4);h+=parseInt(nCentury/4);h-=parseInt(2*nCentury);h%=7;if(nYear>=1700&&nYear<=1751){h-=3;}else{if(nYear<=1699)h-=4;}
if(h<0)h+=7;return h}
function dowMsg(nDayOfWeek){if(nDayOfWeek>=0&&nDayOfWeek<=6){var dows=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
var dow=dows[nDayOfWeek]
console.log('dowMsg',nDayOfWeek,dow)
return 'Is a '+dow}else{return 'Error'}}
function isLeapYear(n){if(n%4){return false}else{if(n%100){return true}else{return(n%400)?false:true}}}
function msg(s){var div=document.getElementById('result')
div.value=s}
function dropdownHTML(opts,funcName,id){var s='';s+='<select id="'+id+'" style="font: 15px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off" >';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==0?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:18px;" '+chkStr+' >'+opts[i]+'</option>';}
s+='</select>';return s;}
function radioHTML(id,lbls,func){var s='';for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label id="'+idi+'lbl" for="'+idi+'">'+lbl+'</label> ';}
return s;}
function radioGetIndex(id,lbls){for(var i=0;i<lbls.length;i++){var div=document.getElementById(id+i)
if(div.checked)return i}
return-1}