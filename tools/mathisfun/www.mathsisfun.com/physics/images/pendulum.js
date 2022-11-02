var w,h,ratio,el,g,g2,my={};let mouse={x:0,y:0,isDown:false};let pend={mass:10,length:2.5,ang:(Math.PI/2)-0.7,vel:0,accel:0,momInt:0};function pendulumMain(){let version='0.62';w=420;h=450;my.stt={x:w/2,y:70}
my.g=9.8
my.scale=100
my.sttTime=performance.now()
my.times=[]
my.prevTime=0
my.prevx=0
my.dir=0
let s='';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 2px solid #def; border-radius: 10px;">';s+='<canvas id="canvas1" style="position: absolute; width:'+w+'px; height:'+w+'px; left: 0px; top: 0px; z-index: 3; border: none;"></canvas>';s+='<canvas id="canvas2" style="position: absolute; width:'+w+'px; height:'+w+'px; left: 0px; top: 0px; z-index: 2; border: none;"></canvas>';s+='<div style="position:absolute; left:5px; top:5px; z-index:4;">'
s+='<button onclick="restart()" style="font: 16px Arial;" class="btn" >Restart</button>';s+='</div>'
s+='<div style="position:absolute; right:5px; top:5px; z-index:4;">'
s+=playHTML(36)
s+='</div>'
s+='<div id="options" style="position: absolute; width:'+w+'px; left:0px; bottom:18px; background-color: none; font: 20px arial; color: black; text-align:center; z-index:4;">';let infos=[{id:'pe',name:'PE:',val:1,style:0},{id:'ke',name:'KE:',val:1,style:0},{id:'tote',name:'Total:',val:1,style:0},{id:'period',name:'Period &asymp; ',val:0,style:1},];infos.map(info=>{s+='<div style="display: block; text-align:right; margin-right:5px; ">'
s+='<div style="display: inline-block; font:16px Arial; width: 80px; text-align: right; ">'+info.name+'</div>'
if(info.style==0)s+='<div id="'+info.id+'" style="display: inline-block; width:38px; font: 20px Arial; color: #00ff00; text-align: right;">'+info.val+'</div>';if(info.style==1)s+='<div id="'+info.id+'" style="display: inline-block; width:38px; font: 16px Arial; color: black; text-align: left; margin-top:9px; margin-left:5px;">'+info.val+'</div>';s+='</div>'})
s+='<div style="clear:both; height:6px;"></div>'
let sliders=[{id:'len1',name:'Length',fn:onLen1Chg,val:pend.length,min:0.1,max:4.0,step:0.01},{id:'mass1',name:'Mass',fn:onMass1Chg,val:pend.mass,min:1,max:40,step:0.1},{id:'grav',name:'Gravity',fn:onGravChg,val:my.g,min:0,max:10,step:0.1},];sliders.map(slider=>{s+='<div style="display: inline-block; font:15px Arial; width: 80px; text-align: right; margin-right:10px;  ">'+slider.name+':</div>'
s+='<input type="range" value="'+slider.val+'" min="'+slider.min+'" max="'+slider.max+'" step="'+slider.step+'"  style="z-index:2; width:250px; height:10px; border: none; " oninput="'+slider.fn.name+'(this.value)" onchange="'+slider.fn.name+'(this.value)" autocomplete="off" />';s+='<div id="'+slider.id+'" style="display: inline-block; width:50px; font: 18px Arial; color: #6600cc; text-align: left;">'+slider.val+'</div>';s+='<br>';})
s+='</div>';s+='<div style="font: 10px Arial; color: #6600cc; position:absolute; bottom:3px; left:5px; text-align:center;  z-index: 2;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvas1');ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);let el2=document.getElementById('canvas2');ratio=3;el2.width=w*ratio;el2.height=h*ratio;el2.style.width=w+"px";el2.style.height=h+"px";g2=el2.getContext("2d");g2.setTransform(ratio,0,0,ratio,0,0);restart()
my.playQ=false
playToggle()}
function restart(){g2.clearRect(0,0,g2.canvas.width,g2.canvas.height)
my.sttTime=performance.now()
my.prevTime=my.sttTime
pend.vel=0
pend.accel=0
pend.ang=(Math.PI/2)-0.7
if(!my.playQ)playToggle()
calcDo()
draw()}
function onLen1Chg(v){pend.length=Number(v);document.getElementById('len1').innerHTML=v;console.log('onLen1Chg',v)
draw()}
function onMass1Chg(v){pend.mass=Number(v);document.getElementById('mass1').innerHTML=v;draw()}
function onGravChg(v){my.g=Number(v);document.getElementById('grav').innerHTML=v;}
function calcDo(){let now=performance.now()
let elapsed=(now-my.sttTime)/1000
if(elapsed>1)elapsed=0.01
my.sttTime=now
pend.momInt=pend.mass*pend.length*pend.length;pend.ang+=pend.vel*elapsed+(0.5*pend.accel*elapsed*elapsed);let torque=pend.mass*my.g*Math.cos(pend.ang)*pend.length;let accel=torque/pend.momInt;pend.vel+=0.5*(accel+pend.accel)*elapsed;pend.accel=accel;let h=pend.length*(1-Math.cos(pend.ang-Math.PI/2))
let pe=pend.mass*my.g*h
let ke=0.5*pend.momInt*pend.vel*pend.vel
pe=Math.round(pe)
ke=Math.round(ke)
document.getElementById('ke').innerHTML=ke
document.getElementById('pe').innerHTML=pe
document.getElementById('tote').innerHTML=ke+pe}
function draw(){if(!mouse.isDown){let x1=pend.length*my.scale*Math.sin(pend.ang-Math.PI/2);let y1=pend.length*my.scale*Math.cos(pend.ang-Math.PI/2);let dirn=(y1<my.prevy)
if((dirn&&!my.dirn)||(!dirn&&my.dirn)){let now=performance.now()
let period=now-my.prevTime
my.prevTime=now
let mult=4
if(Math.abs(my.prevPeaky+y1)<1)mult=2
let sec=Math.round(mult*period/100)/10
console.log('CHANGE',period,mult,sec)
document.getElementById('period').innerHTML=sec+'s'
my.prevPeaky=y1}
my.dirn=dirn
my.prevy=y1
let stt=my.stt
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.strokeStyle='black'
g.fillStyle='black'
g.beginPath()
g.moveTo(stt.x,stt.y)
g.lineTo(stt.x+x1,stt.y+y1)
g.stroke()
g.beginPath()
g.ball(stt.x,stt.y,5,'black','white')
g.fill();g.beginPath()
g.ball(stt.x+x1,stt.y+y1,Math.sqrt(pend.mass)*5,'#008800','white')
g.fill();g2.fillStyle='rgba(255, 255, 255, .04)';g2.fillRect(0,0,g2.canvas.width,g2.canvas.height)
g2.fillStyle='hsla(120,100%,80%,0.5)'
g2.beginPath()
g2.arc(stt.x+x1,stt.y+y1,5,0,2*Math.PI)
g2.fill();}
if(mouse.isDown){g2.beginPath();g2.moveTo(ball.position.x,ball.position.y);g2.lineTo(mouse.x,mouse.y);g2.stroke();g2.closePath();}}
function playHTML(w){let s='';s+='<style type="text/css">';s+='.playbtn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; outline-style:none; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.playbtn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.playbtn:before, button:after {content: " "; position: absolute; }';s+='.playbtn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="playbtn play" onclick="playToggle()" ></button>';return s;}
function playToggle(){let btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");my.sttTime=performance.now()
anim();}}
function anim(){if(my.playQ){calcDo()
draw()
requestAnimationFrame(anim);}}
function getMousePosition(e){mouse.x=e.pageX-el.offsetLeft;mouse.y=e.pageY-el.offsetTop;}
var mouseDown=function(e){if(e.which==1){getMousePosition(e);mouse.isDown=true;ball.position.x=mouse.x;ball.position.y=mouse.y;}}
var mouseUp=function(e){if(e.which==1){mouse.isDown=false;ball.velocity.y=(ball.position.y-mouse.y)/10;ball.velocity.x=(ball.position.x-mouse.x)/10;}}
CanvasRenderingContext2D.prototype.ball=function(x,y,rad,clr,clr2){this.beginPath();this.fillStyle=clr
this.arc(x,y,rad,0,Math.PI*2,true);this.closePath();var gradient=this.createRadialGradient(x-rad/2,y-rad/2,0,x,y,rad);gradient.addColorStop(0,clr2);gradient.addColorStop(1,clr);this.fillStyle=gradient;this.fill();this.closePath();};