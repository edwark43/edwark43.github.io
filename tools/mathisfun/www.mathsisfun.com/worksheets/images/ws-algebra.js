let w,h,my={},game={};function init(){my.version='0.5';w=190;h=270;my.ansQ=false;my.clrs=['#000000','#330099','#ff9900','#cece88','#ccff33','#993399','#ff0000','#00ff00','#0000ff','#00ffff','#ffff00','#ff00ff','#006600'];my.txtclrs=['#330099','#ff9900','#cc3366','#ccff33','#993399','#00ffff','#00ff00','#0000ff','#00ffff','#000000','#ff00ff','#006600','#ffff00'];let s='';s+='<div id="main" style="position:relative; width:'+w+'mm; border: none; margin:auto; display:block;  ">';s+='<header>'
s+=wrap({cls:"noprint control",style:" margin: 0 0 30px 0; text-align:center; height:32px; "},wrap({tag:'btn',fn:'location.href='+"'../worksheets/index.php'"+';'},'Math Worksheets'),wrap({id:"ansBtn",tag:'btn',cls:"btn lo",fn:'toggleAns()'},'Answers'),' &nbsp;  ',wrap({id:"seed",tag:'inp',style:'width:65px;',lbl:'Num:'}),wrap({tag:'btn',fn:'seedRand()'},'Try Another'),' &nbsp;  ','<a href="javascript:window.print()"><img src="../images/style/printer.png" alt="print this page" style="vertical-align:top;" />Print!</a>')
s+=wrap({style:"padding: 0 0 30px 0;"},'<div style="float:left; margin: 0 10px 5px 0;">Name:__________________</div>','<div style="float:right; margin: 0 0 5px 10px;">Date:__________________</div>','<div style="text-align:center;"><b>Math is Fun Worksheet</b><br /><i>from mathsisfun.com</i></div>')
s+='</header>'
s+=wrap({id:"ws",style:"text-align: center;"})
s+=wrap({id:"result",style:"text-align: center; font: 30px Verdana;  z-index:100;"})
s+='</div>';docInsert(s);let seed=getQueryVariable('seed');if(seed){seedSet(seed);}else{seedSet(1000);}
console.log("seed",seed,my.seedStt);game.n=Math.min(Math.max(1,getQueryDef('n',10)),100)
game.amin=Math.min(Math.max(1,getQueryDef('amin',1)),1000)
game.amax=Math.min(Math.max(1,getQueryDef('amax',10)),1000)
game.dec=Math.min(Math.max(-2,getQueryDef('dec',0)),2)
game.stepN=Math.min(Math.max(1,getQueryDef('steps',2)),3)
game.ops=getQueryVariable('ops')
if(!game.ops)game.ops='axm'
console.log("game",game);doWS();}
function getQueryDef(name,def){let a=getQueryVariable(name);if(a){return parseInt(a);}
return def;}
function seedSet(n){my.seedStt=parseInt(n);if(my.seedStt<=0)my.seedStt=1;document.getElementById('seed').value=my.seedStt;}
function seedChg(){my.seedStt=(document.getElementById('seed').value)<<0;seedSet(my.seedStt);doWS();}
function seedRand(){seedSet(Math.floor(Math.random()*9999)+1);doWS();}
function doWS(){document.getElementById('result').innerHTML="";my.seed=my.seedStt;let dones=[];my.anss=[];my.tabs=[];let baseOps=[]
if(game.ops.indexOf('a')>=0)baseOps.push('add')
if(game.ops.indexOf('m')>=0)baseOps.push('mult')
if(game.ops.indexOf('x')>=0)baseOps.push('addx')
if(game.ops.indexOf('b')>=0)baseOps.push('brack')
console.log('baseOps',baseOps)
let s='';for(let i=0;i<game.n;i++){s+='<div style="text-align: center;	display: inline-block;	vertical-align:bottom;	margin: 0 1.8% 6% 1.8%;	width: 45%;  font: 19px Verdana; ">';let id="";let tries=0;let okQ=true;let qStr=''
let ansStr=''
do{okQ=true
let ops=baseOps.slice()
let ltrs=['u','v','w','x','x','x','x','x','y','z'];let ltr=ltrs[Math.floor(random()*ltrs.length)];let ans=getRandomInt(game.amin,game.amax)/Math.pow(10,game.dec)
let lhs=new Expr(0,1,ltr)
let rhs=new Expr(ans,0,ltr)
let swapSidesQ=(random()>0.5)
if(swapSidesQ){}
let solns=[]
solns.push(ltr+" = "+ans);let comments=[]
let fails=0;let step=0;while(step<game.stepN&&fails<100){let opNum=Math.floor(random()*ops.length)
let op=ops.splice(opNum,1)[0];let val=getRandomInt(game.amin,game.amax)/Math.pow(10,game.dec)
let undo=''
switch(op){case "add":if(random()>0.5){lhs.a+=val;rhs.a+=val;undo="Subtract "+val+" from both sides";}else{lhs.a-=val;rhs.a-=val;undo="Add "+val+" to both sides";}
break;case "addx":if(random()>0.5){lhs.x+=val;rhs.x+=val;undo="Subtract "+val+ltr+" from both sides";}else{lhs.x-=val;rhs.x-=val;undo="Add "+val+ltr+" to both sides";}
break;case "mult":if(val==1){fails+=1;continue;}
lhs.a*=val
lhs.x*=val
rhs.a*=val
rhs.x*=val
undo="Divide both sides by "+val;break;case "brack":if(val==1){fails+=1;continue;}
undo="Divide both sides by "+val+" and remove brackets";break;default:break;}
solns.unshift(lhs.fmt()+' = '+rhs.fmt())
comments.unshift(undo)
step++}
comments.unshift('Start with')
ansStr=''
for(let i=1;i<solns.length;i++){ansStr+=comments[i]
ansStr+=': &nbsp; '
ansStr+='<b>'
ansStr+=solns[i]
ansStr+='</b>'
ansStr+='<br>'}
qStr=solns[0]
id=solns[0]
if(dones.indexOf(id)>=0)okQ=false;if(tries>10){while(dones.length>5){dones.shift();}}}while(!okQ&&tries++<100);dones.push(id);s+='<div style="font: italic 10px Verdana; text-align:left;">'+(i+1)+':'+'</div>';s+=qStr;let ansHt=game.stepN*25
console.log("ansHt=",ansHt);if(my.ansQ){s+='<div style="text-align:center; border-top: 1px solid black; font:16px Arial; height:'+ansHt+'px;">'+ansStr+'</div>';}else{s+='<div style="text-align:right; height:'+ansHt+'px; ">'+' '+'</div>';}
s+='</div>';}
document.getElementById('ws').innerHTML=s;}
function toggleAns(){if(game.olQ)return;my.ansQ=!my.ansQ;toggleBtn("ansBtn",my.ansQ);doWS();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
class Expr{constructor(a,x,ltr){this.a=a
this.x=x
this.ltr=ltr}
fmt(){return algebraPhrase(this)}}
function algebraPhrase(expr){let s="";let terms=[{k:'x',v:expr.x},{k:'a',v:expr.a}]
terms.map(term=>{let k=term.k
let v=term.v
if(v!=0){if(v<0){if(s.length>0){s+=" &minus; ";}else{s+=" &minus;";}
v=-v;}else{if(s.length>0)s+=" + ";}
switch(k){case 'a':s+=fmt(v);break;case "x":if(v!=1)s+=fmt(v);s+=expr.ltr;break;default:if(v!=1)s+=v;s+="("+k+")";break;}}})
if(s.length==0)s='0';return s;}
function fmt(num,digits){digits=12;if(num==Number.POSITIVE_INFINITY)
return "undefined";if(num==Number.NEGATIVE_INFINITY)
return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function getRandomInt(min,max){return Math.floor(random()*(max-min+1))+min;}
function random(){let x=Math.sin(my.seed++)*10000;return x-Math.floor(x);}
function fmtDec(v,dec){return(v/100).toFixed(dec);}
function getQueryVariable(variable){let query=window.location.search.substring(1);let vars=query.split("&");for(let i=0;i<vars.length;i++){let pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return false;}
String.prototype.replaceAll=function(search,replacement){let target=this;return target.split(search).join(replacement);};function docInsert(s){let div=document.createElement('div')
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