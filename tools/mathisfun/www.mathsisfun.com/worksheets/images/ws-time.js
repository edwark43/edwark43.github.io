let w,h,g,my={},ws={};function init(){my.version='0.82';w=190;h=270;my.ansQ=false;my.picCount=57;my.ratio=2;my.clrs=['#000000','#330099','#ff9900','#cece88','#ccff33','#993399','#ff0000','#00ff00','#0000ff','#00ffff','#ffff00','#ff00ff','#006600'];my.txtclrs=['#330099','#ff9900','#cc3366','#ccff33','#993399','#00ffff','#00ff00','#0000ff','#00ffff','#000000','#ff00ff','#006600','#ffff00'];my.canPat=shadePattern();let s='';s+='<div id="main" style="position:relative; width:'+w+'mm; border: none; margin:auto; display:block;  ">';s+='<header>'
s+=wrap({cls:"noprint control",style:" margin: 0 0 30px 0; text-align:center; height:32px; "},wrap({tag:'btn',fn:'location.href='+"'../worksheets/index.php'"+';'},'Math Worksheets'),wrap({id:"ansBtn",tag:'btn',cls:"btn lo",fn:'toggleAns()'},'Answers'),' &nbsp;  ',wrap({id:"seed",tag:'inp',style:'width:65px;',lbl:'Num:'}),wrap({tag:'btn',fn:'seedRand()'},'Try Another'),' &nbsp;  ','<a href="javascript:window.print()"><img src="../images/style/printer.png" alt="print this page" style="vertical-align:top;" />Print!</a>')
s+=wrap({style:"padding: 0 0 30px 0;"},'<div style="float:left; margin: 0 10px 5px 0;">Name:__________________</div>','<div style="float:right; margin: 0 0 5px 10px;">Date:__________________</div>','<div style="text-align:center;"><b>Math is Fun Worksheet</b><br /><i>from mathsisfun.com</i></div>')
s+='</header>'
s+=wrap({id:"ws",style:"text-align: center;"})
s+=wrap({id:"result",style:"text-align: center; font: 30px Verdana;  z-index:100;"})
s+='</div>';docInsert(s);let seed=getQueryDef('seed',1000);if(seed){seedSet(seed);}else{seedSet(1000);}
ws.op=getQueryDef('op','add');ws.symbol="?"
ws.n=Math.min(100,getQueryDef('n',10));ws.amin=getQueryDef('amin',0);ws.amax=getQueryDef('amax',720);ws.tacc=getQueryDef('tacc',1);ws.qfmt=getQueryDef('qfmt',"time");ws.afmt=getQueryDef('afmt',"time");ws.bwQ=(getQueryDef('bw','n')=='y')
ws.rad=60;console.log("ws",ws);doWS();}
function shadePattern(){let canPat=document.createElement("canvas");canPat.width=6;canPat.height=6;let gPat=canPat.getContext("2d");gPat.beginPath();gPat.strokeStyle="black";gPat.lineWidth=0.5;let style="dash";switch(style){case "dash":gPat.moveTo(0,0);gPat.lineTo(5,5);break;case "diag":gPat.moveTo(0,0);gPat.lineTo(6,6);break;case "dot":gPat.arc(2,2,0.5,0,2*Math.PI);break;default:}
gPat.stroke();return canPat;}
function seedSet(n){my.seedStt=parseInt(n);if(my.seedStt<=0)my.seedStt=1;document.getElementById('seed').value=my.seedStt;}
function seedChg(){my.seedStt=(document.getElementById('seed').value)<<0;seedSet(my.seedStt);doWS();}
function seedRand(){seedSet(Math.floor(Math.random()*9999)+1);doWS();}
function doWS(){document.getElementById('result').innerHTML="";my.seed=my.seedStt;let s='';switch(ws.op){case 'conv':s=doWSConv();document.getElementById('ws').innerHTML=s;redraw();break;default:s=doWSFracOps('+',1,10,2,8);document.getElementById('ws').innerHTML=s;}}
function redraw(){for(let i=0;i<my.draws.length;i++){let d=my.draws[i];switch(d[1]){case "clock":drawClock(d[0],d[2],d[3],d[4]);break;case "box":drawFracLine(d[0],d[2],d[3]);break;case "line":drawFracLine(d[0],d[2],d[3]);break;default:}}}
function qDivStr(i){let s=''
s+='<div style="text-align: center;	display: inline-block;	vertical-align:middle;	margin: 0 10px 10px 40px;	font-size: 125%;">';s+='<div style="position:absolute; margin-left:6px; margin-top:6px; font: italic 10px Verdana;">'+(i+1)+':'+'</div>';s+='<div style="display: flex; align-items: center; border: 1px dotted rgb(200,230,250);  padding:16px; border-radius: 20px; margin-bottom:10px; ">';return s}
function doWSConv(){document.getElementById('result').innerHTML="";my.seed=my.seedStt;let dones=[];my.anss=[];my.tabs=[];my.draws=[];let s='';let okQ,id,a;let hh,mm
for(let i=0;i<ws.n;i++){s+=qDivStr(i)
let tries=0;do{a=rpRandomInt(ws.amin,ws.amax);a=Math.floor(a/ws.tacc)*ws.tacc
id=a+',';okQ=true;if(dones.indexOf(id)>=0)okQ=false;if(tries>20){while(dones.length>10){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);s+='<div style="margin: 0 2px 0 2px;">';switch(ws.qfmt){case "12:00":hh=Math.floor(a/60)
mm=a-hh*60
if(hh==0)hh=12
s+=hh+':'+pad2(mm)
break;case "words":let wordObj=new Words();let wordStr=wordObj.num2words(numObj.val,false,numObj.den);s+='<span style="font-size:75%;">'
s+=wordStr
s+='</span>'
break;case "clock":hh=Math.floor(a/60)
mm=a-hh*60
s+='<canvas id="frcan'+i+'" style="display: flex; ">';s+='</canvas>';my.draws.push(["frcan"+i,ws.qfmt,hh,mm,true]);break;case "box":s+='<canvas id="frcan'+i+'" style="display: flex; ">';s+='</canvas>';my.draws.push(["frcan"+i,ws.tfrom,num,den]);break;case "line":s+='<canvas id="frcan'+i+'" style="display: flex; ">';s+='</canvas>';my.draws.push(["frcan"+i,ws.tfrom,num,den]);break;case "box":break;default:}
s+='</div>';s+='<div style="middle; margin: 0 6px 0 6px;">';s+='=';s+='</div>';s+='<div style=" margin: 0 2px 0 2px;">';switch(ws.afmt){case "frac":case "mix":s+=numObj.html(!my.ansQ);break;case "dec":s+=decfmt(numObj.decimal(),!my.ansQ)
break;case "12:00":hh=Math.floor(a/60)
mm=a-hh*60
if(hh==0)hh=12
let timeStr=hh+':'+pad2(mm)
if(my.ansQ){s+=timeStr}else{s+='<span style="visibility:hidden;">'+timeStr+'</span>'}
break;case "clock":s+='<canvas id="tocan'+i+'" style="">';s+='</canvas>';hh=Math.floor(a/60)
mm=a-hh*60
my.draws.push(["tocan"+i,ws.afmt,hh,mm,my.ansQ]);break;case "box":s+='<canvas id="tocan'+i+'" style="">';s+='</canvas>';if(my.ansQ){my.draws.push(["tocan"+i,ws.afmt,num,den]);}else{my.draws.push(["tocan"+i,ws.afmt,0,0]);}
break;case "line":s+='<canvas id="tocan'+i+'" style="">';s+='</canvas>';if(my.ansQ){my.draws.push(["tocan"+i,ws.afmt,num,den]);}else{my.draws.push(["tocan"+i,ws.afmt,0,0]);}
break;default:}
s+='</div>';if(ws.olQ){}else{}
s+='</div>';s+='</div>';}
return s;}
function pad2(n){if(n<10)return '0'+n
return n}
function drawClock(id,hh,mm,drawHandsQ){let w=ws.rad*2;let h=w;let el=document.getElementById(id);el.width=w*my.ratio;el.height=h*my.ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(my.ratio,0,0,my.ratio,0,0);g.beginPath();g.lineWidth=1;g.strokeStyle="black";g.arc(ws.rad,ws.rad,ws.rad*0.96,0,2*Math.PI);g.stroke();let clock=new Clock(el,ws.rad);if(drawHandsQ)clock.setTime(hh,mm)}
function drawPie(id,num,den){let w=ws.rad*2;let h=w;let el=document.getElementById(id);el.width=w*my.ratio;el.height=h*my.ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(my.ratio,0,0,my.ratio,0,0);if(den==0){g.beginPath();g.lineWidth=1;g.strokeStyle="black";g.arc(ws.rad,ws.rad,ws.rad,0,2*Math.PI);g.stroke();}else{g.drawSectors(ws.rad,ws.rad,ws.rad,num,den);}}
function drawFracLine(id,num,den){let w=150;let h=25;let hC=h/2;let hA=h*0.4;let hB=h*0.2;let pad=8;let el=document.getElementById(id);el.width=(w+pad*2)*my.ratio;el.height=(h+pad*2)*my.ratio;el.style.width=(w+pad*2)+"px";el.style.height=(h+pad*2)+"px";g=el.getContext("2d");g.setTransform(my.ratio,0,0,my.ratio,0,0);let x=pad;let y=h/2;let clr="darkblue";let fillClr="rgba(0, 0, 200, 0.4)";if(ws.bwQ){clr="black";fillClr="rgba(0, 0, 0, 0.4)";}
g.strokeStyle=clr;g.lineWidth=2.5;g.font="15px Verdana";g.textAlign="center";g.beginPath();g.moveTo(x,y-hC);g.lineTo(x,y+hC);g.stroke();g.fillText("0",x,y+hC+16);g.beginPath();g.moveTo(x+w,y-hC);g.lineTo(x+w,y+hC);g.stroke();g.fillText("1",x+w,y+hC+16);g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.stroke();g.lineWidth=1;if(den>0){let dW=w/den;for(let k=0;k<den;k++){g.strokeStyle=clr;g.fillStyle=fillClr;if(k<num){g.beginPath();g.rect(x,y-hB,dW,hB*2);g.fill();}
g.beginPath();g.moveTo(x,y-hA);g.lineTo(x,y+hA);g.stroke();x+=dW;}}}
function doAns(n){let userAns=document.getElementById('ans'+n).value;console.log("doAns",n,my.anss[n],userAns);if(userAns==my.anss[n]){let s='<div style="text-align:right; border-top: 1px solid black; height:40px;">'+my.anss[n]+'</div>';document.getElementById('ansDiv'+n).innerHTML=s;my.tabs.splice(my.tabs.indexOf('ans'+n),1);console.log("YAY",my.tabs);if(my.tabs.length==0){document.getElementById('result').innerHTML="Perfect !";}else{document.getElementById(my.tabs[0]).focus();}}}
function toggleAns(){if(ws.olQ)return;my.ansQ=!my.ansQ;toggleBtn("ansBtn",my.ansQ);doWS();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function rpRandomInt(min,max){return Math.floor(random()*(max-min+1))+min;}
function random(){let x=Math.sin(my.seed++)*10000;return x-Math.floor(x);}
function isNumber(n){return!isNaN(parseFloat(n))&&!isNaN(n-0)}
function getQueryDef(name,def){let a=getQueryVariable(name);if(a){if(isNumber(a)){return parseInt(a);}else{return a}}
return def;}
function getQueryVariable(variable){let query=window.location.search.substring(1);let vars=query.split("&");for(let i=0;i<vars.length;i++){let pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return false;}
CanvasRenderingContext2D.prototype.drawSectors=function(x,y,radius,numer,denom){g=this;if(denom>100){let f=100/denom;numer*=f;denom*=f;console.log("drawSectors=",numer,denom);}
let dAngle=2*Math.PI/denom;let angleNum=0;let pat=g.createPattern(my.canPat,"repeat");for(let k=0;k<denom;k++){g.beginPath();g.lineWidth=1;g.strokeStyle="black";if(ws.bwQ){g.fillStyle=pat;}else{g.fillStyle="rgba(0, 255, 255, 0.7)";}
g.moveTo(x,y);g.arc(x,y,radius,-angleNum,-angleNum-dAngle,true);g.lineTo(x,y);if(k<numer)g.fill();g.stroke();angleNum+=dAngle;}};String.prototype.repeat=function(num){return new Array(num+1).join(this);};class Num{constructor(val,dec=0,fmt='frac'){this.val=val
this.dec=dec
this.fmt=fmt
this.den=1}
id(){return this.val+'/'+this.den}
decimal(){return(this.val/this.den)}
isWhole(){return(this.val%this.den)==0}
simplify(){let negQ=false
if(this.val<0){negQ=true
this.val=-this.val}
let gcd=this.gcd(this.val,this.den);this.val/=gcd;this.den/=gcd;if(negQ)this.val=-this.val}
gcd(a,b){while(b>0){let remainder=a%b;a=b;b=remainder;}
return Math.abs(a);}
html(blankQ=false){if(this.val==0)return ' '+this.f(0,blankQ)+' '
if(this.val==this.den)' '+this.f(1,blankQ)+' '
if(this.den==1)return ' '+this.f(this.val,blankQ)+' '
switch(this.fmt){case 'frac':case 'simp':return '<span class="intbl"><em>'+this.f(this.val,blankQ)+'</em><strong>'+this.f(this.den,blankQ)+'</strong></span>'
case 'mix':let val=this.val
let negQ=false
if(val<0){val=-val
negQ=true}
let whole=parseInt(val/this.den)
let numer=val-whole*this.den
let s=''
if(negQ){if(whole!=0){whole=-whole}else{numer=-numer}}
if(whole!=0)s+=this.f(whole,blankQ)
if(numer!=0)s+='<span class="intbl"><em>'+this.f(numer,blankQ)+'</em><strong>'+this.f(this.den,blankQ)+'</strong></span>'
return s
default:}}
f(v,blankQ=false){let s=''
if(v<0){s='&minus;'+(-v).toString()}else{s=v.toString()}
if(blankQ){return '<span style="visibility: hidden;">'+s+'</span>'}else{return s}}}
function decfmt(v,blankQ=false){let vround=Math.round(v*1000)/1000
let s=''
if(v==vround){s=v.toString()}else{s=vround.toString()+'...'}
if(blankQ){return '<span style="visibility: hidden;">'+s+'</span>'}else{return s}}
class Words{constructor(){this.lang=[];let Lang="en";switch(Lang){case "en":this.lang.numberComma=",";this.lang.denomUnit="One";this.lang.denomHalves="Halves";this.lang.denom10Join=" ";this.lang.and="and";this.lang.point="point";this.lang.denomHyphen="-";this.lang.denomOrdQ="y";this.lang.denomTh="th";this.lang.denomS="s";this.lang.numExacts=['Zero'];this.lang.thousands=['','Thousand','Million','Billion','Trillion','Quadrillion','Quintillion','Sextillion','Septillion'];this.lang.nums=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty','Twenty One','Twenty Two','Twenty Three','Twenty Four','Twenty Five','Twenty Six','Twenty Seven','Twenty Eight','Twenty Nine'];this.lang.num10s=['Zero','Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];this.lang.num100s=['Zero','One Hundred','Two Hundred','Three Hundred','Four Hundred','Five Hundred','Six Hundred','Seven Hundred','Eight Hundred','Nine Hundred'];this.lang.numers=['Zero'];this.lang.firstFracs=[null,'Whole','Half','Third','Quarter'];this.lang.unitOrds=['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth'];this.lang.tenOrds=['','Tenth','Twentieth','Thirtieth','Fortieth','Fiftieth','Sixtieth','Seventieth','Eightieth','Ninetieth'];break;case "es":this.lang.numberComma="";this.lang.denomUnit="un";this.lang.denomHalves="medios";this.lang.denom10Join=" y ";this.lang.and="y";this.lang.point="point";this.lang.denomHyphen=" ";this.lang.denomOrdQ="n";this.lang.denomTh="avo";this.lang.denomS="s";this.lang.numExacts=['cero','uno'];this.lang.numExacts[100]='cien';this.lang.thousands=['','mil','millón','billón','trillón','cuatrillón','quintillón','sextillón','septillón'];this.lang.nums=['','un','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve','treinta',[40,'cuarenta'],[50,'cincuenta'],[60,'sesenta'],[70,'setenta'],[80,'ochenta'],[90,'noventa'],[100,'ciento'],[200,'doscientos'],[300,'trescientos'],[400,'cuatrocientos'],[500,'quinientos'],[600,'seiscientos'],[700,'setecientos'],[800,'ochocientos'],[900,'novecientos']];this.lang.numers=['cero','un',[21,'veintiún'],[31,'treinta y un'],[41,'cuarenta y un'],[51,'cincuenta y un'],[61,'sesenta y un'],[71,'setenta y un'],[81,'ochenta y un'],[91,'noventa y un']];this.lang.firstFracs=['','entero','medio','tercio','cuarto','quinto','sexto','séptimo','octavo','noveno','décimo',[100,'centésimo'],[1000,'milésimo']];this.lang.unitOrds=['','Primero','Segundo','Tercero','Cuarto','Quinto','Sexto','Séptimo','Octavo','Noveno','Décimo','Decimoprimero','Decimosegundo','Decimotercero','Decimocuarto','Decimoquinto','Decimosexto','Decimoséptimo','Decimoctavo','Decimonoveno'];this.lang.tenOrds=['','Décimo','Vigésimo','Trigésimo','Cuadragésimo','Quincuagésimo','Sexagésimo','Septuagésimo','Octogésimo','Nonagésimo'];break;default:}}
num2words(num,reducedfraction,showdenom,decAsFractionQ){return this.str2words(num.toString(),reducedfraction,showdenom,decAsFractionQ);}
str2words(num,reducedfraction,showdenom,decAsFractionQ){let s="";let negative_flag="";if(num.charAt(0)=="-"){negative_flag='Negative ';num=num.substring(1);}
let origNumber=num;let parts=num.split('.');let integer=parts[0];let decpart=parts[1];let decimalQ=(showdenom!=0||parts.length>1);if(this.lang.numExacts[integer]!=undefined){s=this.lang.numExacts[integer];}else{if(showdenom!=0&&this.lang.numers[integer]!=undefined){s=this.lang.numers[integer];}else{for(let i=0;integer.length>0;i++,integer=integer.substr(0,-Math.min(3,integer.length))){let threedig=integer.substr(-Math.min(3,integer.length));if(parseInt(threedig)!=0){if(i==0){s=this.handleThreeDigit(threedig);}else{if(this.lang.thousands[i]!=undefined){if(s.length==0){s=this.handleThreeDigit(threedig)+' '+this.lang.thousands[i];}else{s=this.handleThreeDigit(threedig)+' '+this.lang.thousands[i]+this.lang.numberComma+' '+s;}}else{s="A Big Number!";}}}}
s=negative_flag+s;}}
if(decimalQ){if(showdenom!=0){if(origNumber=="1")
s=this.lang.denomUnit;s+=' '+this.describeDenom(showdenom,false,origNumber!="1");}else{let decimal="";if(reducedfraction=="n"){decimal=this.handleDecimal(decpart,false,decAsFractionQ);}else{decimal=this.handleDecimal(decpart,true,decAsFractionQ);}
if(decimal.length>0){if(decAsFractionQ){if(s==this.lang.numExacts[0]){s=decimal;}else{s+=' '+this.lang.and+' '+decimal;}}else{s+=' '+this.lang.point+' '+decimal;}}else{}}}
return(s);}
placeStr(power10){let numStr="";if(power10>=0){numStr="1"+"0".repeat(power10);}else{if(power10<-9){return "";}
numStr="0."+"0".repeat(-1-power10)+"1";}
console.log("placeStr numStr="+numStr);let s=this.str2words(numStr);if(s.substr(0,4)=="One "){s=s.substr(4);if(s.substr(0,4)=="One-"){s=s.substr(4);}}
if(s=="One")
s="Unit";s+="s";return(s);}
handleThreeDigit(number){let s="";if(number.length>=3){if(number.charAt(0)!="0"){let hundreds=number.substr(0,1);s+=this.lang.num100s[hundreds];}
number=number.substr(1);}
let twodig=this.handleTwoDigit(number);if(s.length>0&&twodig.length>0)
s+=' ';s+=twodig;return(s);}
handleTwoDigit(number){number=parseInt(number).toString();if(parseInt(number)<30){return(this.lang.nums[number]);}
let s="";let units=parseInt(number.toString().substr(-1));let tens=parseInt(number.toString().substr(0,1));if(units==0){s=this.lang.num10s[tens];}else{s=this.lang.num10s[tens]+" "+this.lang.nums[units];}
return(s);}
handleDecimal(numStr,reduceQ,asFractionQ){console.log("handleDecimal="+numStr,reduceQ);let s="";if(numStr=="")
return(s);let denominator="1"+"0".repeat(numStr.length);if(reduceQ){}
if(asFractionQ){let num=parseInt(numStr);if(this.lang.numers[numStr]!=undefined){s=this.lang.numers[numStr];}else{s=this.num2words(num);}
console.log("q1="+denominator);s+=" "+this.describeDenom(parseInt(denominator),false,num!=1);}else{for(let i=0;i<numStr.length;i++){s+=this.str2words(numStr.charAt(i))+" ";}}
return(s);}
describeDenom(denom,callself,pluralq){if(denom==0)return "undefined";if(denom==2&&pluralq)return this.lang.denomHalves;let s="umptienths";denom=Math.abs(denom);let hyphen=this.lang.denomHyphen;if(!callself&&this.lang.firstFracs[denom]!=undefined){s=this.lang.firstFracs[denom];}else{if(this.lang.denomOrdQ=="y"){if(denom<100){if(denom<20){s=this.lang.unitOrds[denom];}else{let tens=parseInt(denom/10);let units=denom-tens*10;if(units==0){s=this.lang.tenOrds[tens];}else{s=this.num2words(tens*10,false,0)+hyphen+this.lang.unitOrds[units];}}}else{let tens=parseInt(denom.toString().slice(-2));let rest=parseInt(denom.toString().substr(0,denom.toString().length-2)+"00");if(tens==0){s=(this.num2words(rest,false,0)).trim()+this.lang.denomTh;}else{s=this.num2words(rest,false,0)+" "+this.describeDenom(tens,false);}}}else{s=this.num2words(denom)+this.lang.denomTh;}}
if(pluralq&&!callself)
s+=this.lang.denomS;s=s.replace(/,/g,"");s=s.replace(/ /g,hyphen);s=s.replace(hyphen+hyphen,hyphen);return(s);}}
class Clock{constructor(canvas,radius){this.canvas=canvas;this.ctx=this.canvas.getContext('2d');this.radius=radius
this.secondOpt={color:'#cd151c',thickRatio:0.011,forwardRadiusRatio:0.75,backwardRadiusRatio:0.25,tipRadiusRatio:0.075};this.minuteOpt={color:'#f00',thickRatio:0.06,forwardRadiusRatio:0.89,backwardRadiusRatio:0.25};this.hourOpt={color:'#00f',thickRatio:0.08,forwardRadiusRatio:0.55,backwardRadiusRatio:0.25};this.faceOpt={color:'#000',numDistRatio:0.28,numSizeRatio:0.3,edgeDistRatio:0.05,thickRatio:0.01,lengthRatio:0.1,keyMarkers:5,keyMarkerThicknessRatio:0.04,keyMarkerLengthRatio:0.13};this.ratio=2;this.center={x:this.canvas.width*0.5/this.ratio,y:this.canvas.height*0.5/this.ratio};this.drawMinuteMarkers();this.drawPin();}
setTime(hh,mm){this.dt=new Date();this.dt.setHours(hh)
this.dt.setMinutes(mm)
this.dt.setSeconds(0)
this.drawMinuteMarkers();this.drawHourHand();this.drawMinuteHand();this.drawPin();}
drawFace(){let g=this.ctx;let faceGradient=g.createRadialGradient(this.center.x,this.center.y,0,this.center.x,this.center.y,this.radius);faceGradient.addColorStop(0,"rgba(255, 231, 180, 0)");faceGradient.addColorStop(1,"rgba(182, 157, 100, 0.3)");g.fillStyle=faceGradient;g.beginPath();g.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI);g.fillStyle='#fff';g.fill();g.fillStyle=faceGradient;g.fill();let edgeGradient=this.ctx.createLinearGradient(0,this.center.y-this.radius,0,this.center.y+this.radius);edgeGradient.addColorStop(0,"#999");edgeGradient.addColorStop(0.5,"#fff");edgeGradient.addColorStop(1,"#999");g.fillStyle=edgeGradient;g.beginPath();g.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI);g.closePath();g.arc(this.center.x,this.center.y,this.radius+(this.radius*0.075),0,2*Math.PI,true);g.shadowColor='rgba(0,0,0,0.7)';g.shadowBlur=this.radius*0.3;g.shadowOffsetY=1;g.fill();g.shadowBlur=0;g.shadowOffsetY=0;}
drawPin(){this.ctx.fillStyle='#555';this.ctx.beginPath();this.ctx.arc(this.center.x,this.center.y,3,0,2*Math.PI);this.ctx.fill();}
drawMinuteMarkers(){let g=this.ctx;g.font='bold '+(this.radius*this.faceOpt.numSizeRatio)+'px Arial';g.textAlign="center";let i=1;while(i<=60){let angle=(Math.PI*2)*(-i/60);let startX=(Math.sin(angle)*(this.radius-(this.radius*this.faceOpt.edgeDistRatio)))+this.center.x;let startY=(Math.cos(angle)*(this.radius-(this.radius*this.faceOpt.edgeDistRatio)))+this.center.y;if(i%this.faceOpt.keyMarkers){let endX=(Math.sin(angle)*(this.radius-(this.radius*this.faceOpt.lengthRatio)-(this.radius*this.faceOpt.edgeDistRatio)))+this.center.x;let endY=(Math.cos(angle)*(this.radius-(this.radius*this.faceOpt.lengthRatio)-(this.radius*this.faceOpt.edgeDistRatio)))+this.center.y;g.lineWidth=this.faceOpt.thickRatio*this.radius;g.beginPath();g.moveTo(startX,startY);g.lineTo(endX,endY);g.stroke();}else{let endX=(Math.sin(angle)*(this.radius-(this.faceOpt.keyMarkerLengthRatio*this.radius)-(this.radius*this.faceOpt.edgeDistRatio)))+this.center.x;let endY=(Math.cos(angle)*(this.radius-(this.faceOpt.keyMarkerLengthRatio*this.radius)-(this.radius*this.faceOpt.edgeDistRatio)))+this.center.y;g.lineWidth=this.faceOpt.keyMarkerThicknessRatio*this.radius;g.beginPath();g.moveTo(startX,startY);g.lineTo(endX,endY);g.stroke();g.fillStyle="#000";g.strokeStyle='#fff';g.miterLimit=2;g.lineWidth=1;let numRad=this.radius*(1-this.faceOpt.numDistRatio);let numX=Math.sin(angle)*numRad+this.center.x;let numY=Math.cos(angle)*numRad+this.center.y+this.radius*0.11
let h=Math.floor(i/5)+6;if(h>12)h-=12;if(h==10){numX+=this.radius*0.04;numY+=this.radius*0.03;}
if(h==11){numX+=this.radius*0.02;numY+=this.radius*0.03;}
g.fillText(h.toString(),numX,numY);g.strokeText(h.toString(),numX,numY);}
g.strokeStyle=this.faceOpt.color;i++;}}
drawSecondHand(){let secs=this.dt.getSeconds();secs+=this.dt.getMilliseconds()/1000;let handAngle=Math.PI*2*(-secs/60);this.drawHand(handAngle,this.secondOpt);}
drawMinuteHand(){let minutes=this.dt.getMinutes()+this.dt.getSeconds()/60;let handAngle=(Math.PI*2)*(-minutes/60);this.drawHand(handAngle,this.minuteOpt);}
drawHourHand(){let h=this.dt.getHours()+this.dt.getMinutes()/60;if(h>=12)
h-=12;let handAngle=(Math.PI*2)*(-h/12);this.drawHand(handAngle,this.hourOpt);}
drawHand(angle,handOptions){let startX=(Math.sin(angle)*(this.radius*handOptions.backwardRadiusRatio))+this.center.x;let startY=(Math.cos(angle)*(this.radius*handOptions.backwardRadiusRatio))+this.center.y;let endX=(Math.sin(angle-Math.PI)*(this.radius*handOptions.forwardRadiusRatio))+this.center.x;let endY=(Math.cos(angle-Math.PI)*(this.radius*handOptions.forwardRadiusRatio))+this.center.y;let g=this.ctx;g.shadowColor='rgba(0,0,0,0.8)';g.shadowBlur=this.radius*0.075;g.shadowOffsetY=1;g.strokeStyle=handOptions.color;g.lineWidth=handOptions.thickRatio*this.radius;g.beginPath();g.moveTo(startX,startY);g.lineTo(endX,endY);g.stroke();g.shadowBlur=0;g.shadowOffsetY=0;if(handOptions.tipRadiusRatio){g.beginPath();g.moveTo(startX,startY);g.lineTo(endX,endY);g.stroke();}}}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script);}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
switch(tag){case 'btn':if(cls.length==0)cls='btn'
s+='<button onclick="'+fn+'"'
break
case 'can':s+='<canvas'
break
case 'div':s+='<div'
break
case 'inp':if(cls.length==0)cls='input'
if(lbl.length>0){s+='<label class="label">'+lbl}
s+='<input value="'+txt+'"'
if(fn.length>0)s+='  oninput="'+fn+'" onchange="'+fn+'"'
break
case 'rad':if(cls.length==0)cls="radio"
s+='<form';if(fn.length>0)s+=' onclick="'+fn+'"'
break
case 'sel':if(cls.length==0)cls="select"
s+='<select onclick="'+fn+'"'
break
case 'sld':s+='<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"'
break
default:}
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
switch(tag){case 'btn':s+='>'+txt+'</button>'
break
case 'can':s+='></canvas>'
break
case 'div':s+=' >'+txt+'</div>'
break
case 'inp':s+='>'
if(lbl.length>0)s+='</label>'
break
case 'rad':s+='>\n'
for(let i=0;i<opts.length;i++){let chk='';if(i==0)chk='checked';s+='<input type="radio" id="r'+i+'" name="typ" style="cursor:pointer;" value="'+opts[i][0]+'" '+chk+' />\n';s+='<label for="r'+i+'" style="cursor:pointer;">'+opts[i][1]+'</label><br/>\n';}
s+='</form>';break
case 'sel':s+='>\n'
for(let i=0;i<opts.length;i++){let idStr=id+i;let chkStr=i==99?' checked ':'';s+='<option id="'+idStr+'" value="'+opts[i]+'"'+chkStr+'>'+opts[i]+'</option>\n';}
s+='</select>';break
case 'sld':s+='>'
break
default:}
s+='\n'
return s}
init()