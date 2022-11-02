let w,h,my={},ws={};function init(){my.version='0.94';w=190;h=270;my.ansQ=false;my.clrs=['#000000','#330099','#ff9900','#cece88','#ccff33','#993399','#ff0000','#00ff00','#0000ff','#00ffff','#ffff00','#ff00ff','#006600'];my.txtclrs=['#330099','#ff9900','#cc3366','#ccff33','#993399','#00ffff','#00ff00','#0000ff','#00ffff','#000000','#ff00ff','#006600','#ffff00'];let s='';s+='<div id="main" style="position:relative; width:'+w+'mm; border: none; margin:auto; display:block;  ">';s+='<header>'
s+=wrap({cls:"noprint control",style:" margin: 0 0 30px 0; text-align:center; height:32px; "},wrap({tag:'btn',fn:'location.href='+"'../worksheets/index.php'"+';'},'Math Worksheets'),wrap({id:"ansBtn",tag:'btn',cls:"btn lo",fn:'toggleAns()'},'Answers'),' &nbsp;  ',wrap({id:"seed",tag:'inp',style:'width:65px;',lbl:'Num:'}),wrap({tag:'btn',fn:'seedRand()'},'Try Another'),' &nbsp;  ','<a href="javascript:window.print()"><img src="../images/style/printer.png" alt="print this page" style="vertical-align:top;" />Print!</a>')
s+=wrap({style:"padding: 0 0 30px 0;"},'<div style="float:left; margin: 0 10px 5px 0;">Name:__________________</div>','<div style="float:right; margin: 0 0 5px 10px;">Date:__________________</div>','<div style="text-align:center;"><b>Math is Fun Worksheet</b><br /><i>from mathsisfun.com</i></div>')
s+='</header>'
s+=wrap({id:"ws",style:"text-align: center;"})
s+=wrap({id:"result",style:"text-align: center; font: 30px Verdana;  z-index:100;"})
s+='</div>';docInsert(s);let seed=getQueryVariable('seed');if(seed){seedSet(seed);}else{seedSet(1000);}
console.log("seed",seed,my.seedStt);ws.op=getQueryVariable('op');switch(ws.op){case 'add':ws.symbol="+";break;case 'sub':ws.symbol="&minus;";break;case 'mult':ws.symbol="&times;";break;case 'div':ws.symbol="&divide;";break;default:ws.symbol="?";}
ws.n=Math.min(100,getQueryDef('n',10));ws.amin=getQueryDef('amin',1);ws.amax=getQueryDef('amax',10);ws.bmin=getQueryDef('bmin',1);ws.bmax=getQueryDef('bmax',10);ws.carryQ=getQueryVariable('carry')!='n';ws.negAnsQ=getQueryVariable('negans')!='n';ws.olQ=getQueryVariable('ol')=='y';ws.swapQ=getQueryVariable('swap')=='y';ws.remQ=getQueryVariable('rem')=='y';console.log("ws",ws);doWS();}
function getQueryDef(name,def){let a=getQueryVariable(name);if(a){return parseInt(a);}
return def;}
function seedSet(n){my.seedStt=parseInt(n);if(my.seedStt<=0)my.seedStt=1;document.getElementById('seed').value=my.seedStt;}
function seedChg(){my.seedStt=(document.getElementById('seed').value)<<0;seedSet(my.seedStt);doWS();}
function seedRand(){seedSet(Math.floor(Math.random()*9999)+1);doWS();}
function doWS(){document.getElementById('result').innerHTML="";my.seed=my.seedStt;let dones=[];my.anss=[];my.tabs=[];let s='';for(let i=0;i<ws.n;i++){s+='<div style="text-align: left;	display: inline-block;	vertical-align:top;	margin: 0 0 4% 0;	width: 33%; font: 24px Courier; ">';let a,b,c,id,okQ
let tries=0;do{a=rpRandomInt(ws.amin,ws.amax);b=rpRandomInt(ws.bmin,ws.bmax);c=0;if(ws.swapQ){if(Math.random()<0.5){let t=a;a=b;b=t;}}
switch(ws.op){case 'add':c=a+b;break;case 'sub':c=a-b;break;case 'mult':c=a*b;break;case 'div':c=b;b=a;a=b*c;break;default:}
id=a+','+b;okQ=true;if(!ws.negAnsQ){if(c<0)okQ=false;}
if(dones.indexOf(id)>=0)okQ=false;if(tries>20){while(dones.length>10){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);s+='<div style="font: italic 10px Verdana; text-align:left;">'+(i+1)+':'+'</div>';s+=longMultFmt(a,b,!my.ansQ,"us");s+='</div>';}
document.getElementById('ws').innerHTML=s;}
function toggleAns(){if(ws.olQ)return;my.ansQ=!my.ansQ;toggleBtn("ansBtn",my.ansQ);doWS();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function longMultFmt(num1,num2,blankQ){let s="";let answer=num1*num2;let num1Len=num1.toString().length
let num2Len=num2.toString().length
let ansLen=answer.toString().length
s+='<div class="largemono">';let probcol=num2Len+2;if(probcol<ansLen)probcol=ansLen
s+=str_repeat("&nbsp;",(probcol-num1Len))+num1+'<br />';s+=str_repeat("&nbsp;",(probcol-num2Len-2))+'&times '
s+='<span style="border-bottom: 1px solid black;">'
s+=num2
s+='</span>'
s+='<br />';let digits=num2Len
let digit=1;while(digit<=digits){let currdigit=num2.toString().substr(digits-digit,1);let currans=currdigit*num1;let curranslength=currans.toString().length
if(blankQ)currans=str_repeat("&nbsp;",curranslength);if(digit<digits){s+=str_repeat("&nbsp;",(probcol-curranslength-digit+1))+currans+'<br />';}else{s+=str_repeat("&nbsp;",(probcol-curranslength-digit+1))
s+='<span style="border-bottom: 1px solid black">'
s+=currans;s+=str_repeat("&nbsp;",(digits-1))
s+='</span>'
s+='<br />';}
digit+=1;}
let anslength=answer.toString().length
if(blankQ)answer=str_repeat("&nbsp;",anslength);s+=str_repeat("&nbsp;",(probcol-anslength))+answer;s+='</div>';return(s);}
function str_repeat(s,len){return s.repeat(len)}
function rpRandomInt(min,max){return Math.floor(random()*(max-min+1))+min;}
function random(){let x=Math.sin(my.seed++)*10000;return x-Math.floor(x);}
function getQueryVariable(variable){let query=window.location.search.substring(1);let vars=query.split("&");for(let i=0;i<vars.length;i++){let pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return false;}
String.prototype.repeat=function(num){return new Array(num+1).join(this);};function docInsert(s){let div=document.createElement('div')
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