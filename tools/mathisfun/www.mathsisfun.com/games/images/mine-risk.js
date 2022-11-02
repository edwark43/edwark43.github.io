var w,h,g,my={}
function mineriskMain(mode){my.version='0.64';my.typ=typeof mode!=='undefined'?mode:'longitudinal';w=Math.min(700,window.innerWidth-30)
h=Math.min(700,window.innerHeight-30)
console.log('w,h: ',w,h)
my.boxWd=40
my.btnClr='aliceblue';my.bombClrs={boom:'black',found:'orange'}
my.flagClr='rgb(0,255,0)'
my.clueClr='rgb(0,0,100)'
my.sizes=[2,3,4,5,6,7,8]
my.densitys=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9]
my.boardHalf=3
my.boardSize=my.boardHalf*2-1
my.density=0.3
var s=''
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="snddig" src="'+my.sndHome+'take.mp3" preload="auto"></audio>'
s+='<audio id="sndclear" src="'+my.sndHome+'ambient-click.mp3" preload="auto"></audio>'
s+='<audio id="sndflag" src="'+my.sndHome+'up.mp3" preload="auto"></audio>'
s+='<audio id="sndunflag" src="'+my.sndHome+'down.mp3" preload="auto"></audio>'
s+='<audio id="sndkaboom" src="'+my.sndHome+'fail.mp3" preload="auto"></audio>'
s+='<audio id="sndwin" src="'+my.sndHome+'success2.mp3" preload="auto"></audio>'
my.snds=[];s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:0; padding:0; display:block; border: 1px solid black; border-radius: 10px;">';s+='<div id="dot" style="position:absolute; height: 30px; width: 30px; background: radial-gradient(#9198e5 0%, #e66465 90%,  rgba(80, 80, 80, 0) 100%); border-radius: 50%; transition: all 0.4s; opacity:0; "></div>'
s+='<div id="clues" style="position:relative;"></div>'
s+='<div id="tiles" style="position:relative; z-index: 1;"></div>'
s+='<div style="position:absolute; left:0px; top:5px; font:15px Arial;">'
my.pens=["Dig","Flag","Try"];s+=penHTML()
s+='<div id="digCount" style="font:bold 17px Arial; width:40px; margin-left:5px; text-align:center;">0</div>'
s+='<button id="optBtn" type="button" style="z-index:2;" class="togglebtn" onclick="optPop()">Options</button>'
my.soundQ=true
s+='<br>'
s+=soundBtnHTML()
s+='</div>'
s+=optPopHTML();s+='<div style="position:absolute; right:0px; top:0px; font:16px Arial; color: black;">'
s+='<div style="display: inline-block; line-height:50px; vertical-align: middle; margin:0 6px;">Board Risk = </div>'
s+='<div style="display: inline-block; vertical-align: middle; text-align:center;">'
s+='Bombs'
s+='<br>'
s+='<span style="border-top:1px solid black;">Uncleared</span>'
s+='</div>'
s+='<div style="display: inline-block; line-height:50px; vertical-align: middle; margin:0 6px;"> = </div>'
s+='<div style="display: inline-block; vertical-align: middle; text-align:center;">'
s+='<span id="bombCount">0</span>'
s+='<br>'
s+='<span id="unclearedCount" style="border-top:1px solid black;">0</span>'
s+='</div>'
s+='<div style="display: inline-block; line-height:50px; vertical-align: middle; margin:0 6px;"> = <span id="boardRisk">0</span></div>'
s+='</div>'
s+='<div id="copyrt" style="font: 10px Arial; font-weight: bold; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);my.cursorEl=document.getElementById('main');my.showBombCount=1
my.flagCount=99;my.digCount=2;my.blownUpQ=false
chgSize(3)
chgDensity(2)
for(var i=0;i<my.pens.length;i++){var pen=my.pens[i];penDraw(pen,'penc'+i);}
penChg(2)
restart()}
function penHTML(){var s='';s+='<div style="width:130px; text-align:center; z-index:20;">';for(var i=0;i<my.pens.length;i++){s+='<button  id="pen'+i+'" style="width:40px; height:40px; padding: 0; margin:0; background-color:'+my.btnClr+'; cursor: pointer;" onclick="penChg('+i+')" onmouseover="keyOver(\'pen\','+i+')"  onmouseout="keyOut(\'pen\','+i+')" >';s+='<canvas id="penc'+i+'" style="position: relative; padding:0; margin: -3px 0 0 -2px; z-index: 2; border: none; width:40px; height:40px;"></canvas>';s+='</button>';}
s+='</div>';return s;}
function keyOver(t,n){var div=document.getElementById(t+n);div.style.background='#abf';}
function keyOut(t,n){var div=document.getElementById(t+n);div.style.background=my.btnClr;}
function penChg(n){my.pen=my.pens[n];radioPress(my.pens,'pen',n);makeCursor(my.cursorEl,my.pen,'gold');}
function penDraw(style,id){var w=40;var h=40;var el=document.getElementById(id);var ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);switch(style){case "Dig":g.strokeStyle='brown'
g.lineWidth=2
g.moveTo(20,7)
g.lineTo(20,30)
g.stroke()
g.beginPath()
g.rect(15,22,10,10)
g.arc(20,30,5,0,2*Math.PI)
g.fill()
break
case "Flag":g.beginPath()
g.strokeStyle=my.flagClr
g.fillStyle=my.flagClr
g.lineWidth=1
g.rect(15,12,10,10)
g.fill()
g.stroke()
g.beginPath()
g.strokeStyle='black'
g.lineWidth=2
g.moveTo(15,10)
g.lineTo(15,35)
g.stroke()
break
case "Try":g.beginPath()
g.fillStyle='#bcf'
g.arc(15,12,6,0,2*Math.PI)
g.fill()
g.beginPath()
g.strokeStyle='black'
g.lineWidth=2
g.moveTo(17.5,18)
g.lineTo(25,36)
g.stroke()
g.beginPath()
g.lineWidth=1
g.fillStyle='black'
g.moveTo(15,12)
g.lineTo(15,26)
g.lineTo(18.2,20)
g.lineTo(25,22)
g.closePath()
g.fill()
break
default:}}
function restart(){my.boxWd=Math.min(50,(Math.min(w,h-90)-60)/my.boardSize)
boardDraw()
cluesDraw()
var div=document.getElementById('main')
div.style.backgroundColor='white'
document.getElementById('digCount').innerHTML=my.digCount
var div=document.getElementById('dot')
div.style.width=my.boxWd+'px'
div.style.height=my.boxWd+'px'
div.style.left=boxLeft(my.boardHalf-1)+'px'
div.style.top=boxTop(my.boardHalf-1)+'px'
div.style.transform='scale(1)'
div.style.opacity=0
update()}
function update(){var bombN=0
var unclearedN=0
var row=0;while(row<my.boardSize){var col=0;while(col<my.boardSize){if(!(Math.abs(row-col)>=my.boardHalf?true:Math.abs(my.boardHalf*2-2-row-col)>=my.boardHalf)){var tile=my.board[row][col]
if(tile.bombQ)bombN++
if(!tile.clearQ)unclearedN++}
col++;}
row++;}
document.getElementById('bombCount').innerHTML=bombN
document.getElementById('unclearedCount').innerHTML=unclearedN
document.getElementById('boardRisk').innerHTML=Math.floor((bombN/unclearedN)*100+0.5)+'%'
if(bombN==unclearedN){success()}}
function boardDraw(){my.blownUpQ=false;my.borderTp=80;my.bombCount=0;my.spaceCount=0;my.cellCount=0;my.bombCount=0;my.totalCells=my.boardHalf*(my.boardHalf-1)*2+1;my.boardSize=my.boardHalf*2-1;my.borderLt=(w-my.boardSize*my.boxWd)/2
my.board=[]
document.getElementById('tiles').innerHTML=''
document.getElementById('clues').innerHTML=''
var row=0;while(row<my.boardSize){my.board[row]=[]
var col=0;while(col<my.boardSize){if(!(Math.abs(row-col)>=my.boardHalf?true:Math.abs(my.boardHalf*2-2-row-col)>=my.boardHalf)){var tile=new Tile(my.boxWd,my.boxWd,boxLeft(col),boxTop(row))
tile.row=row;tile.col=col;my.cellCount++;var bombQ=false;var densityToler=0
if(my.cellCount<=3)densityToler=my.density
var lowerDensity=(my.density-densityToler)*my.cellCount/my.totalCells;var upperDensity=1-(1-(my.density+densityToler))*my.cellCount/my.totalCells;var bombDensity=my.bombCount/my.cellCount
if(bombDensity<lowerDensity){bombQ=true;}else if(bombDensity>upperDensity){bombQ=false;}else{bombQ=Math.random()<my.density;}
tile.bombSet(bombQ)
if(bombQ){my.bombCount++;}else{my.spaceCount++;}
my.board[row][col]=tile}
col++;}
row++;}
my.digCount=Math.max(1,Math.floor(Math.min(my.spaceCount,my.bombCount)/6));console.log('my.board',my.board)}
function cluesDraw(){var halfB=Math.floor(my.boardHalf/2);var halfA=my.boardHalf-halfB;var clues=1;var clue,col
var row=0
while(row<my.boardHalf){var col=my.boardHalf-row-1;if(row<halfA){clue=new Clue(-Math.PI/4)
clue.setxy(boxLeft(col),boxTop(row))}else{clue=new Clue(Math.PI*3/4)
clue.setxy(boxLeft(col)+my.boxWd*my.boardHalf,boxTop(row)+my.boxWd*my.boardHalf)}
clues++;clue.setParms(row,col,1,1,my.boardHalf,'blue')
row++;}
row=my.boardHalf-1;while(row<my.boardSize){col=row-(my.boardHalf-1);if(row<my.boardHalf+halfA-1){clue=new Clue(Math.PI/4)
clue.setxy(boxLeft(col),boxTop(row)+my.boxWd)}else{clue=new Clue(-Math.PI*3/4)
clue.setxy(boxLeft(col)+my.boxWd*my.boardHalf,boxTop(row)-my.boxWd*(my.boardHalf-1))}
clues++;clue.count=bombCount(row,col,-1,1,my.boardHalf)
clue.setParms(row,col,-1,1,my.boardHalf,'green')
row++;}
var extra=0
if(3<my.boardHalf){extra=1;}
row=0;while(row<my.boardSize){if(row<halfA+extra){col=my.boardHalf-1+row;clue=new Clue(-Math.PI/2)
clues++;clue.setxy(boxLeft(col)+my.boxWd/2,boxTop(row))
clue.count=bombCount(row,col,1,0,my.boardSize-row*2);clue.setParms(row,col,1,0,my.boardSize-row*2,'yellow');}
if(!(row<halfA-1?true:row>=my.boardHalf)){col=my.boardHalf-1-row;clue=new Clue(0)
clue.setxy(boxLeft(col),boxTop(row)+my.boxWd/2)
clues++;clue.count=bombCount(row,col,0,1,my.boardSize-col*2);clue.setParms(row,col,0,1,my.boardSize-col*2,'red');}
if(!(row<my.boardHalf?true:my.boardSize-halfA<row)){col=my.boardSize+my.boardHalf-row-2;clue=new Clue(Math.PI)
clue.setxy(boxLeft(col)+my.boxWd,boxTop(row)+my.boxWd/2)
clues++;clue.count=bombCount(row,col,0,-1,(my.boardSize-row)*2-1);clue.setParms(row,col,0,-1,(my.boardSize-row)*2-1,'white');}
if(!(row<my.boardSize-halfB-extra?true:row>=my.boardSize-1)){col=-my.boardSize+my.boardHalf+row;clue=new Clue(Math.PI/2)
clue.setxy(boxLeft(col)+my.boxWd/2,boxTop(row)+my.boxWd)
clues++;clue.count=bombCount(row,col,-1,0,col*2+1);clue.setParms(row,col,-1,0,col*2+1,'black');}
row++;}}
function unclearCount(SttRow,SttCol,IncRow,IncCol,Num){var count=0;var i=0;while(i<Num){var row=SttRow+i*IncRow;var col=SttCol+i*IncCol;if(!my.board[row][col].clearQ){count++}
i++;}
return count;}
function bombCount(SttRow,SttCol,IncRow,IncCol,Num){var count=0;var i=0;while(i<Num){var row=SttRow+i*IncRow;var col=SttCol+i*IncCol;if(my.board[row][col].bombQ){count++}
i++;}
return count;}
function boxTop(RowNo){return my.borderTp+(my.boxWd*RowNo+0);}
function boxLeft(ColNo){return my.borderLt+(my.boxWd*ColNo+0);}
function success(){var div=document.getElementById('main')
div.style.backgroundColor='lightgreen'
var row=0;while(row<my.boardSize){var col=0;while(col<my.boardSize){if(!(Math.abs(row-col)>=my.boardHalf?true:Math.abs(my.boardHalf*2-2-row-col)>=my.boardHalf)){var tile=my.board[row][col]
if(tile.bombQ){tile.bombClr=my.bombClrs.found
tile.bombShowQ=true
tile.draw()}}
col++;}
row++;}
soundPlay('sndwin')}
function kaboom(){if(!my.blownUpQ){my.blownUpQ=true;var row=0;while(row<my.boardSize){var col=0;while(col<my.boardSize){if(!(Math.abs(row-col)>=my.boardHalf?true:Math.abs(my.boardHalf*2-2-row-col)>=my.boardHalf)){var tile=my.board[row][col]
if(tile.bombQ)tile.kaboom()}
col++;}
row++;}
var div=document.getElementById('main')
div.style.backgroundColor='rgba(255,0,0,0.8)'
var div=document.getElementById('dot')
div.style.transform='scale(20)'
div.style.opacity=1
setTimeout(function(){div.style.transform='scale(10)'
setTimeout(function(){div.style.transform='scale(13)'},500)},500)}}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTML('Size','size',my.sizes,'chgSize');s+=radioHTML('Density','density',my.densitys,'chgDensity');s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-400)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';restart();}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function chgSize(n){my.size=my.sizes[n];my.boardHalf=my.sizes[n];my.boardSize=my.boardHalf*2-1
radioPress2(my.sizes,'size',n);}
function chgDensity(n){my.density=my.densitys[n];radioPress2(my.densitys,'density',n);}
function radioPress(vals,id,n){for(var i=0;i<vals.length;i++){var div=document.getElementById(id+i);if(i==n){div.style.borderStyle='inset';}else{div.style.borderStyle='outset';}}}
function radioPress2(vals,id,n){var div=document.getElementById(id+n);div.checked=true;}
function flagToggle(){my.flaqQ=!my.flaqQ
toggleBtn('flagBtn',my.flaqQ)}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi")
document.getElementById(btn).classList.remove("lo")}else{document.getElementById(btn).classList.add("lo")
document.getElementById(btn).classList.remove("hi")}}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+=prompt+':';for(var i=0;i<lbls.length;i++){var idi=id+i;var lbl=lbls[i];s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');">';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function makeCursor(el,typ,clr){var div=document.createElement('canvas');var g=div.getContext('2d');if(typ.toLowerCase()=='dig')clr='brown'
if(typ.toLowerCase()=='flag')clr=my.flagClr
if(typ.toLowerCase()=='try')clr='#8af'
typ='arrow'
switch(typ.toLowerCase()){case 'none':break;case 'arrow':var wd=24;div.width=wd;div.height=wd;g.strokeStyle=clr;g.lineWidth=my.boxWd/6
g.lineCap='round';g.moveTo(2,wd-6);g.lineTo(2,2);g.lineTo(wd-6,2);g.moveTo(2,2);g.lineTo(wd,wd);g.stroke();break;case 'crosshair':var wd=30;div.width=wd;div.height=wd;g.translate(wd/2,wd/2);div.left=(-wd/2);div.style.left=(-wd/2)+'px';g.strokeStyle=clr;g.lineWidth=1;g.lineCap='round';g.moveTo(-wd/2,0);g.lineTo(wd/2,0);g.moveTo(0,-wd/2);g.lineTo(0,wd/2);g.stroke();break;default:}
el.style.cursor='url('+div.toDataURL()+'), auto';}
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
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function Tile(wd,ht,lt,tp){this.wd=wd
this.ht=ht
this.bombQ=false
this.bombShowQ=false
this.bombClr='black'
this.clearQ=false
this.flagQ=false
var div=document.createElement("div");div.style.width=wd+'px'
div.style.height=ht+'px'
div.style.position='absolute'
div.style.top=tp+'px'
div.style.left=lt+'px'
div.style.id="bones";this.div=div
var me=this
div.addEventListener('mouseover',function(){console.log('over')})
div.addEventListener('click',function(){console.log('click',div)
switch(my.pen){case 'Dig':if(my.digCount>0){if(me.bombQ){me.bombClr=my.bombClrs.found
me.bombShowQ=true}else{me.clearQ=true}
my.digCount--;document.getElementById('digCount').innerHTML=my.digCount
me.draw()
soundPlay('snddig')}
break
case 'Flag':me.flagQ=!me.flagQ
me.draw()
if(me.flagQ){soundPlay('sndflag')}else{soundPlay('sndunflag')}
break
case 'Try':if(me.bombQ){kaboom()
soundPlay('sndkaboom')}else{me.clearQ=true
me.draw()
soundPlay('sndclear')}
break
default:}
update()})
var can=document.createElement('canvas');this.div.appendChild(can)
can.style.position="absolute";can.style.top='0px'
can.style.left='0px'
can.style.width='100%'
can.style.height='100%'
can.width=wd
can.height=ht
this.g=can.getContext("2d");document.getElementById('tiles').appendChild(div);this.draw()}
Tile.prototype.draw=function(){var g=this.g
g.strokeStyle='black'
if(this.clearQ){g.fillStyle='#def'}else{if(this.explodedQ){g.fillStyle='rgb(255,100,100)'}else{g.fillStyle='#ffe'}}
g.beginPath()
g.rect(2,2,this.wd-4,this.ht-4)
g.stroke()
g.fill()
if(this.bombShowQ){g.strokeStyle=this.bombClr
g.fillStyle=this.bombClr
g.beginPath()
g.arc(this.wd/2,this.ht/2,this.wd/3,0,2*Math.PI)
g.stroke()
g.fill()}
if(this.flagQ){g.beginPath()
g.fillStyle=my.flagClr
g.rect(this.wd*0.3,this.wd*0.3,this.wd*0.4,this.ht*0.4)
g.fill()}}
Tile.prototype.kaboom=function(){this.explodedQ=true
this.bombShowQ=true
this.draw()}
Tile.prototype.bombSet=function(onQ){this.bombQ=onQ
this.draw()}
Tile.prototype.setxy=function(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}
function Clue(ang){this.ang=ang
var div=document.createElement("div");var wd=10
div.style.width=wd+'px'
div.style.height=wd+'px'
div.style.position='absolute'
div.style.id="bones";this.div=div
this.orig=50
var canWd=60
var can=document.createElement('canvas');can.style.position="absolute";can.style.top=-canWd/2+'px'
can.style.left=-canWd/2+'px'
can.width=canWd
can.height=canWd
can.zIndex=-1
this.g=can.getContext("2d");this.g.zIndex=-1
this.g.translate(canWd/2,canWd/2);this.div.appendChild(can)
var divr=document.createElement('div');this.txtRad=45
this.textLt=-this.txtRad*Math.cos(-this.ang)
this.textTp=-this.txtRad*Math.sin(-this.ang)
divr.style.position="absolute"
divr.style.left=(this.textLt-20)+'px'
divr.style.top=(this.textTp-20)+'px'
divr.style.width=40+'px'
divr.style.height=40+'px'
divr.width=40
divr.height=40
divr.style.textAlign='center'
divr.zIndex=10
this.divText=divr
var me=this
divr.addEventListener('mouseover',function(){console.log('whoopee',me.lt)
me.draw(true)
setTimeout(function(){me.draw(false)},2000)})
this.div.appendChild(divr)
document.getElementById('clues').appendChild(div);}
Clue.prototype.draw=function(pctQ){console.log('draw',pctQ)
var g=this.g
this.g.translate(-g.canvas.width/2,-g.canvas.height/2);g.clearRect(0,0,g.canvas.width,g.canvas.height)
this.g.translate(g.canvas.width/2,g.canvas.height/2);g.strokeStyle=my.clueClr
g.fillStyle=g.strokeStyle
g.beginPath()
g.drawArrow(0,0,30,1,15,10,this.ang,4)
g.fill()
g.stroke()
var txt=this.count
if(pctQ){var unclearN=unclearCount(this.sttRow,this.sttCol,this.incRow,this.incCol,this.num)
if(unclearN==0){txt='0%'}else{txt=Math.floor((this.count/unclearN)*100)+'%'}}
this.divText.innerHTML='<div style="margin:12px auto 0px auto; font:17px Arial; color:'+my.clueClr+';">'+txt+'</div>'}
Clue.prototype.setxy=function(lt,tp){this.lt=lt
this.tp=tp
this.div.style.left=lt+'px';this.div.style.top=tp+'px';}
Clue.prototype.setParms=function(sttRow,sttCol,incRow,incCol,num,clr){this.sttRow=sttRow
this.sttCol=sttCol
this.incRow=incRow
this.incCol=incCol
this.num=num
this.clr=clr
this.count=bombCount(sttRow,sttCol,incRow,incCol,num)
this.draw()}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}}