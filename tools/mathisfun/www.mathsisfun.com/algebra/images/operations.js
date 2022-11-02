let my={}
function operationsMain(){let version='0.75';my.wd=480
my.opts={q:'(2+3)^4'}
let s="";s+='<div style="position:relative; width:'+my.wd+'px; min-height: 200px; margin:auto; ">';s+=popHTML();s+=wrap('user','','rel','text-align: center; margin: 12px;',`
  <input type="text" class="input" id="question" style="text-align: center; font: bold 20px Arial; width:100%; " value="" onKeyUp="go()" />`)
s+=wrap('tree','','rel','text-align: center;',`
  <canvas id="canInfo" style="z-index: -5; "></canvas>`)
s+=wrap('answer','output','rel','font: 17px Arial; text-align: center;','')
s+='<button id="linkBtn" onclick="showLink()" style="z-index:2; position: absolute; right: 3px; bottom: 3px;" class="btn" >Link</button>';s+='<button id="treeBtn" onclick="toggleTree()" style="z-index:2; position: absolute; right: 63px; bottom: 3px;" class="btn lo" >Tree</button>';s+='<p>&nbsp;</p>';s+='<div style="font: 11px arial; color: #6600cc; position:absolute; left:5px; bottom:3px;">&copy; 2021 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);my.cans=[]
canvasInit('canInfo',my.canvasWd,my.canvasHt,2)
document.getElementById('question').value=optGet('q')
my.parser=new Parser();let inStr=getQueryVariable('i');if(inStr){inStr=decodeURIComponent(inStr);document.getElementById('question').value=inStr;}
my.treeQ=false;this.radQ=true;go();}
function wrap(id,classStr,type='rel',styleExtra='',middle=''){let s=''
s+='\n<div'
if(id.length>0)s+=' id="'+id+'"'
if(classStr.length>0)s+=' class="'+classStr+'"'
if(type=='rel'){s+=' style="position:relative; '+styleExtra+'"'}
s+='>'
s+=middle
s+='</div>\n'
return s}
function canvasInit(id,wd,ht,ratio){let el=document.getElementById(id);el.width=wd*ratio;el.style.width=wd+"px";el.height=ht*ratio;el.style.height=ht+"px";let g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.cans[id]={el:el,g:g,ratio:ratio}}
function go(){let div=document.getElementById('question');let s=div.value;optSet('q',s)
s=s.substr(0,1000);s=fixParentheses(s);my.parser.radiansQ=this.radQ;my.parser.newParse(s);div=document.getElementById('answer');let tree=document.getElementById('tree');let g=my.cans.canInfo.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
if(my.treeQ){div.style.display='none'
tree.style.display='block'
nodesDraw();}else{div.style.display='block'
tree.style.display='none'
div.innerHTML=getSolution();}}
function fixParentheses(s){let sttParCount=0;let endParCount=0;for(let i=0;i<s.length;i++){if(s.charAt(i)=="(")
sttParCount++;if(s.charAt(i)==")")
endParCount++;}
while(sttParCount<endParCount){s="("+s;sttParCount++;}
while(endParCount<sttParCount){s+=")";endParCount++;}
return(s);}
function toggleTree(){my.treeQ=!my.treeQ;toggleBtn("treeBtn",my.treeQ);go();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function popHTML(){let s='';s+='<div id="editpop" style="position:absolute; left:-450px; top:40px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; ">';s+='<textarea  id="editbox" value="ddd" style="width: 400px; height: 120px; font: 16px Arial; border: 1px solid red; border-radius: 9px; background-color: #eeeeff; display: block;">';s+='</textarea>';s+='<div style="float:right; margin: 0 0 5px 10px;">';s+='<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>';s+='</div>';s+='</div>';return s;}
function showLink(){let pop=document.getElementById('editpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='30px';let expr=document.getElementById('question').value;expr=encodeURIComponent(expr);document.getElementById('editbox').value='operations-order-calculatorf70c.html?i='+expr;}
function editYes(){let pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function getSolution(){let s='';s+=my.parser.rootNode.walkFmt();let n;while((n=my.parser.rootNode.getLastBranch())!=null){my.parser.rootNode.getLastBranch().setNew("real",n.walk([0,0]).toString());s+="<br/>";s+=my.parser.rootNode.walkFmt();}
return(s);}
function nodesDraw(){my.tree={xmax:0,ymax:0,lvls:[]}
let levels=my.parser.rootNode.getLevelsHigh();this.levelXs=[];for(let i=0;i<levels;i++){this.levelXs.push(0);}
let g=my.cans.canInfo.g
nodeDraw(g,my.parser.rootNode,0);console.log('my.tree',my.tree,my.tree.lvls)
let el=my.cans.canInfo.el
let ratio=my.cans.canInfo.ratio
el.width=my.tree.xmax*ratio;el.height=my.tree.ymax*ratio;el.style.width=my.tree.xmax+"px";el.style.height=my.tree.ymax+"px";g.setTransform(ratio,0,0,ratio,0,0);g.clearRect(0,0,el.width,el.height);this.levelXs=[];for(let i=0;i<levels;i++){this.levelXs.push(0);}
nodeDraw(g,my.parser.rootNode,0);}
function nodeDraw(g,node,level){let boxWd=40;let boxHt=25;let xDist=50;let yDist=40;let boxClr='#cdf'
let xFudge=-30
let xPos=0
if(node.childCount>0){let xSum=0
for(let i=0;i<node.childCount;i++){xSum+=nodeDraw(g,node.child[i],level+1).x}
xPos=xSum/node.childCount}
xPos=Math.max(xPos,this.levelXs[level]+xDist)
node.x=xPos
let rootTopQ=false;if(rootTopQ){node.y=10+level*yDist;}else{node.y=10+(this.levelXs.length-level-1)*yDist;}
g.strokeStyle=boxClr
g.lineWidth=2
for(let i=0;i<node.childCount;i++){g.beginPath();if(rootTopQ){g.moveTo(node.x+boxWd/2+xFudge,node.y+boxHt);g.lineTo(node.child[i].x+boxWd/2+xFudge,node.child[i].y);}else{g.moveTo(node.x+boxWd/2+xFudge,node.y);g.lineTo(node.child[i].x+boxWd/2+xFudge,node.child[i].y+boxHt);}
g.stroke();}
g.lineWidth=1
this.levelXs[level]=node.x
let lowerx=node.x;for(let i=level+1;i<this.levelXs.length;i++){lowerx-=boxWd/2;this.levelXs[i]=Math.max(this.levelXs[i],lowerx);}
g.beginPath();g.fillStyle=boxClr
g.rect(node.x+xFudge,node.y,boxWd,boxHt);g.fill();g.font='bold 15px Arial';g.textAlign='center';g.fillStyle='blue';if(node.typ==node.tOP)g.fillStyle='orange';g.fillText(node.fmt(false),node.x+boxWd/2+xFudge,node.y+boxHt/2+6);my.tree.xmax=Math.max(my.tree.xmax,node.x+boxWd+xFudge)
my.tree.ymax=Math.max(my.tree.ymax,node.y+boxHt)
return node}
function optGet(name){var val=localStorage.getItem(`operations.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`operations.${name}`,val)
my.opts[name]=val}
class Parser{constructor(){this.operators="+-*(/),^.";this.rootNode;this.tempNode=[];this.Variable="x";this.errMsg="";this.radiansQ=true;this.vals=[];for(let i=0;i<26;i++){this.vals[i]=0;}
this.reset();}
setVarVal(varName,newVal){switch(varName){case "x":this.vals[23]=newVal;break;case "y":this.vals[24]=newVal;break;case "z":this.vals[25]=newVal;break;default:if(varName.length==1){this.vals[varName.charCodeAt(0)-'a'.charCodeAt(0)]=newVal;}}}
getVal(){return(this.rootNode.walk(this.vals));}
newParse(s){this.reset();let s0=s;s=s.split(" ").join("");s=s.split("[").join("(");s=s.split("]").join(")");s=s.replace(/\u2212/g,'-');s=s.replace(/\u00F7/g,'../index.html');s=s.replace(/\u00D7/g,'*');s=s.replace(/\u2715/g,'*');s=s.replace(/\u00B2/g,'^2');s=s.replace(/\u00B3/g,'^3');s=s.replace(/\u221a/g,'sqrt');s=s.replace(/x/g,'*');s=this.fixxy(s);s=this.fixParentheses(s);s=this.fixUnaryMinus(s);s=this.fixImplicitMultply(s);console.log("newParse: "+s0+' => '+s);this.rootNode=this.parse(s);}
fixxy(s){s=s.replace(/x[y]/g,'x*y');s=s.replace(/([0-9a])x/g,'$1*x');return s;}
fixParentheses(s){let sttParCount=0;let endParCount=0;for(let i=0;i<s.length;i++){if(s.charAt(i)=="(")
sttParCount++;if(s.charAt(i)==")")
endParCount++;}
while(sttParCount<endParCount){s="("+s;sttParCount++;}
while(endParCount<sttParCount){s+=")";endParCount++;}
return(s);}
fixUnaryMinus(s){let x=s+"\n";let y="";let OpenQ=false;let prevType="(";let thisType="";for(let i=0;i<s.length;i++){let c=s.charAt(i);if(c>="0"&&c<="9"){thisType="N";}else{if(this.operators.indexOf(c)>=0){if(c=="-"){thisType="-";}else{thisType="O";}}else{if(c=="."||c==this.Variable){thisType="N";}else{thisType="C";}}
if(c=="("){thisType="(";}
if(c==")"){thisType=")";}}
x+=thisType;if(prevType=="("&&thisType=="-"){y+="0";}
if(OpenQ){switch(thisType){case "N":break;default:y+=")";OpenQ=false;}}
if(prevType=="O"&&thisType=="-"){y+="(0";OpenQ=true;}
y+=c;prevType=thisType;}
if(OpenQ){y+=")";OpenQ=false;}
return(y);}
fixImplicitMultply(s){let x=s+"\n";let y="";let prevType="?";let prevName="";let thisType="?";let thisName="";for(let i=0;i<s.length;i++){let c=s.charAt(i);if(c>="0"&&c<="9"){thisType="N";}else{if(this.operators.indexOf(c)>=0){thisType="O";thisName="";}else{thisType="C";thisName+=c;}
if(c=="("){thisType="(";}
if(c==")"){thisType=")";}}
x+=thisType;if(prevType=="N"&&thisType=="C"){y+="*";thisName="";}
if(prevType=="N"&&thisType=="("){y+="*";}
if(prevType==")"&&thisType=="("){y+="*";}
if(thisType=="("){switch(prevName){case "i":case "pi":case "e":case "a":case this.Variable:y+="*";break;}}
y+=c;prevType=thisType;prevName=thisName;}
return(y);}
reset(){this.tempNode=[];this.errMsg="";}
parse(s){if(s==""){return new MathNode("real","0",this.radiansQ);}
if(isNumeric(s)){return new MathNode("real",s,this.radiansQ);}
if(s.charAt(0)=="$"){if(isNumeric(s.substr(1))){return this.tempNode[Number(s.substr(1))];}}
let sLo=s.toLowerCase();if(sLo.length==1){if(sLo>="a"&&sLo<="z"){return new MathNode("var",sLo,this.radiansQ);}}
switch(sLo){case "pi":return new MathNode("var",sLo,this.radiansQ);}
let bracStt=s.lastIndexOf("(");if(bracStt>-1){let bracEnd=s.indexOf(")",bracStt);if(bracEnd<0){this.errMsg+="Missing ')'\n";return new MathNode("real","0",this.radiansQ);}
let isParam=false;if(bracStt==0){isParam=false;}else{let prefix=s.substr(bracStt-1,1);isParam=this.operators.indexOf(prefix)<=-1;}
if(!isParam){this.tempNode.push(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)));return this.parse(s.substr(0,bracStt)+"$"+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1));}else{let startM=-1;for(let u=bracStt-1;u>-1;u--){let found=this.operators.indexOf(s.substr(u,1));if(found>-1){startM=u;break;}}
let nnew=new MathNode("func",s.substr(startM+1,bracStt-1-startM),this.radiansQ);nnew.addchild(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)));this.tempNode.push(nnew);return this.parse(s.substr(0,startM+1)+"$"+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1));}}
let k;let k1=s.lastIndexOf("+");let k2=s.lastIndexOf("-");if(k1>-1||k2>-1){if(k1>k2){k=k1;let nnew=new MathNode("op","add",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}else{k=k2;let nnew=new MathNode("op","sub",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}}
k1=s.lastIndexOf("*");k2=s.lastIndexOf("../index.html");if(k1>-1||k2>-1){if(k1>k2){k=k1;let nnew=new MathNode("op","mult",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}else{k=k2;let nnew=new MathNode("op","div",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}}
k=s.indexOf("^");if(k>-1){let nnew=new MathNode("op","pow",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}
if(isNumeric(s)){return new MathNode("real",s,this.radiansQ);}else{if(s.length==0){return new MathNode("real","0",this.radiansQ);}else{this.errMsg+="'"+s+"' is not a number.\n";return new MathNode("real","0",this.radiansQ);}}}}
class MathNode{constructor(typ,val,radQ){this.tREAL=0;this.tlet=1;this.tOP=2;this.tFUNC=3;this.radiansQ=true;this.setNew(typ,val,radQ);}
setNew(typ,val,radQ){this.radiansQ=typeof radQ!=='undefined'?radQ:true;this.clear();switch(typ){case "real":this.typ=this.tREAL;this.r=Number(val);break;case "var":this.typ=this.tVAR;this.v=val;break;case "op":this.typ=this.tOP;this.op=val;break;case "func":this.typ=this.tFUNC;this.op=val;break;}
return(this);}
clear(){this.r=1;this.v="";this.op="";this.child=[];this.childCount=0;}
addchild(n){this.child.push(n);this.childCount++;return(this.child[this.child.length-1]);}
getLevelsHigh(){let lvl=0;for(let i=0;i<this.childCount;i++){lvl=Math.max(lvl,this.child[i].getLevelsHigh());}
return(lvl+1);}
isLeaf(){return(this.childCount==0);}
getLastBranch(){if(this.isLeaf()){return(null);}
for(let i=0;i<this.childCount;i++){if(!this.child[i].isLeaf()){return(this.child[i].getLastBranch());}}
return(this);}
fmt(htmlQ){htmlQ=typeof htmlQ!=='undefined'?htmlQ:true;let s="";if(this.typ==this.tOP){switch(this.op.toLowerCase()){case "add":s="+";break;case "sub":s=htmlQ?"&minus;":"-";break;case "mult":s=htmlQ?"&times;":"x";break;case "div":s=htmlQ?"&divide;":"/";break;case "pow":s="^";break;default:s=this.op;}}
if(this.typ==this.tREAL){s=this.r.toString();}
if(this.typ==this.tVAR){if(this.r==1){s=this.v;}else{if(this.r!=0){s=this.r+this.v;}}}
if(this.typ==this.tFUNC){s=this.op;}
return s;}
walkFmt(){let s=this.walkFmta(true,"");s=s.replace("Infinity","Undefined");return s;}
walkFmta(noparq,prevop){let s="";if(this.childCount>0){let parq=false;if(this.op=="add")
parq=true;if(this.op=="sub")
parq=true;if(prevop=="div")
parq=true;if(noparq)
parq=false;if(this.typ==this.tFUNC)
parq=true;if(this.typ==this.tOP){}else{s+=this.fmt(true);}
if(parq)
s+="(";for(let i=0;i<this.childCount;i++){if(this.typ==this.tOP&&i>0)
s+=this.fmt();s+=this.child[i].walkFmta(false,this.op);if(this.typ==this.tFUNC||(parq&&i>0)){s+=")";}}}else{s+=this.fmt();if(prevop=="sin"||prevop=="cos"||prevop=="tan"){if(this.radiansQ){s+=" rad";}else{s+="&deg;";}}}
return s;}
walkNodesFmt(level){let s="";for(let i=0;i<level;i++){s+="|   ";}
s+=this.fmt();s+="\n";for(let i=0;i<this.childCount;i++){s+=this.child[i].walkNodesFmt(level+1);}
return s;}
walk(vals){let val=0
if(this.typ==this.tREAL)
return(this.r);if(this.typ==this.tVAR){switch(this.v){case "x":return(vals[23]);case "y":return(vals[24]);case "z":return(vals[25]);case "pi":return(Math.PI);case "e":return(Math.exp(1));case "a":return(vals[0]);case "n":return(vals[13]);default:return(0);}}
if(this.typ==this.tOP){let val=0;for(let i=0;i<this.childCount;i++){let val2=0;if(this.child[i]!=null)
val2=this.child[i].walk(vals);if(i==0){val=val2;}else{switch(this.op){case "add":val+=val2;break;case "sub":val-=val2;break;case "mult":val*=val2;break;case "div":val/=val2;break;case "pow":if(val2==2){val=val*val;}else{val=Math.pow(val,val2);}
break;default:}}}
return val;}
if(this.typ==this.tFUNC){let lhs=this.child[0].walk(vals);let angleFact=1;if(!this.radiansQ)
angleFact=180/Math.PI;switch(this.op){case "sin":val=Math.sin(lhs/angleFact);break;case "cos":val=Math.cos(lhs/angleFact);break;case "tan":val=Math.tan(lhs/angleFact);break;case "asin":val=Math.asin(lhs)*angleFact;break;case "acos":val=Math.acos(lhs)*angleFact;break;case "atan":val=Math.atan(lhs)*angleFact;break;case "sinh":val=(Math.exp(lhs)-Math.exp(-lhs))/2;break;case "cosh":val=(Math.exp(lhs)+Math.exp(-lhs))/2;break;case "tanh":val=(Math.exp(lhs)-Math.exp(-lhs))/(Math.exp(lhs)+Math.exp(-lhs));break;case "exp":val=Math.exp(lhs);break;case "log":val=Math.log(lhs)*Math.LOG10E;break;case "ln":val=Math.log(lhs);break;case "abs":val=Math.abs(lhs);break;case "deg":val=lhs*180.0/Math.PI
break;case "rad":val=lhs*Math.PI/180.0
break;case "sign":if(lhs<0){val=-1;}else{val=1;}
break;case "sqrt":val=Math.sqrt(lhs);break;case "round":val=Math.round(lhs);break;case "int":val=Math.floor(lhs);break;case "floor":val=Math.floor(lhs);break;case "ceil":val=Math.ceil(lhs);break;case "fact":val=factorial(lhs);break;default:val=NaN;}
return val;}
return val;}}
function factorial(n){if(n<0)return NaN;if(n<2)return 1;n=n<<0;let i;i=n;let f=n;while(i-->2){f*=i;}
return f;}
function isNumeric(n){return!isNaN(parseFloat(n))&&isFinite(n);}
function getQueryVariable(variable){let query=window.location.search.substring(1);let vars=query.split("&");for(let i=0;i<vars.length;i++){let pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return false;}