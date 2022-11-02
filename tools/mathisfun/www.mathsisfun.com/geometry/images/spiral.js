var w,h,ratio,s,el,el2,g,g2,my={};function spiralMain(){my.version='0.88';w=500;h=w;my.alps=[1,0.75,0.5,0.2,0.1];my.thks=[1,3,6,9,18,40];my.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["White",'#ffffff'],["Green",'#00cc00'],["Violet",'#EE82EE'],["Orange",'#FFA500'],["Light Salmon",'#FFA07A'],["Slate Blue",'#6A5ACD'],["Yellow",'#FFFF00'],["Aquamarine",'#7FFFD4'],["Pink",'#FFC0CB'],["Coral",'#FF7F50'],["Lime",'#00FF00'],["Pale Green",'#98FB98'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Hot Pink",'#FF69B4'],["Aqua",'#00ffff'],["Gold",'#ffd700'],["Khaki",'#F0E68C'],["Thistle",'#D8BFD8'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Sky Blue",'#87CEEB'],["Navy",'#000080'],["Purple",'#800080'],["Wheat",'#F5DEB3'],["Tan",'#D2B48C'],["Silver",'#C0C0C0']];my.brushes=['basic','flat','round']
my.clrings=['solid','wash','random']
my.presets=[["Doubled",[20,2],[40,-2],[60,2],[80,3]],["Yarn",[61,1],[122,-1.23]],["Cardioid",[120,1],[60,2]],["Astroid",[90,1],[30,-3]],["4 Petals",[90,1],[90,-3]],["Straight Line",[90,1],[90,-1]],["Ellipse",[30,1],[90,-1]],["Square-ish",[15,3],[101,-1]],["In and Out",[65,6],[60,6.5]],["Cross",[46,10],[80,-6],[60,2],[0,0]],["Square Wave",[100,1],[100/3,3],[20,5],[100/7,7],[100/9,9],[100/11,11]],["Sawtooth",[100,1],[50,2],[100/3,3],[25,4],[20,5],[100/6,6],[100/7,7],[12.5,8]],["Pulse Wave",[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7],[10,8],[10,9]],["Triangle Wave",[100,1],[-100/9,3],[100/25,5],[-100/49,7],[100/81,9],[-100/121,11]]];my.instr='The values are [radius, radiusAdd, radiusMultiply, speed, speedAdd, speedMultiply] for each circle.'
my.txtClr='darkblue';my.wavePts=[];my.waveLt=10;my.loopMax=2;my.speed=0.02
var lt=162;my.bgClr='#fff';s="";s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, '
s+='sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div style="position:relative; width:'+(lt+w)+'px; height:'+h+'px; border: none; margin:auto; display:block; ">';s+='<canvas id="gfx1" style="position: absolute; width:'+w+'px; height:'+h+'px; left:'+lt+'px; z-index: 2; border: none; background-color: '+my.bgClr+'; border: 2px solid grey;"></canvas>';s+='<canvas id="gfx2" style="position: absolute; width:'+w+'px; height:'+h+'px; left:'+lt+'px; z-index: 3; border: none;"></canvas>';s+='<button id="editBtn" class="btn" onclick="editpop()" style="position:absolute; left:0px; top:4px; " >Expert</button>';s+='<button id="clear" class="btn" style="position: absolute; top:4px; left:65px;" onclick="clear2()" >Clear</button>';s+='<div style="position:absolute; left:120px; top:2px;">';s+=getPlayHTML(36);s+='</div>';s+='<div id="options" style="position: absolute; width:'+lt+'px; left:0px; top:50px; background-color: aliceblue; font: 20px arial; color: black; text-align:center;">';s+='<div id="table" style="position: relative; width:'+lt+'px; font: 20px arial; color: black; text-align:center;">&nbsp;</div>';s+='<div id="editpop" style="position:absolute; left:-450px; top:40px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; ">';s+='<div style="position: relative; width:260px; height:145px; font: 20px arial; color: black; text-align:center;">';s+='<textarea id="string" style="width: 250px; height: 140px; text-align: center; border-radius: 10px; font: 18px Arial; color: #0000ff; color: blue; background-color: #eeffee; " value="" onKeyUp="chgString()"></textarea>';s+='</div>';s+='<div style="position: relative; width:260px; font: 14px arial; color: black; text-align:center;">';s+=my.instr;s+='</div>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='<button onclick="editNo()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2718;</button>';s+='</div>';s+='</div>';s+='<span style="font: 13px Arial; color: black;">Preset: </span>';s+=getDropdownHTML(my.presets,'presetChg','presets');s+='<button id="randBtn" onclick="randSpiral()" style="font: 13px Arial; width:80px; z-index:4;" class="btn" >Random</button>';s+='<div style="text-align:left; font: 14px Verdana; color:'+my.txtClr+';">Brush:</div>';s+=getBtnsHTML('brush',my.brushes,'#def')
s+='<div style="text-align:left; font: 14px Verdana; color:'+my.txtClr+';">Color Style:</div>';s+=getBtnsHTML('clring',my.clrings,'#ffd')
s+='<div style="text-align:left; font: 14px Verdana; color:'+my.txtClr+';">Thickness:</div>';s+=getBtnsHTML('thk',my.thks,'#fed')
s+='<div style="text-align:left; font: 14px Verdana; color:'+my.txtClr+';">Transparency:</div>';s+=getAlpHTML();s+=`<button id="varyClrBtn" onclick="chgvaryClr()" style="z-index:4;" 
   class="btn lo" >Varying Color</button>`
s+='</div>';s+='<div style="position: absolute; left: 0; bottom:-95px; font: 15px Arial; text-align:center; vertical-align: top; " >';s+='<div style="text-align:left; font: 14px Verdana; color:'+my.txtClr+';">Color:</div>';s+=getClrHTML();s+='</div>';my.spiralQ=true;s+='<div style="position: absolute; left: 400px; bottom:-46px; font: 15px Arial; text-align:center; vertical-align: top; background-color: #efd; margin:3px; padding:2px; border-radius:5px; border: 2px inset yellow;" >';s+='<button id="spiralOnBtn" onclick="toggleSpiral()" style="z-index:2;" class="btn hi" >Spiral</button>';s+='<button id="spiralOffBtn" onclick="toggleSpiral()" style="z-index:2;" class="btn lo" >Wave</button>';s+='</div>';s+='<button style="font: 16px Arial; position:absolute; right:51px; bottom:-30px;" class="btn"  onclick="canvasSave()" >Save</button>';s+='<button style="font: 16px Arial; position:absolute; right:1px; bottom:-30px;" class="btn"  onclick="canvasPrint()" >Print</button>';s+='<div style="position: absolute; right:1px; bottom:-50px; font: 10px Arial; color: #6600cc; ">&copy; 2017 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById('gfx1');ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);el2=document.getElementById('gfx2');el2.width=w*ratio;el2.height=h*ratio;el2.style.width=w+"px";el2.style.height=h+"px";g2=el2.getContext("2d");g2.setTransform(ratio,0,0,ratio,0,0);my.varyClrQ=true;chgvaryClr();my.mid={x:w/2,y:h/2};my.prev={};chgBrush(0)
chgClring(0)
chgThk(0)
chgAlp(0)
chgClr(0)
my.brush=new Brush(g2);my.props=[['radius','rad'],['speed','w']];presetChoose(0);document.getElementById('table').innerHTML=getTableHTML();my.playQ=false;togglePlay();my.brush.chg()}
function presetChoose(n){var preset=my.presets[n];my.circs=[];for(var i=1;i<preset.length;i++){my.circs.push(new Circ(preset[i][0],preset[i][1]));}
clear2();document.getElementById('table').innerHTML=getTableHTML();updateString();}
function randSpiral(){my.circs=[];var circN=3;var tgtSize=w/2-20;for(var i=0;i<circN;i++){var size=(Math.random()*Math.min(w/circN,tgtSize))<<0;if(i==circN-1){size=tgtSize;}else{tgtSize-=size;}
var speed=((Math.random()*60-30)<<0)/10;if(speed==0)speed=0.1;my.circs.push(new Circ(size,speed));}
for(var i=circN;i<4;i++){my.circs.push(new Circ(0,0));}
clear2();document.getElementById('table').innerHTML=getTableHTML();updateString();}
function presetChg(){console.log("presetChg");var div=document.getElementById('presets');var s=div.options[div.selectedIndex].text;presetChoose(div.selectedIndex);console.log("presets",s);}
function getTableHTML(){var s='';s+='<div>';for(var j=0;j<my.props.length;j++){var p=my.props[j];s+='<span style="display: inline-block; width: 60px; font: bold 16px Arial; text-align: center; padding: 2px; margin: 2px;  background-color: #00e8ff; ">'+p[0]+'</span>';}
s+='</div>';for(var i=0;i<my.circs.length;i++){var c=my.circs[i];s+='<div>';for(var j=0;j<my.props.length;j++){var p=my.props[j];s+='<input type="text" id="'+p[0]+i+'" name="'+p[0]+i+'" value="'+c[p[1]]
s+='" style="display: inline-block; width: 60px; height: 18px; text-align: center; padding: 2px; border-radius: 5px; font-size: 14px; overflow: hidden;"'
s+=' oninput="chgVal('+i+','+j+',this.value)" onchange="chgVal('+i+','+j+',this.value)" />';}
s+='</div>';}
s+='<button onclick="tableSub()" style="text-align:left" class="clickbtn" >&minus;</button>';s+='<button onclick="tableAdd()" style="text-align:left" class="clickbtn" >+</button>';return s;}
function tableSub(){my.circs.pop();document.getElementById('table').innerHTML=getTableHTML();}
function tableAdd(){my.circs.push(new Circ(10,1));document.getElementById('table').innerHTML=getTableHTML();}
function chgvaryClr(){my.varyClrQ=!my.varyClrQ;toggleBtn('varyClrBtn',my.varyClrQ);}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function chgVal(i,j,val){var circ=my.circs[i];console.log("chgVala",i,j,val,circ);circ[my.props[j][1]]=parseFloat(val);updateString();}
function chgString(){var s=document.getElementById('string').value;console.log("chgString",s);var cs=s.split('],');my.circs=[];for(var i=0;i<cs.length;i++){var c=cs[i];c=c.replace(/[\[\]]/g,'');var parts=c.split(',');var circ=new Circ(0,0);circ.rad=parseFloat(parts[0]);circ.radAdd=parseFloat(parts[1])/1000;circ.radMult=1+parseFloat(parts[2])/1000;circ.w=parseFloat(parts[3]);circ.wAdd=parseFloat(parts[4])/1000;circ.wMult=1+parseFloat(parts[5])/1000;circ.ang=0;my.circs.push(circ);console.log("circ",JSON.stringify(circ));}
document.getElementById('table').innerHTML=getTableHTML();}
function updateString(){var s='';for(var i=0;i<my.circs.length;i++){var c=my.circs[i];if(i>0)s+=',\n';s+='[';s+=c.rad+','+c.radAdd*1000+','+(c.radMult-1)*1000+','+c.w+','+c.wAdd*1000+','+(c.wMult-1)*1000;s+=']';}
var div=document.getElementById('string');div.value=s;}
function clear2(){console.log("clear2");g2.clearRect(0,0,el2.width,el2.height);g2.beginPath();my.brush.prevPos=null}
function go(){g2.clearRect(0,0,el2.width,el2.height);g2.strokeStyle='blue';g2.lineWidth=1;updateString();my.frames=0;}
function anim(){if(my.playQ){circsDraw();requestAnimationFrame(anim);}}
function circsDraw(){var len=0;var loopn=0;do{g.clearRect(0,0,el.width,el.height);g.strokeStyle='#bbb';g.fillStyle='#bbb';var mid={x:my.mid.x,y:my.mid.y};for(var i=0;i<my.circs.length;i++){var c=my.circs[i];if(c.rad!=0&&c.w!=0){if(isNaN(c.ang))c.ang=0;g.beginPath();g.arc(mid.x,mid.y,Math.abs(c.rad),0,2*Math.PI);g.stroke();mid.x=mid.x+Math.cos(c.ang)*c.rad;mid.y=mid.y-Math.sin(c.ang)*c.rad;g.beginPath();g.arc(mid.x,mid.y,3,0,2*Math.PI);g.stroke();g.fill();if(c.radAdd!=0)c.rad+=c.radAdd;if(c.radMult!=1)c.rad*=c.radMult;if(c.wAdd!=0)c.w+=c.wAdd;if(c.wMult!=1)c.w*=c.wMult;c.ang+=c.w*my.speed}}
if(my.prev.x!=null){if(my.spiralQ){my.brush.drawTo(mid.x,mid.y);}else{g.beginPath();g.moveTo(mid.x,mid.y);g.lineTo(my.waveLt,mid.y);g.stroke();my.wavePts.unshift(mid.y);waveDraw();}
len+=dist(mid.x-my.prev.x,mid.y-my.prev.y);}else{}
my.prev={x:mid.x,y:mid.y};loopn++;}while(len<my.loopMax*10&&loopn<my.loopMax);}
function waveDraw(){while(my.wavePts.length>w){my.wavePts.pop();}
var g=g2;g.clearRect(0,0,el.width,el.height);g.strokeStyle='black';g.fillStyle='blue';g.beginPath();for(var i=0;i<my.wavePts.length;i++){var pt=my.wavePts[i];if(i==0){g.moveTo(i+my.waveLt,pt);}else{g.lineTo(i+my.waveLt,pt);}}
g.stroke();}
function getBtnsHTML(id,vals,clr){var s='';var idProper=id.charAt(0).toUpperCase()+id.slice(1)
s+='<div style="width:160px; text-align:center; z-index:20;">';for(var i=0;i<vals.length;i++){var val=vals[i];s+=`<button id="${id}${i}" style="min-width:26px; height:28px; padding: 0 3px 0 3px; background-color:${clr}; 
    font: 16px Arial; cursor: pointer; border-radius:8px;" onclick="chg${idProper}(${i})" 
    onmouseover="keyOver('${id}',${i})" onmouseout="keyOut('${id}',${i})" >${val}</button>`}
s+='</div>';return s;}
function getAlpHTML(){var s='';s+='<div style="width:160px; text-align:center; z-index:20;">';for(var i=0;i<my.alps.length;i++){var alp=my.alps[i];s+='<button  id="alp'+i+'" style="width:32px; height:32px; padding: 0; background-color:rgba(0,0,255,'+alp+'); border-radius: 6px;  font: 14px Arial; cursor: pointer;" onclick="chgAlp('+i+')" >'+(1-alp)*100+'%</button>';}
s+='</div>';return s;}
function getClrHTML(){var s='';s+='<div style="width:400px; text-align:center; overflow: hidden; word-wrap: break-word; z-index:20;">';for(var i=0;i<my.clrs.length;i++){var clr=my.clrs[i];s+='<button  id="clr'+i+'" style="float:left; width:40px; height:30px; background-color:'+clr[1]+'; border:1; border-color:green; border-radius: 6px; padding:0; font: 11px Arial; overflow: hidden; cursor: pointer;" onclick="chgClr('+i+')" >'+clr[0]+'</button>';}
s+='</div>';return s;}
function getDropdownHTML(opts,funcName,id){var s='';s+='<select id="'+id+'" style="font: 13px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off">';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==0?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i][0]+'" style="height:18px;" '+chkStr+' >'+opts[i][0]+'</option>';}
s+='</select>';return s;}
function getPlayHTML(w){var s='';s+='<style type="text/css">';s+='.playbtn {display: inline-block; position: relative; width:'+w+'px; height:'+w+'px; margin-right:'+w*0.2+'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';s+='.playbtn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';s+='.playbtn:before, button:after {content: " "; position: absolute; }';s+='.playbtn:active {top:'+w*0.05+'px; box-shadow: 0 '+w*0.02+'px '+w*0.03+'px rgba(0,0,0,.4); }';s+='.play:before {  left: '+w*0.36+'px; top: '+w*0.22+'px; width: 0; height: 0; border: '+w*0.3+'px solid transparent; border-left-width: '+w*0.4+'px; border-left-color: blue;  }';s+='.play:hover:before {border-left-color: yellow; }';s+='.pause:before, .pause:after {display: block; left: '+w*0.29+'px; top: '+w*0.28+'px; width: '+w*0.19+'px; height: '+w*0.47+'px; background-color: blue; }';s+='.pause:after {left: '+w*0.54+'px; }';s+='.pause:hover:before, .pause:hover:after {background-color: yellow; }';s+='</style>';s+='<button id="playBtn" class="playbtn play" onclick="togglePlay()" ></button>';return s;}
function toggleSpiral(){my.spiralQ=!my.spiralQ;toggleBtn("spiralOnBtn",my.spiralQ);toggleBtn("spiralOffBtn",!my.spiralQ);my.wavePts=[];go(-1);}
function togglePlay(){var btn='playBtn';if(my.playQ){my.playQ=false;document.getElementById(btn).classList.add("play");document.getElementById(btn).classList.remove("pause");g.clearRect(0,0,el.width,el.height);}else{my.playQ=true;document.getElementById(btn).classList.add("pause");document.getElementById(btn).classList.remove("play");anim();}
if(my.colNo<my.colMax)my.cols[my.colNo].anim();}
function chgBrush(n){my.brushType=my.brushes[n];radioPress(my.brushes,'brush',n);}
function chgClring(n){console.log('chgclring',n)
my.clring=my.clrings[n];radioPress(my.clrings,'clring',n);}
function chgThk(n){my.thk=my.thks[n];radioPress(my.thks,'thk',n);}
function chgAlp(n){my.penAlp=my.alps[n];radioPress(my.alps,'alp',n,false);}
function chgClr(n){my.penClr=my.clrs[n][1];radioPress(my.clrs,'clr',n);}
function radioPress(vals,id,n,brushChgQ=true){for(var i=0;i<vals.length;i++){var div=document.getElementById(id+i);if(i==n){div.style.borderStyle='inset';}else{div.style.borderStyle='outset';}}
if(brushChgQ&&my.brush)my.brush.chg()}
function keyOver(t,n){var div=document.getElementById(t+n);div.style.background='yellow';}
function keyOut(t,n){var div=document.getElementById(t+n);div.style.background='#fed';}
function Circ(rad,w){this.rad=rad;this.radAdd=0;this.radMult=1;this.w=w;this.wAdd=0;this.wMult=1;this.ang=0;this.clr='blue';}
Circ.prototype.plotTrail=function(newExtents){}
function convertHexClr(hex,opacity){hex=hex.replace('#','');var r=parseInt(hex.substring(0,2),16);var g=parseInt(hex.substring(2,4),16);var b=parseInt(hex.substring(4,6),16);return 'rgba('+r+','+g+','+b+','+opacity+')';}
function editpop(){console.log("editpop");var pop=document.getElementById('editpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='100px';}
function editYes(){var pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';console.log("editYes",my.fn);chgString();clear2();}
function editNo(){var pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy);}
function canvasGetExtents(can){var g=can.getContext('2d');var wd=can.width*ratio;var ht=can.height*ratio;var idata=g.getImageData(0,0,wd,ht);var buffer=idata.data;var buffer32=new Uint32Array(buffer.buffer);var x,y;var x1=wd,y1=ht,x2=0,y2=0;for(y=0;y<ht;y++){for(x=0;x<wd;x++){if(buffer32[x+y*wd]>0){if(x<x1)x1=x;if(x>x2)x2=x;if(y<y1)y1=y;if(y>y2)y2=y;}}}
console.log("canvasGetExtents",can,x1,y1,x2,y2);return{left:x1,top:y1,wd:x2-x1,ht:y2-y1}}
function canvasCrop(c1,rect){var c2=document.createElement('canvas');c2.width=rect.wd;c2.height=rect.ht;var g2=c2.getContext("2d");g2.drawImage(c1,rect.left,rect.top,rect.wd,rect.ht,0,0,rect.wd,rect.ht);return c2;}
function canvasSave(typ){typ=(typ==undefined)?'png':typ;if(typ=='jpg')typ='jpeg';var can=document.getElementById('gfx2');var rect=canvasGetExtents(can);can=canvasCrop(can,rect);var dataUrl=can.toDataURL('image/'+typ);var win=window.open();win.document.write("<img src='"+dataUrl+"'/>");win.document.location="#";}
function canvasPrint(){var can=document.getElementById('gfx2');var rect=canvasGetExtents(can);can=canvasCrop(can,rect);var dataUrl=can.toDataURL('image/png');var win=window.open();win.document.write("<img src='"+dataUrl+"'/>");win.document.location="#";win.setTimeout(function(){win.focus();win.print();},500);}
class Clr{constructor(rr,gg,bb){this.clr=[rr<<0,gg<<0,bb<<0];this.dirs=[1,1,1];}
rand(){for(var i=0;i<3;i++){this.clr[i]=(Math.random()*256)<<0;}}
getRGB(){return 'rgb('+this.clr[0]+','+this.clr[1]+','+this.clr[2]+')';}
getHex(){var s='#'+hex2(this.clr[0])+hex2(this.clr[1])+hex2(this.clr[2]);return s;}
setHex(clr){var result=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clr);this.clr=result?[parseInt(result[1],16),parseInt(result[2],16),parseInt(result[3],16)]:null;console.log('setHex',clr,this.clr)}
getBlend(clr2,factor){var clr=[]
for(var i=0;i<3;i++){clr[i]=parseInt(this.clr[i]*(1-factor)+clr2.clr[i]*factor)}
return '#'+hex2(clr[0])+hex2(clr[1])+hex2(clr[2]);}
toRGB(clr){return 'rgb('+clr[0]+','+clr[1]+','+clr[2]+')';}
randChg(speed=1){for(var i=0;i<3;i++){if(Math.random()<0.01)this.dirs[i]*=-1;this.clr[i]+=parseInt(this.dirs[i]*speed)
if(this.clr[i]>255){this.clr[i]=255-(this.clr[i]-255);this.dirs[i]=-1;}
if(this.clr[i]<0){this.clr[i]=0-this.clr[i];this.dirs[i]=1;}}}}
function hex2(n){var s=n.toString(16);if(s.length==1)s='0'+s;return s;}
class Brush{constructor(g){this.g=g
this.x=0;this.y=0;this.clr=0
this.thk=1
this.origin={x:this.x,y:this.y}
this.prevPos=null
this.hairWd=2
this.isStroke=false
this.chg()}
chg(){this.brushType=my.brushType
this.clring=my.clring
this.thk=my.thk
this.alp=my.alp
this.clr=my.penClr
console.log('Brush chg')
this.hairsNew();}
reset(){this.isStroke=false
this.x=this.origin.x
this.y=this.origin.y
console.log('Brush reset')
this.hairsNew();}
drawTo(x,y){var drawQ=true
if(this.prevPos==null){console.log('this.prevPos',this.prevPos)
this.prevPos={};drawQ=false}
this.prevPos.x=this.x;this.prevPos.y=this.y;this.x=x;this.y=y;if(my.varyClrQ){if(Math.random()<0.05){for(var i=0;i<this.hairs.length;i++){var hair=this.hairs[i]
hair.clrObj.randChg(1);hair.clr=hair.clrObj.getHex();}}}
switch(this.brushType){case 'basic':var hair=this.hairs[0]
var clrObj=new Clr()
if(this.clring=='wash'){hair.effect='wash'}
if(this.clring=='random'){clrObj.rand()
hair.clr=clrObj.getHex()}
break}
if(this.isStroke){var dx=this.x-this.prevPos.x;var dy=this.y-this.prevPos.y;for(var i=0;i<this.hairs.length;i++){this.hairs[i].drawTo(dx,dy,drawQ);}}else{this.isStroke=true}}
hairsNew(){console.log('Brush chg',this)
var hairN=1
var wd=this.thk
switch(this.brushType){case 'basic':hairN=1
break
case 'flat':hairN=this.thk
wd=3
break
case 'round':wd=3
hairN=this.thk*4
break
default:}
console.log('hairN',hairN)
var clrObj=new Clr()
clrObj.setHex(this.clr)
var clr=clrObj.getHex()
var clr2Obj=new Clr(255,255,255)
this.hairs=[];for(var i=0;i<hairN;i++){var dx=0
var dy=0
switch(this.brushType){case 'basic':break
case 'flat':var dx=i-hairN/2
var dy=i-hairN/2
if(this.clring=='wash'){clr=clrObj.getBlend(clr2Obj,i/hairN)}
if(this.clring=='random'){clrObj.randChg(Math.random()*10)
clr=clrObj.getHex()}
break
case 'round':var rad=this.thk*0.5
var rad1=rad*Math.random();var ang=Math.PI*2*Math.random();var dx=rad1*Math.sin(ang);var dy=rad1*Math.cos(ang);if(this.clring=='wash'){clr=clrObj.getBlend(clr2Obj,(rad-dy)/(2*rad))}
if(this.clring=='random'){clrObj.randChg(Math.random()*10)
clr=clrObj.getHex()}
break
default:}
this.hairs.push(new Hair(this.g,this.x+dx,this.y+dy,clr,wd));}
console.log('this.hairs',this.hairs)}}
class Hair{constructor(g,x,y,clr,wd){this.g=g
this.x=x||0;this.y=y||0;this.clr=clr;this.clrObj=new Clr()
this.clrObj.setHex(this.clr)
this.wd=wd;this.effect=''
this.prevPos={x:this.x,y:this.y};}
drawTo(offsetX,offsetY,drawQ){this.prevPos.x=this.x;this.prevPos.y=this.y;this.x+=offsetX;this.y+=offsetY;if(drawQ){if(true){this.g.beginPath();this.g.strokeStyle=convertHexClr(this.clr,my.penAlp);this.g.lineWidth=this.wd
this.g.moveTo(this.prevPos.x,this.prevPos.y);this.g.lineTo(this.x,this.y);this.g.stroke();if(this.effect=='wash'){this.g.beginPath();this.g.strokeStyle='rgba(255,255,255,'+(my.penAlp*0.5)+')';this.g.lineWidth=this.wd
var dw=3
this.g.moveTo(this.prevPos.x-dw,this.prevPos.y-dw);this.g.lineTo(this.x+dw,this.y+dw);this.g.stroke();}}
if(false){this.g.lineCap='round';this.g.lineJoin='round';this.g.strokeStyle=this.color;this.g.lineWidth=this.wd;this.g.beginPath();this.g.moveTo(this.prevPos.x,this.prevPos.y);this.g.lineTo(this.x,this.y);this.g.stroke();}}}}
function random(max,min){if(typeof max!=='number'){return Math.random();}else if(typeof min!=='number'){min=0;}
return Math.random()*(max-min)+min;}