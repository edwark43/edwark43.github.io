var w,h,el,my={};function einsteinMain(mode){this.version='0.684'
my.mode=typeof mode!=='undefined'?mode:'4Num';w=600;h=600;my.nums=["0","1","2","3","4","5","6","7","8","9"]
my.ltrs=["A","B","C","D","E","F"]
my.clrs=[["Navy",'#000080'],["Blue",'#0000FF'],["Light Blue",'#ADD8E6'],["Gold",'#ffd700'],["Yellow",'#ffff00'],["Red",'#FF0000'],["Pink",'#FFb6c1'],["Orange",'#FFA500'],["Black",'#000000']]
my.games=[{mode:"3x3",title:"3 by 3",n:3,ruleSz:48,tileSz:48,grid:[[0,0],[1,0],[0.5,1]]},{mode:"4x4",title:"4 by 4",n:4,ruleSz:48,tileSz:48,grid:[[0,0],[1,0],[0,1],[1,1]]},{mode:"5x5",title:"5 by 5",n:5,ruleSz:36,tileSz:50,grid:[[0,0],[1,0],[0,1],[1,1],[0.5,0.5]]},{mode:"6x6",title:"6 by 6",n:6,ruleSz:32,tileSz:42,grid:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]]},];my.game=my.games[0]
my.pics=[{id:"pic1",title:"Sketches",url:'../games/images/einstein-tiles.jpg',max:8},{id:"pic2",title:"Photos",url:'../games/images/einstein-tiles2.jpg',max:6},{id:"pic3",title:"Mathematics",url:'../games/images/einstein-simple.svg',max:8},];my.pic=my.pics[2]
my.dummy=[gameChg,popNo,popYes,popShow]
my.tilePos={x:204,y:40}
my.soundQ=true
var s="";s+='<style>'
s+='</style>'
var bg='background: linear-gradient(to bottom, #def 0%,#fed 100%)'
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none;  margin:auto; display:block; margin-bottom:30px; '+bg+' ">';s+='<div id="success" style="position:absolute; left:0px; top:250px; width:'+w+'px; height:60px; border: none;  margin:auto; text-align:center; display:none; margin-bottom:30px; font:50px Verdana; color:gold; z-index:2;">Well Done!</div>';s+='<div id="cans"  style="position:absolute; left:0px; top:0px; width:'+w+'px; height:'+h+'px; border: 1px solid blue;"></div>';s+='<input type="button" class="togglebtn"  style="z-index:2; position:absolute; left:'+my.tilePos.x+'px; top:3px; width:85px;" value="New Game" onclick="gameNew()"/>';s+='<input type="button" class="togglebtn"  style="z-index:2;  position:absolute; left:'+(my.tilePos.x+90)+'px; top:3px; width:85px;" value="Options" onclick="popShow()"/>';s+='<div style="z-index:2;  position:absolute; left:'+(my.tilePos.x+180)+'px; top:3px; width:85px;">';s+=soundBtnHTML()
s+='</div>'
s+=popHTML();s+='<div id="copyrt" style="font: 11px Arial; position:absolute; bottom:2px; right: 2px;">&copy; 2018 MathsIsFun.com  v'+this.version+'</div>';s+='<audio id="click" src="../images/sounds/click1.mp3" preload="auto"></audio>';s+='<audio id="successsnd" src="../images/sounds/success.mp3" preload="auto"></audio>';s+='<audio id="failsnd" src="../images/sounds/swish.mp3" preload="auto"></audio>';s+='</div>';document.write(s)
my.ruleMax=120
my.img=new Image()
my.img.src=my.pic.url
if(my.img.complete){loaded()}else{my.img.addEventListener('load',loaded)}
my.drags=[]
my.dragNo=0
my.dragQ=false
document.addEventListener('mouseup',function(){my.dragQ=false;});el=document.getElementById('cans')
el.width=w
el.height=h
el.addEventListener("mousedown",mouseDown,false);el.addEventListener('touchstart',touchStart,false);el.addEventListener("mousemove",pointerChg,false);}
function picChg(n){console.log('picChg',n)
my.pic=my.pics[n]}
function success(onq){var div=document.getElementById('success')
if(onq){div.style.display='block'
if(my.soundQ)document.getElementById('successsnd').play();}else{div.style.display='none'}}
function loaded(){gameNew()}
function touchStart(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseDown(ev)
console.log('touchStart')}
function touchMove(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseMove(ev);console.log('touchMove')}
function touchEnd(){el.addEventListener('touchstart',touchStart,false);window.removeEventListener("touchend",touchEnd,false);if(my.dragQ){my.dragQ=false;window.removeEventListener("touchmove",touchMove,false);}}
function pointerChg(ev){var bRect=el.getBoundingClientRect();var mouseX=ev.clientX-bRect.left
var mouseY=ev.clientY-bRect.top
var overQ=false;for(var i=0;i<my.drags.length;i++){if(hitTest(my.drags[i],mouseX,mouseY)){overQ=true;break;}}
if(overQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function mouseDown(ev){var bRect=el.getBoundingClientRect();var mouseX=ev.clientX-bRect.left
var mouseY=ev.clientY-bRect.top
for(var i=0;i<my.drags.length;i++){if(hitTest(my.drags[i],mouseX,mouseY)){my.dragNo=i;my.dragQ=true;my.dragHoldX=mouseX-my.drags[i].x;my.dragHoldY=mouseY-my.drags[i].y;}}
if(my.dragQ){if(ev.touchQ){window.addEventListener('touchmove',touchMove,false);}else{window.addEventListener("mousemove",mouseMove,false);}}
if(ev.touchQ){el.removeEventListener("touchstart",touchStart,false);window.addEventListener("touchend",touchEnd,false);}else{el.removeEventListener("mousedown",mouseDown,false);window.addEventListener("mouseup",mouseUp,false);}
ev.preventDefault();return false;}
function mouseUp(){el.addEventListener("mousedown",mouseDown,false);window.removeEventListener("mouseup",mouseUp,false);if(my.dragQ){my.dragQ=false;window.removeEventListener("mousemove",mouseMove,false);}}
function mouseMove(ev){if(!my.dragQ)return
var bRect=el.getBoundingClientRect();var mouseX=ev.clientX-bRect.left
var mouseY=ev.clientY-bRect.top
var shapeRad=my.drags[my.dragNo].rad;var minX=shapeRad;var maxX=el.width-shapeRad;var minY=shapeRad;var maxY=el.height-shapeRad;var posX=mouseX-my.dragHoldX;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);var posY=mouseY-my.dragHoldY;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);my.drags[my.dragNo].move(posX,posY)}
function hitTest(shape,mx,my){if(mx<shape.x)return false;if(my<shape.y)return false;if(mx>(shape.x+shape.wd))return false;if(my>(shape.y+shape.ht))return false;return true}
function gameChg(){}
function popShow(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='10px';my.opt={gamemode:my.game.mode,picid:my.pic.id}}
function popYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';for(var i=0;i<my.games.length;i++){var div=document.getElementById('game'+i)
if(div.checked){my.game=my.games[i]
console.log('popYes',i)}}
console.log("popYes",my.opt,my.game.mode,my.pic.id);var picq=false
if(my.pic.id!=my.opt.picid){picq=true
my.img.src=my.pic.url
if(my.img.complete){loaded()}else{my.img.addEventListener('load',loaded)}}
if(my.game.mode!=my.opt.gamemode){if(!picq){gameNew();}}}
function popNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function popHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-450px; top:10px; width:380px; padding: 5px; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button onclick="popYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="popNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='<p>(Changes will start new game)</p>'
s+='<div>Size:<br>'
s+=radioHTML('','game',my.games,'gameChg',0)
s+='</div>'
s+='<br>'
s+='<div>Picture Set:<br>'
s+=radioHTML('','pic',my.pics,'picChg',2)
s+='</div>'
s+='</div>';return s;}
function radioHTML(prompt,id,lbls,func,n){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px;  background-color:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==n)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.title+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.title+' </label>';s+='<br>'}
s+='</div>';return s;}
function gameRestart(){success(false)
my.userPos.import(my.sttPos)
var myNode=document.getElementById("cans");var children=myNode.childNodes
console.log('children',children)
for(var child in children){console.log('child',child,myNode[child])}
rulesShow()
drawTiles('gameRestart')}
function gameNew(){success(false)
my.n=my.game.n
my.puzzle=[]
my.rules=[]
genPuzzle(my.puzzle,my.rules)
console.log('gameNew',my.puzzle,my.rules)
my.userPos=new Possibilities()
my.userPos.reset()
var myNode=document.getElementById("cans");while(myNode.firstChild){myNode.removeChild(myNode.firstChild);}
rulesShow()
drawTiles('gameNew')
my.sttPos=new Possibilities()
my.sttPos.import(my.userPos)}
function genPuzzle(puzzle,rules){var goodq=false
var tryCount=0
while(!goodq&&tryCount<3){rules.length=0
goodq=true
tryCount++;for(var i=0;i<my.n;i++){puzzle[i]=[];for(var j=0;j<my.n;j++){puzzle[i][j]=j+1;}
shuffle(puzzle[i]);}
console.log('puzzle',puzzle)
var count=rulesMake(puzzle,rules)
if(count>=my.ruleMax){console.log('FAIL',tryCount)
goodq=false
continue}
rulesRemove(puzzle,rules)
console.log('after pruning',rules.length,rules)}}
function shuffle(arr){var a,b,c;for(var i=0;i<30;i++){a=randomIntExc(0,my.n);b=randomIntExc(0,my.n);c=arr[a];arr[a]=arr[b];arr[b]=c;}}
function randomIntExc(min,max){return Math.floor(Math.random()*(max-min))+min;}
function rulesMake(puzzle,rules){setTileSize();var rulesDone=false;var count=0;do{var rule=genRule(puzzle);var ruleDupe=false;var s=rule.getAsText();for(var i=0;i<rules.length;i++){if(rules[i].getAsText()==s){ruleDupe=true;break;}}
if(!ruleDupe){rules.push(rule);rulesDone=canSolve(puzzle,rules);}
count++;}while(!rulesDone&&count<my.ruleMax);console.log('rulesMake',count)
my.drags=rules;return count}
function genRule(puzzle){var a=randomIntExc(0,14);switch(a){case 0:case 1:case 2:case 3:return new Rule('nxt',puzzle)
case 4:return new Rule('at',puzzle)
case 5:case 6:return new Rule('col',puzzle)
case 7:case 8:return new Rule('lft',puzzle)
case 9:case 10:return new Rule('rgt',puzzle)
case 11:case 12:case 13:return new Rule('btw',puzzle)
default:return null}}
function setTileSize(){my.sz=my.game.ruleSz}
function canSolve(puzzle,rules){var pos=new Possibilities()
pos.applyRules(rules)
var res=pos.isSolved()
return res}
function rulesRemove(puzzle,rules){var possible;var nextToCheck=0;do{possible=false;for(var i=nextToCheck;i<rules.length;i++){var excludedRules=rules.slice();excludedRules.splice(i,1);if(canSolve(puzzle,excludedRules)){possible=true;rules.splice(i,1);break;}else{nextToCheck=i+1;}}}while(possible);}
function printPuzzle(puzzle){var s="";for(var i=0;i<my.n;i++){var prefix=String.fromCharCode("a".charCodeAt(0)+i);for(var j=0;j<my.n;j++){s+="  ";s+=prefix+puzzle[i][j].toString();}
s+="\n";}
return s;}
function rulesShow(){var currX=0;var currY=0;for(var i=0;i<my.rules.length;i++){var rule=my.rules[i];if(rule.getType()=='at'){my.userPos.choose(rule.col1,rule.row1,rule.thing1);rule.drawMe()
rule.move(-1000,0)}else{rule.drawMe();if(rule.x==0&&rule.y==0){rule.move(currX,currY)}
currY+=my.game.ruleSz+4;if(currY>h-my.game.ruleSz){currX+=my.game.ruleSz*3+5
currY=0}}}}
function drawTiles(id){console.log("drawTiles="+id);my.tiles=[]
for(var row=0;row<my.n;row++){my.tiles.push([])
for(var col=0;col<my.n;col++){var tile=new GameTile(row,col,my.userPos);my.tiles[row].push(tile)}}}
function soundBtnHTML(){var s=''
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
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function Possibilities(){this.pos=[];this.debug=false
this.reset()}
Possibilities.prototype.reset=function(){for(var i=0;i<my.n;i++){this.pos[i]=[];for(var j=0;j<my.n;j++){this.pos[i][j]=[];for(var k=0;k<my.n;k++){this.pos[i][j][k]=k+1;}}}}
Possibilities.prototype.import=function(p){for(var i=0;i<my.n;i++){this.pos[i]=[];for(var j=0;j<my.n;j++){this.pos[i][j]=[];for(var k=0;k<my.n;k++){this.pos[i][j][k]=p.pos[i][j][k]}}}}
Possibilities.prototype.applyRules=function(rules){this.reset();var changed=false;do{changed=false;for(var i=0;i<rules.length;i++){var rule=rules[i];if(rule.apply(this)){changed=true;}}}while(changed);}
Possibilities.prototype.checkSingles=function(row){var cellsCnt=[];var elsCnt=[];var elements=[];var elCells=[];for(var i=0;i<my.n;i++){elsCnt[i]=0;elCells[i]=0;cellsCnt[i]=0;elements[i]=0;}
for(var col=0;col<my.n;col++){for(i=0;i<my.n;i++){if(this.pos[col][row][i]){elsCnt[i]++;elCells[i]=col;cellsCnt[col]++;elements[col]=i+1;}}}
var changed=false;for(col=0;col<my.n;col++){if((cellsCnt[col]==1)&&(elsCnt[elements[col]-1]!=1)){var e=elements[col]-1;for(i=0;i<my.n;i++){if(i!=col){this.pos[i][row][e]=0;}}
changed=true;}}
for(var el=0;el<my.n;el++){if((elsCnt[el]==1)&&(cellsCnt[elCells[el]]!=1)){col=elCells[el];for(i=0;i<my.n;i++){if(i!=el){this.pos[col][row][i]=0;}}
changed=true;}}
if(changed)this.checkSingles(row);}
Possibilities.prototype.exclude=function(col,row,element){if(!this.pos[col][row][element-1])return;this.pos[col][row][element-1]=0;this.checkSingles(row);}
Possibilities.prototype.choose=function(col,row,element){for(var i=0;i<my.n;i++){if(i!=(element-1)){this.pos[col][row][i]=0;}else{this.pos[col][row][i]=element;}}
for(var j=0;j<my.n;j++){if(j!=col){this.pos[j][row][element-1]=0;}}
this.checkSingles(row);}
Possibilities.prototype.isPossible=function(col,row,element){return this.pos[col][row][element-1]==element;}
Possibilities.prototype.setPossible=function(col,row,element){this.pos[col][row][element-1]=element;}
Possibilities.prototype.setImpossible=function(col,row,element){this.pos[col][row][element-1]=0;}
Possibilities.prototype.isDefined=function(col,row){var solvedCnt=0
var unsolvedCnt=0;for(var i=0;i<my.n;i++){if(!this.pos[col][row][i]){unsolvedCnt++;}else{solvedCnt++;}}
return((unsolvedCnt==my.n-1)&&(solvedCnt==1));}
Possibilities.prototype.isSolved=function(){for(var i=0;i<my.n;i++){for(var j=0;j<my.n;j++){if(!this.isDefined(i,j)){return false;}}}
return true;}
Possibilities.prototype.toString=function(){var s="";for(var i=0;i<my.n;i++){for(var j=0;j<my.n;j++){for(var k=0;k<my.n;k++){s+=this.pos[j][i][k].toString();}
s+=' '}}
return s;}
function getImg(g,row,thing,xPos){xPos=typeof xPos!=='undefined'?xPos:0;var srcX=(thing-1)*64
var srcY=row*64
g.drawImage(my.img,srcX,srcY,64,64,xPos,0,my.sz,my.sz)}
function Rule(typ,puzzle){this.typ=typ
this.tileSize=my.game.ruleSz
this.centerRow=0
this.centerThing=0
this.row1=0
this.thing1=[]
this.row2=0
this.thing2=[]
this.col1=0;this.wd=3*my.sz
this.ht=my.sz
this.makeRandom(puzzle)
this.x=0
this.y=0
this.pad=3
this.obeyedQ=true
this.el=null}
Rule.prototype.move=function(x,y){this.x=x
this.y=y
this.el.style.left=this.x+'px'
this.el.style.top=this.y+'px'}
Rule.prototype.canAdd=function(){var ratio=2;this.el=document.createElement('canvas');this.el.style.position="absolute";document.getElementById('cans').appendChild(this.el);var ratio=2
var canWd=(this.wd+this.pad*2);var canHt=(this.ht+this.pad*2);this.el.width=canWd*ratio;this.el.height=canHt*ratio;this.el.style.width=canWd+"px";this.el.style.height=canHt+"px";this.el.style.zIndex=2;this.g=this.el.getContext("2d");this.g.setTransform(ratio,0,0,ratio,0,0);this.g.translate(2,2)}
Rule.prototype.removeMe=function(){this.el.parentNode.removeChild(this.el);};Rule.prototype.moveMe=function(){this.el.style.left=this.x+'px';this.el.style.top=this.y+'px';};Rule.prototype.getAsText=function(){switch(this.typ){case 'btw':return this.getThingName(this.centerRow,this.centerThing)+" is between "+this.getThingName(this.row1,this.thing1)+" and "+this.getThingName(this.row2,this.thing2);case 'lft':return this.getThingName(this.row1,this.thing1)+" is on the left of "+this.getThingName(this.row2,this.thing2);case 'rgt':return this.getThingName(this.row2,this.thing2)+" is on the right of "+this.getThingName(this.row1,this.thing1);case 'col':return this.getThingName(this.row1,this.thing1)+" is in the same column as "+this.getThingName(this.row2,this.thing2);case 'at':return this.getThingName(this.row1,this.thing1)+" is at column "+(this.col1+1).toString();case 'nxt':return this.getThingName(this.thing1[0],this.thing1[1])+" is next to "+this.getThingName(this.thing2[0],this.thing2[1]);default:return '???'}}
Rule.prototype.makeRandom=function(puzzle){switch(this.typ){case 'btw':this.centerRow=randomIntExc(0,my.n);this.row1=randomIntExc(0,my.n);this.row2=randomIntExc(0,my.n);var centerCol=randomIntExc(0,my.n-2)+1;this.centerThing=puzzle[this.centerRow][centerCol];if(randomIntExc(0,2)){this.thing1=puzzle[this.row1][centerCol-1];this.thing2=puzzle[this.row2][centerCol+1];}else{this.thing1=puzzle[this.row1][centerCol+1];this.thing2=puzzle[this.row2][centerCol-1];}
break
case 'lft':this.row1=randomIntExc(0,my.n);this.row2=randomIntExc(0,my.n);var col1=randomIntExc(0,my.n-1);var col2=randomIntExc(0,my.n-col1-1)+col1+1;this.thing1=puzzle[this.row1][col1];this.thing2=puzzle[this.row2][col2];break
case 'rgt':this.row1=randomIntExc(0,my.n);this.row2=randomIntExc(0,my.n);var col1=randomIntExc(0,my.n-1);var col2=randomIntExc(0,my.n-col1-1)+col1+1;this.thing1=puzzle[this.row1][col1];this.thing2=puzzle[this.row2][col2];break
case 'col':var col=randomIntExc(0,my.n);this.row1=randomIntExc(0,my.n);this.thing1=puzzle[this.row1][col];do{this.row2=randomIntExc(0,my.n);}while(this.row2==this.row1);this.thing2=puzzle[this.row2][col];break
case 'at':this.col1=randomIntExc(0,my.n)
this.row1=randomIntExc(0,my.n)
this.thing1=puzzle[this.row1][this.col1]
break
case 'nxt':var col1=randomIntExc(0,my.n);this.thing1[0]=randomIntExc(0,my.n);this.thing1[1]=puzzle[this.thing1[0]][col1];var col2;if(col1==0){col2=1;}else{if(col1==my.n-1){col2=my.n-2;}else{if(randomIntExc(0,2)){col2=col1+1;}else{col2=col1-1;}}}
this.thing2[0]=randomIntExc(0,my.n);this.thing2[1]=puzzle[this.thing2[0]][col2];break
default:return '???'}}
Rule.prototype.getType=function(){return this.typ}
Rule.prototype.getThingName=function(row,thing){var s=""
s+=String.fromCharCode("a".charCodeAt(0)+row);s+=thing.toString();return s;}
Rule.prototype.apply=function(pos){var changed=false
var i
switch(this.typ){case 'btw':if(pos.isPossible(0,this.centerRow,this.centerThing)){pos.exclude(0,this.centerRow,this.centerThing);changed=true}
if(pos.isPossible(my.n-1,this.centerRow,this.centerThing)){pos.exclude(my.n-1,this.centerRow,this.centerThing);changed=true}
var goodLoop;do{goodLoop=false;for(i=1;i<my.n-1;i++){if(pos.isPossible(i,this.centerRow,this.centerThing)){if(!((pos.isPossible(i-1,this.row1,this.thing1)&&pos.isPossible(i+1,this.row2,this.thing2))||(pos.isPossible(i-1,this.row2,this.thing2)&&pos.isPossible(i+1,this.row1,this.thing1)))){pos.exclude(i,this.centerRow,this.centerThing);goodLoop=true}}}
for(i=0;i<my.n;i++){var leftPossible;var rightPossible;if(pos.isPossible(i,this.row2,this.thing2)){if(i<2)
leftPossible=false;else
leftPossible=(pos.isPossible(i-1,this.centerRow,this.centerThing)&&pos.isPossible(i-2,this.row1,this.thing1));if(i>=my.n-2)
rightPossible=false;else
rightPossible=(pos.isPossible(i+1,this.centerRow,this.centerThing)&&pos.isPossible(i+2,this.row1,this.thing1));if((!leftPossible)&&(!rightPossible)){pos.exclude(i,this.row2,this.thing2);goodLoop=true;}}
if(pos.isPossible(i,this.row1,this.thing1)){if(i<2)
leftPossible=false;else
leftPossible=(pos.isPossible(i-1,this.centerRow,this.centerThing)&&pos.isPossible(i-2,this.row2,this.thing2));if(i>=my.n-2)
rightPossible=false;else
rightPossible=(pos.isPossible(i+1,this.centerRow,this.centerThing)&&pos.isPossible(i+2,this.row2,this.thing2));if((!leftPossible)&&(!rightPossible)){pos.exclude(i,this.row1,this.thing1);goodLoop=true;}}}
if(goodLoop)changed=true}while(goodLoop)
break
case 'lft':case 'rgt':for(i=0;i<my.n;i++){if(pos.isPossible(i,this.row2,this.thing2)){pos.exclude(i,this.row2,this.thing2);changed=true;}
if(pos.isPossible(i,this.row1,this.thing1))break;}
for(i=my.n-1;i>=0;i--){if(pos.isPossible(i,this.row1,this.thing1)){pos.exclude(i,this.row1,this.thing1);changed=true;}
if(pos.isPossible(i,this.row2,this.thing2))break;}
break
case 'col':for(i=0;i<my.n;i++){if((!pos.isPossible(i,this.row1,this.thing1))&&pos.isPossible(i,this.row2,this.thing2)){pos.exclude(i,this.row2,this.thing2);changed=true;}
if((!pos.isPossible(i,this.row2,this.thing2))&&pos.isPossible(i,this.row1,this.thing1)){pos.exclude(i,this.row1,this.thing1);changed=true;}}
break
case 'at':if(!pos.isDefined(this.col1,this.row1)){pos.choose(this.col1,this.row1,this.thing1);return true;}else{return false;}
break
case 'nxt':for(i=0;i<my.n;i++){if(this.applyToCol(pos,i,this.thing1[0],this.thing1[1],this.thing2[0],this.thing2[1]))
changed=true;if(this.applyToCol(pos,i,this.thing2[0],this.thing2[1],this.thing1[0],this.thing1[1]))
changed=true;}
if(changed)
this.apply(pos);break
default:}
return changed}
Rule.prototype.applyToCol=function(pos,col,nearRow,nearNum,thisRow,thisNum){var hasLeft;var hasRight;if(col==0)
hasLeft=false;else
hasLeft=pos.isPossible(col-1,nearRow,nearNum);if(col==my.n-1)
hasRight=false;else
hasRight=pos.isPossible(col+1,nearRow,nearNum);if((!hasRight)&&(!hasLeft)&&pos.isPossible(col,thisRow,thisNum)){pos.exclude(col,thisRow,thisNum);return true;}else
return false;}
Rule.prototype.isObeyed=function(pos){switch(this.typ){case 'btw':for(var i=0;i<my.n-2;i++){if(pos.isPossible(i,this.row1,this.thing1)&&pos.isPossible(i+1,this.centerRow,this.centerThing)&&pos.isPossible(i+2,this.row2,this.thing2))return true
if(pos.isPossible(i,this.row2,this.thing2)&&pos.isPossible(i+1,this.centerRow,this.centerThing)&&pos.isPossible(i+2,this.row1,this.thing1))return true}
return false
break
case 'lft':case 'rgt':for(var i=0;i<my.n-1;i++){for(var j=i+1;j<my.n;j++){if(pos.isPossible(i,this.row1,this.thing1)&&pos.isPossible(j,this.row2,this.thing2))return true}}
return false
break
case 'col':for(var i=0;i<my.n;i++){if(pos.isPossible(i,this.row1,this.thing1)&&pos.isPossible(i,this.row2,this.thing2))return true}
return false
break
case 'at':if(pos.isPossible(this.col1,this.row1,this.thing1))return true
return false
break
case 'nxt':for(var i=0;i<my.n-1;i++){if(pos.isPossible(i,this.thing1[0],this.thing1[1])&&pos.isPossible(i+1,this.thing2[0],this.thing2[1]))return true
if(pos.isPossible(i,this.thing2[0],this.thing2[1])&&pos.isPossible(i+1,this.thing1[0],this.thing1[1]))return true}
return false
break
default:}}
Rule.prototype.drawMe=function(){if(this.el==null)this.canAdd()
var g=this.g
g.clearRect(-2,-2,g.canvas.width+4,g.canvas.height+4)
g.beginPath()
g.fillStyle='hsla(70,100%,95%,1)'
if(this.obeyedQ){g.strokeStyle='#ffff00'
g.lineWidth=1
g.rect(0,0,this.wd,this.ht)}else{g.strokeStyle='#ff0000'
g.lineWidth=3
g.rect(-2,-2,this.wd+4,this.ht+4)}
g.fill();g.stroke()
switch(this.typ){case 'btw':getImg(g,this.row1,this.thing1,0)
getImg(g,this.centerRow,this.centerThing,my.sz)
getImg(g,this.row2,this.thing2,my.sz*2)
g.strokeStyle='hsla(120,100%,50%,0.5)'
g.fillStyle='hsla(120,100%,30%,0.5)'
g.beginPath()
g.drawArrow(my.sz/2,my.sz/4,my.sz/1,4,my.sz*2/5,my.sz*2/5,Math.PI,0.3)
g.drawArrow(5*my.sz/2,my.sz/4,my.sz/1,4,my.sz*2/5,my.sz*2/5,0,0.3)
g.fill();g.stroke()
break
case 'lft':getImg(g,this.row1,this.thing1,0)
getImg(g,this.row2,this.thing2,my.sz*2)
g.strokeStyle='hsla(240,100%,50%,0.5)'
g.fillStyle='hsla(240,100%,30%,0.5)'
g.beginPath()
g.drawArrow(my.sz,my.sz/2,my.sz/1,4,my.sz*2/5,my.sz*2/5,Math.PI,0.3)
g.fill();g.stroke()
break
case 'rgt':getImg(g,this.row1,this.thing1,0)
getImg(g,this.row2,this.thing2,my.sz*2)
g.strokeStyle='hsla(240,100%,50%,0.5)'
g.fillStyle='hsla(240,100%,30%,0.5)'
g.beginPath()
g.drawArrow(my.sz*2,my.sz/2,my.sz/1,4,my.sz*2/5,my.sz*2/5,0,0.3)
g.fill();g.stroke()
break
case 'col':getImg(g,this.row1,this.thing1,0)
getImg(g,this.row2,this.thing2,my.sz*2)
g.strokeStyle='hsla(240,100%,50%,0.5)'
g.fillStyle='hsla(240,100%,30%,0.5)'
g.beginPath()
g.drawArrow(3*my.sz/2,0,my.sz/2,5,my.sz*2/5,my.sz*2/5,Math.PI/2,0.3)
g.drawArrow(3*my.sz/2,my.sz/1,my.sz/2,5,my.sz*2/5,my.sz*2/5,Math.PI*3/2,0.3)
g.fill();g.stroke()
break
case 'at':break
case 'nxt':getImg(g,this.thing1[0],this.thing1[1],0)
getImg(g,this.thing2[0],this.thing2[1],my.sz)
getImg(g,this.thing1[0],this.thing1[1],my.sz*2)
g.strokeStyle='hsla(240,100%,50%,0.5)'
g.fillStyle='hsla(240,100%,30%,0.5)'
g.beginPath()
g.drawArrow(my.sz/1-my.sz/4,my.sz/2,0,0,my.sz*2/5,my.sz*2/5,Math.PI,0.3)
g.drawArrow(2*my.sz/1+my.sz/4,my.sz/2,0,0,my.sz*2/5,my.sz*2/5,0,0.3)
g.fill();g.stroke()
break
default:}}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}}
function GameTile(newRow,newCol,pos){this.row=newRow;this.col=newCol;this.pos=pos;this.x=0
this.y=0
this.pad=2
this.wd=1.4*my.game.tileSz+3
this.ht=1.4*my.game.tileSz+3
this.cols=Math.ceil(Math.sqrt(my.n));this.tileSize=this.wd/this.cols;if(my.n==5){this.tileSize*=1.45;}
this.canAdd()
this.x=(this.wd+5)*this.col+my.tilePos.x;this.y=(this.ht+5)*this.row+my.tilePos.y;this.move(this.x,this.y)
this.redraw()}
GameTile.prototype.redraw=function(){var g=this.g2
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.strokeStyle='black'
g.fillStyle='hsla(240,100%,50%,0.1)'
g.beginPath()
g.rect(0,0,this.wd,this.ht)
g.fill();g.stroke()
g.fillStyle='red'
this.posCount=0;this.posi=0;for(var i=0;i<my.n;i++){if(this.pos.isPossible(this.col,this.row,(i+1))){this.posCount++;this.posi=i;}}
this.locs=[]
if(this.posCount==1){g.drawImage(my.img,this.posi*64,this.row*64,64,64,0,0,this.wd,this.wd)
this.locs.push([0,0,this.wd,this.wd,-1])}else{var grid=my.game.grid
for(var i=0;i<my.n;i++){var trow=Math.floor(i/this.cols);var tcol=i%this.cols;var xPos=tcol*this.tileSize;var yPos=trow*this.tileSize;xPos=grid[i][0]*this.tileSize
yPos=grid[i][1]*this.tileSize
if(my.n==5){xPos*=1.1;yPos*=1.1;}
this.locs.push([xPos,yPos,this.tileSize,this.tileSize,i])
if(this.pos.isPossible(this.col,this.row,(i+1))){g.strokeStyle='black'
g.beginPath()
g.rect(xPos,yPos,this.tileSize,this.tileSize)
g.stroke()
g.drawImage(my.img,i*64,this.row*64,64,64,xPos,yPos,this.tileSize,this.tileSize)}else{g.fillStyle='hsla(240,100%,70%,0.2)'
g.beginPath()
g.rect(xPos,yPos,this.tileSize,this.tileSize)
g.fill();}}}}
GameTile.prototype.move=function(x,y){this.x=x
this.y=y
this.el.style.left=this.x+'px'
this.el.style.top=this.y+'px'
this.el2.style.left=this.x+'px'
this.el2.style.top=this.y+'px'}
GameTile.prototype.canAdd=function(){var ratio=2;this.el=document.createElement('canvas');this.el.style.position="absolute";document.getElementById('cans').appendChild(this.el);var ratio=2
var canWd=(this.wd+this.pad*2);var canHt=(this.ht+this.pad*2);this.el.width=canWd*ratio;this.el.height=canHt*ratio;this.el.style.width=canWd+"px";this.el.style.height=canHt+"px";this.el.style.zIndex=2
this.g=this.el.getContext("2d");this.g.setTransform(ratio,0,0,ratio,0,0);this.el.style.left="0px";this.el.me=this
this.el2=document.createElement('canvas');this.el2.style.position="absolute";document.getElementById('cans').appendChild(this.el2);this.el2.width=canWd*ratio;this.el2.height=canHt*ratio;this.el2.style.width=canWd+"px";this.el2.style.height=canHt+"px";this.el2.style.zIndex=1;this.g2=this.el2.getContext("2d");this.g2.setTransform(ratio,0,0,ratio,0,0);this.el.addEventListener("touchstart",function(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;var rect=ev.target.getBoundingClientRect();var mousex=ev.clientX-rect.left
var mousey=ev.clientY-rect.top
console.log('touchstart',ev.clientX)
this.me.dozza(mousex,mousey)})
this.el.addEventListener("mousemove",function(ev){var rect=ev.target.getBoundingClientRect();var mousex=ev.clientX-rect.left
var mousey=ev.clientY-rect.top
var loc=getLoc(this.me.locs,mousex,mousey)
var g=this.me.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
if(loc!=null){g.strokeStyle='black'
g.fillStyle='hsla(60,100%,90%,0.7)'
g.beginPath()
g.rect(loc[0],loc[1],loc[2],loc[3])
g.fill();}})
this.el.addEventListener("mousedown",function(ev){var rect=ev.target.getBoundingClientRect();var mousex=ev.clientX-rect.left
var mousey=ev.clientY-rect.top
this.me.dozza(mousex,mousey)})
this.el.addEventListener("mouseout",function(){var g=this.me.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)})}
GameTile.prototype.dozza=function(mousex,mousey){var loc=getLoc(this.locs,mousex,mousey)
console.log('click',this.col,this.row,mousex,mousey,loc[4])
if(loc[4]==-1){console.log('only one Possible')
for(var i=0;i<my.n;i++){this.pos.setPossible(this.col,this.row,i+1)}}else{if(my.soundQ)document.getElementById('click').play();if(this.pos.isPossible(this.col,this.row,loc[4]+1)){this.pos.exclude(this.col,this.row,loc[4]+1)}else{this.pos.setPossible(this.col,this.row,loc[4]+1)}}
for(var i=0;i<my.n;i++){my.tiles[this.row][i].redraw()}
var completeQ=this.pos.isSolved()
var failn=obeyedRefresh(this.pos)
if(failn>0){if(my.soundQ)document.getElementById('failsnd').play()
console.log('failn')}
console.log('solved?',completeQ,failn)
if(completeQ){if(failn>0){}else{success(true)}}}
function getLoc(locs,mousex,mousey){var loc=null
if(locs.length==1){return locs[0]}else{for(var i=locs.length-1;i>=0;i--){var loc=locs[i]
if(mousex>loc[0]&&mousex<loc[0]+loc[2]){if(mousey>loc[1]&&mousey<loc[1]+loc[3]){return loc}}}}
return null}
function obeyedRefresh(pos){var failn=0
for(var i=0;i<my.rules.length;i++){var rule=my.rules[i]
var obeyedQ=rule.isObeyed(pos)
if(!obeyedQ)failn++
rule.obeyedQ=obeyedQ
rule.drawMe()}
return failn}