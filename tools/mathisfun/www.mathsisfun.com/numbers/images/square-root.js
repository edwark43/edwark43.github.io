let my={}
function squarerootMain(){let version='0.9'
let w=540
let h=180
let s="";s+='<div class="js" style="position: relative; text-align: center; margin:auto; max-width:'+w+'px; ">';s+='<canvas id="canvasId" style="z-index:1;"></canvas>';s+='<input type="range" id="r1" class="slider" value="9" min="0" max="16" step=".01" '+
' style="z-index:2; position:absolute; top:60px; left:20px; width:400px;'+
' height:17px; border: none; " '+
' oninput="showVal(1,this.value)" onchange="showVal(1,this.value)" />';s+='<input type="range" id="r2" class="slider" value="3" min="0" max="4" step=".01"'+
' style="z-index:2; position:absolute; top:140px; left:20px; width:100px;'+
' height:17px; border: none; " '+
' oninput="showVal(2,this.value)" onchange="showVal(2,this.value)" />';s+=wrap('val1','output','abs','top:29px;')
s+=wrap('val2','output','abs','top:109px;')
s+=wrap('','','rel','font: 0.7rem Arial; color: #6600cc;',`&copy; 2021 MathsIsFun.com v${version}`)
s+='</div>';docInsert(s)
my.canRoot=canvasInit('canvasId',w,h,2)
showVal(1,9)
let sqClr='#edd400'
let rootClr='#729fcf'
let g=my.canRoot.g
g.lineWidth=3;g.strokeStyle=sqClr
g.beginPath()
g.moveTo(180,150)
g.quadraticCurveTo(250,150,250,100)
g.stroke();g.moveTo(250,100)
g.lineTo(240,110)
g.moveTo(250,100)
g.lineTo(260,110)
g.stroke();g.strokeStyle=rootClr
g.beginPath()
g.moveTo(260,150)
g.quadraticCurveTo(340,150,350,100)
g.stroke();g.moveTo(260,150)
g.lineTo(270,140)
g.moveTo(260,150)
g.lineTo(270,160)
g.stroke();g.fillStyle=sqClr
g.font="20px Verdana"
g.fillText("Square",160,120)
g.fillStyle=rootClr
g.font="20px Verdana"
g.fillText("Square Root",280,170)}
function showVal(n,v){let el1=document.getElementById("val1");let el2=document.getElementById("val2");let v1,v2,v2Fmt;if(n==1){v1=parseFloat(v);let vn=Math.round(v1)
if(v1>(vn-0.02)&&v1<(vn+0.02))v1=vn
v2=Math.sqrt(v1)
v2Fmt=fmt(v2,4)
console.log('=',v2Fmt,v2)
if(v2Fmt!=v2)v2Fmt+='...'
let r2=document.getElementById("r2");r2.value=v2;}else{v2=v;let vn=Math.round(v2*10)/10
if(v2>(vn-0.02)&&v2<(vn+0.02))v2=vn
v2Fmt=v2;v1=fmt(v2*v2,12);el1.value=v1;let r1=document.getElementById("r1");r1.value=v1;}
el1.innerHTML=v1;let xpos=v1*25+10
el1.style.left=xpos+"px";el2.innerHTML=v2Fmt;xpos=v2*25+10
el2.style.left=xpos+"px";}
function fmt(num,digits=15){if(num==Number.POSITIVE_INFINITY)return "undefined";if(num==Number.NEGATIVE_INFINITY)return "undefined";num=Number(num.toPrecision(digits));if(Math.abs(num)<1e-15)num=0;return num;}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script);}
function canvasInit(id,wd,ht,ratio){let el=document.getElementById(id);el.width=wd*ratio;el.style.width=wd+"px";el.height=ht*ratio;el.style.height=ht+"px";let g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);return{el:el,g:g,ratio:ratio}}
function wrap(id,classStr,type='rel',styleExtra='',middle=''){let s=''
s+='\n'
let inpQ=classStr.includes('input')
s+=inpQ?'<input class="input" value="'+middle+'"  oninput="onChg()" onchange="onChg()"':'<div'
if(id.length>0)s+=' id="'+id+'"'
if(classStr.length>0)s+=' class="'+classStr+'"'
if(type=='rel'){s+=' style="position:relative; '+styleExtra+'"'}
if(type=='abs'){s+=' style="position:absolute; '+styleExtra+'"'}
s+=inpQ?' />':' >'+middle+'</div>'
return s}