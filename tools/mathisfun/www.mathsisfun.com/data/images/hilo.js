var w,h,g,my={};function hiloMain(mode){var version='0.62';w=360;h=180;var s='';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndWin" src="'+my.sndHome+'kids-cheer.mp3" preload="auto"></audio>';s+='<audio id="sndGain" src="'+my.sndHome+'tish.mp3" preload="auto"></audio>';s+='<audio id="sndLose" src="'+my.sndHome+'no.mp3" preload="auto"></audio>';s+='<div style="display:none;">';s+='<svg id="svg1" xmlns="http://www.w3.org/2000/svg" width="9" height="9">';s+='<line x1="10" y1="0" x2="0" y2="10" stroke-width="1" stroke="green"/>';s+='</svg>';s+='</div>';s+='<div id="main" style="position:relative; width:'+w+'px;  margin:auto; display:block; border-radius: 10px;">';s+='<div style="text-align: right;">';my.snds=[];my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='<div id="copyrt" style="float:left; font: 10px Arial; font-weight: bold; color: #acf; ">&copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';s+='<div style="text-align: center;">';s+='<div id="score" style="font: 36px Verdana; color:black; background-color:#def; border-radius:10px; margin:6px;">0</div>';s+='</div>';s+='<div style="text-align: center;">';s+='<div style="display: inline-block; font:22px Arial; width: 50px; text-align: right; ">Bet:</div>'
s+='<input type="range" id="betrange"  value="3" min="0" max="5" step="0.1"  style="width:200px; height:10px; border: none; " oninput="onBetChg(0,this.value)" onchange="onBetChg(1,this.value)" />';s+='<div id="bet" style="display: inline-block; width:50px; font: 25px Arial; color: #6600cc; text-align: left;">2</div>';s+='</div>';s+='<div style="text-align: center;">';s+='<button id="higher" style="font: 20px Arial; height:32px; z-index: 10;" class="btn" onclick="choose(true)" >Higher</button>';s+='<br>';s+='<button id="lower" style="font: 20px Arial; height:32px; z-index: 10;" class="btn" onclick="choose(false)" >Lower</button>';s+='</div>';s+='<div id="result" style="position: absolute; left: 10px; top: 100px; width: '+(w-60)+'px; text-align: center; padding: 20px; border-radius: 20px; background-color: rgba(0,0,100,0.5); z-index: 30; ">';s+='<div id="msg" style="font: 28px Verdana; color: white;"></div>';s+='<br>';s+='<button id="restart" style="font: 14px Arial; height:30px; text-align:right; z-index: 10;" class="btn" onclick="gameStart()" >New Game</button>';s+='</div>';s+='</div>';document.write(s);my.deck=new Deck();my.inGameQ=false;}
function onBetChg(n,v){v=Math.round(v);document.getElementById('bet').innerHTML=v;my.bet=v;}
function setBet(){var min=Math.round(my.score/2);var max=Math.round(my.score);var div=document.getElementById('betrange');console.log("setBet div",div.value,div.min,div.max);var ratio=(div.value-div.min)/(div.max-div.min);div.min=min;div.max=max;if(!isNaN(ratio))my.bet=Math.round(min+ratio*(max-min));console.log("setBet",min,max,ratio,my.bet);div.value=my.bet;document.getElementById('bet').innerHTML=my.bet;}
function gameStart(){var div=document.getElementById('result');div.style.visibility='hidden';do{console.log("shuffle");my.deck.shuffle();}while(skipCardQ(my.deck.cards[0].val));my.cardNo=0;my.cardMax=8;my.score=100;document.getElementById('score').innerHTML=my.score;my.bet=100;setBet();drawCards();my.inGameQ=true;}
function skipCardQ(cardVal){if(cardVal<=1||cardVal>=11)return true;return false;}
function choose(hiQ){if(!my.inGameQ)return;var prevCard=my.deck.cards[my.cardNo];var thisCard=my.deck.cards[my.cardNo+1];console.log("choose",hiQ,prevCard.name,prevCard.val,thisCard.name,thisCard.val);var winQ=false;if(hiQ){if(thisCard.val>prevCard.val)winQ=true;}else{if(thisCard.val<prevCard.val)winQ=true;}
if(winQ){my.score+=Math.round(my.bet);soundPlay('sndGain')}else{my.score-=Math.round(my.bet);soundPlay('sndLose')}
if(my.score<=0){gameOver();}
document.getElementById('score').innerHTML=my.score;setBet();cardNext();}
function cardNext(){my.cardMax--;do{my.cardNo++;my.cardMax++;}while(skipCardQ(my.deck.cards[my.cardNo].val));drawCards();console.log("user cardNo",my.cardNo,my.cardMax);if(my.cardNo>=my.cardMax-1){gameOver();}}
function gameOver(){console.log("gameOver");my.inGameQ=false;var div=document.getElementById('result');div.style.visibility='visible';var s='';if(my.score<=0){s='Ooops,<br>points all gone';}else{if(my.score<200){s='You got '+my.score+' points';}else{s='Congratulations! You got '+my.score+' points';soundPlay('sndWin')}}
document.getElementById('msg').innerHTML=s;}
function drawCards(){var xp=20;var yp=190;for(var i=0;i<my.deck.cards.length;i++){var card=my.deck.cards[i];if(i>=my.cardMax){card.show('none');}else{if(i<=my.cardNo){card.show('front');}else{card.show('back');}
card.place(xp,yp);xp+=80;if(xp>300){xp=20;yp+=100;}}}}
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
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue();};}
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function Deck(){this.names=['1','2','3','4','5','6','7','8','9','10','J','Q','K'];this.suits=['Hearts','Diamonds','Spades','Clubs'];this.cards=[];this.backImg=new Image();this.backImg.setAttribute('crossOrigin','anonymous');var svg=document.getElementById('svg1');var xml=(new XMLSerializer).serializeToString(svg);this.backImg.src='data:image/svg+xml;charset=utf-8,'+xml;this.frontImg=new Image();this.frontImg.setAttribute('crossOrigin','anonymous');this.frontImg.onload=this.loadCards.bind(this);my.imgHome=(document.domain=='localhost')?'/mathsisfun/data/images/':'/data/images/'
this.frontImg.src=my.imgHome+'cards.png';}
Deck.prototype.loadCards=function(){for(var i=0;i<this.suits.length;i++){for(var j=0;j<this.names.length;j++){this.cards.push(new Card(this.names[j],this.suits[i],j,i,this.backImg,this.frontImg));}}
this.shuffle();gameStart();}
Deck.prototype.shuffle=function(){for(var i=this.cards.length-1;i>0;i-=1){var j=Math.floor(Math.random()*(i+1));var temp=this.cards[i];this.cards[i]=this.cards[j];this.cards[j]=temp;}}
Deck.prototype.redraw=function(){for(var i=0;i<this.cards.length;i++){var card=this.cards[i];card.front.style.left=(i*16)+'px';card.front.style.top=(100)+'px';card.front.style.zIndex=i;}}
function Card(rank,suit,i,j,backImg,frontImg){this.val=i;this.rank=rank;this.suit=suit;this.name=this.rank+" of "+this.suit;this.frontQ=true;this.wd=73;this.ht=98;var mainDiv=document.getElementById('main');this.front=document.createElement('canvas');mainDiv.appendChild(this.front);this.front.width=this.wd;this.front.height=this.ht;var context=this.front.getContext('2d');context.drawImage(frontImg,i*this.wd,j*this.ht,this.wd,this.ht,0,0,this.wd,this.ht);this.front.style.position="absolute";this.front.style.visibility='hidden';this.back=document.createElement('canvas');mainDiv.appendChild(this.back);this.back.width=this.wd;this.back.height=this.ht;this.drawBack(backImg);this.back.style.position="absolute";this.place(i*(this.wd+6),150);this.back.style.visibility='hidden';}
Card.prototype.drawBack=function(backImg){var g=this.back.getContext('2d');g.strokeStyle='#def';g.fillStyle='#def';g.beginPath();g.roundRect(0,0,this.wd,this.ht,5);g.fill();var gap=6;g.strokeStyle='grey';g.fillStyle=g.createPattern(backImg,"repeat");g.beginPath();g.roundRect(gap,gap,this.wd-2*gap,this.ht-2*gap,gap/2);g.fill();g.stroke();}
Card.prototype.show=function(side){switch(side){case 'front':this.front.style.visibility='visible';this.back.style.visibility='hidden';break;case 'back':this.front.style.visibility='hidden';this.back.style.visibility='visible';break;case 'none':this.front.style.visibility='hidden';this.back.style.visibility='hidden';break;default:}}
Card.prototype.place=function(x,y){this.front.style.left=x+'px';this.front.style.top=y+'px';this.back.style.left=x+'px';this.back.style.top=y+'px';}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;}