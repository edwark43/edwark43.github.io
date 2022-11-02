var my={}
function balancedragMain(){var version='0.83';var w=490;var h=280;my.imgHome=(document.domain=='localhost')?'/mathsisfun/algebra/images/':'/algebra/images/'
my.shapes=[];my.wts=[];my.boxWd=20
my.bdName='board0'
my.shapeClr='gold'
my.zIndex=200
my.transition='0.3s ease-in-out'
my.drag={onQ:false}
my.bowls=[{id:'bowlLt',zone:{lt:50,mid:116,rt:172,tp:50,bt:240}},{id:'bowlRt',zone:{lt:320,mid:386,rt:450,tp:50,bt:240}}]
var s="";s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px; cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none; border-radius: 9px; margin:auto; display:block; box-shadow: 0px 0px 19px 10px rgba(0,0,68,0.46); ">';s+='<div id="'+my.bdName+'" style="position: absolute;	left: 0px; top: 0px; width:'+w+'px; height:'+h+'px;	z-index: 190; ">';s+='</div>';var tp=10;s+='<div id="arm" style="background-image: url('+my.imgHome+'balance-arm.gif);	position: absolute;	left: 100px; top:'+(tp+60)+'px; height: 87px;	transition: all '+my.transition+'; width: 301px;	z-index: 150;	"></div>';s+='<div id="col" style="background-image: url('+my.imgHome+'balance-column.gif); position: absolute; left: 203px;	top:'+(tp+45)+'px; height: 204px; 	width: 96px;	z-index: 100;	"></div>';s+='<div id="bowlLt" style="background-image: url('+my.imgHome+'balance-bowl.gif);	position: absolute;	left: 48px;	top:'+(tp+110)+'px; height: 122px;	transition: all '+my.transition+'; width: 132px;	z-index: 10;	">';s+='</div>';s+='<div id="bowlRt" style="background-image: url('+my.imgHome+'balance-bowl.gif);	position: absolute;	left: 318px; top:'+(tp+110)+'px;	height: 122px;	transition: all '+my.transition+'; width: 132px;	z-index: 100;	">';s+='</div>';s+='<div style="font: 11px Arial; color: #6600cc; position:absolute; right:3px; bottom:3px; text-align:center;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);window.addEventListener('mousemove',function(ev){mouseMove(ev)})
window.addEventListener('touchmove',function(ev){console.log('touchmove')
var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;mouseMove(ev)})
wtsSetup();balTilt(0)}
function mouseMove(ev){if(!my.drag.onQ)return
var div=my.drag.div
var lt=parseFloat(div.style.left)+ev.clientX-my.drag.x
div.style.left=lt+'px'
my.drag.x=ev.clientX
var tp=parseFloat(div.style.top)+ev.clientY-my.drag.y
div.style.top=tp+'px'
my.drag.y=ev.clientY}
function wtsSetup(){var lens=[1,1,2,2,3,3,4,5];var x=10
var y=10
for(var i=0;i<lens.length;i++){var len=lens[i]
var wt=new Wt('a',len,my.shapeClr)
wt.setSize()
wt.setxy(x,y)
wt.draw();my.wts.push(wt)
x+=len*my.boxWd+7}}
function balTilt(deg){var arm=document.getElementById('arm');arm.style.transform='rotate('+(1.625*(deg))+'deg)';for(var bowlN=0;bowlN<my.bowls.length;bowlN++){var bowl=my.bowls[bowlN]
var div=document.getElementById(bowl.id);var dirn=bowlN?1:-1
bowl.tp=105+(dirn*4*(deg))
div.style.top=bowl.tp+'px';}
balWtSet()}
function balWtSet(){for(var bowlN=0;bowlN<my.bowls.length;bowlN++){var bowl=my.bowls[bowlN]
bowl.wtSum=0
var yPos=bowl.tp+85
for(var i=my.wts.length-1;i>=0;i--){var wt=my.wts[i]
if(wt.bowlN==bowlN){wt.div.style.transition=my.transition;wt.setxy(bowl.zone.mid-wt.sz*my.boxWd/2,yPos)
wt.draw()
bowl.wtSum+=wt.sz
yPos-=my.boxWd}}}
console.log('bowls',my.bowls)}
function balWtTilt(){if(my.bowls[0].wtSum<my.bowls[1].wtSum)balTilt(8)
if(my.bowls[0].wtSum>my.bowls[1].wtSum)balTilt(-8)
if(my.bowls[0].wtSum==my.bowls[1].wtSum)balTilt(0)}
class Wt{constructor(name,sz,clr){this.name=name;this.sz=sz;this.clr=clr;this.hitN=0;this.showQ=true;this.canPad=4
this.xn=sz;this.yn=1;this.bowlN=-1;this.pad=0;this.div=document.createElement("div");this.div.style.transition="";this.div.style.pointerEvents="auto"
this.div.style.zIndex=my.zIndex++;this.can=document.createElement('canvas');this.g=this.can.getContext("2d");this.div.appendChild(this.can);document.getElementById(my.bdName).appendChild(this.div);this.setSize();var div=this.div;var me=this;me.drag={onQ:false,x:0,y:0};div.addEventListener('touchstart',function(ev){if(!me.showQ)return;console.log('touchstart');me.drag.onQ=true;me.drag.x=ev.clientX;me.drag.y=ev.clientY;me.div.style.zIndex=my.zIndex++;me.div.style.transition="";me.goneOutQ=true;var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;ev.preventDefault();});div.addEventListener('touchend',function(){me.dropMe(me);});div.addEventListener('mouseover',function(){document.body.style.cursor="pointer";});div.addEventListener('mousedown',function(ev){me.drag.onQ=true;me.drag.x=ev.clientX;me.drag.y=ev.clientY;me.drag.div=me.div
me.div.style.zIndex=my.zIndex++;me.div.style.transition="";ev.stopPropagation()
my.drag=me.drag
me.goneOutQ=true;});div.addEventListener('mouseleave',function(ev){me.moveMe(me,ev);});div.addEventListener('mouseup',function(){me.dropMe(me);});}
dropMe(me){me.drag.onQ=false;my.borderLt=0;my.borderTp=0;var lt=parseFloat(me.div.style.left);me.div.style.left=lt+'px';var tp=parseFloat(me.div.style.top);me.div.style.top=tp+'px';console.log('dropMe',lt,tp,me.div.style.top,my.boxWd,my.boxWd*this.sz);me.bowlN=-1;for(var i=0;i<my.bowls.length;i++){var bowl=my.bowls[i];if(insideRect(lt+my.boxWd*this.sz/2,tp,bowl.zone)){console.log('inside bowl '+i);me.bowlN=i;}}
console.log('in bowl: '+me.bowlN);balWtSet();balWtTilt();}
moveMe(me,ev){ev.preventDefault();if(me.drag.onQ){var lt=parseFloat(me.div.style.left)+ev.clientX-me.drag.x;me.div.style.left=lt+'px';me.drag.x=ev.clientX;var tp=parseFloat(me.div.style.top)+ev.clientY-me.drag.y;me.div.style.top=tp+'px';me.drag.y=ev.clientY;}}
bdMoveTo(bdName){document.getElementById(this.bdName).removeChild(this.div);document.getElementById(bdName).appendChild(this.div);this.bdName=bdName;}
hitQ(xn,yn){var rect={lt:xn,tp:yn,wd:1,ht:1,rt:xn+0.99,bt:yn+0.99};if(intersectRect(this.rect(),rect)){console.log('intersects',this.rect(),rect);return true;}
return false;}
hit(bd){this.hitN++;console.log('ship hit',this.hitN,this.sz);if(!this.sunkQ&&this.hitN>=this.sz){this.sunkQ=true;soundPlay('sndSunk');this.show(true);console.log('ship just sunk');for(var i=0;i<this.xn;i++){for(var j=0;j<this.yn;j++){var xn=this.pos.x+i;var yn=this.pos.y+j;bd[xn][yn].sunkQ=true;}}}}
setSize(){var tp=0;var lt=0;var canWd=(this.xn*my.boxWd+this.canPad*2);var canHt=(this.yn*my.boxWd+this.canPad*2);var div=this.div;div.style.width=canWd+'px';div.style.height=canHt+'px';div.style.position='absolute';div.style.top=tp+'px';div.style.left=lt+'px';var can=this.can;can.style.position="absolute";can.style.top='0px';can.style.left='0px';var ratio=1;can.width=canWd*ratio;can.height=canHt*ratio;can.style.width=canWd+"px";can.style.height=canHt+"px";}
rect(){return{lt:this.pos.x,tp:this.pos.y,wd:this.xn,ht:this.yn,rt:this.pos.x+this.xn-0.01,bt:this.pos.y+this.yn-0.01};}
show(onQ){console.log('Wt show',onQ);if(onQ){this.draw();}else{var g=this.g;g.clearRect(0,0,g.canvas.width,g.canvas.height);}}
draw(){var g=this.g;var wd=this.xn*my.boxWd;var ht=this.yn*my.boxWd;g.clearRect(0,0,g.canvas.width,g.canvas.height);g.strokeStyle='green';g.lineWidth=1;g.fillStyle=this.clr;g.font='bold 17px Arial'
g.beginPath();g.roundRect(this.canPad,this.canPad,wd,ht,my.boxWd*0.36);g.fill();g.stroke();g.fillStyle='white'
g.fillText((this.xn*this.yn),this.canPad+wd/2-5,this.canPad+ht-4)}
setxy(lt,tp){console.log('setxy',lt,tp);this.div.style.left=(lt-this.canPad)+'px';this.div.style.top=(tp-this.canPad)+'px';}}
CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){if(w<2*r)r=w/2;if(h<2*r)r=h/2;this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);return this;};function insideRect(x,y,r){if(x<r.lt)return false
if(x>r.rt)return false
if(y<r.tp)return false
if(y>r.bt)return false
return true}