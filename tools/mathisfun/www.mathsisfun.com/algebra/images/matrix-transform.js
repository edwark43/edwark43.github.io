var w,h,ratio,s,el,g,coords,graph,my={};function matrixtransformMain(){my.version='0.81';w=360;h=460;var canvasWd=340;var canvasHt=340;coords=new Coords(0,0,canvasWd,canvasHt,0,0,5,5,true);s="";s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; padding: 5px; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div style="margin:auto; display:block; background-color: #eeeeff; border-radius: 20px; text-align:center; width:100%; ">';s+='<div style="position:relative; width:'+w+'px; border: none; display: inline-block; vertical-align:top; margin-top:0px; ">';s+='<div style="margin: 10px 0 -20px 0; text-align: left; ">';s+='<div style="font: 21px arial; color: #000000;text-align:left; ">';s+='Transformation Matrix:';s+='</div>';s+='<button style="position: absolute; font: 14px Arial; right:15px; top:5px; z-index:5;" class="btn"  onclick="exampleDo()" >Example</button>';s+='</div>';s+='<div id="matrix" style="position:relative;">';my.elems=[{id:'in11',name:'a',x:12,y:60,stt:1.5},{id:'in12',name:'b',x:170,y:60,stt:0},{id:'in21',name:'c',x:12,y:130,stt:0},{id:'in22',name:'d',x:170,y:130,stt:1.5},]
for(var i=0;i<my.elems.length;i++){var elem=my.elems[i]
s+=`
    <div style="font: 18px arial; color: #0000ff; position:absolute; left:${elem.x-1}px; top:${elem.y-18}px; text-align:right;">${elem.name}:</div>
    <input type="text" id="${elem.id}" style="font-size: 20px; position:absolute; left:${elem.x+20}px; top:${elem.y-20}px; 
      width:92px; z-index:2; 
      color: #000000; background-color: #f0f8ff; text-align:center; border-radius: 10px; " value="2" onKeyUp="onValChg(${i})" />
    <input type="range" id="r${elem.id}" value="0" min="-2" max="2" step="0.02" 
      style="position:absolute; z-index:2; left:${elem.x}px; top:${elem.y+13}px; width:130px; height:10px; border: none;" 
      autocomplete="off" oninput="onSliderChg(0,${i},this.value)" onchange="onSliderChg(1,${i},this.value)" />
     `}
s+='<div style="text-align:left;">';s+=`<svg id="svg1" xmlns="http://www.w3.org/2000/svg" width="310" height="180">
  <path d="M 10,30 h -9 v 130 h 9"
  style="fill:none;stroke:#0000aa;stroke-width:3;stroke-linecap:butt;" />
  <path d="M 300,30 h 9 v 130 h -9"
  style="fill:none;stroke:#0000aa;stroke-width:3;stroke-linecap:butt;" />
  </svg>`
s+='</div>';s+='</div>';var grid=[]
for(var i=0;i<=5;i++){var x=-5+i*2
grid.push({x:x,y:-5,})
grid.push({x:x,y:5,})
grid.push({x:x+1,y:5,})
grid.push({x:x+1,y:-5,})}
console.log('grid',grid)
my.shapes=[{name:'F',pts:[{x:3,y:4},{x:3,y:5},{x:0,y:5},{x:0,y:0},{x:1,y:0},{x:1,y:1.8},{x:2.5,y:1.8},{x:2.5,y:2.8},{x:1,y:2.8},{x:1,y:4}]},{name:'Bars',pts:grid},{name:'Arrow',pts:[{x:0,y:0},{x:2,y:4},{x:4,y:0},{x:2,y:2}]},];var shapeList=[]
for(var i=0;i<my.shapes.length;i++){shapeList.push(my.shapes[i].name)}
my.shapeNo=0
s+='<div style="position:absolute; left:50px; top:240px; width:240px; font: 16px arial;">';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+=radioHTML('Shape:','shape',shapeList,'chgShape');s+='<br>'
s+='<div id="aLbl" style="font: 18px arial; color: #aaaa00; height:16px; text-align:center;">Transform 100%</div>'
s+=`<input type="range" id="ra" value="1" min="0" max="1" step="0.01" 
  style="z-index:2; width:200px; height:10px; border: none;" 
  autocomplete="off" oninput="onAChg(this.value)" onchange="onAChg(this.value)" />`
s+='</div>';s+='</div>';s+='<canvas id="canvasId" width="'+canvasWd+'" height="'+canvasHt+'" style="z-index:1; margin-top: 10px; margin-left: 5px; background-color: #ffffff; border: 1px solid black;"></canvas>';s+='<div id="copyrt" style="font: 10px Arial; color: #6600cc; ">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=4;el.width=canvasWd*ratio;el.height=canvasHt*ratio;el.style.width=canvasWd+"px";el.style.height=canvasHt+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);console.log('',el,g)
my.examples=[[1,0.8,0,1],[-1,0,0,1],[0,1,1,0],[2,0,0,2],[0.8,0,0,0.8],[0.866,-0.5,0.5,0.866],[1,1,-1,0],[-6,3,4,5],[2,3,-1,1],[2,-4,-5,1]];my.exampleNo=0;my.lowPrimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021,1031,1033,1039];my.MAX=9007199254740991;my.LowPrimeN=100;my.a=1
exampleDo()}
function chgShape(n){console.log('chgShape',n)
my.shapeNo=n
update()}
function onValChg(n){var elem=my.elems[n]
elem.stt=document.getElementById(elem.id).value
update()}
function onAChg(v){console.log('onAChg',v)
my.a=v
document.getElementById('aLbl').innerHTML="Transform "+parseInt(v*100)+"%"
update()}
function onSliderChg(type,n,v){console.log('onSliderChg',type,n,v)
v=Number(v);var elem=my.elems[n]
var sttVal=Number(elem.stt)
var newVal=(sttVal==0)?v:sttVal*(1+v)
newVal=fmtNum(newVal)
document.getElementById(elem.id).value=newVal
if(type==1){elem.stt=newval}
update();}
function exampleDo(){my.example=my.examples[my.exampleNo];my.exampleNo++;if(my.exampleNo>my.examples.length-1)my.exampleNo=0;for(var i=0;i<my.elems.length;i++){var elem=my.elems[i]
elem.stt=my.example[i]
document.getElementById(elem.id).value=my.example[i];}
update();}
function update(){g=el.getContext("2d");g.clearRect(0,0,el.width,el.height);g.fillStyle="#ffffff";g.beginPath()
g.rect(coords.left,coords.top,coords.width,coords.height);g.fill();var shapePts=my.shapes[my.shapeNo].pts
coords.fitToPts(shapePts,1.2);var in11=parseFloat(document.getElementById("in11").value)
var in12=parseFloat(document.getElementById("in12").value)
var in21=parseFloat(document.getElementById("in21").value)
var in22=parseFloat(document.getElementById("in22").value)
var pts=[]
for(var i=0;i<shapePts.length;i++){var pt=shapePts[i]
var x=in11*pt.x+in12*pt.y
var y=in21*pt.x+in22*pt.y
pts.push({x:x,y:y})}
coords.fitToPts(pts,1.2,true);var aQ=true;if(aQ){in11=1*(1-my.a)+in11*my.a
in12=0*(1-my.a)+in12*my.a
in21=0*(1-my.a)+in21*my.a
in22=1*(1-my.a)+in22*my.a}
var pts=[]
for(var i=0;i<shapePts.length;i++){var pt=shapePts[i]
var x=in11*pt.x+in12*pt.y
var y=in21*pt.x+in22*pt.y
pts.push({x:x,y:y})}
graph=new Graph(g,coords);graph.drawGraph();g.fillStyle="rgba(0,255,0,0.4)"
g.strokeStyle="gold"
drawShape(g,shapePts)
g.fillStyle="rgba(0,0,255,0.3)"
g.strokeStyle="#000000"
drawShape(g,pts)}
function doQuad(){var in11=parseFloat(document.getElementById("in11").value)
var in21=parseFloat(document.getElementById("in12").value)
var in12=parseFloat(document.getElementById("in21").value)
var in22=parseFloat(document.getElementById("in22").value)
var a=1
var b=-(in11+in22)
var c=in11*in22-in12*in21
var q=quadratic(a,b,c);var roots=q.ans1+"<br/>"+q.ans2;if(q.notes.length>0)roots+="<br/>"+q.notes;var factStr="";if(q.count>0){factStr+="f(x) = ";if(a!=1)factStr+=a;factStr+=fmtFactor(q.ans1);if(q.count==1){factStr+="<sup>2</sup>";}else{factStr+=fmtFactor(q.ans2);}}
var s="";s+='Characteristic Equation: '
s+=q.formula;if(q.notes.length>0)s+="<br/>"+q.notes;s+="<br/>";switch(q.count){case 1:s+="<br/>Root: "+q.ans1;s+="<br/>Factored: "+factStr;s+="<br/>";s+="<br/>Discriminant: "+fmt(q.disc);s+="<br/>Vertex: ("+fmt(q.vertX)+", "+fmt(q.vertY)+")";s+="<br/>Sum of Roots (-b/a): "+fmt(-b/a);s+="<br/>Product of Roots (c/a): "+fmt(c/a);break;case 2:s+="<br/>Roots: "+q.ans1+", "+q.ans2;if(q.pair.length>0)s+="<br/>Root Pair: "+q.pair;s+="<br/>Factored: "+factStr;s+="<br/>";s+="<br/>Discriminant: "+fmt(q.disc);s+="<br/>Vertex: ("+fmt(q.vertX)+", "+fmt(q.vertY)+")";s+="<br/>Sum of Roots (-b/a): "+fmt(-b/a);s+="<br/>Product of Roots (c/a): "+fmt(c/a);break;}
document.getElementById("longans").innerHTML=s;}
function drawShape(g,pts){g.beginPath()
for(var i=0;i<pts.length;i++){var pt=pts[i]
g.lineTo(coords.toXPix(pt.x),coords.toYPix(pt.y))}
g.closePath()
g.fill();g.stroke();}
function fmtFactor(root){root=root.toString();root=root.trim();var s='';if(root.charAt(0)=="-"){s+="(x + "+root.substr(1)+")";}else{if(root=="0"){s+="x";}else{if(root.charAt(0)=="+"){s+="(x - "+root.substr(1)+")";}else{s+="(x - "+root+")";}}}
return s;}
function fmt(num,digits){digits=14;if(num==Number.POSITIVE_INFINITY)
return "undefined";if(num==Number.NEGATIVE_INFINITY)
return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function quadratic(a,b,c){var ans1="";var ans2="";var ansCount=0;var disc=0;var vertX=0;var vertY=0;var notes="";if(a==0){notes="Not a quadratic equation. 'a' shouldn't be zero.";ans1="NA";ans2="NA";ansCount=0;}else{disc=b*b-4*a*c;if(disc<0){var real=-b/(2*a);var imag=Math.sqrt(-disc)/(2*a);notes="It has Complex Roots !";ans1="";ans2="";if(real!=0){ans1+=fmt(real);ans2+=fmt(real);}
ans1+=" + ";ans2+=" - ";if(Math.abs(imag)!=1){ans1+=fmt(Math.abs(imag));ans2+=fmt(Math.abs(imag));}
ans1+="i";ans2+="i";ansCount=2;}else if(disc==0){notes="Only one root.";ans1=fmt(-b/(2*a));ans2="";ansCount=1;}else{notes="";var root1=0;var root2=0;if(b<0){root1=(-b+Math.sqrt(disc))/(2*a);root2=(-b-Math.sqrt(disc))/(2*a);}else{root1=(-b-Math.sqrt(disc))/(2*a);root2=(-b+Math.sqrt(disc))/(2*a);}
if(Math.abs(root1)>Math.abs(c)){root2=c/(a*root1);}
ans1=fmt(root1);ans2=fmt(root2);ansCount=2;}
vertX=-b/(2*a);vertY=Number(a*vertX*vertX)+Number(b*vertX)+Number(c);}
var formula="";formula=neatAdd(formula,a,"x<sup>2</sup>");formula=neatAdd(formula,b,"x");formula=neatAdd(formula,c,"");formula+=" = 0";var pair=rootPair(a,b,c);return{count:ansCount,formula:formula,pair:pair,ans1:ans1,ans2:ans2,disc:disc,vertX:vertX,vertY:vertY,notes:notes};}
function rootPair(a,b,c){var disc=0;var pair='';if(a==0){}else{disc=b*b-4*a*c;if(disc<0){var real=-b/(2*a);var imag=Math.sqrt(-disc)/(2*a);if(real==0){}else{pair+=fmt(real);}
var discabs=Math.abs(disc);var den=2*a;if(discabs===parseInt(discabs,10)){var frac=sqrtSimplify(discabs,den);pair+=" &plusmn; ";if(frac.num!=1)pair+=fmt(frac.num);if(frac.sqrt!=1)pair+='&radic;('+fmt(frac.sqrt)+')';if(frac.den!=1)pair+='/'+fmt(Math.abs(frac.den));pair+="i";}else{pair+=" &plusmn; "+fmt(Math.abs(imag))+"i";}}else if(disc==0){pair='';}else{var numb=-b;var den=2*a;if(numb==0){}else{if(isInt(numb)&&isInt(den)){var gcf=gcfEuclid(numb,den);numb/=gcf;den/=gcf;if(den<0){numb=-numb;den=-den;}
pair='';if(den==1){pair+=fmt(numb);}else{pair+=fmt(numb)+'/'+fmt(den);}}else{pair+=fmt(-b/(2*a));}}
pair+=" &plusmn; ";var sqrt=Math.sqrt(disc);var den=2*a;if(sqrt===parseInt(sqrt,10)){var gcf=gcfEuclid(sqrt,den);sqrt/=gcf;den/=gcf;if(den<0){sqrt=-sqrt;den=-den;}
if(den==1){pair+=fmt(sqrt);}else{pair+=fmt(Math.abs(sqrt))+'/'+fmt(Math.abs(den));}}else{if(disc===parseInt(disc,10)){var frac=sqrtSimplify(disc,den);if(frac.num!=1)pair+=fmt(frac.num);if(frac.sqrt!=1)pair+='&radic;('+fmt(frac.sqrt)+')';if(frac.den!=1)pair+='/'+fmt(Math.abs(frac.den));}else{pair+=fmt(sqrt/den);}}}}
return pair;}
function isInt(x){if(x===parseInt(x,10))return true;return false;}
function sqrtSimplify(sqrt,den){var num=1;var primes=getFactors(sqrt);for(var i=0;i<primes.length;i++){var prime=primes[i];while(prime.n>1){num*=prime.val;prime.n-=2;sqrt/=(prime.val*prime.val);}}
if(den>1){var gcf=gcfEuclid(num,den);num/=gcf;den/=gcf;}
return{num:num,sqrt:sqrt,den:den}}
function getFactors(TheNum){my.FArr=[];if(TheNum>my.MAX){return my.FArr;}
my.numLeft=TheNum;if(my.numLeft==0||my.numLeft==1){return my.FArr;}else{var doneQ=false;for(var p=0;p<my.LowPrimeN;p++){if(!testFact(my.lowPrimes[p])){doneQ=true;break;}}
if(!doneQ){var fact=(((my.lowPrimes[p-1]+5)/6)<<0)*6-1;while(true){if(!testFact(fact))break;fact+=2;if(!testFact(fact))break;fact+=4;}}
if(my.numLeft!=1)addFact(my.numLeft,1);}
return my.FArr;}
function testFact(fact){var power=0;while(my.numLeft%fact==0){power++;my.numLeft=my.numLeft/fact;}
if(power!=0){addFact(fact,power);}
return my.numLeft/fact>fact;}
function addFact(fact,power){my.FArr.push({val:fact,n:power});}
function gcfEuclid(n,m){if(isNaN(n))return;if(isNaN(m))return;if(n==0)return;if(m==0)return;if(n<m){var z=n;n=m;m=z;}
var originaln=n;var originalm=m;var xstep=1;var r=1;while(r!=0){var q=Math.floor(n/m);r=n-m*q;n=m;m=r;xstep++;}
var gcd=n;var lcm=originaln*originalm/gcd;return gcd;}
function neatAdd(formula,x,varname){var s=formula;var plus="";if(s.length>0){plus=" + ";}
var minus=" - ";if(x==1){if(varname.length==0){s=s+plus+"1";}else{s=s+plus+varname;}}else if(x==-1){if(varname.length==0){s=s+minus+"1";}else{s=s+minus+varname;}}else if(x==0){}else if(x>0){s=s+plus+x+varname;}else{s=s+minus+Math.abs(x)+varname;}
return s;}
function Pt(x,y){this.x=x;this.y=y;}
class Coords{constructor(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left;this.top=top;this.width=width;this.height=height;this.xStt=xStt;this.yStt=yStt;this.xEnd=xEnd;this.yEnd=yEnd;this.uniScaleQ=uniScaleQ;this.xLogQ=false;this.yLogQ=false;this.calcScale();}
calcScale(){if(this.xLogQ){if(this.xStt<=0)this.xStt=1;if(this.xEnd<=0)this.xEnd=1;}
if(this.yLogQ){if(this.yStt<=0)this.yStt=1;if(this.yEnd<=0)this.yEnd=1;}
var temp;if(this.xStt>this.xEnd){temp=this.xStt;this.xStt=this.xEnd;this.xEnd=temp;}
if(this.yStt>this.yEnd){temp=this.yStt;this.yStt=this.yEnd;this.yEnd=temp;}
var xSpan=this.xEnd-this.xStt;if(xSpan<=0)xSpan=1e-9;this.xScale=xSpan/this.width;this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width;var ySpan=this.yEnd-this.yStt;if(ySpan<=0)ySpan=1e-9;this.yScale=ySpan/this.height;this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height;if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){var newScale=Math.max(this.xScale,this.yScale);this.xScale=newScale;xSpan=this.xScale*this.width;var xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-xSpan/2;this.xEnd=xMid+xSpan/2;this.yScale=newScale;ySpan=this.yScale*this.height;var yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-ySpan/2;this.yEnd=yMid+ySpan/2;}}
scale(factor,xMid,yMid){if(typeof xMid=='undefined')
xMid=(this.xStt+this.xEnd)/2;this.xStt=xMid-(xMid-this.xStt)*factor;this.xEnd=xMid+(this.xEnd-xMid)*factor;if(typeof yMid=='undefined')
yMid=(this.yStt+this.yEnd)/2;this.yStt=yMid-(yMid-this.yStt)*factor;this.yEnd=yMid+(this.yEnd-yMid)*factor;this.calcScale();}
drag(xPix,yPix){this.xStt+=xPix*this.xScale;this.xEnd+=xPix*this.xScale;this.yStt+=yPix*this.yScale;this.yEnd+=yPix*this.yScale;this.calcScale();}
newCenter(x,y){var xMid=this.xStt+x*this.xScale;var xhalfspan=(this.xEnd-this.xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;var yMid=this.yEnd-y*this.yScale;var yhalfspan=(this.yEnd-this.yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;this.calcScale();}
fitToPts(pts,borderFactor,addQ=false){console.log("fitToPts",pts);for(var i=0;i<pts.length;i++){var pt=pts[i];if(i==0&&!addQ){this.xStt=pt.x;this.xEnd=pt.x;this.yStt=pt.y;this.yEnd=pt.y;}else{this.xStt=Math.min(this.xStt,pt.x);this.xEnd=Math.max(this.xEnd,pt.x);this.yStt=Math.min(this.yStt,pt.y);this.yEnd=Math.max(this.yEnd,pt.y);}}
var xMid=(this.xStt+this.xEnd)/2;var xhalfspan=borderFactor*(this.xEnd-this.xStt)/2;this.xStt=xMid-xhalfspan;this.xEnd=xMid+xhalfspan;var yMid=(this.yStt+this.yEnd)/2;var yhalfspan=borderFactor*(this.yEnd-this.yStt)/2;this.yStt=yMid-yhalfspan;this.yEnd=yMid+yhalfspan;this.calcScale();}
toXPix(val,useCornerQ){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(xStt))/this.xLogScale;}else{return this.left+((val-this.xStt)/this.xScale);}}
toYPix(val){if(this.yLogQ){return this.top+(Math.log(yEnd)-Math.log(val))/this.yLogScale;}else{return this.top+((this.yEnd-val)/this.yScale);}}
toPtVal(pt,useCornerQ){return new Pt(this.toXVal(pt.x,useCornerQ),this.toYVal(pt.y,useCornerQ));}
toXVal(pix,useCornerQ){if(useCornerQ){return this.xStt+(pix-this.left)*this.xScale;}else{return this.xStt+pix*this.xScale;}}
toYVal(pix,useCornerQ){if(useCornerQ){return this.yEnd-(pix-top)*this.yScale;}else{return this.yEnd-pix*this.yScale;}}
getTicks(stt,span,ratio=5){var ticks=[];var inter=this.tickInterval(span/ratio,false);var tickStt=Math.ceil(stt/inter)*inter;var i=0;var tick=1
do{tick=tickStt+i*inter;tick=Number(tick.toPrecision(8));ticks.push([tick,1]);i++;}while(tick<stt+span);inter=this.tickInterval(span/ratio,true);for(i=0;i<ticks.length;i++){var t=ticks[i][0];if(Math.abs(Math.round(t/inter)-(t/inter))<0.001){ticks[i][1]=0;}}
return ticks;}
tickInterval(span,majorQ){var pow10=Math.pow(10,Math.floor(Math.log(span)*Math.LOG10E));var mantissa=span/pow10;if(mantissa>=5){if(majorQ){return(5*pow10);}else{return(2*pow10);}}
if(mantissa>=2){if(majorQ){return(2*pow10);}else{return(1*pow10);}}
if(mantissa>=1){if(majorQ){return(1*pow10);}else{return(0.2*pow10);}}
if(majorQ){return(1*pow10);}else{return(0.2*pow10);}}}
class Graph{constructor(g,coords){this.g=g;this.coords=coords;this.xLinesQ=true;this.yLinesQ=true;this.xValsQ=true;this.yValsQ=true;this.skewQ=false;}
drawGraph(){this.hzAxisY=coords.toYPix(0);if(this.hzAxisY<0)this.hzAxisY=0;if(this.hzAxisY>coords.height)this.hzAxisY=coords.height;this.hzNumsY=this.hzAxisY+14;if(this.hzAxisY>coords.height-10)this.hzNumsY=coords.height-3;this.vtAxisX=coords.toXPix(0);if(this.vtAxisX<0)this.vtAxisX=0;if(this.vtAxisX>coords.width)this.vtAxisX=coords.width;this.vtNumsX=this.vtAxisX-5;this.vtNumsAlign='right';if(this.vtAxisX<30){this.vtNumsX=this.vtAxisX+4;this.vtNumsAlign='left';if(this.vtAxisX<0){this.vtNumsX=6;}}
if(coords.xLogQ){this.drawLinesLogX();}else{if(this.xLinesQ){this.drawHzLines();}}
if(coords.yLogQ){this.drawLinesLogY();}else{if(this.yLinesQ){this.drawVtLines();}}}
drawVtLines(){var g=this.g;g.lineWidth=1;var ticks=coords.getTicks(coords.xStt,coords.xEnd-coords.xStt);for(var i=0;i<ticks.length;i++){var tick=ticks[i];var xVal=tick[0];var tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.3)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
var xPix=coords.toXPix(xVal,false);g.beginPath();g.moveTo(xPix,coords.toYPix(coords.yStt,false));g.lineTo(xPix,coords.toYPix(coords.yEnd,false));g.stroke();if(tickLevel==0&&this.xValsQ){g.fillStyle="#0000ff";g.font="bold 12px Verdana";g.textAlign="center";g.fillText(xVal.toString(),xPix,this.hzNumsY);}}
if(this.skewQ)
return;g.lineWidth=1.5;g.strokeStyle="#ff0000";g.beginPath();g.moveTo(this.vtAxisX,coords.toYPix(coords.yStt,false));g.lineTo(this.vtAxisX,coords.toYPix(coords.yEnd,false));g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(this.vtAxisX,coords.toYPix(coords.yEnd),15,2,20,10,Math.PI/2,10,false);g.stroke();g.fill();g.font="bold 18px Verdana";g.textAlign="left";g.fillText('y',this.vtAxisX+10,coords.toYPix(coords.yEnd)+15);}
drawHzLines(){var g=this.g;g.lineWidth=1;var ticks=coords.getTicks(coords.yStt,coords.yEnd-coords.yStt);for(var i=0;i<ticks.length;i++){var tick=ticks[i];var yVal=tick[0];var tickLevel=tick[1];if(tickLevel==0){g.strokeStyle="rgba(0,0,256,0.3)";}else{g.strokeStyle="rgba(0,0,256,0.1)";}
var yPix=coords.toYPix(yVal,false);g.beginPath();g.moveTo(coords.toXPix(coords.xStt,false),yPix);g.lineTo(coords.toXPix(coords.xEnd,false),yPix);g.stroke();if(tickLevel==0&&this.yValsQ){g.fillStyle="#ff0000";g.font="bold 12px Verdana";g.textAlign=this.vtNumsAlign;g.fillText(yVal.toString(),this.vtNumsX,yPix+5);}}
if(this.skewQ)
return;g.lineWidth=2;g.strokeStyle="#0000ff";g.beginPath();g.moveTo(coords.toXPix(coords.xStt,false),this.hzAxisY);g.lineTo(coords.toXPix(coords.xEnd,false),this.hzAxisY);g.stroke();g.beginPath();g.fillStyle=g.strokeStyle;g.drawArrow(coords.toXPix(coords.xEnd,false),this.hzAxisY,15,2,20,10,0,10,false);g.stroke();g.fill();g.font="bold 18px Verdana";g.textAlign="left";g.fillText('x',coords.toXPix(coords.xEnd,false)-18,this.hzAxisY-10);}}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){var g=this;var pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(var i=0;i<pts.length;i++){var cosa=Math.cos(-angle);var sina=Math.sin(-angle);var xPos=pts[i][0]*cosa+pts[i][1]*sina;var yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};function fmtNum(v){var s=(+v).toPrecision(10);if(s.indexOf(".")>0&&s.indexOf('e')<0){s=s.replace(/0+$/,'');}
if(s.charAt(s.length-1)=='.'){s=s.substr(0,s.length-1);}
return s;}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+=prompt;for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}