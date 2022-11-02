var w,h,ratio,i,s,el,g,div,dragQ,my={};function wskinderMain(){my.version='0.92';var canvasid="canvasid";w=190;h=270;game={};my.ansQ=false;my.picCount=57;my.clrs=['#000000','#330099','#ff9900','#cece88','#ccff33','#993399','#ff0000','#00ff00','#0000ff','#00ffff','#ffff00','#ff00ff','#006600'];my.txtclrs=['#330099','#ff9900','#cc3366','#ccff33','#993399','#00ffff','#00ff00','#0000ff','#00ffff','#000000','#ff00ff','#006600','#ffff00'];s='';s+='<div id="main" style="position:relative; width:'+w+'mm; border: none; margin:auto; display:block;  ">';s+='<div id="toolbar" class="noprint" style=" padding:4px; margin: 0 0 30px 0; text-align:center; font: 14px Verdana; background-color: rgba(0,0,255,0.2); border-radius: 10px; height:32px; ">';s+='<button class="clickbtn" onclick="location.href='+"'../worksheets/index.php'"+';">Math Worksheets</button> ';s+='<button id="ansBtn" onclick="toggleAns()" style="" class="togglebtn lo" >Answers</button> ';s+='<input type="text" id="seed" style="color: #0000ff; background-color: #eeffee; text-align:center; font-size: 17px; width:60px; border-radius: 10px; " value="2" onKeyUp="seedChg()" />';s+='<button class="clickbtn" onclick="seedRand()">Try Another</button> ';s+='   ';s+='<a href="javascript:window.print()"><img src="../images/style/printer.png" alt="print this page" style="vertical-align:top;" />Print!</a>';s+='</div>';s+='<div style="padding: 0 0 30px 0;">';s+='<div style="float:left; margin: 0 10px 5px 0;">Name:____________________</div>';s+='<div style="float:right; margin: 0 0 5px 10px;">Date:____________________</div>';s+='<div style="text-align:center;"><b>Math is Fun Worksheet</b><br /><i>from mathsisfun.com</i></div>';s+='</div>';s+='<div id="ws" style="text-align: center;">';s+='</div>';s+='<div id="result" style="text-align: center; font: 30px Verdana;  z-index:100; ">';s+='</div>';s+='</div>';document.write(s);var seed=getQueryVariable('seed');if(seed){seedSet(seed);}else{seedSet(1000);}
console.log("seed",seed,my.seedStt);game.op=getQueryVariable('op');switch(game.op){case 'add':game.symbol="+";break;case 'sub':game.symbol="&minus;";break;case 'mult':game.symbol="&times;";break;case 'div':game.symbol="&divide;";break;default:game.symbol="?";}
game.n=Math.min(100,getQueryDef('n',10));game.amin=getQueryDef('amin',1);game.amax=getQueryDef('amax',10);game.bmin=getQueryDef('bmin',1);game.bmax=getQueryDef('bmax',10);game.carryQ=getQueryVariable('carry')!='n';game.negAnsQ=getQueryVariable('negans')!='n';game.olQ=getQueryVariable('ol')=='y';game.swapQ=getQueryVariable('swap')=='y';game.bwQ=getQueryVariable('bw')=='y';game.aimgQ=getQueryVariable('aimg')=='y';game.bimgQ=getQueryVariable('bimg')=='y';game.clueQ=getQueryDef('clue','n')=='y';console.log("game",game);doWS();}
function isNumber(n){return!isNaN(parseFloat(n))&&!isNaN(n-0)}
function getQueryDef(name,def){var a=getQueryVariable(name);if(a){if(isNumber(a)){return parseInt(a);}else{return a}}
return def;}
function seedSet(n){my.seedStt=parseInt(n);if(my.seedStt<=0)my.seedStt=1;document.getElementById('seed').value=my.seedStt;}
function seedChg(){my.seedStt=(document.getElementById('seed').value)<<0;seedSet(my.seedStt);doWS();}
function seedRand(){seedSet(Math.floor(Math.random()*9999)+1);doWS();}
function doWS(){document.getElementById('result').innerHTML="";my.seed=my.seedStt;var s='';switch(game.op){case 'add':s=doWSAdd();break;case 'fill':s=doWSFill();break;case 'count':s=doWSCount();break;case 'more':s=doWSMore();break;case 'some':s=doWSSome();break;default:}
document.getElementById('ws').innerHTML=s;}
function doWSCount(){var dones=[];my.anss=[];my.tabs=[];if(game.amax<=15){var imgRows=3;var imgsPerRow=5;}else{imgRows=4;imgsPerRow=15;}
s='';s+='<div style="text-align: center;	vertical-align:middle; font: 30px Verdana;	width: 100%; margin: -12px 0 20px 0; border: 2px inset; border-radius: 15px;  ">';for(i=0;i<Math.min(20,game.amax);i++){s+=(i+1).toString()+' &nbsp; ';}
s+='</div>';for(i=0;i<game.n;i++){s+=qDivStr(i)
var tries=0;do{var a=getRandomInt(game.amin,game.amax);var b=getRandomInt(game.bmin,game.bmax);var c=a;if(game.swapQ){if(Math.random()<0.5){var t=a;a=b;b=t;}}
var picNum=getRandomInt(1,my.picCount);var id=a+','+picNum;var okQ=true;if(dones.indexOf(id)>=0)okQ=false;if(tries>10){while(dones.length>5){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);var ansStr="&nbsp;";if(my.ansQ){ansStr=c.toString();}
if(game.bwQ){var imgdir="images/a/bw/index.html";}else{imgdir="images/a/index.html";}
var img=imgdir+"Img"+leftPad(picNum,3)+".gif";s+='<div style="display: flex; justify-content: center; ">';s+='<div style="display: flex; flex-direction: column; justify-content: center; ">';s+=imgsInABox(img,a,imgRows,imgsPerRow);s+='</div>';s+='<div style="display: flex; flex-direction: column; justify-content: center;  margin: 0 0 0 20px;">';s+='<div style="width:50px; height: 60px; font: 30px Verdana; padding-top:20px; border: 6px groove #ccc;">';s+=ansStr;s+='</div>';s+='</div>';s+='</div>';s+='</div>';s+='</div>';}
return s;}
function doWSFill(){var dones=[];my.anss=[];my.tabs=[];s='';s+='<div style="text-align: center;	vertical-align:middle; font: 30px Verdana;	width: 100%; margin: -12px 0 20px 0; border: 2px inset; border-radius: 15px;  ">';for(i=0;i<Math.min(20,game.amax);i++){s+=(i+1).toString()+' &nbsp; ';}
s+='</div>';for(i=0;i<game.n;i++){s+=qDivStr(i)
var tries=0;do{var a=getRandomInt(game.amin,game.amax-2);var style=getRandomInt(1,4);var c=a;var id=a+','+style;var okQ=true;if(dones.indexOf(id)>=0)okQ=false;if(tries>10){while(dones.length>5){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);var ansStr="&nbsp;";if(my.ansQ){ansStr=c.toString();if(style==4)style=1;}
var probtext="?";var unk="__";if(my.ansQ){probtext=a+", "+(a+1)+", "+(a+2);}else{switch(style){case 1:probtext=a+", "+(a+1)+", "+unk;ans=a+2;break;case 2:probtext=a+", "+unk+", "+(a+2);ans=a+1;break;case 3:probtext=unk+", "+(a+1)+", "+(a+2);ans=a;break;case 4:probtext=unk+", "+(a+1)+", "+unk;break;}}
var clrs=["#FF6633","#000099","#00cc00","#660099","#cc0000","#333366","#cc00cc","#CC3399","#666633"];var clrNum=getRandomInt(0,clrs.length-1);if(game.bwQ){fontClr="#000000";}else{fontClr=clrs[clrNum];}
s+='<div style=" font: 35px Verdana; color:'+fontClr+';">';s+=probtext;s+='</div>';console.log("s",s);s+='</div>';s+='</div>';}
return s;}
function doWSAdd(){document.getElementById('result').innerHTML="";my.seed=my.seedStt;var dones=[];my.anss=[];my.tabs=[];if(game.amax+game.bmax<=10){var imgRows=2;var imgsPerRow=5;}else{imgRows=3;imgsPerRow=15;}
s='';s+='<div style="text-align: center;	vertical-align:middle; font: 26px Verdana;	width: 100%; margin: -12px 0 20px 0; border: 2px inset; border-radius: 15px;  ">';for(i=0;i<Math.min(20,game.amax+game.bmax);i++){s+=(i+1).toString()+' &nbsp; ';}
s+='</div>';for(var i=0;i<game.n;i++){s+=qDivStr(i)
var tries=0;do{var a=getRandomInt(game.amin,game.amax);var b=getRandomInt(game.bmin,game.bmax);var c=0;if(game.swapQ){if(Math.random()<0.5){var t=a;a=b;b=t;}}
var picNum=getRandomInt(1,my.picCount);if(game.bwQ){var imgdir="images/a/bw/index.html";}else{imgdir="images/a/index.html";}
var img=imgdir+"Img"+leftPad(picNum,3)+".gif";switch(game.op){case 'add':c=a+b;break;case 'sub':c=a-b;break;case 'mult':c=a*b;break;case 'div':c=b;b=a;a=b*c;break;default:}
var id=a+','+b;var okQ=true;if(!game.carryQ){if(game.op=="add"&&isCarryNeeded(a,b,true))okQ=false;if(game.op=="sub"&&isCarryNeeded(a,b,false))okQ=false;}
if(!game.negAnsQ){if(c<0)okQ=false;}
if(dones.indexOf(id)>=0)okQ=false;if(tries>10){while(dones.length>5){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);var styl='display:flex; flex-direction: column; justify-content: center; border: none; font: 30px Arial;';s+='<div style="'+styl+'">'+a+'<br>';if(game.aimgQ)
s+=imgsInABox(img,a,imgRows,imgsPerRow);s+='</div>';s+='<div style="'+styl+' margin:12px; ">'+game.symbol+'</div>';s+='<div style="'+styl+'">';s+='<div>'+b+'</div>';if(game.bimgQ)
s+=imgsInABox(img,b,imgRows,imgsPerRow);s+='</div>';s+='<div style="'+styl+' margin:12px; ">'+'='+'</div>';if(game.olQ){}else{s+='<div style="display:flex;flex-direction: column;justify-content: center;  ">';s+='<div style=" width:50px; height: 60px; font: 30px Verdana; padding-top:20px; border: 6px groove #ccc;">';if(my.ansQ){s+=c;}else{s+='&nbsp;';}
s+='</div>';s+='</div>';}
s+='</div>';s+='</div>';}
return s;}
function doWSMore(){game.instr='Circle the group that has More'
var dones=[];my.anss=[];my.tabs=[];var imgRows=1;var imgsPerRow=9;s='';s+='<div style="text-align: center;	vertical-align:middle; font: 30px Verdana;	width: 100%; margin: -12px 0 20px 0; border: 2px inset; border-radius: 15px;  ">';for(i=0;i<Math.min(20,game.amax);i++){s+=(i+1).toString()+' &nbsp; ';}
s+='</div>';s+='<div style="text-align: center;	 font: 25px Verdana;	width: 100%; margin: 0 0 30px 0;   ">';s+=game.instr
s+='</div>';game.swapQ=true
for(i=0;i<game.n;i++){s+=qDivStr(i)
var a,b,aPicNum,bPicNum,okQ,id
var tries=0;do{a=getRandomInt(game.amin,game.amax);b=getRandomInt(game.amin,game.amax);if(game.swapQ){if(random()<0.5){var t=a;a=b;b=t;}}
aPicNum=getRandomInt(1,my.picCount);bPicNum=getRandomInt(1,my.picCount);okQ=true;if(a==b)okQ=false
if(aPicNum==bPicNum)okQ=false
id=a+','+b;if(dones.indexOf(id)>=0)okQ=false;if(tries>20){while(dones.length>10){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);var imgdir=game.bwQ?"images/a/bw/":"images/a/"
var aImg=imgdir+"Img"+leftPad(aPicNum,3)+".gif";var bImg=imgdir+"Img"+leftPad(bPicNum,3)+".gif";var css='padding:10px; border-radius:30px; justify-content: center;'
var loBorder='border: 2px solid transparent;'
var hiBorder='border: 2px solid black;'
s+='<div style=" justify-content: center; ">';var border=loBorder
if(a>b&&my.ansQ)border=hiBorder
s+='<div style="'+css+border+'">';s+=imgsInABox(aImg,a,imgRows,imgsPerRow);s+='</div>';var border=loBorder
if(a<b&&my.ansQ)border=hiBorder
s+='<div style="'+css+border+'">';s+=imgsInABox(bImg,b,imgRows,imgsPerRow);s+='</div>';s+='</div>';s+='</div>';s+='</div>';}
return s;}
function doWSSome(){var dones=[];my.anss=[];my.tabs=[];var imgRows=1;var imgsPerRow=9;s='';s+='<div style="text-align: center;	vertical-align:middle; font: 30px Verdana;	width: 100%; margin: -12px 0 20px 0; border: 2px inset; border-radius: 15px;  ">';for(i=0;i<Math.min(20,game.amax);i++){s+=(i+1).toString()+' &nbsp; ';}
s+='</div>';for(i=0;i<game.n;i++){s+=qDivStr(i)
var a,b,picNum,okQ,id
var tries=0;do{a=getRandomInt(game.amin,game.amax);numtocolor=getRandomInt(1,a-1);my.picCount=30
picNum=getRandomInt(1,my.picCount);styleNum=getRandomInt(1,3);okQ=true;if(styleNum==2){if(a%2==numtocolor%2){}else{if(numtocolor>1){numtocolor-=1;}else{if(numtocolor<a-1){numtocolor+=1;}else{okQ=false}}}}
var styles=['First','Middle','Last']
var instr='Color in the <b>'+styles[styleNum-1]+' '+((numtocolor==1)?'</b> image':numtocolor+' </b> images')+':'
id=a+','+numtocolor+','+styleNum
if(dones.indexOf(id)>=0)okQ=false;if(tries>20){while(dones.length>10){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);var imgdir="images/fill/index.html";var img=imgdir+"Img"+leftPad(picNum,3)+".gif";if(!my.ansQ){ansimg=img;}else{if(game.bwQ){ansimg=imgdir+"bw/"+"Img"+leftPad(picNum,3)+".gif";}else{ansimg=imgdir+"col/"+"Img"+leftPad(picNum,3)+".gif";}
img=imgdir+"Img"+leftPad(picNum,3)+".gif";}
var loBorder='border: 2px solid transparent;'
var hiBorder='border: 2px solid black;'
s+='<div style=" justify-content: center; ">';s+='<div style="font: 16px Arial; margin-bottom:12px;">';s+=instr
s+='</div>';var css=''
if(game.clueQ)css='padding:5px;'
switch(styleNum){case 1:s+='<div style="display:inline-block;'+css+'">';s+=imgsInABox(ansimg,numtocolor,1,10);s+='</div>';s+='<div style="display:inline-block;'+css+'">';s+=imgsInABox(img,a-numtocolor,1,10);s+="</div>";break;case 2:s+='<div style="display:inline-block;'+css+'">';s+=imgsInABox(img,(a-numtocolor)/2,1,10);s+='</div>';s+='<div style="display:inline-block;'+css+'">';s+=imgsInABox(ansimg,numtocolor,1,10,"");s+='</div>';s+='<div style="display:inline-block;'+css+'">';s+=imgsInABox(img,(a-numtocolor)/2,1,10);s+='</div>';break;case 3:s+='<div style="display:inline-block;'+css+'">';s+=imgsInABox(img,a-numtocolor,1,10);s+='</div>';s+='<div style="display:inline-block;'+css+'">';s+=imgsInABox(ansimg,numtocolor,1,10);s+='</div>';break;default:break;}
s+='</div>';s+='</div>';s+='</div>';}
return s;}
function doAns(n){var userAns=document.getElementById('ans'+n).value;console.log("doAns",n,my.anss[n],userAns);if(userAns==my.anss[n]){s='<div style="text-align:right; border-top: 1px solid black; height:40px;">'+my.anss[n]+'</div>';document.getElementById('ansDiv'+n).innerHTML=s;my.tabs.splice(my.tabs.indexOf('ans'+n),1);console.log("YAY",my.tabs);if(my.tabs.length==0){document.getElementById('result').innerHTML="Perfect !";}else{document.getElementById(my.tabs[0]).focus();}}}
function toggleAns(){if(game.olQ)return;my.ansQ=!my.ansQ;toggleBtn("ansBtn",my.ansQ);doWS();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function constrain(min,val,max){return(Math.min(Math.max(min,val),max));}
function fmt(num,digits){digits=14;if(num==Number.POSITIVE_INFINITY)
return "undefined";if(num==Number.NEGATIVE_INFINITY)
return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function getRandomInt(min,max){return Math.floor(random()*(max-min+1))+min;}
function random(){var x=Math.sin(my.seed++)*10000;return x-Math.floor(x);}
function getQueryVariable(variable){var query=window.location.search.substring(1);var vars=query.split("&");for(var i=0;i<vars.length;i++){var pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return false;}
function leftPad(num,places){var zero=places-num.toString().length+1;return Array(+(zero>0&&zero)).join("0")+num;}
function qDivStr(i){var s=''
s+='<div style="text-align: center;	display: inline-block;	vertical-align:middle;	margin: 0 20px 30px 20px;">';s+='<div style="display: flex; align-items: center; border: 1px dotted rgb(80,220,250);  padding:16px; border-radius: 20px; margin-bottom:10px; ">';return s}
function imgsInABox(img,imgN,imgRows,imgsPerRow){var s='';var imagerow=1;var rowimages=[];while(imagerow<=imgRows){rowimages[imagerow]=0;imagerow+=1;}
if(imgN>imgRows*imgsPerRow)imgN=imgRows*imgsPerRow;var n=1;while(n<=imgN){var chosenrow=getRandomInt(1,imgRows);if(rowimages[chosenrow]<imgsPerRow){rowimages[chosenrow]+=1;n+=1;}else{}}
imagerow=1;while(imagerow<=imgRows){s+='<div style=" line-height:0;">';n=1;while(n<=rowimages[imagerow]){s+='<img src="'+img+'" style="width:42px;" />';n+=1;}
s+="</div>";imagerow+=1;}
return s;}