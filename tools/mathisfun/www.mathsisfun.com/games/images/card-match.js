var w,h,ratio,i,s,el,g,div,dragQ,game,my={};function cardmatchMain(mode){var version='0.62';typ=typeof mode!=='undefined'?mode:'longitudinal';w=360;h=480;radius=150;my.games=[{name:'Aces and 2s',typ:'a2',rowMax:4,colMax:4},{name:'Aces',typ:'a',rowMax:2,colMax:4},{name:'345',typ:'345',rowMax:4,colMax:6},{name:'Hearts and Spades',typ:'hs',rowMax:4,colMax:4},{name:'Royals',typ:'royals',rowMax:4,colMax:6},];my.gameNo=0;my.game=my.games[my.gameNo];var s='';s+='<audio id="sndturn" src="../images/sounds/swish.mp3" preload="auto"></audio>';s+='<audio id="sndback" src="../images/sounds/swish3.mp3" preload="auto"></audio>';s+='<audio id="sndwin" src="../images/sounds/success.mp3" preload="auto"></audio>';s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: none; border-radius: 10px;">';s+='<div id="canvasDad" style="">';s+='</div>';s+='<div id="togo" style="position: relative; top: 0px; width:60px; float:left; padding: 8px; border-radius: 10px; background-color: rgba(0,100,100,1); z-index: 30; color:white; font: 24px Arial; text-align:center; margin-right:10px;">0</div>';my.soundQ=true
s+=soundBtnHTML('rgba(0,100,100,1)')
s+='<div id="clock" style="position: relative; top: 0px; width:60px; float:right; padding: 8px; border-radius: 10px; background-color: rgba(0,0,100,0.7); z-index: 30; color:white; font: 24px Arial; text-align:center;">';s+=getDClockHTML();s+='</div>';s+='<div style="visibility:hidden">';s+='<svg id="svg1" xmlns="http://www.w3.org/2000/svg" width="9" height="9">';s+='<line x1="10" y1="0" x2="0" y2="10" stroke-width="1" stroke="green"/>';s+='</svg>';s+='</div>';s+='<div id="result" style="position: absolute; left: 10px; top: 90px; width: '+(w-60)+'px; text-align: center; padding: 20px; border-radius: 20px; background-color: rgba(0,0,100,0.5); z-index: 30; ">';s+='<div id="msg" style="font: 28px Verdana; color: white;"></div>';s+='<br>';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+=getRadioHTML('Game','game',my.games,'radioClick');s+='<button id="restart" style="font: 14px Arial; height:30px; text-align:right; z-index: 10;" class="togglebtn" onclick="gameStart()" >New Game</button>';s+='</div>';s+='<div style="font: 11px Arial; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);this.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];clrNum=0;my.reveals=[];my.noClickQ=false;my.deck=new Deck();}
function radioClick(n){my.gameNo=n;}
function gameStart(){my.game=my.games[my.gameNo];console.log("gameStart",my.game,my.gameNo);var div=document.getElementById('result');div.style.visibility='hidden';var fromDate=new Date(Date.parse(new Date()));initializeClock('clockdiv',fromDate);my.deck.makeCards();my.deck.shuffle();placeCards();document.getElementById('togo').innerHTML=my.deck.countFace(false);my.inGameQ=true;my.revealN=0;}
function placeCards(){var xp=20;var yp=0;for(var i=0;i<my.game.rowMax;i++){for(var j=0;j<my.game.colMax;j++){var cardNo=i*my.game.colMax+j;var card=my.deck.cards[cardNo];card.show('back');xp=j*80;yp=50+i*100;card.place(xp,yp);}}}
function typChg(){var div=document.getElementById('typSel');typ=div.options[div.selectedIndex].text;typ=typ.toLowerCase();console.log("typChg",typ);restart();}
function getRadioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.7);font: 16px Verdana; text-align:left;">';s+=prompt+':';for(var i=0;i<lbls.length;i++){var idi=id+i;var lbl=lbls[i];var check='';if(i==0)check='  checked="checked" ';s+='<br>';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');"'+check+'   autocomplete="off" >';s+='<label for="'+idi+'">'+lbl.name+' </label>';}
s+='</div>';return s;}
function getDropdownHTML(opts,funcName,id){var s='';s+='<select id="'+id+'" style="font: 15px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off" >';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==0?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:18px;" '+chkStr+' >'+opts[i]+'</option>';}
s+='</select>';return s;}
function getPlayHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="togglePlay()" ></button>';return s;}
function matchNo(){if(my.soundQ)document.getElementById('sndback').play();my.reveals[0].rotateTo(false);my.reveals[1].rotateTo(false);my.revealN=0;my.noClickQ=false;var togo=my.deck.countFace(false);}
function matchYes(){my.revealN=0;my.noClickQ=false;var togo=my.deck.countFace(false);togo-=1;document.getElementById('togo').innerHTML=togo;if(togo<=0)successDo();}
function successDo(){console.log("successDo");if(my.soundQ)document.getElementById('sndwin').play();var timeStr=document.getElementById('clockdiv').innerHTML;var s='';s+='Well Done!<br>';s+='You finished in '+timeStr;var div=document.getElementById('msg');div.innerHTML=s;clearInterval(my.timeinterval);var div=document.getElementById('result');div.style.visibility='visible';}
function togglePlay(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");anim();}}
function anim(){if(my.playQ){requestAnimationFrame(anim);}}
function cutoffCallback(){}
function endGameCallback(){}
function getDClockHTML(){var s='';s+='<div id="clockdiv">';s+='<span class="minutes">00</span>:';s+='<span class="seconds">00</span>';s+='</div>';return s;}
function getTimeSoFar(stttime){var t=Date.parse(new Date())-Date.parse(stttime);var seconds=Math.floor((t/1000)%60);var minutes=Math.floor((t/1000/60)%60);var hours=Math.floor((t/(1000*60*60))%24);var days=Math.floor(t/(1000*60*60*24));return{'total':t,'days':days,'hours':hours,'minutes':minutes,'seconds':seconds};}
function getTimeRemaining(endtime){var t=Date.parse(endtime)-Date.parse(new Date());var seconds=Math.floor((t/1000)%60);var minutes=Math.floor((t/1000/60)%60);var hours=Math.floor((t/(1000*60*60))%24);var days=Math.floor(t/(1000*60*60*24));return{'total':t,'days':days,'hours':hours,'minutes':minutes,'seconds':seconds};}
function stopClock(){clearInterval(my.timeinterval);}
function initializeClock(id,stttime){var clock=document.getElementById(id);var minutesSpan=clock.querySelector('.minutes');var secondsSpan=clock.querySelector('.seconds');function updateClock(){var t=getTimeSoFar(stttime);minutesSpan.innerHTML=('0'+t.minutes).slice(-2);secondsSpan.innerHTML=('0'+t.seconds).slice(-2);if(t.total<=0){clearInterval(my.timeinterval);}}
updateClock();my.timeinterval=setInterval(updateClock,1000);}
function Deck(){this.names=['1','2','3','4','5','6','7','8','9','10','J','Q','K'];this.suits=['Clubs','Spades','Hearts','Diamonds'];this.cards=[];this.backImg=new Image();this.backImg.setAttribute('crossOrigin','anonymous');var svg=document.getElementById('svg1');var xml=(new XMLSerializer).serializeToString(svg);this.backImg.src='data:image/svg+xml;charset=utf-8,'+xml;this.frontImg=new Image();this.frontImg.setAttribute('crossOrigin','anonymous');this.frontImg.onload=this.makeCards.bind(this);this.frontImg.src='../data/images/cards.png';}
Deck.prototype.makeCards=function(){var dadDiv=document.getElementById("canvasDad");while(dadDiv.firstChild){dadDiv.removeChild(dadDiv.firstChild);}
this.cards=[];var deckTyp=my.game.typ;switch(deckTyp){case 'full':for(var i=0;i<this.suits.length;i++){for(var j=0;j<this.names.length;j++){this.cards.push(new Card(this.names[j],this.suits[i],j,i,this.backImg,this.frontImg));}}
break;case 'a':for(var i=0;i<this.suits.length;i++){for(var j=0;j<1;j++){for(var k=0;k<2;k++){this.cards.push(new Card(this.names[j],this.suits[i],j,i,this.backImg,this.frontImg));}}}
break;case 'a2':for(var i=0;i<this.suits.length;i++){for(var j=0;j<2;j++){for(var k=0;k<2;k++){this.cards.push(new Card(this.names[j],this.suits[i],j,i,this.backImg,this.frontImg));}}}
break;case 'hs':for(var i=0;i<this.suits.length;i++){var suit=this.suits[i]
if(suit=='Hearts'||suit=='Spades'){for(var j=0;j<4;j++){for(var k=0;k<2;k++){this.cards.push(new Card(this.names[j],this.suits[i],j,i,this.backImg,this.frontImg));}}}}
break;case '345':for(var i=0;i<this.suits.length;i++){for(var j=2;j<5;j++){for(var k=0;k<2;k++){this.cards.push(new Card(this.names[j],this.suits[i],j,i,this.backImg,this.frontImg));}}}
break;case 'royals':for(var i=0;i<this.suits.length;i++){for(var j=10;j<13;j++){for(var k=0;k<2;k++){this.cards.push(new Card(this.names[j],this.suits[i],j,i,this.backImg,this.frontImg));}}}
break;default:}}
Deck.prototype.countFace=function(frontq){var n=0;for(var i=0;i<this.cards.length;i++){var card=this.cards[i];if(card.frontQ==frontq)n++;}
return n;}
Deck.prototype.shuffle=function(){for(var i=this.cards.length-1;i>0;i-=1){var j=Math.floor(Math.random()*(i+1));var temp=this.cards[i];this.cards[i]=this.cards[j];this.cards[j]=temp;}}
Deck.prototype.redraw=function(){for(var i=0;i<this.cards.length;i++){var card=this.cards[i];card.front.style.left=(i*16)+'px';card.front.style.top=(100)+'px';card.front.style.zIndex=i;}}
function Card(rank,suit,i,j,backImg,frontImg){this.val=i;this.rank=rank;this.suit=suit;this.name=this.rank+" of "+this.suit;this.frontQ=true;this.ratio=1;this.wd=73;this.ht=98;var dadDiv=document.getElementById('canvasDad');this.front=document.createElement('canvas');dadDiv.appendChild(this.front);this.front.width=this.wd;this.front.height=this.ht;var context=this.front.getContext('2d');context.drawImage(frontImg,i*this.wd,j*this.ht,this.wd,this.ht,0,0,this.wd,this.ht);this.front.style.position="absolute";this.front.style.visibility='hidden';this.front.addEventListener('mousedown',this.click.bind(this));this.back=document.createElement('canvas');dadDiv.appendChild(this.back);this.back.width=this.wd;this.back.height=this.ht;this.drawBack(backImg);this.back.style.position="absolute";this.place(i*(this.wd+6),150);this.back.style.visibility='hidden';this.back.addEventListener('mousedown',this.click.bind(this));}
Card.prototype.click=function(){if(my.noClickQ)return;if(this.frontQ)return;my.reveals[my.revealN]=this;my.revealN++;if(my.soundQ){soundStopAll()
document.getElementById('sndturn').play();}
if(my.revealN>=2){if(my.reveals[0].name==my.reveals[1].name){my.revealN=0;matchYes();}else{my.noClickQ=true;setTimeout(matchNo,1000);}}
this.rotateStt();}
Card.prototype.rotateTo=function(frontq){if(this.frontQ!=frontq){this.rotateStt();}}
Card.prototype.rotateStt=function(){this.stt=performance.now();this.toFrontQ=!this.frontQ;this.rotate();}
Card.prototype.rotate=function(){var step=0.1;if(this.toFrontQ){if(!this.frontQ){this.ratio-=step;this.back.style.width=(this.wd*this.ratio)+'px';this.back.style.height=this.ht+'px';this.back.style.left=(this.x+this.wd*(1-this.ratio)/2)+'px';this.back.style.top=this.y+'px';if(this.ratio>=0){requestAnimationFrame(this.rotate.bind(this));}else{this.frontQ=true;this.front.style.width='0px';this.show('front');requestAnimationFrame(this.rotate.bind(this));}}else{this.ratio+=step;this.front.style.width=(this.wd*this.ratio)+'px';this.front.style.height=this.ht+'px';this.front.style.left=(this.x+this.wd*(1-this.ratio)/2)+'px';this.front.style.top=this.y+'px';if(this.ratio<1){requestAnimationFrame(this.rotate.bind(this));}else{this.front.style.width=this.wd+'px';this.front.style.height=this.ht+'px';this.back.style.width=this.wd+'px';this.back.style.height=this.ht+'px';}}}else{if(this.frontQ){this.ratio-=step;this.front.style.width=(this.wd*this.ratio)+'px';this.front.style.height=this.ht+'px';this.front.style.left=(this.x+this.wd*(1-this.ratio)/2)+'px';this.front.style.top=this.y+'px';if(this.ratio>=0){requestAnimationFrame(this.rotate.bind(this));}else{this.frontQ=false;this.back.style.width='0px';this.show('back');requestAnimationFrame(this.rotate.bind(this));}}else{this.ratio+=step;this.back.style.width=(this.wd*this.ratio)+'px';this.back.style.height=this.ht+'px';this.back.style.left=(this.x+this.wd*(1-this.ratio)/2)+'px';this.back.style.top=this.y+'px';if(this.ratio<1){requestAnimationFrame(this.rotate.bind(this));}else{this.front.style.width=this.wd+'px';this.front.style.height=this.ht+'px';this.back.style.width=this.wd+'px';this.back.style.height=this.ht+'px';}}}}
Card.prototype.drawBack=function(backImg){var g=this.back.getContext('2d');g.strokeStyle='#def';g.fillStyle='#def';g.beginPath();g.roundRect(0,0,this.wd,this.ht,5);g.fill();var gap=6;g.strokeStyle='grey';g.fillStyle=g.createPattern(backImg,"repeat");g.beginPath();g.roundRect(gap,gap,this.wd-2*gap,this.ht-2*gap,gap/2);g.fill();g.stroke();}
Card.prototype.show=function(side){switch(side){case 'front':this.front.style.visibility='visible';this.back.style.visibility='hidden';this.frontQ=true;break;case 'back':this.front.style.visibility='hidden';this.back.style.visibility='visible';this.frontQ=false;break;case 'none':this.front.style.visibility='hidden';this.back.style.visibility='hidden';break;default:}}
Card.prototype.place=function(x,y){this.x=x;this.y=y;this.front.style.left=x+'px';this.front.style.top=y+'px';this.back.style.left=x+'px';this.back.style.top=y+'px';}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;}
function soundBtnHTML(clr){s=''
s+='<style> '
s+=' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
s+=' .speaker span { display: block; width: 9px; height: 9px; background-color: '+clr+'; margin: 10px 0 0 1px; }'
s+=' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent '+clr+' transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
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
function soundStopAll(){var sounds=document.getElementsByTagName('audio');for(i=0;i<sounds.length;i++){sounds[i].pause();sounds[i].currentTime=0.0;}}