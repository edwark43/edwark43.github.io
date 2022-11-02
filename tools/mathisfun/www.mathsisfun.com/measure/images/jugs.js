let my={}
let version='0.91'
let units='liters'
let moves=0,minMoves=0,waterOffset=0
let w=480
let h=360
my.shapes=[]
my.zIndex=1
let playQ=false
let dragQ=false
function init(){my.drag={n:0,onq:false,holdX:0,holdY:0}
my.opts={name:'user'}
my.tapDrop={x:40,y:110,wd:100,ht:250}
my.drainDrop={x:370,y:40,wd:100,ht:280}
my.tapFlowHt=0
my.tapFlowInc=3
my.lvls=[[5,3,2,4],[5,4,2,4],[5,3,1,4],[5,3,4,6],[4,3,2,0],[7,5,6,0],[8,5,4,10],[9,4,6,0],[10,7,9,0],[11,6,8,14],[11,7,5,12],[11,9,8,14],[12,11,6,14],[13,11,8,0],[7,3,2,0],]
docInsert(getHTML())
makeShapes()
my.waterPattern=gettapPattern()
showIntro()
my.can=new Can('can',w,h,2)
my.moose=new Mouse(my.can.el)}
function getHTML(){let s=''
s+='<div id="main10" style="position:relative; width:'+w+'px; height:'+h+'px; border: none; border-radius: 9px; margin:auto;  box-shadow: 0px 0px 19px 10px rgba(0,0,68,0.46);display:flex;  ">'
s+='<canvas id="can" width="'+w+'" height="'+h+'" style="position:absolute; z-index:3;"></canvas>'
s+="<div id='intro-screen' style='border:2px solid black; border-radius:10px; box-shadow: 5px 5px 10px rgba(0,0,0,.5); margin:40px; padding:15px; background:#67b9ff; display:flex; text-align:center; z-index:10;'>"
s+="<div style='font-size:40px;'>The Jugs Puzzle</div>"
s+='<hr><br>'
s+="<div style='font:18px Verdana'>"
s+='<div>You have 2 jugs of different sizes & an unlimited supply of water. Can you measure the <span style="font-style:italic">exact</span> amount of water needed?</div>'
s+='</div>'
s+='<br>'
s+="<select id='level-select' style='font: 15px Verdana;'>"
for(let i=0;i<my.lvls.length;i++){let l=my.lvls[i]
s+='<option>Level '+(i+1)+': '+l[2]+' from '+l[0]+' and '+l[1]+'</option>'}
s+='</select>'
s+="<button onclick='startGame()' class='btn'>Play</button>"
s+='</div>'
s+="<div id='game-screen' style='background:linear-gradient(rgb(224, 243, 250) 0%, rgb(223, 244, 255) 70%, rgb(157, 208, 163) 71%, rgb(230, 239, 129) 100%); padding:10px; position:relative; text-align:center; width:100%;display:flex;flex-direction:column;'>"
s+="<span style='font:17px Verdana; color:black; padding-left:30px'>You need <b>exactly <span id='win-value'></span> "+units+'</b> in one jug</span> '
s+=wrap({id:'dragTip',pos:'abs',style:'left:140px; top:90px; color:red; font:22px Arial;'},'DRAG the jugs to fill and empty')
s+="<div style='z-index:100; position:absolute; bottom:0px; right:0;font-size:18px;'>"
s+="<button onclick='reset()'  class='btn' >Reset</button>"
s+="<button onclick='showIntro()'  class='btn'>Menu</button>"
s+='</div>'
s+="<div id='drain' >"
s+=getSVG('drain')
s+='</div>'
s+="<div id='tap' style='pointer-events: none; z-index:3;' >"
s+="<canvas id='tap-canvas' width=33 height=185 style=' position:absolute; top:140px; left:71px; border-top-left-radius:40%;border-top-right-radius:40%; -moz-user-select: none; user-select: none;'></canvas>"
s+=getSVG('tap')
s+='</div>'
s+='<div style="z-index:0;">'
s+=getSVG('puddle')
s+='</div>'
s+="<div id='jugs-container' style='display: block; z-index:0; '></div>"
s+='</div>'
s+="<div id='win-screen' style='font-size:24px; display:block; visibility: hidden; background-color: rgba(0,0,256,0.5); border-radius:10px; padding:15px; box-shadow: 5px 5px 10px rgba(0,0,0,.5); position:absolute; left:0%; top:120px; text-align:center;margin:50px; width:75%;flex-direction:column; z-index:100;'>"
s+="<div style='font-size:40px; color: white;'>You did it!</div>"
s+="<div style='padding:10px; color: white;'>"
s+="<div>In <span id='tot-moves'></span> moves </div>"
s+='</div>'
s+="<button onclick='showIntro()' class='btn'>Play Again</button>"
s+='</div>'
s+='<div id="moves" style="position: absolute; left: 215px; bottom: 3px; font: 30px Arial; color: blue; ">0</div>'
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2022 Rod Pierce  v${version}`)
s+='</div>'
return s}
function gettapPattern(){let canvas=document.getElementById('tap-canvas')
let g=canvas.getContext('2d')
g.fillStyle='rgba(0,200,255,0.8)'
for(let i=0;i<50;i++){g.beginPath()
g.arc(Math.random()*canvas.width,Math.random()*canvas.height,Math.random()*4,0,Math.PI*2)
g.fill()}
g.fillStyle='rgba(0,100,255,0.8)'
g.fillRect(0,0,canvas.width,canvas.height)
let pattern=g.createPattern(canvas,'repeat')
g.clearRect(0,0,canvas.width,canvas.height)
return pattern}
function getJugsHTML(){let s=''
function jugN(n,sz){let letter=['a','b','c','d'][n]
s+="<div id='jug-"+letter+"' style='background:rgba(255,255,255,.75); position:absolute; top:0; left:0;'>"
s+="<div style='box-shadow: 3px 3px 8px rgba(0,0,0,.5); border-bottom-left-radius:6px; border-bottom-right-radius:6px; border:3px solid black; width:60px; height:"+sz+"px; border-top:1px solid grey; position:relative;'>"
s+="<div id='jug-"+letter+"-water' style='position:absolute;bottom:0;width:100%;height:0;background:rgba(10,150,255,1);'></div>"
s+="<div id='jug-"+letter+"-label' style='font: bold 16px/19px Arial; color:black; margin:5px;position:absolute;bottom:0; text-align: center; width:50px;'></div>"
s+='</div>'
s+='</div>'}
for(let i=0;i<2;i++){jugN(i,my.shapes[i].size*15)}
return s}
function makeShapes(){let alphas=['a','b']
my.shapes=[]
for(let i=0;i<2;i++){my.shapes.push(new Shape(160+i*100,130,0,0,alphas[i]))}}
function Shape(x,y,size,value,letter){this.x=x
this.y=y
this.size=size
this.value=value
this.letter=letter
this.wd=65
this.ht=30*this.size
console.log('Shape',size,value,letter,this.ht)
let el=document.createElement('canvas')
el.style.position='absolute'
document.getElementById('main10').appendChild(el)
let ratio=2
el.width=(this.wd+5)*ratio
el.height=this.ht*ratio
el.style.width=this.wd+5+'px'
el.style.height=this.ht+'px'
el.style.zIndex=my.zIndex++
this.el=el
this.g=el.getContext('2d')
this.g.setTransform(ratio,0,0,ratio,0,0)}
Shape.prototype.moveMe=function(){this.el.style.left=this.x+'px'
this.el.style.top=this.y+'px'
this.jugEl.style.left=this.x+'px'
this.jugEl.style.top=this.y+'px'}
Shape.prototype.drawMe=function(){this.wd=65
this.ht=15*this.size
let g=this.g
g.clearRect(0,0,this.el.width,this.el.height)
let fraction=this.value/this.size
this.jugEl=document.getElementById('jug-'+this.letter)
this.waterEl=document.getElementById('jug-'+this.letter+'-water')
let max=Number(this.jugEl.clientHeight)
max=Math.min(max,this.jugEl.clientHeight-2)
this.waterEl.style.height=max*fraction+'px'
this.label=document.getElementById('jug-'+this.letter+'-label')
this.label.innerHTML=Math.round(this.value)+'<br>'+units}
function animStt(){console.log('animStt',my.anim)
anim()}
function anim(){let animQ=false
let g,canvas
let speed=0.08
if(my.anim.type=='tap'){let shape=my.anim.toShape
document.getElementById('dragTip').style.display='none'
canvas=document.getElementById('tap-canvas')
g=canvas.getContext('2d')
my.anim.g=g
my.tapFlowHt+=my.tapFlowInc
if(my.tapFlowHt>10)my.tapFlowInc=-2
if(my.tapFlowHt<0)my.tapFlowInc=4
waterOffset=shape.y+shape.ht-140+my.tapFlowHt-shape.value*15
g.fillStyle=my.waterPattern
g.translate(0,waterOffset)
g.clearRect(0,0,canvas.width,300)
g.fillRect(0,0,canvas.width,-waterOffset)
g.translate(0,-waterOffset)
if(shape.value<shape.size){shape.value+=speed
shape.drawMe()
animQ=true}}
if(my.anim.type=='drain'){speed=0.2
let shape=my.anim.fromShape
if(shape.value>0){shape.value-=speed
shape.drawMe()
animQ=true}}
if(my.anim.type=='tfr'){let fromShape=my.anim.fromShape
let toShape=my.anim.toShape
console.log('tfr',fromShape,toShape)
if(fromShape.value>0&&toShape.value<toShape.size){fromShape.value-=speed
toShape.value+=speed
fromShape.drawMe()
toShape.drawMe()
animQ=true}}
if(animQ){requestAnimationFrame(anim)}else{if(my.anim.type=='tap')g.clearRect(0,0,canvas.width,canvas.height)
winCheck()}}
function setLevel(n){let lvl=my.lvls[n]
for(let i=0;i<2;i++){my.shapes[i].size=lvl[i]
my.shapes[i].value=0}
my.winValue=lvl[2]
minMoves=lvl[3]
document.getElementById('jugs-container').innerHTML=getJugsHTML()}
function reset(){for(let i=0;i<2;i++){my.shapes[i].value=0
my.shapes[i].drawMe()}
moves=0
document.getElementById('win-value').innerHTML=my.winValue
document.getElementById('moves').innerHTML=moves.toString()}
function startGame(){document.getElementById('intro-screen').style.display='none'
document.getElementById('win-screen').style.visibility='hidden'
document.getElementById('game-screen').style.display='flex'
setLevel(document.getElementById('level-select').selectedIndex)
for(let i=0;i<2;i++){my.shapes[i].drawMe()
my.shapes[i].moveMe()}
reset()}
function showIntro(){document.getElementById('intro-screen').style.display='block'
document.getElementById('game-screen').style.display='none'
document.getElementById('win-screen').style.visibility='hidden'}
function winCheck(){for(let i=0;i<2;i++){if(Math.round(my.shapes[i].value)==my.winValue){console.log('i',i,my.shapes[i].value,Math.round(my.shapes[i].value),my.winValue)
win()}}
return}
function win(){document.getElementById('tot-moves').innerHTML=moves
document.getElementById('intro-screen').style.display='none'
document.getElementById('win-screen').style.visibility='visible'}
function getSVG(name){let s=''
if(name=='drain'){s+="<svg height='50' width='85' viewBox='0 0 400 200'  style='border:1px solid black; background:#424242;border-radius:50%;position:absolute;bottom: 50px; right:20px'>"
s+="<path stroke='#444' fill='#aaa' d='M 200.43791,2.8465644e-6 C 130.28961,3.8470329 29.00435,11.226712 0,93.299012 2.14016,168.3893 91.66329,187.27329 146.68645,197.14524 c 85.3929,7.24106 200.42459,7.01962 251.76759,-79.67826 C 412.81282,45.142372 323.71682,17.128452 273.25207,6.8239329 249.23899,2.1755229 224.82844,0.01162285 200.43791,2.8465644e-6 Z M 213.17924,9.4262829 c 12.36753,-0.15447 40.979,4.2401891 34.66103,23.4856291 -15.39503,16.51929 -41.6562,15.2438 -60.68748,7.2732 -19.4853,-6.82528 -5.69599,-29.26806 9.56856,-28.78644 5.38724,-1.36178 10.9284,-1.9664291 16.45789,-1.9723891 z M 75.31132,62.601682 c 12.36753,-0.15447 40.979,4.24019 34.66102,23.48563 -15.39502,16.519298 -41.65619,15.243798 -60.68747,7.2732 -19.4853,-6.82527 -5.69599,-29.26806 9.56856,-28.78644 5.38724,-1.36177 10.9284,-1.96642 16.45789,-1.97239 z m 261.63705,2.36102 c 12.36754,-0.15447 40.979,4.24018 34.66103,23.48563 -15.39503,16.519298 -41.6562,15.243798 -60.68748,7.2732 -19.48531,-6.82527 -5.696,-29.26805 9.56855,-28.78644 5.38725,-1.36177 10.9284,-1.96642 16.4579,-1.97239 z m -127.04788,12.44561 c 12.36754,-0.15447 40.979,4.24018 34.66103,23.485628 -15.39503,16.5193 -41.6562,15.2438 -60.68748,7.2732 -19.48531,-6.82527 -5.69599,-29.268048 9.56855,-28.786438 5.38725,-1.36177 10.92841,-1.96642 16.4579,-1.97239 z m 92.77228,64.957358 c 12.36673,-0.15424 40.97788,4.23954 34.66103,23.48386 -15.39502,16.51929 -41.6562,15.2438 -60.68748,7.2732 -19.48709,-6.82648 -5.69234,-29.26799 9.57172,-28.78548 5.3861,-1.36117 10.92648,-1.96563 16.45473,-1.97158 z m -174.14912,2.41617 c 12.36753,-0.15447 40.97899,4.2402 34.66102,23.48563 -15.39503,16.5193 -41.65619,15.2438 -60.68747,7.2732 -19.48531,-6.82527 -5.696,-29.26805 9.56855,-28.78644 5.38725,-1.36177 10.9284,-1.96642 16.4579,-1.97239 z' />"
s+='</svg>'
return s}
if(name=='tap'){s+="<svg height='100' width='100' viewBox='0 0 300 300'  style='position:absolute;top:45px;left:0;'>"
s+="<path stroke='#fff' fill='#333' d='m 116.04822,0 c 0,5.5340203 0,11.068041 0,16.602061 9.5512,-3.264657 18.69534,-8.3763259 29.08428,-7.7642689 12.39321,-0.8801278 24.78643,-1.7602556 37.17964,-2.6403834 0,9.3098033 0,18.6196073 0,27.9294103 -16.0249,-1.300031 -32.19889,-1.97314 -48.13194,-3.658721 -6.04399,-2.242618 -12.08799,-4.485236 -18.13198,-6.727854 0,5.52807 0,11.056139 0,16.584209 -6.62439,-1.46015 -9.46632,0.862166 -7.85597,7.636764 1.12895,3.824541 -3.03526,12.942244 3.75988,11.100592 18.2686,-0.304598 30.77724,18.524464 28.53337,35.572614 0,5.949757 0,11.899507 0,17.849267 6.79958,0 13.59917,0 20.39875,0 0,6.83914 0,13.67828 0,20.51742 -6.79958,0 -13.59917,0 -20.39875,0 0.004,7.27901 -0.008,14.57404 0.006,21.84305 0.3466,-4.98587 -1.20313,-13.00088 2.29405,-2.49327 7.0054,4.57192 16.09739,1.67958 24.1184,2.49331 23.4345,0.66544 47.80517,-2.95703 69.87869,7.12091 33.86949,13.62413 64.63714,45.66885 63.05898,84.21895 0,14.39775 0,28.79551 0,43.19326 -24.24964,0 -48.49929,0 -72.74893,0 0.42586,-20.08848 -12.73946,-44.71832 -35.18144,-44.70611 -18.11945,-1.11478 -36.20172,2.53403 -52.65598,10.21807 -29.75326,11.71267 -64.26824,9.82527 -93.14299,-3.6364 -14.62241,-6.23629 -30.60079,-7.0868 -46.27147992,-6.58166 0,-29.94232 0,-59.88464 0,-89.82696 14.16143992,0 28.32288992,0 42.48432992,0 10.84207,-1.76456 7.04691,-14.1211 7.73364,-21.84306 -6.8002,0 -13.60041,0 -20.40061,0 0,-6.83914 0,-13.67829 0,-20.51743 6.8002,0 13.60041,0 20.40061,0 C 50.71296,96.595335 46.56187,77.716587 60.46934,66.044865 65.0161,55.785442 85.07728,65.333181 82.34457,53.122187 81.00675,49.34559 85.25349,39.984438 79.79898,40.324536 c -7.65305,2.494388 -4.86195,-5.455387 -5.29365,-10.182352 0,-10.04735 0,-20.094701 0,-30.1420508 C 88.35295,4.6042111e-5 102.20063,3.1039894e-4 116.04822,0 Z m 66.26392,34.126906 c 0.3484,-0.07239 -0.0244,0.111537 0,0 z m 0.13003,0.01016 c 0.70415,-0.74447 0.70287,0.755742 0,0 z m 0.52572,-0.02977 c 0,-9.304513 0,-18.609027 0,-27.91354 10.18338,0.6849784 10.10397,27.284593 0,27.91354 z m 0,-27.91354 c -0.86468,0.1964818 0.0556,-0.2729664 0,0 z m -0.32324,-0.017882 c -0.44473,0.4750728 -0.44505,-0.4721853 0,0 z M 7.5731501,6.154029 c 0.82561,-0.175044 -0.0531,0.2595913 0,0 z m 0,0.039727 c 0,9.304513 0,18.609027 0,27.91354 -10.29025,-1.621711 -10.2921,-26.2929556 0,-27.91354 z m 0,27.91354 c 1.45128,-0.323967 -0.0929,0.456001 0,0 z m 0.54243,0.0317 c 0.15443,-0.167178 0.15398,0.16136 0,0 z m 0.11517,-0.01016 c 0,-9.309143 0,-18.618286 0,-27.9274291 C 24.25229,7.4930302 40.44945,8.1842293 56.36252,9.8448229 c 6.04714,2.2477551 12.09429,4.4955111 18.14143,6.7432661 1.87107,6.510279 -2.14545,8.924223 -7.95606,10.089922 -7.0023,3.182334 -14.2587,5.031712 -21.98383,4.867496 -12.11111,0.86111 -24.22221,1.722219 -36.3333099,2.583329 z m 0,-27.9274291 c -0.93524,0.1959113 0.0609,-0.2947522 0,0 z M 299.84135,289.37912 c -0.58928,4.64807 2.56204,13.03674 -5.09117,10.62088 -22.55259,0 -45.10517,0 -67.65776,0 0.58928,-4.64807 -2.56203,-13.03674 5.09118,-10.62088 22.55259,0 45.10517,0 67.65775,0 z' />"
s+='</svg>'
return s}
if(name=='puddle'){s+="<svg width=150 height=50 viewBox='0 0 400 150' style='position:absolute; bottom:10px; left:10px;'>"
s+="<path fill='#3383ff' d='M 170.38308,4.7675883e-8 C 160.56352,1.0584195 134.14036,-0.49423802 135.89395,11.368304 c 17.63704,5.176146 36.95664,4.204572 54.84644,0.578131 10.02246,-0.18845 14.84152,-10.6928535 1.65721,-10.58098 C 185.12422,0.20181718 177.73443,0.03055545 170.38308,4.7675883e-8 Z M 283.83951,8.42755 c -21.90462,0.7150356 -45.33268,0.040414 -65.3337,10.265725 -16.22065,6.572456 -37.12424,1.262391 -55.13529,4.919534 -19.89993,2.36639 -40.61629,4.07477 -58.89824,12.890718 -8.598257,3.819576 5.59699,12.989185 -8.495607,10.684631 C 66.146654,48.874756 35.081994,49.441748 7.1804746,61.255712 -12.690142,73.404107 19.963912,83.29065 30.457124,84.262493 c 14.931807,3.260153 30.222569,4.328496 45.327829,6.29536 3.667381,3.885385 -14.278059,11.205887 -1.323878,16.192877 24.147551,10.48797 51.275605,10.56592 77.130475,12.68294 48.10023,1.71946 96.65968,2.24379 144.33126,-5.22815 11.75336,-1.2518 31.959,-7.52561 20.67224,-21.144017 14.20053,-4.14729 29.86384,-2.591764 44.47078,-5.965176 13.56274,-3.264978 31.87656,-4.194814 38.86906,-17.933645 C 395.41515,52.624055 373.25,51.041193 359.13825,46.814485 c -19.79139,-4.506838 -40.23043,-4.115076 -60.21757,-6.70005 -9.82215,-7.614977 15.23768,-5.758786 20.27728,-7.420047 8.23615,-0.15591 39.82238,-5.976363 20.5309,-15.742627 C 321.99068,10.265613 302.6488,8.7283017 283.83951,8.42755 Z M 361.55195,106.67 c -6.78547,0.56887 -31.19615,0.1708 -25.19479,9.72577 17.80675,4.99241 37.51651,5.73608 55.42829,0.73562 18.29636,-8.82752 -23.60602,-10.77067 -30.2335,-10.46139 z M 75.732024,126.15272 c -16.933699,0.52835 -35.178038,0.86704 -50.152948,9.70054 -5.147658,14.3355 23.086791,11.88096 32.800299,13.73322 22.605118,0.53386 47.086735,1.90226 67.505595,-9.28702 5.14766,-14.33549 -23.08679,-11.88096 -32.800296,-13.73322 -5.778989,-0.29946 -11.566367,-0.41266 -17.35265,-0.41352 z'"
s+='</svg>'
return s}}
class Mouse{constructor(el){console.log('new moose')
el.addEventListener('touchstart',this.onTouchStart.bind(this),false)
el.addEventListener('touchmove',this.onTouchMove.bind(this),false)
window.addEventListener('touchend',this.onTouchEnd.bind(this),false)
el.addEventListener('mousedown',this.onMouseDown.bind(this),false)
el.addEventListener('mousemove',this.onMouseMove.bind(this),false)
window.addEventListener('mouseup',this.onMouseUp.bind(this),false)
this.el=el
this.ratio=1
this.lastTouch=null}
onTouchStart(ev){console.log('onTouchStart',this)
let touch=ev.targetTouches[0]
this.lastTouch=touch
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
this.onMouseDown(ev)}
onTouchMove(ev){let touch=ev.targetTouches[0]
this.lastTouch=touch
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
this.onMouseMove(ev)}
onTouchEnd(ev){let touch=this.lastTouch
ev.clientX=touch.clientX
ev.clientY=touch.clientY
ev.touchQ=true
my.moose.onMouseUp(ev)}
onMouseDown(ev){let mouse=this.mousePos(ev)
console.log('moose doon',mouse.x,mouse.y,my.shapes)
my.drag.onQ=false
my.drag.n=this.hitFind(my.shapes,mouse)
if(my.drag.n>=0){console.log('drrragin!',my.drag.n)
let shape=my.shapes[my.drag.n]
my.drag.holdX=mouse.x-shape.x
my.drag.holdY=mouse.y-shape.y
shape.shadQ=true
document.getElementById('jug-'+shape.letter).style.zIndex=my.zIndex++
my.drag.onQ=true}
ev.preventDefault()}
onMouseMove(ev){let mouse=this.mousePos(ev)
if(my.drag.onQ){let shape=my.shapes[my.drag.n]
let pt={x:mouse.x-my.drag.holdX,y:mouse.y-my.drag.holdY}
shape.x=pt.x
shape.y=pt.y
shape.moveMe()}else{if(this.hitFind(my.shapes,mouse)>=0){document.body.style.cursor='pointer'}else{document.body.style.cursor='default'}}}
onMouseUp(ev){let mouse=this.mousePos(ev)
if(my.drag.onQ){my.drag.onQ=false
let shape=my.shapes[my.drag.n]
if(this.hitTest(my.tapDrop,mouse)){moves++
my.anim={type:'tap',toShape:shape}
animStt()
return}
if(this.hitTest(my.drainDrop,mouse)){moves++
my.anim={type:'drain',fromShape:shape}
animStt()
return}
for(let i=0;i<my.shapes.length;i++){let shape2=my.shapes[i]
if(shape!=shape2){if(this.hit2Test(shape,shape2)){moves++
my.anim={type:'tfr',fromShape:shape,toShape:shape2}
animStt()
console.log('over another shape',shape,shape2)}}}}
document.body.style.cursor='default'}
mousePos(ev){let bRect=this.el.getBoundingClientRect()
return{x:(ev.clientX-bRect.left)*(bRect.width/this.ratio/bRect.width),y:(ev.clientY-bRect.top)*(bRect.height/this.ratio/bRect.height),}}
hitFind(pts,mouse){for(let i=0;i<my.shapes.length;i++){if(this.hitTest(my.shapes[i],mouse)){return i}}
return-1}
hitTest(shape,mouse){if(mouse.x<shape.x)return false
if(mouse.y<shape.y)return false
if(mouse.x>shape.x+shape.wd)return false
if(mouse.y>shape.y+shape.ht)return false
return true}
hit2Test(shape1,shape2){if(shape1.x+shape2.wd<shape2.x)return false
if(shape1.x>shape2.x+shape2.wd)return false
if(shape1.y+shape1.ht<shape2.y)return false
if(shape1.y>shape2.y+shape2.ht)return false
return true}}
function optGet(name){let val=localStorage.getItem(`mif.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`mif.${name}`,val)
my.opts[name]=val}
function getJSQueryVar(varName,defaultVal){let scripts=document.getElementsByTagName('script')
let lastScript=scripts[scripts.length-1]
let scriptName=lastScript.src
let bits=scriptName.split('?')
if(bits.length<2)return defaultVal
let query=bits[1]
console.log('query: ',query)
let vars=query.split('&')
for(let i=0;i<vars.length;i++){let pair=vars[i].split('=')
if(pair[0]==varName){return pair[1]}}
return defaultVal}
window.addEventListener('storage',themeChg)
themeChg()
function themeChg(){my.theme=localStorage.getItem('theme')
console.log('themeChg to',my.theme)
if(my.theme=='dark'){my.noClr='black'
my.yesClr='#036'}else{my.noClr='#f8f8f8'
my.yesClr='#dfd'}}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
class Can{constructor(id,wd,ht,ratio){this.id=id
this.wd=wd
this.ht=ht
this.ratio=ratio
let el=document.getElementById(id)
el.width=wd*ratio
el.style.width=wd+'px'
el.height=ht*ratio
el.style.height=ht+'px'
this.g=el.getContext('2d')
this.g.setTransform(ratio,0,0,ratio,0,0)
this.el=el
return this}
clear(){this.g.clearRect(0,0,this.wd,this.ht)}
mousePos(ev){let bRect=this.el.getBoundingClientRect()
let mouseX=(ev.clientX-bRect.left)*(this.el.width/this.ratio/bRect.width)
let mouseY=(ev.clientY-bRect.top)*(this.el.height/this.ratio/bRect.height)
return[mouseX,mouseY]}}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
s+={btn:()=>{if(cls.length==0)cls='btn'
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>'<div',edit:()=>{let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<textarea onkeyup="'+fn+'" onchange="'+fn+'"'
return s},inp:()=>{if(cls.length==0)cls='input'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input value="'+txt+'"'
s+=fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''
return s},out:()=>{pos='dib'
if(cls.length==0)cls='output'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<span '
return s},rad:()=>{if(cls.length==0)cls='radio'
return '<form'+(fn.length>0?(s+=' onclick="'+fn+'"'):'')},sel:()=>{if(cls.length==0)cls='select'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<select '
s+=fn.length>0?'  onchange="'+fn+'"':''
return s},sld:()=>'<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"',}[tag]()||''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+={btn:()=>'>'+txt+'</button>',can:()=>'></canvas>',div:()=>' >'+txt+'</div>',edit:()=>' >'+txt+'</textarea>',inp:()=>'>'+(lbl.length>0?'</label>':''),out:()=>' >'+txt+'</span>'+(lbl.length>0?'</label>':''),rad:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
s+='<input type="radio" id="r'+i+'" name="typ" style="cursor:pointer;" value="'+opts[i][0]+'" '+chk+' />\n'
s+='<label for="r'+i+'" style="cursor:pointer;">'+opts[i][1]+'</label><br/>\n'}
s+='</form>'
return s},sel:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let opt=opts[i]
let idStr=id+i
let chkStr=opt.descr==txt?' selected ':''
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+opt.descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'
return s},sld:()=>'>',}[tag]()||''
s+='\n'
return s.trim()}
init()