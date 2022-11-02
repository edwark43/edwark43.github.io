var w,h,ratio,s,my={};function audiospectrumnMain(){var version='0.83';w=600;h=340;var hasAudioQ=false;window.AudioContext=window.AudioContext||window.webkitAudioContext;if(window.AudioContext){hasAudioQ=true;}
if(!hasAudioQ){console.log('Sorry no Web Audio API available')
return}
s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none; margin:auto; display:block;">';my.specs=[]
for(var i=0;i<3;i++){var spec=new Spectrum(i)
s+=spec.html()
my.specs.push(spec)}
s+='<div style="font: 10px Arial; color: blue;">&copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);my.ranges=[['Infrasound',0,20],['Bass',20,150],['Midrange',130,523],['Highend',5000,20000],['Ultrasound',20000,100000]];my.voices=[['Bass',87,330],['Baritone',87,349],['Tenor',130,523],['Contralto',175,698],['Soprano',262,1047]];for(var i=0;i<3;i++){var spec=my.specs[i]
spec.init()
spec.draw()}}
function toggleAudio(n){my.specs[n].toggleAudio()}
function onFreqChg(n,v){v=Number(v)*3-1;v=Math.pow(10,v);v*=200;v=Number(v.toPrecision(3));my.specs[n].setFreq(v)
document.getElementById('freqi'+n).value=v;}
function onFreqiChg(n){var freq=document.getElementById('freqi'+n).value;freq=Number(freq);if(freq<20)freq=20;if(freq>20000)freq=20000;if(!isNaN(freq))my.specs[n].setFreq(freq)
var log=Math.log(freq/200)/Math.LN10;var val=(log+1)/3;document.getElementById('freqr'+n).value=val;}
function numChg(id,delta){console.log("numChg",id,delta);my.specs[id].fChg(delta)}
function Spectrum(id){this.id=id
this.audioContext=null
this.ht=120
this.audioQ=false
this.freq=40}
Spectrum.prototype.init=function(){console.log('init',this.id)
this.el=document.getElementById('canvas'+this.id);ratio=2;this.el.width=w*ratio;this.el.height=this.ht*ratio;this.el.style.width=w+"px";this.el.style.height=this.ht+"px";this.g=this.el.getContext("2d");this.g.setTransform(ratio,0,0,ratio,0,0);document.getElementById('freqr'+this.id).value=0.09;document.getElementById('freqi'+this.id).value=this.freq;}
Spectrum.prototype.on=function(){if(this.audioContext==null){this.audioContext=new window.AudioContext();this.oscillator=this.audioContext.createOscillator();this.oscillator.frequency.value=this.freq
this.oscillator.start(0);}
this.oscillator.connect(this.audioContext.destination);}
Spectrum.prototype.off=function(){this.oscillator.disconnect(this.audioContext.destination);}
Spectrum.prototype.setFreq=function(f){this.freq=f
if(this.audioContext!=null){this.oscillator.frequency.value=f;}}
Spectrum.prototype.toggleAudio=function(){this.audioQ=!this.audioQ;if(this.audioQ){document.getElementById('audioBtn'+this.id).innerHTML='&nbsp;Mute&nbsp;';this.on()}else{document.getElementById('audioBtn'+this.id).innerHTML='Listen';this.off()}}
Spectrum.prototype.html=function(){s=''
s+='<div style="position:relative;">';s+='<canvas id="canvas'+this.id+'" width="'+w+'" height="'+h+'" style="z-index:1;"></canvas>';s+='<input type="range" id="freqr'+this.id+'"  value="0" min="0" max="1" step=".005"  style="position:absolute; top:33px; left:58px; z-index:2; width:462px; height:10px; border: none; " oninput="onFreqChg('+this.id+',this.value)" onchange="onFreqChg('+this.id+',this.value)" />';s+='<button id="audioBtn'+this.id+'" style="position:absolute; left: 2px; bottom:20px; color: #000aae; font-size: 18px;" class="togglebtn"  onclick="toggleAudio('+this.id+')" >Listen</button>';s+='<div style="position:absolute;left:140px;  bottom:11px;">';s+='<span style="color: #000aae; font: 17px Arial;"">Frequency: </span>';s+='<input type="text" id="freqi'+this.id+'" style=" display: inline-block; width: 100px; color: black; text-align:center; padding: 3px; background-color: #eeffee; font: bold 17px Arial;  border-radius: 10px;" value="" onKeyUp="onFreqiChg('+this.id+')" />';s+='<button id="dnBtn" style="font-size: 16px; color: #000aae; " class="togglebtn"  onclick="numChg('+this.id+',-1)" >&#x25BC;</button>';s+='<button id="upBtn" style="font-size: 16px; color: #000aae; " class="togglebtn"  onclick="numChg('+this.id+',1)" >&#x25B2;</button>';s+='<span style="color: #000aae; font: 17px Arial;""> Hertz</span>';s+='</div>';s+='</div>';return s}
Spectrum.prototype.fChg=function(delta){var freq=document.getElementById('freqi'+this.id).value;console.log('Spectrum.prototype.fChg',freq,delta)
freq=Number(freq);freq+=delta
if(freq<20)freq=20;if(freq>20000)freq=20000;if(!isNaN(freq))this.setFreq(freq)
document.getElementById('freqi'+this.id).value=freq
console.log('Spectrum.prototype.fChg',freq,delta)
var log=Math.log(freq/200)/Math.LN10;var val=(log+1)/3;document.getElementById('freqr'+this.id).value=val;}
Spectrum.prototype.draw=function(){var sttY=20;var sttX=70;var endX=520;var gap=1.01*(endX-sttX)/10;var g=this.g
g.lineWidth=2;g.strokeStyle='black';g.textAlign='center';g.fillStyle='lightblue';var rects=[5,10,20,40,80,160,320,640,1280,2500,5000,10000,20000,40000,80000];var f=5;for(var i=-2;i<=11;i++){f=rects[i+2];var xp=sttX+i*gap;g.fillStyle='cornsilk';if(i<0)
g.fillStyle='lightblue';if(i>=10)
g.fillStyle='pink';g.beginPath();g.rect(xp,sttY,gap,40);g.stroke();g.fill();if(i>=0&&i<=10){g.fillStyle='blue';g.fillText(f.toString(),xp,sttY+50);}}
g.fillStyle='black';g.font='14px Arial';g.textAlign='right';g.fillText('Infrasound',sttX-2,15);g.textAlign='center';g.fillText('Sound',(sttX+endX)/2,15);g.textAlign='left';g.fillText('Ultrasound',endX+8,15);}