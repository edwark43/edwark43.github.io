var i,s,w,my={};var gsize,ghrow,ghcol,gtime,gmoves,gintervalid=-1,gshuffling;function arrangeMain(){my.version=0.7;var s='';s+='<style>';s+='.cell, .hole { width:46px;  height:50px;  font: bold 16px Verdana, Arial;  background-color:#246;  color:#ffffff;  text-align:center; }';s+='.hole { background-color:#aaa; border:none; }';s+='</style>';s+='<div style="text-align:center; margin:auto;">';s+='<p>'
s+='<b>Choose Level: </b>';s+='<select name="level" id="level" onChange="loadBoard(parseInt(document.getElementById(\'level\').value)); startGame();" >';for(var i=3;i<=10;i++){s+='<option value="'+i+'">'+i+'</option>';}
s+='</select>';s+=' ';s+='<input type=button class=but value="New Game" onClick="loadBoard(parseInt(document.getElementById(\'level\').value)); startGame();" />';s+='</p>'
s+='<p id=fldStatus class=capt2></p>';s+='<br/>';s+='<div id=board style="text-align:center; margin:auto;">';s+='</div>';s+='</div>';s+='<p>&nbsp;</p>';s+='<div style="text-align:left;">';s+='<b>Instructions:</b>';s+='<ol>';s+='<li>Choose a Level (3 to 10).</li>';s+='<li>The game board has blocks with numbers in it. Also there is a single "hole" that can be used for moving the blocks.</li>';s+='<li>The objective of the game is to order the numbers using the "hole" for temporary movement.</li>';s+='<li>Move blocks in a row by clicking on them. A block can be moved only if it is in the same row or column as the "hole".</li>';s+='<li>You can move multiple blocks (in the same row or column as the "hole") by clicking the farthest block that you need to be moved.</li>';s+='</ol>';s+='<p>&nbsp;</p>';s+='</div>';s+=optPopHTML();document.write(s);loadBoard(parseInt(document.getElementById('level').value));startGame();}
function toggleHelp(){if(butHelp.value=="Hide Help"){help.style.display="none";butHelp.value="Show Help";}else{help.style.display="";butHelp.value="Hide Help";}}
function r(low,hi){return Math.floor((hi-low)*Math.random()+low);}
function r1(hi){return Math.floor((hi-1)*Math.random()+1);}
function r0(hi){return Math.floor((hi)*Math.random());}
function startGame(){shuffle();gtime=0;gmoves=0;window.clearInterval(gintervalid);tickTime();gintervalid=window.setInterval("tickTime()",1000);}
function stopGame(){if(gintervalid==-1)return;window.clearInterval(gintervalid);var f=document.getElementById("fldStatus");f.innerHTML="";gintervalid=-1;}
function tickTime(){showStatus();gtime++;}
function checkWin(){var i,j,s;if(gintervalid==-1)return;if(!isHole(gsize-1,gsize-1))return;for(i=0;i<gsize;i++)
for(j=0;j<gsize;j++){if(!(i==gsize-1&&j==gsize-1))
{if(getValue(i,j)!=(i*gsize+j+1).toString()){return;}}}
stopGame();s="<table cellpadding=4>";s+="<tr><td align=center><b>Well Done !</b></td></tr>";s+="<tr><td align=center><b>You did it in "+gtime+" secs ";s+="with "+gmoves+" moves!<b></td></tr>";s+="<tr><td align=center>Your speed is "+Math.round(1000*gmoves/gtime)/1000+" moves/sec</td></tr>";s+="</table>";var f=document.getElementById("fldStatus");f.innerHTML=s;window.clearInterval(gintervalid);}
function showStatus(){var f=document.getElementById("fldStatus");f.innerHTML="Time:&nbsp;"+gtime+" secs&nbsp;&nbsp;&nbsp;Moves:&nbsp;"+gmoves}
function brdGet(){var i,j,s;stopGame();s='';for(i=0;i<gsize;i++){for(j=0;j<gsize;j++){s+='<input type=button id=a_'+i+'_'+j+' class="cell" value='+(i*gsize+j+1)+' onclick="move(this);" >';}
s+='<br>';}
return s;}
function getCell(row,col){var s;s="a_"+row+"_"+col;return document.getElementById(s);}
function setValue(row,col,val){var v=getCell(row,col);v.value=val;v.className="cell";}
function getValue(row,col){var v=getCell(row,col);return v.value;}
function setHole(row,col){var v=getCell(row,col);v.value=" ";v.className="hole";ghrow=row;ghcol=col;}
function getRow(obj){var a=obj.id.split("_");return a[1];}
function getCol(obj){var a=obj.id.split("_");return a[2];}
function isHole(row,col){return(row==ghrow&&col==ghcol)?true:false;}
function getHoleInRow(row){var i;return(row==ghrow)?ghcol:-1;}
function getHoleInCol(col){var i;return(col==ghcol)?ghrow:-1;}
function shiftHoleRow(src,dest,row){var i;src=parseInt(src);dest=parseInt(dest);if(src<dest){for(i=src;i<dest;i++){setValue(row,i,getValue(row,i+1));setHole(row,i+1);}}
if(dest<src){for(i=src;i>dest;i--){setValue(row,i,getValue(row,i-1));setHole(row,i-1);}}}
function shiftHoleCol(src,dest,col){var i;src=parseInt(src);dest=parseInt(dest);if(src<dest){for(i=src;i<dest;i++){setValue(i,col,getValue(i+1,col));setHole(i+1,col);}}
if(dest<src){for(i=src;i>dest;i--){setValue(i,col,getValue(i-1,col));setHole(i-1,col);}}}
function move(obj){var r,c,hr,hc;if(gintervalid==-1&&!gshuffling){alert('Please press the "Start Game" button to start.')
return;}
r=getRow(obj);c=getCol(obj);if(isHole(r,c))return;hc=getHoleInRow(r);if(hc!=-1){shiftHoleRow(hc,c,r);gmoves++;checkWin();return;}
hr=getHoleInCol(c);if(hr!=-1){shiftHoleCol(hr,r,c);gmoves++;checkWin();return;}}
function shuffle(){var t,i,j,s,frac;gshuffling=true;frac=100.0/(gsize*(gsize+10));for(i=0;i<gsize;i++){for(j=0;j<gsize+10;j++){if(j%2==0){t=r0(gsize);while(t==ghrow)t=r0(gsize);var elemstr;elemstr=getCell(t,ghcol);elemstr.click();}else{t=r0(gsize);while(t==ghcol)t=r0(gsize);var elemstr;elemstr=getCell(ghrow,t);elemstr.click();}}}
window.status="";gshuffling=false;}
function loadBoard(size){gsize=size;var b=document.getElementById("board");b.innerHTML=brdGet(gsize);setHole(gsize-1,gsize-1);shuffle();}
function success(){optPop();}
function optPopHTML(){var s='';s+='<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';s+='<div id="optInside" style="margin: 5px auto 5px auto;">';s+='<div style="font: 24px Arial; color: blue;">';s+='Success!';s+='</div>';s+='<div style="font: 20px Arial; ">';s+='You have done it!';s+='</div>';s+='<div style="margin-top:20px; font: 20px Arial; ">';s+='Play Again?';s+='</div>';s+='</div>';s+='<div style="margin: 0 0 5px 10px;">';s+='<button onclick="optYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function optPop(){var wd=300;var ht=100;var pop=document.getElementById('optpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=100;var width=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width;var height=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height;pop.style.left=((width/2)-(wd/2))+'px';pop.style.top=((height/2)-(ht/2)+50)+'px';}
function optYes(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';createBlocks();}
function optNo(){var pop=document.getElementById('optpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-999px';quitGame();}