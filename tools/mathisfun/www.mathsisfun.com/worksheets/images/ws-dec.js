let w,h,game,my={};function init(){my.version='0.93';w=190;h=270;game={};my.ansQ=false;my.clrs=['#000000','#330099','#ff9900','#cece88','#ccff33','#993399','#ff0000','#00ff00','#0000ff','#00ffff','#ffff00','#ff00ff','#006600'];my.txtclrs=['#330099','#ff9900','#cc3366','#ccff33','#993399','#00ffff','#00ff00','#0000ff','#00ffff','#000000','#ff00ff','#006600','#ffff00'];let s='';s+='<div id="main" style="position:relative; width:'+w+'mm; border: none; margin:auto; display:block;  ">';s+='<header>'
s+=wrap({cls:"noprint control",style:" margin: 0 0 30px 0; text-align:center; height:32px; "},wrap({tag:'btn',fn:'location.href='+"'../worksheets/index.php'"+';'},'Math Worksheets'),wrap({id:"ansBtn",tag:'btn',cls:"btn lo",fn:'toggleAns()'},'Answers'),' &nbsp;  ',wrap({id:"seed",tag:'inp',style:'width:65px;',lbl:'Num:'}),wrap({tag:'btn',fn:'seedRand()'},'Try Another'),' &nbsp;  ','<a href="javascript:window.print()"><img src="../images/style/printer.png" alt="print this page" style="vertical-align:top;" />Print!</a>')
s+=wrap({style:"padding: 0 0 30px 0;"},'<div style="float:left; margin: 0 10px 5px 0;">Name:__________________</div>','<div style="float:right; margin: 0 0 5px 10px;">Date:__________________</div>','<div style="text-align:center;"><b>Math is Fun Worksheet</b><br /><i>from mathsisfun.com</i></div>')
s+='</header>'
s+=wrap({id:"ws",style:"text-align: center;"})
s+=wrap({id:"result",style:"text-align: center; font: 30px Verdana;  z-index:100;"})
s+='</div>';docInsert(s);let seed=getQueryVariable('seed');if(seed){seedSet(seed);}else{seedSet(1000);}
console.log("seed",seed,my.seedStt);game.op=getQueryVariable('op');switch(game.op){case 'add':game.symbol="+";break;case 'sub':game.symbol="&minus;";break;case 'mult':game.symbol="&times;";break;case 'div':game.symbol="&divide;";break;default:game.symbol="?";}
game.n=Math.min(100,getQueryDef('n',10));game.amin=getQueryDef('amin',1);game.amax=getQueryDef('amax',10);game.bmin=getQueryDef('bmin',1);game.bmax=getQueryDef('bmax',10);game.dec=getQueryDef('dec',0);game.carry=getQueryVariable('carry');if(game.carry){game.carry=game.carry.toLowerCase();}else{game.carry='?';}
game.negAnsQ=getQueryVariable('negans')!='n';game.olQ=getQueryVariable('ol')=='y';game.swapQ=getQueryVariable('swap')=='y';console.log("game",game);doWS();}
function getQueryDef(name,def){let a=getQueryVariable(name);if(a){return parseInt(a);}
return def;}
function seedSet(n){my.seedStt=parseInt(n);if(my.seedStt<=0)my.seedStt=1;document.getElementById('seed').value=my.seedStt;}
function seedChg(){my.seedStt=(document.getElementById('seed').value)<<0;seedSet(my.seedStt);doWS();}
function seedRand(){seedSet(Math.floor(Math.random()*9999)+1);doWS();}
function doWS(){document.getElementById('result').innerHTML="";my.seed=my.seedStt;let dones=[];my.anss=[];my.tabs=[];let s='';for(let i=0;i<game.n;i++){s+='<div style="text-align: center;	display: inline-block;	vertical-align:bottom;	margin: 0 2% 6% 2%;	width: 20%;  font: 19px Verdana; ">';let tries=0;let okQ,id,a,b,c,dec,dec1,dec2;do{a=getRandomInt(game.amin,game.amax);b=getRandomInt(game.bmin,game.bmax);c=0;let decAns=game.dec;if(game.dec>0){if(game.op=="mult"||game.op=="div"){dec1=getRandomInt(0,game.dec);dec2=game.dec-dec1;decAns=game.dec*2;}else{dec1=getRandomInt(0,game.dec-a.toString().length+1);dec2=getRandomInt(0,game.dec-b.toString().length+1);}
if(dec1>0)a*=Math.pow(10,dec1);if(dec2>0)b*=Math.pow(10,dec2);}
if(game.swapQ){if(Math.random()<0.5){let t=a;a=b;b=t;}}
switch(game.op){case 'add':c=a+b;break;case 'sub':c=a-b;break;case 'mult':c=a*b/Math.pow(10,dec1+dec2);break;case 'div':c=b;b=a;a=b*c/Math.pow(10,dec1+dec2);break;default:}
id=a+','+b;okQ=true;switch(game.carry){case 'y':if(game.op=="add"&&!isCarryNeeded(a,b,true))okQ=false;if(game.op=="sub"&&!isCarryNeeded(a,b,false))okQ=false;console.log("game.carry",game.carry,okQ);break;case 'n':if(game.op=="add"&&isCarryNeeded(a,b,true))okQ=false;if(game.op=="sub"&&isCarryNeeded(a,b,false))okQ=false;break;default:}
if(!game.negAnsQ){if(c<0)okQ=false;}
if(dones.indexOf(id)>=0)okQ=false;if(tries>10){while(dones.length>5){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);s+='<div style="font: italic 10px Verdana; text-align:left;">'+(i+1)+':'+'</div>';s+='<div style="text-align:right;">'+fmtDec(a,game.dec)+'</div>';s+='<div style="text-align:right;">'+game.symbol+' '+fmtDec(b,game.dec)+'</div>';let ansHt=50;if(game.olQ){s+='<div id="ansDiv'+i+'" style="text-align:right; border-top: 1px solid black; height:'+ansHt+'px;">';s+='<input type="text" id="ans'+i+'" style="color: #0000ff; background-color: #eeffee; text-align:right; font-size: 18px; width:90%; border-radius: 10px; padding: 0 5%; " value="" onKeyUp="doAns('+i+')" />';s+='</div>';my.anss[i]=c;my.tabs[i]='ans'+i;}else{if(my.ansQ){s+='<div style="text-align:right; border-top: 1px solid black; height:'+ansHt+'px;">'+fmtDec(c,game.dec)+'</div>';}else{s+='<div style="text-align:right; border-top: 1px solid black; height:'+ansHt+'px; ">'+' '+'</div>';}}
s+='</div>';}
document.getElementById('ws').innerHTML=s;}
function doAns(n){let userAns=document.getElementById('ans'+n).value;console.log("doAns",n,my.anss[n],userAns);if(userAns==my.anss[n]){let s='<div style="text-align:right; border-top: 1px solid black; height:40px;">'+my.anss[n]+'</div>';document.getElementById('ansDiv'+n).innerHTML=s;my.tabs.splice(my.tabs.indexOf('ans'+n),1);console.log("YAY",my.tabs);if(my.tabs.length==0){document.getElementById('result').innerHTML="Perfect !";}else{document.getElementById(my.tabs[0]).focus();}}}
function toggleAns(){if(game.olQ)return;my.ansQ=!my.ansQ;toggleBtn("ansBtn",my.ansQ);doWS();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function dist(dx,dy){return(Math.sqrt(dx*dx+dy*dy));}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;let range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function constrain(min,val,max){return(Math.min(Math.max(min,val),max));}
function fmt(num,digits){digits=14;if(num==Number.POSITIVE_INFINITY)
return "undefined";if(num==Number.NEGATIVE_INFINITY)
return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function isCarryNeeded(n1,n2,addQ){let n1str=n1.toString();let n2str=n2.toString();let minlength=Math.min(n1str.length,n2str.length);if(addQ){if(n1str.length==n2str.length){minlength=n1str.length-1;}}
for(let i=1;i<=minlength;i++){if(addQ){if(parseInt(n1str.substr(-i,1))+parseInt(n2str.substr(-i,1))>9){return true;}}else{if(parseInt(n1str.substr(-i,1))-parseInt(n2str.substr(-i,1))<0){return true;}}}
return false;}
function getRandomInt(min,max){return Math.floor(random()*(max-min+1))+min;}
function random(){let x=Math.sin(my.seed++)*10000;return x-Math.floor(x);}
function fmtDec(v,dec){return(v/Math.pow(10,dec)).toFixed(dec);}
function getQueryVariable(variable){let query=window.location.search.substring(1);let vars=query.split("&");for(let i=0;i<vars.length;i++){let pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return false;}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script);}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
switch(tag){case 'btn':if(cls.length==0)cls='btn'
s+='<button onclick="'+fn+'"'
break
case 'can':s+='<canvas'
break
case 'div':s+='<div'
break
case 'inp':if(cls.length==0)cls='input'
if(lbl.length>0){s+='<label class="label">'+lbl}
s+='<input value="'+txt+'"'
if(fn.length>0)s+='  oninput="'+fn+'" onchange="'+fn+'"'
break
case 'rad':if(cls.length==0)cls="radio"
s+='<form';if(fn.length>0)s+=' onclick="'+fn+'"'
break
case 'sel':if(cls.length==0)cls="select"
s+='<select onclick="'+fn+'"'
break
case 'sld':s+='<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"'
break
default:}
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
switch(tag){case 'btn':s+='>'+txt+'</button>'
break
case 'can':s+='></canvas>'
break
case 'div':s+=' >'+txt+'</div>'
break
case 'inp':s+='>'
if(lbl.length>0)s+='</label>'
break
case 'rad':s+='>\n'
for(let i=0;i<opts.length;i++){let chk='';if(i==0)chk='checked';s+='<input type="radio" id="r'+i+'" name="typ" style="cursor:pointer;" value="'+opts[i][0]+'" '+chk+' />\n';s+='<label for="r'+i+'" style="cursor:pointer;">'+opts[i][1]+'</label><br/>\n';}
s+='</form>';break
case 'sel':s+='>\n'
for(let i=0;i<opts.length;i++){let idStr=id+i;let chkStr=i==99?' checked ':'';s+='<option id="'+idStr+'" value="'+opts[i]+'"'+chkStr+'>'+opts[i]+'</option>\n';}
s+='</select>';break
case 'sld':s+='>'
break
default:}
s+='\n'
return s}
init()