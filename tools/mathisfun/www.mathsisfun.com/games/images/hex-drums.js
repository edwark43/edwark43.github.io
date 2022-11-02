var w,h,my={}
my.hexs=['0','1','2','3','4','5','6','7','8','9',"A","B","C","D","E","F"];my.bins=["0000","0001","0010","0011","0100","0101","0110","0111","1000","1001","1010","1011","1100","1101","1110","1111"];var AudioContext=window.AudioContext||window.webkitAudioContext||false;var BPM=120;var buffers={}
if(AudioContext){var context=new AudioContext();}
var tickTime=1/(4*BPM/(60*1000));function hexdrumsMain(){my.version='0.61'
my.barSeqs=[{name:'Normal',id:'seq'},{name:'Binary',id:'bin'},{name:'Random',id:'rand'}];var barSeqId=getQueryVariable('seq','seq')
my.barSeq=my.barSeqs[0]
for(var i=0;i<my.barSeqs.length;i++){if(my.barSeqs[i].id==barSeqId)my.barSeq=my.barSeqs[i]}
console.log('my.barSeq',my.barSeq)
my.soundPrefix=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
my.soundFiles=[{name:'Base',file:'drums/bass_drum.mp3'},{name:'Claves',file:'drums/claves.mp3'},{name:'Hi Hat 1',file:'drums/cl_hi_hat.mp3'},{name:'Low Conga',file:'drums/low_conga.mp3'},{name:'Mid Conga',file:'drums/mid_conga.mp3'},{name:'Hi Conga',file:'drums/hi_conga.mp3'},{name:'Low Tom',file:'drums/low_tom.mp3'},{name:'Mid Tom',file:'drums/mid_tom.mp3'},{name:'Hi Tom',file:'drums/hi_tom.mp3'},{name:'Cowbell',file:'drums/cowbell.mp3'},{name:'Rim Shot',file:'drums/rim_shot.mp3'},{name:'Maracas',file:'drums/maracas.mp3'},{name:'Snare',file:'drums/snare_drum.mp3'},{name:'Hi Hat 2',file:'drums/o_hi_hat.mp3'},{name:'Hand Clap',file:'drums/hand_clap.mp3'},{name:'Cymbal',file:'drums/cymbal.mp3'},{name:'Shaker 1',file:'drums/shaker1.mp3'},{name:'Hand Drum 1',file:'drums/hand_drum_1.mp3'},{name:'Hand Drum 2',file:'drums/hand_drum_2.mp3'},{name:'Hand Drum 3',file:'drums/hand_drum_3.mp3'},{name:'Hand Drum 4',file:'drums/hand_drum_4.mp3'},{name:'Hand Drum 5',file:'drums/hand_drum_5.mp3'},{name:'Cat Rattle',file:'drums/cat_rattle.mp3'},];var notes=['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B']
var pianoFiles=[]
for(var i=0;i<notes.length;i++){var note=notes[i]
var f={name:'Piano '+note+'4',file:'piano/'+note+'4.mp3'}
pianoFiles.push(f)}
my.soundFiles=my.soundFiles.concat(pianoFiles)
my.sounds=[]
var rStr=getQueryVariable('r','')
if(rStr.length>0){riffLoad(rStr)
my.playQ=true}else{for(var i=0;i<6;i++){var sound=new Sound(i,my.soundFiles[i].name,my.soundFiles[i].file)
sound.setHex('0000')
my.sounds.push(sound)}
my.playQ=false}
for(var i=0;i<my.sounds.length;i++){playSound(my.soundPrefix+my.sounds[i].file,false)}
var s=''
s+='<style>'
s+='.beat { display:inline-block;  width:15px; height:18px; border: 2px inset white; color:#777; font: 12px Arial; text-align:center;padding-top:5px; user-select: none; -moz-user-select: none;border-radius:5px; margin-top:2px;}'
s+='.beat:hover { background: rgba(255, 255, 255, 0.2); }'
s+='.beat.on { background: #ffc; color: #442; border: 2px solid #eeb}'
s+='.beat.on:hover { background: rgba(255, 255, 255, 0.8); }'
s+='.beat.ticked { background: lightgreen; }'
s+='.beat.ticked:hover { background: rgba(144, 238, 144, 0.8); }'
s+='.ltr { display:inline-block; width:15px; vertical-align:top; border: none; padding-left: 1px; padding: 4px 3px 0 0;  font: 19px Arial; user-select: none; -moz-user-select: none; color:#888; }'
s+='</style>'
s+='<div style="text-align:center;">';s+='<div style="display:inline-block; border: none; border-radius: 9px; margin:2px auto; box-shadow: 0px 0px 19px 10px rgba(0,0,68,0.46); ">';var sPop=''
sPop+='<div style="display:block; position: relative; text-align:left; ">';sPop+='This link has your rhythm coded into it:'
sPop+='<textarea id="url" style="font: 12px Arial; color: red; width:350px; height:120px;"></textarea>';sPop+='</div>';my.pop=new Pop("my.pop",360);s+='<div style="display:block; position: relative; text-align:center;">';s+=my.pop.getPopHTML(sPop);s+='</div>';s+='<div style="text-align: center; margin-bottom: 10px;">'
s+='<div style="display: inline-block; font:15px Arial; width: 50px; text-align: right; margin-right:10px;">BPM:</div>'
s+='<input type="range" id="r1" value="'+BPM+'" min="50" max="150" step="1"  style="z-index:2; width:200px; height:10px; border: none; " oninput="onBPMChg(0,this.value)" onchange="onBPMChg(1,this.value)" />';s+='<div id="bpm" style="display: inline-block; width:50px; font: 18px Arial; color: #6600cc; text-align: left;">120</div>';s+='<div style="display: inline-block;">';s+=playHTML(36);s+='</div>';s+='</div>';s+='<div style="position: relative; text-align: center;">'
for(var r=0;r<my.sounds.length;r++){s+='<div id="row'+r+'" style="background-color: #bee; text-align:left; border-radius:9px; border: 2px outset white;  ">'
s+=my.sounds[r].HTML()
s+='</div>'}
s+='</div>';s+='<div style="text-align: center; margin: 5px auto 0px auto;">'
s+='<button style="font: 16px Arial; " class="clickbtn" onclick="riffSave()" >Save</button>';s+='<button style="font: 16px Arial; " class="clickbtn" onclick="riffRand(1)" >Random</button>';s+='<button style="font: 16px Arial; " class="clickbtn" onclick="riffClear()" >Clear</button>';s+='</div>'
s+='<div style="font: 14px Arial; margin:auto; padding:3px;">';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+='Sequence:'
s+=radioHTML('Sequence','barseq',my.barSeqs,'barseqChg');s+='</div>';s+='<div id="copyright" style="font: 10px Arial; color: #6600cc;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';s+='</div>';document.write(s);for(var i=0;i<my.sounds.length;i++){var hex=my.sounds[i].hex
hex=hex.replace(/[^A-Fa-f0-9]/g,'0');document.getElementById('hex'+i).value=hex
my.sounds[i].hex2beats()}
document.onkeydown=keyDo;playToggle()
my.beatTime=performance.now()
anim()}
function barseqChg(n){my.barSeq=my.barSeqs[n]}
function playSound(url,playQ){playQ=typeof playQ!=='undefined'?playQ:true;if(!AudioContext){new Audio(url).play();return;}
if(typeof(buffers[url])=='undefined'){buffers[url]=null;var req=new XMLHttpRequest();req.open('GET.html',url,true);req.responseType='arraybuffer';req.onload=function(){context.decodeAudioData(req.response,function(buffer){buffers[url]=buffer;if(playQ)playBuffer(buffer);console.log('loaded',url)},function(err){console.log(err);});};req.send();}
function playBuffer(buffer){var source=context.createBufferSource();source.buffer=buffer;source.connect(context.destination);source.start();}
if(buffers[url]){playBuffer(buffers[url]);}}
function keyDo(e){var id=e.target.id
id=id.substr(0,3)
console.log('keyDo',e.keyCode,e.target.id,id)
if(e.keyCode=='38'){if(id=='hex'){var n=e.target.id.substr(3,1)
n--;if(n<0)n=my.sounds.length-1
var div=document.getElementById(id+n)
div.focus()
e.preventDefault()}}else if(e.keyCode=='40'){if(id=='hex'){var n=e.target.id.substr(3,1)
n++;if(n==my.sounds.length)n=0
var div=document.getElementById(id+n)
div.focus()
e.preventDefault()}}}
function onBPMChg(n,v){v=Number(v);BPM=v
tickTime=1/(4*BPM/(60*1000))
document.getElementById('bpm').innerHTML=v;}
function riffClear(){for(var i=0;i<my.sounds.length;i++){my.sounds[i].clear()
my.sounds[i].beats2hex()}}
function hexChg(id){my.sounds[id].hex2beats()}
function riffSave(){var s=''
for(var i=0;i<my.sounds.length;i++){var hex=document.getElementById('hex'+i).value
console.log('',i,hex)
var sound=my.sounds[i]
if(i>0)s+='~'
s+=sound.name.split(' ').join('-')
s+='_'
s+=hex}
document.getElementById('url').innerHTML='hex-drums2a3b.html?r='+encodeURI(s)
my.pop.popup()}
function riffLoad(s){s=decodeURI(s).split('-').join(' ')
var sounds=s.split('~')
my.sounds=[]
for(var i=0;i<sounds.length;i++){var bits=sounds[i].split('_')
var name=bits[0]
var file=my.soundFiles[soundFileGet(name)].file
var sound=new Sound(i,name,file)
sound.setHex(bits[1])
console.log('riffLoad',sound)
my.sounds.push(sound)}
console.log('riffLoad',sounds,my.sounds)}
function soundFileGet(name){for(var i=0;i<my.soundFiles.length;i++){if(my.soundFiles[i].name==name)return i}
return 0}
function sndChg(id){var name=dropdownGet('snd'+id)
var i=soundFileGet(name)
console.log('sndChg',id,name,i)
my.sounds[id].file=my.soundFiles[i].file
my.sounds[id].name=my.soundFiles[i].name}
function riffRand(opt){riffClear();for(var r=0;r<my.sounds.length;r++){my.sounds[r].rand()}}
function anim(){if(my.playQ){var current=performance.now()
var delta=current-my.beatTime
if(delta>=tickTime){my.beatTime=performance.now()
beatDo()}}
requestAnimationFrame(anim);}
function beatDo(){for(var i=0;i<my.sounds.length;i++){my.sounds[i].beatDo()}}
function dropdownHTML(opts,title,id,funcName,nsel){id=typeof id!=='undefined'?id:title;nsel=typeof nsel!=='undefined'?nsel:0;var s='';s+='<select id="'+id+'" style="display: inline-block; width: 120px; color: black; text-align:center; padding: 2px; background-color: #eeffee; font: 14px Arial; border-radius: 10px; margin-right:9px;"  autocomplete="off" onchange="'+funcName+'">';for(var i=0;i<opts.length;i++){var opt=opts[i];var idStr=id+'_'+i;var chkStr=nsel==i?'selected':'';s+='<option id="'+idStr+'" value="'+opt.name+'" style="height:14px;" '+chkStr+' >'+opt.name+'</option>';}
s+='</select>';return s;}
function dropdownGet(id){var div=document.getElementById(id);return div.options[div.selectedIndex].value;}
function beatToggle(r,barNo,barN){console.log('beatToggle',r,barNo,barN)
my.sounds[r].beatToggle(barNo,barN)
my.sounds[r].beats2hex()}
function padFull(pad,str,leftPadded){if(str==undefined)return pad;if(leftPadded){return(pad+str).slice(-pad.length);}else{return(str+pad).substring(0,pad.length);}}
function getQueryVariable(variable,noVal){var query=window.location.search.substring(1);var vars=query.split("&");for(var i=0;i<vars.length;i++){var pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return noVal;}
function playHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="playToggle()" ></button>';return s;}
function playToggle(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");}}
function Pop(name,wd){this.name=name;this.wd=wd;this.id="pop"+this.name;}
Pop.prototype.popup=function(){var pop=document.getElementById(this.id);pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.visibility="visible";pop.style.zIndex=12;pop.style.left='100px';};Pop.prototype.yes=function(){var pop=document.getElementById(this.id);pop.style.visibility="hidden";pop.style.zIndex=1;pop.style.left='-500px';};Pop.prototype.no=function(){console.log("optNo");var pop=document.getElementById(this.id);pop.style.visibility="hidden";pop.style.zIndex=1;pop.style.left='-500px';};Pop.prototype.getPopHTML=function(inStr){var s='';s+='<div id="'+this.id+'" style="position:absolute; left:-450px; top:60px; width:'+this.wd+'px; padding: 5px; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button onclick="'+this.name+'.yes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='</div>';s+=inStr;s+='</div>';return s;};function Sound(id,name,file){this.id=id
this.name=name
this.file=file
this.hex='0'
this.barCount=4
this.barNo=0
this.beatCount=4
this.beatNo=0
this.binBars=[]
this.lastBeat=null}
Sound.prototype.beatDo=function(){this.beatNo++;if(this.beatNo>=this.beatCount){this.beatNo=0
switch(my.barSeq.id){case 'bin':this.binBarChoose(0)
break
case 'rand':this.barNo=randomInt(0,this.barCount-1)
break
case 'seq':default:this.barNo++
if(this.barNo>=this.barCount){this.barNo=0}}}
var currentBeat=getBeatDiv(this.id,this.barNo,this.beatNo)
if(currentBeat!=null){if(this.lastBeat!=null)this.lastBeat.classList.remove('ticked');currentBeat.classList.add('ticked');if(currentBeat.classList.contains('on')){playSound(my.soundPrefix+this.file);}
this.lastBeat=currentBeat}}
Sound.prototype.binBarChoose=function(n){if(typeof this.binBars[n]==='undefined')this.binBars[n]=0
if(this.binBars[n]==1){this.binBars[n]=0
if(n<(this.barCount-1)){this.binBarChoose(n+1)}else{this.barNo=n}}else{this.binBars[n]=1
this.barNo=n}}
Sound.prototype.setHex=function(hex){this.hex=hex
this.barCount=hex.length
console.log('setHex',hex,hex.length)}
Sound.prototype.clear=function(){this.hex='0'
for(var i=0;i<this.barCount;i++){for(var j=0;j<this.beatCount;j++){var div=getBeatDiv(this.id,i,j)
div.classList.remove('on');div.innerHTML='0'}}}
Sound.prototype.HTML=function(n){var s=''
s+=dropdownHTML(my.soundFiles,'Sound','snd'+this.id,'sndChg('+this.id+')',soundFileGet(this.name))
s+='<input type="text" id="hex'+this.id+'" style="width: 60px; text-align: center; border-radius: 6px; font-size: 15px; color: #0000ff; background-color: #eeffee; " value="0" onKeyUp="hexChg('+this.id+')" />';s+='<div id="bar'+this.id+'" style="display:inline-block;">'
s+=this.barHTML()
s+='</div>'
s+='<br>'
return s}
Sound.prototype.barHTML=function(barNo,barN,onQ){var s=''
for(var i=0;i<this.barCount;i++){for(var j=0;j<this.beatCount;j++){s+='<div id="btn'+this.id+'_'+i+'_'+j+'" class="beat" onclick="beatToggle('+this.id+','+i+','+j+')" >'
s+='0'
s+='</div>'}
s+='<div id="ltr'+this.id+'_'+i+'" class="ltr" >'
s+='0'
s+='</div>'}
return s}
Sound.prototype.beatSet=function(barNo,barN,onQ){var div=getBeatDiv(this.id,barNo,barN)
div.classList.toggle('on',onQ);if(div.classList.contains('on')){div.innerHTML='1'}else{div.innerHTML='0'}}
Sound.prototype.beatToggle=function(barNo,barN){console.log('beatToggle',barNo,barN)
var div=getBeatDiv(this.id,barNo,barN)
if(div.classList.contains('on')){div.classList.toggle('on',false);div.innerHTML='0'}else{div.classList.toggle('on',true);div.innerHTML='1'}}
Sound.prototype.rand=function(){for(var i=0;i<this.barCount;i++){for(var j=0;j<this.beatCount;j++){if(Math.random()<0.2){this.beatSet(i,j,true)}}}
this.beats2hex()}
Sound.prototype.beats2hex=function(){var s=''
for(var i=0;i<this.barCount;i++){s+=this.beat2hex(i)
var div=document.getElementById('ltr'+this.id)}
var div=document.getElementById('hex'+this.id)
div.value=s}
Sound.prototype.beat2hex=function(grpn){var mult=1
var n=0
for(var i=3;i>=0;i--){var div=getBeatDiv(this.id,grpn,i)
if(div.classList.contains('on')){n+=mult}
mult*=2}
var div=document.getElementById('ltr'+this.id+'_'+grpn)
div.innerHTML=my.hexs[n]
return my.hexs[n]}
Sound.prototype.hex2beats=function(){var txt=document.getElementById('hex'+this.id).value
txt=txt.replace(/[^A-Fa-f0-9]/g,'0');this.barCount=txt.length
var div=document.getElementById('bar'+this.id)
div.innerHTML=this.barHTML()
for(var i=0;i<this.barCount;i++){var chr=txt.charAt(i)
this.hex2beat(i,chr)}}
Sound.prototype.hex2beat=function(n,chr){var bin=parseInt(chr,16).toString(2)
bin=padFull('0000',bin,true)
for(var i=0;i<this.beatCount;i++){var onQ=(bin.charAt(i)=='1')?true:false
this.beatSet(n,i,onQ)}
var s='ltr'+this.id+'_'+n
var div=document.getElementById(s)
div.innerHTML=chr}
function getBeatDiv(id,barNo,barN){return document.getElementById(getBeatName(id,barNo,barN))}
function getBeatName(id,barNo,barN){return 'btn'+id+'_'+barNo+'_'+barN}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl.name+' </label>';}
s+='</div>';return s;}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1)+min);}