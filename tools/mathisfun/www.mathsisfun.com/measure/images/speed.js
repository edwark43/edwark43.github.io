var w,h,g,my={}
function speedMain(mode){this.version='0.81';this.mode=typeof mode!=='undefined'?mode:'rect';w=360;h=300;var s="";s+='<div style="position:relative; width:'+w+'px; min-height:'+h+'px; border: none; border-radius: 20px; background-color: hsla(120,100%,92%,1); margin:auto; display:block;">';s+='<div style="position:absolute; right:2px; top:50px;" >';s+=getPlayHTML(36);s+='</div>';s+='<div style="position:absolute; top:50px; left:-5px; width: 200px; padding:5px; border-radius: 9px; font: 20px Arial; ">';s+='<div id="kmh" style="display: inline-block; width:90px;font: 20px Arial; color: #6600cc; text-align: right; 	">1</div>';s+='<div style="display: inline-block; font: 15px Arial; color: #6600cc; width:90px; text-align: left; padding-left: 10px;">km/h</div>';s+="<br>";s+='<input type="range" id="r1"  value="60" min="0" max="220" step="1"  style="padding:2px; z-index:2; width:220px; height:10px; border: none; margin:auto; " oninput="onkmhChg(0,this.value)" onchange="onkmhChg(1,this.value)" autocomplete="off" />';s+='</div>';s+='<img id="bike" src="../measure/images/motorbike.png" width="68" height="53" style="position: absolute; left:25px; top:5px; vertical-align: middle;">';s+='<img id="wheel" src="../measure/images/speedometer.png" width="193" height="180" style="position: absolute; left:25px; top:100px; vertical-align: middle;">';s+='<div style="position:absolute; left:90px;  top:228px; width: 60px; padding:3px; font: 22px Arial; background-color: grey; ">';s+='<div id="speed" style="display: inline-block; width:60px;font: 20px Arial; color: white; text-align: center;">1</div>';s+='</div>';s+='<canvas id="canvasId" style="position: absolute; width:'+w+'px; height:'+h+'px; left:25px; top:100px; border: none;"></canvas>';s+='<div id="copyrt" style="font: 10px Arial; font-weight: bold; color: skyblue; position:absolute; right:8px; bottom:3px;">&copy; 2018 MathsIsFun.com  v'+this.version+'</div>';s+='</div>';document.write(s);var el=document.getElementById('canvasId');var ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);this.midX=140;this.midY=140;this.scale=0.044;this.radius=110;my.degrees=0;onkmhChg(1,60)
my.sttTime=performance.now();my.bikeX=0
dialDraw()
my.playQ=false;togglePlay();}
function anim(){var nowTime=performance.now();my.bikeX+=(nowTime-my.prevTime)/300*my.kmh
if(my.bikeX>w-20)my.bikeX=-40
my.prevTime=nowTime;var div=document.getElementById('bike');div.style.left=my.bikeX+'px'
if(my.playQ)
requestAnimationFrame(anim);}
function togglePlay(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");my.sttTime=performance.now();my.prevTime=my.sttTime;anim();}}
function getPlayHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="togglePlay()" ></button>';return s;}
function onkmhChg(n,v){v=Number(v);document.getElementById('kmh').innerHTML=v;document.getElementById('speed').innerHTML=v;dialDraw()
my.kmh=v;}
function dialDraw(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.strokeStyle='red'
g.lineWidth=4
g.beginPath()
g.moveTo(97,100)
var rad=70
var ang=(my.kmh*(220/185)-220)*Math.PI/180.0
var dialX=Math.cos(ang)*rad
var dialY=Math.sin(ang)*rad
g.lineTo(97+dialX,100+dialY)
g.stroke()}