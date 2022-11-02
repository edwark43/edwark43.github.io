let el,g,ratio,shapes,my={}
function dopplerMain(mode,rel){let version='0.61';this.mode=typeof mode!=='undefined'?mode:'asc';rel=typeof rel!=='undefined'?rel:'../';my.w=500;my.h=300;my.clrs=[["PaleGreen",'#98FB98'],["SpringGreen",'#00FF7F'],["Thistle",'#D8BFD8'],["Yellow",'#FFFF00'],["Gold",'#FFD700'],["Pink",'#FFC0CB'],["LightSalmon",'#FFA07A'],["Lime",'#00FF00'],["DarkSeaGreen",'#8FBC8F'],["Orange",'#FFA500'],["Khaki",'#F0E68C'],["Violet",'#EE82EE'],["Teal",'#008080'],["LightBlue",'#ADD8E6'],["SkyBlue",'#87CEEB'],["Blue",'#0000FF'],["Navy",'#000080'],["Purple",'#800080'],["Wheat",'#F5DEB3'],["Tan",'#D2B48C'],["AntiqueWhite",["SlateBlue",'#6A5ACD'],'#FAEBD7'],["Aquamarine",'#7FFFD4'],["Silver",'#C0C0C0']];my.startX=50
my.startY=200
my.diskHt=17
my.listenHt=50
my.frame=0
my.avgFreq=0
my.hist=[]
my.listenPos={x:250,y:170}
my.everyN=12
my.speed=0.8
my.dirn=1
my.playQ=true
my.drag={type:'block',q:false,n:0,hold:{x:0,y:0}}
my.moves=[]
let s="";s+='<div style="position:relative; width:'+my.w+'px; height:'+my.h+'px;  margin:auto; display:block; border: none;  border-radius: 10px; box-shadow: 0px 0px 19px 10px rgba(0,0,68,0.46); ">';s+='<div id="btns0" style="position:absolute; left:5px; top:3px;">';my.playQ=false
s+=playHTML(40);s+=' '
s+='<input type="range" id="speed" class="slider" value="0.5" min="0" max="1" step=".01"  style="z-index:2; width:200px; height:20px;" oninput="onSpeedChg(0,this.value)" onchange="onSpeedChg(1,this.value)" />';s+=' &nbsp; '
my.soundQ=true
s+=soundBtnHTML()
s+='</div>';s+='<div id="disks" style="position:absolute; left:0; top:0;">YO!</div>'
s+='<canvas id="canvasId" width="'+my.w+'" height="'+my.h+'" style="z-index:2;"></canvas>';s+=`<div id="freq" style="position:absolute; font: 24px/${my.listenHt}px Arial; color: yellow; 
   text-align:center; height:${my.listenHt}px; width:${my.listenHt}px; background-color: #00f; border-radius: 50%; z-index:-1;
   ">3</div>`
s+='<div style="position:absolute; left:3px; bottom:3px; font: 10px Arial; color: blue; ">&copy; 2021 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');my.ratio=1
el.width=my.w*my.ratio;el.height=my.h*my.ratio;el.style.width=my.w+"px";el.style.height=my.h+"px";g=el.getContext("2d");g.setTransform(my.ratio,0,0,my.ratio,0,0);shapes=[];my.disks=[]
my.spec=new Spectrum(0)
gameNew();el.addEventListener("mousedown",mouseDown,false);el.addEventListener('touchstart',touchStart,false);el.addEventListener("mousemove",doPointer,false);}
function gameNew(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
var div=document.getElementById('disks')
while(div.firstChild){div.removeChild(div.firstChild);}
var disk=new Disk(50,100,1)
div.appendChild(disk.div)
my.disks.push(disk);my.waveLast=performance.now()
listenSet(my.listenPos.x,my.listenPos.y,'')
anim()}
function anim(){my.frame++
loop();if(my.playQ)requestAnimationFrame(anim);}
function loop(){let disk=my.disks[0]
disk.x+=my.speed*my.dirn
if(disk.x>my.w-30)my.dirn=-1
if(disk.x<30)my.dirn=1
disk.moveMe()
g.clearRect(0,0,g.canvas.width,g.canvas.height)
if(parseInt(my.frame/my.everyN)==my.frame/my.everyN){my.frame=0
my.hist.push({x:disk.x+my.diskHt/2,y:disk.y+my.diskHt/2,dist:0})
my.hist=my.hist.filter(function(elem){return elem.dist<450})}
for(let i=0;i<my.hist.length;i++){let hist=my.hist[i];g.strokeStyle='#bcf'
g.lineWidth=2
g.beginPath()
g.arc(hist.x,hist.y,hist.dist,0,2*Math.PI)
hist.dist+=1.5
g.stroke()}
var p=g.getImageData(my.listenPos.x,my.listenPos.y,1,1).data;let hit=0
if(p[3]!=0){let now=performance.now()
let elapsed=performance.now()-my.waveLast
if(elapsed>40){hit=1
my.waveLast=now
let freq=parseInt(my.avgFreq*6000)
listenSet(my.listenPos.x,my.listenPos.y,freq)
my.spec.fChg(freq)}}
let avgN=15
my.avgFreq=(my.avgFreq*(avgN-1)+hit)/avgN}
function listenSet(x,y,str){let freqDiv=document.getElementById('freq')
freqDiv.style.left=(x-my.listenHt/2)+'px'
freqDiv.style.top=(y-my.listenHt/2)+'px'
freqDiv.innerHTML=str}
function touchStart(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDown(evt)}
function touchMove(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseMove(evt);evt.preventDefault();}
function touchEnd(evt){el.addEventListener('touchstart',touchStart,false);window.removeEventListener("touchend",touchEnd,false);if(my.drag.q){my.drag.q=false;my.disks[my.drag.n].hiliteQ=false;my.drag.n=-1;window.removeEventListener("touchmove",touchMove,false);}}
function doPointer(e){let bRect=el.getBoundingClientRect();let mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);let inQ=false;for(let i=0;i<my.disks.length;i++){let disk=my.disks[i]
if(hitTest(disk,mouseX,mouseY)){inQ=true;}}
if(inQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function mouseDown(evt){let i;let bRect=el.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<my.disks.length;i++){let shape=my.disks[i]
console.log('mouseDown',my.drag,shape)
console.log('hitTest',shape.x,shape.y,mouseX,mouseY,shape.wd,shape.ht,hitTest(shape,mouseX,mouseY))
if(hitTest(shape,mouseX,mouseY)){my.dragStt=performance.now()
my.drag.q=true;console.log('asd',my.drag,shape)
my.drag.hold.x=mouseX-shape.x;my.drag.hold.y=mouseY-shape.y;my.drag.n=i;my.disks[my.drag.n].hilite(true)}}
if(my.drag.q){if(evt.touchQ){window.addEventListener('touchmove',touchMove,false);}else{window.addEventListener("mousemove",mouseMove,false);}}
if(evt.touchQ){el.removeEventListener("touchstart",touchStart,false);window.addEventListener("touchend",touchEnd,false);}else{el.removeEventListener("mousedown",mouseDown,false);window.addEventListener("mouseup",mouseUp,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function mouseUp(evt){el.addEventListener("mousedown",mouseDown,false);window.removeEventListener("mouseup",mouseUp,false);if(my.drag.q){my.drag.q=false;my.disks[my.drag.n].hiliteQ=false;my.drag.n=-1;window.removeEventListener("mousemove",mouseMove,false);}}
function mouseMove(evt){if(my.drag.n<0)return;let bRect=el.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);let posX=mouseX-my.drag.hold.x;let posY=mouseY-my.drag.hold.y;my.disks[my.drag.n].x=posX;my.disks[my.drag.n].y=posY;my.disks[my.drag.n].moveMe(true)}
function hitTest(shape,mx,my){if(mx<shape.x)return false;if(my<shape.y)return false;if(mx>(shape.x+shape.wd))return false;if(my>(shape.y+shape.ht))return false;return true;}
class Pop{constructor(id,yesStr,yesFunc,noStr,noFunc){this.id=id;this.div=document.getElementById(this.id);this.div.style="position:absolute; left:-450px; top:10px; width:auto; padding: 5px; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ";this.bodyDiv=document.createElement("div");this.div.appendChild(this.bodyDiv);let yesBtn=document.createElement("button");this.div.appendChild(yesBtn);if(yesStr.length<1){yesStr="&#x2714;";yesBtn.style='font: 22px Arial;';}
yesBtn.innerHTML=yesStr;yesBtn.classList.add('togglebtn');yesBtn.onclick=this.yes.bind(this);if(false){let noBtn=document.createElement("button");this.div.appendChild(noBtn);if(noStr.length<1){noStr="&#x2718;";noBtn.style='font: 22px Arial;';}
noBtn.innerHTML=noStr;noBtn.classList.add('togglebtn');noBtn.onclick=this.no.bind(this);}
this.yesFunc=yesFunc;this.noFunc=noFunc;return this;}
open(){let div=this.div;div.style.transitionDuration="0.3s";div.style.opacity=1;div.style.zIndex=12;div.style.left=10+'px';}
yes(me){console.log("me",me);let div=document.getElementById(this.id);div.style.opacity=0;div.style.zIndex=1;div.style.left='-999px';if(typeof this.yesFunc==="function"){this.yesFunc();}}
no(){console.log("Pop no");let div=this.div;div.style.opacity=0;div.style.zIndex=1;div.style.left='-999px';if(typeof this.noFunc==="function"){this.noFunc();}}
bodySet(s){this.bodyDiv.innerHTML=s;return s;}}
class Disk{constructor(x,y,n){this.x=x;this.y=y;this.n=n;this.wd=my.diskHt
this.ht=my.diskHt
this.pad=4
this.pole=0
this.hiliteQ=false;let ratio=2
this.div=document.createElement('div');this.div.style.position="absolute";this.div.style.pointerEvents='none';this.div.style.transitionDuration="0s";document.getElementById('disks').appendChild(this.div);this.elFG=document.createElement('canvas');this.elFG.style.position="absolute";this.div.appendChild(this.elFG);let canWd=(this.wd+this.pad*2);let canHt=(this.ht+this.pad*2);this.elFG.width=canWd*ratio;this.elFG.height=canHt*ratio;this.elFG.style.width=canWd+"px";this.elFG.style.height=canHt+"px";this.elFG.style.zIndex=2;this.gFG=this.elFG.getContext("2d");this.gFG.setTransform(ratio,0,0,ratio,0,0);this.elBG=document.createElement('canvas');this.elBG.style.position="absolute";this.div.appendChild(this.elBG);this.elBG.width=canWd*ratio;this.elBG.height=canHt*ratio;this.elBG.style.width=canWd+"px";this.elBG.style.height=canHt+"px";this.elBG.style.zIndex=1;this.gBG=this.elBG.getContext("2d");this.gBG.setTransform(ratio,0,0,ratio,0,0);this.moveMe(true);this.drawMe();return this;}
removeMe(){this.elFG.parentNode.removeChild(this.elFG);this.elBG.parentNode.removeChild(this.elBG);}
moveMe(fastQ=true){if(fastQ){this.div.style.transitionDuration="0s";}else{this.div.style.transitionDuration="0.8s";}
this.div.style.left=(this.x-this.pad)+'px';this.div.style.top=(this.y-this.pad)+'px';}
drawMe(){console.log("drawMe",this.hiliteQ);let g=this.gFG;g.clearRect(0,0,g.canvas.width,g.canvas.height)
if(this.hiliteQ){console.log("hilite",this);g.strokeStyle="rgba(150, 150, 33, 1)";g.lineWidth=1;}else{g.strokeStyle="black";g.lineWidth=1;}
g.fillStyle=my.clrs[this.n][1];g.beginPath();g.roundRect(this.pad,this.pad,this.wd,this.ht,10);g.closePath();g.stroke();g.fill();}
hilite(onQ){this.hiliteQ=onQ
this.drawMe()}}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);return this;};function Spectrum(id){this.id=id
this.audioContext=null
this.ht=120
this.audioQ=false
this.freq=40}
Spectrum.prototype.init=function(){console.log('init',this.id)
this.el=document.getElementById('canvas'+this.id);ratio=2;this.el.width=w*ratio;this.el.height=this.ht*ratio;this.el.style.width=w+"px";this.el.style.height=this.ht+"px";this.g=this.el.getContext("2d");this.g.setTransform(ratio,0,0,ratio,0,0);document.getElementById('freqr'+this.id).value=0.09;document.getElementById('freqi'+this.id).value=this.freq;}
Spectrum.prototype.on=function(){if(this.audioContext==null){this.audioContext=new window.AudioContext();this.oscillator=this.audioContext.createOscillator();this.oscillator.frequency.value=this.freq
this.oscillator.start(0);}
this.oscillator.connect(this.audioContext.destination);}
Spectrum.prototype.off=function(){if(this.oscillator)
this.oscillator.disconnect(this.audioContext.destination);}
Spectrum.prototype.setFreq=function(f){this.freq=f
if(this.audioContext!=null){this.oscillator.frequency.value=f;}}
Spectrum.prototype.toggleAudio=function(){this.audioQ=!this.audioQ;if(this.audioQ){document.getElementById('audioBtn'+this.id).innerHTML='&nbsp;Mute&nbsp;';this.on()}else{document.getElementById('audioBtn'+this.id).innerHTML='Listen';this.off()}}
Spectrum.prototype.html=function(){s=''
s+='<div style="position:relative;">';s+='<canvas id="canvas'+this.id+'" width="'+w+'" height="'+h+'" style="z-index:1;"></canvas>';s+='<input type="range" id="freqr'+this.id+'"  value="0" min="0" max="1" step=".005"  style="position:absolute; top:33px; left:58px; z-index:2; width:462px; height:10px; border: none; " oninput="onFreqChg('+this.id+',this.value)" onchange="onFreqChg('+this.id+',this.value)" />';s+='<button id="audioBtn'+this.id+'" style="position:absolute; left: 2px; bottom:20px; color: #000aae; font-size: 18px;" class="togglebtn"  onclick="toggleAudio('+this.id+')" >Listen</button>';s+='<div style="position:absolute;left:140px;  bottom:11px;">';s+='<span style="color: #000aae; font: 17px Arial;"">Frequency: </span>';s+='<input type="text" id="freqi'+this.id+'" style=" display: inline-block; width: 100px; color: black; text-align:center; padding: 3px; background-color: #eeffee; font: bold 17px Arial;  border-radius: 10px;" value="" onKeyUp="onFreqiChg('+this.id+')" />';s+='<button id="dnBtn" style="font-size: 16px; color: #000aae; " class="togglebtn"  onclick="numChg('+this.id+',-1)" >&#x25BC;</button>';s+='<button id="upBtn" style="font-size: 16px; color: #000aae; " class="togglebtn"  onclick="numChg('+this.id+',1)" >&#x25B2;</button>';s+='<span style="color: #000aae; font: 17px Arial;""> Hertz</span>';s+='</div>';s+='</div>';return s}
Spectrum.prototype.fChg=function(freq){freq=Number(freq);if(freq<20)freq=20;if(freq>20000)freq=20000;if(!isNaN(freq))this.setFreq(freq)}
Spectrum.prototype.draw=function(){var sttY=20;var sttX=70;var endX=520;var gap=1.01*(endX-sttX)/10;var g=this.g
g.lineWidth=2;g.strokeStyle='black';g.textAlign='center';g.fillStyle='lightblue';var rects=[5,10,20,40,80,160,320,640,1280,2500,5000,10000,20000,40000,80000];var f=5;for(var i=-2;i<=11;i++){f=rects[i+2];var xp=sttX+i*gap;g.fillStyle='cornsilk';if(i<0)
g.fillStyle='lightblue';if(i>=10)
g.fillStyle='pink';g.beginPath();g.rect(xp,sttY,gap,40);g.stroke();g.fill();if(i>=0&&i<=10){g.fillStyle='blue';g.fillText(f.toString(),xp,sttY+50);}}
g.fillStyle='black';g.font='14px Arial';g.textAlign='right';g.fillText('Infrasound',sttX-2,15);g.textAlign='center';g.fillText('Sound',(sttX+endX)/2,15);g.textAlign='left';g.fillText('Ultrasound',endX+8,15);}
function onSpeedChg(n,v){console.log("onSpeedChg="+n,v);my.speed=v*1.4}
function playHTML(w){var s='';s+='<style type="text/css">';s+='.playBtn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); outline-style:none; user-select: none;}';s+='.playBtn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.playBtn:before, button:after {content: " "; position: absolute; }';s+='.playBtn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="playBtn play" onclick="playToggle()" ></button>';return s;}
function playToggle(){var btn='playBtn';if(my.playQ){my.playQ=false;my.spec.off()
document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;if(my.soundQ)my.spec.on()
document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");anim();}}
function soundBtnHTML(){let s=''
s+='<style> '
s+=' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
s+=' .speaker span { display: block; width: 9px; height: 9px; background-color: blue; margin: 10px 0 0 1px; }'
s+=' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent blue transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
s+=' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color: blue; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
s+=' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
s+=' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
s+=' </style>'
s+='<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'
return s}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
my.spec.off()
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
my.spec.on()
document.getElementById(btn).classList.remove("mute")}}