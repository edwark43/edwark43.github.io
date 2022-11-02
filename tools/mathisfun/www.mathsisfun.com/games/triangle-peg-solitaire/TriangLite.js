var finished=0;var selectnum=0;var running=0;var MAXbs=36;var oldpos=new Array(MAXbs);var pos=new Array(MAXbs);var atmove=0;var histo=new Array(MAXbs);var peg=new Array(MAXbs);var numMoves=0;var SolNo=0;var boardSide=5;var demoSpeed=1;var demoDelay=setdelay(demoSpeed);urlQuery=window.location.href.split("?");var newboardCode=parseInt(urlQuery[1]);var newboardSide=newboardCode>>4;if(newboardSide>3&&newboardSide<25){boardSide=newboardSide;demoSpeed=(newboardCode&14)/2;demoDelay=setdelay(demoSpeed);}
var boardSize=0;var vacnum=-2;var rotBoard=0;var refBoard=0;var dirx=new Array(1,0,-1,-1,0,1);var diry=new Array(0,1,1,0,-1,-1);var nbProblems;var Problem=new Array();var sz=32;var DemoMove=new Array(MAXbs);var iOpened=false;var ct=0;Problem[ct++]=new Array(4,0,-1,1,-1,5,5,49,4,67,49,43,25,5,74);Problem[ct++]=new Array(5,0,0,0,0,10,10,25,43,114,21,97,80,107,89,74,49,4,24,42);Problem[ct++]=new Array(5,1,-2,1,-2,11,11,89,107,75,21,13,49,114,44,88,4,29,107,80);Problem[ct++]=new Array(5,0,-3,2,-4,10,10,12,98,80,107,44,114,21,88,49,4,24,45,115);Problem[ct++]=new Array(5,2,-4,2,-4,9,9,80,107,29,88,4,49,20,74,115,98,25,5,44);Problem[ct++]=new Array(6,2,-4,0,0,9,9,29,75,48,121,162,45,146,128,144,162,4,28,80,96,114,44,98,24,42);Problem[ct++]=new Array(6,0,0,0,0,10,10,42,57,75,48,162,5,45,146,128,144,162,121,28,80,96,114,44,98,25);Problem[ct++]=new Array(6,1,-2,1,-5,10,10,106,137,44,120,147,163,48,12,52,120,136,5,77,163,146,57,21,75,60);Problem[ct++]=new Array(6,0,-3,0,-3,9,9,121,28,4,67,49,137,75,162,42,4,24,45,115,155,137,67,52,120,138);Problem[ct++]=new Array(6,1,-5,1,-5,9,9,147,120,163,147,69,52,120,137,44,12,48,5,75,57,21,77,163,146,60);Problem[ct++]=new Array(7,0,-2,0,-4,12,12,4,49,121,42,4,28,138,52,68,115,210,107,192,219,176,192,169,80,98,24,45,117,219,202,100,186);Problem[ct++]=new Array(7,0,-1,1,-1,12,12,49,4,121,49,99,115,210,107,192,219,176,192,44,101,200,218,114,42,4,138,48,66,12,52,169,85);Problem[ct++]=new Array(7,1,-3,2,-3,13,12,146,29,75,61,202,21,76,146,219,192,210,80,162,76,176,194,88,169,4,52,120,136,154,67,49,13);Problem[ct++]=new Array(8,2,-4,0,0,15,14,29,75,48,146,266,248,232,44,137,275,259,241,121,225,162,282,4,28,84,168,184,200,218,116,202,100,186,80,96,114,44,98,24,42);Problem[ct++]=new Array(8,0,0,0,0,14,14,42,114,218,145,74,249,88,108,194,266,232,248,265,162,125,241,80,101,28,225,121,283,266,4,28,85,185,101,201,114,44,98,24,42);Problem[ct++]=new Array(8,0,-6,0,-6,13,13,84,225,28,84,138,258,107,93,193,44,98,28,163,241,136,154,5,44,275,259,243,225,121,282,164,266,146,57,114,42,4,28,85,187);Problem[ct++]=new Array(8,0,-3,0,-6,13,13,121,-1);Problem[ct++]=new Array(8,1,-5,2,-7,15,14,147,120,225,84,28,4,250,267,283,100,163,77,21,218,114,44,243,225,121,49,13,69,157,275,259,242,120,138,48,68,136,156,258,140);Problem[ct++]=new Array(8,2,-7,2,-7,14,14,224,251,267,283,125,240,256,92,148,250,100,29,4,163,75,21,77,165,283,49,13,69,157,275,257,155,137,67,52,124,224,241,139,125);Problem[ct++]=new Array(8,1,-2,1,-2,15,15,89,20,194,89,241,224,251,267,283,124,224,240,256,52,12,75,164,264,282,162,74,5,43,28,84,168,109,211,195,177,88,108,194,89);Problem[ct++]=new Array(8,3,-6,3,-6,15,15,93,120,147,241,224,251,52,124,224,12,76,162,282,43,28,85,5,45,117,265,165,283,267,251,233,192,210,106,36,92,176,193,107,93);nbProblems=ct;if(!document.images)
{alert("Image property not supported... This game will not work on your browser.");}
if(document.layers)
{var scrX=innerWidth;var scrY=innerHeight;onresize=function(){if(scrX!=innerWidth||scrY!=innerHeight){history.go(0)}}}
var locimages=new Array(4);locimages[0]=new Image(sz,sz);locimages[0].src="0.gif";locimages[1]=new Image(sz,sz);locimages[1].src="1.gif";locimages[2]=new Image(sz,sz);locimages[2].src="2.gif";locimages[3]=new Image(sz,sz);locimages[3].src="3.gif";function getpegnumber(x,y)
{if(y>0||y<=-boardSide||x<0||x>-y)return-1;return tno(-y)+x;}
function getx(num)
{var y=gety(num);return num+1-y-tno(1-y);}
function gety(num)
{var ctr=0;var y;for(y=0;y>-boardSide;y--){if(num>=ctr&&num<ctr+1-y)return y;ctr+=1-y;}
return 1;}
function ispossiblemove(num)
{var conds=0;var d;var pf;var po;var p2=1;if(pos[num]<2)return 0;for(d=0;d<6;d++){po=getpegdir(num,1,d);pf=getpegdir(num,2,d);if(pf>=0&&(pos[po]&2)&&((pos[pf]&10)==0))conds|=p2;p2=p2*2;}
return conds;}
function getpegdir(num,n,d)
{var x=getx(num);var y=gety(num);return getpegnumber(x+n*dirx[d],y+n*diry[d]);}
function tno(x)
{return(x*(x+1))/2;}
function converttocode(num,d)
{return num*8+d;}
function rotatex(x,y,bside)
{return-(x+y);}
function rotatey(x,y,bside)
{return x-(bside-1);}
function reflectx(x,y)
{return-(x+y);}
function getpos(v)
{return v>>3;}
function getdir(v)
{return v&7;}
function reflectedpeg(num)
{var x=getx(num);var y=gety(num);return getpegnumber(reflectx(x,y),y);}
function reflecteddir(d)
{if(d>3)return 9-d;return 3-d;}
function rotatedpeg(num,r,bside)
{if(r%3==0)return num;var x=getx(num);var y=gety(num);var x1;var x2;for(ii=0;ii<r;ii++){x1=rotatex(x,y,bside);y1=rotatey(x,y,bside);x=x1;y=y1;}
return getpegnumber(x,y);}
function rotateddir(d,r)
{return(d+2*r)%6;}
function getdemonumber(num,bside)
{SolNo=-1;rotBoard=0;refBoard=0;if(num<0)return SolNo;var xt=new Array(6);var yt=new Array(6);xt[0]=getx(num);yt[0]=gety(num);for(j=1;j<3;j++){xt[j]=rotatex(xt[j-1],yt[j-1],bside);yt[j]=rotatey(xt[j-1],yt[j-1],bside);}
for(j=0;j<3;j++){xt[j+3]=reflectx(xt[j],yt[j]);yt[j+3]=yt[j];}
for(i=0;i<nbProblems;i++){for(j=0;j<6;j++){if(Problem[i][0]==bside&&Problem[i][1]==xt[j]&&Problem[i][2]==yt[j]){if(SolNo<0||refBoard>0||j==0){SolNo=i;rotBoard=j%3;if(j<3)refBoard=0;else refBoard=1;}}}}
rotBoard=(3-rotBoard)%3;return SolNo;}
function alerting(mess)
{document.messageform.alertbox.value=mess;}
function setdelay()
{if(demoSpeed==0)return 2000;if(demoSpeed==2)return 500;if(demoSpeed==3)return 100;if(demoSpeed==4)return 0;return 1000;}
function displayCount()
{var str="move "+realCount;document.statusform.countmoves.value=str;var cnt=0;for(i=0;i<boardSize;++i)
if(pos[i]&2)++cnt;str=cnt+" peg";if(cnt>1)str+="s";document.statusform.countpeg.value=str;}
function removeselection()
{selectnum=0;for(i=0;i<MAXbs;++i)
pos[i]&=~1;}
function display()
{displayCount();for(i=0;i<boardSize;i++)
{if(oldpos[i]!=pos[i]){oldpos[i]=pos[i];peg[i].src=locimages[pos[i]].src;}}}
function move(num)
{var i;if(vacnum<0){pos[num]="0";vacnum=num;newGame();if((boardSide-1)%3==0){if((getx(num)-gety(num))%3==0){var str="This board position is NOT solvable to one peg.";alerting(str);}}}
stopsolve();if(selectnum){for(i=0;i<6;++i){if(getpegdir(basenum,2,i)==num&&(selectnum&(1<<i)))movePeg(basenum,i);}
if(num==basenum)removeselection();else if(selectnum)alerting("Select a destination or click on the original peg again!");}
else if(pos[num]&2){selectnum=ispossiblemove(num);for(i=0;i<6;++i){if(selectnum==(1<<i)){movePeg(num,i);}}
if(selectnum){basenum=num;pos[num]|=3;for(i=0;i<6;++i){if(selectnum&(1<<i))pos[getpegdir(basenum,2,i)]|=1;}}}
display();win();return false;}
function movePeg(num,dir)
{var i;var tohole=getpegdir(num,2,dir);var overhole=getpegdir(num,1,dir);pos[tohole]=(pos[tohole]|2)&~1;pos[overhole]&=~3;pos[num]&=~3;histo[numMoves]=converttocode(num,dir);if(numMoves>0){tohole=getpos(histo[numMoves-1]);tohole=getpegdir(tohole,2,getdir(histo[numMoves-1]));if(num!=tohole)++realCount;}
else++realCount;++numMoves;removeselection();}
function back()
{stopsolve();if(vacnum<0)alert("Click on a starting location to set it.");if(!numMoves)return;finished=0;--numMoves;var num=getpos(histo[numMoves]);var dir=histo[numMoves]&7;pos[getpegdir(num,2,dir)]&=~3;pos[getpegdir(num,1,dir)]=(pos[getpegdir(num,1,dir)]|2)&~1;pos[num]=(pos[num]|2)&~1;if(numMoves>0){tohole=getpos(histo[numMoves-1]);tohole=getpegdir(tohole,2,getdir(histo[numMoves-1]));if(num!=tohole)--realCount;}
else--realCount;alerting("");removeselection();display();}
function win()
{var i;if(finished)return;finished=1;var cnt=0;for(i=0;i<boardSize;i++){if(pos[i]&2){cnt++;if(ispossiblemove(i)){finished=0;return;}}}
var str="";if(running==1){alerting("Now, try it yourself!  Click on Restart.");stopsolve();}
else if(cnt==1){str="Congratulations!  You found a solution in "+realCount+" moves.";if(SolNo>=0){if(realCount==Problem[SolNo][6]){str="Excellent!  You found the minimum number of moves!!!";}}
alerting(str);}
else{str="No more jumps are possible!";if(cnt==2)str="Very close!";if(cnt==3)str="Good try!";alerting(str+"  Click on Restart to start over.");}}
function newGame()
{stopsolve();finished=0;var i=0;var d=document.images;boardSize=tno(boardSide);if(boardSize>MAXbs){boardSide=6;boardSize=tno(boardSide);}
for(i=0;i<MAXbs;i++){if(i<boardSize){pos[i]="2";peg[i]=d["img"+i];}
else{pos[i]="8";}
oldpos[i]=-1;}
if(vacnum==-2){for(i=0;i<nbProblems;i++){if(Problem[i][0]==boardSide){vacnum=getpegnumber(Problem[i][1],Problem[i][2]);break;}}}
SolNo=-1;if(vacnum>=0){pos[vacnum]="0";SolNo=getdemonumber(vacnum,boardSide);}
var str="";if(SolNo>=0){str="Shortest solution from this position: "+Problem[SolNo][6]+" Moves";}
else if(vacnum<0){str="Click on a starting location to set it.";}
alerting(str);realCount=0;numMoves=0;document.buttonsform.options.selectedIndex=boardSide-4;running=0;removeselection();display();}
function newstart()
{vacnum=-1;newGame();}
function drawPreview()
{var i;var v=0;var v2=0;if(atmove>0){v=DemoMove[atmove-1];movePeg(getpos(v),getdir(v));if(DemoMove[atmove]<=0){win();stopsolve();return;}}
v=DemoMove[atmove];pos[getpos(v)]|=3;for(i=atmove+1;;i++){v=getpegdir(getpos(v),2,getdir(v));if((pos[v]&2)==0)pos[v]|=1;if(DemoMove[i]<0)break;v2=DemoMove[i];if(v!=getpos(v2))break;v=v2;}
++atmove;display();solveRunning=setTimeout('drawPreview()',demoDelay);}
function stopsolve()
{if(running==1||running==-1){clearTimeout(solveRunning);document.buttonsform.Solve.value="  Solve  ";running=0;removeselection();display();}}
function over(n)
{self.status='';if(!selectnum){if((pos[n]&2)&&ispossiblemove(n)){pos[n]|=1;display();}}
return true;}
function out(n)
{if(!selectnum){if(pos[n]&2){pos[n]&=~1;display();}}
return false;}
function solve()
{var i=0;if(vacnum<0)alert("Click on a starting location to set it.");if(running==1){clearTimeout(solveRunning);document.buttonsform.Solve.value="Continue";running=-1;}
else if(running==-1){document.buttonsform.Solve.value="   Stop   ";running=1;drawPreview();}
else{if((boardSide-1)%3==0){if((getx(vacnum)-gety(vacnum))%3==0){var str="This board position is NOT solvable to one peg.";alert(str);return;}}
SolNo=getdemonumber(vacnum,boardSide);var j=0;var v=0;for(i=7;i<Problem[SolNo].length;i++){v=Problem[SolNo][i];if(v<0){SolNo+=v;if(SolNo<0)break;v=Problem[SolNo][i];}
if(refBoard==1)v=converttocode(reflectedpeg(getpos(v)),reflecteddir(getdir(v)));DemoMove[j]=converttocode(rotatedpeg(getpos(v),rotBoard,boardSide),rotateddir(getdir(v),rotBoard));j++;}
DemoMove[j]=-1;atmove=0;newGame();document.buttonsform.Solve.value="   Stop   ";running=1;drawPreview();}}
function changeBoard()
{stopsolve();var newboardSide=document.buttonsform.options.selectedIndex+4;var boardCode=newboardSide*16+demoSpeed*2;window.location.href=urlQuery[0]+"?"+boardCode;}
function changeSpeed()
{demoSpeed=document.buttonsform.demospeed.selectedIndex;demoDelay=setdelay();}
function help()
{if(iOpened&&!iWindow.closed){iWindow.focus();return;}
iWindow=window.open("trianginstlite.html","Instructions");iOpened=true;return;}
window.onload=newGame;