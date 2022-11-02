var g,my={}
function calcrectMain(mode){my.version='0.80';w=300;h=360;var id="rect";s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px;  border: none; margin:auto; display:block; background-color:hsla(120,100%,95%,1); border-radius:10px; font-family: Verdana, Arial, Tahoma, sans-serif;">';s+='<canvas id="canvas'+id+'" width="'+w+'" height="'+h+'" style="z-index:1; position: absolute; top: 0px; left: 0px;"></canvas>';my.topClr='purple'
my.sideClr='lightpurple'
my.sideClr='blue'
my.periClr='red'
my.diagClr='darkorange'
my.flds=[{id:'wide',title:'Width',lt:30,tp:22,clr:my.topClr,fn:'chgSide'},{id:'side',title:'Height',lt:165,tp:120,clr:my.sideClr,fn:'chgSide'},{id:'area',title:'Area',lt:30,tp:165,clr:'#ce5c00',fn:'chgArea'},{id:'diag',title:'Diagonal',lt:30,tp:235,clr:my.diagClr,fn:'chgDiag'},{id:'peri',title:'Perimeter',lt:30,tp:310,clr:my.periClr,fn:'chgPeri'},]
for(var i=0;i<my.flds.length;i++){var fld=my.flds[i]
s+='<div style="font-size: 17px; position:absolute; left:'+fld.lt+'px;  top:'+(fld.tp-23)+'px; width:120px; z-index:2; color:'+fld.clr+'; text-align:center;">'+fld.title+':</div>';s+='<input type="text" id="'+fld.id+'" style="font-size: 17px; position:absolute; left:'+fld.lt+'px;  top:'+fld.tp+'px; width:120px; z-index:2; color:'+fld.clr+'; background-color: #f0f8ff; text-align:center; border-radius: 10px; " value="" onKeyUp="chg('+i+')" />';}
s+='<div id="copyrt" style="font: 10px Arial; color: blue; position:absolute; bottom:3px; right:8px;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);var el=document.getElementById('canvas'+id);ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);bgDraw()
my.unit=''
my.hist=[0]
divNum('wide',1)
divNum('side',1)
chg(1)}
function bgDraw(){my.rect={x:20,y:70,wd:150,ht:200}
var rect=my.rect
g.strokeStyle=my.topClr
g.fillStyle=my.topClr
g.beginPath()
g.moveTo(rect.x,rect.y-15)
g.lineTo(rect.x+rect.wd,rect.y-15)
g.drawArrow(rect.x,rect.y-15,15,2,20,10,Math.PI,10,false)
g.drawArrow(rect.x+rect.wd,rect.y-15,15,2,20,10,0,10,false)
g.stroke()
g.fill()
g.strokeStyle=my.sideClr
g.fillStyle=my.sideClr
g.beginPath()
g.moveTo(rect.x+rect.wd+20,rect.y)
g.lineTo(rect.x+rect.wd+20,rect.y+rect.ht)
g.drawArrow(rect.x+rect.wd+20,rect.y,15,2,20,10,Math.PI/2,10,false)
g.drawArrow(rect.x+rect.wd+20,rect.y+rect.ht,15,2,20,10,Math.PI*3/2,10,false)
g.stroke()
g.fill()
g.strokeStyle=my.periClr
g.fillStyle='hsla(240,100%,94%,1)'
g.lineWidth=1.2
g.beginPath()
g.rect(rect.x,rect.y,rect.wd,rect.ht)
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
g.moveTo(rect.x,rect.y)
g.lineTo(rect.x+rect.wd,rect.y+rect.ht)
g.stroke()
g.setLineDash([])}
function chg(n){if(my.hist[my.hist.length-1]!=n)my.hist.push(n)
while(my.hist.length>2){my.hist.shift();}
console.log('chg',my.hist)
for(var i=0;i<my.flds.length;i++){var div=document.getElementById(my.flds[i].id)
div.style.backgroundColor='hsla(120,100%,92%,1)'}
for(var i=0;i<my.hist.length;i++){var div=document.getElementById(my.flds[my.hist[i]].id)
div.style.backgroundColor='hsla(240,100%,92%,1)'}
var wide,side,area,diag,peri,unit
if(equiv2(my.hist,[0,1])){wide=getNumPart(document.getElementById("wide").value)
side=getNumPart(document.getElementById("side").value)
unit=''
console.log('wide,side',wide,side)
divNum('diag',Math.sqrt(wide*wide+side*side))
divNum('peri',(wide+side)*2)
divNum('area',wide*side,)}
if(equiv2(my.hist,[0,2])){wide=getNumPart(document.getElementById("wide").value)
area=getNumPart(document.getElementById("area").value)
unit=''
console.log('wide,area',wide,area)
side=area/wide
divNum('side',side)
divNum('diag',Math.sqrt(wide*wide+side*side))
divNum('peri',(wide+side)*2)}
if(equiv2(my.hist,[0,3])){wide=getNumPart(document.getElementById("wide").value)
diag=getNumPart(document.getElementById("diag").value)
unit=''
console.log('wide,diag',wide,diag)
side=Math.sqrt(diag*diag-wide*wide)
divNum('side',side)
divNum('area',wide*side)
divNum('peri',(wide+side)*2)}
if(equiv2(my.hist,[0,4])){wide=getNumPart(document.getElementById("wide").value)
peri=getNumPart(document.getElementById("peri").value)
unit=''
console.log('wide,peri',wide,peri)
side=peri/2-wide
divNum('side',side)
divNum('area',wide*side)
divNum('diag',Math.sqrt(wide*wide+side*side))}
if(equiv2(my.hist,[1,2])){side=getNumPart(document.getElementById("side").value)
area=getNumPart(document.getElementById("area").value)
unit=''
console.log('side,area',side,area)
wide=area/side
divNum('wide',wide)
divNum('diag',Math.sqrt(wide*wide+side*side))
divNum('peri',(wide+side)*2)}
if(equiv2(my.hist,[1,3])){side=getNumPart(document.getElementById("side").value)
diag=getNumPart(document.getElementById("diag").value)
unit=''
console.log('side,diag',side,diag)
wide=Math.sqrt(diag*diag-side*side)
divNum('wide',wide)
divNum('area',wide*side)
divNum('peri',(wide+side)*2)}
if(equiv2(my.hist,[1,4])){side=getNumPart(document.getElementById("side").value)
peri=getNumPart(document.getElementById("peri").value)
unit=''
console.log('wide,peri',wide,peri)
wide=peri/2-side
divNum('wide',wide)
divNum('area',wide*side)
divNum('diag',Math.sqrt(wide*wide+side*side))}
if(equiv2(my.hist,[2,3])){area=getNumPart(document.getElementById("area").value)
diag=getNumPart(document.getElementById("diag").value)
unit=''
console.log('area,diag',area,diag)
var b=-diag*diag
var c=area*area
var side2=(-b+Math.sqrt(b*b-4*c))/2
side=Math.sqrt(side2)
wide=area/side
divNum('wide',wide)
divNum('side',side)
divNum('peri',(wide+side)*2)}
if(equiv2(my.hist,[2,4])){area=getNumPart(document.getElementById("area").value)
peri=getNumPart(document.getElementById("peri").value)
unit=''
console.log('area,peri',area,peri)
var b=-peri/2
var c=area
side=(-b+Math.sqrt(b*b-4*c))/2
console.log('b,side',b,side)
wide=area/side
divNum('wide',wide)
divNum('side',side)
divNum('diag',Math.sqrt(wide*wide+side*side))}
if(equiv2(my.hist,[3,4])){diag=getNumPart(document.getElementById("diag").value)
peri=getNumPart(document.getElementById("peri").value)
console.log('diag,peri',diag,peri)
var ph=peri/2
var b=-ph
var c=(ph*ph-diag*diag)/2
side=(-b+Math.sqrt(b*b-4*c))/2
console.log('diag,peri,b,c,side',diag,peri,b,c,side)
wide=peri/2-side
divNum('wide',wide)
divNum('side',side)
divNum('area',wide*side)}}
function equiv2(A,B){if(A[0]==B[0]&&A[1]==B[1])return true
if(A[0]==B[1]&&A[1]==B[0])return true}
function divNum(id,num){var s='?'
if(isNaN(num)){s='?'}else{s=fmtNum(num,my.unit,1)}
document.getElementById(id).value=s}
function getNumPart(text){return Number(splitNum(text,true));}
function getUnitPart(text){return splitNum(text,false);}
function splitNum(text,wantNumQ){var s=""
var splitCol=0;var isAllNumQ=true;for(var i=0;i<text.length;i++){var isNumQ=false;var charCode=text.charCodeAt(i);if(charCode==45&&i==0)isNumQ=true;if(charCode==46)isNumQ=true;if(charCode>=48&&charCode<=57)isNumQ=true;if(!isNumQ){isAllNumQ=false;splitCol=i;break;}}
if(wantNumQ){if(isAllNumQ){return text;}else{return text.substr(0,splitCol);}}else{if(isAllNumQ){return "";}else{return text.substr(splitCol).trim();}}}
function fmtNum(val,unit,exp){exp=typeof exp!=='undefined'?exp:1;var s="";if(unit.length>0){if(unit.charAt(unit.length-1)=="²"){unit=unit.substr(0,unit.length-1);}
s=fmt(val,7)+" "+unit;if(exp==2)
s+="²";}else{s=fmt(val,10);}
return s;}
function fmt(val,len){return val.toPrecision(len);}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};