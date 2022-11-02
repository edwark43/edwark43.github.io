let w,h,ratio,g,my={}
function init(){let version='0.642'
my.nx=getJSQueryVar('nx',8)
my.ny=getJSQueryVar('ny',8)
let bdOffsetY=10
let playerColors=['Red','Blue']
my.hovered={x:0,y:0,onQ:false}
my.playerN=0
my.players=[{color:playerColors[0],ai:false,pieces:0,score:0},{color:playerColors[1],ai:true,pieces:0,score:0},]
my.currVal=0
w=360
h=540
my.tileSz=Math.min((w-bdOffsetY*2)/my.nx,(h-80)/my.ny,50)
my.bdWd=my.nx*my.tileSz
my.bdHt=my.ny*my.tileSz
console.log('my',my)
my.bd=new Board()
let s=''
my.sndHome=document.domain=='localhost'?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndwin" src="'+my.sndHome+'success.mp3" preload="auto"></audio>'
s+='<audio id="sndmove" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>'
s+='<div style="position:relative; width:'+w+'px; margin:auto; display:block; font:14px Arial; border-radius:10px; background:'+my.style.bgClr+';  ">'
s+=optPopHTML()
s+='<div id="game-screen" style="font-size:24px; width:100%; height:100%;">'
s+='<div style="z-index:2; text-align:right; margin:5px;" >'
s+='<span id="undoN" style="font: bold 17px sans-serif; color:red;"></span>'
s+=' '
s+='<button id="prevBtn" type="button" class="btn"  onclick="movePrev()"><</button>'
s+='<button id="nextBtn" type="button" class="btn"  onclick="moveNext()">></button>'
s+=' '
s+='<button id="newBtn" type="button" class="btn"  onclick="optpop()">New Game</button>'
s+=' '
s+=' '
my.soundQ=true
s+=soundBtnHTML()
s+='</div>'
s+='<div id="message" style="opacity: 1; transition: all 2s;  font: 24px sans-serif; text-align:center;">Welcome</div>'
s+=wrap({tag:'out',style:'width:100px; border-radius:25px; padding:5px 5px;text-align:center; margin:auto;'},'<span id="player-0-pieces" style="color:'+playerColors[0]+';"></span>',' vs ','<span id="player-1-pieces" style="color:'+playerColors[1]+';"></span>')
s+='<div style="text-align:center;">'
s+='<canvas id="can" style="background:'+my.style.bdClr+'; box-shadow: 5px 6px 7px rgba(0,0,0,.5); border-radius:6px; border:3px outset '+my.style.bdEdgeClr+'; position:relative; text-align:center; margin:auto; transform:translateY('+bdOffsetY+'px);"></canvas>'
s+='</div>'
s+=wrap({cls:'copyrt',style:'left:5px; bottom:-12px'},`&copy; 2021 MathsIsFun.com  v${version}`)
s+='</div>'
s+='</div>'
docInsert(s)
resetBoard()
let el=document.getElementById('can')
ratio=3
el.width=my.bdWd*ratio
el.height=my.bdHt*ratio
el.style.width=my.bdWd+'px'
el.style.height=my.bdHt+'px'
g=el.getContext('2d')
g.setTransform(ratio,0,0,ratio,0,0)
el.onmousemove=function(evt){if(my.players[my.playerN].ai)return
let tile=toTileCoords(evt.offsetX,evt.offsetY)
if(tile.x!=my.hovered.x||tile.y!=my.hovered.y){my.hovered.x=tile.x
my.hovered.y=tile.y
my.hovered.onQ=true
my.hovered.clr=my.bd.isValidMove(my.hovered.x,my.hovered.y,my.playerN)?my.style.hoverClr:'transparent'
redraw()}}
el.onclick=function(evt){if(my.players[my.playerN].ai)return
pickTile(my.hovered.x,my.hovered.y)}
newGame()}
function resetBoard(){my.bd.reset()}
function optPopHTML(){let s=''
s+='<div id="optpop" style="position:absolute; left:-450px; top:10px; width:320px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; ">'
s+='<div id="optInside" style="margin: 15px 0 5px 0;">'
s+='</div>'
let lblStyle='display:inline-block; width:100px; text-align:right; margin-right:5px; font:18px Arial;'
s+='<div style="width:100%;">'
s+='<span style="'+lblStyle+'  color:black;">Difficulty:</span>'
s+='<select id="difficulty" class="input"><option>Easy</option><option selected=true>Medium</option><option>Hard</option></select>'
s+='</div>'
s+='<br>'
s+='<div style="width:100%;">'
for(let i=0;i<my.players.length;i++){let p=my.players[i]
s+='<div style="color: '+p.color+';">'
s+='<span style="'+lblStyle+'">'+p.color+': </span>'
s+='<select id="player-'+i+'"   class="input">'
if(i==0)s+='<option selected=true>Human</option><option>Computer</option>'
if(i==1)s+='<option>Human</option><option selected=true>Computer</option>'
s+='</select>'
s+='<span style="margin-left:15px;  font:18px Arial; color: '+p.color+';" >Wins: '
s+='<span id="player-'+i+'-score" style="">0</span>'
s+='</span>'
s+='</div>'}
s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px;">'
s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>'
s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>'
s+='</div>'
s+='</div>'
return s}
function optpop(){let pop=document.getElementById('optpop')
pop.style.transitionDuration='0.3s'
pop.style.opacity=1
pop.style.zIndex=12
pop.style.left=(w-320)/2+'px'}
function optYes(){let pop=document.getElementById('optpop')
pop.style.opacity=0
pop.style.zIndex=1
pop.style.left='-999px'
newGame()}
function optNo(){let pop=document.getElementById('optpop')
pop.style.opacity=0
pop.style.zIndex=1
pop.style.left='-999px'}
function updatePiecesCount(){let tiles=my.bd.getTiles()
my.players[0].pieces=0
my.players[1].pieces=0
for(let y=0;y<my.nx;y++){for(let x=0;x<my.ny;x++){let player=tiles[y][x][0]
if(player<0)continue
my.players[player].pieces++}}
pieceCountShow()}
function pickTile(row,col){let flipN=my.bd.makeMove(row,col,my.playerN)
if(flipN>0){if(my.soundQ)document.getElementById('sndmove').play()
endTurn()}
my.hovered.onQ=false
redraw()}
function tie(){msg('Tied Game!')
let half=(my.nx*my.ny)/2
my.players[0].pieces=half
my.players[1].pieces=half
pieceCountShow()}
function win(player){msg(my.players[player].color+' Wins!')
let pieceTot=my.players[0].pieces+my.players[1].pieces
let emptyCount=my.nx*my.ny-pieceTot
my.players[player].pieces+=emptyCount
pieceCountShow()
my.players[player].score++
document.getElementById('player-0-score').innerHTML=my.players[0].score
document.getElementById('player-1-score').innerHTML=my.players[1].score}
function pieceCountShow(){document.getElementById('player-0-pieces').innerHTML=my.players[0].pieces
document.getElementById('player-1-pieces').innerHTML=my.players[1].pieces}
function msg(s){let msgDiv=document.getElementById('message')
msgDiv.innerHTML=s}
function endTurn(){updatePiecesCount()
my.playerN=my.playerN==0?1:0
msg(my.players[my.playerN].color+"'s turn",0)
if(!my.bd.canMakeMove(my.playerN)){msg(my.players[my.playerN].color+' cannot move, loses turn',0)
my.playerN=my.playerN==0?1:0}
if(!my.bd.canMakeMove(0)&&!my.bd.canMakeMove(1)){if(my.players[0].pieces==my.players[1].pieces){tie()}else{win(my.players[0].pieces>my.players[1].pieces?0:1)}}
if(my.players[my.playerN].ai){setTimeout(aiTurn,1200)}}
function aiTurn(){let res=my.bd.makeBestMove(my.difficulty,my.playerN)
my.prevBd=my.bd.bd
console.log('aiTurn',res)
if(res.n>0){if(my.soundQ)document.getElementById('sndmove').play()
endTurn()}
redraw()
g.strokeStyle=my.style.moveHi
g.lineWidth=3
g.strokeRect(res.i*my.tileSz,res.j*my.tileSz,my.tileSz,my.tileSz)
setTimeout(redraw,2000)}
function toTileCoords(x,y){x=Math.min(my.nx-1,Math.max(0,Math.floor(x/my.tileSz)))
y=Math.min(my.ny-1,Math.max(0,Math.floor(y/my.tileSz)))
return{x:x,y:y,}}
function newGame(){resetBoard()
my.difficulty=document.getElementById('difficulty').selectedIndex+1
console.log('my.difficulty',my.difficulty)
let player0=document.getElementById('player-0')
my.players[0].ai=player0.options[player0.selectedIndex].text=='Computer'
let player1=document.getElementById('player-1')
my.players[1].ai=player1.options[player1.selectedIndex].text=='Computer'
updatePiecesCount()
redraw()
msg(my.players[my.playerN].color+"'s turn",0)
if(my.players[my.playerN].ai)aiTurn()}
function drawGrid(){g.lineWidth=1
let clrs=my.style.edgeClrs
for(let j=0;j<clrs.length;j++){let gap=(j-0.5)*1
g.strokeStyle=clrs[j]
for(let y=0;y<my.ny;y++){let yp=y*my.tileSz
g.beginPath()
g.moveTo(0,yp+gap)
g.lineTo(my.nx*my.tileSz,yp+gap)
g.stroke()}
for(let x=0;x<my.nx;x++){let xp=x*my.tileSz
g.beginPath()
g.moveTo(xp+gap,0)
g.lineTo(xp+gap,my.ny*my.tileSz)
g.stroke()}}}
function drawDisks(){let tiles=my.bd.getTiles()
for(let x=0;x<my.nx;x++){for(let y=0;y<my.ny;y++){let px=x*my.tileSz+my.tileSz/2
let py=y*my.tileSz+my.tileSz/2
let r=my.tileSz*0.4
let player=tiles[x][y][0]
if(player<0)continue
let c=my.players[player].color
drawDisk(px,py,r*0.9,c)}}}
function drawDisk(x,y,r,color){let grd1=g.createLinearGradient(x-r,y-r,x+r,y+r)
grd1.addColorStop(0,color)
grd1.addColorStop(1,'#ccc')
let grd2=g.createLinearGradient(x-r,y-r,x+r,y+r)
grd2.addColorStop(0,'#ccc')
grd2.addColorStop(1,color)
g.fillStyle=grd2
g.beginPath()
g.arc(x,y,r+r*0.2,0,Math.PI*2)
g.fill()
g.closePath()
g.fillStyle=grd1
g.beginPath()
g.arc(x,y,r,0,Math.PI*2)
g.fill()
g.closePath()}
function drawCircle(x,y,r,fill,stroke){g.fillStyle=fill||'transparent'
g.lineWidth=1
g.strokeStyle=stroke||'transparent'
g.beginPath()
g.arc(x,y,r,0,Math.PI*2,true)
g.fill()
g.stroke()
g.closePath()}
function drawHovered(){if(my.hovered.onQ){g.strokeStyle=my.hovered.clr
g.lineWidth=3
g.strokeRect(my.hovered.x*my.tileSz,my.hovered.y*my.tileSz,my.tileSz,my.tileSz)}}
function redraw(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
document.getElementById('undoN').innerHTML=my.bd.undoN==0?'':'Undo: '+my.bd.undoN
drawGrid()
drawDisks()
if(my.players[my.playerN].ai)return
drawHovered()}
function movePrev(){my.bd.movePrev()}
function moveNext(){my.bd.moveNext()}
class Board{constructor(){this.hist=[]
this.Fld=new Array(my.nx)
this.FVal=new Array(my.nx)
this.moveCount=0
this.maxMoveCount=0
this.undoN=0
this.best_i
this.best_j
this.init()
this.aNewGame(1)}
movePrev(){console.log('movePrev',this.moveCount,this.maxMoveCount)
if(this.moveCount>0){this.moveCount--
let bd=this.hist[this.moveCount].bd
for(let x=0;x<my.nx;x++){for(let y=0;y<my.ny;y++){this.Fld[x][y][0]=bd[x][y]}}
my.playerN=my.playerN==0?1:0
this.undoN++}
redraw()}
moveNext(){console.log('moveNext')
if(this.moveCount<this.maxMoveCount){this.moveCount++
let bd=this.hist[this.moveCount].bd
for(let x=0;x<my.nx;x++){for(let y=0;y<my.ny;y++){this.Fld[x][y][0]=bd[x][y]}}
my.playerN=my.playerN==0?1:0
this.undoN--}
redraw()}
reset(){this.aNewGame(0)}
getTiles(){return this.Fld}
makeMove(x,y,player){return this.makeRealMove(x,y,player)}
makeBestMove(difficulty,player){return this.doBestMove(difficulty,player)}
isValidMove(x,y,player){return this.isValidMove2(x,y,0,player)}
isValidMove2(nn,mm,ll,p){let player=p
if(!this.Fld[nn])return
if(!this.Fld[nn][mm])return
if(this.Fld[nn][mm][ll]>-1){return false}
for(let ddx=-1;ddx<=1;ddx++){for(let ddy=-1;ddy<=1;ddy++){if(this.getFld(nn+ddx,mm+ddy,ll)==1-player){let cc=0,dd=1
do{dd++
cc=this.getFld(nn+dd*ddx,mm+dd*ddy,ll)}while(cc==1-player)
if(cc==player){return true}}}}
return false}
canMakeMove(player){return this.able2Move(player)}
init(){for(let i=0;i<my.nx;i++){this.Fld[i]=new Array(my.ny)
for(let j=0;j<my.ny;j++){this.Fld[i][j]=new Array(4)}}
for(let i=0;i<my.nx;i++){this.FVal[i]=new Array(my.ny)
for(let j=0;j<my.ny;j++){this.FVal[i][j]=5}}
let EdgeValArr=[20,-15,10]
for(let e=0;e<3;e++){let EdgeVal=EdgeValArr[e]
for(let i=0;i<my.nx;i++){this.FVal[i][e]+=EdgeVal
this.FVal[i][my.ny-1-e]+=EdgeVal}
for(let i=0;i<my.ny;i++){this.FVal[e][i]+=EdgeVal
this.FVal[my.nx-1-e][i]+=EdgeVal}}
this.FVal[0][0]+=80
this.FVal[my.nx-1][0]+=80
this.FVal[0][my.ny-1]+=80
this.FVal[my.nx-1][my.ny-1]+=80
this.FVal[1][1]-=40
this.FVal[my.nx-2][1]-=40
this.FVal[1][my.ny-2]-=40
this.FVal[my.nx-2][my.ny-2]-=40}
aNewGame(StartPlayer){this.moveCount=0
this.maxMoveCount=0
this.undoN=0
for(let i=0;i<my.nx;i++){for(let j=0;j<my.ny;j++){this.Fld[i][j][0]=-1}}
let p0=StartPlayer
let p1=1-StartPlayer
let mynx_2=my.nx/2
let myny_2=my.ny/2
let stts=[[mynx_2,myny_2,p0],[mynx_2-1,myny_2-1,p0],[mynx_2-1,myny_2,p1],[mynx_2,myny_2-1,p1],]
console.log('stts',stts)
for(let i=0;i<stts.length;i++){let stt=stts[i]
this.Fld[stt[0]][stt[1]][0]=stt[2]}
this.histUpdate(StartPlayer,0,0)}
getFld(nn,mm,ll){if(nn<0)return-1
if(nn>=my.nx)return-1
if(mm<0)return-1
if(mm>=my.ny)return-1
return this.Fld[nn][mm][ll]}
makeRealMove(nn,mm,p){console.log('makeRealMove',nn,mm,p)
let player=p
if(this.Fld[nn][mm][0]>-1){return 0}
let flipN=0
let hh=new Array(9)
let ll=-1
for(let ddx=-1;ddx<=1;ddx++){for(let ddy=-1;ddy<=1;ddy++){ll++
hh[ll]=0
if(this.getFld(nn+ddx,mm+ddy,0)==1-player){let cc
let dd=1
do{dd++
cc=this.getFld(nn+dd*ddx,mm+dd*ddy,0)}while(cc==1-player)
if(cc==player){hh[ll]=dd
do{dd--
this.Fld[nn+dd*ddx][mm+dd*ddy][0]=player
flipN++}while(dd>1)}}}}
if(flipN==0)return 0
this.Fld[nn][mm][0]=player
this.moveCount++
this.maxMoveCount=this.moveCount
this.histUpdate(player,nn,mm)
return flipN}
histUpdate(player,nn,mm){if(this.hist.length<=this.moveCount)this.hist[this.moveCount]=[]
let clone=[]
for(let x=0;x<my.nx;x++){let row=[]
for(let y=0;y<my.ny;y++){row.push(this.Fld[x][y][0])}
clone.push(row)}
this.hist[this.moveCount]={player:player,nn:nn,mm:mm,bd:clone}}
histShow(){let s=''
for(let i=0;i<this.hist.length;i++){let h=this.hist[i]
s+=my.players[h.player].color
s+=h.nn
s+=h.mm
for(let x=0;x<my.nx;x++){for(let y=0;y<my.ny;y++){if(h.bd[x][y]!=-1)s+=' '+h.bd[x][y]}}
s+=', '}
console.log('histShow',s)}
makeVirtualMove(nn,mm,rr,p){let player=p
let ddx,ddy,dd,cc,flipN=0
my.currVal=0
let MoveVal=1
if(rr>0){for(ddx=0;ddx<my.nx;ddx++){for(ddy=0;ddy<my.ny;ddy++){this.Fld[ddx][ddy][rr]=this.Fld[ddx][ddy][rr-1]}}}
if(this.Fld[nn][mm][rr]>-1){return 0}
for(ddx=-1;ddx<=1;ddx++){for(ddy=-1;ddy<=1;ddy++){if(this.getFld(nn+ddx,mm+ddy,rr)==1-player){dd=1
do{dd++
cc=this.getFld(nn+dd*ddx,mm+dd*ddy,rr)}while(cc==1-player)
if(cc==player){do{dd--
this.Fld[nn+dd*ddx][mm+dd*ddy][rr]=player
if(rr>0){my.currVal+=this.FVal[nn+dd*ddx][mm+dd*ddy]+MoveVal}
flipN++}while(dd>1)}}}}
if(flipN>0){this.Fld[nn][mm][rr]=player}
return flipN}
doBestMove(difficulty,p){let player=p
let D=difficulty
if(this.moveCount>=my.nx*my.ny-10){D++}
D=Math.min(D++,2)
this.getBestMove(0,D,player)
let flipN=this.makeRealMove(this.best_i,this.best_j,player)
console.log('doBestMove',difficulty,p,flipN)
return{i:this.best_i,j:this.best_j,n:flipN}}
getBestMove(depth,ll,p){let player=p
let best_val=-10000
let nvalid=0
let rr=depth+1
let MoveVal=1
let act_val=0
if(this.moveCount>40){MoveVal=this.moveCount-40}
for(let i=0;i<my.nx;i++){for(let j=0;j<my.ny;j++){if(this.makeVirtualMove(i,j,rr,player)>0){nvalid++
act_val=(5+rr)*(my.currVal+this.FVal[i][j]+MoveVal)
if(rr<ll){player=1-player
act_val-=this.getBestMove(rr,ll,player)
player=1-player}
if(rr==1){act_val+=Math.round(Math.random()*1000)%my.ny}
if(best_val<act_val){best_val=act_val
if(rr==1){this.best_i=i
this.best_j=j}}}}}
if(nvalid>0){return best_val+10*nvalid}else{return 0}}
bdDebug(){let s=''
for(let j=0;j<my.ny;j++){for(let i=0;i<my.nx;i++){let v=this.Fld[i][j][0]
if(v==-1){s+='-'}else{s+=v}
s+=' '}
s+='<br>'}
document.getElementById('debug').innerHTML=s}
able2Move(player){for(let i=0;i<my.nx;i++){for(let j=0;j<my.ny;j++){if(this.isValidMove(i,j,player)){return true}}}
return false}}
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
function soundToggle(){let btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add('mute')}else{my.soundQ=true
document.getElementById(btn).classList.remove('mute')}}
my.opts={name:'user'}
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
themeChg()
window.addEventListener('storage',themeChg)
function themeChg(){my.theme=localStorage.getItem('theme')
console.log('themeChg to',my.theme)
my.styles=[{bgClr:'hsla(240,40%,95%,1)',bdClr:'lightblue',bdEdgeClr:'#9ac',hoverClr:'#fff',moveHi:'yellow',edgeClrs:['#eee','#888']},{bgClr:'#cdf',bdClr:'#def',bdEdgeClr:'#8ac',hoverClr:'#880',moveHi:'#f00',edgeClrs:['#eee','#888']},{bgClr:'linear-gradient(rgb(62, 169, 255), rgb(16, 16, 16))',bdClr:'#65926d',bdEdgeClr:'#886850',hoverClr:'#880',moveHi:'#f00',edgeClrs:['#eee','#888']},{bgClr:'transparent',bdClr:'hsla(240,20%,20%,1)',bdEdgeClr:'black',hoverClr:'gold',moveHi:'#f00',edgeClrs:['#569','#000']},]
if(my.theme=='dark'){my.style=my.styles[3]}else{my.style=my.styles[0]}
console.log('my.style',my.style)}
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
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>'<div',edit:()=>'<textarea onkeyup="'+fn+'" onchange="'+fn+'"',inp:()=>{if(cls.length==0)cls='input'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input value="'+txt+'"'
s+=fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''
return s},out:()=>{if(cls.length==0)cls='output'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<div '
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
s+={btn:()=>'>'+txt+'</button>',can:()=>'></canvas>',div:()=>' >'+txt+'</div>',edit:()=>' >'+txt+'</textarea>',inp:()=>'>'+(lbl.length>0?'</label>':''),out:()=>' >'+txt+'</div>'+(lbl.length>0?'</label>':''),rad:()=>{let s=''
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