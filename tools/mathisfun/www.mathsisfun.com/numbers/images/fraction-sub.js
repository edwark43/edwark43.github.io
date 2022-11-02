var w,h,ratio,i,s,el,g,div,dragQ,game,my={};function fractionsubMain(rel){my.version='0.61';my.rel=typeof rel!=='undefined'?rel:'../';w=440;h=480;my.sectors=[true];my.denom=3;var s='';s+='<div id="main" style="position:relative; width:'+w+'px; background-color: hsl(240,100%,95%); margin:auto; display:block; border: 1px solid black; border-radius: 10px;">';my.typs=['pizza','circle','square'];my.typ=my.typs[0];s+='<div style="position:relative; text-align:right;">';s+=getRadioHTML('','typ',my.typs,'typChg');s+='</div>';var sliceClr='hsl(240,100%,90%)'
my.fracs=[];my.pizzas=[];my.steps=[{title:'Input',fracStrs:[' ','&minus;'],imgStrs:['','&minus;'],inpQ:true,clr:sliceClr},{title:'Each fraction &times; other denominator',fracStrs:['=','&minus;'],imgStrs:['','&minus;'],inpQ:false,clr:sliceClr},{title:'Do the multiplies',fracStrs:['=','&minus;'],imgStrs:['','&minus;'],inpQ:false,clr:sliceClr},{title:'Subtract',fracStrs:['=','='],imgStrs:['',''],inpQ:false,clr:sliceClr},{title:'Simplify',fracStrs:['=',''],imgStrs:['',''],inpQ:false,clr:sliceClr}];for(var i=0;i<my.steps.length;i++){var step=my.steps[i];s+='<div id="step'+i+'" style="position: relative; width:'+w+'px; text-align:left;float: left; margin-top:5px; background-color:'+step.clr+'; ">';s+='<span style="">'+step.title+'</span>';s+='<br>';s+='<div id="fracs'+i+'" style="display:inline-block; position: relative; width:'+210+'px; vertical-align: middle;">';for(var n=0;n<2;n++){var id='frac'+i+String.fromCharCode(97+n);s+=strHTML(step.fracStrs[n]);s+='<div style="display:inline-block; position: relative; margin:2px; vertical-align:middle;">';s+='<span id="'+id+'"></span>';var frac=new Frac(id,2,3,step.inpQ);my.fracs.push(frac);s+='</div>';}
s+='</div>';s+='<div id="pizzas'+i+'" style="display:inline-block; position: relative; width:'+220+'px; vertical-align: middle;">';for(var n=0;n<2;n++){var id='pizza'+i+String.fromCharCode(97+n);s+=strHTML(step.imgStrs[n]);var pizza=new FracImage(id,90);my.pizzas.push(pizza);s+=pizza.html();}
s+='</div>';s+='</div>';}
s+='<div id="copyrt" style="font: 11px Arial; color: #6600cc; text-align:right; margin: 4px;">&copy; 2018 MathsIsFun.com  v'+my.version+' </div>';s+='<div style="clear:both"></div>';s+='</div>';document.write(s);for(var i=0;i<my.fracs.length;i++){var frac=my.fracs[i];var div=document.getElementById(frac.id);div.innerHTML=frac.html();}
for(var i=0;i<my.pizzas.length;i++){var pizza=my.pizzas[i];pizza.setup();}
document.getElementById("typ0").checked=true;inputSet();update();}
function inputSet(){document.getElementById('frac0anum').value=1;document.getElementById('frac0aden').value=3;document.getElementById('frac0bnum').value=1;document.getElementById('frac0bden').value=4;}
function strHTML(str){s='';if(str.length>0){s+='<div style="display:inline-block; position: relative; width:20px; margin:2px;vertical-align: middle; text-align:center; font:24px Arial; ">';s+=str;s+='</div>';}
return s;}
function divShow(id,showQ){if(showQ){document.getElementById(id).style.display='inline-block';}else{document.getElementById(id).style.display='none';}}
function inputget(id){var v=document.getElementById(id).value;newv=v.replace(/\D/g,'');if(newv!=v){v=newv;document.getElementById(id).value=v;}
return v<<0;}
function update(){console.log("update",my);var anum=inputget('frac0anum');var aden=inputget('frac0aden');var bnum=inputget('frac0bnum');var bden=inputget('frac0bden');my.pizzas[0].drawMe(anum,aden);my.pizzas[1].drawMe(bnum,bden);if(aden==bden){divShow('step1',false)
divShow('step2',false)
var cnum=anum*1;var cden=aden;var dnum=bnum*1;var dden=bden;}else{divShow('step1',true)
divShow('step2',true)
my.fracs[2].setMe(anum+'&times;'+bden,aden+'&times;'+bden)
my.fracs[3].setMe(bnum+'&times;'+aden,bden+'&times;'+aden)
var cnum=anum*bden;var cden=aden*bden;var dnum=bnum*aden;var dden=bden*aden;my.fracs[4].setMe(cnum,cden)
my.fracs[5].setMe(dnum,dden)
my.pizzas[4].drawMe(cnum,cden);my.pizzas[5].drawMe(dnum,dden);}
my.fracs[6].setMe(cnum+' &minus; '+dnum,dden)
my.fracs[7].setMe(cnum-dnum,dden)
var fnum=cnum-dnum
var fden=dden
if(fnum<=fden){my.pizzas[6].drawMe(fnum,fden);divShow(my.pizzas[7].id,false)}else{my.pizzas[6].drawMe(fden,fden);my.pizzas[7].drawMe(fnum-fden,fden);divShow(my.pizzas[7].id,true)}
var gcd=EuclidGCD(fnum,fden)
console.log('gcd',gcd);gcd=Math.abs(gcd);if(fnum==0||gcd==1){divShow('step4',false)}else{divShow('step4',true)
fnum/=gcd;fden/=gcd;my.fracs[8].setMe(fnum,fden)
var decimal=fnum/fden;if(decimal==(decimal<<0)){divShow('frac4b',true)
document.getElementById('frac4b').innerHTML='<span style="font:24px Arial;"> &nbsp; = '+decimal+'</span>';}else{divShow('frac4b',false)}
if(fnum<=fden){my.pizzas[8].drawMe(fnum,fden);divShow(my.pizzas[9].id,false)}else{my.pizzas[8].drawMe(fden,fden);my.pizzas[9].drawMe(fnum-fden,fden);divShow(my.pizzas[9].id,true)}}
var visQ=true;if(anum>aden)visQ=false;if(bnum>bden)visQ=false;for(var i=0;i<my.steps.length;i++){divShow('pizzas'+i,visQ);}
divShow('pizzas1',false)}
function EuclidGCD(n,m){if(isNaN(n))return;if(isNaN(m))return;if(n==0)return;if(m==0)return;if(n<m){z=n;n=m;m=z;}
originaln=n;originalm=m;xstep=1;r=1;while(r!=0){q=Math.floor(n/m);r=n-m*q;n=m;m=r;xstep++;}
gcd=n;lcm=originaln*originalm/gcd;return gcd;}
function typChg(n){my.typ=my.typs[n];update();}
function getRadioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);" autocomplete="off" >';s+=prompt;for(var i=0;i<lbls.length;i++){var idi=id+i;var lbl=lbls[i];s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');">';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function getPlayHTML(w){var s='';s+='<style type="text/css">';s+='.btn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.btn:before, button:after {content: " "; position: absolute; }';s+='.btn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="btn play" onclick="togglePlay()" ></button>';return s;}
function togglePlay(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");anim();}}
CanvasRenderingContext2D.prototype.drawChosenSectors=function(wd,numer,denom,onClr,offClr,lnClr){g=this;var pos={x:wd/2+1,y:wd/2+1,rad:wd/2}
var n=0;if(denom>100){var f=100/denom;numer*=f;denom*=f;}
var dAngle=2*Math.PI/denom;var angleNum=0;for(var k=0;k<denom;k++){g.beginPath();g.lineWidth=1;g.strokeStyle=lnClr;g.moveTo(pos.x,pos.y);g.arc(pos.x,pos.y,pos.rad,-angleNum,-angleNum-dAngle,true);g.lineTo(pos.x,pos.y);g.stroke();if(k<numer){g.fillStyle=onClr;g.fill();n++;}else{g.fillStyle=offClr;g.fill();}
angleNum+=dAngle;}
return n;};CanvasRenderingContext2D.prototype.drawChosenRectSlices=function(wd,numer,denom,onClr,offClr,lnClr){g=this;var n=0;if(denom>100){var f=100/denom;numer*=f;denom*=f;}
var ht=wd;var lt=1;var tp=1;var dWd=wd/denom;var currWd=0;for(var k=0;k<denom;k++){g.beginPath();g.lineWidth=1;g.strokeStyle=lnClr;g.rect(lt+currWd,tp,dWd,ht)
g.stroke();if(k<numer){g.fillStyle=onClr;g.fill();n++;}else{g.fillStyle=offClr;g.fill();}
currWd+=dWd;}
return n;};function Frac(id,num,den,inputQ){this.id=id;this.num=num;this.den=den;this.inputQ=inputQ;this.parts=[{name:'num',val:this.num},{name:'den',val:this.den}];}
Frac.prototype.html=function(){var s='';s+='<div style="display: inline-table; text-align: center; margin: 0px 2px 0 2px; border-collapse: collapse; font: 19px Arial; min-width:50px; ">';for(var i=0;i<this.parts.length;i++){var part=this.parts[i];s+='<div style="display: table-row; text-align: center; '+(i==0?'border-bottom: solid black 1px;':'')+' font-style: inherit;">';if(this.inputQ){s+='<input type="text" id="'+this.id+part.name+'" value="'+part.val+'" style="width:46px; text-align:center;font: 20px Arial;" oninput="update()">';}else{s+='<span id="'+this.id+part.name+'">'+part.val+'</span>';}
s+='</div>'}
s+='</div>'
return s;}
Frac.prototype.setMe=function(num,den){document.getElementById(this.id+'num').innerHTML=num;document.getElementById(this.id+'den').innerHTML=den;}
function FracImage(id,wd){this.id=id;this.wd=wd;this.ht=wd;this.id=id;this.canid='can'+id;this.imgid='img'+id;}
FracImage.prototype.html=function(){s='';s+='<div id="'+this.id+'" style="display:inline-block; position: relative; width:'+this.wd+'px; height:'+this.wd+'px; margin:2px; vertical-align: middle;">';s+='<img id="'+this.imgid+'" src="'+my.rel+'numbers/images/pizza.jpg" style="position: absolute; z-index:1; width:'+this.wd+'px; height:'+this.ht+'px; top: 0px; left: 0px;" />';s+='<canvas id="'+this.canid+'" style="position: absolute; top: 0px; left: 0px; z-index:20; "></canvas>';s+='</div>';return s;}
FracImage.prototype.setup=function(){this.el=document.getElementById(this.canid);this.ratio=2;this.el.width=this.wd*this.ratio;this.el.height=this.ht*this.ratio;this.el.style.width=this.wd+"px";this.el.style.height=this.ht+"px";this.g=this.el.getContext("2d");this.g.setTransform(this.ratio,0,0,this.ratio,0,0);}
FracImage.prototype.vis=function(visQ){}
FracImage.prototype.drawMe=function(numer,denom){numer=numer<<0;denom=denom<<0;var g=this.g;g.clearRect(0,0,g.canvas.width,g.canvas.height);document.getElementById(this.imgid).style.visibility='hidden';if(numer>denom){return;}
var posQ=(numer>0);switch(my.typ){case 'pizza':document.getElementById(this.imgid).style.visibility='visible';if(posQ){g.drawChosenSectors(this.wd-2,numer,denom,"rgba(255, 255, 255, 0.0)","rgba(255, 255, 255, 0.8)",'white');}else{g.drawChosenSectors(this.wd-2,-numer,denom,"rgba(255, 0, 0, 0.5)","hsla(0, 100%, 90%, 1)",'white');}
break;case 'circle':if(posQ){g.drawChosenSectors(this.wd-2,numer,denom,"#8888ff","white",'#bbb');}else{g.drawChosenSectors(this.wd-2,-numer,denom,"red","white",'#bbb');}
break;case 'square':if(posQ){g.drawChosenRectSlices(this.wd-2,numer,denom,"orange","white",'grey');}else{g.drawChosenRectSlices(this.wd-2,-numer,denom,"red","white",'grey');}
break;default:}}