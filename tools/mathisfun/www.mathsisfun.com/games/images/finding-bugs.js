let my={}
function findingbugsMain(mode='rat'){let version='0.62';my.mode=mode
my.countMax=10
my.countN=3
my.countFrac=my.countN/my.countMax
my.findRad=50
my.alphaLo=0.16
my.bugs=[{img:'butterfly.svg'},{img:'dragonfly.svg'}]
my.bug=my.bugs[0]
let s=''
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndYes" src="'+my.sndHome+'yes2.mp3" preload="auto"></audio>';s+='<audio id="sndDrop" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>';s+='<audio id="sndUndo" src="'+my.sndHome+'down.mp3" preload="auto"></audio>'
my.snds=[];my.soundQ=true
s+='<div id="outer" style="position: relative; text-align: center; border-radius: 20px; background-color: #eeeeff; ">';my.imgHome=(document.domain=='localhost')?'/mathsisfun/games/images/bugs/':'/games/images/bugs/'
s+='<img id="bg" src="'+my.imgHome+'bg1.svg" style="">';for(var i=0;i<my.countMax;i++){s+='<img id="bf'+i+'" src="'+my.imgHome+my.bug.img+'" style="transition: top 1.3s, left 1.3s, width 1s, height 1s, opacity 0.7s; position:absolute; left:0; top:0; opacity:0; z-index:1;">';}
s+='<canvas id="canScore" style="position:absolute; left:0; top:0;"></canvas>'
s+='<canvas id="canHover" style="position:absolute; left:0; top:0;"></canvas>'
s+='<div style="position:absolute; left:12px; top:5px; z-index:7;">';s+=soundBtnHTML()
s+='</div>';s+='<div id="success" style="font: 60px Arial; color: yellow; position:absolute; left:-10px; top:30px; ">Well Done!</div>';s+='<div style="font: 11px Arial; color: #6600cc;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);let styles=getComputedStyle(document.getElementById('outer'))
my.wd=parseFloat(styles.width)
my.ht=my.wd*900/1260
my.cans=[]
canvasInit('canScore',my.wd,my.wd*0.1,2)
canvasInit('canHover',my.wd,my.ht,1)
console.log('my',my)
window.addEventListener("mousemove",onMouseMove,false);window.addEventListener("mousedown",onMouseDown,false);go()
scoreDraw()
success()}
function canvasInit(id,wd,ht,ratio){let el=document.getElementById(id);el.width=wd*ratio;el.style.width=wd+"px";el.height=ht*ratio;el.style.height=ht+"px";let g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.cans[id]={el:el,g:g,ratio:ratio}}
function onMouseMove(evt){let div=document.getElementById('outer')
let bRect=div.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)
let mouseY=(evt.clientY-bRect.top)
let g=my.cans.canHover.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.fillStyle='rgba(250,250,200,0.3)'
g.beginPath()
g.arc(mouseX,mouseY,my.findRad,0,2*Math.PI)
g.fill();for(let i=0;i<my.shapes.length;i++){let shape=my.shapes[i]
if(!shape.foundQ){let alpha=my.alphaLo
let d=dist(mouseX-(shape.lt+shape.wd/2),mouseY-(shape.tp+shape.ht/2))
if(d<my.findRad){alpha=1}
let div=document.getElementById('bf'+i);div.style.opacity=alpha}}}
function onMouseDown(evt){let div=document.getElementById('outer')
let bRect=div.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)
let mouseY=(evt.clientY-bRect.top)
let closeN=-1
let closeD=my.wd
for(let i=0;i<my.shapes.length;i++){let shape=my.shapes[i]
let d=dist(mouseX-(shape.lt+shape.wd/2),mouseY-(shape.tp+shape.ht/2))
if(d<my.wd*0.08){if(d<closeD){closeD=d
closeN=i}}}
if(closeN>=0){let shape=my.shapes[closeN]
shape.foundQ=true
let div=document.getElementById('bf'+closeN);div.style.opacity=1
my.score+=1
soundPlay('sndDrop')
scoreDraw()}}
function scoreDraw(){let g=my.cans.canScore.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
let ht=my.wd*0.05
let lt=my.wd*0.14
g.strokeStyle='rgba(0,0,200,0.2)'
g.fillStyle='rgba(200,200,250,0.5)'
g.beginPath()
g.rect(lt,10,my.wd*0.6,ht)
g.stroke()
g.fill();g.fillStyle='rgba(0,0,200,0.6)'
g.beginPath()
let wd=my.score/my.countN*my.wd*0.6
g.rect(lt,10,wd,ht)
g.fill();g.fillStyle='white'
g.font=parseInt(ht)+'px Arial'
g.fillText(my.score,lt+wd-30,ht*1.1)
if(my.score==my.countN){success(true)}}
function success(yesQ){let div=document.getElementById('success')
div.style.font=(my.wd*0.1)+'px Arial'
if(yesQ){div.style.left=(my.wd*0.2)+'px'
div.style.top=(my.wd*0.065)+'px'
div.style.opacity=1
soundPlay('sndYes')
my.alphaLo-=0.05
my.alphaLo=Math.max(my.alphaLo,0)
my.countFrac+=0.0501
my.countFrac=Math.min(my.countFrac,1)
my.countN=parseInt(my.countFrac*my.countMax)
setTimeout(go,1500)}else{div.style.left=(-my.wd)+'px'
div.style.top=(my.wd*0.1)+'px'
div.style.opacity=0}}
function go(){my.shapes=[];my.score=0
scoreDraw()
success(false)
my.findRad=my.wd*0.08
let lt=50
let tp=50
let trys=0
do{let wd=(0.8+Math.random()*0.2)*my.wd*0.1
let ht=wd
lt=Math.random()*(my.wd-wd-20)
tp=my.ht*0.15+Math.random()*my.ht*0.7
let closeQ=false
for(i=0;i<my.shapes.length;i++){if(dist(lt-my.shapes[i].lt,tp-my.shapes[i].tp)<wd*1.4){closeQ=true
break}}
if(!closeQ){let ang=(Math.random()-0.5)*2.5
var tempShape={lt:lt,tp:tp,wd:wd,ht:ht,ang:ang,shadowQ:false}
my.shapes.push(tempShape);}}while(my.shapes.length<my.countN&&trys++<50)
console.log('my.shapes',my.shapes)
for(var i=0;i<my.shapes.length;i++){let shape=my.shapes[i]
shape.foundQ=false
var top=(shape.tp-shape.wd*1.05+70)
var div=document.getElementById('bf'+i);div.style.width=shape.wd+'px';div.style.left=shape.lt+'px';div.style.top=top+'px';div.style.transform="rotate("+shape.ang+"rad)";div.style.opacity=my.alphaLo
if(shape.shadowQ){div.style.filter='drop-shadow(5px 5px 5px #222)';}else{div.style.filter='none';}}}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function soundBtnHTML(){let s=''
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
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){let div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function soundToggle(){let btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}