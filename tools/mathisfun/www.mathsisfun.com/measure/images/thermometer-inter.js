let my={}
function thermometerinterMain(){let version='0.88';let w=490;let h=490;my.ht=h
my.sliderTp=65;my.sliderLt=20;my.sliderHt=430;my.sliderMin=-40;my.sliderMax=105;let s='';s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none;  margin:auto; display:block;">';s+='<canvas id="canvasId" width="'+w+'" height="'+h+'" style="z-index:1;"></canvas>';s+='<div style="font-size: 16pt; color: #6666ff; position:absolute; top:15px; left:28px; text-align:center;">&deg;C</div>';s+='<div style="font-size: 16pt; color: #00aa00; position:absolute; top:15px; left:120px; text-align:center;">&deg;F</div>';s+='<input type="range" id="r1"  value="0" min="'+my.sliderMin+'" max="'+my.sliderMax+'" step="1" '+
' style="z-index:2; position:absolute; top:262px; left:-135px; width:'+my.sliderHt+'px;'+
' height:17px; border: none; transform: rotate(270deg); margin-left: 10px;" '+
' oninput="updateTemp(0,0)" onchange="updateTemp(0,0)" />';s+=`<div id="sliderLbl" 
    style="font: bold 1rem Verdana; z-index:3; position:absolute; top:9px; left:0px; width:180px;
    border: 2px solid white; border-radius: 9px; padding:5px; background-color: rgba(0,205,0,0.8); text-align: center;">
    </div>`
let degs=[['C','#6666ff',200],['F','#00aa00',360]];for(let i=0;i<2;i++){s+='<div style="position:absolute; left:'+degs[i][2]+'px; top:70px; border: 1px solid black; padding:2px; background-color:'+degs[i][1]+';">';s+='<span id="deg'+degs[i][0]+'" style="display: inline-block; padding: 2px 6px 2px 6px; width:70px; height:28px; background-color: black; color: white; font: bold 1.4rem Arial; text-align: right;"></span>';s+='<span style="display: inline-block; padding: 2px 6px 2px 0px; color: white; font: bold 1.4rem Arial;">&deg;'+degs[i][0]+'</span>';s+='</div>';}
s+='<div style="position:absolute; left:190px; top:130px; width:300px; text-align: center;">';s+='<img id="img" src="images/boil.jpg" style="" />';s+='</div>';s+='<div id="descr" style="position:absolute; left:190px; width:300px; font: bold italic 25px Arial; color:black;  text-align: center;"></div>';s+='<div style="position:absolute; right:3px; bottom:3px; font: 11px Arial; color: blue; ">&copy; 2021 MathsIsFun.com  v'+version+'</div>';s+='</div>';let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script);my.can=canvasInit('canvasId',w,h,3)
drawTherm();my.imgs=["","blizzard.html","snow.html","ice.html","rainy.html","sunny.html","beach.html","desert.html","coffee.html","boil.html",""];preloadImages(my.imgs);updateTemp();window.addEventListener("keydown",onKey,false);}
function onKey(ev){let keyCode=ev.keyCode;if(keyCode==38||keyCode==40){ev.preventDefault();let div=document.getElementById("r1");let c=div.value;if(keyCode==38)c++;if(keyCode==40)c--;c=Math.max(-40,Math.min(c,105));div.value=c;updateTemp();}}
function drawTherm(){let g=my.can.g
g.strokeStyle="#8888ff";g.fillStyle="#6666ff";g.font="bold 14px Verdana";g.textAlign="right";for(let i=my.sliderMin;i<=my.sliderMax;i++){let xP=80;let yP=cToY(i);let tickLen=5;if(i%5==0)tickLen=10;if(i%10==0)tickLen=20;g.beginPath();g.moveTo(xP,yP);g.lineTo(xP-tickLen,yP);g.stroke();if(i%10==0){g.fillText(i,xP-22,yP)}}
g.strokeStyle="#00aa00";g.fillStyle="#00aa00";let fMin=-40;let fMax=my.sliderMax*9/5+32;for(let i=fMin;i<=fMax;i+=2){let xP=100;let c=(i-32)*5/9;let yP=cToY(c);let tickLen=5;if(i%10==0)tickLen=20;g.beginPath();g.moveTo(xP,yP)
g.lineTo(xP+tickLen,yP);g.stroke();if(i%10==0){g.fillText(i,xP+52,yP);}}}
function updateTemp(deg,degType){deg=Number(deg);let sliderEl=document.getElementById("r1");let sliderVal=0;let f=0;switch(degType){case "C":sliderVal=deg;f=(sliderVal*1.8+32);f=Number(f.toPrecision(5)).toString();break;case "F":sliderVal=(deg-32)*5/9;sliderVal=Number(sliderVal.toPrecision(7)).toString();f=deg;break;default:sliderVal=Number(sliderEl.value);f=(sliderVal*1.8+32);f=Number(f.toPrecision(5)).toString();}
sliderEl.value=sliderVal;let ypos=cToY(sliderVal)-55;ypos=Math.max(ypos,0);ypos=Math.min(ypos,my.sliderHt);let div=document.getElementById("sliderLbl");div.style.top=ypos+"px";div.innerHTML=sliderVal+"&deg;&nbsp;C &nbsp; = &nbsp; "+f+"&deg;&nbsp;F";let g=my.can.g
g.clearRect(80,0,20,my.ht);g.fillStyle="#ff6666";ypos=cToY(sliderVal);g.beginPath();g.rect(80,ypos,20,my.ht-ypos);g.fill();document.getElementById('degC').innerHTML=sliderVal.toString();document.getElementById('degF').innerHTML=f.toString();if(degType==0){if(typeof pageTempChg==="function"){pageTempChg(sliderVal,f);}}
doUpdate(sliderVal);}
function cToY(c){return round2((my.sliderMax-c)*((my.sliderHt-15)/(my.sliderMax-my.sliderMin)))+my.sliderTp;}
function round2(x){return parseInt(x*100)/100}
function doUpdate(C){let texts=["<","Very Cold !","Fun in the Snow","Ice","Cool Day","Nice Sunny Day","Fun at the Beach","Hot Desert","Hot Coffee","Boiling Water",">"];let txtHts=[200,200,290,195,200,250,240,240,210,240,200];let clrs=['#000000','#0099FF','#FF66FF','#FFFFFF','#aaaaaa','#C6DF7B','#FFFF00','#EFB67B','#B58E4A','#FF0000','#000000'];let imgNo=0;if(C<-20){imgNo=1;}else if(C<-3){imgNo=2;}else if(C<1){imgNo=3;}else if(C<18){imgNo=4;}else if(C<30){imgNo=5;}else if(C<38){imgNo=6;}else if(C<58){imgNo=7;}else if(C<100){imgNo=8;}else if(C<111){imgNo=9;}else{imgNo=10;}
document.getElementById('img').src='images/'+my.imgs[imgNo];document.getElementById('descr').innerHTML=texts[imgNo];document.getElementById('descr').style.top=(txtHts[imgNo]+50)+'px';document.getElementById('descr').style.color=clrs[imgNo];}
function preloadImages(imgs){for(let i=1;i<imgs.length-1;i++){preloadImage('images/'+imgs[i]);}}
function preloadImage(url){let img=new Image();img.src=url;}
function canvasInit(id,wd,ht,ratio){let el=document.getElementById(id);el.width=wd*ratio;el.style.width=wd+"px";el.height=ht*ratio;el.style.height=ht+"px";let g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);return{el:el,g:g,ratio:ratio}}