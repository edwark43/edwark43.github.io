let my={}
function mixsliderMain(mode='rat'){let version='0.6';my.mode=mode
my.barBot=195
let s=''
s+='<div style="position: relative; text-align: center; margin:auto; width:400px; border-radius: 20px;  ">';s+=wrap('','','rel','height:22px;','Mix:')
s+=wrap('','','rel','height:35px;',wrap('loVal','input','abs','left:0; top:0; width:60px; text-align: center;','10')+
wrap('mdVal','output','abs','left: 50%; transform: translateX(-50%); top:0; width:60px; text-align: center; font-weight:bold; ','10')+
wrap('hiVal','input','abs','right:0; top:0; width:66px; text-align: center;','20'))
s+=`<input type="range" id="r0"  value="0.4" min="0" max="1" step="0.005" style=" width: 350px; height: 17px; border: none; z-index: 2; padding:2px;" oninput="onChg()" onchange="onChg()" />`
s+=wrap('result','','rel','text-align: center; height:95px;','')
s+=wrap('','','rel','height:22px;','Quantity:')
s+=wrap('','','rel','height:40px;',wrap('loQuant','output','abs','left:0; top:0; width:60px; text-align: center;','10')+
wrap('mdQuant','input','abs','left: 50%; transform: translateX(-50%); top:0; width:60px; text-align: center;','50')+
wrap('hiQuant','output','abs','right:0; top:0; width:66px; text-align: center;','20'))
s+='<br><br>'
s+=wrap('','','rel','font: 11px Arial; color: #6600cc;',`&copy; 2021 MathsIsFun.com v${version}`)
s+=`<div id="bakLo" style="position:absolute; left:20px; top:${my.barBot-100}px; background: #cdf; height: 100px; width: 20px;">&nbsp;</div>`
s+=`<div id="barLo" style="position:absolute; left:20px; top:${my.barBot-100}px; background: blue; height: 10px; width: 20px;">&nbsp;</div>`
s+=`<div id="bakHi" style="position:absolute; left:355px; top:${my.barBot-100}px; background: #cdf; height: 100px; width: 20px;">&nbsp;</div>`
s+=`<div id="barHi" style="position:absolute; left:355px; top:${my.barBot-100}px; background: blue; height: 10px; width: 20px;">&nbsp;</div>`
s+='</div>';document.write(s);onChg()}
function onChg(){let ratio=document.getElementById("r0").value;let loVal=parseFloat(document.getElementById('loVal').value)
let hiVal=parseFloat(document.getElementById('hiVal').value)
let mixVal=loVal*(1-ratio)+hiVal*ratio
document.getElementById('mdVal').innerHTML=fmt(mixVal,14)
let q=parseFloat(document.getElementById('mdQuant').value)
let qLo=q*(1-ratio)
let qHi=q*ratio
document.getElementById('loQuant').innerHTML=fmt(qLo,14)
document.getElementById('hiQuant').innerHTML=fmt(qHi,14)
let s=''
s+=""+fmt(qLo,14)+" of "+loVal
s+="<br>plus "+fmt(qHi,14)+" of "+hiVal
s+="<br>gives "+q+" of "+fmt(mixVal,14)
document.getElementById('result').innerHTML=s
let div=document.getElementById('barLo')
let px=fmt((1-ratio)*100,5)
div.style.top=fmt(my.barBot-px,5)+'px'
div.style.height=px+'px'
div=document.getElementById('barHi')
px=fmt(ratio*100,5)
div.style.top=fmt(my.barBot-px,5)+'px'
div.style.height=px+'px'}
function fmt(num,digits=14){if(num==Number.POSITIVE_INFINITY)return "undefined";if(num==Number.NEGATIVE_INFINITY)return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
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