var my={};function calendaryearMain(mode){this.version='0.70';this.mode=typeof mode!=='undefined'?mode:'1';w=300;h=830;id='cal';var s="";s+='<div style="position:relative; margin:auto; display:block; border: none; text-align: center;">';s+='<div style="text-align: center; vertical-align: top; padding: 5px; border-radius: 10px; font: 16px Tahoma; background-color: #cdf;">';var now=new Date()
var yr=now.getFullYear()
console.log('yr',yr);s+='<div id="'+id+'-mdn" style="display:inline-block; font: 26px Arial; cursor: pointer; color:blue;" onmousedown="chgYear(this,-1);">&#9664;</div>';s+='<input type="text" id="year" style="color: #0000ff; background-color: #eeffee; text-align:center; font-size: 14pt; width:90px; border-radius: 10px; " value="'+yr+'" onKeyUp="update()" />';s+='<div id="'+id+'-mup" style="display:inline-block; font: 26px Arial; cursor: pointer; color:blue;" onmousedown="chgYear(this,1);">&#9654;&nbsp;</div>';s+='<div style="color:blue; margin-top:8px;">'
s+='Start Month: '
var months=["January","February","March","April","May","June","July","August","September","October","November","December"];s+=dropdownHTML(months,'update','sttMonth');s+='</div>';s+='<div style="position:absolute; right:3px; top:3px; font:14px Arial;" >'
my.styles=["Normal","Compact"];my.style=0;s+=radioHTML('Style:','style',my.styles,'update');s+='</div>';s+='<div style="position:absolute; right:3px; top:27px; color:blue;" >'
s+='<input type="button" onClick="divPrint();" style="background-image: url(../images/style/printer.png); background-repeat: no-repeat; background-color: transparent; height: 50px; width: 50px; border: none; cursor: pointer;">';s+='</div>';s+='</div>';s+='<div id="print">'
s+='</div>';s+='<div id="copyrt" style="font: 10px Arial; color: #6600cc"> &nbsp; &copy; 2018 MathsIsFun.com  v'+this.version+'</div>';s+='</div>';document.write(s);var now=new Date();dt1=[now.getFullYear(),now.getMonth()+1,now.getDate()];dt2=[now.getFullYear(),now.getMonth()+1,now.getDate()+1];update();}
function chgStyle(n){my.style=my.styles[n];update();}
function divPrint(){var win=window.open();var title='12-Month Calendar'
win.document.write('<html><head><title>'+title+'</title>');win.document.write('</head><body style="width:700px;">');win.document.write(document.getElementById('print').innerHTML);win.document.write('</body></html>');win.document.location="#";var isChrome=(window.navigator.userAgent.toLowerCase().indexOf("chrome")>-1);if(isChrome){win.focus();setTimeout(function(){win.focus();win.print();},500);}else{win.focus();win.print();win.close();}}
function inputget(id){var v=document.getElementById(id).value;newv=v.replace(/\D/g,'');if(newv!=v){v=newv;document.getElementById(id).value=v;}
return v<<0;}
function update(){calShow()}
function calShow(){var sttMonth=document.getElementById('sttMonth').selectedIndex;var sttYear=inputget('year');console.log('calShow',sttYear,sttMonth);var now=new Date();s='';for(var i=1;i<=12;i++){var dt=[sttYear,sttMonth+i,now.getDate()];s+=monthHTML(i,dt);}
var div=document.getElementById('print');div.innerHTML=s;}
function monthHTML(calId,dts){var months=["January","February","March","April","May","June","July","August","September","October","November","December"];var days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];var dayFulls=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var weekStt=1;if(dts==undefined){var dtSel=new Date();}else{dtSel=new Date(dts[0],dts[1]-1,dts[2]);}
var dtPrevMonth=new Date(dtSel);dtPrevMonth.setMonth(dtSel.getMonth()-1);var dtNextMonth=new Date(dtSel);dtNextMonth.setMonth(dtSel.getMonth()+1);var dtDay1=new Date(dtSel);dtDay1.setDate(1);dtDay1.setDate(1-(7+dtDay1.getDay()-weekStt)%7);var dtDayLast=new Date(dtNextMonth);dtDayLast.setDate(0);var dtCurrDay=new Date(dtDay1);dtDayLast.setHours(0,0,0,0);dtSel.setHours(0,0,0,0);var dtLo=new Date(dtSel);var dtHi=new Date(dtSel);dtCurrDay.setHours(0,0,0,0);var id=dtSel.getFullYear()+'-'+(dtSel.getMonth()+1)+'-'+dtSel.getDate()+'-'+calId;var s='';var style=document.querySelector('input[name="style"]:checked').value;switch(style){case 'Normal':s+='<style>'
s+='.cal {display: inline-block; width:260px; margin:20px 20px 0 0; vertical-align: top; }'
s+='.day {display: inline-block; width:10.5%; padding: 1%; text-align: right; border: 2px solid white; font:bold 17px Tahoma, Verdana; cursor: pointer;}'
s+='</style>'
break;case 'Compact':s+='<style>'
s+='.cal {display: inline-block; width:200px; margin:12px 10px 0 0; vertical-align: top; }'
s+='.day {display: inline-block; width:20px; padding: 1px 2px; text-align: right; border: 2px solid white; font:bold 15px Tahoma, Verdana; cursor: pointer;}'
s+='</style>'
break;default:}
s+='<div class="cal" style="">';s+='<div style="text-align: center; vertical-align: top; padding: 1px; border-radius: 10px; font: 20px Tahoma; background-color: #cdf;">';s+=months[dtSel.getMonth()]+' '+dtSel.getFullYear();s+='</div>';s+='<div style="text-align:center;">';s+='<div style="">';for(var n=0;n<7;n++){s+='<div class="day" style="font-size:85%; font-weight:normal;">';s+=days[(weekStt+n)%7];s+="</div>";}
s+="</div>";while(dtCurrDay.getMonth()==dtSel.getMonth()||dtCurrDay.getMonth()==dtDay1.getMonth()){s+='<div style="">';for(var n_current_wday=0;n_current_wday<7;n_current_wday++){var bgClr='white';var currQ=false;var hiliteQ=false;if(hiliteQ){if(dtCurrDay>=dtLo&&dtCurrDay<=dtHi){currQ=true;}}
if(currQ){bgClr='#ee4';}else if(dtCurrDay.getDay()==0||dtCurrDay.getDay()==6){bgClr='#DBEAF5';}else{bgClr='white';}
var clr='black';if(dtCurrDay.getMonth()==dtSel.getMonth()){clr='black';}else{clr='lightgrey';}
id=dtCurrDay.getFullYear()+'-'+(dtCurrDay.getMonth()+1)+'-'+dtCurrDay.getDate()+'-'+calId;s+='<div id="'+id+'" class="day" style="background-color:'+bgClr+'; color:'+clr+';" onMouseOver="changeColor(this,1);" 	onMouseOut="changeColor(this,2)" onMouseDown="onDateClick(this);" >';s+=dtCurrDay.getDate()+"</div>";dtCurrDay.setDate(dtCurrDay.getDate()+1);}
s+="</div>";}
s+="</div>";s+="</div>";return s;}
function calcDate(date1,date2){var diff=Math.floor(date1.getTime())-Math.floor(date2.getTime());var day=1000*60*60*24;var days=Math.floor(diff/day);if(days==0)return['0 days'];minusQ=false;if(days<0){minusQ=true;days=-days;}
var a=[];var s='';if(minusQ)s+='-';s+=days+" day";if(days>1)s+='s';a.push(s);var weeks=Math.floor(days/7);if(weeks>0){s='or ';if(minusQ)s+='-';s+=weeks+" week";if(weeks>1)s+='s';days-=weeks*7;if(days>0){s+=' ';s+=days+" day";if(days>1)s+='s';}
a.push(s);}
return a;}
function chgMonth(div,n){parts=div.id.split('-');parts[1]=(parts[1]>>0)+n;console.log("chgMonth",div.id,n,parts);if(parts[3]==1)dt1=parts;if(parts[3]==2)dt2=parts;update();}
function chgYear(div,n){var yr=inputget('year')
yr+=n;document.getElementById('year').value=yr;update();}
function onDateClick(div){parts=div.id.split('-');if(parts[3]==1)dt1=parts;if(parts[3]==2)dt2=parts;update();}
function changeColor(div,code){if(code==1){div.style.borderColor='blue';}else{div.style.borderColor='white';}}
function dropdownHTML(opts,funcName,id){var s='';s+='<select id="'+id+'" style="font: 15px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off" >';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==0?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:18px;" '+chkStr+' >'+opts[i]+'</option>';}
s+='</select>';return s;}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var idi=id+i;var lbl=lbls[i];var chkStr=(i==0)?' checked="checked"':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}