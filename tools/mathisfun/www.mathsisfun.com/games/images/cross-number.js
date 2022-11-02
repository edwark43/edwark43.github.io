let my={}
function crossnumberMain(mode){let version='0.79';this.mode=typeof mode!=='undefined'?mode:'1';w=350;h=350;my.opts={gameN:0,bdSz:5}
my.gameN=optGet('gameN')
my.games=[{name:'easy',dict:'nums',hard:1,xn:8,yn:5,clueN:8,blankPct:50},{name:'medium',dict:'nums',hard:1,xn:10,yn:7,clueN:20,blankPct:40},{name:'hard',dict:'nums',hard:1,xn:10,yn:9,clueN:26,blankPct:20},]
my.game=my.games[my.gameN]
my.tileLoClr='#ffff00';my.tileHiClr='#aaaaff';my.soundQ=true
my.activeQ=true
let s="";my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'kids-cheer.mp3" preload="auto"></audio>';s+='<audio id="sndPlace" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>';s+='<audio id="sndClear" src="'+my.sndHome+'pheew.mp3" preload="auto"></audio>';my.snds=[];s+=arrowBoxHTML()
s+='<div style="position:relative; margin:auto; display:block; border: none; text-align: center;">';s+='<div id="controls" style="position:relative; font: 24px Arial; text-align:center; padding:5px; border-radius: 10px;">'
s+='<button id="restart" style="font: 14px Arial; height:30px; vertical-align:middle; z-index: 10;" class="btn" onclick="optPop()" >New Game</button>';my.soundQ=true
s+=soundBtnHTML()
s+='</div>'
s+='<div id="msg" style="position:relative; font: 24px Arial; text-align:center; padding-top:5px; height:30px; background-color:#ffffe8; border-radius: 10px;">&nbsp;</div>'
s+='<div id="board" style="position: relative; width:'+w+'px; border: 1px solid blue;"></div>';s+='<div id="ansBox" class="arrowTop" style="position: absolute; left: 50px; top: 6px; visibility: hidden;  z-index:3;"></div>';s+='<div id="clues" style="z-index:3; background-color:#def; padding-bottom:5px;"></div>';s+='<div style="font: 11px Arial; color: #6600cc; text-align:left;"> &nbsp; &copy; 2021 MathsIsFun.com  v'+version+'</div>';s+=optPopHTML();s+='</div>';document.write(s);my.bd=[]
my.boxWd=20
gameNew()}
function gameWindoneQ(){var n=cluesRemaining()
console.log('gameWinCheck',n)
if(n<15){msg(n+' left to go')}else{msg('')}
if(n==0){msg('You solved it!','gold')
soundPlay('sndWin')}}
function msg(s,clr){clr=typeof clr!=='undefined'?clr:'black'
var div=document.getElementById('msg')
div.innerHTML=s
div.style.color=clr}
function gameNew(){my.clues=[]
let dict=my.game.dict;switch(dict){case "nums":loadDictNums(dict);afterDictLoaded();break;default:}}
function loadDictNums(type){let maxLen=my.game.xn*my.game.yn
console.log("maxLen="+maxLen);my.dict=[]
for(let i=0;i<50;i++){let len=randomInt(4,maxLen);my.dict.push(randomNumber(len));}}
function randomNumber(len){let s=''
for(let i=0;i<len;i++){let stt=(i==0)?1:0
s+=randomInt(stt,9).toString()}
return s}
function afterDictLoaded(){bdMake()
bdFill()
bdExtra()
bdBlank()
bdDraw()
document.getElementById('clues').innerHTML=cluesHTML()}
function bdFill(){my.clues=[]
my.clueNo=1
let clue=new Clue();clue.make2Digit();clue.col=randomInt(0,my.game.xn-1);clue.row=randomInt(0,my.game.yn-1);addWord(clue,false);let attempts=0;do{clue=new Clue();clue.makeRandom();let oldQ=false
my.clues.map(myclue=>{if(clue.getClueStr()==myclue.getClueStr())oldQ=true})
if(!oldQ)addWord(clue,false);attempts++}while(attempts<300&&my.clues.length<my.game.clueN)
cluesNumber();return}
function cluesdoneQ(){let s="";for(let i=0;i<my.clues.length;i++){s+=my.clues[i].getLocationStr();s+=": ";s+=my.clues[i].getClueStr();s+=" (";s+=my.clues[i].typ;s+=") ";s+=my.clues[i].doneQ();s+="\n";}
return s}
function cluesHTML(){let s="";let dirns=['across','down'];for(let d=0;d<dirns.length;d++){let dirn=dirns[d]
s+='<div style="display:inline-block; width: 230px; text-align:left; vertical-align: top;">'
s+='<div style="display:inline-block; width: 25px; text-align:right; font-size:20px; ">'
s+=dirn
s+='</div>'
for(let i=0;i<my.clues.length;i++){let clue=my.clues[i]
if(clue.getDirnStr()==dirn){s+='<div style="text-align:left; vertical-align: top;">'
s+='<div style="display:inline-block; width: 40px; text-align:right; vertical-align: top;">'
s+=clue.clueNo.toString()
s+=": &nbsp;";s+='</div>'
let clr=clue.doneQ()?'blue':'red'
s+='<div style="display:inline-block; width: 180px;vertical-align: top; text-align:left; color:'+clr+'">'
s+=clue.getClueStr();s+='</div>'
s+='</div>'}}
s+='</div>'}
return s}
function cluesList(){let s="";for(let i=0;i<my.clues.length;i++){s+=my.clues[i].getLocationStr();s+=": ";s+=my.clues[i].getClueStr();s+="\n";}
return s}
function cluesRemaining(){let tot=0
for(let i=0;i<my.clues.length;i++){let clue=my.clues[i]
if(!clue.doneQ())tot++}
return tot}
function addWord(clue,mustTouchQ=true){let word=clue.getStr();if(word.length<2)return
let dirns=[["E",1,0,1.0],["N",0,1,1.6]];let best=null;let bestScore=0;for(let d=0;d<dirns.length;d++){let dirn=dirns[d]
let dirnName=dirn[0];let colInc=dirn[1];let rowInc=dirn[2];let dirDifficulty=dirn[3];switch(my.game.hard){case 1:dirDifficulty=3-dirDifficulty
break;case 2:break;default:}
for(var xn=0;xn<my.game.xn;xn++){for(var yn=0;yn<my.game.yn;yn++){let score=0
score+=Math.random()
let touches=0;let badTouchQ=false;let goodTouchQ=false;for(let k=0;k<word.length;k++){let letter=word.charAt(k).toUpperCase();let col=xn+k*colInc;let row=yn+k*rowInc;if(col<0||col>=my.game.xn||row<0||row>=my.game.yn){badTouchQ=true;break;}
let tile=my.bd[col][row]
if(tile.blankQ){badTouchQ=true;break;}
if(tile.str.length==1){if(tile.str==letter){if(tile.dirnStr.includes(dirnName)){badTouchQ=true;break;}else{score+=1;touches+=1;goodTouchQ=true;}}else{badTouchQ=true;break;}}}
let col=xn+word.length*colInc;let row=yn+word.length*rowInc;if(validTileQ(col,row)){if(my.bd[col][row].str.length>0)badTouchQ=true
if(my.bd[col][row].blankQ)score+=0.5}else{}
if((!mustTouchQ||goodTouchQ)&&!badTouchQ){if(score>bestScore){best={col:xn,row:yn,colInc:colInc,rowInc:rowInc,dirnName:dirnName}
bestScore=score;}}}}}
if(best==null){}else{clue.col=best.col
clue.row=best.row
clue.colInc=best.colInc
clue.rowInc=best.rowInc
my.clues.push(clue);for(let k=0;k<word.length;k++){let letter=word.charAt(k);let col=clue.col+k*clue.colInc;let row=clue.row+k*clue.rowInc;let tile=my.bd[col][row];tile.str=letter.toUpperCase();tile.dirnStr+=best.dirnName
tile.bgClr=my.tileLoClr
tile.bgClr='#eef'
tile.brdrClr='#000000'}
let col=clue.col+word.length*clue.colInc;let row=clue.row+word.length*clue.rowInc;if(validTileQ(col,row))my.bd[col][row].blankQ=true
col=clue.col+(-1)*clue.colInc;row=clue.row+(-1)*clue.rowInc;if(validTileQ(col,row))my.bd[col][row].blankQ=true}
return best;}
function validTileQ(col,row){if(col<0||col>=my.game.xn||row<0||row>=my.game.yn)return false
return true}
function cluesNumber(){my.clues.sort(function(a,b){if(a.row<b.row)return-1
if(a.row==b.row){if(a.col<b.col)return-1
return 1}
return 1});let clueNo=0;let prevRow=-1;let prevCol=-1;my.clues.map(clue=>{if(clue.row==prevRow&&clue.col==prevCol){}else{clueNo++;}
prevRow=clue.row;prevCol=clue.col;clue.clueNo=clueNo;let tile=my.bd[clue.col][clue.row];tile.setCornerText(clue.clueNo.toString());clue.setDirn();})}
class Clue{constructor(){this.typ='?'
this.num=0
this.clueStr="";this.clueNo=my.clueNo++}
makeRandom(){let fns=[[this.makeTimes,2],[this.makeNaturalSequence,1],[this.makeAddNum,2],[this.makeAddClues,2],[this.makeShuffleDigits,1],[this.makeAddDigits,2]];let chanceTot=0;for(let i=0;i<fns.length;i++){chanceTot+=fns[i][1];}
let chance=randomInt(0,chanceTot-1);let chanceSoFar=0;let i=0
for(i=0;i<fns.length;i++){chanceSoFar+=fns[i][1];if(chanceSoFar>chance)break;}
let choice=i;switch(choice){case 0:this.makeTimes();break;case 1:this.makeNaturalSequence();break;case 2:this.makeAddNum();break;case 3:this.makeAddClues();break;case 4:this.makeShuffleDigits();break;case 5:this.makeAddDigits();break;default:}}
makeNum(n){this.typ="num";this.num=n;this.clueStr=this.num.toString();}
makeShuffleDigits(){this.fromClue1=this.getRandomClue();let sFrom=this.fromClue1.num.toString()
let chars=sFrom.split('');let s="";let attempts=0;do{chars.sort(function(){return 0.5-Math.random();});s=chars.join('');attempts++;}while((s==sFrom||s.charAt(0)=="0")&&attempts<9);if(attempts>=9){this.makeAddNum();return;}
this.typ="shuffle";this.num=Number(s);this.len=s.length
this.clueStr="Shuffled digits of $1";}
make2Digit(){this.typ="2dig";this.num=randomInt(10,99);this.len=2
this.clueStr="Two digits";}
make3Digit(){this.typ="3dig";this.num=randomInt(100,999);this.len=2
this.clueStr="Three digits";}
makeNaturalSequence(){this.len=randomInt(2,4);this.upQ=(Math.random()>0.5)
let sttVal=this.upQ?randomInt(1,9-this.len):randomInt(this.len,9);let s="";for(let i=0;i<this.len;i++){let n=this.upQ?i:-i
s+=(sttVal+n).toString();}
this.typ="seq";this.num=Number(s);this.clueStr=(this.upQ?'Ascending':'Descending')+' consecutive digits'}
makeTimes(){console.log('my.clues',my.clues)
this.fromClue1=this.getRandomClue();this.val1=randomInt(2,11);this.typ="times";this.num=this.fromClue1.num*this.val1
this.len=this.num.toString().length
this.clueStr=this.val1.toString()+" times $1";}
makeAddNum(){this.fromClue1=this.getRandomClue();this.val1=randomInt(2,11);this.typ="add-num";this.num=this.fromClue1.num+this.val1
this.len=this.num.toString().length
this.clueStr="$1 plus "+this.val1.toString();}
makeAddDigits(){let attempts=0;let nSum=0
do{this.fromClue1=this.getRandomClue();nSum=this.addDigits(this.fromClue1.getStr());attempts++;}while(nSum<10&&attempts<9);if(attempts>=9){console.log("makeAddDigits too many attempts");this.makeAddNum();return;}
this.typ="add-digits";this.num=nSum;this.len=this.num.toString().length
this.clueStr="Add digits of $1";}
makeAddClues(){if(my.clues.length<2){this.makeAddNum();return;}
this.fromClue1=this.getRandomClue();do{this.fromClue2=this.getRandomClue();}while(this.fromClue2==this.fromClue1);this.typ="add-clues";this.num=this.fromClue1.num+this.fromClue2.num;this.len=this.num.toString().length
this.clueStr="$1 plus $2";}
makeNumTimesNum(){let num1=randomInt(2,11);let num2=randomInt(2,11);this.typ="nxn";this.num=num1*num2;this.len=this.num.toString().length
this.clueStr=num1.toString()+" times "+num2.toString();}
setDirn(){if(this.colInc>0){this.dirn="across";}
if(this.rowInc>0){this.dirn="down";}}
getStr(){return this.num.toString();}
getClueStr(){let s=this.clueStr;if(this.fromClue1!=null)s=s.split("$1").join('<b>'+this.fromClue1.getLocationStr()+'</b>');if(this.fromClue2!=null)s=s.split("$2").join('<b>'+this.fromClue2.getLocationStr()+'</b>');return s;}
getLocationStr(){let s=this.clueNo.toString();s+=" ";s+=this.getDirnStr()
return s;}
getDirnStr(){if(this.colInc>0)return "across"
if(this.rowInc>0)return "down"
return ''}
getRandomClue(){return my.clues[randomInt(0,my.clues.length-1)];}
bdStr(){let s=''
for(let i=0;i<this.len;i++){s+=my.bd[this.col+i*this.colInc][this.row+i*this.rowInc].str}
return s}
doneQ(){let str=this.bdStr()
let bStr
if(str.length!=this.len)return false;switch(this.typ){case '2dig':if(str.length==2)return true
break
case "3dig":if(str.length==3)return true;break;case 'shuffle':bStr=this.fromClue1.bdStr()
if(bStr.length==0)return false
if(str.length==0)return false
if(str.length!=bStr.length)return false
if(str==bStr)return false
let a0=str.split("");a0=a0.sort()
a0=a0.join("");let a1=bStr.split("");a1=a1.sort();a1=a1.join("");return(a0==a1)
case 'seq':if(str.length!=this.len)return false
let prevN=parseInt(str.charAt(0))
for(let i=1;i<this.len;i++){let n=parseInt(str.charAt(i))
if(n!=prevN+(this.upQ?1:-1))return false
prevN=n}
return true
case 'add-num':return(parseInt(str)==parseInt(this.fromClue1.bdStr())+this.val1)
case "times":return(parseInt(str)==parseInt(this.fromClue1.bdStr())*this.val1)
case 'add-digits':bStr=this.fromClue1.bdStr()
if(bStr.length==0)return false
let sum=0
for(let i=0;i<bStr.length;i++){sum+=parseInt(bStr.charAt(i))}
return(sum==parseInt(str))
case "add-clues":return(parseInt(str)==parseInt(this.fromClue1.bdStr())+parseInt(this.fromClue2.bdStr()))
case "nxn":if(this.num==Number(str))return true;break;default:}
return false}
addDigits(nStr){let sum=0;for(let i=0;i<nStr.length;i++){let si=nStr.charAt(i);sum+=parseInt(si);}
return sum;}}
function bdMake(){my.boxWd=Math.min(70,w/my.game.xn)
var bdDiv=document.getElementById('board')
while(bdDiv.firstChild){bdDiv.removeChild(bdDiv.firstChild);}
let wd=bdDiv.parentElement.clientWidth
bdDiv.style.left=(wd-my.game.xn*my.boxWd)/2+'px'
bdDiv.style.height=(my.boxWd*my.game.yn+4)+'px'
my.bd=[]
for(var xn=0;xn<my.game.xn;xn++){my.bd[xn]=[]
for(var yn=0;yn<my.game.yn;yn++){var tile=new Tile(my.boxWd,my.boxWd,xn,yn)
tile.xn=xn;tile.yn=yn;my.bd[xn][yn]=tile}}}
function bdExtra(){let news=[]
for(var xn=0;xn<my.game.xn;xn++){for(var yn=0;yn<my.game.yn;yn++){let tile=my.bd[xn][yn]
if(tile.str.length>0){if(clueNewQ("across"))news.push('a')}}}
console.log('bdExtra',news)}
function clueNewQ(dirnStr){return true}
function bdBlank(){let shows=[]
for(var xn=0;xn<my.game.xn;xn++){for(var yn=0;yn<my.game.yn;yn++){let tile=my.bd[xn][yn]
if(tile.str.length>0)shows.push(tile)}}
shows.sort(function(){return 0.5-Math.random();});let blankN=(shows.length*my.game.blankPct/100)<<0
for(let i=0;i<shows.length;i++){let show=shows[i];if(i>=blankN)show.str=''}}
function bdDraw(){if(my.bd.length==0)return
for(var xn=0;xn<my.game.xn;xn++){for(var yn=0;yn<my.game.yn;yn++){var tile=my.bd[xn][yn]
tile.draw()}}}
function boxLeft(xn){return my.boxWd*xn}
function boxTop(yn){return my.boxWd*yn}
class Tile{constructor(wd,ht,xn,yn){this.wd=wd;this.ht=ht;this.xn=xn;this.yn=yn;this.bgClr='#dde';this.fgClr='black';this.str='';this.clueNo='';this.dirnStr='';this.blankQ=false
this.origQ=false;this.cands=[];let div=document.createElement("div");div.style.width=wd+'px';div.style.height=ht+'px';div.style.position='absolute';div.style.left=boxLeft(xn)+'px';div.style.top=boxTop(yn)+'px';this.div=div;let me=this;div.addEventListener('mouseover',function(){if(!my.activeQ)return;});div.addEventListener('mouseleave',function(){if(!my.activeQ)return;});div.addEventListener('click',function(){if(!my.activeQ)return;showOpts(me);});let can=document.createElement('canvas');can.style.position="absolute";can.style.top='0px';can.style.left='0px';can.style.width='100%';can.style.height='100%';can.width=wd;can.height=ht;this.g=can.getContext("2d");div.appendChild(can);document.getElementById('board').appendChild(div);this.draw();}
valSet(val,histQ){histQ=typeof histQ!=='undefined'?histQ:true;let was=this.str;console.log('valSet',val)
if(!isNaN(parseFloat(val))){this.str=parseInt(val);soundPlay('sndPlace');}else{this.str='';soundPlay('sndClear');}
this.origQ=false;this.draw();}
setCornerText(s){this.clueNo=s}
draw(){let fgClr=this.origQ?'grey':'black';this.drawNum(this.str,fgClr);}
drawHints(clr){let g=this.g;g.clearRect(0,0,this.wd,this.ht);if(my.hintQ){for(let i=0;i<this.cands.length;i++){let cand=this.cands[i];let n=cand-1;let nx=(n%3);let ny=parseInt(n/3);g.fillStyle=clr;g.font="12px Arial";g.beginPath();g.fillText(cand,5+nx*11,14+ny*11);g.fill();}}}
drawNum(v,clr){let g=this.g;g.clearRect(0,0,this.wd,this.ht);g.strokeStyle='black';g.lineWidth=1;g.fillStyle=this.bgClr;if(my.clrNumQ&&!this.origQ)g.fillStyle='#ffe';g.beginPath();let gap=1;g.rect(gap,gap,this.wd-2*gap,this.ht-2*gap);g.fill();if(my.clrNumQ)clr=my.clrs[v][1];g.textAlign='left'
g.fillStyle=clr;g.font=((this.wd*0.7)<<0)+"px Arial";g.beginPath();g.fillText(v,((this.wd*0.32)<<0),((this.wd*0.78)<<0));g.fill();g.fillStyle='green'
g.font=((this.wd*0.33)<<0)+"px Arial";g.beginPath();g.fillText(this.clueNo,((this.wd*0.05)<<0),((this.wd*0.35)<<0));g.fill();}
win(){this.bgClr='#ffe';this.draw();}
setxy(lt,tp){this.div.style.left=lt+'px';this.div.style.top=tp+'px';}}
function optGet(name){var val=localStorage.getItem(`cross-number.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`cross-number.${name}`,val)
my.opts[name]=val}
function optPopHTML(){let s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:20px; width:320px; padding: 5px; border-radius: 9px; font:14px Arial; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+=radioHTML('Difficulty:','game',my.games,my.gameN,'radioClick');s+='<div style="float:right; margin: 0 0 5px 10px; font:16px Arial;">';s+='New game? '
s+='<button onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+=' '
s+='<button onclick="optNo()" style="font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){console.log("optpop");var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=102;pop.style.left=(w-340)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';my.gameN=radioNGet('game')
console.log('optYes',my.gameN)
optSet('gameN',my.gameN)
my.game=my.games[my.gameN]
gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function radioHTML(prompt,id,lbls,checkN,func){let s='';s+='<div style="position:relative; margin:auto; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='<div style="font: bold 16px Arial;">';s+=prompt;s+='</div>';s+='<div class="radio" style="display:inline-block; text-align:left;  background-color:rgba(100,100,255,0.1); border-radius:5px; padding:3px; margin:3px; ">';for(let i=0;i<lbls.length;i++){let lbl=lbls[i]
let idi=id+i;let chkStr=(i==checkN)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.id+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.name+' </label>';s+='<br>';}
s+='</div>';s+='</div>';return s;}
function radioNGet(name){var div=document.querySelector('input[name="'+name+'"]:checked')
var id=div.id
var n=(id.match(/\d+$/)||[]).pop();return n}
function radioClick(n){}
function arrowBoxHTML(){var s='';var bgClr='#cdf'
var borderClr='darkblue'
s+='<style type="text/css">';for(var i=0;i<2;i++){var classStr=(i==0)?'.arrowTop':'.arrowBot'
var topStr=(i==0)?'bottom':'top'
s+=classStr+' {position: relative; border: 2px solid '+borderClr+'; background: '+bgClr+'; width:98px; }';s+=classStr+':after, '+classStr+':before {'+topStr+': 100%; left: 50%; border: solid transparent; content: " "; height: 0; width: 0; position: absolute; pointer-events: none; }';s+=classStr+':after {border-color: rgba(0, 0, 0, 0); border-'+topStr+'-color: '+bgClr+'; border-width: 30px; margin-left: -29px; }';s+=classStr+':before {border-color: rgba(0, 0, 0, 0); border-'+topStr+'-color: '+borderClr+'; border-width: 32px; margin-left: -31px; }';}
s+='</style>';return s;}
function showOpts(me){console.log('showOpts',me)
var div=document.getElementById('ansBox')
if(me.origQ){div.style.visibility='hidden';return}
var dadDiv=div.parentElement
let dadRect=dadDiv.getBoundingClientRect();var bdDiv=document.getElementById('board')
let bdRect=bdDiv.getBoundingClientRect();console.log('dadRect,bdRect',dadRect,bdRect)
div.style.left=((bdRect.left-dadRect.left)+boxLeft(me.xn-0.67))+'px'
if(me.yn<3){div.style.top=((bdRect.top-dadRect.top)+boxTop(me.yn+1.5))+'px'
div.classList.remove("arrowBot")
div.classList.add("arrowTop")}else{div.style.top=((bdRect.top-dadRect.top)+boxTop(me.yn-2.9))+'px'
div.classList.remove("arrowTop")
div.classList.add("arrowBot")}
div.style.visibility='visible';var s='';var anss=['-',0,'X',1,2,3,4,5,6,7,8,9];var n=0;for(var i=0;i<4;i++){s+='<div style="font: 18px Verdana;">';for(var j=0;j<3;j++){var id=me.xn+'-'+me.yn+'-'+anss[n];s+='<div id="'+id+'" style="display: inline-block; width:30px; height:24px; line-height:24px; text-align: center;  border: 1px solid white; cursor:pointer;" onmousedown="ansDo(this)">';var ans=anss[n]
if(ans=='-')ans='&nbsp;'
s+=ans
s+='</div>';n++;}
s+='</div>';}
div.innerHTML=s;}
function ansDo(me){var ids=me.id.split('-');var xn=ids[0]
var yn=ids[1]
var tile=my.bd[xn][yn]
var div=document.getElementById('ansBox')
div.style.visibility='hidden';var val=ids[2]
console.log('val',val)
if(!isNaN(parseFloat(val)))tile.valSet(val)
if(val=='')tile.valSet(val)
console.log(cluesdoneQ())
document.getElementById('clues').innerHTML=cluesHTML()
console.log('gameWinCheck',val)
gameWindoneQ()}
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