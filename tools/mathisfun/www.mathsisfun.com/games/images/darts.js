let w,h,g,my={};function dartsMain(){let version='0.51';my.bdSz=400
w=my.bdSz
h=my.bdSz
my.scoreWd=70
my.opts={gameN:0}
my.vals=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5]
my.rads={bullIn:12.7/2,bullOut:31.8/2,tripleIn:99,tripleOut:107,doubleIn:162,doubleOut:170,txt:196,bd:451/2}
my.mouse={dnQ:false}
my.anims=[]
my.animClearQ=true
my.gameN=optGet('gameN')
my.games=[{name:'301',throwsPerRound:3,tgtScore:301,radExtra:0},{name:'501',throwsPerRound:3,tgtScore:501,radExtra:0},{name:'31',throwsPerRound:3,tgtScore:31,radExtra:10},]
my.game=my.games[my.gameN]
my.mates=[{id:'a',name:'Blue',clr:'blue',score:my.game.tgtScore,side:'left',x:0,y:0},{id:'b',name:'Red',clr:'red',score:my.game.tgtScore,side:'right',x:w-my.scoreWd-4,y:0}]
my.mateN=0
let s='';my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'fanfare.mp3" preload="auto"></audio>';s+='<audio id="sndAuto" src="'+my.sndHome+'snap.mp3" preload="auto"></audio>';s+='<audio id="sndFlip" src="'+my.sndHome+'pop.mp3" preload="auto"></audio>';s+='<audio id="sndYes" src="'+my.sndHome+'up.mp3" preload="auto"></audio>';my.snds=[];my.soundQ=true
s+='<div id="main" class="js" style="position:relative; width:'+w+'px;  margin:auto; display:block; ">';s+='<button id="options" class="btn"  style="position:absolute; right: 0; bottom:0px; font: 14px Arial; height:30px; z-index: 20;" onclick="optPop()" >Options</button>';s+=optPopHTML();s+='<div id="msg" style="text-align:center; position:absolute; left: 0; top:0; font: 32px Arial; width:200px; height:40px; color:yellow; border-radius:20px; background-color:hsla(60,100%,90%,0.8); pointer-events: none;">'
s+='Message</div>'
s+='<div id="drg" style=" position:absolute; left: 0; top:0; width:'+w+'px; height:'+h+'px; pointer-events: none; ">'
s+='</div>'
my.mates.map(mate=>{s+=`<div id="mateScore${mate.id}" style=" position:absolute; left: ${mate.x}px; top:${mate.y}px; 
  width: ${my.scoreWd}px; height:20px; pointer-events: none; font:20px Arial; text-align: center; border: 2px solid blue; border-radius:10px; "></div>`
s+=`<div id="mateDartN${mate.id}" style=" position:absolute; left: ${mate.x}px; top:${mate.y+30}px; 
  width: ${my.scoreWd}px; height:20px; pointer-events: none; font:30px Arial; text-align: center; border: none;"></div>`})
s+='<canvas id="canvas1" style=" width:'+w+'px; height:'+h+'px; left: 0px; top: 0px; border: none; z-index:20; "></canvas>';s+='<div style="position:absolute; left: 0; bottom:0; ">';s+='<div style="font: 10px Arial; font-weight: bold; color: #acf; ">&copy; 2021 MathsIsFun.com  v'+version+'</div>';s+='</div>';s+='</div>';document.write(s);let el=document.getElementById('canvas1');let ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);msg('Click and Drag','black',w/2-140,w/2)
drawDartboard()
my.aimer=new Anim()
let div=document.getElementById('canvas1')
div.onmousedown=function(ev){let rtn=bdHit(ev.offsetX,ev.offsetY)
my.mouse.dnQ=true
my.mouse.sttx=ev.offsetX
my.mouse.stty=ev.offsetY
console.log('down',rtn,my.animClearQ)
if(!my.animClearQ)animsClear()
let mate=my.mates[my.mateN]
mate.dartN--
document.getElementById('mateDartN'+mate.id).innerHTML='*'.repeat(mate.dartN)
msg('',mate.clr,-500,0)};div.onmousemove=function(ev){if(!my.mouse.dnQ)return
let rtn=bdHit(ev.offsetX,ev.offsetY)
my.mouse.endx=ev.offsetX
my.mouse.endy=ev.offsetY
if(my.mouse.dnQ){let dx=my.mouse.endx-my.mouse.sttx
let dy=my.mouse.endy-my.mouse.stty
let ang=Math.atan2(dx,-dy)+Math.PI/2
let mate=my.mates[my.mateN]
my.aimer.drawAt(my.mouse.sttx,my.mouse.stty,ang)
my.aimer.drawLine(0,0,my.mouse.endx-my.mouse.sttx,my.mouse.endy-my.mouse.stty,mate.clr)}};div.onmouseup=function(ev){let rtn=bdHit(ev.offsetX,ev.offsetY)
console.log('up',rtn)
my.aimer.clear()
my.mouse.dnQ=false
my.mouse.endx=ev.offsetX
my.mouse.endy=ev.offsetY
fire()};gameNew()}
function gameNew(){my.mates.map(mate=>{mate.score=my.game.tgtScore
document.getElementById('mateScore'+mate.id).innerHTML=mate.score})
my.mateN=0
roundNew()}
function roundNew(){let mate=my.mates[my.mateN]
document.getElementById('mateDartN'+mate.id).innerHTML=''
my.mateN=1-my.mateN
mate=my.mates[my.mateN]
mate.dartN=3
document.getElementById('mateDartN'+mate.id).innerHTML='*'.repeat(mate.dartN)
mate.roundScoreStt=mate.score
let currId=mate.id
my.mates.map(mate=>{let div=document.getElementById('mateScore'+mate.id)
div.style.borderColor=mate.clr
if(mate.id==currId){div.style.backgroundColor='hsla(120,100%,90%,0.6)'}else{div.style.backgroundColor='hsla(120,100%,90%,0.0)'}})
my.animClearQ=false}
function animsClear(){my.anims.map(anim=>{anim.clear()})
my.anims=[]
my.animClearQ=true}
function fire(){console.log('fire',my.mouse)
doTraj()
let anim=new Anim(my.pts)
my.anims.push(anim)
anim.stt()}
function doTraj(){let dx=my.mouse.endx-my.mouse.sttx
let dy=my.mouse.endy-my.mouse.stty
console.log('doTraj dx,dy',dx,dy)
dx*=my.rads.bd/(my.bdSz/2)
dy*=my.rads.bd/(my.bdSz/2)
console.log('doTraj dx,dy',dx,dy)
let ang=Math.atan2(dx,-dy)
let px=my.mouse.sttx
let py=my.mouse.stty
let pz=0
let vx=dx
let vy=dy
let vz=Math.sqrt(dx*dx+dy*dy)*0.01
let ax=0
let ay=9
let az=0
let drag=0
console.log('doTraj',vx,vy)
let dt=0.1
let pts=[]
for(let i=0;i<=Math.ceil(10/dt);i++){pts.push({t:i*dt,x:fmt2(px),y:fmt2(py),z:fmt2(pz),ang:ang+Math.PI/2})
if(pz>2.37)break
vx+=ax*dt
vy+=ay*dt
vz+=az*dt
vx-=vx*vx*drag*dt
vy-=vy*vy*drag*dt
vz-=vz*vz*drag*dt
px+=vx*dt
py+=vy*dt
pz+=vz*dt
ang=Math.atan2(vx,-vy)}
my.pts=pts
console.log('doTraj',my.pts)}
function fmt2(x){return((x*100)<<0)/100}
class Anim{constructor(pts){this.pts=pts
this.rad=200
this.canvas=document.createElement("canvas");document.getElementById('drg').appendChild(this.canvas);this.canvas.setAttribute("id","ammo");this.canvas.setAttribute("style","position:absolute;");this.canvas.setAttribute("width",this.rad*2);this.canvas.setAttribute("height",this.rad*2);this.canvas.style.setProperty("top",0+"px");this.canvas.style.setProperty("left",0+"px");this.g=this.canvas.getContext('2d');}
stt(){this.frameN=0
this.frame()}
frame(){let pt=this.pts[this.frameN]
let finalQ=false
if(pt.y<0){finalQ=true}
this.canvas.style.setProperty("left",pt.x-this.rad+"px");this.canvas.style.setProperty("top",pt.y-this.rad+"px");this.g.clearRect(0,0,g.canvas.width,g.canvas.height)
this.g.dart(this.rad,this.rad,pt.ang)
this.frameN++
if(this.frameN>=this.pts.length)finalQ=true
if(finalQ){hit(pt)}else{requestAnimationFrame(this.frame.bind(this));}}
drawAt(x,y,ang){this.canvas.style.setProperty("left",x-this.rad+"px");this.canvas.style.setProperty("top",y-this.rad+"px");this.g.clearRect(0,0,g.canvas.width,g.canvas.height)
this.g.dart(this.rad,this.rad,ang)}
drawLine(x0,y0,x1,y1,clr){let g=this.g
g.strokeStyle=clr
g.lineWidth=3
g.beginPath()
g.moveTo(this.rad+x0,this.rad+y0)
g.lineTo(this.rad+x1,this.rad+y1)
g.stroke()}
clear(){this.g.clearRect(0,0,g.canvas.width,g.canvas.height)}}
function hit(pt){let result=bdHit(pt.x,pt.y)
console.log('Landed!',pt,result)
let mate=my.mates[my.mateN]
msg(result.score,mate.clr,pt.x,pt.y)
console.log('score',mate)
let currScore=mate.score-result.score
if(currScore==0&&(result.type=="double"||result.type=="triple"||result.type=="bullIn"||result.type=="bullOut")){document.getElementById('mateScore'+mate.id).innerHTML=currScore
win()
return}
if(currScore<0||currScore==1){mate.score=mate.roundScoreStt
document.getElementById('mateScore'+mate.id).innerHTML=mate.score
roundNew()
return}
mate.score=currScore
document.getElementById('mateScore'+mate.id).innerHTML=mate.score
if(mate.dartN==0){roundNew()}}
function win(){let mate=my.mates[my.mateN]
msg(mate.name+' Wins!',mate.clr,w/2-100,w/2)}
function bdHit(x,y){let dx=x-my.bdSz/2
let dy=y-my.bdSz/2
let rad=Math.sqrt(dx*dx+dy*dy)
rad=rad*my.rads.bd/(my.bdSz/2)
let ang=Math.atan2(dx,-dy)
if(ang<0)ang+=2*Math.PI
let sectN=(ang/(2*Math.PI)*my.vals.length+0.5)<<0
if(sectN>=my.vals.length)sectN=0
let rx=my.game.radExtra
console.log('bdHit',rx);if(rad<my.rads.bullIn+rx)return{type:'bullIn',score:50}
if(rad<my.rads.bullOut+rx)return{type:'bullOut',score:25}
if(rad>my.rads.doubleOut+rx)return{type:'out',score:0}
let score=my.vals[sectN]
if(rad>my.rads.doubleIn-rx&&rad<my.rads.doubleOut+rx)return{type:'double',score:score*2}
if(rad>my.rads.tripleIn-rx&&rad<my.rads.tripleOut+rx)return{type:'triple',score:score*3}
return{type:'single',score:score}}
function drawDartboard(){let centerX=my.bdSz/2;let centerY=my.bdSz/2;let radius=my.bdSz/2.5;let valCnt=my.vals.length;let angleStep=(Math.PI*2/valCnt);let rads=my.rads
let fact=(my.bdSz/2)/rads.bd
let clrs={white:'#F7E9CD',black:'#333',bg:'#111',green:'#4F9962',red:'#ED3737',hit:'#FE26F6',line:'#FFB400'}
g.fillStyle=clrs.bg
g.beginPath()
g.arc(centerX,centerY,rads.bd*fact,0,2*Math.PI)
g.fill();for(let i=0;i<valCnt;i++){let colorSingle=i%2==0?clrs.black:clrs.white
let colorOther=i%2==0?clrs.red:clrs.green
let pathSingle=[];let pathDouble=[];let pathTriple=[];pathSingle.push({x:centerX,y:centerY});let smoothN=5
for(let j=0;j<=smoothN;j++){let angle=(angleStep*(i-0.5+j/smoothN))-(Math.PI/2);pathSingle.push(polarToCartesian(centerX,centerY,rads.doubleOut*fact,angle));pathDouble.push(polarToCartesian(centerX,centerY,rads.doubleOut*fact,angle));pathTriple.push(polarToCartesian(centerX,centerY,rads.tripleOut*fact,angle));}
for(let j=0;j<=smoothN;j++){let angle=(angleStep*(i-0.5+1-j/smoothN))-(Math.PI/2);pathDouble.push(polarToCartesian(centerX,centerY,rads.doubleIn*fact,angle));pathTriple.push(polarToCartesian(centerX,centerY,rads.tripleIn*fact,angle));}
pathSingle=[].concat.apply([],pathSingle);pathDouble=[].concat.apply([],pathDouble);pathTriple=[].concat.apply([],pathTriple);g.fillStyle=colorSingle
g.beginPath()
g.drawPoly(pathSingle)
g.fill();g.fillStyle=colorOther
g.beginPath()
g.drawPoly(pathDouble)
g.fill();g.fillStyle=colorOther
g.beginPath()
g.drawPoly(pathTriple)
g.fill();let angle=angleStep*(i)-(Math.PI/2);let pt=polarToCartesian(centerX,centerY,rads.txt*fact,angle)
g.font="30px Arial";g.textAlign="center";g.fillStyle='yellow'
g.beginPath()
g.fillText(my.vals[i],pt.x,pt.y+10)
g.fill();}
g.fillStyle=clrs.green
g.beginPath()
g.arc(centerX,centerY,rads.bullOut*fact,0,2*Math.PI)
g.fill();g.fillStyle=clrs.red
g.beginPath()
g.arc(centerX,centerY,rads.bullIn*fact,0,2*Math.PI)
g.fill();}
function msg(s,clr,x,y){clr=typeof clr!=='undefined'?clr:'white'
let div=document.getElementById('msg')
div.innerHTML=s
div.style.color=clr
div.style.width=(s.toString().length*18+30)+'px'
div.style.left=(x-50/2+20)+'px'
div.style.top=(y-40/2-15)+'px'}
function soundBtnHTML(){let onClr='blue'
let offClr='#bbb'
let s=''
s+='<style> '
s+=' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
s+=' .speaker span { display: block; width: 9px; height: 9px; background-color:'+onClr+'; margin: 10px 0 0 1px; }'
s+=' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent '+onClr+' transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
s+=' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color:'+onClr+'; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
s+=' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
s+=' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
s+=' .speaker.mute span { background-color:'+offClr+'; }'
s+=' .speaker.mute span:after {border-color: transparent '+offClr+' transparent '+offClr+';}'
s+=' </style>'
s+='<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'
return s}
function soundPlay(name,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:true
if(simulQ){if(name.length>0){let div=document.getElementById(name)
if(div.currentTime>0&&div.currentTime<div.duration){console.log('soundPlay cloned',div.currentTime,div.duration)
div.cloneNode(true).play()}else{div.play()}}}else{my.snds.push(name)
soundPlayQueue()}}
function soundPlayQueue(){let div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue();};}
function soundToggle(){let btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function radioHTML(prompt,id,lbls,checkN,func){let s='';s+='<div style="position:relative; margin:auto; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='<div style="font: bold 16px Arial;">';s+=prompt;s+='</div>';s+='<div class="radio" style="display:inline-block; border-radius:5px; padding:3px; margin:3px; ">';for(let i=0;i<lbls.length;i++){let lbl=lbls[i]
let idi=id+i;let chkStr=(i==checkN)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.id+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.name+' </label>';}
s+='</div>';s+='</div>';return s;}
function radioNGet(name){var div=document.querySelector('input[name="'+name+'"]:checked')
var id=div.id
var n=(id.match(/\d+$/)||[]).pop();return n}
function optPopHTML(){let s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:20px; width:320px; padding: 5px; border-radius: 9px; font:14px Arial; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+=radioHTML('Game','game',my.games,my.gameN,'radioClick');s+='<div style="float:right; margin: 0 0 5px 10px; font:16px Arial;">';s+='New game? '
s+='<button onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+=' '
s+='<button onclick="optNo()" style="font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function radioClick(n){}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;}
CanvasRenderingContext2D.prototype.drawPoly=function(pts){let g=this;g.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++){g.lineTo(pts[i].x,pts[i].y);}
g.lineTo(pts[0].x,pts[0].y);};CanvasRenderingContext2D.prototype.dart=function(x,y,ang,clrStr='#ca3'){let g=this;let shapes=[{name:'tip',clr:'black',pts:[[0,0],[1,0.3]],mirrorQ:true},{name:'point',clr:'#ccc',pts:[[1,0.3],[4.5,0.3]],mirrorQ:true},{name:'barrel',clr:'#dd0',pts:[[4.5,0.3],[6,1],[12,1],[13,0.5]],mirrorQ:true},{name:'flight1',clr:'#ca3',pts:[[17,0],[17,0.5],[19,2.5],[23,2.5],[24.5,0]],mirrorQ:false},{name:'flight2',clr:'#da6',pts:[[17,0],[17,-0.5],[19,-2.3],[23,-2.3],[24.5,0]],mirrorQ:false},{name:'shaft',clr:'#333',pts:[[13,0.5],[18,0.5],[19,0]],mirrorQ:true},{name:'flight4',clr:'yellow',pts:[[17,0],[17,-0.2],[19,-1],[23,-1],[24.5,0]],mirrorQ:false},]
let pts=[]
shapes.map(shape=>{if(shape.mirrorQ){pts=mirror(shape.pts)
pts=toxy(pts)}else{pts=toxy(shape.pts)}
pts=trans(pts,x,y,ang,3,3)
g.strokeStyle='#000'
g.lineWidth=0.5
g.fillStyle=shape.clr
g.beginPath()
g.drawPoly(pts)
g.fill();g.stroke()})}
function mirror(pts){let len=pts.length
for(let i=len-1;i>=0;i--){let pt=pts[i];pts.push([pt[0],-pt[1]])}
return pts}
function toxy(pts){let ptsxy=pts.map(pt=>{return{x:pt[0],y:pt[1]}})
return ptsxy}
function trans(pts,xStt,yStt,ang,xFact,yFact){let a=Math.cos(ang)
let b=-Math.sin(ang)
let c=Math.sin(ang)
let d=Math.cos(ang)
let pts2=[]
for(let i=0;i<pts.length;i++){let pt=pts[i]
let x=(a*pt.x+b*pt.y)*xFact
let y=(c*pt.x+d*pt.y)*yFact
pts2.push({x:x,y:y})}
let pts3=pts2.map(pt=>{return{x:xStt+pt.x,y:yStt+pt.y}})
return pts3}
function polarToCartesian(centerX,centerY,radius,angle){let x=centerX+(radius*Math.cos(angle));let y=centerY+(radius*Math.sin(angle));return{x:x,y:y}}
function optPop(){console.log("optpop");var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=102;pop.style.left=(w-340)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';my.gameN=radioNGet('game')
console.log('optYes',my.gameN)
optSet('gameN',my.gameN)
my.game=my.games[my.gameN]
gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function optGet(name){var val=localStorage.getItem(`yacht.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`yacht.${name}`,val)
my.opts[name]=val}