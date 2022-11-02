var w,h,ratio,i,s,el,g,div,dragQ,game,my={};function marblesMain(){console.log("put stuff in here");}
var INVALID=0,MARBLE=1,HOLE=2;var a=new Array(0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,2,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0);var b=new Array();var marbles_left=32;var currcell=-1;var gintervalid=-1,gtime=0;var game_over=true;function tick(){elapsed.innerHTML=gtime+"&nbsp;sec"+(gtime==1?"":"s");gtime++;}
function copyArray(src,dest){for(var ii=0;ii<src.length;ii++)dest[ii]=src[ii];}
function cell(i){return eval('c'+i);}
function cellxy(x,y){return eval('c'+(y*9+x));}
function setHilite(i){cell(i).src="images/marbles/marble_hilite.gif";}
function setMarble(i){cell(i).src="images/marbles/marble_hole.gif";}
function setHole(i){cell(i).src="images/marbles/hole.gif";}
function move(src,middle,dest){var msgs=new Array("Hey, that's a lazy game! You need more practice!","WOW! You cleared all the marbles!\nYou must be a Genius!!","That's a great show!\nYou're brilliant!","Good show! You are intelligent.\n"+
"A little more effort and you'll be at the top!","Hmmm, not bad! But I'm sure you can do better!","You surely can improve! Learn the tricks as you go!");setHole(src);setHole(middle);setMarble(dest);b[src]=b[middle]=HOLE;b[dest]=MARBLE;currcell=-1;marbles_left--;score.innerHTML=marbles_left+"/32";game_over=isGameOver();if(game_over){clearInterval(gintervalid);gintervalid=-1;newbut.value="S T A R T";alert("********* !! G A M E   O V E R !! *********\n\n"+
((marbles_left>5)?msgs[0]:msgs[marbles_left])+"\n\n"+
"No. of marbles left: "+marbles_left+"\n"+
"Time Elapsed: "+gtime+" secs");gtime=0;}}
function canMove(n){if(b[n]!=MARBLE)return false;return(b[n-2]==HOLE&&b[n-1]==MARBLE)||(b[n+2]==HOLE&&b[n+1]==MARBLE)||(b[n-18]==HOLE&&b[n-9]==MARBLE)||(b[n+18]==HOLE&&b[n+9]==MARBLE);}
function isGameOver(){var moveable=false;for(y=1;y<8;y++)
for(x=1;x<8;x++)
if(canMove(y*9+x))return false;return true;}
function hit(n){if(gintervalid==-1)
{gintervalid=setInterval("tick()",1000);tick();newbut.value="S T O P !";}
if(b[n]==MARBLE){if(currcell!=-1)setMarble(currcell);setHilite(n);currcell=n;}
if(b[n]==HOLE){if(currcell==-1){alert("Please select a marble to move");return;}
if(currcell-n==2)move(currcell,n+1,n);else if(n-currcell==2)move(currcell,n-1,n);else if(n-currcell==18)move(currcell,n-9,n);else if(currcell-n==18)move(currcell,n+9,n);else alert("Sorry. Invalid move!\n\n"+
"You can move the selected marble only to\n"+
"a hole that is exactly one marble away.\n\n"+
"Diagonal moves are not allowed.");}}
function dropped(){var imgid=document.elementFromPoint(event.clientX,event.clientY).id;var d=imgid.match(/c(\d+)/);if(d!=null)hit(parseInt(d[1]));}
function newGame(){if(gintervalid==-1)
{if(game_over||(gtime!=0&&!confirm("Do you wish to continue with the old game?\n\nClick 'Cancel' to start a new game."))){gtime=0;boardarea.innerHTML=drawBoard();game_over=false;}
gintervalid=setInterval("tick()",1000);tick();newbut.value="S T O P !";}else
{clearInterval(gintervalid);gintervalid=-1;newbut.value="S T A R T";}}
function drawBoard(){var i,x,y,s,func;copyArray(a,b);marbles_left=32;s='<table border="0" cellspacing="0" cellpadding="0" >';for(y=1;y<8;y++){s+='<tr>';for(x=1;x<8;x++){i=y*9+x;func='onmousedown="hit('+i+')" ondragend="dropped()" ';if(i==10||i==16||i==55||i==60){s+='<td colspan="2" rowspan="2" valign=bottom align=right >';if(i==60){s+="<table cellpadding=0 cellspacing=0><tr><td class=info align=right>Marbles Left:</td></tr>"+
"<tr><td id=score class=score align=center>32/32</td></tr>"+
"<tr><td id=elapsed class=elapsed align=center>&nbsp;</td></tr>"+
"<tr><td align=center>"+
"<input id=newbut type=button class=button value='S T A R T' onclick='newGame()'>"+
"<td></tr></table>";}
s+="</td>";}else if(b[i]!=INVALID){s+='<td  style="border: none; padding: 0; margin: 0; height: 0;" >';if(b[i]==MARBLE)s+='<img id="c'+i+'" src="images/marbles/marble_hole.gif" width="60" height="60" '+func+'>';if(b[i]==HOLE)s+='<img id="c'+i+'" src="images/marbles/hole.gif" width="60" height="60" '+func+'>';s+="</td>";}}
s+="</tr>";}
s+="</table>";return s;}