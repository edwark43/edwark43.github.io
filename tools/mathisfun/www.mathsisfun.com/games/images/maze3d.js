var w,h,el,g,my={};var CIRCLE=Math.PI*2;var MOBILE=/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
function maze3dMain(mode){my.version='0.61';my.typ=typeof mode!=='undefined'?mode:'bla';w=Math.min(700,window.innerWidth-15)
h=w*0.8
var s='';s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 1px solid lightblue; border-radius: 10px;">';s+='<div style="position:relative;">';s+='<canvas id="canvas1" style="position: absolute; width:'+w+'px; height:'+w+'px; left: 0px; top: 0px; z-index: 2; border: none; border-radius: 10px;"></canvas>';s+='<canvas id="canvas2" style="position: absolute; width:'+w+'px; height:'+w+'px; left: 0px; top: 0px; z-index: 3; border: none;"></canvas>';s+='</div>';s+='<button id="options" style="position: absolute; right: 5px; top:5px; font-size: 15px; z-index:3; font: 16px Arial; color: #000aae; " class="togglebtn"  onclick="popShow()" >Options</button>';s+=popHTML()
s+='<div id="copyrt" style="font: 10px Arial; color: #6600cc; position:absolute; bottom:-15px; left:5px; text-align:center;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvas1');var ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F'],["White",'#ffffff'],["Yellow",'#ffff00'],["Light Yellow",'#ffffdd']];console.log("my.typ",my.typ);my.cellMax=25
my.mapsz=(w-20)/my.cellMax
my.sttTime=performance.now()
my.game={nx:6,ny:4,cellWd:10,moreHoles:15,wallType:'multi'}
start()
my.playQ=true
anim()}
function start(){my.game.nx=document.getElementById('nx').value<<0
my.game.nx=Math.max(2,Math.min(my.game.nx,my.cellMax))
my.game.ny=document.getElementById('ny').value<<0
my.game.ny=Math.max(2,Math.min(my.game.ny,my.cellMax))
my.game.moreHoles=Math.round(my.game.nx*my.game.ny/10)
console.log('my.game',my.game)
my.player=new Player(0.5,0.5,Math.PI*0.1);my.map=new Map()
my.controls=new Controls();my.camera=new Camera(el,MOBILE?160:320,0.8);my.successq=false
my.walkq=false
my.map.generate();my.mapq=true
my.camera.render(my.player,my.map);}
function success(){var s=''
var elapsed=Math.round(performance.now()-my.sttTime)/1000
s+='Freedom!<br>It took you <b>'+elapsed+' seconds</b> to navigate this '+my.game.nx+' by '+my.game.ny+' maze.'
var speed=my.game.nx*my.game.ny/elapsed
if(speed>3)s+=' Well Done!'
document.getElementById('info').innerHTML=s
my.mapq=true
popShow()}
function anim(){if(my.playQ){var mapElapsed=performance.now()-my.mapLast
if(mapElapsed>2500&&!my.mapq){my.mapq=true
my.camera.drawMap(my.map,my.player)}
var seconds=0.02
var chgq=my.player.update(my.controls.states,my.map,seconds);if(chgq){my.camera.render(my.player,my.map);}
requestAnimationFrame(anim);}}
function update(){my.camera.render(my.player,my.map);}
function Controls(){this.codes={37:'left',39:'right',38:'forward',40:'backward'};this.states={'left':false,'right':false,'forward':false,'backward':false};document.addEventListener('keydown',this.onKey.bind(this,true),false);document.addEventListener('keyup',this.onKey.bind(this,false),false);document.addEventListener('touchstart',this.onTouch.bind(this),false);document.addEventListener('touchmove',this.onTouch.bind(this),false);document.addEventListener('touchend',this.onTouchEnd.bind(this),false);}
Controls.prototype.onTouch=function(e){var t=e.touches[0];this.onTouchEnd(e);if(t.pageY<w*0.5)this.onKey(true,{keyCode:38});else if(t.pageX<w*0.5)this.onKey(true,{keyCode:37});else if(t.pageY>w*0.5)this.onKey(true,{keyCode:39});};Controls.prototype.onTouchEnd=function(e){this.states={'left':false,'right':false,'forward':false,'backward':false};e.preventDefault();e.stopPropagation();};Controls.prototype.onKey=function(val,e){var state=this.codes[e.keyCode];if(typeof state==='undefined')return;this.states[state]=val;e.preventDefault&&e.preventDefault();e.stopPropagation&&e.stopPropagation();};function Img(src,width,height){this.image=new Image();this.image.src=src;this.width=width;this.height=height;this.image.addEventListener('load',function(){console.log('Img')
update()},false);}
function Player(x,y,direction){this.x=x;this.y=y;this.direction=direction;this.weapon=new Img('../images/arrow.gif',32,32);this.paces=0;}
Player.prototype.rotate=function(angle){this.direction=(this.direction+angle+CIRCLE)%(CIRCLE);};Player.prototype.walk=function(distance,map){my.mapLast=performance.now()
if(!my.walkq){my.walkq=true
my.sttTime=performance.now()
console.log('started walking')}
var dx=Math.cos(this.direction)*distance;var dy=Math.sin(this.direction)*distance;var xf=Math.floor(this.x);var yf=Math.floor(this.y);if(xf<0||xf>my.game.nx-1||yf<0||yf>my.game.ny-1){this.x+=dx
this.y+=dy
this.paces+=distance;}else{var cell=map.wallGrid[yf*my.game.nx+xf]
var xfnew=Math.floor(this.x+dx);if(xfnew>xf&&!cell[4])this.x+=dx
if(xfnew==xf)this.x+=dx
if(xfnew<xf&&!cell[3])this.x+=dx
var yfnew=Math.floor(this.y+dy);if(yfnew>yf&&!cell[2])this.y+=dy
if(yfnew==yf)this.y+=dy
if(yfnew<yf&&!cell[1])this.y+=dy
this.paces+=distance;}
my.mapq=false
if(xf==my.game.nx-1&&yf==my.game.ny-1){if(!my.successq){my.successq=true
console.log('success')
success()}}};Player.prototype.update=function(controls,map,seconds){if(controls.left)this.rotate(-Math.PI*seconds*0.4);if(controls.right)this.rotate(Math.PI*seconds*0.4);if(controls.forward)this.walk(2.5*seconds,map);if(controls.backward)this.walk(-2.5*seconds,map);if(controls.left||controls.right||controls.forward||controls.backward){return true}else{return false}};function Map(){this.wallGrid=[]
this.skybox=new Img('../images/bg.jpg',2000,750);this.wallTexture=new Img('images/wood6.jpg',1000,1000);this.light=0;}
Map.prototype.isWall=function(wasx,wasy,x,y){var xf=Math.floor(x);var yf=Math.floor(y);if(xf<0||xf>my.game.nx-1||yf<0||yf>my.game.ny-1)return false
var dx=x-wasx
var dy=y-wasy
var horizq=Math.abs(dx)>Math.abs(dy)
var walln
if(horizq){if(dx>0){walln=3}else{walln=4}}else{if(dy>0){walln=1}else{walln=2}}
var n=this.wallGrid[yf*my.game.nx+xf][walln]
return(n>0);};Map.prototype.generate=function(){this.genWalls()};Map.prototype.genWalls=function(){var maze=[];var moves=[];var pts=getRandomPts(my.game.nx,my.game.ny,4);var numberOfCells=my.game.nx*my.game.ny
console.log('numberOfCells',numberOfCells)
for(var i=0;i<my.game.ny;i++){for(var j=0;j<my.game.nx;j++){var a=i*my.game.nx+j
var clr=getClrAt(pts,i,j);maze[a]=[0,1,1,1,1,1,clr];}}
var pos=Math.round(Math.random()*(numberOfCells-1));maze[pos][0]=1;var visited=1;while(visited<numberOfCells){var possible="";if((Math.floor(pos/my.game.nx)==Math.floor((pos-1)/my.game.nx))&&(maze[pos-1][0]==0)){possible+="W";}
if((Math.floor(pos/my.game.nx)==Math.floor((pos+1)/my.game.nx))&&(maze[pos+1][0]==0)){possible+="E";}
if(((pos+my.game.nx)<numberOfCells)&&(maze[pos+my.game.nx][0]==0)){possible+="S";}
if(((pos-my.game.nx)>=0)&&(maze[pos-my.game.nx][0]==0)){possible+="N";}
if(possible){visited++;moves.push(pos);var way=possible.charAt(Math.round(Math.random()*(possible.length-1)));switch(way){case "N":maze[pos][1]=0;maze[pos-my.game.nx][2]=0;pos-=my.game.nx;break;case "S":maze[pos][2]=0;maze[pos+my.game.nx][1]=0;pos+=my.game.nx;break;case "E":maze[pos][4]=0;maze[pos+1][3]=0;pos++;break;case "W":maze[pos][3]=0;maze[pos-1][4]=0;pos--;break;}
maze[pos][0]=1;}else{pos=moves.pop();}}
var moreHoles=0;while(moreHoles<my.game.moreHoles){pos=Math.round(Math.random()*(numberOfCells-1));var wall=randomInt(0,3)+1;if(maze[pos][wall+1]==1){switch(wall){case 1:maze[pos][1]=0;if(pos-my.game.nx>=0)
maze[pos-my.game.nx][2]=0;break;case 2:maze[pos][2]=0;if(pos+my.game.nx<numberOfCells)
maze[pos+my.game.nx][1]=0;break;case 3:maze[pos][3]=0;if(pos-1>=0)
maze[pos-1][4]=0;break;case 4:maze[pos][4]=0;if(pos+1<numberOfCells)
maze[pos+1][3]=0;break;}
moreHoles++;}}
var outerq=true
if(outerq){for(var i=0;i<my.game.nx;i++){maze[i][1]=1
maze[(my.game.ny-1)*my.game.nx+i][2]=1}
for(var i=0;i<my.game.ny;i++){maze[i*my.game.nx][3]=1
maze[i*my.game.nx+my.game.nx-1][4]=1}
maze[numberOfCells-1][2]=0
maze[numberOfCells-1][4]=0}
this.wallGrid=maze
console.log("genWalls",numberOfCells,pos,maze);}
Map.prototype.cast=function(point,angle,range){var self=this;var sin=Math.sin(angle);var cos=Math.cos(angle);var noWall={length2:Infinity};var wasInq=false
var inq=true
return ray({x:point.x,y:point.y,height:0,distance:0});function ray(origin){var stepX=step(sin,cos,origin.x,origin.y);var stepY=step(cos,sin,origin.y,origin.x,true);var nextStep=stepX.length2<stepY.length2?inspect(stepX,1,0,origin.distance,stepX.y):inspect(stepY,0,1,origin.distance,stepY.x);if(nextStep.distance>range)return[origin];if(nextStep.x<0||nextStep.x>my.game.nx||nextStep.y<0||nextStep.y>my.game.ny)inq=false
if(!inq&&wasInq)return[origin]
wasInq=inq
return[origin].concat(ray(nextStep));}
function step(rise,run,x,y,inverted){if(run===0)return noWall;var dx=run>0?Math.floor(x+1)-x:Math.ceil(x-1)-x;var dy=dx*(rise/run);return{x:inverted?y+dy:x+dx,y:inverted?x+dx:y+dy,length2:dx*dx+dy*dy,};}
function inspect(step,shiftX,shiftY,distance,offset){step.distance=distance+Math.sqrt(step.length2);if(shiftX)step.shading=cos<0?2:0;else step.shading=sin<0?2:1;step.offset=offset-Math.floor(offset);step.xf=Math.floor(step.x)
step.yf=Math.floor(step.y)
if(step.xf<0||step.xf>my.game.nx||step.yf<0||step.yf>my.game.ny){step.wallq=false}else{var wallNS=1
var wallWE=3
var n=step.yf*my.game.nx+step.xf
var outsideq=false
if(step.xf==my.game.nx){n-=1
wallWE=4
outsideq=true}
if(step.yf==my.game.ny){n-=my.game.nx
wallNS=2
outsideq=true}
if(outsideq){var cell=self.wallGrid[n]
if(step.xf==my.game.nx&&step.yf<step.y)step.wallq=cell[wallWE]
if(step.yf==my.game.ny&&step.xf<step.x)step.wallq=cell[wallNS]}else{var cell=self.wallGrid[n]
if(step.yf<step.y)step.wallq=cell[wallWE]
if(step.xf<step.x)step.wallq=cell[wallNS]}}
step.height=step.wallq?0.7:0
return step;}};function Camera(canvas,resolution,focalLength){this.ctx=canvas.getContext('2d');this.width=canvas.width=w
this.height=canvas.height=h
this.resolution=resolution;this.spacing=this.width/resolution;this.focalLength=focalLength||0.8;this.range=MOBILE?8:14;this.lightRange=5;this.scale=(this.width+this.height)/1200;}
Camera.prototype.render=function(player,map){this.drawSky(player.direction,map.skybox,map.light);this.drawColumns(player,map);if(my.mapq)this.drawMap(map,player)};Camera.prototype.drawSky=function(direction,sky,ambient){var width=sky.width*(this.height/sky.height)*2;var left=(direction/CIRCLE)*-width;this.ctx.save();this.ctx.drawImage(sky.image,left,0,width,this.height);if(left<width-this.width){this.ctx.drawImage(sky.image,left+width,0,width,this.height);}
if(ambient>0){this.ctx.fillStyle='#ffffff';this.ctx.globalAlpha=ambient*0.1;this.ctx.fillRect(0,this.height*0.5,this.width,this.height*0.5);}
this.ctx.restore();};Camera.prototype.drawColumns=function(player,map){this.ctx.save();for(var column=0;column<this.resolution;column++){var x=column/this.resolution-0.5;var angle=Math.atan2(x,this.focalLength);var ray=map.cast(player,player.direction+angle,this.range);this.drawColumn(column,ray,angle,map);}
this.ctx.restore();};Camera.prototype.drawMapRays=function(player,map){var ray
for(var column=0;column<1;column++){var x=column/this.resolution-0.5;var angle=Math.atan2(x,this.focalLength);ray=map.cast(player,player.direction+angle,this.range);}
var wd=my.mapsz
for(var i=0;i<ray.length;i++){var pt=ray[i]
g.beginPath()
g.beginPath()
if(pt.wallq){g.strokeStyle='black'
g.moveTo(20+pt.xf*wd,20+pt.yf*wd)
g.lineTo(20+pt.x*wd,20+pt.y*wd)
g.moveTo(20+pt.x*wd,20+pt.y*wd)
g.fillStyle='black'
g.arc(20+pt.x*wd,20+pt.y*wd,wd/10,0,2*Math.PI)}else{g.strokeStyle='hsla(60,100%,20%,0.5)'
g.moveTo(20+pt.xf*wd,20+pt.yf*wd)
g.lineTo(20+pt.x*wd,20+pt.y*wd)
g.moveTo(20+pt.x*wd,20+pt.y*wd)
g.fillStyle='black'
g.arc(20+pt.x*wd,20+pt.y*wd,wd/20,0,2*Math.PI)}
g.fill();g.stroke()}};Camera.prototype.drawMap=function(map,player){var wd=my.mapsz
for(var i=0;i<my.game.nx;i++){for(var j=0;j<my.game.ny;j++){var n=j*my.game.nx+i
var lt=15+i*wd
var tp=15+j*wd
var clr=map.wallGrid[n][6]
if(map.wallGrid[n][1]==1)drawEdge(lt,tp,lt+wd,tp,clr)
if(map.wallGrid[n][3]==1)drawEdge(lt,tp,lt,tp+wd,clr)
if(i==my.game.nx-1||j==my.game.ny-1){if(map.wallGrid[n][2]==1)drawEdge(lt,tp+wd,lt+wd,tp+wd,clr)
if(map.wallGrid[n][4]==1)drawEdge(lt+wd,tp,lt+wd,tp+wd,clr)}}}
g.beginPath()
g.fillStyle='green'
g.beginPath()
g.arc(20+player.x*wd,20+player.y*wd,wd/3,0,2*Math.PI)
g.fill();g.beginPath()
var dx=20*Math.cos(player.direction)
var dy=20*Math.sin(player.direction)
g.strokeStyle='green'
g.beginPath()
g.moveTo(20+player.x*wd,20+player.y*wd)
g.lineTo(20+player.x*wd+dx,20+player.y*wd+dy)
g.stroke()};Camera.prototype.drawWeapon=function(weapon,paces){var bobX=Math.cos(paces*2)*this.scale*6;var bobY=Math.sin(paces*4)*this.scale*6;var left=this.width*0.66+bobX;var top=this.height*0.6+bobY;this.ctx.drawImage(weapon.image,left,top,weapon.width*this.scale,weapon.height*this.scale);};Camera.prototype.drawColumn=function(column,ray,angle,map){var ctx=this.ctx;var texture=map.wallTexture;var left=Math.floor(column*this.spacing);var width=Math.ceil(this.spacing);if(false){left=column*this.spacing;width=this.spacing;}
var hit=-1;while(++hit<ray.length&&ray[hit].height<=0);for(var s=ray.length-1;s>=0;s--){var step=ray[s];if(s===hit){var textureX=Math.floor(texture.width*step.offset);var wall=this.project(step.height,angle,step.distance);ctx.globalAlpha=1;switch(my.game.wallType){case 'texture':ctx.drawImage(texture.image,textureX,0,1,texture.height,left,wall.top,width,wall.height);ctx.fillStyle='#888888';ctx.globalAlpha=Math.max((step.distance+step.shading)/this.lightRange-map.light,0);ctx.fillRect(left,wall.top,width,wall.height);break
case 'multi':ctx.beginPath()
var xf=Math.floor(step.x);var yf=Math.floor(step.y);var cell=map.wallGrid[yf*my.game.nx+xf]
if(cell==undefined){ctx.fillStyle='hsla(240,100%,60%,1)';}else{ctx.fillStyle=cell[6];}
ctx.fillRect(left,wall.top,width,wall.height);ctx.fillStyle='hsla(60,10%,100%,0.6)';ctx.globalAlpha=Math.max((step.distance+step.shading)/this.lightRange-map.light,0);ctx.fillRect(left,wall.top,width,wall.height);break
default:}}}};Camera.prototype.project=function(height,angle,distance){var z=distance*Math.cos(angle);var wallHeight=this.height*height/z;var bottom=this.height/2*(1+1/z);return{top:bottom-wallHeight,height:wallHeight};};function GameLoop(){this.frame=this.frame.bind(this);this.lastTime=0;this.callback=function(){};}
GameLoop.prototype.start=function(callback){this.callback=callback;requestAnimationFrame(this.frame);};GameLoop.prototype.frame=function(time){var seconds=(time-this.lastTime)/1000;this.lastTime=time;if(seconds<0.2)this.callback(seconds);requestAnimationFrame(this.frame);};function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function drawEdge(x0,y0,x1,y1,clr){g.strokeStyle=clr
g.lineWidth=2
g.beginPath()
g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke()}
function getRandomPts(width,height,ptCount){var pts=[];for(var i=0;i<ptCount;i++){var ptX=Math.random()*width;var ptY=Math.random()*height;var ptClr=my.clrs[randomInt(0,my.clrs.length-1)][1];pts.push([ptX,ptY,ptClr]);}
return pts;}
function getClrAt(pts,width,height){var sumClrs=[];var sumFact=0;sumClrs=[0,0,0];for(var i=0;i<pts.length;i++){var d=dist(pts[i][0]-width,pts[i][1]-height);var fact=1/d;var rgb=hex2rgb(pts[i][2]);sumClrs[0]+=rgb[0]*fact;sumClrs[1]+=rgb[1]*fact;sumClrs[2]+=rgb[2]*fact;sumFact+=fact;}
var clr=rgb2hex([sumClrs[0]/sumFact,sumClrs[1]/sumFact,sumClrs[2]/sumFact]);return(clr);}
function hex2rgb(hex){hex=hex.replace('#','');var rr=parseInt(hex.substring(0,2),16);var gg=parseInt(hex.substring(2,4),16);var bb=parseInt(hex.substring(4,6),16);return[rr,gg,bb];}
function rgb2hex(clrs){var hex=[];for(var i=0;i<3;i++){hex.push(((clrs[i])<<0).toString(16));if(hex[i].length<2){hex[i]="0"+hex[i];}}
return "#"+hex[0]+hex[1]+hex[2];}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function popShow(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-380)/2+'px';}
function popYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';start()
console.log("popYes",my.players);start()}
function popNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function popHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-450px; top:20px; width:350px; height:160px; padding: 5px; border-radius: 9px; background-color: hsla(240,100%,60%,0.7); box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.7); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="info">&nbsp;</div>'
s+='<div id="btns0" style="float:left; margin: 0 0 5px 10px;font-size: 17px; ">';my.flds=[{id:'nx',title:'Width',lt:30,tp:100,clr:'black',val:10,fn:'chgSide'},{id:'ny',title:'Height',lt:30,tp:125,clr:'black',val:6,fn:'chgSide'},]
for(var i=0;i<my.flds.length;i++){var fld=my.flds[i]
s+='<div style="font-size: 17px; position:absolute; left:'+fld.lt+'px;  top:'+fld.tp+'px; width:60px; z-index:2; color:'+fld.clr+'; text-align:right;">'+fld.title+':</div>';s+='<input type="text" id="'+fld.id+'" style="font-size: 17px; position:absolute; left:'+(fld.lt+65)+'px;  top:'+fld.tp+'px; width:40px; z-index:2; color:'+fld.clr+'; background-color: #f0f8ff; text-align:center; border-radius: 10px; " value="'+fld.val+'" autocomplete="off" onKeyUp="chg('+i+')" />';}
s+='</div>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button onclick="popYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='</div>';s+='</div>';return s;}
function chg(n){var div=document.getElementById(my.flds[n].id)
var val=Number(div.value)<<0
val=my.base=Math.max(0,Math.min(val,my.cellMax))
if(val!=div.value){console.log('chg chg')
div.value=val}
console.log('chg',my.flds[n].id,div.value)}
function radioHTML(prompt,id,lbls,func,n){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px;  background-color:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==n)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.title+' </label>';s+='<br>'}
s+='</div>';return s;}