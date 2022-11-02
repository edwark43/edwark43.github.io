var i,s,w,my={};my.drag={x:0,y:0};function placeitMain(){glevel=12;gdt=24;gboardwidth=400;gcolor=new Array();gleft=20;gtop=20;gdrag=false;gcellid="";a="";gblocks="";gzmax=0;var s='';s+='<div id=divMain>';s+='<h3>Recreate the square from the crazy pieces...</h3>';s+='<span class=capt1>Choose No. of Pieces:</npan>&nbsp;';s+='<select id=selLevel>';for(i=4;i<=20;i++){s+='<option value="'+i+'">'+i+'</option>';}
s+='</select>&nbsp;';s+='<input class=but type=button value="Start Game" onClick="createBlocks();">';s+='</div>';s+='<div id=divSub style="display:none;">';s+='<input type=button class=but value="Quit Game" onClick="quitGame()">&nbsp;';s+='<input type=checkbox checked id=chkAnim>';s+='<label for=chkAnim class=h3>Blink pieces when correctly placed.</label>';s+='<div class=capt2>Drag the pieces onto the square using the mouse...</div>';s+='<div id=board style="position:relative; border:none; background-color:#acf; background-image: url(images/place-it-bg.jpg); background-repeat: no-repeat; "></div>';s+='</div>';s+='<p>&nbsp;</p>';s+=optPopHTML();document.write(s);populateColor();var div=document.body;div.addEventListener('mousemove',onMouseMove);div.addEventListener('mouseup',onMouseUp);div.addEventListener('touchmove',onTouchMove,false);div.addEventListener('touchend',onTouchEnd,false);}
function storeBlocks(){var i;gblocks=new Array(glevel);for(i=0;i<glevel;i++){gblocks[i]=new Array();}
for(i=0;i<glevel*glevel;i++)
gblocks[a[i]].add(i);}
function clsBlock(num){var i,k=0,c;this.left=10000;this.top=10000;this.bottom=0;this.right=0;for(i=0;i<glevel*glevel;i++){if(a[i]==num){this.block=num;this.cells[k]=new clsCell(num,i);c=this.cells[k];if(c.left<this.left)this.left=c.left;if(c.top<this.top)this.top=c.top;if(c.right>this.right)this.right=c.right;if(c.bottom>this.bottom)this.bottom=c.bottom;k++;}}
this.width=this.right-this.left;this.height=this.bottom-this.top;}
function clsCell(num,index){var c;this.id="a"+index;c=eval(this.id);this.block=num;this.object=c;this.id=c.id;this.left=c.style.pixelLeft;this.top=c.style.pixelTop;this.right=c.style.pixelRight;this.bottom=c.style.pixelBottom;this.x=c.style.pixelLeft;this.y=c.style.pixelTop;this.z=c.style.zIndex;}
function populateColor(){var r,g,b,l,n;var arr=new Array("cc","33","ff");l=arr.length;n=0;for(r=0;r<l;r++)
for(g=0;g<l;g++)
for(b=0;b<l;b++){gcolor[n]="#"+arr[r]+arr[g]+arr[b];if(gcolor[n]!="#ffffff")n++;}}
function isWin(){for(i=0;i<gblocks.length;i++)
{n=gblocks[i][0];oldx=(n%glevel)*gdt;oldy=(parseInt(n/glevel))*gdt;c=eval("a"+gblocks[i][0]);if(parseInt(c.style.left)!=oldx||parseInt(c.style.top)!=oldy)
return false;}
return true;}
function rand(low,hi){return Math.floor((hi-low)*Math.random()+low);}
function getLeft(){}
function Removepx(pxstr){var i;i=parseInt(pxstr)
return(i);}
function moveBlock(cell,x,y){var i,max,b,c,n,xoff,yoff;max=glevel*glevel;n=parseInt(cell.id.substr(1));var cellLT,cellRT;cellLT=Removepx(cell.style.left);cellTOP=Removepx(cell.style.top);xoff=x-cellLT-gleft-parseInt(gdt/2)+document.body.scrollLeft;yoff=y-cellTOP-gtop-parseInt(gdt/2)+document.body.scrollTop;b=gblocks[a[n]];for(i=0;i<b.length;i++){c=eval("a"+b[i]);cellLT=parseInt(c.style.left)+xoff;c.style.left=cellLT+"px";cellTOP=parseInt(c.style.top)+yoff;c.style.top=cellTOP+"px";}}
function moveBlock2(cell,x,y){var i,max,b,c,n,xoff,yoff;max=glevel*glevel;n=parseInt(cell.id.substr(1));var cellLT,cellRT;cellLT=Removepx(cell.style.left);cellTOP=Removepx(cell.style.top);xoff=x;yoff=y;b=gblocks[a[n]];for(i=0;i<b.length;i++){c=eval("a"+b[i]);cellLT=parseInt(c.style.left)+xoff;c.style.left=cellLT+"px";cellTOP=parseInt(c.style.top)+yoff;c.style.top=cellTOP+"px";}}
function onTouchStart(obj,evt){console.log("onTouchStart",evt);var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;evt.preventDefault();onMouseDown(obj,evt)}
function onTouchMove(evt){var touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onMouseMove(evt);}
function onTouchEnd(evt){console.log("onTouchEnd");onMouseUp();if(my.dragQ){my.dragQ=false;var bRect=el.getBoundingClientRect();var mouseX=(evt.changedTouches[0].clientX-bRect.left);var mouseY=(evt.changedTouches[0].clientY-bRect.top);console.log("onTouchEnd",evt,mouseX,mouseY);pcDrop(mouseX,mouseY);}}
function onMouseDown(obj,evt){var b,c,n;my.drag.x=evt.clientX;my.drag.y=evt.clientY;gdrag=true;gcellid=obj.id;max=glevel*glevel;n=parseInt(obj.id.substr(1));b=gblocks[a[n]];gzmax++;for(i=0;i<b.length;i++){c=eval("a"+b[i]);c.style.zIndex=gzmax;}}
function onMouseMove(evt){mouseX=evt.clientX-my.drag.x;mouseY=evt.clientY-my.drag.y;my.drag.x=evt.clientX;my.drag.y=evt.clientY;if(gdrag){moveBlock2(document.getElementById(gcellid),mouseX,mouseY);}}
function onMouseUp(){var c,n,oldx,oldy,newx,newy;if(!gdrag)return;c=eval(gcellid);n=parseInt(gcellid.substr(1));oldx=(n%glevel)*gdt;oldy=(parseInt(n/glevel))*gdt;newx=parseInt(c.style.left);newy=parseInt(c.style.top);if(Math.abs(oldx-newx)<gdt/2&&Math.abs(oldy-newy)<gdt/2){moveBlock(c,oldx+gdt/2+gleft-document.body.scrollLeft,oldy+gdt/2+gtop-+document.body.scrollTop);if(chkAnim.checked)
setTimeout("animate("+n+",0)",80);else{if(isWin()){success();}}}
gdrag=false;gcellid="";}
function success(){optPop();}
function animate(num,count){var b;count++;b=gblocks[a[num]];if(count<5){for(i=0;i<b.length;i++){c=eval("a"+b[i]);c.style.backgroundColor=gcolor[count];}
setTimeout("animate("+num+","+count+")",200);}else{for(i=0;i<b.length;i++){c=eval("a"+b[i]);c.style.backgroundColor=gcolor[a[num]];}
if(isWin()){success();}}}
function isOk(cellnum){var i,x,y,max,xx,yy;if(a[cellnum]!=-1)return false;x=cellnum%glevel;y=parseInt(cellnum/glevel);if(x==0||x==glevel-1)return false;if(y==0||y==glevel-1)return false;if(a[(y+1)*glevel+x]!=-1||a[(y-1)*glevel+x]!=-1||a[y*glevel+x+1]!=-1||a[y*glevel+x-1]!=-1)return false;return true;}
function setBorder(){var i,x,y,max,bstyle="1px solid black",c;max=glevel*glevel;for(i=0;i<max;i++){x=i%glevel;y=parseInt(i/glevel);c=eval("a"+i);if((y==0)||(y!=0&&a[(y-1)*glevel+x]!=a[i]))c.style.borderTop=bstyle;if((y==glevel-1)||(y!=glevel-1&&a[(y+1)*glevel+x]!=a[i]))c.style.borderBottom=bstyle;if((x==0)||(x!=0&&a[y*glevel+x-1]!=a[i]))c.style.borderLeft=bstyle;if((x==glevel-1)||(x!=glevel-1&&a[y*glevel+x+1]!=a[i]))c.style.borderRight=bstyle;}}
function createBlocks(){var i,max,x,y,rr,done,j,tries;console.log("createBlocks");divMain.style.display="none";glevel=parseInt(selLevel.value);gdt=parseInt(gboardwidth/glevel);board.style.left=gleft+'px';board.style.top=gtop+'px';max=glevel*glevel;a=new Array(max);for(i=0;i<max;i++)a[i]=-1;for(i=0;i<glevel;i++){tries=0;do{rr=rand(0,max);tries++;}
while(!isOk(rr)&&tries<glevel*glevel&&a[rr]!=-1);a[rr]=i;}
do{done=true;for(i=0;i<max;i++){if(a[i]==-1)
{done=false;}else{growCell(i);}}}
while(!done);draw();setBorder();storeBlocks();shuffle();divSub.style.display="block";}
function unit(){return rand(-1,2);}
function growCell(cellnum){var x,y,cn,nx,ny,n;cn=cellnum;x=cn%glevel;y=parseInt(cn/glevel);nx=unit();if(nx!=0){if(x+nx<0)nx=0;else if(x+nx>glevel-1)nx=glevel-1;n=y*glevel+x+nx;if(a[n]==-1)a[n]=a[cn];}
ny=unit();if(ny!=0){if(y+ny<0)ny=0;else if(y+ny>glevel-1)ny=glevel-1;n=(y+ny)*glevel+x;if(a[n]==-1)a[n]=a[cn];}}
function shuffle(){for(i=0;i<glevel;i++){moveBlock(eval("a"+gblocks[i][0]),gleft+rand(0.9*gboardwidth,1.4*gboardwidth),gtop+rand(-gboardwidth*0.2,gboardwidth*0.9));}}
function draw(){var i,x,y,max,s;max=glevel*glevel;s="";for(i=0;i<max;i++){x=i%glevel;y=parseInt(i/glevel);s=s+'<div id=a'+i+' style="position:absolute;width:'+gdt+'px;height:'+gdt+
'px;left:'+(x*gdt)+'px;top:'+(y*gdt)+'px;background-color:'+gcolor[a[i]]+
';z-index:'+a[i]+'" onmousedown="onMouseDown(this,event);" ontouchstart="onTouchStart(this,event);"></div>';}
gzmax=glevel;board.style.width=(glevel*gdt)+'px';board.style.height=(glevel*gdt)+'px';board.innerHTML=s;}
function quitGame(){divSub.style.display="none";divMain.style.display="block";}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optInside" style="margin: 5px auto 5px auto;">';s+='<div style="font: 24px Arial; color: blue;">';s+='Success!';s+='</div>';s+='<div style="font: 20px Arial; ">';s+='You have done it!';s+='</div>';s+='<div style="margin-top:20px; font: 20px Arial; ">';s+='Play Again?';s+='</div>';s+='</div>';s+='<div style="margin: 0 0 5px 10px;">';s+='<button onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var wd=300;var ht=100;var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=100;var width=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width;var height=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height;pop.style.left=((width/2)-(wd/2))+'px';pop.style.top=((height/2)-(ht/2)+50)+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';createBlocks();}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';quitGame();}
Array.prototype.add=ArrayAdd;function ArrayAdd(val){this[this.length]=val;}