var w,h,el,g,ratio,my={}
function projectileMain(mode='ball'){let version='0.6';my.mode=mode
w=320;h=460;this.quad={a:1,b:1,c:1};my.graphLt=0;my.graphWd=500;my.graphTp=0;my.graphHt=240;my.coords=new Coords(my.graphLt,my.graphTp,my.graphWd,my.graphHt,-1,-1,24,11,true);my.canvasWd=my.graphWd
my.canvasHt=my.graphHt
my.bars=[{id:'vel',name:'velocity',pos:5,val:12,min:0,max:20,step:0.1},{id:'ang',name:'angle',pos:45,val:60,min:0,max:90,step:0.1},{id:'drag',name:'drag',pos:85,val:0,min:0,max:0.5,step:0.002},];let s="";s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div style="position: relative; text-align: center; border-radius: 20px; background-color: #eeeeff; ">';s+='<div style="display: inline-block; position: relative; width: 300px; height: 140px; vertical-align: top; border: none; ">';my.bars.map(bar=>{s+=`<div style="position: absolute; left: -100px; top: ${(bar.pos+18)}px; font: 22px arial; width:100px; text-align:right;">${bar.name}</div>`
s+=`<div id="val${bar.id}" style="position: absolute; left: 2px; top: ${(bar.pos+7)}px; font: 16px arial; text-align: center; width:40px;">aaa</div>`
s+=`<input type="range" id="r${bar.id}"  value="${bar.val}" min="-${bar.min}" max="${bar.max}" step="${bar.step}" style="position: absolute; left: 5px; top: ${(bar.pos+21)}px; width: 200px; height: 17px; border: none; z-index: 2; padding:2px;" oninput="onChg()" onchange="onChg()" />`})
s+='<button style="position: absolute; left: 245px; top: 10px;  font-size: 26px; height:40px; color: #000aae; " class="btn"  onclick="fire()" >Fire!</button>';s+='<br>';s+='<button style="position: absolute; left: 255px; top: 60px;  font-size: 15px; color: #000aae; " class="btn"  onclick="clearDrg()" >Clear</button>';s+='</div>';s+='<div id="drg" style="margin:auto; display: inline-block; text-align:center;position: relative;">';s+='<canvas id="canvasId" width="'+my.canvasWd+'" height="'+my.canvasHt+'" style="background-color: #ffffff; z-index: 10; "></canvas>';s+='</div>';s+='<div style="font: 10px Arial; font-weight: bold; color: #6600cc;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=4;el.width=my.canvasWd*ratio;el.height=my.canvasHt*ratio;el.style.width=my.canvasWd+"px";el.style.height=my.canvasHt+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.animID='ball';my.xCurr=0;my.xEnd=0;doGraph()
doTraj()}
function clearDrg(){var div=document.getElementById("drg");var children=Array.prototype.slice.call(div.childNodes);children.forEach(function(item){if(item.id=='ammo')div.removeChild(item);});}
function fire(){let anim=new Anim(my.pts)
anim.stt()}
class Anim{constructor(pts){this.pts=pts
this.rad=8
this.canvas=document.createElement("canvas");document.getElementById('drg').appendChild(this.canvas);this.canvas.setAttribute("id","ammo");this.canvas.setAttribute("style","position:absolute; ");this.canvas.setAttribute("width",140);this.canvas.setAttribute("height",140);this.canvas.style.setProperty("top",0+"px");this.canvas.style.setProperty("left",0+"px");let g=this.canvas.getContext('2d');g.strokeStyle='black'
g.fillStyle='black'
g.beginPath()
g.ball(this.rad,this.rad,this.rad-1,'blue','white')
g.fill();this.g=g}
stt(){this.frameN=0
this.frame()}
frame(){let pt=this.pts[this.frameN]
let finalQ=false
if(pt.y<0){finalQ=true
let prevPt=this.pts[this.frameN-1]
pt.xPx=my.coords.toXPix((prevPt.y*pt.x-pt.y*prevPt.x)/(prevPt.y-pt.y))
pt.yPx=my.coords.toYPix(0)}
this.canvas.style.setProperty("left",pt.xPx-this.rad+"px");this.canvas.style.setProperty("top",pt.yPx-this.rad+"px");this.frameN++
if(this.frameN>=this.pts.length)finalQ=true
if(!finalQ)requestAnimationFrame(this.frame.bind(this));}}
function placeDot(s,xReal,yReal){g.fillStyle='rgba(255,120,0,0.7)';g.beginPath();g.arc(my.coords.toXPix(xReal),my.coords.toYPix(yReal),7,0,2*Math.PI);g.fill();g.fillText(s,my.coords.toXPix(xReal),my.coords.toYPix(yReal)-15);}
function placeObj(id,xReal,yReal,opacity){let ref=document.getElementById('canvasId');let div=document.getElementById(id);div.style.left=(my.coords.toXPix(xReal)+ref.offsetLeft-15)+'px';div.style.top=(my.coords.toYPix(yReal)+ref.offsetTop-15)+'px';div.style.opacity=opacity;}
function onChg(){doGraph();doTraj();}
function doTraj(){my.bars.map(bar=>{bar.val=document.getElementById("r"+bar.id).value;let div=document.getElementById("val"+bar.id);div.innerHTML=fmt3(bar.val);div.style.left=-10+200*(bar.val-bar.min)/(bar.max-bar.min)+"px";})
let vel=my.bars[0].val
let ang=my.bars[1].val
let drag=my.bars[2].val
let px=0
let py=0
let vx=vel*Math.cos(ang*(Math.PI/180.0))
let vy=vel*Math.sin(ang*(Math.PI/180.0))
let ax=0
let ay=-9
let dt=0.02
let nextSec=0
let pts=[]
for(let i=0;i<=Math.ceil(10/dt);i++){let sec=i*dt
let txt=''
if(sec>=nextSec){txt=nextSec+'s'
nextSec++}
pts.push({x:px,y:py,txt:txt})
if(py<0)break
vx+=ax*dt
vy+=ay*dt
vx-=vx*vx*drag*dt
vy-=vy*vy*drag*dt
px+=vx*dt
py+=vy*dt}
my.pts=pts
g.strokeStyle="orange";g.lineWidth=2
g.beginPath();let coords=my.coords
g.moveTo(coords.toXPix(0),coords.toYPix(0))
pts.map(pt=>{pt.xPx=coords.toXPix(pt.x)
pt.yPx=coords.toYPix(pt.y)
g.lineTo(pt.xPx,pt.yPx)})
g.stroke();g.strokeStyle="black";g.fillStyle="black";pts.map(pt=>{if(pt.txt.length>0){g.beginPath();g.arc(pt.xPx,pt.yPx,3,0,2*Math.PI)
g.stroke();g.fillText(pt.txt,pt.xPx+3,pt.yPx-5)}})}
function doGraph(){g.clearRect(0,0,el.width,el.height);g.fillStyle="#ffffff";g.beginPath();g.rect(my.coords.left,my.coords.top,my.coords.width,my.coords.height);g.fill();let graph=new Graph(g,my.coords);graph.drawGraph();}
function doQuad(){let a=document.getElementById("ra").value;let b=document.getElementById("rb").value;let c=document.getElementById("rc").value;let div=document.getElementById("vala");div.innerHTML=fmt3(a);div.style.top=(125-a*(200/(3+3)))+"px";div=document.getElementById("valb");div.innerHTML=fmt3(b);div.style.top=(125-b*(200/(5+5)))+"px";div=document.getElementById("valc");div.innerHTML=fmt3(c);div.style.top=(125-c*(200/(10+10)))+"px";let q=quadratic(a,b,c);if(a==0){q.formula+='<br>(Not a Quadratic Equation)';}
document.getElementById("formula").innerHTML=q.formula;let fitToPtsQ=false;if(fitToPtsQ){let pts=[];let graphWd=5/Math.abs(a);if(q.disc<0){pts.push(new Pt(q.vertX-graphWd,q.vertY));pts.push(new Pt(q.vertX+graphWd,q.vertY));}else{if(!isNaN(q.ans1))pts.push(new Pt(q.ans1,0));if(!isNaN(q.ans2))pts.push(new Pt(q.ans2,0));}
my.coords.fitToPts(pts,1.4);}
this.quad.a=a;this.quad.b=b;this.quad.c=c;funGraph(g,my.coords,fun2,"rgb(11,153,11)",1);g.fillStyle="#000000";g.strokeStyle="#000000";g.font="bold 14px Verdana";g.textAlign="center";let x1=(-b+Math.sqrt(b*b-4*a*c))/(2*a);let x2=(-b-Math.sqrt(b*b-4*a*c))/(2*a);placeDot(fmt3(x1),x1,0);placeDot(fmt3(x2),x2,0);}
function fun2(x){return this.quad.a*x*x+this.quad.b*x+Number(this.quad.c);}
function funGraph(ctx,coords,func){g.beginPath();g.lineWidth=2;g.strokeStyle="#0000ff";for(let i=0;i<my.graphWd;i++){let xVal=coords.toXVal(i);let yVal=func(xVal);let yPos=coords.toYPix(yVal);if(yPos>-200&&yPos<500){g.lineTo(my.graphLt+i,yPos);}}
g.stroke();g.closePath();}
function fmt(num,digits){digits=14;if(num==Number.POSITIVE_INFINITY)
return "undefined";if(num==Number.NEGATIVE_INFINITY)
return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function quadratic(a,b,c){let ans1="";let ans2="";let ansCount=0;let disc=0;let vertX=0;let vertY=0;let notes="";if(a==0){notes="Not a quadratic equation. 'a' shouldn't be zero.";ans1="NA";ans2="NA";ansCount=0;}else{disc=b*b-4*a*c;if(disc<0){let real=-b/(2*a);let imag=Math.sqrt(-disc)/(2*a);notes="It has Complex Roots !";if(real==0){ans1=fmt(Math.abs(imag))+"i";ans2="-"+fmt(Math.abs(imag))+"i";}else{ans1=fmt(real)+" + "+fmt(Math.abs(imag))+"i";ans2=fmt(real)+" - "+fmt(Math.abs(imag))+"i";}
ansCount=2;}else if(disc==0){notes="Only one root.";ans1=fmt(-b/(2*a));ans2="";ansCount=1;}else{notes="";let root1=0;let root2=0;if(b<0){root1=(-b+Math.sqrt(disc))/(2*a);root2=(-b-Math.sqrt(disc))/(2*a);}else{root1=(-b-Math.sqrt(disc))/(2*a);root2=(-b+Math.sqrt(disc))/(2*a);}
if(Math.abs(root1)>Math.abs(c)){root2=c/(a*root1);}
ans1=fmt(root1);ans2=fmt(root2);ansCount=2;}
vertX=-b/(2*a);vertY=Number(a*vertX*vertX)+Number(b*vertX)+Number(c);}
let formula="";formula=neatAdd(formula,a,"x<sup>2</sup>");formula=neatAdd(formula,b,"x");formula=neatAdd(formula,c,"");formula="y = "+formula;return{"count":ansCount,"formula":formula,"ans1":ans1,"ans2":ans2,"disc":disc,"vertX":vertX,"vertY":vertY,"notes":notes};}
function neatAdd(formula,x,varname){let s=formula;let plus="";if(s.length>0){plus=" + ";}
let minus=" &minus; ";if(x==1){if(varname.length==0){s=s+plus+"1";}else{s=s+plus+varname;}}else if(x==-1){if(varname.length==0){s=s+minus+"1";}else{s=s+minus+varname;}}else if(x==0){}else if(x>0){s=s+plus+x+varname;}else{s=s+minus+Math.abs(fmt3(x))+varname;}
return s;}
function Pt(x,y){this.x=x;this.y=y;}
class Coords{constructor(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left;this.top=top;this.width=width;this.height=height;this.xStt=xStt;this.yStt=yStt;this.xEnd=xEnd;this.yEnd=yEnd;this.uniScaleQ=uniScaleQ;this.xLogQ=false;this.yLogQ=false;let skewQ=true;this.xScale;let xLogScale;this.yScale;this.calcScale();}
calcScale(){if(this.xLogQ){if(this.xStt<=0)
this.xStt=1;if(this.xEnd<=0)
this.xEnd=1;}
if(this.yLogQ){if(this.yStt<=0)
this.yStt=1;if(this.yEnd<=0)
this.yEnd=1;}
let temp;if(this.xStt>this.xEnd){temp=this.xStt;this.xStt=this.xEnd;this.xEnd=temp;}
if(this.yStt>this.yEnd){temp=this.yStt;this.yStt=this.yEnd;this.yEnd=temp;}
let xSpan=this.xEnd-this.xStt;if(xSpan<=0)
xSpan=1e-9;this.xScale=xSpan/this.width;this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width;let ySpan=this.yEnd-this.yStt;if(ySpan<=0)
ySpan=1e-9;this.yScale=ySpan/this.height;this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height;if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){let newScale=Math.max(this.xScale,this.yScale);this.xScale=newScale;xSpan=this.xScale*this.width;let xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-xSpan/2;this.xEnd=xMid+xSpan/2;this.yScale=newScale;ySpan=this.yScale*this.height;let yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-ySpan/2;this.yEnd=yMid+ySpan/2;}}
fitToPts(pts,borderFactor){let xStt,xEnd,yStt,yEnd;for(let i=0;i<pts.length;i++){let pt=pts[i];if(i==0){xStt=pt.x;xEnd=pt.x;yStt=pt.y;yEnd=pt.y;}else{xStt=Math.min(xStt,pt.x);xEnd=Math.max(xEnd,pt.x);yStt=Math.min(yStt,pt.y);yEnd=Math.max(yEnd,pt.y);}}
let xMid=(xStt+xEnd)/2;let xhalfspan=borderFactor*(xEnd-xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;let yMid=(yStt+yEnd)/2;let yhalfspan=borderFactor*(yEnd-yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;this.calcScale();}
toXPix(val){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(this.xStt))/this.xLogScale;}else{return this.left+((val-this.xStt)/this.xScale);}}
toYPix(val){if(this.yLogQ){return this.top+(Math.log(this.yEnd)-Math.log(val))/this.yLogScale;}else{return this.top+((this.yEnd-val)/this.yScale);}}
toPtVal(pt,useCornerQ){return new Pt(this.toXVal(pt.x,useCornerQ),this.toYVal(pt.y,useCornerQ));}
toXVal(pix,useCornerQ){if(useCornerQ){return this.xStt+(pix-this.left)*this.xScale;}else{return this.xStt+pix*this.xScale;}}
toYVal(pix,useCornerQ){if(useCornerQ){return this.yEnd-(pix-top)*this.yScale;}else{return this.yEnd-pix*this.yScale;}}
getTicks(stt,span){let ticks=[];let inter=this.tickInterval(span/5,false);let tickStt=Math.ceil(stt/inter)*inter;let i=0;let tick=0;do{tick=i*inter;tick=Number(tick.toPrecision(5));ticks.push([tickStt+tick,1]);i++;}while(tick<span);inter=this.tickInterval(span/4,true);for(i=0;i<ticks.length;i++){let t=ticks[i][0];if(Math.abs(Math.round(t/inter)-(t/inter))<0.001){ticks[i][1]=0;}}
return ticks;}
tickInterval(span,majorQ){let pow10=Math.pow(10,Math.floor(Math.log(span)*Math.LOG10E));let mantissa=span/pow10;if(mantissa>=5){if(majorQ){return(5*pow10);}else{return(2*pow10);}}
if(mantissa>=2){if(majorQ){return(2*pow10);}else{return(1*pow10);}}
if(mantissa>=1){if(majorQ){return(1*pow10);}else{return(0.2*pow10);}}
if(majorQ){return(1*pow10);}else{return(0.2*pow10);}}
xTickInterval(tickDensity,majorQ){return this.tickInterval((this.xEnd-this.xStt)/tickDensity,majorQ);}
yTickInterval(tickDensity,majorQ){return this.tickInterval((this.yEnd-this.yStt)/tickDensity,majorQ);}}
class Graph{constructor(g,coords){this.g=g;this.coords=coords;let xClr=0x4444ff;let yClr=0xff4444;this.xLinesQ=true;this.yLinesQ=true;this.xArrowQ=true;this.yArrowQ=true;this.xValsQ=true;this.yValsQ=true;this.skewQ=false;}
drawGraph(){if(this.coords.xLogQ){this.drawLinesLogX();}else{if(this.xLinesQ){this.drawLinesX();}}
if(this.coords.yLogQ){this.drawLinesLogY();}else{if(this.yLinesQ){this.drawLinesY();}}
if(!this.skewQ){g.beginPath();g.lineWidth=1;g.strokeStyle="#000000";g.rect(this.coords.left,this.coords.top,this.coords.width,this.coords.height);g.stroke();g.closePath();}}
drawLinesX(){let xAxisPos=this.coords.toYPix(0);let yAxisPos=this.coords.toXPix(0);let numAtAxisQ=(yAxisPos>=0&&yAxisPos<this.coords.width);let g=this.g;g.lineWidth=1;let ticks=this.coords.getTicks(this.coords.xStt,this.coords.xEnd-this.coords.xStt);for(let i=0;i<ticks.length;i++){let tick=ticks[i];let xVal=tick[0];let tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.3)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
let xPix=this.coords.toXPix(xVal,false);g.beginPath();g.moveTo(xPix,this.coords.toYPix(this.coords.yStt,false));g.lineTo(xPix,this.coords.toYPix(this.coords.yEnd,false));g.stroke();if(tickLevel==0&&this.xValsQ){g.fillStyle="#0000ff";g.font="bold 12px Verdana";g.textAlign="center";let lbly=0;if(numAtAxisQ&&xAxisPos>0&&xAxisPos<this.coords.height){lbly=xAxisPos+15;}else{lbly=this.coords.height-20;}
g.fillText(fmt(xVal),xPix,xAxisPos+15);}}
if(this.skewQ)
return;if(yAxisPos>=0&&yAxisPos<this.coords.width){g.lineWidth=2;g.strokeStyle="#ff0000";g.beginPath();g.moveTo(yAxisPos,this.coords.toYPix(this.coords.yStt,false));g.lineTo(yAxisPos,this.coords.toYPix(this.coords.yEnd,false));g.stroke();}}
drawLinesY(){let xAxisPos=this.coords.toYPix(0);let yAxisPos=this.coords.toXPix(0);let numAtAxisQ=(xAxisPos>=0&&xAxisPos<this.coords.height);let g=this.g;g.lineWidth=1;let ticks=this.coords.getTicks(this.coords.yStt,this.coords.yEnd-this.coords.yStt);for(let i=0;i<ticks.length;i++){let tick=ticks[i];let yVal=tick[0];let tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.3)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
let yPix=this.coords.toYPix(yVal,false);g.beginPath();g.moveTo(this.coords.toXPix(this.coords.xStt,false),yPix);g.lineTo(this.coords.toXPix(this.coords.xEnd,false),yPix);g.stroke();if(tickLevel==0&&this.yValsQ){g.fillStyle="#ff0000";g.font="bold 12px Verdana";g.textAlign="right";g.fillText(fmt(yVal),yAxisPos-5,yPix+5);}}
if(this.skewQ)
return;if(xAxisPos>=0&&xAxisPos<this.coords.height){g.lineWidth=2;g.strokeStyle="#0000ff";g.beginPath();g.moveTo(this.coords.toXPix(this.coords.xStt,false),xAxisPos);g.lineTo(this.coords.toXPix(this.coords.xEnd,false),xAxisPos);g.stroke();}}}
function fmt3(v){return Math.round(v*1000)/1000;}
CanvasRenderingContext2D.prototype.ball=function(x,y,rad,clr,clr2){this.beginPath();this.fillStyle=clr
this.arc(x,y,rad,0,Math.PI*2,true);this.closePath();var gradient=this.createRadialGradient(x-rad/2,y-rad/2,0,x,y,rad);gradient.addColorStop(0,clr2);gradient.addColorStop(1,clr);this.fillStyle=gradient;this.fill();this.closePath();};