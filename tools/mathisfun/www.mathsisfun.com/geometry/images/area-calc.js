var my={}
function areacalcMain(){my.version='0.76';w=440;h=490;var s='';s+='<div style="position:relative; max-width:'+w+'px; height:'+h+'px; border-radius: 10px;  margin:auto; display:block;  text-align: center; ">';shapes=[{name:"Triangle",img:"triangle2.gif",formula:"&frac12;b &times; h",sub:"&frac12; &times; #0 &times; #1",vals:[["b",55,77],["h",102,26]]},{name:"Circle",img:"circle.gif",formula:"&pi; &times; r&sup2;",sub:"&pi; &times; #0&sup2;",vals:[["r",90,31]]},{name:"Sector",img:"sector.gif",formula:"&frac12;r&sup2;&theta;",sub:"&frac12; &times; #0&sup2; &times; #1",vals:[["r",90,54],["angle",-68,65,"&theta;"],["radq",-84,90]]},{name:"Ellipse",img:"ellipse.gif",formula:"&pi;ab",sub:"&pi; &times; #0 &times; #1",vals:[["a",95,15],["b",-80,64]]},{name:"Square",img:"squar2.gif",formula:"a&sup2;",sub:"#0&sup2;",vals:[["a",100,35]]},{name:"Rectangle",img:"rectangle.gif",formula:"w &times; h",sub:"#0 &times; #1",vals:[["w",55,72],["h",100,28]]},{name:"Parallelogram",img:"parallel.gif",formula:"b &times; h",sub:"#0 &times; #1",vals:[["b",47,73],["h",100,32]]},{name:"Trapezoid",img:"trap.gif",formula:"&frac12;(a+b) &times; h",sub:"&frac12;(#0+#1) &times; #2",vals:[["a",70,0],["b",55,75],["h",102,36]]}];for(var i=0;i<shapes.length;i++){var shape=shapes[i];s+='<div class="togglebtn hi" id="area'+i+'" style="display: inline-block; width: 100px; height: 100px; border: 2px solid white;"  onclick="go(this.id)">';s+='<img src="geometry/images/area/'+shape.img+'" />';s+='</div>';}
s+='<div id="title" style="position:relative; width:100%; padding: 8px 0 0 0; display:block; font: 22px Arial; color: green; ">';s+='</div>';s+='<div id="entry" style="position:relative; width:320px; height:140px; display:block; text-align:center; margin:auto; ">';s+='</div>';s+='<textarea id="calcs" style="width:100%; height:75px; background-color: #dfd; text-align:center; font: 18px Arial; border-radius: 10px; color:blue;" value=""></textarea>';s+='<div id="copyrt" style="font: 7pt arial; font-weight: bold; color: #6600cc; position:relative;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);go('area0');}
function go(id){for(var i=0;i<shapes.length;i++){document.getElementById('area'+i).classList.remove("yy");document.getElementById('area'+i).classList.add("hi");}
document.getElementById(id).classList.remove("hi");document.getElementById(id).classList.add("yy");var shapeNo=id.substr(4);doShape(shapeNo);}
function doShape(shapeNo){shape=shapes[shapeNo];document.getElementById('title').innerHTML=shape.name
var lt=100
var tp=10
var s='';s+='<img style="position:absolute; left:'+lt+'px; top:10px;" src="geometry/images/area/'+shape.img+'" />';var vals=shape.vals;for(var i=0;i<vals.length;i++){var val=vals[i]
if(val[0]=='radq'){s+='<div  style="position:absolute; left:'+(val[1]+lt)+'px; top:'+(val[2]+tp)+'px; font-size: 14px; z-index:2; color: #0000ff;">';s+='<input type="radio" name="radq" style="" onclick="radQChg(0)" autocomplete="off" checked >radian</input>';s+='<input type="radio" name="radq" style=""  onclick="radQChg(1)" autocomplete="off" >degree</input>';s+='</div>'
radQChg(0)}else{s+='<input type="text" id="input'+i+'" style="position:absolute; left:'+(vals[i][1]+lt)+'px; top:'+(vals[i][2]+tp)+'px; font-size: 17px; width:90px; z-index:2; color: #0000ff; background-color: #e8f0ff; text-align:center; border-radius: 10px;" value="1"  onkeyup="valChg('+i+')"></input>';}}
document.getElementById('entry').innerHTML=s;my.radQ=true
valChg(0);}
function radQChg(n){my.radQ=(n==0)
console.log("radQChg="+my.radQ+','+n);valChg(0)}
function valChg(n){var shapeName=shape.name;console.log("valChg="+shapeName+','+n);var formula=shape.formula
var sub=shape.sub
var area=0;switch(shapeName){case "Triangle":area=getVal(0)*getVal(1)/2;break;case "Circle":area=Math.PI*Math.pow(getVal(0),2);break;case "Sector":area=Math.pow(getVal(0),2)*getVal(1)/2;if(my.radQ){}else{formula+=" &times; (&pi;/180)"
sub+=" &times; (&pi;/180)"
area*=Math.PI/180.}
break;case "Ellipse":area=Math.PI*getVal(0)*getVal(1);break;case "Square":area=Math.pow(getVal(0),2);break;case "Rectangle":area=getVal(0)*getVal(1);break;case "Parallelogram":area=getVal(0)*getVal(1);break;case "Trapezoid":area=(1/2)*(getVal(0)+getVal(1))*getVal(2);break;default:}
var answer="";answer+="Area = "+formula
var s=sub
var vals=shape.vals
for(var i=0;i<vals.length;i++){s=s.split("#"+i.toString()).join(getVal(i).toString());}
answer+="\n= "+s;answer+="\n= "+fmtNum(area);document.getElementById('calcs').innerHTML=answer;}
function getVal(boxNo){var div=document.getElementById('input'+boxNo);if(div==null)return 0
var val=div.value;val=val.replace(/[^0-9, e\-\.]+/g,'');div.value=val;if(isNumeric(val)){return+val;}else{return 0;}}
function fmtNum(v){var s=(+v).toPrecision(10);if(s.indexOf(".")>0&&s.indexOf('e')<0){s=s.replace(/0+$/,'');}
if(s.charAt(s.length-1)=='.'){s=s.substr(0,s.length-1);}
return s;}
function isNumeric(n){return!isNaN(parseFloat(n))&&isFinite(n);}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("yy");document.getElementById(btn).classList.remove("hi");}else{document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("yy");}}