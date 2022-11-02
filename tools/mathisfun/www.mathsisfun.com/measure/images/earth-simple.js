var w,h,g,g1,g2,g3,g4,el2,my={}
function earthsimpleMain(){let version='0.53'
w=540
h=280
var s=''
s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: hsla(240,100%,5%,1); border: 1px outset black; margin:auto; display:block; border-radius: 10px;">'
s+='<div style="position:relative;">';s+='<canvas id="canvas0" style="position: absolute; left: 0px; top: 0px; border: none;"></canvas>';s+='<canvas id="canvas1" style="position: absolute; left: 0px; top: 40px; border: none;"></canvas>';s+='<canvas id="canvas2" style="position: absolute; left: 200px; top: 0px; border: none;"></canvas>';s+='<canvas id="canvas3" style="position: absolute; left: 0px; top: 0px; border: none;"></canvas>';s+='<canvas id="canvas4" style="position: absolute; left: 0px; top: 0px; border: none;"></canvas>';s+='</div>';s+='<div style="position:absolute; left:1px; top:25px;">23.5&deg</div>'
s+='<div style="position:absolute; left:110px; top:6px; color: #dcb; font: 16px Arial;">From Earth\'s Point of View</div>'
s+='<div style="position:absolute; right:4px; bottom:19px; color: #aaa; font: 14px Arial;">Not to scale or speed!</div>'
my.seasons=[{fr:0.00,to:0.02,north:'Summer Solstice',south:'Winter Solstice'},{fr:0.02,to:0.13,north:'Summer',south:'Winter'},{fr:0.13,to:0.23,north:'Summer',south:'Spring'},{fr:0.23,to:0.27,north:'Equinox',south:'Equinox'},{fr:0.27,to:0.38,north:'Fall',south:'Spring'},{fr:0.38,to:0.48,north:'Fall',south:'Summer'},{fr:0.48,to:0.52,north:'Winter Solstice',south:'Summer Solstice'},{fr:0.52,to:0.63,north:'Winter',south:'Summer'},{fr:0.63,to:0.73,north:'Winter',south:'Autumn'},{fr:0.73,to:0.77,north:'Equinox',south:'Equinox'},{fr:0.77,to:0.88,north:'Spring',south:'Autumn'},{fr:0.88,to:0.98,north:'Spring',south:'Winter'},{fr:0.98,to:1.00,north:'Summer Solstice',south:'Winter Solstice'}];s+='<div style="position:absolute; right:1px; top:5px;">';s+=getPlayHTML(40)
s+='</div>';s+='<div style="font: 11px Arial; color: #6600cc; position:absolute; right:4px; bottom:5px; text-align:left;">&copy; 2020 MathsIsFun.com  v'+version+'</div>'
s+='</div>'
document.write(s)
var whole={wd:w,ht:h}
var el=elNew('canvas0',whole)
g=el.getContext("2d");my.earth1={wd:200,ht:200}
var el1=elNew('canvas1',my.earth1)
g1=el1.getContext("2d");my.earth2={wd:55,ht:55}
el2=elNew('canvas2',my.earth2)
g2=el2.getContext("2d");g2.rotate(-23.5*Math.PI/180.0)
var el3=elNew('canvas3',whole)
g3=el3.getContext("2d");var el4=elNew('canvas4',whole)
g4=el4.getContext("2d");my.ell={mid:{x:w/2,y:100},rad:{x:150,y:50}}
my.playQ=false
togglePlay()
my.orbit=0
my.orbitRate=-0.0007
my.rotFrameTime=40
my.prevTime=performance.now()
my.frame=0
my.img=new Image()
my.frameTot=40
my.imgHome=(document.domain=='localhost')?'/mathsisfun/measure/images/':'/measure/images/'
my.img.src=my.imgHome+'earth-sprites2.png'
console.log('my.img.html',my.img.src)
if(my.img.complete){loaded()}else{my.img.addEventListener('load',loaded)}}
function elNew(name,size){var el=document.getElementById(name)
el.width=size.wd
el.height=size.ht
el.style.width=size.wd+"px";el.style.height=size.ht+"px";return el}
function loaded(){animate()}
function animate(){var now=performance.now();var elapsed=now-my.prevTime
if(elapsed>my.rotFrameTime&&my.playQ){my.frame++;if(my.frame>=my.frameTot)my.frame=0
var wd=200
var ht=wd
var ny=(my.frame/10)<<0
var nx=my.frame-ny*10
var srcX=nx*wd
var srcY=ny*ht
g1.drawImage(my.img,srcX,srcY,wd,ht,0,0,wd,ht)
my.orbit+=my.orbitRate
my.orbit=my.orbit%1
let t=my.orbit*2*Math.PI
my.ang=t
my.ell.curr={x:my.ell.mid.x+Math.cos(t)*my.ell.rad.x,y:my.ell.mid.y+Math.sin(t)*my.ell.rad.y}
var x=my.ell.curr.x-my.earth2.wd/2
var y=my.ell.curr.y-my.earth2.ht/2
el2.style.left=x+'px'
el2.style.top=y+'px'
genDraw()
my.prevTime=now}
requestAnimationFrame(animate);}
function genDraw(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
let earth={x:100,y:h/2}
for(var i=0;i<10;i++){g.strokeStyle='hsla(0,0%,100%,'+(10-i)/10+')'
g.lineWidth=1
axisDraw(g,earth,(90-i*2.35)*Math.PI/180.0,120)
g.stroke()}
g.strokeStyle='white'
g.lineWidth=4
axisDraw(g,earth,(90)*Math.PI/180.0,120)
g.stroke()
var orbit=-my.orbit*2
if(orbit>1)orbit=2-orbit
orbit-=0.5
var ang=orbit*2*23.5*Math.PI/180
lightDraw(g3,earth,100,200,230,ang)
let sunY=h/2+Math.sin(ang)*h
let sunX=w-40
let rad=100
g.beginPath();var gradient=g.createRadialGradient(sunX,sunY,0,sunX,sunY,rad);gradient.addColorStop(0,'hsla(60,100%,93%,1)');gradient.addColorStop(0.4,'hsla(60,100%,82%,1)');gradient.addColorStop(0.7,'hsla(60,100%,50%,1)');gradient.addColorStop(1,'hsla(60,100%,90%,0.1)');g.fillStyle=gradient;g.arc(sunX,sunY,rad-1,0,2*Math.PI)
g.fill();orbit=-my.orbit
for(i=0;i<my.seasons.length;i++){var season=my.seasons[i]
if(orbit>=season.fr){if(orbit<=season.to){g.fillStyle='yellow'
g.textAlign='left'
g.font='16px Arial'
g.fillText('\u2190 '+season.north,205,h/2-50+10)
g.fillText('\u2190 '+season.south,205,h/2+50+10)
break;}}}}
function fromto(fr,to,t){return fr*(1-t)+to*t}
function lightDraw(g,mid,rad,cutDist,cutRad,ang){g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.fillStyle='hsla(60,90%,70%,0.75)'
g.beginPath()
g.arc(mid.x,mid.y,rad,0,2*Math.PI)
g.fill();var x=Math.cos(ang)*cutDist
var y=Math.sin(ang)*cutDist
g.beginPath()
g.globalCompositeOperation='source-in'
g.arc(mid.x+x,mid.y+y,cutRad,0,2*Math.PI)
g.fill()
g.globalCompositeOperation='source-over'}
function lightDraw2(g,mid,rad,cutDist,cutRad,ang){g.clearRect(0,0,g.canvas.width,g.canvas.height)
var x=Math.cos(ang)*cutDist
var y=Math.sin(ang)*cutDist
g.fillStyle='hsla(60,90%,70%,1)'
g.beginPath()
g.arc(mid.x+x,mid.y+y,cutRad,0,2*Math.PI)
g.fill();g.beginPath()
g.fillStyle='hsla(60,90%,70%,0.5)'
g.globalCompositeOperation='source-out'
g.arc(mid.x,mid.y,rad,0,2*Math.PI)
g.fill()
g.globalCompositeOperation='source-over'}
function axisDraw(g,mid,ang,len){var dx=Math.cos(ang)*len
var dy=Math.sin(ang)*len
g.beginPath()
g.moveTo(mid.x-dx,mid.y-dy)
g.lineTo(mid.x+dx,mid.y+dy)}
function getArcPts(midX,midY,radiusX,radiusY,fromAngle,toAngle){var points=[];if(radiusX!=radiusY){fromAngle=Math.atan2(Math.sin(fromAngle)*radiusX/radiusY,Math.cos(fromAngle));toAngle=Math.atan2(Math.sin(toAngle)*radiusX/radiusY,Math.cos(toAngle));}
if(fromAngle>toAngle){while(fromAngle>toAngle){fromAngle-=2*Math.PI;}}
var steps=Math.max(1,parseInt((toAngle-fromAngle)*10));for(var i=0;i<=steps;i++){var radians=fromAngle+(toAngle-fromAngle)*(i/steps);var thisX=midX+(Math.cos(radians)*radiusX);var thisY=midY-(Math.sin(radians)*radiusY);points.push({x:thisX,y:thisY});}
return points;}
function drawPts(g,pts,closeQ){closeQ=typeof closeQ!=='undefined'?closeQ:false;for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(pts[i].x,pts[i].y);}else{g.lineTo(pts[i].x,pts[i].y);}}
if(closeQ){g.lineTo(pts[0].x,pts[0].y);}}
function getPlayHTML(w){var s='';s+='<style type="text/css">';s+='.circBtn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); outline-style:none; }';s+='.circBtn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.circBtn:before, button:after {content: " "; position: absolute; }';s+='.circBtn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="circBtn play" onclick="togglePlay()" ></button>';return s;}
function togglePlay(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");}}
CanvasRenderingContext2D.prototype.ball=function(x,y,rad,clr,clr2){this.beginPath();this.fillStyle=clr
this.arc(x,y,rad,0,Math.PI*2,true);this.closePath();var gradient=this.createRadialGradient(x,y,0,x,y,rad*3);gradient.addColorStop(0,clr2);gradient.addColorStop(1,clr);this.fillStyle=gradient;this.fill();this.closePath();};