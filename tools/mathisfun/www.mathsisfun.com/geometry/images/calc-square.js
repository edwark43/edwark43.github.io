var g,w,h,my={}
function calcsquareMain(){my.version='0.81';w=300;h=350;var id="square";var s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px;  border: none; margin:auto; display:block; background-color:hsla(40,100%,92%,0.5); border-radius:10px; font-family: Verdana, Arial, Tahoma, sans-serif;">';s+='<canvas id="canvas'+id+'" width="'+w+'" height="'+h+'" style="z-index:1; position: absolute; top: 0px; left: 0px;"></canvas>';my.sideClr='blue'
my.periClr='red'
my.diagClr='orange'
var flds=[{id:'side',title:'Side length',lt:140,tp:18,clr:my.sideClr,fn:'chgSide'},{id:'area',title:'Area',lt:114,tp:155,clr:'#ce5c00',fn:'chgArea'},{id:'diag',title:'Diagonal',lt:98,tp:235,clr:my.diagClr,fn:'chgDiag'},{id:'peri',title:'Perimeter',lt:140,tp:292,clr:my.periClr,fn:'chgPeri'},]
for(var i=0;i<flds.length;i++){var fld=flds[i]
s+='<div style="font-size: 17px; position:absolute; top:'+fld.tp+'px; left:'+(fld.lt-125)+'px; width:120px; z-index:2; color:'+fld.clr+'; text-align:right;">'+fld.title+':</div>';s+='<input type="text" id="'+fld.id+'" style="font-size: 17px; position:absolute; top:'+fld.tp+'px; left:'+fld.lt+'px; width:120px; z-index:2; color:'+fld.clr+'; background-color: #f0f8ff; text-align:center; border-radius: 10px; " value="" onKeyUp="'+fld.fn+'(this.value)" />';}
s+='<div id="copyrt" style="font: 10px Arial; color: blue; position:absolute; bottom:3px; right:8px;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);var el=document.getElementById('canvas'+id);var ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);bgDraw()
document.getElementById("side").value=1;chgSide(1);}
function bgDraw(){g.strokeStyle=my.sideClr
g.fillStyle=my.sideClr
g.beginPath()
g.moveTo(50,55)
g.lineTo(250,55)
g.drawArrow(50,55,15,2,20,10,Math.PI,10,false)
g.drawArrow(250,55,15,2,20,10,0,10,false)
g.stroke()
g.fill()
g.strokeStyle=my.periClr
g.fillStyle='hsla(60,100%,90%,0.5)'
g.lineWidth=1.2
g.beginPath()
g.rect(50,70,200,200)
g.fill()
g.stroke()
g.strokeStyle=my.periClr
g.fillStyle=my.periClr
g.lineWidth=1
g.beginPath()
g.drawArrow(90,270,25,1,20,10,Math.PI/2,10,false)
g.stroke()
g.fill()
g.strokeStyle=my.diagClr
g.setLineDash([5,5])
g.setLineDash([5,5])
g.beginPath()
g.moveTo(50,70)
g.lineTo(250,270)
g.stroke()
g.setLineDash([])}
function chgPeri(v){var peri=getNumPart(v);var unit=getUnitPart(v);var side=peri/4
document.getElementById("diag").value=fmtNum(side*Math.sqrt(2),unit);document.getElementById("side").value=fmtNum(side,unit);document.getElementById("area").value=fmtNum(side*side,unit,2);}
function chgDiag(v){var diag=getNumPart(v);var unit=getUnitPart(v);var side=diag/Math.sqrt(2)
document.getElementById("side").value=fmtNum(side,unit);document.getElementById("peri").value=fmtNum(side*4,unit);document.getElementById("area").value=fmtNum(side*side,unit,2);}
function chgSide(v){var side=getNumPart(v);var unit=getUnitPart(v);document.getElementById("diag").value=fmtNum(side*Math.sqrt(2),unit);document.getElementById("peri").value=fmtNum(side*4,unit);document.getElementById("area").value=fmtNum(side*side,unit,2);}
function chgArea(v){var area=getNumPart(v);var unit=getUnitPart(v);var side=Math.sqrt(area);document.getElementById("diag").value=fmtNum(side*Math.sqrt(2),unit);document.getElementById("side").value=fmtNum(side,unit);document.getElementById("peri").value=fmtNum(side*4,unit);}
function getNumPart(text){return splitNum(text,true);}
function getUnitPart(text){return splitNum(text,false);}
function splitNum(text,wantNumQ){var splitCol=0;var isAllNumQ=true;for(var i=0;i<text.length;i++){var isNumQ=false;var charCode=text.charCodeAt(i);if(charCode==45&&i==0)isNumQ=true;if(charCode==46)isNumQ=true;if(charCode>=48&&charCode<=57)isNumQ=true;if(!isNumQ){isAllNumQ=false;splitCol=i;break;}}
if(wantNumQ){if(isAllNumQ){return text;}else{return text.substr(0,splitCol);}}else{if(isAllNumQ){return "";}else{return text.substr(splitCol).trim();}}}
function fmtNum(val,unit,exp){exp=typeof exp!=='undefined'?exp:1;var s="";if(unit.length>0){if(unit.charAt(unit.length-1)=="²"){unit=unit.substr(0,unit.length-1);}
s=fmt(val,7)+" "+unit;if(exp==2)
s+="²";}else{s=fmt(val,10);}
return s;}
function fmt(val,len){return val.toPrecision(len);}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};