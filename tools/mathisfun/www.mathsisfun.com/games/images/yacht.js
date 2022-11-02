var w,h,my={}
function yachtMain(){let version='0.651';w=360;h=300;my.scores=[]
for(let i=1;i<=6;i++){my.scores.push(new Score(i+'s',i+'s','single',i))}
my.scores.push(new Score('bonus','Bonus','bonus',5))
my.scores.push(new Score('sub1','Subtotal','sub'))
my.scores.push(new Score('kind3','3 of a kind','kind',3))
my.scores.push(new Score('kind4','4 of a kind','kind',4))
my.scores.push(new Score('house','Full House','house'))
my.scores.push(new Score('str4','4 Straight','strt',4))
my.scores.push(new Score('str5','5 Straight','strt',5))
my.scores.push(new Score('yacht','Yacht','kind',5))
my.scores.push(new Score('choice','Choice','choice'))
my.scores.push(new Score('sub2','Subtotal','sub'))
my.scores.push(new Score('tot','Total','tot'))
let s="";s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+=`<div id="main" style="position:relative; width:${w}px; min-height:${h}px; margin:auto; display:block;
   border: none; border-radius: 10px; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%)">`
s+=optPopHTML();s+='<div id="top" style="display: block; position: relative; width: 100%; height:100px; ">';s+='<div id="hiScore" style="position: absolute; left: 130px; top: 4px; width:140px; font:17px Arial; text-align:center; background-color: #edf; padding:2px;  border-radius:15px; ">&nbsp;</div>';s+='<div id="round" style="position: absolute; right: 5px; top: 4px; width:40px; font:22px Arial; text-align:center; background-color: #fed; padding:2px;  border-radius:15px; ">&nbsp;</div>';s+='<div id="dice" style="position: absolute; left: 15px; top: 40px; width:325px; height:50px; background-color: #fff; padding:2px; border: 2px inset; border-radius:15px; ">&nbsp;</div>';s+='<button id="newgame" style="font: 14px Arial; height:30px; text-align:right; z-index: 10;" class="btn" onclick="gameNew()" >New</button>';s+='<button id="options" style="font: 14px Arial; height:30px; text-align:right; z-index: 10;" class="btn" onclick="optPop()" >Options</button>';s+='<button id="rollBtn" style="position: absolute; left: 275px; top: 53px; font: 19px Arial; height:30px; text-align:right; z-index: 10;" class="btn" onclick="roll()" >Roll</button>';s+='</div>';s+=`<div id="scores" style="display: block; position: relative; width: 100%; height:190px; text-align:left; 
  padding-top: 15px; margin-top:5px; background: linear-gradient(to bottom, rgba(160,180,205,1) 0%); ">`
s+='</div>';my.imgHome=(document.domain=='localhost')?'/mathsisfun/games/images/':'/games/images/'
s+='<img src="'+my.imgHome+'yacht.svg" style="position: absolute; left: 0px; top: 110px;" />';s+='<div style="font: 11px Arial; color: #6600cc; text-align:center;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);my.dice=[]
for(let i=0;i<5;i++){let die=new Die();my.dice.push(die)}
my.hiScore=0
my.opts={roundMax:12}
roundMaxChg(optGet('roundMax'))
scoresDraw()
gameNew()}
function gameNew(){my.roundN=0
scoresReset()
roundNew()}
function scoresReset(){my.scores.map(score=>{score.val=0})}
function scoresDraw(){let s=''
let divStt='<div style="display: inline-block; width: 170px; text-align:right; vertical-align:top; font: 16px Arial; ">'
s+=divStt
my.scores.map(score=>{score.val=0
s+=score.fmt()
if(score.id=='sub1'){s+='</div>'
s+=divStt}})
s+='</div>'
document.getElementById('scores').innerHTML=s
my.scores.map(score=>{score.mousing()})}
function roundNew(){my.roundN++
if(my.roundN>my.opts.roundMax){scoresUpdate()
gameEnd()}else{document.getElementById('round').innerHTML=my.roundN
my.rollN=0
document.getElementById('rollBtn').style.visibility='visible'
my.dice.map(die=>{die.selQ=false})
scoresUpdate()
roll()}}
function gameEnd(){console.log('gameEnd!')
let s=''
s+="Game Over!"
s+='<br>'
s+='<p style="font-size: 150%; color: goldenrod;">'
s+="Your score is <b>"+my.tot+'</b>'
s+='</p>'
s+='<br>'
s+="New Game?"
document.getElementById('optMsg').innerHTML=s
optPop()}
function scoreDo(elem){let id=elem.id
let div=document.getElementById(elem.id)
let score=my.scores.filter(score=>{return score.id==elem.id})[0]
console.log('scoreDo',id,score)
if(score.totQ)return
if(score.val>0)return
let freqs=new Array(6);for(let i=0;i<6;++i)freqs[i]=0;my.dice.map(die=>{freqs[die.n-1]++;})
let tot=0
switch(score.type){case 'single':let nMatch=score.n
my.dice.map(die=>{if(die.n==nMatch)tot+=nMatch})
break
case 'house':let has2Q=false;let has3Q=false;let has5Q=false;freqs.map(freq=>{if(freq==2)has2Q=true
if(freq==3)has3Q=true
if(freq==5)has5Q=true})
if((has2Q&&has3Q)||has5Q){tot=25;}
break
case 'kind':console.log('strt')
for(let i=0;i<6;i++){console.log('',i,freqs[i],score.n)
if(freqs[i]>=score.n){if(score.n<5){tot=score.n*(i+1)}else{tot=50;}
break;}}
break
case 'strt':console.log('strt')
for(let i=0;i<7-score.n;i++){let mult=1;for(let j=i;j<i+score.n;j++){mult*=freqs[j];console.log('',i,j,freqs[j],mult)
if(mult==0)break;}
if(mult!=0){tot=(score.n-1)*10;break;}}
break
case 'choice':my.dice.map(die=>{tot+=die.n})
break
case 'bonus':break
default:}
console.log('tot',tot)
if(tot>0){div.innerHTML=tot
score.val=tot
roundNew()}else{roundNew()}}
function scoresUpdate(){let tot=0
let bonus=0
let subTots=[]
my.scores.map(score=>{let div=document.getElementById(score.id)
if(score.type=='sub'){div.innerHTML=tot
subTots.push(tot)
tot=0}else{div.innerHTML=score.val
tot+=score.val}})
if(subTots[0]>=63){document.getElementById('bonus').innerHTML=35
subTots[0]+=35
document.getElementById('sub1').innerHTML=subTots[0]}
my.tot=subTots[0]+subTots[1]
document.getElementById('tot').innerHTML=my.tot
if(my.tot>my.hiScore){my.hiScore=my.tot
document.getElementById('hiScore').innerHTML='High score: '+my.hiScore}}
function roll(){if(my.rollN>3)return
console.log('rollN',my.rollN)
my.dice.map(die=>{if(!die.selQ)die.roll()})
my.rollN++
if(my.rollN<3){document.getElementById('rollBtn').innerHTML='Roll '+(my.rollN+1)}else{document.getElementById('rollBtn').style.visibility='hidden'}}
class Score{constructor(id,name,type,n=0){this.id=id
this.name=name
this.type=type
this.n=n
this.bgClr='#cdf'
this.el=null
this.totQ=false
if(type=='bonus')this.totQ=true
if(type=='sub')this.totQ=true
if(type=='tot')this.totQ=true}
fmt(){let s=''
s+='<div style="">'
s+='<div style="display: inline-block; width: 110px; text-align:right; margin-right:5px; font: 16px Arial;">'
s+=this.name
s+='</div>'
s+=`<div id="${this.id}" style="display: inline-block; width: 40px; text-align:center;font: bold 16px Arial; 
    background-color:${this.bgClr} ; cursor: pointer; border: 1px solid blue;" onclick="scoreDo(this)">`
s+=this.val
s+='</div>'
s+='</div>'
return s}
mousing(){this.el=document.getElementById(this.id)
if(!this.totQ){let el=this.el
let me=this
el.addEventListener('mouseover',function(){me.overQ=true
me.draw();});el.addEventListener('mouseleave',function(){me.overQ=false
me.draw();});el.addEventListener('click',function(){me.overQ=false
me.selQ=!me.selQ
me.draw();});}}
draw(){this.el.style.backgroundColor=this.overQ?'white':this.bgClr}}
class Die{constructor(){this.x=0
this.y=0
this.wd=45;this.ht=this.wd;this.selQ=false;this.overQ=false;this.canvas=document.createElement("canvas");document.getElementById('dice').appendChild(this.canvas);let el=this.canvas
let ratio=2;el.width=this.wd*ratio;el.height=this.ht*ratio;el.style.width=this.wd+"px";el.style.height=this.ht+"px";el.style.margin="2px";let g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);this.g=this.canvas.getContext('2d');let me=this
el.addEventListener('mouseover',function(){me.overQ=true
me.draw();});el.addEventListener('mouseleave',function(){me.overQ=false
me.draw();});el.addEventListener('click',function(){me.overQ=false
me.selQ=!me.selQ
me.draw();});this.roll();}
draw(){let g=this.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
g.die(this.x,this.y,this.wd,this.ht,this.n);if(this.overQ){g.strokeStyle='black'
g.fillStyle='hsla(240,100%,90%,0.7)'
g.beginPath()
g.rect(1,1,100,100)
g.fill();}
if(this.selQ){g.strokeStyle='black'
g.fillStyle='hsla(60,100%,90%,0.5)'
g.beginPath()
g.rect(1,1,100,100)
g.fill();}}
roll(){this.animn=25;this.n=getRandomInt(1,6);this.rollAnim();}
rollAnim(){let g=this.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
let xf=0.8+Math.random()*0.15
let yf=0.8+Math.random()*0.15
let ang=Math.random()*1.6
g.translate(this.wd/2,this.ht/2);g.rotate(ang);g.die(this.wd*(-xf)/2,this.ht*(-yf)/2,this.wd*xf,this.ht*yf,getRandomInt(1,6));g.rotate(-ang);g.translate(-this.wd/2,-this.ht/2);if(this.animn-->0){requestAnimationFrame(this.rollAnim.bind(this));}else{this.draw()}}}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:5px; width:320px; padding: 5px; border-radius: 9px; background-color: #efd; box-shadow: 10px 10px 5px 0px rgba(70,90,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optMsg" style="font:18px Arial; margin: 5px auto 5px auto;">&nbsp;</div>';s+='<div id="optInside" style="font:16px Arial; margin: 5px auto 5px auto;">';s+='<span style="text-align: center; color: black;">Rounds: </span>';s+='<div id="num" style="display: inline-block; text-align: center; padding: 2px 20px 2px 20px; border-radius: 10px; font: 20px Arial; color: black; background-color: #00bfff ">3</div>';s+='<button id="dnBtn" style="margin:0 0 0 2px; font-size: 16px; color: #000aae; " class="btn"  onclick="numDn()" >&#x25BC;</button>';s+='<button id="upBtn" style="margin:0;  font-size: 16px; color: #000aae; " class="btn"  onclick="numUp()" >&#x25B2;</button>';s+='</div>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left=(w-340)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';gameNew()}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function optGet(name){var val=localStorage.getItem(`yacht.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`yacht.${name}`,val)
my.opts[name]=val}
function numDn(){var num=my.opts.roundMax
console.log("numDn",num);if(num>1){num--;roundMaxChg(num);}}
function numUp(){var num=my.opts.roundMax
if(num<20){num++;roundMaxChg(num);}}
function roundMaxChg(n){document.getElementById('num').innerHTML=n;optSet('roundMax',n)
console.log('roundMaxChg',my.opts.roundMax)}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;}
CanvasRenderingContext2D.prototype.die=function(x,y,wd,ht,n){var g=this;g.fillStyle='white';g.beginPath();this.rect(x,y,wd,ht);g.fill();var grd=g.createLinearGradient(x+wd,y,x,y+ht);grd.addColorStop(0,"#def");grd.addColorStop(1,"#abf");g.fillStyle=grd;g.strokeStyle='#def';g.beginPath();this.roundRect(x,y,wd,ht,wd/5);g.stroke();g.fill();var p=0.3;var q=0.24;var faces=[[[0.5,0.5]],[[p,p],[1-p,1-p]],[[q,q],[0.5,0.5],[1-q,1-q]],[[p,p],[p,1-p],[1-p,1-p],[1-p,p]],[[q,q],[1-q,q],[0.5,0.5],[q,1-q],[1-q,1-q]],[[q,p],[0.5,p],[1-q,p],[q,1-p],[0.5,1-p],[1-q,1-p]],]
var dots=faces[n-1];for(var i=0;i<dots.length;i++){var dot=dots[i];var xp=x+dot[0]*wd;var yp=y+dot[1]*ht;g.fillStyle='black';g.beginPath();g.arc(xp,yp,wd/9,0,2*Math.PI);g.fill();g.fillStyle='#ddd';g.beginPath();g.arc(xp,yp,wd/12,1.6,3.0);g.fill();}}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1)+min);}