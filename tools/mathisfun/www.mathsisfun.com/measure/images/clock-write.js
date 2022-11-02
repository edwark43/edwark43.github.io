var w,h,el,el1,el2,g,shapes,my={};function clockwriteMain(mode){my.version='0.6';my.typ=typeof mode!=='undefined'?mode:'bla';var rel="../index.html"
w=250;h=100;var s='';s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 1px solid black; border-radius: 10px;">';s+='<canvas id="canvas1" width="'+w+'" height="'+h+'" style="z-index:1; position: absolute; top: 0; left: 0;"></canvas>';s+='<canvas id="canvas2" width="'+w+'" height="'+h+'" style="z-index:2; position: absolute; top: 0; left: 0;"></canvas>';s+='<img id="pencil" src="'+rel+'images/style/pencil.gif" style="z-index:3; position: absolute; top:'+h+'px; left: 0; pointer-events: none;" />';s+='<img id="brush" src="'+rel+'images/style/paint-brush.gif" style="z-index:3; position: absolute; top:'+h+'px; left: 0; pointer-events: none;" />';s+='<button id="ampmBtn" onclick="toggleampm()" class="togglebtn hi" style="z-index:2; position: absolute; left: 1px; bottom: 1px; ">24 Hour</button>';s+='<button id="secBtn" onclick="togglesec()" class="togglebtn hi" style="z-index:2; position: absolute; right: 1px; bottom: 1px; ">Seconds</button>';s+='<div id="ampm" style="font: 20px Arial; color: #660066; position:absolute; left:0px; bottom:15px; width:'+w+'px; text-align:center; visibility:hidden;">AM</div>';s+='<div id="copyrt" style="font: 8px Arial; color: #660066; position:absolute; left:0px; bottom:1px; width:'+w+'px; text-align:center;">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el1=document.getElementById('canvas1');var ratio=4;el1.width=w*ratio;el1.height=h*ratio;el1.style.width=w+"px";el1.style.height=h+"px";el2=document.getElementById('canvas2');el2.width=w*ratio;el2.height=h*ratio;el2.style.width=w+"px";el2.style.height=h+"px";el=el1;g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0)
my.pencilEl=document.getElementById("pencil");my.brushEl=document.getElementById("brush");my.zoom=1.2;my.strokedQ=true;my.ampmQ=false
my.secQ=true
loadChars()
my.poss=[{x:0,y:0},{x:25,y:0},{x:50,y:0},{x:60,y:0},{x:85,y:0},{x:115,y:0},{x:125,y:0},{x:150,y:0},]
shapes=[]
my.shapeNo=0;my.shapeStt=0;my.playQ=true
startIt();my.lastTimeStr=''
my.timeStr=getTimeStr()}
function toggleampm(){my.ampmQ=!my.ampmQ
var btn='ampmBtn'
if(my.ampmQ){document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");document.getElementById(btn).innerHTML='AM/PM'
document.getElementById('ampm').style.visibility='visible'}else{document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");document.getElementById(btn).innerHTML='24 Hour'
document.getElementById('ampm').style.visibility='hidden'}}
function togglesec(){my.secQ=!my.secQ
var btn='secBtn'
if(my.secQ){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function startIt(){var t=getTimeStr()
my.queue=[]
for(var i=0;i<t.length;i++){my.queue.push([t[i],my.poss[i]])}
my.shapeNo=my.shapeStt;el1.getContext("2d").clearRect(0,0,el1.width,el1.height);el2.getContext("2d").clearRect(0,0,el2.width,el2.height);g.lineWidth=1.9
g.strokeStyle='blue'
anim()}
function anim(){if(my.playQ){if(my.shapeNo<shapes.length){drawIt(shapes[my.shapeNo]);my.shapeNo++;}else{g.stroke()
if(my.queue.length>0){while(my.queue.length>100)my.queue.pop()
var item=my.queue.shift()
my.shapeNo=0
var x=15+item[1].x
var y=34+item[1].y
shapes=[]
shapes.push("rect_"+(x-1)+"_"+(y-29)+"_"+24+"_"+40)
expandShapes(item[0],x,y)}else{my.lastTimeStr=my.timeStr
my.timeStr=getTimeStr()
if(my.timeStr!=my.lastTimeStr){for(var i=0;i<my.timeStr.length;i++){if(my.timeStr[i]!=my.lastTimeStr[i]){var ch=my.timeStr[i]
my.queue.push([ch,my.poss[i]])}}
if(my.ampmQ){var time=new Date();document.getElementById('ampm').innerHTML=(time.getHours()<12)?'AM':'PM'}}}}
requestAnimationFrame(anim);}}
function getTimeStr(){var time=new Date();var hours=time.getHours()
if(my.ampmQ){if(hours>12)hours-=12
if(hours==0){hours='12'}else if(hours<10){hours=' '+hours;}}else{if(hours<10){hours=' '+hours;}}
var minutes=time.getMinutes().toString();if(minutes.length==1){minutes='0'+minutes;}
var seconds=time.getSeconds().toString();if(seconds.length==1){seconds='0'+seconds;}
var timeStr=''
if(my.secQ){timeStr=hours+':'+minutes+':'+seconds}else{timeStr=hours+':'+minutes+'   '}
return timeStr}
function expandShapes(c,x0,y0){var j=shapes.length
var x1=0,x2=0,x3=0;var y1=0,y2=0,y3=0;var CharArr=my.charArr[c]
if(CharArr!=undefined){var Pnts=0;for(var k=0;k<CharArr.length;k++){if(CharArr[k][2]==1){if(Pnts>1){shapes[j]="line";shapes[j]+="_"+(x2+x3)/2+"_"+(y2+y3)/2;shapes[j]+="_"+x3+"_"+y3;j++;}
Pnts=0;}
x1=x2;y1=y2;x2=x3;y2=y3;x3=parseInt(CharArr[k][0])+parseInt(x0);y3=parseInt(CharArr[k][1])+parseInt(y0);Pnts++;if(Pnts==2){shapes[j]="line";shapes[j]+="_"+x2+"_"+y2;shapes[j]+="_"+(x2+x3)/2+"_"+(y2+y3)/2;j++;}
if(Pnts>2){shapes[j]="curve3";shapes[j]+="_"+(x1+x2)/2+"_"+(y1+y2)/2;shapes[j]+="_"+x2+"_"+y2;shapes[j]+="_"+(x2+x3)/2+"_"+(y2+y3)/2;j++;}
if(Pnts>1){shapes[j]="line";shapes[j]+="_"+(x2+x3)/2+"_"+(y2+y3)/2;shapes[j]+="_"+x3+"_"+y3;j++;}}}}
function drawIt(ShapeStr){if(ShapeStr==undefined)return;var shapeData=ShapeStr.split("_");var zoom=my.zoom
var shapeType=shapeData[0]
switch(shapeType){case "curve3":break;case "to":if(g.globalAlpha<0.9){break;}
default:if(!my.strokedQ){g.stroke();my.strokedQ=true;}}
switch(shapeType){case "speed":my.speed=shapeData[1];break;case "clr":var clr=shapeData[1]
clr=clr.replace("0x","#")
g.strokeStyle=clr;g.lineJoin="round";break;case "thk":var thk=shapeData[1];if(parseInt(thk)>10){g.lineCap="butt";}else{g.lineCap="round";}
g.lineWidth=thk;g.lineJoin="round";break;case "alp":g.globalAlpha=parseInt(shapeData[1])/100;break;case "lvl":setLvl(shapeData[1]);break;case "line":g.beginPath();g.moveTo(shapeData[1]*zoom,shapeData[2]*zoom)
g.lineTo(shapeData[3]*zoom,shapeData[4]*zoom)
my.prevX=shapeData[3]*zoom;my.prevY=shapeData[4]*zoom;if(g.globalAlpha>=0.9){placeBrush("pencil",shapeData[3]*zoom,shapeData[4]*zoom);}else{placeBrush("brush",shapeData[3]*zoom,shapeData[4]*zoom);}
my.strokedQ=false;break;case "rect":g.beginPath();g.fillStyle='white'
g.rect(shapeData[1]*zoom,shapeData[2]*zoom,shapeData[3]*zoom,shapeData[4]*zoom)
g.fill();break;case "curve3":if(!my.strokedQ){g.beginPath();g.moveTo(shapeData[1]*zoom,shapeData[2]*zoom);}else{g.lineTo(shapeData[1]*zoom,shapeData[2]*zoom);}
g.quadraticCurveTo(shapeData[3]*zoom,shapeData[4]*zoom,shapeData[5]*zoom,shapeData[6]*zoom)
g.stroke();break;case "to":if(g.globalAlpha>=0.9){g.beginPath();g.moveTo(my.prevX,my.prevY);g.lineTo(shapeData[1]*zoom,shapeData[2]*zoom);placeBrush("pencil",shapeData[1]*zoom,shapeData[2]*zoom);my.prevX=shapeData[1]*zoom;my.prevY=shapeData[2]*zoom;g.stroke();my.strokedQ=true;}else{g.lineTo(shapeData[1]*zoom,shapeData[2]*zoom);placeBrush("brush",shapeData[1]*zoom,shapeData[2]*zoom);my.strokedQ=false;}
break;case "bubble":drawBubble(g,shapeData[1]*zoom,shapeData[2]*zoom,shapeData[3]*zoom,shapeData[4]*zoom,shapeData[5]);placeBrush("none",0,0);break;case "dot":drawDot(g,shapeData[1]*zoom,shapeData[2]*zoom);placeBrush("pencil",shapeData[1]*zoom,shapeData[2]*zoom);break;case "size":case "start":case "script=":break;default:}
return shapeType;}
function placeBrush(typ,x,y){switch(typ){case "pencil":my.pencilEl.style.left=parseInt(x)+'px';my.pencilEl.style.top=parseInt(y)+'px';my.pencilEl.style.visibility="visible";my.brushEl.style.visibility="hidden";break;case "brush":my.brushEl.style.left=(parseInt(x)+0)+'px';my.brushEl.style.top=(parseInt(y)-50)+'px';my.brushEl.style.visibility="visible";my.pencilEl.style.visibility="hidden";break;case "none":my.pencilEl.style.visibility="hidden";my.brushEl.style.visibility="hidden";break;}}
function loadChars(){my.charArr={"a":[[16,-14,1],[12,-16],[7,-15],[3,-11],[2,-5],[3,2],[7,5],[11,4],[14,0],[16,-7],[18,-13],[17,-9],[16,-5],[18,3],[20,7]],"b":[[10,-38,1],[9,-34],[8,-29],[7,-24],[6,-19],[5,-11],[4,-7],[3,-1],[3,4],[0,-14,1],[4,-17],[8,-19],[14,-19],[16,-14],[15,-8],[13,-4],[10,1],[5,3],[1,4]],"c":[[12,-15,1],[7,-15],[2,-11],[0,-6],[0,-1],[2,3],[7,4],[11,2],[15,0]],"d":[[14,-13,1],[10,-14],[5,-14],[1,-10],[0,-4],[1,0],[5,3],[10,1],[13,-3],[14,-7],[15,-11],[16,-15],[17,-19],[18,-23],[20,-29],[21,-34],[19,-28],[17,-22],[16,-17],[16,-12],[16,-4],[17,1],[21,5],[25,4]],"e":[[1,-8,1],[5,-7],[11,-9],[14,-14],[13,-18],[8,-18],[3,-13],[0,-8],[0,-3],[4,1],[7,4],[12,2],[16,-1]],"f":[[1,10,1],[0,16],[0,21],[2,26],[6,27],[11,23],[13,19],[14,15],[14,8],[14,-1],[14,-7],[15,-13],[16,-17],[21,-18],[24,-15],[10,-1,1],[16,-3],[22,-4]],"g":[[14,-12,1],[10,-13],[4,-8],[1,-2],[1,3],[4,7],[8,8],[14,2],[16,-4],[17,-8],[18,-14],[17,-9],[17,-4],[16,4],[15,10],[15,16],[13,22],[11,28],[7,31],[2,27],[0,22]],"h":[[4,-36,1],[3,-29],[3,-21],[3,-15],[3,-9],[2,-5],[1,-1],[0,4],[3,-3],[4,-8],[7,-12],[10,-15],[15,-16],[18,-10],[18,-2],[17,5]],"i":[[2,-17,1],[2,-12],[1,-7],[1,-2],[1,3],[0,7]],"j":[[14,-18,1],[14,-9],[14,-3],[14,3],[13,8],[13,13],[12,17],[11,21],[9,26],[4,26],[1,22],[0,17]],"k":[[6,-37,1],[4,-28],[3,-22],[2,-15],[1,-10],[1,-3],[0,1],[3,-6,1],[9,-11],[13,-16],[15,-20],[3,-6,1],[7,-4],[10,-1],[14,2]],"l":[[3,-33,1],[3,-25],[2,-19],[2,-14],[1,-9],[1,-3],[0,1]],"m":[[0,-18,1],[0,-11],[0,-4],[0,2],[2,-6],[4,-10],[6,-15],[10,-16],[11,-10],[11,-3],[12,2],[13,-3],[14,-7],[16,-13],[19,-16],[23,-18],[25,-12],[25,-7],[25,0],[24,4]],"n":[[2,-18,1],[2,-10],[2,-4],[1,0],[0,4],[2,-1],[2,-5],[5,-12],[8,-15],[13,-16],[14,-12],[14,-5],[14,1],[13,5]],"o":[[12,-15,1],[8,-16],[4,-13],[1,-9],[0,-4],[1,0],[5,2],[11,0],[14,-4],[15,-8],[15,-14],[12,-17]],"p":[[10,-16,1],[8,-7],[7,-1],[6,6],[5,12],[4,16],[3,20],[1,25],[0,29],[2,-9,1],[7,-11],[10,-14],[15,-17],[20,-16],[22,-11],[20,-4],[16,1],[11,3],[6,3]],"q":[[14,-15,1],[9,-15],[5,-14],[2,-11],[0,-6],[1,1],[6,3],[10,-1],[14,-7],[16,-13],[13,-5],[12,1],[11,5],[9,13],[8,19],[6,24],[5,29],[8,23],[10,19],[13,13],[15,9]],"r":[[3,-18,1],[2,-13],[2,-7],[1,0],[0,5],[2,0],[3,-5],[5,-9],[7,-13],[11,-15],[13,-11]],"s":[[17,-13,1],[15,-17],[9,-16],[5,-13],[6,-9],[10,-7],[14,-6],[16,-2],[15,2],[10,4],[5,4],[1,2],[0,-2]],"t":[[12,-36,1],[10,-30],[9,-25],[8,-21],[7,-16],[6,-8],[6,-2],[7,2],[12,4],[15,0],[0,-17,1],[6,-14],[11,-14],[16,-16]],"u":[[3,-15,1],[0,-8],[0,0],[1,5],[6,4],[10,-2],[13,-8],[15,-12],[17,-17],[15,-12],[14,-7],[13,-3],[13,3],[15,7],[22,5]],"v":[[0,-16,1],[1,-11],[2,-6],[3,0],[3,5],[7,-1],[10,-6],[12,-10],[14,-14],[16,-18]],"w":[[7,-20,1],[4,-16],[1,-9],[0,-4],[0,1],[4,2],[7,-3],[9,-8],[11,-3],[12,2],[17,2],[20,-2],[22,-7],[23,-13],[22,-17],[21,-21]],"x":[[0,-13,1],[5,-13],[8,-10],[7,-4],[4,0],[0,3],[17,-13,1],[12,-12],[8,-9],[6,-5],[7,-1],[10,3],[16,4]],"y":[[9,-15,1],[7,-10],[6,-6],[7,0],[12,1],[15,-2],[19,-8],[20,-14],[19,-9],[18,-4],[17,4],[16,9],[15,13],[13,21],[11,25],[7,28],[2,25],[1,21],[0,16],[2,10]],"z":[[2,-15,1],[5,-14],[9,-14],[12,-14],[14,-15],[18,-15],[17,-12],[14,-9],[11,-7],[9,-4],[6,-3],[4,0],[2,1],[4,1],[6,0],[10,0],[14,0],[17,1],[19,1],[22,2]],"z1":[[2,-10,1],[5,-14],[9,-17],[13,-16],[12,-10],[9,-6],[12,-3],[14,2],[12,8],[10,14],[8,19],[6,23],[3,26],[0,23],[1,17],[5,10],[9,5],[14,0],[18,-4],[21,-7]],"A":[[2,3,1],[10,-31],[10,-31,1],[18,3],[3,-9,1],[15,-9]],"R":[[2,-20,1],[1,3],[3,-6,1],[9,-8],[13,-14],[14,-16],[11,-22],[0,-22],[3,-8,1],[7,-4],[10,-1],[14,2]],"V":[[2,-31,1],[10,3],[10,3,1],[18,-30]],"²":[[1,-20,1],[4,-22],[7,-22],[9,-21],[8,-16],[5,-12],[2,-10],[6,-11],[9,-10],[12,-10]],'1':[[4,-13,1],[11,-18],[15,-23],[13,-12],[12,-5],[11,5]],'2':[[0,-15,1],[5,-20],[11,-22],[15,-18],[14,-7],[8,0],[1,3],[9,1],[15,3],[22,5]],'3':[[0,-13,1],[7,-18],[13,-22],[17,-17],[14,-9],[8,-5],[14,-6],[20,-4],[17,3],[12,7],[5,7],[0,3]],'4':[[11,-21,1],[8,-13],[7,-6],[4,-1],[0,5],[5,1],[12,-1],[20,-1],[14,-10,1],[14,2],[12,9]],'5':[[7,-21,1],[5,-10],[14,-10],[18,-5],[14,2],[8,6],[0,3],[7,-21,1],[12,-20],[18,-21]],'6':[[14,-21,1],[11,-20],[5,-16],[3,-9],[0,-2],[1,5],[7,6],[12,2],[15,-5],[9,-7],[3,-6]],'7':[[0,-21,1],[8,-20],[20,-21],[18,-14],[13,-6],[8,-1],[4,4]],'8':[[18,-21,1],[11,-21],[5,-19],[6,-14],[11,-10],[15,-5],[15,3],[9,8],[3,6],[0,1],[5,-5],[10,-10],[16,-15],[19,-20],[11,-21]],'9':[[0,6,1],[5,4],[9,0],[13,-4],[16,-12],[19,-17],[16,-22],[9,-22],[5,-19],[4,-14],[8,-9],[13,-7]],'0':[[14,-18,1],[9,-19],[4,-16],[1,-10],[0,-4],[1,3],[5,7],[10,5],[16,0],[17,-6],[18,-12],[14,-20]],"div":[[0,-4.2,1],[5,-5.2],[10,-4.2],[16,-4.2],[21,-3.2],[26,-4.2],[11,-15,1],[9,-13],[11,-11],[13,-13],[11,-15],[12,3,1],[10,5],[12,7],[14,5],[12,3]],".":[[0,0,1],[-2,2],[0,4],[2,2],[0,0]],",":[[1,1,1],[-1,-1],[1,-2],[2,-1],[-1,5]],":":[[2,0,1],[0,2],[2,4],[4,2],[2,0],[2,-10,1],[0,-12],[2,-14],[4,-12],[2,-10]],"+":[[0,-5,1],[4,-6],[10,-6],[20,-6],[11,-14,1],[10,-10],[9,-4],[9,1],[8,5]],"-":[[0,-5,1],[5,-6],[12,-6],[17,-7]],"*":[[0,5,1],[4,1],[7,-2],[11,-7],[14,-10],[17,-14],[2,-17,1],[5,-12],[8,-8],[11,-2],[16,5]],"/":[[0,4,1],[4,0],[7,-4],[10,-7],[13,-11],[17,-15]],"=":[[0,-9,1],[8,-8],[20,-8],[24,-8],[0,-1,1],[6,-1],[22,-1]],"≈":[[0,-5,1],[7,-9],[13,-8],[17,-4],[24,-8],[0,3,1],[6,-2],[12,-2],[17,3],[24,-1]],"(":[[8,-27,1],[5,-23],[3,-17],[1,-10],[0,-4],[0,3],[1,8],[3,12],[5,16]],")":[[1,-26,1],[5,-23],[7,-19],[9,-13],[9,-7],[8,0],[7,4],[5,9],[3,13],[0,16]]," ":[[0,-9,1],[0,-9]]}}