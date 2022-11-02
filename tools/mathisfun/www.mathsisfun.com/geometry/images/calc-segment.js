var g,w,h,my={}
function calcsegmentMain(mode){my.version='0.50';w=300;h=380;var id="rect";var s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px;  border: none; margin:auto; display:block; background-color:hsla(120,100%,95%,1); border-radius:10px; font-family: Verdana, Arial, Tahoma, sans-serif;">';s+='<canvas id="canvas'+id+'" width="'+w+'" height="'+h+'" style="z-index:1; position: absolute; top: 0px; left: 0px;"></canvas>';s+='<img src="../geometry/images/cylinder-horiz.svg"  alt="Horizontal cylinder"  style="position:absolute; left:0px;  top:50px;" >';my.flds=[{id:'rad',title:'Radius r',lt:165,tp:22,clr:'#ff6600',fn:chgRad},{id:'height',title:'Height h',lt:165,tp:200,clr:'#3465a4',fn:chgHt},{id:'length',title:'Length',lt:10,tp:200,clr:'black',fn:chgLen},{id:'area',title:'Area',lt:165,tp:250,clr:'#ce5c00',fn:chgNot},{id:'pct',title:'% Full',lt:10,tp:305,clr:'#666666',fn:chgNot},{id:'vol',title:'Volume',lt:165,tp:305,clr:'#ce0000',fn:chgNot},]
for(var i=0;i<my.flds.length;i++){var fld=my.flds[i]
s+='<div style="font-size: 17px; position:absolute; left:'+fld.lt+'px;  top:'+(fld.tp-23)+'px; width:120px; z-index:2; color:'+fld.clr+'; text-align:center;">'+fld.title+':</div>';s+='<input type="text" id="'+fld.id+'" style="font-size: 17px; position:absolute; left:'+fld.lt+'px;  top:'+fld.tp+'px; width:120px; z-index:2; color:'+fld.clr+'; background-color: #f0f8ff; text-align:center; border-radius: 10px; " value="" onKeyUp="'+fld.fn.name+'(this.value)" />';}
s+='<div id="copyrt" style="font: 10px Arial; color: blue; position:absolute; bottom:3px; right:8px;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);var el=document.getElementById('canvas'+id);var ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.unit=''
my.hist=[0]
my.rad=1
my.h=0.5
my.len=2
divNum('rad',my.rad)
divNum('height',my.h)
divNum('length',my.len)
chgRad(1)}
function chgRad(v){my.rad=getNumPart(v);doCalc()}
function chgHt(v){my.h=getNumPart(v);doCalc()}
function chgLen(v){my.len=getNumPart(v);doCalc()}
function chgNot(){doCalc()}
function doCalc(){console.log('doCalc',my)
if(my.h>my.rad*2){my.h=my.rad*2
divNum('height',my.h)}
if(my.h<0){my.h=0
divNum('height',my.h)}
var fullArea=Math.PI*my.rad*my.rad
var triHt=my.rad-my.h
var triBase=2*(Math.sqrt(2*my.rad*my.h-(my.h*my.h)))
var triArea=0.5*triHt*triBase
var theta=2*Math.acos((my.rad-my.h)/my.rad)
var secArea=0.5*theta*my.rad*my.rad
var a=secArea-triArea
var v=a*my.len
divNum('area',a)
divNum('vol',v)
divNum('pct',100*a/fullArea)}
function divNum(id,num){var s='?'
if(isNaN(num)){s='?'}else{s=fmtNum(num,my.unit,1)}
document.getElementById(id).value=s}
function getNumPart(text){return Number(splitNum(text,true));}
function getUnitPart(text){return splitNum(text,false);}
function splitNum(text,wantNumQ){var splitCol=0;var isAllNumQ=true;for(var i=0;i<text.length;i++){var isNumQ=false;var charCode=text.charCodeAt(i);if(charCode==45&&i==0)isNumQ=true;if(charCode==46)isNumQ=true;if(charCode>=48&&charCode<=57)isNumQ=true;if(!isNumQ){isAllNumQ=false;splitCol=i;break;}}
if(wantNumQ){if(isAllNumQ){return text;}else{return text.substr(0,splitCol);}}else{if(isAllNumQ){return "";}else{return text.substr(splitCol).trim();}}}
function fmtNum(val,unit,exp){exp=typeof exp!=='undefined'?exp:1;var s="";if(unit.length>0){if(unit.charAt(unit.length-1)=="²"){unit=unit.substr(0,unit.length-1);}
s=fmt(val,7)+" "+unit;if(exp==2)
s+="²";}else{s=fmt(val,10);}
return s;}
function fmt(val,len){return val.toPrecision(len);}