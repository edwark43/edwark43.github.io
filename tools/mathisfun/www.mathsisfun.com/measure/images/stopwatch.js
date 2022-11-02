var my={}
function stopwatchMain(){var version='0.82';my.hists=[]
my.imgHome=(document.domain=='localhost')?'/mathsisfun/images/':'/images/'
var btnw=45
var s=`
  <style>
  .clickbtn { display: inline-block; position: relative; text-align: center; margin: 0px; text-decoration: none; 
    font: bold 18px/25px Arial, sans-serif; color: #19667d; border: 1px solid #88aaff; border-radius: 10px; 
    cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); 
    outline-style:none; }
  .clickbtn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }
  </style>


  <style type="text/css">
  .btn {display: inline-block; position: relative; width:${btnw}px; height:${btnw}px; margin-right:${btnw*0.2}px; outline-style:none;
  padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }
  .btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }
  .btn:before, button:after {content: " "; position: absolute; }
  .btn:active {top:${btnw*0.05}px; box-shadow: 0 ${btnw*0.02}px ${btnw*0.03}px rgba(0,0,0,.4); }
  .play:before {  left: ${btnw*0.36}px; top: ${btnw*0.22}px; width: 0; height: 0; border: ${btnw*0.3}px solid transparent; 
  border-left-width: ${btnw*0.4}px; border-left-color: blue;  }
  .play:hover:before {border-left-color: yellow; }
  .pause:before, .pause:after {display: block; left: ${btnw*0.29}px; top: ${btnw*0.28}px; width: ${btnw*0.19}px; 
  height: ${btnw*0.47}px; background-color: blue; }
  .pause:after {left: ${btnw*0.54}px; }
  .pause:hover:before, .pause:hover:after {background-color: yellow; }
  .stop:before, .stop:after {display: block; left: ${btnw*0.26}px; top: ${btnw*0.26}px; width: ${btnw*0.47}px; 
  height: ${btnw*0.47}px; background-color: blue; border: none;}
  .stop:hover:before, .stop:hover:after {background-color: yellow; }
  </style>

  <div style="display:none;">
  <svg id="resetsvg" xmlns="http://www.w3.org/2000/svg" width="9" height="9">
  <line x1="10" y1="0" x2="0" y2="10" stroke-width="10" stroke="green"/>
  </svg>
  </div>


  <div id="main" style="position:relative; width:360px; margin:auto; display:block; border: 1px solid #ccc; border-radius:16px; padding:2px;">
  <div id="timers"></div>
  
  <button style="width:30px; height:30px; vertical-align:middle; z-index: 10;" class="clickbtn" onclick="clockAdd()" >+</button>
  <button style="width:30px; height:30px; vertical-align:middle; z-index: 10;" class="clickbtn" onclick="clockSub()" >&minus;</button>
  
  <textarea  id="hist" value="" style="width:50%; height: 150px; font: 14px Arial; border: 1px inset; 
  border-radius: 9px; background-color: #eeeeff; display: block; text-align: center; margin:auto; outline-style:none;"></textarea>


  <div style="font: 11px Arial; color: skyblue; margin-left:6px; bottom:3px;">&copy; 2019 MathsIsFun.com  v${version}</div>
  
  
  </div>`
document.write(s);my.clocks=[]
var dad=document.getElementById('timers')
for(var i=0;i<3;i++){var sw=new StopWatch(dad,i)
my.clocks.push(sw)}
console.log('my.clocks',my.clocks)}
function timesUp(clock){console.log('timesUp',clock)}
function clockAdd(){var sw=new StopWatch(document.getElementById('timers'),my.clocks.length)
my.clocks.push(sw)}
function clockSub(){if(my.clocks.length>1){var clock=my.clocks[my.clocks.length-1]
console.log('clockSub',clock)
document.getElementById('timers').removeChild(clock.div)
my.clocks.pop()}}
function clockPlay(n){var sw=my.clocks[n]
var s=sw.clock.update()
var playQ=sw.playBtn.toggle()
if(playQ){sw.clock.stop()
histAdd(sw.id,s,'&nbsp;||&nbsp;')}else{sw.clock.resume()}}
function clockReset(n){var sw=my.clocks[n]
if(!sw.clock.stopQ){var s=sw.clock.update()
histAdd(sw.id,s,'&#9711;')}
sw.clock.reset()
console.log('clockReset',n,sw)
sw.playBtn.playQ=false
sw.playBtn.toggle()}
function clockMark(n){var sw=my.clocks[n]
if(!sw.clock.stopQ){var s=sw.clock.update()
histAdd(sw.id,s,'&nbsp;&nbsp; &nbsp;')}}
function histAdd(id,s,endStr){var timeStr=s.substr(0,2)+':'+s.substr(2,2)+':'+s.substr(4,2)+'.'+s.substr(6)
var histStr=id+'  '+timeStr+'  '+endStr
my.hists.unshift(histStr);histUpdate()}
function histGet(){var s="";for(var i=0;i<Math.min(8,my.hists.length);i++){s+=my.hists[i]+"\n";}
return s;}
function histUpdate(){console.log('histUpdate',my.hists)
document.getElementById('hist').innerHTML=histGet()}
class StopWatch{constructor(dad,n){this.n=n
this.id=String.fromCharCode(65+n)
this.div=document.createElement("div");this.div.style.cssText='position: relative; height: 56px; left: 4px'
dad.appendChild(this.div);this.resetDiv=document.createElement("div");this.resetDiv.style.cssText='position: absolute; left: 0px; top:1px'
this.resetDiv.innerHTML=`<button class="btn" onclick="clockReset(${n})" ><img src="${my.imgHome}style/reset.svg" style="width:25px"></button>`
this.div.appendChild(this.resetDiv)
var drawSVGQ=false
if(drawSVGQ){var img=new Image();var el=document.createElement('canvas');el.width=30
el.height=30
this.resetDiv.appendChild(img)
var svg='<svg xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" height="32" width="32" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" viewBox="0 0 32.000001 32.000001"><g id="layer1" transform="translate(724.39 -442.63)"><path id="path4734" d="m-704.32 452.61c3.9017 1.1894 6.6787-3.543 9.8636-1.1302 3.185 2.4127-2.0879 19.064-8.101 19.199-6.0132 0.13459-8.1724-8.2485-12.684-5.5686-4.5112 2.6799-7.9064 0.90371-7.5048-6.2614 0.40158-7.1651 5.3496-13.331 10.921-12.5 5.5714 0.83049 3.6031 5.0719 7.5047 6.2614z" fill-rule="evenodd" stroke="#000" stroke-width=".023887px" fill="#3465a4"/></g></svg>';var mySrc='data:image/svg+xml;base64,'+window.btoa(svg);var img=new Image();var g1=el.getContext('2d')
img.onload=function(){g1.drawImage(img,4,5);console.log('sdfsf')};img.src=mySrc;}
this.playDiv=document.createElement("div");this.playDiv.style.cssText='position: absolute; left: 50px; top:1px'
this.playDiv.innerHTML=`<button id="play${n}" class="btn play" onclick="clockPlay(${n})" ></button>`
this.div.appendChild(this.playDiv)
this.playBtn=new PlayBtn(40,'play'+n,`clockPlay(${n})`,'play','pause')
this.clockDiv=document.createElement("div");this.clockDiv.id='timer'+n
this.clockDiv.style.cssText='position: absolute; left: 100px'
this.div.appendChild(this.clockDiv)
this.clock=new DigiClock(30,'24','timer'+n)
this.clock.setTime(0,0,0)
this.clock.upQ=true
this.clock.stop()
var div=document.createElement("div");div.style.cssText='position: absolute; font: 30px Arial; color:darkblue; left: 330px; top:6px; cursor:pointer; background-color:#def; padding:2px;'
div.innerHTML=`<div onclick="clockMark(${n});">${this.id}</div>`
this.div.appendChild(div)
return this}}
class DigiClock{constructor(ht,mode,divName){this.numHt=ht;this.mode=mode;this.typ='led';this.upQ=true;this.fromTime=0;this.hhQ=true;this.mmQ=true;this.ssQ=true;this.msQ=true;this.numWd=this.numHt*0.45;this.numGap=this.numWd*0.5;this.border=this.numHt*0.3;this.ht=this.numHt+this.border*2;var wd=0;var colonWd=this.numWd*0.7;if(this.hhQ)wd+=2*(this.numWd+this.numGap)+colonWd;if(this.mmQ)wd+=2*(this.numWd+this.numGap)+colonWd;if(this.ssQ)wd+=2*(this.numWd+this.numGap)+colonWd;if(this.msQ)wd+=3*(this.numWd+this.numGap)+colonWd;wd-=this.numGap;wd-=colonWd;wd+=this.numGap/2;this.wd=wd+this.border*2;console.log('DigiClock',wd,this);switch(this.typ){case 'lcd':this.clr={bg:'#ccc',border:'2px solid #888',on:'#222',off:'#ccc',shadow:'#ccc',shadowBlur:0};break;case 'led':this.clr={bg:'#222',border:'2px solid black',on:'rgb(100, 255, 0)',off:'rgb(50, 80, 0)',shadow:'rgb(100, 255, 0)',shadowBlur:33};break;default:}
this.div=document.getElementById(divName);this.div.style.height=this.ht+'px';this.div.style.width=this.wd+'px';this.el=document.createElement("canvas");this.div.appendChild(this.el);this.el.style.backgroundColor=this.clr.bg;this.el.style.borderRadius="10px";var ratio=2;this.el.width=this.wd*ratio;this.el.height=this.ht*ratio;this.el.style.width=this.wd+"px";this.el.style.height=this.ht+"px";this.g=this.el.getContext("2d");this.g.setTransform(ratio,0,0,ratio,0,0);this.numbers={n0:[1,1,1,0,1,1,1],n1:[0,0,1,0,0,1,0],n2:[1,0,1,1,1,0,1],n3:[1,0,1,1,0,1,1],n4:[0,1,1,1,0,1,0],n5:[1,1,0,1,0,1,1],n6:[0,1,0,1,1,1,1],n7:[1,0,1,0,0,1,0],n8:[1,1,1,1,1,1,1],n9:[1,1,1,1,0,1,1],A:[1,1,1,1,1,1,0],P:[1,1,1,1,1,0,0]};this.stt=performance.now();this.sofar=0;this.update();}
setTime(h,m,s){this.fromTime=(((h*60)+m)*60+s)*1000;this.sofar=0;this.stt=performance.now();this.update();}
start(){this.stt=performance.now();this.stopQ=false;this.sofar=0;this.loop();}
stop(){this.stopQ=true;this.sofar=this.total();}
reset(){this.stopQ=true;this.sofar=0
this.setTime(0,0,0)}
resume(){console.log('resume',this.sofar);this.stt=performance.now();this.stopQ=false;this.loop();}
loop(){if(!this.stopQ){this.update();requestAnimationFrame(this.loop.bind(this));}}
total(){var elapsed=performance.now()-this.stt;elapsed+=this.sofar;return elapsed;}
update(){this.g.clearRect(0,0,this.wd,this.ht);var elapsed=this.total();if(!this.upQ){elapsed=this.fromTime-elapsed;if(elapsed<0){if(!this.stopQ){this.stopQ=true;timesUp(this);elapsed=0;}}}
var hours=elapsed/3.6e6|0;var minutes=elapsed%3.6e6/6e4|0;var seconds=elapsed%6e4/1e3|0;var millis=elapsed%1e3|0;if(hours<10){hours='0'+hours;}
if(minutes<10){minutes='0'+minutes;}
if(seconds<10){seconds='0'+seconds;}
millis=pad('000',''+millis,true);var timeStr='';if(this.hhQ)timeStr+=hours;if(this.mmQ)timeStr+=minutes;if(this.ssQ)timeStr+=seconds;if(this.msQ)timeStr+=millis;this.timeStr=timeStr
var posX=this.border;var posY=this.border;for(var i=0;i<timeStr.length;i++){if('n'+timeStr[i]in this.numbers){this.drawNum(posX,posY,this.numbers['n'+timeStr[i]]);posX+=this.numWd;posX+=this.numGap;if(i%2&&i<timeStr.length-2){this.setClr(seconds%2);posX+=this.numWd*0.15;this.colon(posX,posY+this.numHt/2,seconds);posX+=this.numWd*0.55;}}}
return timeStr}
drawNum(x,y,numArray,scale){scale=typeof scale!=='undefined'?scale:1;for(var i=0;i<numArray.length;i++){this.segment(x,y,numArray[i],i,scale);}}
segment(x,y,onQ,position,scale){this.setClr(onQ);var startX=x;var startY=y;var m=this.numHt*0.09;var wd,ht;if(position===0||position===3||position===6){wd=this.numHt*0.36;ht=this.numHt*0.09;}else{wd=this.numHt*0.09;ht=this.numHt*0.36;}
if(scale!=1){m*=scale;wd*=scale;ht*=scale;}
var g=this.g;switch(position){case 0:g.bar(startX+m,startY,wd,ht);break;case 1:g.bar(startX,startY+m,wd,ht);break;case 2:g.bar(startX+wd+ht,startY+m,wd,ht);break;case 3:g.bar(startX+m,startY+wd+ht,wd,ht);break;case 4:g.bar(startX,startY+m+wd+ht,wd,ht);break;case 5:g.bar(startX+wd+ht,startY+m+wd+ht,wd,ht);break;case 6:g.bar(startX+m,startY+2*wd+ht+m,wd,ht);break;}}
colon(x,y,sec){var height=this.numHt*0.15;var width=height*0.5;var yLen=height*0.4;var g=this.g;if(sec%2){g.fillStyle=this.clr.on;}
g.bar(x,y-yLen-height,width,height);g.bar(x,y+yLen,width,height);}
setClr(onQ){var g=this.g;g.shadowColor=this.clr.shadow;if(onQ){g.fillStyle=this.clr.on;g.shadowBlur=this.clr.shadowBlur;}else{g.fillStyle=this.clr.off;g.shadowBlur=0;}}}
CanvasRenderingContext2D.prototype.bar=function(x,y,w,h){var g=this;if(h<w){g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.lineTo(x+w+h/2,y+h/2);g.lineTo(x+w,y+h);g.lineTo(x,y+h);g.lineTo(x-h/2,y+h/2);g.closePath();g.fill();}else{g.beginPath();g.moveTo(x,y);g.lineTo(x+w/2,y-w/2);g.lineTo(x+w,y);g.lineTo(x+w,y+h);g.lineTo(x+w/2,y+h+w/2);g.lineTo(x,y+h);g.closePath();g.fill();}}
class PlayBtn{constructor(w,id,fn,onClass,offClass){this.w=w;this.id=id;this.fn=fn;this.onClass=onClass;this.offClass=offClass;this.playQ=true;}
html(){var s='';s+='<button id="'+this.id+'" class="btn play" onclick="'+this.fn+'" ></button>';return s;}
toggle(){var div=document.getElementById(this.id);if(this.playQ){this.playQ=false;div.classList.add(this.offClass);div.classList.remove(this.onClass);}else{this.playQ=true;div.classList.add(this.onClass);div.classList.remove(this.offClass);}
return this.playQ}}
function pad(padFull,str,leftPadded){if(str==undefined)return padFull;if(leftPadded){return(padFull+str).slice(-padFull.length);}else{return(str+padFull).substring(0,padFull.length);}}