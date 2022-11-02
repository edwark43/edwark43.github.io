let w,h,my={}
function init(){my.version='0.93'
w=190
h=270
my.game={}
my.ansQ=false
my.clrs=['#000000','#330099','#ff9900','#cece88','#ccff33','#993399','#ff0000','#00ff00','#0000ff','#00ffff','#ffff00','#ff00ff','#006600']
my.txtclrs=['#330099','#ff9900','#cc3366','#ccff33','#993399','#00ffff','#00ff00','#0000ff','#00ffff','#000000','#ff00ff','#006600','#ffff00']
let s=''
s+='<div id="main" style="position:relative; width:'+w+'mm; border: none; margin:auto; display:block;  ">'
s+='<header>'
s+=wrap({cls:'noprint control',style:' margin: 0 0 30px 0; text-align:center; height:32px; '},wrap({tag:'btn',fn:'location.href='+"'../worksheets/index.php'"+';'},'Math Worksheets'),wrap({id:'ansBtn',tag:'btn',cls:'btn lo',fn:'toggleAns()'},'Answers'),' &nbsp;  ',wrap({id:'seed',tag:'inp',style:'width:65px;',lbl:'Num:'}),wrap({tag:'btn',fn:'seedRand()'},'Try Another'),' &nbsp;  ','<a href="javascript:window.print()"><img src="../images/style/printer.png" alt="print this page" style="vertical-align:top;" />Print!</a>')
s+=wrap({style:'padding: 0 0 30px 0;'},'<div style="float:left; margin: 0 10px 5px 0;">Name:__________________</div>','<div style="float:right; margin: 0 0 5px 10px;">Date:__________________</div>','<div style="text-align:center;"><b>Math is Fun Worksheet</b><br /><i>from mathsisfun.com</i></div>')
s+='</header>'
s+=wrap({id:'ws',style:'text-align: center;'})
s+=wrap({id:'result',style:'text-align: center; font: 30px Verdana;  z-index:100;'})
s+='</div>'
docInsert(s)
let seed=getQueryVariable('seed')
if(seed){seedSet(seed)}else{seedSet(1000)}
console.log('seed',seed,my.seedStt)
my.game.ops=getQueryVariable('ops')
my.game.nops=getQueryVariable('nops')
my.game.brackQ=false
if(my.game.ops.indexOf('b')>=0){my.game.ops=my.game.ops.replaceAll('b','')
my.game.brackQ=true}
my.game.n=Math.min(100,getQueryDef('n',10))
my.game.amin=getQueryDef('amin',1)
my.game.amax=getQueryDef('amax',10)
my.game.ansType=getQueryVariable('ansType')
if(!my.game.ansType)my.game.ansType='steps'
console.log('my.game.ansType',my.game.ansType)
my.parser=new Parser()
console.log('my.game',my.game)
doWS()}
function getQueryDef(name,def){let a=getQueryVariable(name)
if(a){return parseInt(a)}
return def}
function seedSet(n){my.seedStt=parseInt(n)
if(my.seedStt<=0)my.seedStt=1
document.getElementById('seed').value=my.seedStt}
function seedChg(){my.seedStt=document.getElementById('seed').value<<0
seedSet(my.seedStt)
doWS()}
function seedRand(){seedSet(Math.floor(Math.random()*9999)+1)
doWS()}
function doWS(){document.getElementById('result').innerHTML=''
my.seed=my.seedStt
let dones=[]
my.anss=[]
my.tabs=[]
let s=''
for(let i=0;i<my.game.n;i++){s+='<div style="text-align: center;	display: inline-block;	vertical-align:bottom;	margin: 0 1.8% 6% 1.8%;	width: 45%;  font: 19px Verdana; ">'
let id=''
let toks=[]
let tries=0
let okQ=true
do{toks.push(getRandomInt(my.game.amin,my.game.amax))
let prevOp=''
for(let j=0;j<my.game.nops;j++){let currOp=my.game.ops[getRandomInt(0,my.game.ops.length-1)]
if(currOp==prevOp){if(my.game.ops.length<2){}else{currOp=my.game.ops[getRandomInt(0,my.game.ops.length-1)]}}
prevOp=currOp
toks.push(currOp)
toks.push(getRandomInt(my.game.amin,my.game.amax))}
id=toks.join()
okQ=true
if(dones.indexOf(id)>=0)okQ=false
if(tries>10){while(dones.length>5){dones.shift()}}}while(!okQ&&tries++<100)
dones.push(id)
if(my.game.brackQ){let stt=getRandomInt(0,my.game.nops-1)
let fin=getRandomInt(stt+1,my.game.nops)
if(stt==0&&fin==my.game.nops){}else{console.log('brack',stt,fin,toks.length)
toks.splice(0+stt*2,0,'(')
toks.splice(2+fin*2,0,')')}}
let html=''
let pStr=''
toks.forEach(function(el,n,arr){switch(el){case 'a':html+=' + '
pStr+='+'
break
case 's':html+=' &minus; '
pStr+='-'
break
case 'm':html+=' &times; '
pStr+='*'
break
case 'd':html+=' &divide; '
pStr+='../index.html'
break
default:if(el<0){if(html.length>0){html+='('+'\u2212'+-el+')'}else{html+='\u2212'+-el}}else{html+=el}
pStr+=el}})
let str=html
s+='<div style="font: italic 10px Verdana; text-align:left;">'+(i+1)+':'+'</div>'
s+=str
let ansHt=my.game.nops*20
if(my.ansQ){let soln='?'
if(my.game.ansType=='steps'){soln=getParse(pStr)}else{my.parser.newParse(str)
soln=my.parser.rootNode.walk()}
s+='<div style="text-align:center; border-top: 1px solid darkblue; margin-top:2px; font:16px Arial; height:'+ansHt+'px;">'+soln+'</div>'}else{s+='<div style="text-align:right; height:'+(ansHt+2)+'px; ">'+' '+'</div>'}
s+='</div>'}
document.getElementById('ws').innerHTML=s}
function getParse(str){my.parser.newParse(str)
let s=''
s+=my.parser.rootNode.walkFmt()
let n
while((n=my.parser.rootNode.getLastBranch())!=null){my.parser.rootNode.getLastBranch().setNew('real',n.walk([0,0]).toString())
s+='<br/>'
s+=my.parser.rootNode.walkFmt()}
return s}
function doAns(n){let userAns=document.getElementById('ans'+n).value
console.log('doAns',n,my.anss[n],userAns)
if(userAns==my.anss[n]){let s='<div style="text-align:right; border-top: 1px solid black; height:40px;">'+my.anss[n]+'</div>'
document.getElementById('ansDiv'+n).innerHTML=s
my.tabs.splice(my.tabs.indexOf('ans'+n),1)
console.log('YAY',my.tabs)
if(my.tabs.length==0){document.getElementById('result').innerHTML='Perfect !'}else{document.getElementById(my.tabs[0]).focus()}}}
function toggleAns(){if(my.game.olQ)return
my.ansQ=!my.ansQ
toggleBtn('ansBtn',my.ansQ)
doWS()}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
class Parser{constructor(){this.operators='+-*(/),^.'
this.rootNode=null
this.tempNode=[]
this.Variable='x'
this.errMsg=''
this.radiansQ=true
this.vals=[]
for(let i=0;i<26;i++){this.vals[i]=0}
this.reset()}
setVarVal(varName,newVal){switch(varName){case 'x':this.vals[23]=newVal
break
case 'y':this.vals[24]=newVal
break
case 'z':this.vals[25]=newVal
break
default:if(varName.length==1){this.vals[varName.charCodeAt(0)-'a'.charCodeAt(0)]=newVal}}}
getVal(){return this.rootNode.walk(this.vals)}
newParse(s){this.reset()
s=s.split(',').join('.')
s=s.replace(/[^\w/\.\(\)\[\]\+\-\^\%\&\;\*\!\u2212\u00F7\u00D7\u00B2\u00B3\u221a]/gi,'')
s=s.split('exp').join('eksp')
s=s.split('x').join('*')
s=s.split('[').join('(')
s=s.split(']').join(')')
s=s.split('&nbsp;').join('')
s=s.split('&mult;').join('*')
s=s.split('&divide;').join('../index.html')
s=s.split('&minus;').join('-')
s=s.replace(/\u2212/g,'-')
s=s.replace(/\u00F7/g,'../index.html')
s=s.replace(/\u00D7/g,'*')
s=s.replace(/\u00B2/g,'^2')
s=s.replace(/\u00B3/g,'^3')
s=s.replace(/\u221a([0-9\.]+)/g,'sqrt($1)')
s=s.replace(/\u221a\(/g,'sqrt(')
s=this.fixPercent(s)
s=this.fixENotation(s)
s=this.fixParentheses(s)
s=this.fixUnaryMinus(s)
s=this.fixFactorial(s)
s=this.fixImplicitMultply(s)
this.rootNode=this.parse(s)}
fixPercent(s){if(!s.match(/%/)){return s}
let myRe=/[0-9]*\.?[0-9]+[%]/g
let bits=[]
let stt=0
let arr
while((arr=myRe.exec(s))!==null){bits.push(s.substr(stt,arr.index-stt))
let str=arr[0]
str='('+str.replace(/%/,'/100')+')'
bits.push(str)
stt=arr.index+arr[0].length}
bits.push(s.substr(stt))
s=bits.join('')
return s}
fixFactorial(s){if(s.indexOf('!')<0)return s
let currPos=1
let chgQ=false
do{chgQ=false
let fPos=s.indexOf('!',currPos)
if(fPos>0){let numEnd=fPos-1
let numStt=numEnd
let cnum=s.charAt(numStt)
if(cnum=='n'){}else{do{cnum=s.charAt(numStt)
numStt--}while(cnum>='0'&&cnum<='9')
numStt+=2}
if(numStt<=numEnd){let numStr=s.substr(numStt,numEnd-numStt+1)
numStr='fact('+numStr+')'
s=s.substr(0,numStt)+numStr+s.substr(numEnd+2)
currPos=fPos+numStr.length
chgQ=true}}}while(chgQ)
return s}
fixENotation(s){if(!s.match(/e/i)){return s}
let myRe=/[0-9]*\.?[0-9]+[eE]{1}[-+]?[0-9]+/g
let bits=[]
let stt=0
let arr
while((arr=myRe.exec(s))!==null){bits.push(s.substr(stt,arr.index-stt))
let eStr=arr[0]
eStr='('+eStr.replace(/e/gi,'*10^(')+'))'
bits.push(eStr)
stt=arr.index+arr[0].length}
bits.push(s.substr(stt))
s=bits.join('')
return s}
fixParentheses(s){let sttParCount=0
let endParCount=0
for(let i=0;i<s.length;i++){if(s.charAt(i)=='(')sttParCount++
if(s.charAt(i)==')')endParCount++}
while(sttParCount<endParCount){s='('+s
sttParCount++}
while(endParCount<sttParCount){s+=')'
endParCount++}
return s}
fixUnaryMinus(s){let x=s+'\n'
let y=''
let OpenQ=false
let prevType='('
let thisType=''
for(let i=0;i<s.length;i++){let c=s.charAt(i)
if((c>='0'&&c<='9')||c=='.'){thisType='N'}else{if(this.operators.indexOf(c)>=0){if(c=='-'){thisType='-'}else{thisType='O'}}else{if(c=='.'||c==this.Variable){thisType='N'}else{thisType='C'}}
if(c=='('){thisType='('}
if(c==')'){thisType=')'}}
x+=thisType
if(prevType=='('&&thisType=='-'){y+='0'}
if(OpenQ){switch(thisType){case 'N':break
default:y+=')'
OpenQ=false}}
if(prevType=='O'&&thisType=='-'){y+='(0'
OpenQ=true}
y+=c
prevType=thisType}
if(OpenQ){y+=')'
OpenQ=false}
return y}
fixImplicitMultply(s){let x=s+'\n'
let y=''
let prevType='?'
let prevName=''
let thisType='?'
let thisName=''
for(let i=0;i<s.length;i++){let c=s.charAt(i)
if(c>='0'&&c<='9'){thisType='N'}else{if(this.operators.indexOf(c)>=0){thisType='O'
thisName=''}else{thisType='C'
thisName+=c}
if(c=='('){thisType='('}
if(c==')'){thisType=')'}}
x+=thisType
if(prevType=='N'&&thisType=='C'){y+='*'
thisName=''}
if(prevType=='N'&&thisType=='('){y+='*'}
if(prevType==')'&&thisType=='('){y+='*'}
if(prevType==')'&&thisType=='N'){y+='*'}
if(thisType=='('){switch(prevName){case 'i':case 'pi':case 'e':case 'a':case this.Variable:y+='*'
break}}
y+=c
prevType=thisType
prevName=thisName}
return y}
reset(){this.tempNode=[]
this.errMsg=''}
parse(s){if(s==''){this.errMsg+='Missing Value\n'
return new MathNode('real','0',this.radiansQ)}
if(isNumeric(s)){return new MathNode('real',s,this.radiansQ)}
if(s.charAt(0)=='$'){if(isNumeric(s.substr(1))){return this.tempNode[Number(s.substr(1))]}}
let sLo=s.toLowerCase()
if(sLo.length==1){if(sLo>='a'&&sLo<='z'){return new MathNode('var',sLo,this.radiansQ)}}
switch(sLo){case 'pi':return new MathNode('var',sLo,this.radiansQ)
break}
let bracStt=s.lastIndexOf('(')
if(bracStt>-1){let bracEnd=s.indexOf(')',bracStt)
if(bracEnd<0){this.errMsg+="Missing ')'\n"
return new MathNode('real','0',this.radiansQ)}
let isParam=false
if(bracStt==0){isParam=false}else{let prefix=s.substr(bracStt-1,1)
isParam=this.operators.indexOf(prefix)<=-1}
if(!isParam){this.tempNode.push(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)))
return this.parse(s.substr(0,bracStt)+'$'+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1))}else{let startM=-1
for(let u=bracStt-1;u>-1;u--){let found=this.operators.indexOf(s.substr(u,1))
if(found>-1){startM=u
break}}
let nnew=new MathNode('func',s.substr(startM+1,bracStt-1-startM),this.radiansQ)
nnew.addchild(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)))
this.tempNode.push(nnew)
return this.parse(s.substr(0,startM+1)+'$'+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1))}}
let k
let k1=s.lastIndexOf('+')
let k2=s.lastIndexOf('-')
if(k1>-1||k2>-1){if(k1>k2){k=k1
let nnew=new MathNode('op','add',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}else{k=k2
let nnew=new MathNode('op','sub',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}}
k1=s.lastIndexOf('*')
k2=s.lastIndexOf('../index.html')
if(k1>-1||k2>-1){if(k1>k2){k=k1
let nnew=new MathNode('op','mult',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}else{k=k2
let nnew=new MathNode('op','div',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}}
k=s.indexOf('^')
if(k>-1){let nnew=new MathNode('op','pow',this.radiansQ)
nnew.addchild(this.parse(s.substr(0,k)))
nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)))
return nnew}
if(isNumeric(s)){return new MathNode('real',s,this.radiansQ)}else{if(s.length==0){return new MathNode('real','0',this.radiansQ)}else{this.errMsg+="'"+s+"' is not a number.\n"
return new MathNode('real','0',this.radiansQ)}}}}
class Decimal{constructor(val){this.val=this.toNum(val)}
add(val){return new Decimal(this.val+this.toNum(val))}
sub(val){return new Decimal(this.val-this.toNum(val))}
mul(val){return new Decimal(this.val*this.toNum(val))}
div(val){return new Decimal(this.val/this.toNum(val))}
toNum(gen){if(typeof gen=='object')return gen.val
return parseFloat(gen)}
toString(){if(typeof this.val=='object')return this.val.val
return parseFloat(this.val)}}
class MathNode{constructor(typ,val,radQ){this.tREAL=0
this.tVAR=1
this.tOP=2
this.tFUNC=3
this.radiansQ=radQ
this.setNew(typ,val,radQ)}
setNew(typ,val,radQ=true){this.radiansQ=radQ
this.clear()
switch(typ){case 'real':this.typ=this.tREAL
this.r=new Decimal(val)
break
case 'var':this.typ=this.tVAR
this.v=val
break
case 'op':this.typ=this.tOP
this.op=val
break
case 'func':this.typ=this.tFUNC
this.op=val
break}
return this}
clear(){this.r=1
this.v=''
this.op=''
this.child=[]
this.childCount=0}
addchild(n){this.child.push(n)
this.childCount++
return this.child[this.child.length-1]}
getLevelsHigh(){let lvl=0
for(let i=0;i<this.childCount;i++){lvl=Math.max(lvl,this.child[i].getLevelsHigh())}
return lvl+1}
isLeaf(){return this.childCount==0}
getLastBranch(){if(this.isLeaf()){return null}
for(let i=0;i<this.childCount;i++){if(!this.child[i].isLeaf()){return this.child[i].getLastBranch()}}
return this}
fmt(htmlQ){htmlQ=typeof htmlQ!=='undefined'?htmlQ:true
let s=''
if(this.typ==this.tOP){switch(this.op.toLowerCase()){case 'add':s='+'
break
case 'sub':s=htmlQ?'\u2212':'-'
break
case 'mult':s=htmlQ?'\u00d7':'x'
break
case 'div':s=htmlQ?'\u00f7':'/'
break
case 'pow':s='^'
break
default:s=this.op}}
if(this.typ==this.tREAL){s=this.r}
if(this.typ==this.tVAR){if(this.r==1){s=this.v}else{if(this.r!=0){s=this.r+this.v}}}
if(this.typ==this.tFUNC){s=this.op}
return s}
walkFmt(){let s=this.walkFmta(true,'')
s=s.replace('Infinity','Undefined')
return s}
walkFmta(noparq,prevop){let s=''
if(this.childCount>0){let parq=false
if(this.op=='add')parq=true
if(this.op=='sub')parq=true
if(prevop=='div')parq=true
if(noparq)parq=false
if(this.typ==this.tFUNC)parq=true
if(this.typ==this.tOP){}else{s+=this.fmt(true)}
if(parq)s+='('
for(let i=0;i<this.childCount;i++){if(this.typ==this.tOP&&i>0)s+=this.fmt()
s+=this.child[i].walkFmta(false,this.op)
if(this.typ==this.tFUNC||(parq&&i>0)){s+=')'}}}else{s+=this.fmt()
if(prevop=='sin'||prevop=='cos'||prevop=='tan'){if(this.radiansQ){s+=' rad'}else{s+='\u00b0'}}}
return s}
walkNodesFmt(level){let s=''
for(let i=0;i<level;i++){s+='|   '}
s+=this.fmt()
s+=','+this.typ
s+=','+this.op
s+=','+this.v
s+=','+this.r.toFixed()
s+='\n'
for(let i=0;i<this.childCount;i++){s+=this.child[i].walkNodesFmt(level+1)}
return s}
walk(vals){let val
if(this.typ==this.tREAL){return this.r}
if(this.typ==this.tVAR){switch(this.v){case 'x':return vals[23]
case 'y':return vals[24]
case 'z':return vals[25]
case 'pi':return new Decimal(my.pi)
case 'e':return new Decimal(my.e)
case 'a':return vals[0]
case 'n':return vals[13]
default:return new Decimal('0')}}
if(this.typ==this.tOP){for(let i=0;i<this.childCount;i++){let val2=new Decimal('0')
if(this.child[i]!=null)val2=this.child[i].walk(vals)
if(i==0){val=val2}else{switch(this.op){case 'add':val=val.add(val2)
break
case 'sub':val=val.sub(val2)
break
case 'mult':val=val.mul(val2)
break
case 'div':val=val.div(val2,100)
break
case 'pow':val=val.pow(val2)
break
default:}}}
return val}
if(this.typ==this.tFUNC){let lhs=this.child[0].walk(vals)
switch(this.op){case 'sqrt':return lhs.sqrt()
case 'sin':return this.radiansQ?lhs.sin():degRound(lhs.mul(my.degToRad).sin())
case 'cos':return this.radiansQ?lhs.cos():degRound(lhs.mul(my.degToRad).cos())
case 'tan':return this.radiansQ?lhs.tan():degRound(lhs.mul(my.degToRad).tan())
case 'asin':return this.radiansQ?lhs.asin():lhs.asin().mul(my.radToDeg)
case 'acos':return this.radiansQ?lhs.acos():lhs.acos().mul(my.radToDeg)
case 'atan':return this.radiansQ?lhs.atan():lhs.atan().mul(my.radToDeg)
case 'sinh':return lhs.sinh()
case 'cosh':return lhs.cosh()
case 'tanh':return lhs.tanh()
case 'eksp':return lhs.exp()
case 'ln':return lhs.ln()
case 'abs':return lhs.abs()
case 'sign':if(lhs.isNegative())return new Decimal('-1')
if(lhs.isZero())return new Decimal('0')
return new Decimal('1')
case 'round':return lhs.round()
case 'floor':return lhs.floor()
case 'ceil':return lhs.ceil()
case 'fact':return factorial(lhs)}}
return NaN}}
function factorial(n){if(n<0)return NaN
if(n<2)return 1
n=n<<0
let i
i=n
let f=n
while(i-->2){f*=i}
return f}
function isNumeric(n){return!isNaN(parseFloat(n))&&isFinite(n)}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function loop(currNo,minNo,maxNo,incr){currNo+=incr
let range=maxNo-minNo+1
if(currNo<minNo){currNo=maxNo-((-currNo+maxNo)%range)}
if(currNo>maxNo){currNo=minNo+((currNo-minNo)%range)}
return currNo}
function constrain(min,val,max){return Math.min(Math.max(min,val),max)}
function fmt(num,digits){digits=14
if(num==Number.POSITIVE_INFINITY)return 'undefined'
if(num==Number.NEGATIVE_INFINITY)return 'undefined'
num=num.toPrecision(digits)
num=num.replace(/0+$/,'')
if(num.charAt(num.length-1)=='.')num=num.substr(0,num.length-1)
if(Math.abs(num)<1e-15)num=0
return num}
function isCarryNeeded(n1,n2,addQ){let n1str=n1.toString()
let n2str=n2.toString()
let minlength=Math.min(n1str.length,n2str.length)
for(let i=1;i<=minlength;i++){if(addQ){if(parseInt(n1str.substr(-i,1))+parseInt(n2str.substr(-i,1))>9){return true}}else{if(parseInt(n1str.substr(-i,1))-parseInt(n2str.substr(-i,1))<0){return true}}}
return false}
function getRandomInt(min,max){return Math.floor(random()*(max-min+1))+min}
function random(){let x=Math.sin(my.seed++)*10000
return x-Math.floor(x)}
function fmtDec(v,dec){return(v/100).toFixed(dec)}
function getQueryVariable(variable){let query=window.location.search.substring(1)
let vars=query.split('&')
for(let i=0;i<vars.length;i++){let pair=vars[i].split('=')
if(pair[0]==variable){return pair[1]}}
return false}
String.prototype.replaceAll=function(search,replacement){let target=this
return target.split(search).join(replacement)}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
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
case 'rad':if(cls.length==0)cls='radio'
s+='<form'
if(fn.length>0)s+=' onclick="'+fn+'"'
break
case 'sel':if(cls.length==0)cls='select'
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
for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
s+='<input type="radio" id="r'+i+'" name="typ" style="cursor:pointer;" value="'+opts[i][0]+'" '+chk+' />\n'
s+='<label for="r'+i+'" style="cursor:pointer;">'+opts[i][1]+'</label><br/>\n'}
s+='</form>'
break
case 'sel':s+='>\n'
for(let i=0;i<opts.length;i++){let idStr=id+i
let chkStr=i==99?' checked ':''
s+='<option id="'+idStr+'" value="'+opts[i]+'"'+chkStr+'>'+opts[i]+'</option>\n'}
s+='</select>'
break
case 'sld':s+='>'
break
default:}
s+='\n'
return s}
init()