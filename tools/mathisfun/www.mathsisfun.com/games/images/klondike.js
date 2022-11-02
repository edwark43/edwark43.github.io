var w,h,g,my={};function klondikeMain(){var version='0.5';w=575;h=500;my.suitRules=[{id:'any',name:'Any'},{id:'alt',name:'Alternating Red Black'},{id:'same',name:'Same'},];my.suitRule=my.suitRules[1]
my.tabDropKingQ=false
my.tabShowFrontQ=false
my.stockPerN=3
my.stockPassMax=99
my.cardWd=73
my.cardHt=98
my.gap={x:80,y:19}
my.freePt={x:4,y:48}
my.fdnPnt={x:255,y:48}
my.tabPt={x:10,y:160}
my.tabMax=7
my.imgHome=(document.domain=='localhost')?'/mathsisfun/games/images/':'/games/images/'
var s='';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'fanfare.mp3" preload="auto"></audio>';s+='<audio id="sndAuto" src="'+my.sndHome+'snap.mp3" preload="auto"></audio>';s+='<audio id="sndFlip" src="'+my.sndHome+'pop.mp3" preload="auto"></audio>';s+='<div style="display:none;">';s+='<svg id="svg1" xmlns="http://www.w3.org/2000/svg" width="9" height="9">';s+='<line x1="10" y1="0" x2="0" y2="10" stroke-width="1" stroke="green"/>';s+='</svg>';s+='</div>';s+='<div id="main" style="position:relative; width:'+w+'px;  height:'+h+'px;  margin:auto; display:block; border-radius: 10px; background-image: url('+my.imgHome+'bg3.gif);">';s+='<div id="top" style="font: 24px Arial; text-align:center; margin:3px; height:34px;">'
s+='<div id="btns" style="position:absolute; left: 3px; font: 18px Arial; width:99%;">'
s+='<button type="button" style="z-index:2;" class="btn" onclick="optPop()">Options</button>'
s+='<button type="button" style="z-index:2;" class="btn" onclick="gameNew()">New Game</button>'
my.snds=[];my.soundQ=true
s+=' &nbsp; '
s+=soundBtnHTML()
s+=' &nbsp; '
s+='<button type="button" style="z-index:2; margin-top:7px;" class="btn" onclick="gameUndo()">Undo</button>'
s+='</div>'
s+='<button id="stockBtn" type="button" style="position:absolute; left:'+(my.freePt.x+8)+'px; top:'+(my.freePt.y+20)+'px; z-index:2;" class="btn" onclick="stockReset()">Reset Stock</button>'
s+='<canvas id="canvas1" style=" width:'+w+'px; height:'+h+'px; left: 0px; top: 0px; border: none; pointer-events: none; z-index:2;"></canvas>';s+=optPopHTML();s+='<div style="text-align: right;">';s+='<div id="copyrt" style="font: 10px Arial; font-weight: bold; color: #acf; ">&copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';s+='</div>';s+='</div>';document.write(s);var el=document.getElementById('canvas1');var ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.drag={onQ:false}
window.addEventListener('mousemove',function(ev){mouseMove(ev)})
window.addEventListener('touchmove',function(ev){console.log('touchmove')
var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseMove(ev)})
my.frees=[{id:'',per:3,passN:999,descr:'Turn three cards at a time, with no limit on passes through the deck.'},{id:'',per:3,passN:3,descr:'Turn three cards at a time, with three passes through the deck.'},{id:'',per:1,passN:3,descr:'Turn one card at a time, with three passes through the deck.'},{id:'',per:1,passN:1,descr:'Turn one card at a time, with only a single pass through the deck.'},{id:'',per:1,passN:999,descr:'Turn one card at a time, with no limit on passes through the deck.'},]
my.zIndex=20;my.autoFdnQ=true
my.deck=new Deck();}
function mouseMove(ev){if(!my.drag.onQ)return
var div=my.drag.div
var lt=parseFloat(div.style.left)+ev.clientX-my.drag.x
div.style.left=lt+'px'
my.drag.x=ev.clientX
var tp=parseFloat(div.style.top)+ev.clientY-my.drag.y
div.style.top=tp+'px'
my.drag.y=ev.clientY
for(var i=0;i<my.drag.alsos.length;i++){var card=my.drag.alsos[i]
if(card.pile.type=='from'){lt+=3}else{tp+=my.gap.y}
card.div.style.left=lt+'px'
card.div.style.top=tp+'px'}}
function gameNew(){my.deck.shuffle()
my.zIndex=52
my.hist=[];my.stockPassN=1
stockPassBtnUpdate()
my.score=100;pilesSetup()
cardsPlace()}
function gameUndo(){if(my.hist.length==0)return
for(var i=0;i<my.hist.length;i++){var h=my.hist[i]
console.log('hist',i,h.card.name,h.pFr.id+'->'+h.pTo.id,h)}
var h=my.hist.pop()
console.log('hist',h.card.name,h.pFr.id+'->'+h.pTo.id,h)
var card=h.card
var pFr=h.pTo
var pTo=h.pFr
pFr.sub(card)
pTo.add(card)
for(var i=0;i<h.alsos.length;i++){var card=h.alsos[i]
pFr.sub(card)
pTo.add(card)}
pFr.draw()
pTo.draw()}
function stockReset(){console.log('stockReset',my.stockPassN,my.stockPassMax)
if(my.stockPassN>my.stockPassMax)return
var frees=my.stockToPile.cards.slice()
console.log('stockReset frees=',frees)
my.stockToPile.cards=[];my.stockFromPile.cards=[];for(var i=frees.length-1;i>=0;i--){var card=frees[i];card.show('back')
my.stockFromPile.add(card)}
console.log('stockReset from=',my.stockFromPile.toString())
my.stockToPile.draw()
my.stockFromPile.draw()
my.stockPassN++
stockPassBtnUpdate()}
function stockPassBtnUpdate(){var passLeft=my.stockPassMax-my.stockPassN
var div=document.getElementById('stockBtn')
if(passLeft>0){div.style.visibility='visible'
if(passLeft>9){my.stockPassN=0
div.innerHTML='Reset'}else{div.innerHTML='Reset<br>('+passLeft+' left)'}}else{div.style.visibility='hidden'}}
function winCheck(){for(var i=0;i<my.fdnPiles.length;i++){var p=my.fdnPiles[i]
if(p.cards.length<13)return false}
console.log('WIN!')
soundPlay('sndWin',false)
my.winCards=my.deck.cards.slice()
winAnim()
return true}
function winAnim(){if(my.winCards.length==0)return
var card=my.winCards.pop()
card.place((w-100)*Math.random(),80+(h-80)*Math.random())
setTimeout(winAnim,50)}
function pilesSetup(){my.piles=[]
my.stockFromPile=new Pile('from','from0',my.freePt.x,my.freePt.y)
my.stockFromPile.draw()
my.piles.push(my.stockFromPile)
my.stockToPile=new Pile('to','to0',my.freePt.x+my.gap.x,my.freePt.y)
my.stockToPile.draw()
my.piles.push(my.stockToPile)
my.fdnPiles=[]
for(var i=0;i<4;i++){var p=new Pile('fdn','fdn'+i,my.fdnPnt.x+i*my.gap.x,my.fdnPnt.y)
p.draw()
my.piles.push(p)
my.fdnPiles.push(p)}
my.tabPiles=[]
for(var i=0;i<my.tabMax;i++){var p=new Pile('tab','tab'+i,my.tabPt.x+i*my.gap.x,my.tabPt.y)
my.piles.push(p)
my.tabPiles.push(p)}}
function cardsPlace(){var n=0
for(var i=0;i<my.tabMax;i++){for(var j=0;j<=i;j++){var card=my.deck.cards[n];my.tabPiles[i].add(card)
card.show('back')
n++}}
for(var i=0;i<my.tabMax;i++){var p=my.tabPiles[i]
p.draw()}
for(var i=n;i<my.deck.cards.length;i++){var card=my.deck.cards[i];card.show('back')
my.stockFromPile.add(card)}
my.stockFromPile.draw()
my.stockToPile.draw()}
function pileDrop(me){console.log('pileDrop',me)
var rect={lt:me.pos.x,tp:me.pos.y,wd:me.wd,ht:me.ht,rt:me.pos.x+me.wd,bt:me.pos.y+me.ht}
var max=0
var maxi=-1
for(var i=0;i<my.piles.length;i++){var p=my.piles[i]
if(p!=me.pile){var v=p.dropVal(rect,me)
if(v>max){maxi=i
max=v}}}
console.log('pileDrop',max,maxi)
if(max>0){var pFr=me.pile
var pTo=my.piles[maxi]
me.show('front')
pFr.sub(me)
pTo.add(me)
my.hist.push({pFr:pFr,pTo:pTo,card:me,alsos:me.drag.alsos.slice()})
for(var i=0;i<me.drag.alsos.length;i++){var card=me.drag.alsos[i]
card.show('front')
pFr.sub(card)
pTo.add(card)}
pFr.draw()
pTo.draw()
winCheck()
autoFdn()}else{me.pile.draw()}
return}
function autoFdn(){console.log('autoFdn')
if(!my.autoFdnQ)return
var ps=my.tabPiles.concat(my.stockFromPile).concat(my.stockToPile)
for(var i=0;i<ps.length;i++){var pFr=ps[i]
if(pFr.cards.length>0){var card=pFr.cards[pFr.cards.length-1]
var s=autoPiles(card)
if(s.length>0){soundPlay('sndAuto',true)
setTimeout(autoFdn,200);return}}}
return ''}
function autoPiles(card){for(var j=0;j<my.fdnPiles.length;j++){var pTo=my.fdnPiles[j]
if(pTo.dropPossible(card)){console.log('can drop '+card.name)
var pFr=card.pile
pFr.sub(card)
pTo.add(card)
pFr.draw()
pTo.draw()
winCheck()
my.hist.push({pFr:pFr,pTo:pTo,card:card,alsos:[]})
return 'Drop '+card.name+' to pile '+j}}
return ''}
function rectIntersectQ(r1,r2){return!(r2.lt>r1.rt||r2.rt<r1.lt||r2.tp>r1.bt||r2.bt<r1.tp);}
function rectIntersect(r1,r2){var x=Math.max(r1.lt,r2.lt);var y=Math.max(r1.tp,r2.tp);var xx=Math.min(r1.lt+r1.wd,r2.lt+r2.wd);var yy=Math.min(r1.tp+r1.ht,r2.tp+r2.ht);return({lt:x,tp:y,wd:xx-x,ht:yy-y});}
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
function suitRuleChg(){var id=document.querySelector('input[name="suitRule"]:checked').id
var n=(id.match(/\d+$/)||[]).pop()
my.suitRule=my.suitRules[n]
console.log('suitRule',id,n,my.suitRule)}
function stockPerNChg(){my.stockPerN=document.querySelector('input[name="stockPerN"]:checked').value
console.log('stockPerNChg',my.stockPerN)}
function stockPassMaxChg(){my.stockPassMax=document.querySelector('input[name="stockPassMax"]:checked').value
console.log('stockPassMaxChg',my.stockPassMax)}
function radioHTML(prompt,id,lbls,checkId,func){var s='';s+='<div style="position:relative; margin:auto; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='<div style="font: bold 16px Arial;">';s+=prompt;s+='</div>';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-xnor:rgba(255,255,255,0.5);">';for(var i=0;i<lbls.length;i++){var lbl=lbls[i]
var idi=id+i;var chkStr=(lbl.id==checkId)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.id+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.name+' </label>';}
s+='</div>';s+='</div>';return s;}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:20px; width:320px; padding: 5px; border-radius: 9px; font:14px Arial; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';my.stockPerNs=[{id:1,name:'1'},{id:2,name:2},{id:3,name:3}];my.stockPassMaxs=[{id:1,name:'1'},{id:2,name:2},{id:3,name:3},{id:99,name:99}];s+=radioHTML('Suit order:','suitRule',my.suitRules,'alt','suitRuleChg');s+=radioHTML('Cards turned each time:','stockPerN',my.stockPerNs,my.stockPerN,'stockPerNChg');s+=radioHTML('Maximum passes:','stockPassMax',my.stockPassMaxs,my.stockPassMax,'stockPassMaxChg');s+='<div style="position:relative; margin:auto; background-color:lightblue;  margin: 5px 0 1px 0; padding: 5px 0 5px 0;">';s+='<button type="button" id="tabDropKingQ" style="z-index:2;" class="btn lo" onclick="tabDropKingToggle()">Only Kings to Empty Spaces</button>'
s+='<br>'
s+='<button type="button" id="tabShowFrontQ" style="z-index:2;" class="btn lo" onclick="tabShowFrontToggle()">All Face Up on Tableau</button>'
s+='<br>'
s+='<button type="button" id="autoFdnBtn" style="z-index:2;" class="btn hi" onclick="autoFdnToggle()">Auto Move</button>'
s+='</div>'
s+='<div style="float:right; margin: 0 0 5px 10px; font:16px Arial;">';s+='<button onclick="optYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=my.zIndex+1
pop.style.left=(w-340)/2+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';stockPassBtnUpdate()
console.log('optYes',my.suitRule,my.stockPerN,my.stockPassMax,my.tabDropKingQ,my.tabShowFrontQ,my.autoFdnQ)}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function autoFdnToggle(){my.autoFdnQ=!my.autoFdnQ;toggleBtn("autoFdnBtn",my.autoFdnQ);autoFdn()}
function tabShowFrontToggle(){my.tabShowFrontQ=!my.tabShowFrontQ;toggleBtn("tabShowFrontQ",my.tabShowFrontQ);for(var i=0;i<my.tabPiles.length;i++){var p=my.tabPiles[i]
p.draw()}}
function tabDropKingToggle(){my.tabDropKingQ=!my.tabDropKingQ;toggleBtn("tabDropKingQ",my.tabDropKingQ);}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function Deck(){var files=[{name:'Basic',filename:'card-deck-a.png',rect:{lt:0,tp:0,wd:73,ht:98,gapx:0,gapy:0}},{name:'Pierce',filename:'card-deck-r.svg',rect:{lt:0,tp:0,wd:79,ht:123,gapx:0,gapy:0}},{name:'Deck B',filename:'card-deck-b.png',rect:{lt:9,tp:8,wd:124,ht:171.3,gapx:8.2,gapy:15}},{name:'Deck C',filename:'card-deck-c.svg',rect:{lt:9,tp:8,wd:124,ht:171.3,gapx:8.2,gapy:15}},{name:'Deck D',filename:'card-deck-d.svg',rect:{lt:9,tp:8,wd:124,ht:171.3,gapx:8.2,gapy:15}},{name:'Deck E',filename:'card-deck-e.jpg',rect:{lt:9,tp:8,wd:124,ht:171.3,gapx:8.2,gapy:15}},]
this.file=files[0];this.names=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];this.suits=['Club','Spade','Heart','Diamond'];this.cards=[];this.backImg=new Image();this.backImg.setAttribute('crossOrigin','anonymous');var svg=document.getElementById('svg1');var xml=(new XMLSerializer).serializeToString(svg);this.backImg.src='data:image/svg+xml;charset=utf-8,'+xml;this.frontImg=new Image();this.frontImg.setAttribute('crossOrigin','anonymous');this.frontImg.onload=this.loadCards.bind(this);this.frontImg.src=my.imgHome+this.file.filename;}
Deck.prototype.loadCards=function(){for(var i=0;i<this.suits.length;i++){for(var j=0;j<this.names.length;j++){this.cards.push(new Card(this.names[j],this.suits[i],j,i,this.backImg,this.frontImg,this.file.rect));}}
gameNew()}
Deck.prototype.shuffle=function(){for(var i=this.cards.length-1;i>0;i-=1){var j=Math.floor(Math.random()*(i+1));var temp=this.cards[i];this.cards[i]=this.cards[j];this.cards[j]=temp;}}
Deck.prototype.redraw=function(){for(var i=0;i<this.cards.length;i++){var card=this.cards[i];card.front.style.left=(i*16)+'px';card.front.style.top=(100)+'px';card.front.style.zIndex=i;}}
function Pile(type,id,x,y){this.type=type
this.id=id
this.x=x
this.y=y
this.wd=my.cardWd
this.ht=my.cardHt
this.cards=[]}
Pile.prototype.dropVal=function(rect,card){var r=rectIntersect(rect,this.rect())
if(r.wd<0)return 0
if(r.ht<0)return 0
if(this.dropPossible(card)){return r.wd*r.ht}else{return 0}}
Pile.prototype.dragPossible=function(card){switch(this.type){case 'from':card.drag.alsos=[]
for(var i=this.cards.length-2;i>=Math.max(0,this.cards.length-my.stockPerN);i--){var cardAlso=this.cards[i]
console.log('dragPossible',cardAlso.name)
card.drag.alsos.push(cardAlso)}
console.log('dragPossible',card)
return true
case 'to':return true
case 'free':return false
case 'fdn':return false
case 'tab':if(this.cards[this.cards.length-1]==card)return true
card.drag.alsos=this.dragMultis(card)
if(card.drag.alsos.length==0)return false
return true}
return false}
Pile.prototype.dragMultis=function(card){var n=-1
for(var i=0;i<this.cards.length;i++){if(this.cards[i]==card){n=this.cards.length-i}}
if(n==-1)return[]
var emptyN=freePileCount()
emptyN=52
console.log('dragMultis',n,emptyN)
if((n-1)>emptyN)return[]
var alsos=[]
var cardCurr=card
for(var i=this.cards.length-n+1;i<this.cards.length;i++){var cardNext=this.cards[i]
console.log('',i,cardCurr.name,'vs',cardNext.name)
if(cardCurr.nextOKQ(cardNext)){alsos.push(cardNext)}else{return[]}
cardCurr=cardNext}
return alsos}
Pile.prototype.dropPossible=function(card){if(card.pile.type=='from')return(this.type=='to')
switch(this.type){case 'from':return false
case 'to':return false
case 'free':return false
case 'fdn':if(card.drag.alsos.length>0)return false
if(card.val==this.cards.length+1){if(this.cards.length==0){return true}else{return(card.suit==this.cards[0].suit)}}
return false
case 'tab':if(this.cards.length==0){if(my.tabDropKingQ)return(card.rank=='K')
return true}else{var topCard=this.cards[this.cards.length-1];return topCard.nextOKQ(card)}
return false}
return false}
Pile.prototype.add=function(card){this.cards.push(card)
card.pile=this}
Pile.prototype.sub=function(card){for(var i=0;i<this.cards.length;i++){if(this.cards[i]==card){this.cards.splice(i,1)}}}
function freePileCount(){var n=0
for(var i=0;i<my.piles.length;i++){var p=my.piles[i]
if(p.type=='free'&&p.cards.length==0)n++
if(p.type=='tab'&&p.cards.length==0)n++}
return n}
Pile.prototype.draw=function(){switch(this.type){case 'from':case 'to':case 'free':case 'fdn':g.strokeStyle='#cdf'
g.lineWidth=2
g.fillStyle='#def'
g.beginPath()
g.rect(this.x-4,this.y-1,this.wd,this.ht)
g.fill();g.stroke()
break
case 'tab':break
default:}
var addx=0
var addy=0
this.zIndex=10
var s=''
for(var i=0;i<this.cards.length;i++){var card=this.cards[i]
switch(this.type){case 'to':card.place(this.x+addx,this.y)
if(i>=this.cards.length-my.stockPerN)addx+=my.gap.y
break
case 'free':card.place(this.x,this.y)
break
case 'fdn':card.place(this.x,this.y)
break
case 'tab':card.place(this.x,this.y+addy)
addy+=my.gap.y
if(my.tabShowFrontQ){card.show('front')}
if(i>=this.cards.length-1){if(card.face!='front'){card.show('front')
soundPlay('sndFlip')}}
break
default:card.place(this.x,this.y)}
card.setZ(this.zIndex++)
s+=card.name+','}
console.log('draw '+this.id+': '+s)}
Pile.prototype.toString=function(){var s=''
for(var i=0;i<this.cards.length;i++){var card=this.cards[i]
s+=card.name+','}
return s}
Pile.prototype.rect=function(){var addy=0
if(this.type=='tab'){addy=this.cards.length*my.gap.y}
return{lt:this.x,tp:this.y+addy,wd:this.wd,ht:this.ht,rt:this.x+this.wd,bt:this.y+this.ht+addy}}
function Card(rank,suit,i,j,backImg,frontImg,rect){this.val=i+1;this.rank=rank;this.suit=suit;this.clr=(suit=='Club'||suit=='Spade')?'black':'red'
this.name=this.rank+" of "+this.suit+'s';this.face='front'
this.showQ=true
this.pos={x:0,y:0}
this.stt={x:0,y:0}
this.wd=my.cardWd
this.ht=my.cardHt
this.pile=null
this.div=document.createElement("div")
this.div.style.width=this.wd+'px'
this.div.style.height=this.ht+'px'
this.div.style.position='absolute'
document.getElementById('main').appendChild(this.div);this.front=document.createElement('canvas');this.div.appendChild(this.front);this.front.width=this.wd;this.front.height=this.ht;var context=this.front.getContext('2d');this.front.style.position="absolute";this.drawFront(frontImg,rect,i,j,context);this.back=document.createElement('canvas');this.div.appendChild(this.back);this.back.width=this.wd;this.back.height=this.ht;this.drawBack(backImg);var div=this.div
var me=this
me.drag={onQ:false,x:0,y:0,alsos:[]}
my.drag=me.drag
div.addEventListener('mouseover',function(){document.body.style.cursor="pointer";})
div.addEventListener('mouseleave',function(){me.div.style.opacity=1
document.body.style.cursor="default";})
div.addEventListener('mousedown',function(ev){me.mouseDown(ev)})
div.addEventListener('mouseup',function(){me.mouseUp()})
div.addEventListener('touchstart',function(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;me.mouseDown(ev)})
div.addEventListener('touchend',function(ev){me.mouseUp(ev)})}
Card.prototype.mouseDown=function(ev){console.log('mouseDown')
var me=this
me.div.style.zIndex=my.zIndex++
me.div.style.opacity=0.85
console.log('mouseDown 2')
if(me.pile.dragPossible(me)){me.div.style.opacity=1
me.drag.onQ=true
me.drag.x=ev.clientX
me.drag.y=ev.clientY
me.drag.div=me.div
me.div.style.zIndex=my.zIndex++;me.stt.x=parseFloat(me.div.style.left)
me.stt.y=parseFloat(me.div.style.top)
for(var i=0;i<me.drag.alsos.length;i++){var card=me.drag.alsos[i]
if(this.pile.type!='from')card.div.style.zIndex=my.zIndex++;}}
ev.preventDefault()
my.drag=me.drag
console.log('mousedown',my.zIndex,my.drag)}
Card.prototype.mouseUp=function(){this.drag.onQ=false
this.div.style.opacity=1
this.pos.x=parseInt(this.div.style.left)
this.pos.y=parseInt(this.div.style.top)
pileDrop(this)
this.drag.alsos=[];}
Card.prototype.nextOKQ=function(card){if(card.val==this.val-1){switch(my.suitRule.id){case 'any':return true
case 'alt':return(card.clr!=this.clr)
case 'same':return(card.suit==this.suit)}}
return false}
Card.prototype.setZ=function(z){this.div.style.zIndex=z}
Card.prototype.drawFront=function(frontImg,rect,i,j,ctx){var scratchCanvas=document.createElement('canvas');scratchCanvas.width=100;scratchCanvas.height=100;var scratchCtx=scratchCanvas.getContext('2d');scratchCtx.clearRect(0,0,scratchCanvas.width,scratchCanvas.height);scratchCtx.globalCompositeOperation='source-over';var gap=0
scratchCtx.drawImage(frontImg,rect.lt+i*(rect.wd+rect.gapx),rect.tp+j*(rect.ht+rect.gapy),rect.wd,rect.ht,gap,gap,this.wd-2*gap,this.ht-2*gap);scratchCtx.fillStyle='#fff';scratchCtx.strokeStyle='black'
scratchCtx.globalCompositeOperation='destination-in';scratchCtx.beginPath();var gap=0.6
var round=11.1
scratchCtx.roundRect(gap,gap,this.wd-2*gap,this.ht-2*gap,round)
scratchCtx.closePath();scratchCtx.fill();ctx.drawImage(scratchCanvas,0,0);ctx.strokeStyle='#888'
ctx.lineWidth=0.6
ctx.beginPath()
ctx.roundRect(gap,gap,this.wd-2*gap,this.ht-2*gap,round)
ctx.stroke()}
Card.prototype.drawBack=function(backImg){var g=this.back.getContext('2d');g.strokeStyle='#def';g.fillStyle='#def';g.beginPath();g.roundRect(0,0,this.wd,this.ht,5);g.fill();g.strokeStyle='#999'
g.lineWidth=0.6
g.beginPath()
var gap=0.6
var round=11.1
g.roundRect(gap,gap,this.wd-2*gap,this.ht-2*gap,round)
g.stroke()
var gap=6;g.strokeStyle='grey';g.fillStyle=g.createPattern(backImg,"repeat");g.beginPath();g.roundRect(gap,gap,this.wd-2*gap,this.ht-2*gap,gap/2);g.fill();g.stroke();}
Card.prototype.show=function(face){this.face=face
switch(face){case 'front':this.front.style.visibility='visible';this.back.style.visibility='hidden';break;case 'back':this.front.style.visibility='hidden';this.back.style.visibility='visible';break;case 'none':this.front.style.visibility='hidden';this.back.style.visibility='hidden';break;default:}}
Card.prototype.place=function(x,y){this.div.style.left=x+'px';this.div.style.top=y+'px';}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;}