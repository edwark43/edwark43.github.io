function multtableMain(){w=610
h=380
s="";s+='<div style="position:relative; width:'+w+'px; height:'+h+'px">';s+='<canvas id="canvasId" width="'+w+'" height="'+h+'" style="z-index:1;"></canvas>';s+='<div id="mult" style="font: 27pt arial; font-weight: bold; color: #6600cc; position:absolute; top:330px; left:0px; width:610px; text-align:center;">3 x 3 = 9</div>';s+='<div id="copyrt" style="font: 7pt arial; font-weight: bold; color: #6600cc; position:absolute; bottom:3px; left:1px; text-align:center;">&copy; 2015 MathsIsFun.com  v 0.81</div>';s+='<div id="dbg" style="font: 9pt sans-serif;"></div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=4
el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0)
tiles=[]
for(var c=0;c<=12;c++){tiles[c]=[]
for(var r=0;r<=12;r++){var t=new Tile(g,r,c)
tiles[c][r]=t}}
el.addEventListener('touchmove',ontouchmove,false);el.addEventListener('mousemove',onmousemove,false);update();}
function onmousemove(e){var rect=el.getBoundingClientRect();var x0=(e.clientX-rect.left);var y0=(e.clientY-rect.top);var c0=Math.floor(x0/45);var r0=Math.floor(y0/25);if(c0<1||c0>12)return
if(r0<1||r0>12)return
document.getElementById("mult").innerHTML=r0+" &times; "+c0+" = "+r0*c0
for(var c=0;c<=12;c++){for(var r=0;r<=12;r++){lvl=1
var t=tiles[r][c]
if(r==r0&&c<c0)lvl=2
if(c==c0&&r<r0)lvl=2
t.hilite(lvl)}}
tiles[r0][c0].hilite(3)
update();};function ontouchmove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onmousemove(evt);evt.preventDefault();};function update(){}
function Tile(ig,ir,ic){this.g=ig;this.c=ic;this.r=ir;this.lvl=0
this.refresh();}
Tile.prototype.hilite=function(ilvl){if(this.lvl!=ilvl){this.lvl=ilvl
this.refresh()}}
Tile.prototype.refresh=function(){wd=45
ht=25
lt=this.r*wd+0.5
tp=this.c*ht+0.5
g.clearRect(lt,tp,wd,ht);this.g.strokeStyle="#aaaaaa";this.g.lineWidth=1;this.g.beginPath()
this.g.moveTo(lt,tp)
this.g.lineTo(lt+wd,tp)
this.g.lineTo(lt+wd,tp+ht)
this.g.lineTo(lt,tp+ht)
this.g.lineTo(lt,tp)
if(this.r==0||this.c==0){if(this.r==0&&this.c==0){this.g.fillStyle="#ff0000"
this.g.textAlign="center"
this.g.font="bold 33px qarmic"
this.g.fillText("×",25,20)}else{lvls=["#ffffff","#ffffff","#aaccff","#aaccff"]
this.g.fillStyle=lvls[this.lvl]
this.g.fill()
var s=""
if(this.r>0)s=this.r
if(this.c>0)s=this.c
this.g.fillStyle="#0000ff"
this.g.textAlign="center"
this.g.font="bold 17px Verdana"
this.g.fillText(s,lt+wd/2,tp+20)}}else{this.g.stroke();lvls=["#eeeeff","#eeeeff","#ffffee","#aaccff"]
this.g.fillStyle=lvls[this.lvl]
this.g.fill()
this.g.fillStyle="#000000"
this.g.textAlign="center"
this.g.font="15px Verdana"
this.g.fillText(this.c*this.r,lt+wd/2,tp+18)}};function hiGraphics(){lineWidth=5;lineJoin="round";strokeStyle="#333";}
hiGraphics.prototype.clear=function(el){g=el.getContext("2d");g.clearRect(0,0,el.width,el.height);return true;};hiGraphics.prototype.lineStyle=function(width,clr,opacity){lineWidth=width;lineJoin="round";strokeStyle=clr;};hiGraphics.prototype.stt=function(){g.beginPath();g.lineWidth=lineWidth;g.lineJoin=lineJoin;g.strokeStyle=strokeStyle;};hiGraphics.prototype.drawCircle=function(g,circleX,circleY,circleRadius){this.stt();g.fillStyle="#FF0000";g.arc(circleX,circleY,circleRadius,0,2*Math.PI);g.stroke();return true;};hiGraphics.prototype.drawCompass=function(g,circleX,circleY,tickRadius){var tickLen=15;for(var i=0;i<360;i+=15){var angle=i*Math.PI/180.;if(i%90){this.lineStyle(1,"#888888",1);}else{this.lineStyle(2,"#444444",1);}
this.stt();var cX=circleX+Math.cos(angle)*tickRadius;var cY=circleY-Math.sin(angle)*tickRadius;g.moveTo(cX,cY);cX=circleX+Math.cos(angle)*(tickRadius+tickLen);cY=circleY-Math.sin(angle)*(tickRadius+tickLen);g.lineTo(cX,cY);g.stroke();cX=circleX+Math.cos(angle)*(tickRadius+tickLen+14)-12;cY=circleY-Math.sin(angle)*(tickRadius+tickLen+14)+5;g.font="12px Arial";g.fillText(i+"°",cX,cY,100);}};hiGraphics.prototype.drawArc=function(g,midX,midY,radius,fromAngle,toAngle){this.stt();g.arc(midX,midY,radius,fromAngle,toAngle);g.stroke();};hiGraphics.prototype.drawBox=function(g,midX,midY,radius,angle){this.stt();var pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};var HiGraphics=new hiGraphics();function TextBox(ig,ifont,ifontSize,iwd,ilines,itxt,ix,iy,iinputQ){this.g=ig;this.font=ifont;this.fontSize=ifontSize;this.wd=iwd;this.lines=ilines;this.txt=itxt;this.posx=ix;this.posy=iy;this.clr="#000000";this.refresh();}
TextBox.prototype.refresh=function(){this.g.font=this.fontSize+"px "+this.font;this.g.fillStyle=this.clr;this.g.fillText(this.txt,this.posx,this.posy,this.wd);};TextBox.prototype.setText=function(itxt){this.txt=itxt;this.refresh();};TextBox.prototype.setClr=function(iclr){this.clr=iclr;};