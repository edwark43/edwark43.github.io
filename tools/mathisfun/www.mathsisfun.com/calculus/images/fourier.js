var w,h,el,ratio,g,coords,my={};function fourierMain(){var version='0.72';w=550;h=450;my.svgQ=true;graphLt=0;graphTp=0;graphWd=w-20;graphHt=h-130;coords=new Coords(graphLt,graphTp,graphWd,graphHt,-4,-2,4,2,true);currZoom=1;my.clrs=["#ff0000","#0000ff","#ff9900","#00ff00","#ffff00","#660066","#99ff00","#0099ff","#00ff99","#9900ff","#ff0099","#006666","#666600","#990000","#009999","#999900","#003399","#ff00ff","#993333","#330099"];var s=''
s+=`<div class="js" style="position:relative; width: ${w}px; height: ${h}px; border-radius: 10px;  margin:auto; display:block; ">`
s+='<div style="text-align: right; font-size: 14px;">';s+='<div style="font: 11px Arial; color: #6600cc;  text-align:right;">&copy; 2020 MathsIsFun.com  v'+version+' </div>';s+='<button id="sumBtn" style=" " class="btn hi"  onclick="toggleSum()" >Sum</button>';s+='<button style=" " class="btn"  onclick="doExample()" >Example</button>';s+='<button style=" " class="btn"  onclick="histpop(0)" >History</button>';s+='<button style=" " class="btn"  onclick="canvasPrint()" >Print</button>';s+='<button style=" " class="btn"  onclick="canvasSave()" >Save</button>';if(my.svgQ){s+='<button style=" " class="btn"  onclick="histpop(1)" >SVG</button>';}
s+='</div>';s+=getPopHTML();s+='<div style="position:relative; margin-top: -30px;">';s+='<input id="nEnd" class="input" style="position:absolute; left:30px; top:10px; width:40px; font: bold 16px Arial; text-align:center;  z-index:2;" value="10" onkeyup="redraw()" />';s+='<div style="position:absolute; left:30px; top:20px; font: 80px Serif; text-align:center; z-index:1;" >&Sigma;</div>';s+='<div style="position:absolute; left:5px; top:104px; font: bold 16px Arial;  text-align:center;" >n=</div>';s+='<input id="nStt" class="input" style="position:absolute; left:30px; top:100px; width:40px; font: bold 16px Arial;  text-align:center;  z-index:2;" value="1" onkeyup="redraw()" />';s+='<textarea id="q" class="input" style="position:absolute; left:80px; top:40px; width:460px; height:50px; font: 22px Arial; text-align:left; z-index:2;" onkeyup="redraw()" >n^2</textarea>';s+='</div>';var ypos=125;s+='<div style="position:absolute; left:135px; top:'+ypos+'px;">';s+='<div style="display:inline-block; color:black; font: 15px Arial; z-index: 2;">Zoom:</div>';s+='<input type="range" id="r1"  value="0.5" min="0" max="1" step=".01"  style="display:inline-block; z-index:2;  width:200px; height:17px; border: none;" oninput="onZoomChg(0,this.value)" onchange="onZoomChg(1,this.value)" />';s+='<button class="btn"  onclick="zoomReset()" >Reset</button>';s+='</div>';var ypos=90;s+='<canvas id="gfx0" width="'+coords.width+'" height="'+coords.height+'" style="position:absolute; left:5px; top:'+ypos+'px; z-index:1; margin-top: 70px; margin-left: 5px; background-color: #ffffff; border: 1px solid black;"></canvas>';s+='<canvas id="gfx1" width="'+coords.width+'" height="'+coords.height+'" style="position:absolute; left:5px; top:'+ypos+'px; z-index:1; margin-top: 70px; margin-left: 5px; border: 1px solid black;"></canvas>';s+='</div>';document.write(s);el=document.getElementById('gfx0');ratio=2;el.width=coords.width*ratio;el.height=coords.height*ratio;el.style.width=coords.width+"px";el.style.height=coords.height+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);var el2=document.getElementById('gfx1');ratio=3;el2.width=coords.width*ratio;el2.height=coords.height*ratio;el2.style.width=coords.width+"px";el2.style.height=coords.height+"px";hists=[];lastHist="?";lastHistTime=0;my.exs=[["sin(n*x)/n",1,20,"Sawtooth"],["sin(n*x)*(-1)^n/n",1,20,"Sawtooth"],["sin((2n-1)*x)/(2n-1)",1,10,"Square Wave -pi to pi"],["4/pi*sin((2n-1)*x*pi)/(2n-1)",1,10,"Square Wave -1 to 1"],["sin(n*x)*0.1",1,20,"Pulse"],["sin((2n-1)*x)*(-1)^n/(2n-1)^2",1,10,"Triangle"],["cos((2n-1)*x)/(2n-1)",1,10,""],["sin((n-2)*x)/n",1,10,""],["cos(n*x)/(4n^2-1)+sin(n*x)/n",1,10,""]];exNo=0;parser=new Parser();this.radsQ=true;my.sumQ=false;toggleSum();dragging=false;downX=0;downY=0;prevX=0;prevY=0;el2.addEventListener("mousedown",onMouseDown,false);window.addEventListener("mousemove",onMouseMove,false);window.addEventListener("mouseup",onMouseUp,false);el2.addEventListener('touchstart',ontouchstart,false);window.addEventListener('touchmove',ontouchmove,false);window.addEventListener('touchend',ontouchend,false);document.getElementById('q').value=my.exs[0][0];my.title='';redraw();}
function getPopHTML(){var s='';s+='<div id="histpop" style="position:absolute; left:-450px; top:40px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; ">';s+='<textarea  id="histbox" value="ddd" style="width: 500px; height: 120px; font: 16px Arial; border: 1px solid red; border-radius: 9px; background-color: #eeeeff; display: block;">';s+='</textarea >';s+='<div style="float:left; margin: 0 0 5px 10px;">';s+='<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='</div>';s+='</div>';return s;}
function doExample(){exNo=(++exNo)%my.exs.length;var ex=my.exs[exNo];document.getElementById('q').value=ex[0];document.getElementById('nStt').value=ex[1];document.getElementById('nEnd').value=ex[2];my.title=ex[3];redraw();my.title='';}
function getHist(){var s="";lastHistTime=0;redraw();for(var i=0;i<hists.length;i++){s+=hists[i]+"\n";}
return s;}
function toggleSum(){my.sumQ=!my.sumQ;toggleBtn('sumBtn',my.sumQ);redraw();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function ontouchstart(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseDown(evt)}
function ontouchmove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseMove(evt);evt.preventDefault();}
function ontouchend(evt){dragging=false;}
function onMouseDown(evt){var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);downX=mouseX;downY=mouseY;prevX=mouseX;prevY=mouseY;dragging=true;my.dragPtQ=false;if(my.ptsQ){for(i=0;i<my.pts.length;i++){var pt=my.pts[i];if(hitTest(pt,mouseX,mouseY)){dragNo=i;my.dragPtQ=true;dragHoldX=mouseX-pt.getPxX();dragHoldY=mouseY-pt.getPxY();dragIndex=i;}}}
if(dragging){if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",onMouseMove,false);}
redraw();}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function onMouseUp(evt){var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);if(my.dragPtQ){posX=mouseX-dragHoldX;posX=(posX<my.minX)?my.minX:((posX>my.maxX)?my.maxX:posX);posY=mouseY-dragHoldY;posY=(posY<my.minY)?my.minY:((posY>my.maxY)?my.maxY:posY);var pt=my.pts[dragIndex];pt.setPx(posX,posY);pt.snap(my.fnLine);drawPts();}else{if(Math.abs(mouseX-downX)<2&&Math.abs(mouseY-downY)<2){coords.newCenter(mouseX,mouseY);redraw();}}
my.dragPtQ=false;dragging=false;}
function onMouseMove(evt){var bRect=el.getBoundingClientRect();var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);if(dragging){if(my.dragPtQ){posX=mouseX-dragHoldX;posX=(posX<my.minX)?my.minX:((posX>my.maxX)?my.maxX:posX);posY=mouseY-dragHoldY;posY=(posY<my.minY)?my.minY:((posY>my.maxY)?my.maxY:posY);var pt=my.pts[dragIndex];pt.setPx(posX,posY);pt.snap(my.fnLine);drawPts();}else{var moveX=prevX-mouseX;var moveY=mouseY-prevY;if(Math.abs(moveX)>1||Math.abs(moveY)>1){coords.drag(moveX,moveY);redraw();prevX=mouseX;prevY=mouseY;}}}}
function onZoomChg(n,v){var scaleBy=(v*2+0.01)/currZoom;coords.scale(scaleBy);currZoom*=scaleBy;if(n==1){currZoom=1;document.getElementById('r1').value=0.5;}
redraw();}
function zoomReset(){coords=new Coords(graphLt,graphTp,graphWd,graphHt,-5,-3,5,3,true);redraw();}
function redraw(){var func=document.getElementById('q').value;parser.radiansQ=this.radsQ;parser.newParse(func);var nStt=document.getElementById('nStt').value<<0;var nEnd=document.getElementById('nEnd').value<<0;var maxNRange=10000;if(nEnd-nStt>maxNRange){document.getElementById('calc').innerHTML="n range > "+maxNRange.toString();document.getElementById('a').innerHTML='';return;}
var hist=nStt.toString()+" to "+nEnd.toString()+"  of  "+func;if(hist!=lastHist){if(lastHistTime+2000<Date.now()){hists.push(hist);lastHist=hist;}
lastHistTime=Date.now();}
g.clearRect(0,0,el.width,el.height);var graph=new Graph(g,coords);graph.drawGraph();g.lineWidth=1.5;var start=new Date().getTime();g.fillStyle='red';g.font='20px Arial';g.textAlign='left';g.fillText(my.title,10,25);g.fill();var pts=[];for(var i=nStt;i<=nEnd;i++){parser.setVarVal('n',i);lineSum(pts,my.sumQ);if(my.sumQ){if(i==nEnd){g.strokeStyle=my.clrs[0];linePlot(pts);}}else{if(i<my.clrs.length){g.strokeStyle=my.clrs[i];linePlot(pts);}}}
var end=new Date().getTime();var time=end-start;}
function histpop(t){console.log("editpop");var pop=document.getElementById('histpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='100px';switch(t){case 0:document.getElementById('histbox').value=getHist();break;case 1:my.svgQ=true;my.svg=new SVG();redraw();var graph=new Graph(g,coords);graph.makeSVG();var s=my.svg.getText();document.getElementById('histbox').value=s;my.svgQ=false;break;default:}}
function editYes(){var pop=document.getElementById('histpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function Parser(){this.operators="+-*(/),^.";this.rootNode;this.tempNode=[];this.Variable="x";this.errMsg="";this.radiansQ=true;this.vals=[];for(var i=0;i<26;i++){this.vals[i]=0;}
this.reset();}
Parser.prototype.setVarVal=function(varName,newVal){switch(varName){case "x":this.vals[23]=newVal;break;case "y":this.vals[24]=newVal;break;case "z":this.vals[25]=newVal;break;default:if(varName.length==1){this.vals[varName.charCodeAt(0)-'a'.charCodeAt(0)]=newVal;}}};Parser.prototype.getVal=function(){return(this.rootNode.walk(this.vals));};Parser.prototype.newParse=function(s){this.reset();s=s.replace(/(\r\n|\n|\r)/gm,"");s=s.split(" ").join("");s=s.split("[").join("(");s=s.split("]").join(")");s=s.replace(/\u2212/g,'-');s=s.replace(/\u00F7/g,'../index.html');s=s.replace(/\u00D7/g,'*');s=s.replace(/\u00B2/g,'^2');s=s.replace(/\u00B3/g,'^3');s=s.replace(/\u221a/g,'sqrt');s=this.fixParentheses(s);s=this.fixUnaryMinus(s);s=this.fixFactorial(s);s=this.fixImplicitMultply(s);this.rootNode=this.parse(s);};Parser.prototype.fixFactorial=function(s){var currPos=1;do{var chgQ=false;var fPos=s.indexOf("!",currPos);if(fPos>0){var numEnd=fPos-1;var numStt=numEnd;var cnum=s.charAt(numStt);if(cnum=='n'){}else{do{var cnum=s.charAt(numStt);numStt--;}while(cnum>="0"&&cnum<="9");numStt+=2;}
if(numStt<=numEnd){var numStr=s.substr(numStt,numEnd-numStt+1);numStr='fact('+numStr+')';s=s.substr(0,numStt)+numStr+s.substr(numEnd+2);currPos=fPos+numStr.length;chgQ=true;}}}while(chgQ);return s;}
Parser.prototype.fixParentheses=function(s){var sttParCount=0;var endParCount=0;for(var i=0;i<s.length;i++){if(s.charAt(i)=="(")sttParCount++;if(s.charAt(i)==")")endParCount++;}
while(sttParCount<endParCount){s="("+s;sttParCount++;}
while(endParCount<sttParCount){s+=")";endParCount++;}
return(s);};Parser.prototype.fixUnaryMinus=function(s){var x=s+"\n";var y="";var OpenQ=false;var prevType="(";var thisType="";for(var i=0;i<s.length;i++){var c=s.charAt(i);if(c>="0"&&c<="9"){thisType="N";}else{if(this.operators.indexOf(c)>=0){if(c=="-"){thisType="-";}else{thisType="O";}}else{if(c=="."||c==this.Variable){thisType="N";}else{thisType="C";}}
if(c=="("){thisType="(";}
if(c==")"){thisType=")";}}
x+=thisType;if(prevType=="("&&thisType=="-"){y+="0";}
if(OpenQ){switch(thisType){case "N":break;default:y+=")";OpenQ=false;}}
if(prevType=="O"&&thisType=="-"){y+="(0";OpenQ=true;}
y+=c;prevType=thisType;}
if(OpenQ){y+=")";OpenQ=false;}
return(y);};Parser.prototype.fixImplicitMultply=function(s){var x=s+"\n";var y="";var prevType="?";var prevName="";var thisType="?";var thisName="";for(var i=0;i<s.length;i++){var c=s.charAt(i);if(c>="0"&&c<="9"){thisType="N";}else{if(this.operators.indexOf(c)>=0){thisType="O";thisName="";}else{thisType="C";thisName+=c;}
if(c=="("){thisType="(";}
if(c==")"){thisType=")";}}
x+=thisType;if(prevType=="N"&&thisType=="C"){y+="*";thisName="";}
if(prevType=="N"&&thisType=="("){y+="*";}
if(prevType==")"&&thisType=="("){y+="*";}
if(thisType=="("){switch(prevName){case "i":case "pi":case "e":case "a":case this.Variable:y+="*";break;}}
y+=c;prevType=thisType;prevName=thisName;}
return(y);};Parser.prototype.reset=function(){this.tempNode=[];this.errMsg="";};Parser.prototype.parse=function(s){if(s==""){return new MathNode("real","0",this.radiansQ);}
if(isNumeric(s)){return new MathNode("real",s,this.radiansQ);}
if(s.charAt(0)=="$"){if(isNumeric(s.substr(1))){return this.tempNode[Number(s.substr(1))];}}
var sLo=s.toLowerCase();if(sLo.length==1){if(sLo>="a"&&sLo<="z"){return new MathNode("var",sLo,this.radiansQ);}}
switch(sLo){case "pi":return new MathNode("var",sLo,this.radiansQ);}
var bracStt=s.lastIndexOf("(");if(bracStt>-1){var bracEnd=s.indexOf(")",bracStt);if(bracEnd<0){this.errMsg+="Missing ')'\n";return new MathNode("real","0",this.radiansQ);}
var isParam=false;if(bracStt==0){isParam=false;}else{var prefix=s.substr(bracStt-1,1);isParam=this.operators.indexOf(prefix)<=-1;}
if(!isParam){this.tempNode.push(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)));return this.parse(s.substr(0,bracStt)+"$"+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1));}else{var startM=-1;for(var u=bracStt-1;u>-1;u--){var found=this.operators.indexOf(s.substr(u,1));if(found>-1){startM=u;break;}}
var nnew=new MathNode("func",s.substr(startM+1,bracStt-1-startM),this.radiansQ);nnew.addchild(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)));this.tempNode.push(nnew);return this.parse(s.substr(0,startM+1)+"$"+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1));}}
var k;var k1=s.lastIndexOf("+");var k2=s.lastIndexOf("-");if(k1>-1||k2>-1){if(k1>k2){k=k1;var nnew=new MathNode("op","add",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}else{k=k2;nnew=new MathNode("op","sub",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}}
k1=s.lastIndexOf("*");k2=s.lastIndexOf("../index.html");if(k1>-1||k2>-1){if(k1>k2){k=k1;var nnew=new MathNode("op","mult",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}else{k=k2;var nnew=new MathNode("op","div",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}}
k=s.indexOf("^");if(k>-1){var nnew=new MathNode("op","pow",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}
if(isNumeric(s)){return new MathNode("real",s,this.radiansQ);}else{if(s.length==0){return new MathNode("real","0",this.radiansQ);}else{this.errMsg+="'"+s+"' is not a number.\n";return new MathNode("real","0",this.radiansQ);}}};function MathNode(typ,val,radQ){this.tREAL=0;this.tVAR=1;this.tOP=2;this.tFUNC=3;this.radiansQ=true;this.setNew(typ,val,radQ);}
MathNode.prototype.setNew=function(typ,val,radQ){this.radiansQ=typeof radQ!=='undefined'?radQ:true;this.clear();switch(typ){case "real":this.typ=this.tREAL;this.r=Number(val);break;case "var":this.typ=this.tVAR;this.v=val;break;case "op":this.typ=this.tOP;this.op=val;break;case "func":this.typ=this.tFUNC;this.op=val;break;}
return(this);};MathNode.prototype.clear=function(){this.r=1;this.v="";this.op="";this.child=[];this.childCount=0;};MathNode.prototype.addchild=function(n){this.child.push(n);this.childCount++;return(this.child[this.child.length-1]);};MathNode.prototype.getLevelsHigh=function(){var lvl=0;for(var i=0;i<this.childCount;i++){lvl=Math.max(lvl,this.child[i].getLevelsHigh());}
return(lvl+1);};MathNode.prototype.isLeaf=function(){return(this.childCount==0);};MathNode.prototype.getLastBranch=function(){if(this.isLeaf()){return(null);}
for(var i=0;i<this.childCount;i++){if(!this.child[i].isLeaf()){return(this.child[i].getLastBranch());}}
return(this);};MathNode.prototype.fmt=function(htmlQ){htmlQ=typeof htmlQ!=='undefined'?htmlQ:true;var s="";if(this.typ==this.tOP){switch(this.op.toLowerCase()){case "add":s="+";break;case "sub":s=htmlQ?"&minus;":"-";break;case "mult":s=htmlQ?"&times;":"x";break;case "div":s=htmlQ?"&divide;":"/";break;case "pow":s="^";break;default:s=this.op;}}
if(this.typ==this.tREAL){s=this.r.toString();}
if(this.typ==this.tVAR){if(this.r==1){s=this.v;}else{if(this.r!=0){s=this.r+this.v;}}}
if(this.typ==this.tFUNC){s=this.op;}
return s;};MathNode.prototype.walkFmt=function(){var s=this.walkFmta(true,"");s=s.replace("Infinity","Undefined");return s;};MathNode.prototype.walkFmta=function(noparq,prevop){var s="";if(this.childCount>0){var parq=false;if(this.op=="add")parq=true;if(this.op=="sub")parq=true;if(prevop=="div")parq=true;if(noparq)parq=false;if(this.typ==this.tFUNC)parq=true;if(this.typ==this.tOP){}else{s+=this.fmt(true);}
if(parq)s+="(";for(var i=0;i<this.childCount;i++){if(this.typ==this.tOP&&i>0)s+=this.fmt();s+=this.child[i].walkFmta(false,this.op);if(this.typ==this.tFUNC||(parq&&i>0)){s+=")";}}}else{s+=this.fmt();if(prevop=="sin"||prevop=="cos"||prevop=="tan"){if(this.radiansQ){s+=" rad";}else{s+="&deg;";}}}
return s;};MathNode.prototype.walkNodesFmt=function(level){var s="";for(var i=0;i<level;i++){s+="|   ";}
s+=this.fmt();s+="\n";for(i=0;i<this.childCount;i++){s+=this.child[i].walkNodesFmt(level+1);}
return s;};MathNode.prototype.walk=function(vals){if(this.typ==this.tREAL)return(this.r);if(this.typ==this.tVAR){switch(this.v){case "x":return(vals[23]);case "y":return(vals[24]);case "z":return(vals[25]);case "pi":return(Math.PI);case "e":return(Math.exp(1));case "a":return(vals[0]);case "n":return(vals[13]);default:return(0);}}
if(this.typ==this.tOP){var val=0;for(var i=0;i<this.childCount;i++){var val2=0;if(this.child[i]!=null)
val2=this.child[i].walk(vals);if(i==0){val=val2;}else{switch(this.op){case "add":val+=val2;break;case "sub":val-=val2;break;case "mult":val*=val2;break;case "div":val/=val2;break;case "pow":if(val2==2){val=val*val;}else{val=Math.pow(val,val2);}
break;default:}}}
return val;}
if(this.typ==this.tFUNC){var lhs=this.child[0].walk(vals);var angleFact=1;if(!this.radiansQ)angleFact=180/Math.PI;var val=0
switch(this.op){case "sin":val=Math.sin(lhs/angleFact);break;case "cos":val=Math.cos(lhs/angleFact);break;case "tan":val=Math.tan(lhs/angleFact);break;case "asin":val=Math.asin(lhs)*angleFact;break;case "acos":val=Math.acos(lhs)*angleFact;break;case "atan":val=Math.atan(lhs)*angleFact;break;case "sinh":val=(Math.exp(lhs)-Math.exp(-lhs))/2;break;case "cosh":val=(Math.exp(lhs)+Math.exp(-lhs))/2;break;case "tanh":val=(Math.exp(lhs)-Math.exp(-lhs))/(Math.exp(lhs)+Math.exp(-lhs));break;case "exp":val=Math.exp(lhs);break;case "log":val=Math.log(lhs)*Math.LOG10E;break;case "ln":val=Math.log(lhs);break;case "abs":val=Math.abs(lhs);break;case "deg":val=lhs*180./Math.PI;break;case "rad":val=lhs*Math.PI/180.;break;case "sign":if(lhs<0){val=-1;}else{val=1;}
break;case "sqrt":val=Math.sqrt(lhs);break;case "round":val=Math.round(lhs);break;case "int":val=Math.floor(lhs);break;case "floor":val=Math.floor(lhs);break;case "ceil":val=Math.ceil(lhs);break;case "fact":val=factorial(lhs);break;default:val=NaN;}
return val;}
return val;};function factorial(n){if(n<0)return NaN;if(n<2)return 1;n=n<<0;var i;i=n;var f=n;while(i-->2){f*=i;}
return f;}
function isNumeric(n){return!isNaN(parseFloat(n))&&isFinite(n);}
function lineSum(pts,sumQ){ptNumMin=0;ptNumMax=coords.width;for(var ptNum=0;ptNum<=ptNumMax;ptNum++){xPix=ptNum;xVal=coords.xStt+xPix*coords.xScale;parser.setVarVal("x",xVal);yVal=parser.getVal();yPix=coords.toYPix(yVal,false);if(!sumQ||typeof pts[ptNum]==='undefined'){pts[ptNum]=yVal;}else{pts[ptNum]+=yVal;}}}
function linePlot(pts){var breakQ=true;var yState=9;var line=[];for(var i=0,len=pts.length;i<len;i++){var yVal=pts[i];var xPix=i;xVal=coords.xStt+xPix*coords.xScale;yPix=coords.toYPix(yVal,false);var prevbreakQ=breakQ;breakQ=false;var prevyState=yState;yState=0;if(yVal<coords.yStt)yState=-1;if(yVal>coords.yEnd)yState=1;if(yVal==Number.NEGATIVE_INFINITY){yState=-1;yVal=coords.yStt-coords.yScale*10;}
if(yVal==Number.POSITIVE_INFINITY){yState=1;yVal=coords.yEnd+coords.yScale*10;}
breakQ=prevyState*yState!=0;if(isNaN(yVal)){yState=9;breakQ=true;}
yVal=Math.min(Math.max(coords.yStt-coords.yScale*10,yVal),coords.yEnd+coords.yScale*10);yPix=(coords.yEnd-yVal)/coords.yScale;if(breakQ){if(prevbreakQ){}else{if(yState<9){line.push([xPix,yPix]);}}}else{if(prevbreakQ){if(prevyState<9){line.push(0);line.push([prevxPix,prevyPix]);line.push([xPix,yPix]);}else{line.push(0);line.push([xPix,yPix]);}}else{line.push([xPix,yPix]);}}
prevxVal=xVal;prevxPix=xPix;prevyPix=yPix;}
if(my.svgQ)my.svg=new SVG();var sttQ=true;g.beginPath();for(var i=0,len=line.length;i<len;i++){var pt=line[i];if(pt==0){g.stroke();sttQ=true;}else{if(sttQ){g.beginPath();g.moveTo(pt[0],pt[1]);sttQ=false;}else{g.lineTo(pt[0],pt[1]);}}}
g.stroke();if(my.svgQ){sttQ=true;for(i=0,len=line.length;i<len;i++){var pt=line[i];if(pt==0){sttQ=true;}else{if(sttQ){my.svg.moveTo(pt[0],pt[1]);sttQ=false;}else{my.svg.lineTo(pt[0],pt[1]);}}}}}
function canvasSave(){var can=document.getElementById("gfx0");var dataUrl=can.toDataURL('image/png');var win=window.open();win.document.write("<img src='"+dataUrl+"'/>");win.document.location="#";}
function canvasPrint(){var can=document.getElementById("gfx0");var dataUrl=can.toDataURL('image/png');var win=window.open();win.document.write("<img src='"+dataUrl+"'/>");win.document.location="#";var isChrome=(window.navigator.userAgent.toLowerCase().indexOf("chrome")>-1);if(isChrome){win.focus();setTimeout(function(){win.focus();win.print();},500);}else{win.focus();win.print();win.close();}}
function Coords(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left;this.top=top;this.width=width;this.height=height;this.xStt=xStt;this.yStt=yStt;this.xEnd=xEnd;this.yEnd=yEnd;this.uniScaleQ=uniScaleQ;this.xLogQ=false;this.yLogQ=false;this.calcScale();}
Coords.prototype.calcScale=function(){if(this.xLogQ){if(this.xStt<=0)
this.xStt=1;if(this.xEnd<=0)
this.xEnd=1;}
if(this.yLogQ){if(this.yStt<=0)
this.yStt=1;if(this.yEnd<=0)
this.yEnd=1;}
var temp;if(this.xStt>this.xEnd){temp=this.xStt;this.xStt=this.xEnd;this.xEnd=temp;}
if(this.yStt>this.yEnd){temp=this.yStt;this.yStt=this.yEnd;this.yEnd=temp;}
var xSpan=this.xEnd-this.xStt;if(xSpan<=0)
xSpan=1e-9;this.xScale=xSpan/this.width;this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width;var ySpan=this.yEnd-this.yStt;if(ySpan<=0)
ySpan=1e-9;this.yScale=ySpan/this.height;this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height;if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){var newScale=Math.max(this.xScale,this.yScale);this.xScale=newScale;xSpan=this.xScale*this.width;var xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-xSpan/2;this.xEnd=xMid+xSpan/2;this.yScale=newScale;ySpan=this.yScale*this.height;var yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-ySpan/2;this.yEnd=yMid+ySpan/2;}};Coords.prototype.scale=function(factor,xMid,yMid){if(typeof xMid=='undefined')xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-(xMid-this.xStt)*factor;this.xEnd=xMid+(this.xEnd-xMid)*factor;if(typeof yMid=='undefined')yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-(yMid-this.yStt)*factor;this.yEnd=yMid+(this.yEnd-yMid)*factor;this.calcScale();};Coords.prototype.drag=function(xPix,yPix){this.xStt+=xPix*this.xScale;this.xEnd+=xPix*this.xScale;this.yStt+=yPix*this.yScale;this.yEnd+=yPix*this.yScale;this.calcScale();};Coords.prototype.newCenter=function(x,y){var xMid=this.xStt+x*this.xScale;var xhalfspan=(this.xEnd-this.xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;var yMid=this.yEnd-y*this.yScale;var yhalfspan=(this.yEnd-this.yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;this.calcScale();};Coords.prototype.fitToPts=function(pts,borderFactor){for(var i=0;i<pts.length;i++){var pt=pts[i];if(i==0){this.xStt=pt.x;this.xEnd=pt.x;this.yStt=pt.y;this.yEnd=pt.y;}else{this.xStt=Math.min(this.xStt,pt.x);this.xEnd=Math.max(this.xEnd,pt.x);this.yStt=Math.min(this.yStt,pt.y);this.yEnd=Math.max(this.yEnd,pt.y);}}
var xMid=(this.xStt+this.xEnd)/2;var xhalfspan=borderFactor*(this.xEnd-this.xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;var yMid=(this.yStt+this.yEnd)/2;var yhalfspan=borderFactor*(this.yEnd-this.yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;this.calcScale();};Coords.prototype.toXPix=function(val,useCornerQ){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(xStt))/this.xLogScale;}else{return this.left+((val-this.xStt)/this.xScale);}};Coords.prototype.toYPix=function(val){if(this.yLogQ){return this.top+(Math.log(yEnd)-Math.log(val))/this.yLogScale;}else{return this.top+((this.yEnd-val)/this.yScale);}};Coords.prototype.toPtVal=function(pt,useCornerQ){return new Pt(this.toXVal(pt.x,useCornerQ),this.toYVal(pt.y,useCornerQ));};Coords.prototype.toXVal=function(pix,useCornerQ){if(useCornerQ){return this.xStt+(pix-this.left)*this.xScale;}else{return this.xStt+pix*this.xScale;}};Coords.prototype.toYVal=function(pix,useCornerQ){if(useCornerQ){return this.yEnd-(pix-top)*this.yScale;}else{return this.yEnd-pix*this.yScale;}};Coords.prototype.getTicks=function(stt,span,ratio){var ticks=[];var inter=this.tickInterval(span/ratio,false);var tickStt=Math.ceil(stt/inter)*inter;var i=0;do{var tick=tickStt+i*inter;tick=Number(tick.toPrecision(8));ticks.push([tick,1]);i++;}while(tick<stt+span);inter=this.tickInterval(span/ratio,true);for(i=0;i<ticks.length;i++){var t=ticks[i][0];if(Math.abs(Math.round(t/inter)-(t/inter))<0.001){ticks[i][1]=0;}}
return ticks;};Coords.prototype.tickInterval=function(span,majorQ){var pow10=Math.pow(10,Math.floor(Math.log(span)*Math.LOG10E));var mantissa=span/pow10;if(mantissa>=5){if(majorQ){return(5*pow10);}else{return(1*pow10);}}
if(mantissa>=3){if(majorQ){return(2*pow10);}else{return(0.2*pow10);}}
if(mantissa>=1.4){if(majorQ){return(0.5*pow10);}else{return(0.2*pow10);}}
if(mantissa>=0.8){if(majorQ){return(0.5*pow10);}else{return(0.1*pow10);}}
if(majorQ){return(0.2*pow10);}else{return(0.1*pow10);}};function Graph(g,coords){this.g=g;this.coords=coords;this.xLinesQ=true;this.yLinesQ=true;this.xValsQ=true;this.yValsQ=true;this.skewQ=false;}
Graph.prototype.makeSVG=function(){this.hzAxisY=coords.toYPix(0);if(this.hzAxisY<0)this.hzAxisY=0;if(this.hzAxisY>coords.height)this.hzAxisY=coords.height;this.hzNumsY=this.hzAxisY+14;if(this.hzAxisY>coords.height-10)this.hzNumsY=coords.height-3;this.vtAxisX=coords.toXPix(0);if(this.vtAxisX<0)this.vtAxisX=0;if(this.vtAxisX>coords.width)this.vtAxisX=coords.width;this.vtNumsX=this.vtAxisX-5;if(this.vtAxisX<10)this.vtNumsX=20;var rect={x:{min:coords.toXPix(coords.xStt,false),max:coords.toXPix(coords.xEnd,false)},y:{min:coords.toYPix(coords.yStt,false),max:coords.toYPix(coords.yEnd,false)}};my.svg.moveTo(rect.x.min,this.hzAxisY);my.svg.lineTo(rect.x.max,this.hzAxisY);my.svg.moveTo(this.vtAxisX,rect.y.min);my.svg.lineTo(this.vtAxisX,rect.y.max);my.svg.moveTo(rect.x.min,rect.y.min);my.svg.lineTo(rect.x.max,rect.y.min);my.svg.lineTo(rect.x.max,rect.y.max);my.svg.lineTo(rect.x.min,rect.y.max);my.svg.lineTo(rect.x.min,rect.y.min);}
Graph.prototype.drawGraph=function(){this.hzAxisY=coords.toYPix(0);if(this.hzAxisY<0)this.hzAxisY=0;if(this.hzAxisY>coords.height)this.hzAxisY=coords.height;this.hzNumsY=this.hzAxisY+14;if(this.hzAxisY>coords.height-10)this.hzNumsY=coords.height-3;this.vtAxisX=coords.toXPix(0);if(this.vtAxisX<0)this.vtAxisX=0;if(this.vtAxisX>coords.width)this.vtAxisX=coords.width;this.vtNumsX=this.vtAxisX-5;this.vtNumsAlign='right';if(this.vtAxisX<30){this.vtNumsX=this.vtAxisX+4;this.vtNumsAlign='left';if(this.vtAxisX<0){this.vtNumsX=6;}}
if(coords.xLogQ){this.drawLinesLogX();}else{if(this.xLinesQ){this.drawHzLines();}}
if(coords.yLogQ){this.drawLinesLogY();}else{if(this.yLinesQ){this.drawVtLines();}}};Graph.prototype.drawVtLines=function(){var g=this.g;g.lineWidth=1;var ticks=coords.getTicks(coords.xStt,coords.xEnd-coords.xStt,graphWd/100);for(var i=0;i<ticks.length;i++){var tick=ticks[i];var xVal=tick[0];var tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.3)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
var xPix=coords.toXPix(xVal,false);g.beginPath();g.moveTo(xPix,coords.toYPix(coords.yStt,false));g.lineTo(xPix,coords.toYPix(coords.yEnd,false));g.stroke();if(tickLevel==0&&this.xValsQ){g.fillStyle="#0000ff";g.font="bold 12px Verdana";g.textAlign="center";g.fillText(xVal.toString(),xPix,this.hzNumsY);}}
if(this.skewQ)
return;g.lineWidth=1.5;g.strokeStyle="#ff0000";g.beginPath();g.moveTo(this.vtAxisX,coords.toYPix(coords.yStt,false));g.lineTo(this.vtAxisX,coords.toYPix(coords.yEnd,false));g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(this.vtAxisX,coords.toYPix(coords.yEnd),15,2,20,10,Math.PI/2,10,false);g.stroke();g.fill();};Graph.prototype.drawHzLines=function(){var g=this.g;g.lineWidth=1;var ticks=coords.getTicks(coords.yStt,coords.yEnd-coords.yStt,graphHt/100);for(var i=0;i<ticks.length;i++){var tick=ticks[i];var yVal=tick[0];var tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.3)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
var yPix=coords.toYPix(yVal,false);g.beginPath();g.moveTo(coords.toXPix(coords.xStt,false),yPix);g.lineTo(coords.toXPix(coords.xEnd,false),yPix);g.stroke();if(tickLevel==0&&this.yValsQ){g.fillStyle="#ff0000";g.font="bold 12px Verdana";g.textAlign=this.vtNumsAlign;g.fillText(yVal.toString(),this.vtNumsX,yPix+5);}}
if(this.skewQ)
return;g.lineWidth=2;g.strokeStyle="#0000ff";g.beginPath();g.moveTo(coords.toXPix(coords.xStt,false),this.hzAxisY);g.lineTo(coords.toXPix(coords.xEnd,false),this.hzAxisY);g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(coords.toXPix(coords.xEnd,false),this.hzAxisY,15,2,20,10,0,10,false);g.stroke();g.fill();};CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};function SVG(){this.lineWidth=1;this.lineClr='#000';this.lineAlpha='1';this.fillClr='#def';this.fillAlpha='0.2';this.inLineQ=false;this.inGroupQ=false;this.line=[];this.txt='';this.ftrStr="</svg>";this.txt=this.getHeader();}
SVG.prototype.getHeader=function(){var s="";s+='<?xml version=\"1.0\" standalone=\"no\"?>\n';s+='<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">\n';s+='<svg width="1000px" height="600px" xmlns="http://www.w3.org/2000/svg">\n';s+="<desc>SVG Output</desc>\n";return s;};SVG.prototype.lineStyle=function(thick,clr,alpha){if(thick==0)thick=0.2;this.lineWidth=thick;this.lineClr=clr;};SVG.prototype.beginFill=function(clr,alpha){fillClr=clr;};SVG.prototype.endFill=function(){};SVG.prototype.moveTo=function(x,y){if(this.line.length>1)this.polyline();this.line.push([x,y]);};SVG.prototype.lineTo=function(x,y){this.line.push([x,y]);};SVG.prototype.drawRect=function(x,y,width,height){txt+='<rect x="'+x+'px" y="'+y+'px" width="'+width+'px" height="'+height+'px" style="'+getStyle()+'"/>';};SVG.prototype.drawText=function(x,y,text,rotate){txt+='<text x="'+x+'px" y="'+y+'px" style="'+getFontStyle()+'" transform="rotate('+rotate+' '+x+' '+y+')" '+'>';txt+=text;txt+="</text>";};SVG.prototype.getStyle=function(){var s="";s+="opacity:1;fill:#"+fillClr.toString(16)+";fill-opacity:1;fill-rule:nonzero;";s+="stroke:#"+lineClr.toString(16)+"; stroke-width:"+lineWidth.toString()+"; stroke-linecap:butt; stroke-linejoin:miter; stroke-opacity:1; visibility:visible;";return(s);};SVG.prototype.getFontStyle=function(){var s="";s+="font-size:30px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;";s+="text-align:start; line-height:100.00000381%;";s+="opacity:1; fill:#0000ff; fill-opacity:1; fill-rule:nonzero; stroke:none;";s+="visibility:visible;display:inline;font-family:Komika Text;";return(s);};SVG.prototype.polyline=function(){var s="";s+="<polyline points='";for(var i=0;i<this.line.length;i++){var pt=this.line[i];s+=pt[0].toPrecision(5);s+=" ";s+=pt[1].toPrecision(5);s+=", ";}
s+="' ";clrText='0000ff';s+="stroke-width='"+this.lineWidth.toString()+"' ";s+="stroke='"+this.lineClr+"' ";s+="fill='"+this.fillClr+"' ";s+="fill-opacity='"+0.3+"' ";s+=" />";s+="\n";this.txt+=s;this.line=[];};SVG.prototype.polygon=function(line){var s="";s+="<polygon points='";for(var i=0;i<line.length;i++){if(i>0)s+=", ";var pt=line[i];s+=pt.x.toPrecision(5);s+=" ";s+=pt.y.toPrecision(5);}
s+="' ";s+=this.getStyle();s+=" />";s+="\n";this.txt+=s;};SVG.prototype.getStyle=function(){s='';s+="stroke-width='"+this.lineWidth+"' ";s+="stroke='"+this.lineClr+"' ";s+="fill='"+this.fillClr+"' ";s+="fill-opacity='"+this.fillAlpha+"' ";return s;};SVG.prototype.group=function(id){if(inGroupQ){txt+="</g>\n";}
txt+="<g id='"+id+"'>";inGroupQ=true;};SVG.prototype.getText=function(){if(this.line.length>1)this.polyline();if(this.inGroupQ){this.txt+="</g>\n";}
return(this.txt+this.ftrStr);};