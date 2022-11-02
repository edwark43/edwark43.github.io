var w,h,el,g,my={};var snake;function snakeMain(mode){my.version='0.64';my.typ=typeof mode!=='undefined'?mode:'bla';my.hdrHt=40
w=Math.min(500,window.innerWidth-20,window.innerHeight-my.hdrHt)
h=w
my.xN=20
my.sz=w/my.xN
my.wmax=Math.floor(w/my.sz)-1
my.hmax=Math.floor(h/my.sz)-1
my.hz=10
my.millisecs=1000/my.hz
my.bgClr='hsla(0,0%,15%,1)'
my.edgeTypes=['right','left','wrap','bounce','reset']
my.edgeType=my.edgeTypes[0];my.bgs=['black','coords']
my.food=new Pt(0,0)
my.prevFood=new Pt(0,0)
my.soundQ=true
my.hiScore=0
console.log('my',my)
my.dummy=[playToggle]
var s='';my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndEat" src="'+my.sndHome+'pop.mp3" preload="auto"></audio>';s+='<audio id="sndReset" src="'+my.sndHome+'gromb.mp3" preload="auto"></audio>';my.snds=[];s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+(h+my.hdrHt)+'px;  margin:auto; display:block;  ">';s+='<div style="position:relative; height:40px; ">';s+='<div id="hiscore" style="position:absolute; left:5%; top:15px; width:90%; text-align:center; color: #333; font:16px Arial;">Press Play to Start</div>'
s+='<style type="text/css">';s+='.btn1 {display: inline-block; position: relative; padding: 6px; border: 0 solid rgba(208,208,248,1); border-radius: 10px; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn1:hover {background: linear-gradient(#f0f0f5, #a9a9b9), #c9c5c9; }';s+='</style>';s+='<button id="optBtn" class="btn1" style="float:right; margin-top:9px; " onclick="optPop()" >Options</button>';s+=' '
s+=playHTML(36)
s+='</div>';s+='<div style="position:relative;background-color:'+my.bgClr+';">';s+='<canvas id="canvas1" style="position: absolute; width:'+w+'px; height:'+h+'px; left: 0px; top: 0px; border: none;"></canvas>';s+='</div>';s+=optPopHTML()
s+='<div id="copyrt" style="font: 10px Arial; color: #6600cc; position:absolute; top:0px; right:0px; margin:0; text-align:center;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>'
document.write(s);el=document.getElementById('canvas1');var ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);this.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];console.log("my.typ",my.typ);window.addEventListener("keydown",key,false);el.addEventListener("touchstart",touchStart,false)
el.addEventListener("mousedown",mouseDown,false)
snake=new Snake();foodLocn()
radioPress('edge',0)
my.playQ=false
playToggle()
playToggle()}
function anim(){if(my.playQ){draw()
requestAnimationFrame(anim);}}
function gameNew(){draw()}
function key(ev){var keyCode=ev.keyCode;console.log("key",keyCode);switch(keyCode){case 37:case 65:case 100:case 52:snake.dir(-1,0)
ev.preventDefault();break;case 39:case 68:case 102:case 54:snake.dir(1,0)
ev.preventDefault();break;case 38:case 87:case 104:case 56:snake.dir(0,-1)
ev.preventDefault();break;case 40:case 83:case 98:case 50:snake.dir(0,1)
ev.preventDefault();break;case 32:playToggle()
ev.preventDefault();break;default:}}
function touchStart(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseDown(ev)}
function mouseDown(ev){var bRect=el.getBoundingClientRect();var mousex=ev.clientX-bRect.left
var mousey=ev.clientY-bRect.top
var dx=mousex-(snake.x+0.5)*my.sz
var dy=mousey-(snake.y+0.5)*my.sz
if(Math.abs(dx)>Math.abs(dy)){snake.dir(dx/Math.abs(dx),0)}else{snake.dir(0,dy/Math.abs(dy))}}
function foodLocn(){my.prevFood={x:my.food.x,y:my.food.y}
do{my.food=new Pt(randomInt(0,my.wmax),randomInt(0,my.hmax));}while(my.food.x==my.prevFood.x||my.food.y==my.prevFood.y)
console.log('food',my.sz,my.food)}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function Pt(x,y){this.x=x;this.y=y;return this;}
function draw(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.fillStyle=my.bgClr
g.beginPath()
g.rect(0,0,g.canvas.width,g.canvas.height);g.fill();g.fillStyle='rgba(255,255,255,0.02)'
for(var i=0;i<my.xN;i++){for(var j=0;j<my.xN;j++){if((i+j)%2){g.beginPath()
g.rect(i*my.sz,j*my.sz,my.sz,my.sz);g.fill();}}}
var delta=(performance.now()-my.prev)/my.millisecs
if(delta>=1){my.prev+=Math.floor(delta)*my.millisecs
snake.update();if(snake.eat(my.food)){foodLocn();}
snake.touched();}
snake.show();g.fillStyle='lightgreen'
g.beginPath()
g.arc((my.food.x+0.5)*my.sz,(my.food.y+0.5)*my.sz,my.sz/2,0,2*Math.PI);g.fill();g.fillStyle='white'
g.beginPath()
g.arc((my.food.x+0.25)*my.sz,(my.food.y+0.335)*my.sz,my.sz*0.1,0,2*Math.PI);g.arc((my.food.x+0.3)*my.sz,(my.food.y+0.275)*my.sz,my.sz*0.1,0,2*Math.PI);g.arc((my.food.x+0.35)*my.sz,(my.food.y+0.245)*my.sz,my.sz*0.1,0,2*Math.PI);g.arc((my.food.x+0.4)*my.sz,(my.food.y+0.215)*my.sz,my.sz*0.1,0,2*Math.PI);g.fill();g.beginPath()
g.fillStyle='black'
g.strokeStyle='white'
g.arc(my.food.x*my.sz,(my.food.y+1)*my.sz,2,0,2*Math.PI)
g.fill();g.stroke()
g.beginPath()
g.textAlign='left'
g.fillStyle='white'
var s=my.food.x+', '+(my.hmax-my.food.y)
var x=(my.food.x)*my.sz
var y=(my.food.y+1)*my.sz+12
if(my.food.y==my.hmax){g.textAlign='left'
x=(my.food.x+1)*my.sz+3
y=(my.food.y+0.5)*my.sz+4
if(my.food.x==my.wmax){g.textAlign='right'
x=my.food.x*my.sz-3}}
g.font='10px Arial'
g.fillText(s,x,y);g.fill();}
function Snake(){this.x=0;this.y=0;this.speed={x:1,y:0}
this.prevSpeed={x:1,y:0}
this.total=0;this.tail=[];this.eat=function(pos){if(this.x==pos.x&&this.y==pos.y){this.total++;scoreUpdate(this.total+1)
soundPlay('sndEat')
return true;}else{return false;}}
this.dir=function(x,y){this.prevSpeed.x=this.speed.x
this.prevSpeed.y=this.speed.y
this.speed.x=x
this.speed.y=y}
this.touched=function(){if(this.speed.x*this.prevSpeed.x==-1)return
if(this.speed.y*this.prevSpeed.y==-1)return
for(var i=0;i<this.tail.length;i++){var pos=this.tail[i];if(this.x==pos.x&&this.y==pos.y){this.reset()}}}
this.reset=function(){this.total=0;this.tail=[];soundPlay('sndReset')}
this.update=function(){for(var i=0;i<this.tail.length-1;i++){this.tail[i]=this.tail[i+1];}
if(this.total>=1){this.tail[this.total-1]=new Pt(this.x,this.y);}
this.x+=this.speed.x
this.y+=this.speed.y
var lr=1
if(my.edgeType=='left')lr=-1
if(my.edgeType=='left or right'&&Math.random()>0.5)lr=-1
if(this.x>my.wmax){switch(my.edgeType){case 'left':case 'right':case 'left or right':case 'reset':if(my.edgeType=='reset')this.reset()
this.x=my.wmax
this.dir(0,lr)
this.y+=this.speed.y;break
case 'bounce':this.dir(-1,0)
break
case 'wrap':this.x=0
break}}
if(this.x<0){switch(my.edgeType){case 'left':case 'right':case 'left or right':case 'reset':if(my.edgeType=='reset')this.reset()
this.x=0
this.dir(0,-lr)
this.y+=this.speed.y;break
case 'bounce':this.dir(1,0)
break
case 'wrap':this.x=my.wmax
break}}
if(this.y>my.hmax){switch(my.edgeType){case 'left':case 'right':case 'left or right':case 'reset':if(my.edgeType=='reset')this.reset()
this.y=my.hmax
this.dir(-lr,0)
this.x+=this.speed.x;break
case 'bounce':this.dir(0,-1)
break
case 'wrap':this.y=0
break}}
if(this.y<0){switch(my.edgeType){case 'left':case 'right':case 'left or right':case 'reset':if(my.edgeType=='reset')this.reset()
this.y=0
this.dir(lr,0)
this.x+=this.speed.x;break
case 'bounce':this.dir(0,1)
break
case 'wrap':this.y=my.hmax
break}}}
this.show=function(){g.strokeStyle='black'
g.fillStyle='yellow'
g.font='14px Arial'
g.textAlign='center'
var len=this.tail.length
for(var i=0;i<=len;i++){var bit=this
if(i<len)bit=this.tail[i]
var n=(len-i+1)
g.beginPath()
var rr=Math.round(125+125*Math.cos(n/23))
var gg=Math.round(125+125*Math.cos(n/7))
var bb=Math.round(125-125*Math.cos(n/4))
g.fillStyle='rgb('+rr+','+gg+','+bb+')'
g.rect(bit.x*my.sz,bit.y*my.sz,my.sz,my.sz);g.fill();g.beginPath()
g.fillStyle='blue'
g.fillText(n,(bit.x+0.5)*my.sz,(bit.y+0.5)*my.sz+5)
g.fill();}}}
function scoreUpdate(n){if(n>my.hiScore){my.hiScore=n
var div=document.getElementById('hiscore')
div.innerHTML='High Score = '+n}}
function onHzChg(n,v){v=Number(v);my.hz=v
my.millisecs=1000/my.hz
document.getElementById('hz').innerHTML=v+' per sec'}
function onXNChg(n,v){v=Number(v);my.xN=v
my.sz=w/my.xN
my.wmax=Math.floor(w/my.sz)-1
my.hmax=Math.floor(h/my.sz)-1
foodLocn()
document.getElementById('xN').innerHTML=v+' squares'
draw()}
function onEdgeChg(n){my.edgeType=my.edgeTypes[n];}
function playHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="playToggle()" ></button>';return s;}
function playToggle(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");my.prev=performance.now()
anim();}}
function soundBtnHTML(){var s=''
s+='<style> '
s+=' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
s+=' .speaker span { display: block; width: 9px; height: 9px; background-color: blue; margin: 10px 0 0 1px; }'
s+=' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent blue transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
s+=' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color: blue; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
s+=' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
s+=' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
s+=' .speaker.mute span { background-color: #bbb; }'
s+=' .speaker.mute span:after {border-color: transparent #bbb transparent #bbb;}'
s+=' </style>'
s+='<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'
return s}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-1000px; top:100px; width:'+(my.bdWd-40)+'px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='<div id="optInside" style="margin: 5px auto 5px auto;">';s+='<div style="display: inline-block; font:15px Arial; width: 50px; text-align: right; margin-right:10px;">Speed:</div>'
s+='<input type="range" id="r1" value="'+my.hz+'" min="2" max="25" step="1"  style="z-index:2; width:150px; height:10px; border: none; " oninput="onHzChg(0,this.value)" onchange="onHzChg(1,this.value)" />';s+='<div id="hz" style="display: inline-block; width:90px; font: 16px Arial; color: #6600cc; text-align: left;">'+my.hz+' per sec</div>';s+='<div style="display: inline-block; font:15px Arial; width: 50px; text-align: right; margin-right:10px;">Size:</div>'
s+='<input type="range" id="r1" value="'+my.xN+'" min="5" max="30" step="1"  style="z-index:2; width:150px; height:10px; border: none; " oninput="onXNChg(0,this.value)" onchange="onXNChg(1,this.value)" />';s+='<div id="xN" style="display: inline-block; width:90px; font: 16px Arial; color: #6600cc; text-align: left;">'+my.xN+' squares</div>';s+=radioHTML('Edge Type','edge',my.edgeTypes,'onEdgeChg')
s+='</div>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='10px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';gameNew();}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.6);">';s+=prompt+':';s+='<br>';for(var i=0;i<lbls.length;i++){var idi=id+i;var lbl=lbls[i];s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');">';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function radioPress(id,n){var div=document.getElementById(id+n);div.checked=true;}