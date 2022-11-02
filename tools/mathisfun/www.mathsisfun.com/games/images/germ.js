var w,h,ratio,i,s,g,g2,el,el2,div,game,my={};function germMain(){var version='0.61'
w=440;h=440;my.opts={type:'r8',appName:document.currentScript.innerHTML.replace('Main();','')}
my.drag={onQ:false,x:0,y:0,i:0}
my.id=0;my.time=0;my.imgHome=(document.domain=='localhost')?'/mathsisfun/games/images/':'/games/images/'
my.shooterTypes={1:{type:1,name:'Soap',x:0,y:0,rad:125,cost:10,n:0,ammoSpeed:30,shootTime:0.5,bombTime:0,wd:40,ht:40,action:'kill'},2:{type:2,name:'Iodine',x:0,y:0,rad:135,cost:10,n:0,ammoSpeed:10,shootTime:3,bombTime:1,action:'kill'},3:{type:3,name:'Freeze',x:0,y:0,rad:65,cost:10,n:0,ammoSpeed:50,shootTime:0.3,bombTime:0,action:'freeze'},4:{type:4,name:'Antibody',x:0,y:0,rad:30,cost:10,n:0,ammoSpeed:20,shootTime:0.4,bombTime:0,action:'kill'},5:{type:5,name:'Apple',x:0,y:0,rad:35,cost:10,n:0,ammoSpeed:30,shootTime:1,bombTime:0,action:'kill'},6:{type:6,name:'Nanobot',x:0,y:0,rad:50,cost:10,n:0,ammoSpeed:15,moveSpeed:10,shootTime:0.6,bombTime:0,action:'kill'},7:{type:7,name:'Nanobot2',x:0,y:0,rad:105,cost:10,n:0,ammoSpeed:20,moveSpeed:15,shootTime:0.4,bombTime:0,action:'kill'},}
var s='';s+=`<style>
  .btn { display: inline-block; position: relative; text-align: center; border: 1px solid #88aaff; border-radius: 10px; 
    font: 16px Arial, sans-serif; color: #268; text-decoration: none; background: 
    linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); 
    cursor: pointer; outline-style: none;}
	.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }
	.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }
	.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }
	.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }
	</style>`
s+='<style>.origmid { transform: translate(-50%,-50%); transform-origin: top left; }</style>';s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 1px solid black; ">';s+='<button id="new" style="position: absolute; left:5px; top:5px; width:60px; font: 14px Arial; height:30px; vertical-align:middle; z-index: 10;" class="btn" onclick="gameNew()" >New</button>';s+='<button id="options" style="position: absolute; right:80px; top:5px; width:80px; font: 14px Arial; height:30px; vertical-align:middle; z-index: 10;" class="btn" onclick="optPop()" >Options</button>';s+='<div style="position:absolute; right:1px; top:1px; z-index: 10;">';s+=getPlayHTML(36);s+='</div>';s+=`<div id="score" style="position: absolute; left: 120px; top: 5px; width: 100px; text-align: center; 
  border: 1px solid blue; font: 24px Arial; z-index: 10;">0</div>`
s+='<div style="position:relative;">';var cans=['can1','can2','can3'];for(var i=0;i<cans.length;i++){s+='<canvas id="'+cans[i]+'" style="position: absolute; width:'+w+'px; height:'+w+'px; left: 0px; top: 0px; z-index: 2; border: none;"></canvas>';}
s+='<div id="imgs" style="position: absolute; width:'+w+'px; height:'+w+'px; left: 0px; top: 0px; z-index: 2;">germs</div>'
s+='</div>';s+=optPopHTML();s+='<div style="position: absolute; left: 10px; bottom: 10px; font: 10px Arial; color: blue;">&copy; 2019 MathsIsFun.com  v'+version+'</div>'
s+='</div>';document.write(s);var els=[];var gs=[];for(var i=0;i<cans.length;i++){var elt=document.getElementById(cans[i]);ratio=1;elt.width=w*ratio;elt.height=h*ratio;elt.style.width=w+"px";elt.style.height=h+"px";elt.style.zIndex=2+i;var gt=elt.getContext("2d");gt.setTransform(ratio,0,0,ratio,0,0);els.push(elt);gs.push(gt);}
el=els[0];g=gs[0];my.ammog=gs[1];el2=els[2];g2=gs[2];my.germsetLevels=[[[6,1,1,1],[6,7,1,3],[6,16,1,2],[7,24,1,3]],[[6,2,1,1],[20,6,1,2],[15,7,1,3],[6,18,3,4]],[[15,1,1,3],[20,5,0.5,1],[6,12,0.5,5]],[[8,1,1,1],[10,4,0.5,2],[8,8,0.5,3],[8,12,1,4],[3,14,1,5],[3,18,1,6]],[[6,1,3,6],[6,5,2,5]],[[7,1,1,5],[7,3.5,0.5,6],[7,11,1,5],[7,14.5,0.5,6]],[[8,1,0.5,5],[8,3.5,0.5,6],[8,8,0.5,5],[8,10.5,0.5,6]]];my.germTypes=[[],[1,-2],[2,-4],[3,-8],[4,-20],[5,-90],[6,-150]];my.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];my.imgs=new Images();my.score=10;my.playQ=false;togglePlay();el2.addEventListener("mousedown",mouseDown,false);el2.addEventListener('touchstart',touchStart,false);el2.addEventListener("mousemove",pointerShow,false);my.userCash=50
my.shooterTypes[1].n=2
my.shooterTypes[2].n=1
gameNew();animate();}
function touchStart(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseDown(ev)}
function touchMove(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseMove(ev);ev.preventDefault();}
function touchEnd(ev){el2.addEventListener('touchstart',touchStart,false);window.removeEventListener("touchend",touchEnd,false);if(my.drag.onQ){my.drag.onQ=false;window.removeEventListener("touchmove",touchMove,false);}}
function pointerShow(ev){document.body.style.cursor="default";var bRect=el2.getBoundingClientRect();var mouseX=(ev.clientX-bRect.left)*(el.width/ratio/bRect.width);var mouseY=(ev.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<my.shooters.length;i++){var shooter=my.shooters[i];if(hitTest(shooter,mouseX,mouseY)){document.body.style.cursor="pointer";}}}
function mouseDown(ev){var i;var highestIndex=-1;var bRect=el2.getBoundingClientRect();var mouseX=(ev.clientX-bRect.left)*(el2.width/ratio/bRect.width);var mouseY=(ev.clientY-bRect.top)*(el2.height/ratio/bRect.height);for(i=0;i<my.shooters.length;i++){var shooter=my.shooters[i];if(hitTest(shooter,mouseX,mouseY)){my.drag.onQ=true;if(i>highestIndex){my.drag.x=mouseX-shooter.x;my.drag.y=mouseY-shooter.y;highestIndex=i;my.drag.i=i;}}}
if(my.drag.onQ){if(ev.touchQ){window.addEventListener('touchmove',touchMove,false);}else{window.addEventListener("mousemove",mouseMove,false);}}
if(ev.touchQ){el2.removeEventListener("touchstart",touchStart,false);window.addEventListener("touchend",touchEnd,false);}else{el2.removeEventListener("mousedown",mouseDown,false);window.addEventListener("mouseup",mouseUp,false);}
if(ev.preventDefault){ev.preventDefault();}
else if(ev.returnValue){ev.returnValue=false;}
return false;}
function mouseUp(ev){g2.clearRect(0,0,g2.canvas.width,g2.canvas.height);el2.addEventListener("mousedown",mouseDown,false);window.removeEventListener("mouseup",mouseUp,false);if(my.drag.onQ){my.drag.onQ=false;window.removeEventListener("mousemove",mouseMove,false);}}
function mouseMove(ev){var posX;var posY;var shapeRad=12;var minX=shapeRad;var maxX=el2.width-shapeRad;var minY=shapeRad;var maxY=el2.height-shapeRad;var bRect=el2.getBoundingClientRect();var mouseX=(ev.clientX-bRect.left)*(el2.width/ratio/bRect.width);var mouseY=(ev.clientY-bRect.top)*(el2.height/ratio/bRect.height);posX=mouseX-my.drag.x;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);posY=mouseY-my.drag.y;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);var sh=my.shooters[my.drag.i]
sh.x=posX;sh.y=posY;my.imgs.move(sh.id,posX,posY,45);g2.clearRect(0,0,g2.canvas.width,g2.canvas.height);g2.strokeStyle='black';g2.fillStyle='rgba(100,100,100,0.1)';g2.beginPath();g2.arc(posX,posY,sh.rad,0,2*Math.PI);g2.fill();g2.stroke();}
function hitTest(shape,mx,my){var dx;var dy;dx=mx-shape.x;dy=my-shape.y;return(dx*dx+dy*dy<shape.rad*shape.rad);}
function gameNew(){my.playQ=false;my.time=0;my.prevTime=0;my.score=0
g.clearRect(0,0,g.canvas.width,g.canvas.height);my.imgs.clear();drawFancyBG(g);var wd=g.canvas.width;var ht=g.canvas.height;my.path=[];var pathLen=4;for(i=0;i<pathLen;i++){var pt=new Pt(10+Math.random()*(wd-50),10+Math.random()*(ht-50));my.path.push(pt);}
var ln=fromMinMaxPts(my.path);var transPt=new Pt(wd/2-(ln.a.x+ln.b.x)/2,ht/2-(ln.a.y+ln.b.y)/2);for(i=0;i<my.path.length-1;i++){my.path[i].translate(transPt);}
for(i=0;i<my.path.length-1;i++){my.path[i].a=dist(my.path[i].x-my.path[i+1].x,my.path[i].y-my.path[i+1].y);}
drawFancyPath(g,my.path);drawFancyStt(g,my.path[0].x,my.path[0].y);drawFancyEnd(g,my.path[my.path.length-1].x,my.path[my.path.length-1].y);my.rand=random();console.log("rand",my.rand);var level=1;my.germsets=my.germsetLevels[level];my.germs=makeGerms();console.log("germs",my.germs);my.currgerms=[];my.currGermNo=0;my.ammos=[];my.booms=[];shooterSetup();timeStt=getTimer();my.playQ=true;}
function shooterSetup(){my.shooters=[];var x=0
var y=100
for(var id in my.shooterTypes){var sh=my.shooterTypes[id]
console.log('shooterSetup',sh)
for(var j=0;j<sh.n;j++){x+=60
if(x>w){x=60
y+=60}
console.log('shooterSetup',j,x,y)
var id='s'+my.id++;var shooter=new Shooter(id,sh.type,x,y,sh.rad);my.shooters.push(shooter);console.log("shooter",shooter);my.imgs.add(id,`${my.imgHome}gb-shooter${sh.type}.gif`,x,y,10);}}}
function animate(){var now=performance.now();if(my.playQ){if(my.prevTime>0)my.time+=now-my.prevTime;doSpawn();var i=my.currgerms.length;while(i--){var germ=my.currgerms[i];germ.move();if(!germ.onQ){my.imgs.remove(germ.id);my.currgerms.splice(i,1);gameCheckOver();break;}}
for(i=0;i<my.shooters.length;i++){var shooter=my.shooters[i];shooter.doFrame();}
my.ammog.clearRect(0,0,my.ammog.canvas.width,my.ammog.canvas.height);var i=my.ammos.length;while(i--){var ammo=my.ammos[i];ammo.doFrame();if(!ammo.onQ){my.ammos.splice(i,1);}}
var i=my.booms.length;while(i--){var boom=my.booms[i];boom.doFrame();if(!boom.onQ){my.booms.splice(i,1);}}}
my.prevTime=now;requestAnimationFrame(animate);}
function gameCheckOver(){if(my.currGermNo>=my.germs.length){if(my.currgerms.length==0){console.log("gameOver!");}}}
function getTimer(){return my.time;}
function scoreAdd(x){console.log('scoreAdd',x);my.score+=x
my.score=Math.round(my.score*100)/100
document.getElementById('score').innerHTML=my.score}
function doSpawn(){var timeNow=(getTimer()-timeStt)/1000;while(my.currGermNo<my.germs.length&&my.germs[my.currGermNo].time<=timeNow){var germ=spawnGerm(my.germs[my.currGermNo].type,0,0,(random()-0.5)*5,(random()-0.5)*5,0);my.currgerms.push(germ);my.currGermNo++;}}
function spawnGerm(t,pathno,pathpos,driftx,drifty,rotation){if(my.currgerms.length<200){var spawnSecs=1;var newgerm=new Germ(t,spawnSecs,my.path);return newgerm;}else{return null;}}
function makeGerms(){var germs=[];for(var i=0;i<my.germsets.length;i++){for(var j=0;j<my.germsets[i][0];j++){germs.push({time:my.germsets[i][1]+j*my.germsets[i][2],type:my.germsets[i][3]});}}
germs.sort(function(a,b){return a.time-b.time;});return germs;}
function fromMinMaxPts(pts){if(pts.length<=0)return null;var pt1=new Pt(pts[0].x,pts[0].y);var pt2=new Pt(pts[0].x,pts[0].y);for(var i=1;i<pts.length;i++){var pt=pts[i];if(pt.x<pt1.x)pt1.x=pt.x;if(pt.y<pt1.y)pt1.y=pt.y;if(pt.x>pt2.x)pt2.x=pt.x;if(pt.y>pt2.y)pt2.y=pt.y;}
return{a:pt1,b:pt2};}
function getPlayHTML(w){var s='';s+='<style type="text/css">';s+='.btn1 {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn1:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn1:before, button:after {content: " "; position: absolute; }';s+='.btn1:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn1 play" onclick="togglePlay()" ></button>';return s;}
function togglePlay(){if(my.resetQ){reset();my.resetQ=false;}
if(this.frame>=this.frameMax){this.frame=0;}
var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");}
if(my.colNo<my.colMax)my.cols[my.colNo].anim();}
function Pt(x,y){this.x=x;this.y=y;}
Pt.prototype.translate=function(pt){this.x+=pt.x;this.y+=pt.y;}
function drawFancyStt(g,xPos,yPos){g.strokeStyle='black';g.lineWidth=2;g.beginPath();g.arc(xPos,yPos,20,0,2*Math.PI);g.stroke();}
function drawFancyEnd(g,xPos,yPos){g.strokeStyle='red';g.lineWidth=3;g.beginPath();g.moveTo(xPos-10,yPos-10);g.lineTo(xPos+10,yPos+10);g.moveTo(xPos+10,yPos-10);g.lineTo(xPos-10,yPos+10);g.stroke();}
function drawFancyBG(g){var wd=g.canvas.width;var ht=g.canvas.height;var clrs=['#f88','#8f8','#88f'];for(i=0;i<3;i++){var angle=Math.random()*2*Math.PI;var dx=wd*1.2*Math.cos(angle);var dy=ht*1.2*Math.sin(angle);var pt={x:0,y:0};if(dx<0)pt.x=wd;if(dy<0)pt.y=ht;console.log("drawFancyBG",angle,dx,dy);console.log("drawFancyBG",pt.x,pt.y,pt.x+dx,pt.y+dy);var clr=clrs[getRandomInt(0,clrs.length-1)];var grd=g.createLinearGradient(pt.x,pt.y,pt.x+dx,pt.y+dy);grd.addColorStop(0,"rgba(255,255,255,0)");grd.addColorStop(1,clr);g.fillStyle=grd;g.fillRect(0,0,wd,ht);}}
function drawFancyPath(g,path){for(var w=0;w<8;w++){g.strokeStyle='rgba(255,255,255,0.15)';g.lineWidth=w*7+20;g.lineCap='round';g.lineJoin='round';g.beginPath();for(var i=0;i<path.length;i++){if(i==0){g.moveTo(path[i].x,path[i].y);}else{g.lineTo(path[i].x,path[i].y);}}
g.stroke();}}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function getDropdownHTML(opts,funcName,id){var s='';s+='<select id="'+id+'" style="font: 15px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off" >';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==0?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:18px;" '+chkStr+' >'+opts[i]+'</option>';}
s+='</select>';return s;}
function optPopHTML(){var s='';s+=`<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; font:16px Arial; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); 
  transition: all linear 0.3s; opacity:0; text-align: left; ">`
s+='<div id="shooter-types"></div>'
s+='<div style="font: bold 16px Arial; margin-top:5px;">'
s+='<div>Total Cash: <span id="opt-cash"></span></div>'
s+='<div>Total Cost: <span id="opt-cost-tot"></span></div>'
s+='<div>Cash Left: <span id="opt-cash-left"></span></div>'
s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optShooterUpdate(){var sum=0
for(var id in my.shooterTypes){var sh=my.shooterTypes[id]
sum+=sh.n*sh.cost}
console.log('numChg',sum)
var cash=my.userCash-sum
if(cash>=0){document.getElementById('opt-cash').innerHTML='$'+my.userCash
document.getElementById('opt-cost-tot').innerHTML='$'+sum
document.getElementById('opt-cash-left').innerHTML='$'+cash}else{}
return my.userCash-sum}
function numChg(id,chg){console.log('numChg',id,chg)
var nWas=my.shooterTypes[id].n
var n=nWas+chg
n=Math.max(0,Math.min(n,100))
my.shooterTypes[id].n=n
var cash=optShooterUpdate()
if(cash>=0){document.getElementById('opt-shoot'+id).innerHTML=n
document.getElementById('opt-cost'+id).innerHTML=`$${n*my.shooterTypes[id].cost}`}else{my.shooterTypes[id].n=nWas}}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-400)/2+'px';document.getElementById('shooter-types').innerHTML=optShooterHTML()
optShooterUpdate()}
function optShooterHTML(){var s=''
for(var id in my.shooterTypes){var sh=my.shooterTypes[id]
s+=`<div>
	  <div style="display:inline-block; width:100px; text-align:right;">${sh.name}</div>
	  <div id="opt-shoot${id}" style="display:inline-block; width:30px; text-align:center; border: 1px solid blue;">${sh.n}</div>
	  <div id="opt-cost${id}" style="display:inline-block; width:50px; text-align:center; border: 1px solid blue;">$${sh.n*sh.cost}</div>
	 <button onclick="numChg(${id}, 1)" style="z-index:2; font: 20px Arial; line-height:20px" class="btn" >+</button>
	 <button onclick="numChg(${id},-1)" style="z-index:2; font: 20px Arial; line-height:20px" class="btn" >&minus;</button>
	 </div>`}
return s}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';gameNew();}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function Germ(type,spawnSecs,newpath){this.id='g'+my.id++;this.pathno=0;this.pathpos=0;this.x=-100;this.y=-100;this.driftx=0;this.drifty=0;this.driftxv=0;this.driftyv=0;this.wd=0;this.ht=0;var germtype;this.speed=2;var prevSpeed=1;this.rot=0;this.rotd=0;var frozenQ=false;var spawnTime;this.onQ=true;var spawnSecs=6;this.rand=my.rand
this.spawnSecs=spawnSecs;germtype=type;my.imgs.add(this.id,`${my.imgHome}gb-germ${type}.gif`,100*Math.random(),200)
path=newpath;driftxv=(random()-0.5)*0.2;driftyv=(random()-0.5)*0.2;rot=1;speed=3+random()*1;spawnTime=getTimer()+(1+random()*0.5)*spawnSecs*1000;}
Germ.prototype.getType=function(){return(germtype);}
Germ.prototype.move=function(){this.pathpos+=this.speed;while(this.pathpos>my.path[this.pathno].a){this.pathpos-=my.path[this.pathno].a;this.pathno++;if(this.pathno>=my.path.length-1){this.onQ=false;scoreAdd(-5)
return}}
var ratio=this.pathpos/(my.path[this.pathno].a);if(random()>0.5){this.driftxv+=(random()-0.5)*0.1;this.driftyv+=(random()-0.5)*0.1;if(this.driftx>20)this.driftxv*=-0.1;if(this.driftx<-20)this.driftxv*=-0.1;if(this.drifty>20)this.driftyv*=-0.1;if(this.drifty<-20)this.driftyv*=-0.1;this.rotd=1;}
this.driftx+=this.driftxv;this.drifty+=this.driftyv;this.rot+=this.rotd;if(this.pathno+1<my.path.length){this.x=my.path[this.pathno].x*(1-ratio)+my.path[this.pathno+1].x*ratio+this.driftx;this.y=my.path[this.pathno].y*(1-ratio)+my.path[this.pathno+1].y*ratio+this.drifty;my.imgs.move(this.id,this.x,this.y,this.rot);}else{this.onQ=false;scoreAdd(-5000)}}
Germ.prototype.getDist=function(xFrom,yFrom){return dist(this.x-xFrom,this.y-yFrom);}
Germ.prototype.getAngle=function(xFrom,yFrom){return(Math.atan2(this.y-yFrom,this.x-xFrom));}
Germ.prototype.getAngleInTime=function(xFrom,yFrom,sec){return(Math.atan2(this.y+this.driftx*sec-yFrom,this.x+this.drifty*sec-xFrom));}
Germ.prototype.getPtInTime=function(sec){return new Pt(this.x+driftx*sec,this.y+drifty*sec);}
Germ.prototype.freeze=function(){frozenQ=true;this.alpha=0.2;prevSpeed=speed;speed/=3;setTimeout(unFreeze,8000);spawnTime+=8000;}
Germ.prototype.unFreeze=function(){frozenQ=false;this.alpha=1;speed=prevSpeed;}
Germ.prototype.isFrozen=function(){return frozenQ;}
class Images{constructor(){this.imgs=[];}
clear(){if(false){var imgs=document.querySelectorAll('[id^="img-"]');console.log('clear',imgs)
var dad=document.getElementById('imgs')
imgs.forEach(function(img){console.log('clear >>',img)
dad.removeChild(img);});}
this.imgs=[];this.update();}
add(id,src,x,y,rot){this.imgs.push({id:id,src:src,x:x,y:y,rot:rot,wd:40,ht:40});this.update();}
remove(id){for(var i=0;i<this.imgs.length;i++){var img=this.imgs[i];if(img.id==id){this.imgs.splice(i,1);break;}}
this.update();}
move(id,x,y,rot){var foundImg=null;for(var i=0;i<this.imgs.length;i++){var img=this.imgs[i];if(img.id==id){foundImg=img;break;}}
if(foundImg!=null){foundImg.x=x;foundImg.y=y;foundImg.rot=rot;var div=document.getElementById('img-'+id);if(div!=null){div.style.transform='rotate('+rot+'deg) translate(-50%,-50%)';div.style.left=x+"px";div.style.top=y+"px";}}}
update(){var s='';for(var i=0;i<this.imgs.length;i++){var img=this.imgs[i];s+=`<img id="img-${img.id}" src="${img.src}" style="position:absolute; left:${img.x}px; top:${img.y}px; 
 transform: rotate(${img.rot}deg) translate(-50%,-50%); transform-origin: top left;">
 `}
document.getElementById('imgs').innerHTML=s;}}
function Shooter(id,typ,x,y,rad){this.id=id;this.typ=typ;this.x=x;this.y=y;this.rad=rad;this.timeNext=0;this.wd=40;this.ht=40;this.moveSpeed=0;var d=my.shooterTypes[typ];this.rad=d.rad;this.ammoSpeed=d.ammoSpeed;this.moveSpeed=d.moveSpeed;this.shootTime=d.shootTime;this.bombTime=d.bombTime;this.clr=d.clr;this.stroke=d.stroke;this.action=d.action;}
Shooter.prototype.doFrame=function(){if(getTimer()>=this.timeNext){for(var i=0;i<my.currgerms.length;i++){var germ=my.currgerms[i];var d=germ.getDist(this.x,this.y);if(d<this.rad){this.sttShoot(germ);this.timeNext=getTimer()+this.shootTime*1000;break;}}
this.timeNext+=0.1*1000;}}
Shooter.prototype.sttShoot=function(germ){tgtDist=germ.getDist(this.x,this.y);var newAngle=germ.getAngleInTime(this.x,this.y,2);this.rot=newAngle*180/Math.PI;my.imgs.move(this.id,this.x,this.y,this.rot);var ammo=new Ammo(this.typ,this.x,this.y,newAngle,this.rad,this.ammoSpeed,this.bombTime,this.clr,this.action);my.ammos.push(ammo);}
Shooter.prototype.onPress=function(){this.startDrag(false);radSprite.visible=true;glowSprite.visible=true;timeNext=getTimer()+1000*1000;parent.addChild(this);dispatchEvent(new Event("drag"));}
Shooter.prototype.onRelease=function(){this.stopDrag();radSprite.visible=false;timeNext=getTimer()+3*1000;dispatchEvent(new Event("release"));}
Shooter.prototype.selected=function(q){isSelectedQ=q;if(q){glowSprite.visible=true;timeNext=getTimer()+4*1000;}}
Shooter.prototype.isSelected=function(){return isSelectedQ;}
function Boom(typ,x,y){this.x=x;this.y=y;this.onQ=true;this.sz=1;}
Boom.prototype.doFrame=function(){var g=my.ammog;g.strokeStyle='red';g.fillStyle='hsla(0,0,0,0.1)';g.beginPath();g.arc(this.x,this.y,this.sz,0,2*Math.PI);g.fill();g.stroke();this.sz+=2;if(this.sz>20)this.onQ=false;}
function Ammo(typ,sttx,stty,angle,rad,speed,bombTime,clr,action){this.typ=typ;this.sttx=sttx;this.stty=stty;this.angle=angle;this.rad=rad;this.speed=speed;this.bombTime=bombTime;this.clr=clr;this.action=action;this.x=sttx;this.y=stty;this.sttTime=getTimer();this.onQ=true;var ammoLine;var radius=300;var germSprite;var bombTime;var bombSttTime;var action;}
Ammo.prototype.drawMe=function(){var g=my.ammog;g.fillStyle=this.clr;switch(this.typ){case 1:g.strokeStyle='grey';g.beginPath();g.arc(this.x,this.y,5,0,2*Math.PI);g.fill();g.stroke();break;case 2:g.strokeStyle='black';g.beginPath();g.arc(this.x,this.y,5,0,2*Math.PI);g.fill();g.stroke();break;default:g.strokeStyle='white';g.beginPath();g.arc(this.x,this.y,5,0,2*Math.PI);g.fill();g.stroke();}}
Ammo.prototype.doFrame=function(){var shootDist=(getTimer()-this.sttTime)/100*this.speed;if(shootDist<this.rad){this.x=this.sttx+shootDist*Math.cos(this.angle);this.y=this.stty+shootDist*Math.sin(this.angle);this.drawMe();i=my.currgerms.length;while(i--){var germ=my.currgerms[i];var d=germ.getDist(this.x,this.y);if(d<20){this.onQ=false;germ.onQ=false;console.log('germ hit')
scoreAdd(1)
my.booms.push(new Boom(this.typ,this.x,this.y));break;}}}else{this.onQ=false;}}
Ammo.prototype.doBomb=function(e){var bombElapsed=(getTimer()-bombSttTime)/1000;var shootDist=((getTimer()-bombSttTime)*0.4+(bombSttTime-shootTimeStt))/1000*speed;var newPt=ammoLine.dist2Pt(shootDist);ammoImg.x=newPt.x;ammoImg.y=newPt.y;if(bombElapsed>bombTime){if(parent!=null)
parent.removeChild(this);}else{var zoom=1+bombElapsed*2;ammoImg.scaleX=zoom;ammoImg.scaleY=zoom;for(var i=germSprite.numChildren-1;i>=0;i--){var germ=germSprite.getChildAt(i);if(this.hitTestObject(germ)){switch(action){case "kill":if(parent.parent!=null)parent.parent.germKilled(germ);break;case "freeze":if(germ.isFrozen())continue;if(parent.parent!=null)parent.parent.germDelayed(germ);break;default:}
break;}}}}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
var seed=1;function random(){var x=Math.sin(seed++)*10000;return x-Math.floor(x);}
function optGet(name){var val=localStorage.getItem(`${my.opts.appName}.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`${my.opts.appName}.${name}`,val)
my.opts[name]=val}