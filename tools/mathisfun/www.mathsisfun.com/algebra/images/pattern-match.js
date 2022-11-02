var w,h,ratio,el,g,my={};function patternmatchMain(mode){var version='0.63';my.type=typeof mode!=='undefined'?mode:'clr';console.log("my.type",my.type);w=500;h=350;my.hards=[{title:'Easy',seqLen:2,patFix:8,patRand:2,secretLen:2,score:10},{title:'Basic',seqLen:3,patFix:10,patRand:3,secretLen:3,score:20},{title:'Hard',seqLen:4,patFix:12,patRand:4,secretLen:4,score:50},{title:'Tough',seqLen:5,patFix:16,patRand:0,secretLen:5,score:100}];my.types=[{id:'num',title:'Numbers'},{id:'clr',title:'Colors'},{id:'shape',title:'Shapes'},{id:'ltr',title:'Letters'}]
my.typeN=0
for(var i=0;i<my.types.length;i++){var type=my.types[i]
if(type.id==my.type)my.typeN=i}
my.seed=+new Date();console.log('seed',my.seed);my.pathType='angle';my.rad=15;my.choiceN=9
my.nums=[1,2,3,4,5,6,7,8,9,10];my.ltrs=['a','b','c','d','e','f','g','h','i','j'];my.clrs=[["Navy",'#000080'],["Blue",'#0000FF'],["Light Blue",'#ADD8E6'],["Gold",'#ffd700'],["Yellow",'#ffff00'],["Red",'#FF0000'],["Pink",'#FFb6c1'],["Orange",'#FFA500'],["Black",'#000000'],["Green",'#00cc00'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Med Purple",'#aa00aa'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];my.shapes=['triangle','square','rectangle','kite','pentagon','hexagon','circle','ellipse','semicircle','quadrant','line']
var s='';s+='<style>'
s+='.btn { text-align: center; margin: 2px; text-decoration: none; color: #19667d; border: 1px solid #88aaff; border-radius: 10px; cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); } .btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.btnBlank { text-align: center; margin: 2px; text-decoration: none; color: #19667d; border: 1px outset; border-radius: 10px; cursor: pointer;  } .btnBlank:hover { border: 1px inset yellow; }'
s+='</style>'
my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndYes" src="'+my.sndHome+'swish2.mp3" preload="auto"></audio>';s+='<audio id="sndNo" src="'+my.sndHome+'no.mp3" preload="auto"></audio>';s+='<audio id="sndChoose" src="'+my.sndHome+'click2.mp3" preload="auto"></audio>';s+='<audio id="sndPlace" src="'+my.sndHome+'rollover.mp3" preload="auto"></audio>';my.snds=[];s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 1px solid black; border-radius: 10px;">';s+='<div style="position:relative; text-align:center; margin:6px; ">';s+='<button class="btn" style=" height:32px; font: 17px Arial;" onclick="optPop()" >Options</button>';s+='<button class="btn" style="height:32px; font: 17px Arial;" onclick="update()" >New</button>';my.soundQ=true
s+='&nbsp;'
s+=soundBtnHTML()
s+='</div>';s+='<div id="choices" style="position:relative; text-align:center; margin:6px; background-color:hsla(240,100%,90%,0.5);">';s+=btnHTML();s+='</div>';s+='<div style="position:relative;">';s+='<canvas id="canvas1" style="position: absolute; width:'+w+'px; height:'+h+'px; left: 0px; top: 0px; border: none;"></canvas>';s+='</div>';s+='<div id="score" style="position:absolute; color:darkblue; left:5px; top:5px; text-align:center; font:bold 28px Arial;"></div>';s+=optPopHTML();s+='<div id="hint" style="position:absolute; left:5px; top:95px; width:'+w+'px; text-align:center; font:22px Arial;"></div>';s+='<div id="msg" style="position:absolute; left:5px; bottom:22px; width:'+w+'px; text-align:center; font:30px Arial;"></div>';s+='<div id="copyrt" style="font: 11px Arial; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);if(my.type=='shape'){for(var i=0;i<my.choiceN;i++){btnDraw('shape'+i,my.shapes[i])}}
el=document.getElementById('canvas1');ratio=3;el.width=w*ratio;el.height=(h-60)*ratio;el.style.width=w+"px";el.style.height=(h-60)+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);soundPlay('sndPlace')
hardChg(0)
my.score=0
scoreAdd(0)
msg('what belongs there?')}
function btnDraw(id,style){var w=40;var h=40;var el=document.getElementById(id);var ratio=3;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";var g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);g.strokeStyle='#ff0000';g.fillStyle='hsla(240,100%,90%,0.5)';g.lineWidth=2;shapeDraw(g,{x:20,y:20},style)
g.stroke();g.fill();}
function shapeDraw(g,pt,style){g.translate(pt.x,pt.y)
switch(style.toLowerCase()){case 'triangle':var sides=3;var poly=getRegular(0,2,17,Math.PI*(0.5+1/sides),sides);drawPts(g,poly);g.closePath()
break;case 'square':g.rect(-13,-13,26,26)
break;case "rectangle":g.rect(-14,-9,28,18)
break;case 'kite':g.moveTo(0,-16);g.lineTo(14,-6);g.lineTo(0,16);g.lineTo(-14,-6);g.closePath()
break;case 'pentagon':var sides=5;var poly=getRegular(0,0,15,Math.PI*(0.5+1/sides),sides);drawPts(g,poly);g.closePath()
break;case 'hexagon':var sides=6;var poly=getRegular(0,0,15,Math.PI*(0.5+1/sides),sides);drawPts(g,poly);g.closePath()
break;case "circle":g.arc(0,0,15,0,2*Math.PI);break;case "ellipse":drawEllipseRadius(g,0,0,15,10,5);break;case 'semicircle':g.arc(0,-7,15,0,Math.PI)
g.closePath()
break;case 'quadrant':g.moveTo(-9,-9)
g.arc(-9,-9,20,0,Math.PI/2)
g.closePath()
break;case "line":g.moveTo(-10,10);g.lineTo(10,-10);break;case "pen":g.strokeStyle='#ff0000';g.lineWidth=2;g.moveTo(10,14);g.lineTo(16,16);g.lineTo(20,21);g.lineTo(22,22);g.lineTo(25,24);g.lineTo(27,27);break;case "circles":g.strokeStyle='#000000';g.lineWidth=1;g.arc(18,18,4,0,2*Math.PI);g.arc(23,23,5,0,2*Math.PI);g.arc(25,26,3,0,2*Math.PI);break;case "dots":g.strokeStyle='#000000';g.lineWidth=1;g.beginPath();g.arc(16,12,1,0,2*Math.PI);g.stroke();g.beginPath();g.arc(18,18,1,0,2*Math.PI);g.stroke();g.beginPath();g.arc(20,21,1,0,2*Math.PI);g.stroke();g.beginPath();g.arc(22,22,1,0,2*Math.PI);g.stroke();g.beginPath();g.arc(25,24,1,0,2*Math.PI);g.stroke();g.beginPath();g.arc(27,27,1,0,2*Math.PI);g.stroke();g.beginPath();g.arc(32,30,1,0,2*Math.PI);break;case "ellipsefill":g.fillStyle='#0000ff';drawEllipseRadius(g,20,20,15,10,5);g.fill();break;case "rectfill":g.fillStyle='#0000ff';g.rect(8,12,25,15);g.fill();break;case "poly":g.strokeStyle='#ff0000';g.lineWidth=2;g.drawPoly(getPolygonPts(20,20,15,6,0));g.stroke();break;case "polyfill":g.fillStyle='#0000ff';g.drawPoly(getPolygonPts(20,20,15,6,0));g.fill();break;case "fill":var svg='<svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="32" width="32" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" viewBox="0 0 32.000001 32.000001"><g id="layer1" transform="translate(724.39 -442.63)"><path id="path4734" d="m-704.32 452.61c3.9017 1.1894 6.6787-3.543 9.8636-1.1302 3.185 2.4127-2.0879 19.064-8.101 19.199-6.0132 0.13459-8.1724-8.2485-12.684-5.5686-4.5112 2.6799-7.9064 0.90371-7.5048-6.2614 0.40158-7.1651 5.3496-13.331 10.921-12.5 5.5714 0.83049 3.6031 5.0719 7.5047 6.2614z" fill-rule="evenodd" stroke="#000" stroke-width=".023887px" fill="#3465a4"/></g></svg>';var mySrc='data:image/svg+xml;base64,'+window.btoa(svg);var img=new Image();var g1=g;img.onload=function(){g1.drawImage(img,4,5);};img.src=mySrc;break;default:}
g.translate(-pt.x,-pt.y)}
function getRegular(midX,midY,radius,sttAngle,n){var pts=[];var dAngle=Math.PI*2/n;for(var i=0;i<n;i++){var angle=sttAngle+i*dAngle;var x=midX+radius*Math.cos(angle);var y=midY+radius*Math.sin(angle);pts.push({x:x,y:y});}
return pts;}
function drawPts(g,pts){for(var i=0;i<pts.length;i++){var pt=pts[i];if(i==0){g.moveTo(pt.x,pt.y)}else{g.lineTo(pt.x,pt.y)}}}
function drawEllipseRadius(g,x,y,rx,ry,sgm){sgm=typeof sgm!=='undefined'?sgm:8;var periode=2*Math.PI;var sgmAngle=periode/sgm;var cRangle=sgmAngle/2;var cRx=rx/Math.cos(cRangle);var cRy=ry/Math.cos(cRangle);g.moveTo(x+rx,y);for(var angle=sgmAngle;angle<=periode;angle+=sgmAngle){var cX=x+Math.cos(angle-cRangle)*cRx;var cY=y+Math.sin(angle-cRangle)*cRy;var pX=x+Math.cos(angle)*rx;var pY=y+Math.sin(angle)*ry;g.quadraticCurveTo(cX,cY,pX,pY);}}
function hardChg(n){my.hard=my.hards[n];my.hard.patLen=(my.hard.patFix+random()*my.hard.patRand)<<0
console.log('hardChg',n,my.hard);update()}
function update(){my.selNo=-1
msg('')
var seq=[]
var a=0
while(a<my.hard.seqLen){seq[a]=(my.choiceN*random())<<0
a++}
while(seq[0]==seq[1]){seq[1]=(my.choiceN*random())<<0;}
my.correctPat=[]
var counter=0
var a=0
while(a<my.hard.patLen){my.correctPat[a]=seq[counter]
counter++
if(counter>=seq.length){counter=0}
a++}
my.pat=[]
a=0
while(a<my.hard.patLen){if(a<my.hard.patLen-my.hard.secretLen){my.pat[a]=my.correctPat[a]}else{my.pat[a]=99}
a++}
console.log('seq,pat',seq,my.pat)
my.selNo=elemNextEmpty()
my.p=new Pattern()
my.p.drawStt()}
function elemChoose(n){console.log('elemChoose',n,my.selNo)
soundPlay('sndChoose')
if(my.selNo==-1)return
my.pat[my.selNo]=n
msg('')
var winq=false
var next=elemNextEmpty()
if(next==-1){next=patMisMatch()
if(next==-1){soundPlay('sndYes')
msg('Success!','gold')
winq=true
my.selNo=-1}else{scoreAdd(-2)
soundPlay('sndNo')
msg('Oops, pattern needs fixing','black')
my.selNo=next}}else{my.selNo=next}
my.p.redraw()
if(winq){scoreAdd(my.hard.score)
tickDraw(g,w/2,h/2-14)
setTimeout(update,2500)}}
function elemNextEmpty(){for(var i=0;i<my.pat.length;i++){if(my.pat[i]==99){return i}}
return-1;}
function elemDraw(g,pt,style,elemNo,hiQ){switch(my.type){case "num":case "ltr":if(hiQ){g.lineWidth=3;g.strokeStyle='gold';g.fillStyle='hsla(120,100%,90%,1)';}else{g.lineWidth=1;g.strokeStyle='lightblue';g.fillStyle='hsla(240,100%,90%,1)';}
g.beginPath();g.arc(pt.x,pt.y,my.rad,0,2*Math.PI);g.fill();g.stroke();g.font='22px Arial'
g.textAlign='center'
g.fillStyle='black';var str='?'
if(elemNo==99){str='?'}else{if(my.type=='num'){str=my.nums[elemNo].toString();}else{str=my.ltrs[elemNo].toString();}}
g.fillText(str,pt.x,pt.y+8)
break;case "clr":if(elemNo==99){g.beginPath();g.fillStyle='blue';g.font='28px Arial'
g.textAlign='center'
g.fillText("?",pt.x,pt.y+10)
g.fillStyle='rgba(0,0,0,0)';g.strokeStyle=g.fillStyle;}else{g.fillStyle=my.clrs[elemNo][1];g.strokeStyle=g.fillStyle;}
if(hiQ){g.lineWidth=4;g.strokeStyle='blue';}else{g.lineWidth=1;}
g.beginPath();g.arc(pt.x,pt.y,my.rad,0,2*Math.PI);g.fill();g.stroke();var dr=6;var grd=g.createRadialGradient(pt.x+dr,pt.y-dr,0,pt.x+dr,pt.y-dr,10);grd.addColorStop(0,"rgba(255,255,255,0.6)");grd.addColorStop(0.35,"rgba(255,255,255,0.4)");grd.addColorStop(0.75,"rgba(255,255,255,0.1)");grd.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=grd;g.beginPath();g.arc(pt.x,pt.y,my.rad,0,2*Math.PI);g.fill();break;case "shape":if(hiQ){g.lineWidth=3;g.strokeStyle='gold';g.beginPath();g.arc(pt.x,pt.y,my.rad+2,0,2*Math.PI);g.stroke();}else{g.lineWidth=3;}
if(elemNo==99){g.fillStyle='blue';g.font='28px Arial'
g.textAlign='center'
g.fillText("?",pt.x,pt.y+10)}else{g.fillStyle=my.clrs[elemNo][1];g.strokeStyle=g.fillStyle;g.beginPath();shapeDraw(g,pt,my.shapes[elemNo])
g.fill();g.stroke();}
break;default:}}
function tickDraw(g,x,y){g.beginPath()
g.moveTo(x-25,y+0)
g.lineTo(x+0,y+25)
g.lineTo(x+50,y-25)
g.lineWidth=20
g.strokeStyle='gold'
g.stroke()}
function patMisMatch(){for(var i=0;i<my.correctPat.length;i++){if(my.correctPat[i]!=my.pat[i])return i}
return-1}
function scoreAdd(v){my.score+=v
if(my.score<0)my.score=0
document.getElementById('score').innerHTML=padLeft(my.score+'','0',5);}
function padLeft(str,char,n){return Array(n-str.length+1).join(char)+str}
function msg(s,clr){clr=typeof clr!=='undefined'?clr:'black';var div=document.getElementById('msg');div.innerHTML=s
div.style.color=clr}
function hint(s,clr){clr=typeof clr!=='undefined'?clr:'blue';var div=document.getElementById('hint');div.innerHTML=s
div.style.color=clr}
function Pattern(){this.pts=[];}
Pattern.prototype.drawStt=function(){this.stt={x:45,y:h/2-50}
this.amplitude=(60-20)*random()+60;this.wavelength=(200-100)*random()+100;this.sttangle=150*random()+30;this.pt={x:this.stt.x-40,y:this.stt.y}
console.log('Pattern',this);this.frame=0;this.wait=0;g.clearRect(0,0,g.canvas.width,g.canvas.height);this.drawStep();}
Pattern.prototype.drawStep=function(){if(this.wait++>5){this.prevPt={x:this.pt.x,y:this.pt.y}
var posX=this.stt.x+this.frame*30;var posY=this.stt.y;var temp=0;if(my.pathType=="sin"){posY=this.stt.y+this.amplitude*Math.sin((this.sttangle+posX*100/this.wavelength)*0.01745);}
if(my.pathType=="angle"){var temp=this.stt.y+this.amplitude*Math.sin((this.sttangle+posX*100/this.wavelength)*0.01745);var ang=Math.atan2(temp-this.prevPt.y,posX-this.prevPt.x)
var d=my.rad*2+2;posX=this.prevPt.x+Math.cos(ang)*d;posY=this.prevPt.y+Math.sin(ang)*d;}
this.pt={x:posX<<0,y:posY<<0}
var elemNo=my.pat[this.frame]
elemDraw(g,this.pt,'num',elemNo,false)
soundPlay('sndPlace')
this.pts.push(this.pt)
this.frame++;this.wait=0}
if(this.frame<my.pat.length){requestAnimationFrame(this.drawStep.bind(this));}else{this.redraw()}}
Pattern.prototype.redraw=function(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
for(var i=0;i<this.pts.length;i++){elemDraw(g,this.pts[i],'num',my.pat[i],(i==my.selNo))}}
function btnHTML(){var s='';s+='<div style="text-align:center; z-index:20;">';for(var i=0;i<my.choiceN;i++){switch(my.type){case 'num':s+='<button class="btn" id="elem'+i+'" style="width:32px; height:32px; padding: 0; font: 18px Arial; cursor: pointer;" onclick="elemChoose('+i+')"  >'+my.nums[i]+'</button>';break;case 'ltr':s+='<button class="btn" id="elem'+i+'" style="width:32px; height:32px; padding: 0; font: 18px Arial; cursor: pointer;" onclick="elemChoose('+i+')"  >'+my.ltrs[i]+'</button>';break;case 'clr':s+='<button class="btnBlank" id="elem'+i+'" style="width:32px; height:32px; padding: 0; font: 18px Arial; cursor: pointer; background-color:'+my.clrs[i][1]+';" onclick="elemChoose('+i+')" onmouseover="keyOver(\'clr\','+i+')"  onmouseout="keyOut(\'clr\','+i+')" >'+' '+'</button>';break;case 'shape':s+='<button class="btnBlank" id="elem'+i+'" style="width:40px; height:40px; padding: 0; font: 18px Arial; cursor: pointer; background-color:#def;" onclick="elemChoose('+i+')" onmouseover="keyOver(\'shape\','+i+')"  onmouseout="keyOut(\'shape\','+i+')" >'
s+='<canvas id="shape'+i+'" style="position: relative; width:40px; height:40px; padding:0; z-index: 2; "></canvas>';s+='</button>';break;default:}}
s+='</div>';return s;}
function keyOver(typ,n){switch(typ){case 'clr':hint(my.clrs[n][0])
break;case 'shape':hint(my.shapes[n])
break;default:}}
function keyOut(){hint('')}
function typeChg(n){my.type=my.types[n].id;console.log('typeChg',n,my.type);var div=document.getElementById('choices')
div.innerHTML=btnHTML();if(my.type=='shape'){for(var i=0;i<my.choiceN;i++){btnDraw('shape'+i,my.shapes[i])}}
update()}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-1000px; top:10px; width:420px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optInside" style="margin: 5px auto 5px auto; font: 17px Arial;">';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';var style='position:relative; text-align:center; margin:5px; padding:9px; background-color:#def; border-radius:10px;'
s+='<div style="'+style+'">';s+=radioHTML('Level: ','hard',my.hards,'hardChg',0);s+='</div>';s+='<div style="'+style+'">';s+=radioHTML('Type: ','type',my.types,'typeChg',my.typeN);s+='</div>';s+='</div>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button id="optYes" onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='20px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';}
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
function soundToggle(){var btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}
function soundPlay(name,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:true
if(simulQ){if(name.length>0){var div=document.getElementById(name)
if(div.currentTime>0&&div.currentTime<div.duration){console.log('soundPlay cloned',div.currentTime,div.duration)
div.cloneNode(true).play()}else{div.play()}}}else{my.snds.push(name)
soundPlayQueue()}}
function soundPlayQueue(){var div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue();};}
function radioHTML(prompt,id,lbls,func,chkN){var s='';s+='<div style="display:inline-block;">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==chkN)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.title+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.title+' </label>';}
s+='</div>';return s;}
function random(){var x=Math.sin(my.seed++)*10000;return x-Math.floor(x);}