var w,h,g,g2,my={};function wordsearchMain(){var version='0.52';w=675;h=500;my.hiTiles=[]
my.drag={onQ:false,x:0,y:0}
my.bd=[];my.opt={wd:12,ht:12,wordN:15,overlapTgt:2,maxAttempts:3,fill:'match',case:'up',dirType:'wasdqezx',dict:'math'}
my.cases={up:{type:'up',name:'UPPER'},low:{type:'low',name:'lower'},title:{type:'title',name:'Title'},rand:{type:'rand',name:'rANdoM'},vary:{type:'vary',name:'vARiATIons'}}
my.dicts={math:{name:'Mathematics',type:'file',url:'math-large.txt',words:''},measure:{name:'Measurement',type:'file',url:'measure.txt',words:''},time:{name:'Time',type:'file',url:'time.txt',words:''},seasons:{name:'Seasons',type:'file',url:'seasons.txt',words:''},money:{name:'Money',type:'file',url:'money.txt',words:''},shapes:{name:'Shapes',type:'file',url:'shapes.txt',words:''},comp:{name:'Computers',type:'file',url:'computers.txt',words:''},energy:{name:'Energy',type:'file',url:'energy.txt',words:''},elements:{name:'Elements',type:'file',url:'elements.txt',words:''},science:{name:'Science',type:'file',url:'science.txt',words:''},plants:{name:'Plants',type:'file',url:'plants.txt',words:''},happy:{name:'Happy',type:'file',url:'happy.txt',words:''},positive:{name:'Positive',type:'file',url:'positive.txt',words:''},dogs:{name:'Dogs',type:'file',url:'dogs.txt',words:''},pals:{name:'Palindromes',type:'file',url:'palindromes.txt',words:''},country:{name:'Countries',type:'file',url:'country.txt',words:''},adjectives:{name:'Adjectives',type:'file',url:'adjectives.txt',words:''},adverbs:{name:'Adverbs',type:'file',url:'adverbs.txt',words:''},verbs:{name:'Verbs',type:'file',url:'verbs.txt',words:''},preps:{name:'Prepositions',type:'file',url:'prepositions.txt',words:''},prons:{name:'Pronouns',type:'file',url:'pronouns.txt',words:''},cons:{name:'Conjunctions',type:'file',url:'conjunctions.txt',words:''},num:{name:'Numbers',type:'num',url:'',words:''},rand:{name:'Random Letters',type:'ltr',url:'',words:''},}
my.fills={alpha:{type:'alpha',name:'Letters'},match:{type:'match',name:'Similar Letters'},blank:{type:'blank',name:'Blanks'}}
my.dirTypes={ds:{dirStr:'ds',name:'Down, right'},wasd:{dirStr:'wasd',name:'Up,down,left,right'},qezx:{dirStr:'qezx',name:'Diagonals'},wasdqezx:{dirStr:'wasdqezx',name:'All'}}
my.dirs={d:{id:'d',name:'horizontal',move:{x:1,y:0},dir:'right',compass:'E'},a:{id:'a',name:'horizontalBack',move:{x:-1,y:0},dir:'left',compass:'W'},s:{id:'s',name:'vertical',move:{x:0,y:1},dir:'down',compass:'S'},w:{id:'w',name:'verticalUp',move:{x:0,y:-1},dir:'up',compass:'N'},x:{id:'x',name:'diagonal',move:{x:1,y:1},dir:'',compass:'SE'},e:{id:'e',name:'diagonalUp',move:{x:1,y:-1},dir:'',compass:'NE'},q:{id:'q',name:'diagonalBack',move:{x:-1,y:-1},dir:'',compass:'NW'},z:{id:'z',name:'diagonalUpBack',move:{x:-1,y:1},dir:'',compass:'SW'},}
my.presets={short:{name:'Short',cols:6,rows:6,diff:1,dict:'images/dict-short.txt'},sml:{name:'Small',cols:6,rows:6,diff:1,dict:'images/dict-short.txt'},med:{name:'Medium',cols:6,rows:6,diff:1,dict:'images/dict-short.txt'},wide:{name:'Wide',cols:6,rows:6,diff:1,dict:'images/dict-short.txt'},lrg:{name:'Large',cols:6,rows:6,diff:1,dict:'images/dict-short.txt'},num:{name:'Numbers',cols:6,rows:6,diff:1,dict:'images/dict-short.txt'},}
my.clrs=["#0000ff","#00ff00","#ff8800","#660066","#99ff00","#0099ff","#00ff99","#9900ff","#ff0099","#006666","#666600","#990000","#009999","#ff9900","#ff0000","#003399","#ff00ff","#993333","#330099"];my.clrN=0
var s='';my.imgHome=(document.domain=='localhost')?'/mathsisfun/images/':'/images/'
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'fanfare.mp3" preload="auto"></audio>';s+='<audio id="sndAuto" src="'+my.sndHome+'snap.mp3" preload="auto"></audio>';s+='<audio id="sndFlip" src="'+my.sndHome+'pop.mp3" preload="auto"></audio>';s+='<audio id="sndYes" src="'+my.sndHome+'up.mp3" preload="auto"></audio>';my.snds=[];my.soundQ=true
s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div id="main" style="position:relative; width:100vmin; height:100vmin; margin:auto; display:block; ">';s+='<div id="msg" style="position:absolute; display: block; left: 40vmin; top: 1vmin; width:31vmin; height:9vmin; font: 3.6vmin Arial;  color:black; text-align:center; background-color:#ffe; pointer-events: none;"></div>'
s+='<div id="title" style="position:absolute; display: block; left: 0vmin; top: 6vmin; width:40vmin; height:9vmin; font: 3.1vmin Arial;  color:orange; text-align:center; pointer-events: none;">Title</div>'
s+='<div id="words" style="position:absolute; display: block; left: 71vmin; top: 2vmin; width:26vmin; height:83vmin; font: 3.6vmin Arial;  color:black; text-align:center; pointer-events: none;"></div>'
s+='<div id="btns" style="position:absolute; left: 3px; font: 18px Arial; width:99%; z-index:3;">'
s+='<button type="button" style="" class="btn" onclick="optPop()">Options</button>'
s+='<button type="button" style="" class="btn" onclick="gameNew()">New Game</button>'
my.snds=[];my.soundQ=true
s+=' &nbsp; '
s+=soundBtnHTML()
s+='</div>'
s+='<div id="board" style=""></div>';s+='<canvas id="canvas1" style="position:absolute; display: block; width:100vw; height:100vh; left: 0px; top: 0px; z-index:2;"></canvas>';s+='<canvas id="canvas2" style="position:absolute; display: block; width:100vw; height:100vh; left: 0px; top: 0px; z-index:2;"></canvas>';s+=optPopHTML();s+='<div style="text-align: right;">';s+='<div id="copyrt" style="font: 10px Arial; font-weight: bold; color: #acf; ">&copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';s+='</div>';s+='</div>';document.write(s);var el=document.getElementById('canvas1');var ratio=3;el.width=window.innerWidth*ratio
el.height=window.innerHeight*ratio
g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);var el2=document.getElementById('canvas2');el2.width=window.innerWidth*ratio
el2.height=window.innerHeight*ratio
g2=el2.getContext("2d");g2.setTransform(ratio,0,0,ratio,0,0);el2.addEventListener('mousedown',function(ev){mouseDown(ev)})
el2.addEventListener('mouseup',function(){mouseUp()})
el2.addEventListener('touchstart',function(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseDown(ev)})
el2.addEventListener('touchend',function(ev){mouseUp(ev)})
el2.addEventListener('mousemove',function(ev){mouseMove(ev)})
el2.addEventListener('touchmove',function(ev){console.log('touchmove')
var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseMove(ev)})
my.wordStr='angle,area,Apex,Calculate,centimetre,Circle,Cone,decimal,degrees,diameter,Digit,equation,equilateral,Estimate,factor,Fraction,Hexagon,integer,isosceles,litre,multiple,negative,Pentagon,positive,prime,Prism,quotient,radius,Random,Spiral,times,Volume,Zero'
radioSet('fill',my.opt.fill)
radioSet('case',my.opt.case)
radioSet('dirType',my.opt.dirType)
radioSet('dict',my.opt.dict)
optPop()}
function dictLoad(){console.log('dictLoad',my.opt.dict)
var url=my.imgHome+'words/'+my.opt.dict.url
var rawFile=new XMLHttpRequest();rawFile.open("GET.html",url,true);rawFile.onreadystatechange=function(){if(rawFile.readyState===4){if(rawFile.status===200||rawFile.status==0){my.opt.dict.words=rawFile.responseText
if(my.opt.dict.words.length==0)my.opt.dict.words=my.wordStr
gameNew()}}}
rawFile.send(null);}
function tileAt(x,y){var xn=Math.floor((x-my.borderLt)/my.boxWd)
var yn=Math.floor((y-my.borderTp)/my.boxWd)
if(xn<0)return null
if(yn<0)return null
if(xn>=my.opt.wd)return null
if(yn>=my.opt.ht)return null
if(my.bd.length==0)return null
return my.bd[xn][yn]}
function boxLeft(xn){return my.borderLt+my.boxWd*xn}
function boxTop(yn){return my.borderTp+my.boxWd*yn}
function mouseDown(ev){console.log('mouseDown')
var rect=g.canvas.getBoundingClientRect();var x=ev.clientX-rect.left
var y=ev.clientY-rect.top
var tile=tileAt(x,y)
my.tileFrom=tile
my.tileTo=tile
my.drag.onQ=true
my.drag.x=x
my.drag.y=y
ev.preventDefault()
console.log('mousedown',my.drag)}
function mouseMove(ev){if(!my.drag.onQ)return
var rect=g.canvas.getBoundingClientRect();var x=ev.clientX-rect.left
var y=ev.clientY-rect.top
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.strokeStyle='black'
g.beginPath()
g.moveTo(my.drag.x,my.drag.y)
g.lineTo(x,y)
g.stroke()
var tile=tileAt(x,y)
if(my.tileFrom==null)return;my.tileTo=tile
wordHilite(my.tileFrom,my.tileTo);ev.preventDefault();}
function mouseUp(){my.drag.onQ=false
tilesHiliteClear()
g.clearRect(0,0,g.canvas.width,g.canvas.height)
var found=wordHilite(my.tileFrom,my.tileTo)
if(found==undefined)return
tilesHiliteClear()
var foundn=-1
for(var i=0;i<my.words.length;i++){var word=my.words[i];if(found.wordFwd==word||found.wordRev==word){foundn=i
break}}
if(foundn<0)return
soundPlay('sndYes')
my.wordsFound.push(my.words.splice(foundn,1))
wordsShow()
g2.strokeStyle=clrHex2rgba(my.clrs[my.clrN],0.4)
my.clrN++
if(my.clrN>=my.clrs.length)my.clrN=0
g2.lineWidth=my.boxWd*0.9
g2.lineCap="round"
g2.beginPath()
g2.moveTo(boxLeft(my.tileFrom.xn)+my.boxWd/2,boxTop(my.tileFrom.yn)+my.boxWd/2)
g2.lineTo(boxLeft(my.tileTo.xn)+my.boxWd/2,boxTop(my.tileTo.yn)+my.boxWd/2)
g2.stroke()
if(my.words.length==0){soundPlay('sndWin')
winAnim()}}
function parseWords(s){var LF=String.fromCharCode(10);var CR=String.fromCharCode(13);s=s.split(CR+LF).join(",");s=s.split(CR).join(",");s=s.split(LF).join(",");var words=s.split(",")
words.sort()
var goods=[]
var prevWord=''
var regex=new RegExp(/^[a-zA-Z0-9 ]+$/i);for(var i=0;i<words.length;i++){var word=words[i]
if(word.length<2)continue
if(word.length>20)continue
if(word==prevWord)continue
prevWord=word
word=word.toLowerCase()
if(!regex.test(word))continue
goods.push(word)}
console.log('goods',words.length,goods.length)
console.log('goods',goods.join(','))
return goods}
function randomNums(){var maxLen=Math.min(my.opt.wd,my.opt.ht,10);console.log("maxLen="+maxLen);var words=[]
for(var i=0;i<50;i++){var len=randomInt(4,maxLen+1);words.push(randomNum(len,true));}
return words}
function randomNum(digits,decQ){var s="";for(var i=0;i<digits;i++){var stt=0;if(i==0)
stt=1;s+="0123456789".charAt(randomInt(stt,10));}
return s;}
function randomStrings(){var maxLen=Math.max(my.opt.wd,my.opt.ht);console.log("maxLen="+maxLen);var words=[]
for(var i=0;i<50;i++){var len=randomInt(4,maxLen+1);words.push(randomString(len));}
console.log('randomStrings',words)
return words}
function randomString(len){var alpha="abcdefghijlmnopqrstuvwxyz";var s="";for(var i=0;i<len;i++){s+=alpha.charAt(randomInt(0,25));}
return s}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function shuffle(arr){var ctr=arr.length
while(ctr>0){var index=Math.floor(Math.random()*ctr);ctr--;var temp=arr[ctr];arr[ctr]=arr[index];arr[index]=temp;}
return arr;}
function gameNew(){switch(my.opt.dict.type){case 'file':if(my.opt.dict.words.length==0){dictLoad()
return}
break
case 'num':my.opt.dict.words=randomNums().join(',')
break
case 'ltr':my.opt.dict.words=randomStrings().join(',')
break
default:console.log('Dont know how to load the words')}
document.getElementById('title').innerHTML=my.opt.dict.name
var dh=Math.max(document.documentElement.clientHeight,window.innerHeight||0)
var dw=Math.max(document.documentElement.clientWidth,window.innerWidth||0)
my.vmin=Math.min(dh,dw)/100
console.log('my.vmin',my.vmin)
my.borderTp=11*my.vmin
my.borderLt=1*my.vmin
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g2.clearRect(0,0,g2.canvas.width,g2.canvas.height)
var div=document.getElementById("board");while(div.firstChild){div.removeChild(div.firstChild);}
my.opt.orientations=my.opt.dirType.dirStr.split('')
console.log('my.opt',my.opt)
var words=parseWords(my.opt.dict.words)
shuffle(words)
var fwords=(my.opt.case=='vary')?wordsVar(words):wordsFilter(words,my.opt.wordN*4)
var p=new Puzzle()
var puzzle=p.fill(fwords);console.log('puzzle:',puzzle);my.bdSz=my.opt.wd
my.boxWd=Math.min(15,70/Math.max(my.opt.wd,my.opt.ht))*my.vmin
console.log('my',my)
my.bd=[]
for(var i=0;i<my.opt.wd;i++){my.bd[i]=[];for(var j=0;j<my.opt.ht;j++){var tile=new Tile(my.boxWd,my.boxWd,i,j,puzzle[i][j])
my.bd[i][j]=tile}}
my.wordsFound=[];wordsShow()}
function wordsVar(words){var maxLen=Math.max(my.opt.ht,my.opt.wd)
for(var i=0;i<words.length;i++){var word=words[i];if(word.length<=maxLen&&word.length>1){if(Math.pow(word.length,2)>=my.opt.wordN){var wordComb=wordCapComb(word)
shuffle(wordComb)
return wordComb.slice(0,my.opt.wordN)}}}}
function wordsFilter(words,maxN){var wordCount=0;var maxLen=Math.max(my.opt.ht,my.opt.wd)
var currWords=[];console.log('maxLen',maxLen,my.opt)
for(var i=0;i<words.length;i++){var word=words[i];if(word.length>1&&word.length<=maxLen){switch(my.opt.case.type){case 'up':word=word.toUpperCase()
break
case 'low':word=word.toLowerCase()
break
case 'title':word=word.charAt(0).toUpperCase()+word.slice(1)
break
case 'rand':var wordRand=''
for(var j=0;j<word.length;j++){var c=word.charAt(j)
if(Math.random()<0.5){wordRand+=c.toUpperCase()}else{wordRand+=c.toLowerCase()}}
word=wordRand}
currWords.push(word);wordCount++;if(wordCount>=maxN)break;}}
console.log('currWords',currWords)
return currWords}
function wordCapComb(str){var n=str.length
var arr=[]
for(var i=0;i<(1<<n);i++){var s=''
for(var j=0;j<n;j++){var c=str.charAt(j)
s+=i&(1<<j)?c.toUpperCase():c.toLowerCase()}
arr.push(s)}
return arr}
function wordsShow(){var s=''
s+='<div style="color:red;">'
for(var i=0;i<my.words.length;i++){var word=my.words[i]
s+=word+'<br>'}
s+='</div>'
s+='<div style="color:gold; margin-top:10px;">'
for(var i=0;i<my.wordsFound.length;i++){var word=my.wordsFound[i]
s+=word+'<br>'}
s+='</div>'
var div=document.getElementById('words')
div.innerHTML=s}
function tilesHiliteClear(){for(var i=0;i<my.hiTiles.length;i++){my.hiTiles[i].hilite(false)}
my.hiTiles=[]}
function wordHilite(tFrom,tTo){tilesHiliteClear()
if(tFrom==null)return
if(tTo==null)return
var colStt=tFrom.yn
var rowStt=tFrom.xn
var colFin=tTo.yn
var rowFin=tTo.xn
var colDiff=colFin-colStt;var rowDiff=rowFin-rowStt;var maxDiff=Math.max(Math.abs(colDiff),Math.abs(rowDiff));var valDirQ=false;if(colDiff==0)valDirQ=true;if(rowDiff==0)valDirQ=true;if(Math.abs(colDiff)==Math.abs(rowDiff))valDirQ=true;if(!valDirQ)return
var wordFwd="";var wordRev="";for(var i=0;i<=maxDiff;i++){var col=colStt+i*(colDiff/Math.max(1,maxDiff));var row=rowStt+i*(rowDiff/Math.max(1,maxDiff));var tile=my.bd[row][col]
my.hiTiles.push(tile)
tile.hilite(true)
var letter=tile.val
wordFwd+=letter;wordRev=letter+wordRev;}
msg(wordFwd+'<br>'+wordRev)
return{wordFwd:wordFwd,wordRev:wordRev}}
function Tile(wd,ht,xn,yn,val){this.wd=wd
this.ht=ht
this.xn=xn
this.yn=yn
this.val=val
this.bgClr='#fef'
this.fgClr='black'
this.origQ=false
this.cands=[]
var div=document.createElement("div");div.style.width=wd+'px'
div.style.height=ht+'px'
div.style.position='absolute'
div.style.left=boxLeft(xn)+'px'
div.style.top=boxTop(yn)+'px'
this.div=div
var can=document.createElement('canvas');can.style.position="absolute";can.style.top='0px'
can.style.left='0px'
can.style.width='100%'
can.style.height='100%'
can.width=wd
can.height=ht
this.g=can.getContext("2d");div.appendChild(can)
document.getElementById('board').appendChild(div);this.draw()}
Tile.prototype.clrSet=function(clr){this.bgClr=clr
this.draw()}
Tile.prototype.valSet=function(v,histQ){histQ=typeof histQ!=='undefined'?histQ:true
var was=this.val
if(v>=1&&v<=9){this.val=parseInt(v)
soundPlay('sndPlace')}else{this.val=''
soundPlay('sndClear')}
this.origQ=false
if(histQ)my.hist.push({xn:this.xn,yn:this.yn,was:was})
this.draw()}
Tile.prototype.draw=function(){var fgClr='black'
this.drawNum(this.val,fgClr)}
Tile.prototype.drawNum=function(v,clr){var g=this.g
g.clearRect(0,0,this.wd,this.ht)
g.strokeStyle='black'
g.lineWidth=1
g.fillStyle=this.bgClr
if(my.clrNumQ&&!this.origQ)g.fillStyle='#ffe'
g.beginPath()
var gap=1
g.rect(gap,gap,this.wd-2*gap,this.ht-2*gap)
g.fill()
if(my.clrNumQ)clr=my.clrs[v][1];g.fillStyle=clr
g.font=Math.round(this.wd*0.75)+'px Arial';g.textAlign='center'
g.beginPath()
g.fillText(v,Math.round(this.wd*0.5),Math.round(this.wd*0.8))
g.fill()}
Tile.prototype.hilite=function(onQ){if(onQ){this.bgClr='#bcf'}else{this.bgClr='#fef'}
this.draw()}
Tile.prototype.win=function(){this.bgClr='#ffe'
this.draw()}
Tile.prototype.setxy=function(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}
var Puzzle=function(){}
Puzzle.prototype.fill=function(words){this.bd=[]
for(var i=0;i<my.opt.wd;i++){this.bd[i]=[];for(var j=0;j<my.opt.ht;j++){this.bd[i][j]=''}}
console.log('fill opt',my.opt)
this.dirs=[]
for(var i=0;i<my.opt.orientations.length;i++){var o=my.opt.orientations[i]
this.dirs.push(my.dirs[o])}
my.words=[]
var n=0
for(i=0;i<words.length;i++){if(this.placeWord(words[i])){my.words.push(words[i])
n++
if(n>=my.opt.wordN)break}else{if(false){return null;}}}
my.words=my.words.sort(function(a,b){var nameA=a.toUpperCase();var nameB=b.toUpperCase();if(nameA<nameB)return-1
if(nameA>nameB)return 1
return 0})
switch(my.opt.fill.type){case 'alpha':var ltrs='abcdefghijklmnoprstuvwy'
if(my.opt.case.type=='up')ltrs=ltrs.toUpperCase()
this.fillBlanks(ltrs);break
case 'match':var ltrs=''
for(var i=0;i<my.words.length;i++){ltrs+=my.words[i]}
this.fillBlanks(ltrs);break
case 'blank':default:this.fillBlanks(' ');}
return this.bd}
Puzzle.prototype.placeWord=function(word){var locs=this.findBestLocs(word);if(locs.length===0)return false
var minGap=99
var tgt=my.opt.overlapTgt
for(var i=0;i<locs.length;i++){var loc=locs[i]
var gap=Math.abs(loc.overlap-tgt)
if(gap<minGap)minGap=gap}
var bests=[]
for(var i=0;i<locs.length;i++){var loc=locs[i]
var gap=Math.abs(loc.overlap-tgt)
if(gap==minGap){bests.push(loc)}}
var loc=bests[Math.floor(Math.random()*bests.length)];for(var i=0;i<word.length;i++){this.bd[loc.x+i*loc.move.x][loc.y+i*loc.move.y]=word[i];}
return true;};Puzzle.prototype.findBestLocs=function(word){var locs=[]
for(var i=0;i<my.opt.wd;i++){for(var j=0;j<my.opt.ht;j++){for(var d=0;d<this.dirs.length;d++){var dir=this.dirs[d]
var lap=this.locCheck(word,i,j,dir.move)
if(lap>=0)locs.push({x:i,y:j,move:dir.move,overlap:lap})}}}
return locs}
Puzzle.prototype.locCheck=function(word,xn,yn,move){var overlapN=0
var len=word.length-1
if(xn+len*move.x<0)return-1
if(xn+len*move.x>=my.opt.wd)return-1
if(yn+len*move.y<0)return-1
if(yn+len*move.y>=my.opt.wd)return-1
for(var i=0;i<word.length;i++){var ltr=this.bd[xn+i*move.x][yn+i*move.y]
if(ltr!=''){if(ltr==word.charAt(i)){overlapN++}else{return-1}}}
return overlapN}
Puzzle.prototype.fillBlanks=function(ltrs){for(var i=0;i<my.opt.wd;i++){for(var j=0;j<my.opt.ht;j++){if(this.bd[i][j]==''){var ltr=' '
if(ltrs.length>0){var n=Math.floor(Math.random()*ltrs.length);var ltr=ltrs[n];}
this.bd[i][j]=ltr}}}}
function winAnim(){console.log('winAnim',my.bd)
var ms=50
for(var i=0;i<my.bd.length;i++){for(var j=0;j<my.bd[i].length;j++){var n=ms*(j*my.opt.wd/2+i)
setTimeout(winOne.bind(null,i,j),n);}}}
function winOne(i,j){var tile=my.bd[i][j]
var clr=my.clrs[Math.floor(Math.random()*my.clrs.length)];clr=clrHex2rgba(clr,0.2)
tile.clrSet(clr)}
function msg(s,clr){clr=typeof clr!=='undefined'?clr:'blue'
var div=document.getElementById('msg')
div.innerHTML=s
div.style.color=clr}
function soundBtnHTML(){var onClr='blue'
var offClr='#bbb'
var s=''
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
if(simulQ){if(name.length>0){var div=document.getElementById(name)
if(div.currentTime>0&&div.currentTime<div.duration){console.log('soundPlay cloned',div.currentTime,div.duration)
div.cloneNode(true).play()}else{div.play()}}}else{my.snds.push(name)
soundPlayQueue()}}
function soundPlayQueue(){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue();};}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function radioHTML(prompt,id,lbls,checkId){var s='';s+='<div style="position:relative; margin:auto; background-color:lightblue;  ">';s+='<div style="display:inline-block; font: bold 16px Arial; margin-right: 1vmin;">';s+=prompt;s+='</div>';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';for(var i=0;i<lbls.length;i++){var lbl=lbls[i]
var idi=id+i;var chkStr=(lbl.id==checkId)?' checked ':'';s+='<label for="'+idi+'" style="white-space: nowrap; ">'
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.id+'" autocomplete="off" '+chkStr+' >';s+=lbl.name
s+='</label> ';}
s+='</div>';s+='</div>';return s;}
function radioHTMLa(prompt,id,lbls,checkId){var s='';s+='<div style="position:relative; margin:auto; background-color:lightblue;  ">';s+='<div style="display:inline-block; font: bold 16px Arial; margin-right: 1vmin;">';s+=prompt;s+='</div>';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';for(var prop in lbls){var lbl=lbls[prop]
var idi=prop
var chkStr=(lbl.id==checkId)?' checked ':'';s+='<label for="'+idi+'" style="white-space: nowrap; ">'
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.id+'" autocomplete="off" '+chkStr+' >';s+=lbl.name
s+='</label> ';}
s+='</div>';s+='</div>';return s;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-120vmin; top:2vmin; width:88vmin; padding: 1vmin; border-radius: 2vmin; font:14px Arial; background-color: #bcd; box-shadow: 2vmin 2vmin 1vmin 0 rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; z-index:4;">';s+='<div style="position:relative; margin:auto; text-align:right; ">';s+='<button onclick="optYes()" style="font: 22px Arial;" class="btn" >&#x2714;</button>';s+=' '
s+='<button onclick="optNo()" style="font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>'
s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 1vmin 0 1vmin 0; padding: 1vmin 0 1vmin 0;">';var sliders=[{id:'wd',name:'Width',val:my.opt.wd,min:1,max:16,step:1,fnName:'onJoe'},{id:'ht',name:'Height',val:my.opt.ht,min:1,max:16,step:1,fnName:'onJoe'},{id:'wordN',name:'Words',val:my.opt.wordN,min:1,max:20,step:1,fnName:'onJoe'},{id:'overlapTgt',name:'Overlap',val:my.opt.overlapTgt,min:0,max:5,step:1,fnName:'onJoe'},];for(var i=0;i<sliders.length;i++){var slider=sliders[i]
s+='<div style="background-color:lightblue;  padding: 1vmin 0 0 0;">';if(i==2)s+='<div style="font:15px Arial; margin-top:9px; ">Try to fit:</div>'
s+='<div style="display: inline-block; font:16px Arial; width: 30vmin; text-align: right; margin-right:1vmin;  ">'+slider.name+':</div>'
s+='<input type="range" id="r'+i+'" value="'+slider.val+'" min="'+slider.min+'" max="'+slider.max+'" step="'+slider.step+'"  style="width:40vmin; height:1vmin; border: none; " oninput="'+slider.fnName+'(0,this.value,\''+slider.id+'\')" onchange="'+slider.fnName+'(1,this.value,\''+slider.id+'\')" />';s+='<div id="'+slider.id+'" style="display: inline-block; width:15vmin; font: 17px Arial; color: #6600cc; text-align: left;">'+slider.val+'</div>';s+='</div>'}
s+='</div>'
s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTMLa('Fill spaces:','fill',my.fills,'',0);s+='</div>'
s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTMLa('Letter case:','case',my.cases,'',0);s+='</div>'
s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTMLa('Directions:','dirType',my.dirTypes,'',0);s+='</div>'
s+='<div style="position:relative; margin:auto; text-align:center; font:14px Arial; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+=radioHTMLa('Words:','dict',my.dicts,'',0);s+='</div>'
s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.left='3vmin'}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.left='-120vmin';var div=document.querySelector('input[name="'+'dict'+'"]:checked')
my.opt.dict=my.dicts[div.id];var div=document.querySelector('input[name="'+'fill'+'"]:checked')
my.opt.fill=my.fills[div.id];var div=document.querySelector('input[name="'+'case'+'"]:checked')
my.opt.case=my.cases[div.id];var div=document.querySelector('input[name="'+'dirType'+'"]:checked')
my.opt.dirType=my.dirTypes[div.id];gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.left='-999px';}
function onJoe(a,val,id){var div=document.getElementById(id)
div.innerHTML=val
my.opt[id]=parseInt(val)
console.log('onJoe',a,val,id,my.opt)}
function radioSet(name,setValue){var divs=document.querySelectorAll('input[name="'+name+'"]')
for(var i=0;i<divs.length;i++){var div=divs[i]
div.checked=(div.id==setValue)}}
function radioNGet(name){var div=document.querySelector('input[name="'+name+'"]:checked')
var id=div.id
var n=(id.match(/\d+$/)||[]).pop();return n}
function tabDropKingToggle(){my.tabDropKingQ=!my.tabDropKingQ;toggleBtn("tabDropKingQ",my.tabDropKingQ);}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function clrHex2rgba(hex,opacity){hex=hex.replace('#','');var r=parseInt(hex.substring(0,2),16);var g=parseInt(hex.substring(2,4),16);var b=parseInt(hex.substring(4,6),16);return 'rgba('+r+','+g+','+b+','+opacity+')';}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;}