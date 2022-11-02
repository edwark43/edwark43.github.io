let my={};function anifracpickMain(){let version='0.852';let w=380;let h=320;my.circle={x:92,y:92,rad:90};my.typs=['pizza','circle','square'];my.typ=my.typs[0];my.numClr='orange';my.denClr='blue';let s="";s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+='<div style="position: relative; text-align: center; margin:auto; max-width:'+w+'px; border-radius: 20px; ">';s+=wrap('','','rel','z-index:22; margin-top:-10px;',getRadioHTML('','typ',my.typs,'chgTyp'))
my.imgHome=(document.domain=='localhost')?'/mathsisfun/numbers/images/':'/numbers/images/'
s+=wrap('','','rel','display:inline-block; height:182px; width:182px; z-index:22;','<div id="clickLbl" style="font: italic 18px Arial; color:black; position:absolute; left:0px; top:0px; border: none; text-align:right; background-color: #ffffaa; z-index: 22;">Click the '+my.typ+' &darr;</div>'+
'<img id="pizza" src="'+my.imgHome+'pizza.jpg" alt="pizza" style="z-index:1; position: absolute; left:'+(my.circle.x-my.circle.rad)+'px; top:'+(my.circle.y-my.circle.rad)+'px; width:'+(my.circle.rad*2)+'px;" />'+
'<canvas id="canShape" width="'+w+'" height="'+h+'" style="z-index:20; position: absolute; top: 0px; left: 0px;"></canvas>');s+=wrap('','','rel','display:inline-block; width:150px; height:130px; ',`
  <canvas id="canUserFrac" style="z-index:20;position: absolute; top: 0px; left: 0px;  "></canvas>`)
let denLt=60
s+=wrap('','','rel','display:inline-block;height:55px; width:155px;','<div style="position: absolute; left:'+(denLt-55)+'px; top:18px; text-align: left; font: 16px arial; color: #6600cc; ">Slices:</div>'+
'<input type="text" class="input" id="den" style="position: absolute; left:'+denLt+'px; top:13px; width: 45px; text-align: center; font-size: 22px; " value="8" onKeyUp="update()" />'+
'<button id="upBtn" class="btn" style="position: absolute; left:'+(denLt+50)+'px; top: 0px; font-size: 14px; z-index:21; " onclick="denUp()" >&#x25B2;</button>'+
'<button id="dnBtn" class="btn" style="position: absolute; left:'+(denLt+50)+'px; top:25px; font-size: 14px; z-index:21; " onclick="denDn()" >&#x25BC;</button>')
s+=wrap('fracWords','output','rel','font: bold italic 1.2rem Arial; z-index:22;','')
s+=wrap('','','rel','margin-top:5px; z-index:22;','Simplest form:')
s+=wrap('simpWords','output','rel','font: italic 1.2rem Arial; z-index:22;','')
s+=wrap('','','rel','font: 0.7rem Arial; color: #6600cc; margin-top:0.3rem;',`&copy; 2021 MathsIsFun.com v${version}`)
s+='</div>';let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script);my.canShape=canvasInit('canShape',(my.circle.rad+2)*2,(my.circle.rad+2)*2,2)
my.sectors=[true];my.fracUser=new Frac('canUserFrac');my.fracUser.drawMe(3,5);let el=my.canShape.el
el.addEventListener('touchmove',function(e){let touch=e.targetTouches[0];e.clientX=touch.clientX;e.clientY=touch.clientY;e.touchQ=true;mouseMove(e);e.preventDefault();});el.addEventListener('mousemove',mouseMove);el.addEventListener('mousedown',mouseDown);my.denom=getDen();document.getElementById("typ0").checked=true;chgTyp(0);document.getElementById('clickLbl').style.visibility='visible';}
function chgTyp(n){my.typ=my.typs[n];document.getElementById('clickLbl').style.visibility='hidden';update();}
function mouseMove(e){let el=my.canShape.el
let rect=el.getBoundingClientRect();let x=(e.clientX-rect.left)-my.circle.x;let y=(e.clientY-rect.top)-my.circle.y;let inQ=false;switch(my.typ){case 'pizza':case 'circle':if(x*x+y*y<my.circle.rad*my.circle.rad)inQ=true;break;case 'square':if(x<-my.circle.rad)break;if(x>my.circle.rad)break;if(y<-my.circle.rad)break;if(y>my.circle.rad)break;inQ=true;break;default:}
if(inQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function mouseDown(e){let el=my.canShape.el
let rect=el.getBoundingClientRect();let x=(e.clientX-rect.left)-my.circle.x;let y=(e.clientY-rect.top)-my.circle.y;switch(my.typ){case 'pizza':case 'circle':if(x*x+y*y<my.circle.rad*my.circle.rad){let angle=Math.atan2(-y,x);if(angle<0)angle+=2*Math.PI;let numer=Math.round(my.denom*angle/(2*Math.PI)-0.5);if(my.sectors[numer]){my.sectors[numer]=!my.sectors[numer];}else{my.sectors[numer]=true;}
update();}
break;case 'square':if(x<-my.circle.rad)break;if(x>my.circle.rad)break;if(y<-my.circle.rad)break;if(y>my.circle.rad)break;let along=x+my.circle.rad;let wd=my.circle.rad*2/my.denom;let numer=Math.round(along/wd-0.5);if(my.sectors[numer]){my.sectors[numer]=!my.sectors[numer];}else{my.sectors[numer]=true;}
update();break;default:}
document.getElementById('clickLbl').style.visibility='hidden';}
function update(){my.denom=getDen()
let g=my.canShape.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)
let numer=0
switch(my.typ){case 'pizza':document.getElementById('pizza').style.visibility='visible';numer=g.drawChosenSectors(my.sectors,my.denom,"rgba(255, 255, 255, 0.0)","rgba(255, 255, 255, 0.85)");break;case 'circle':document.getElementById('pizza').style.visibility='hidden';numer=g.drawChosenSectors(my.sectors,my.denom,"#8888ff","white");break;case 'square':document.getElementById('pizza').style.visibility='hidden';numer=g.drawChosenRectSlices(my.sectors,my.denom,"orange","white");break;default:}
let wordObj=new Words();let wordStr=wordObj.num2words(numer,false,my.denom);document.getElementById("fracWords").innerHTML='"'+wordStr+'"';wordStr=wordObj.num2words(numer,true,my.denom);document.getElementById("simpWords").innerHTML='"'+wordStr+'"';my.fracUser.drawMe(numer,my.denom);}
function getDen(){let n=document.getElementById("den").value;n=n.replace(/,/gm,"");let nNew=Math.max(1,Math.min(n,100))
if(n!=nNew)document.getElementById("den").value=nNew
return nNew}
function denDn(){let n=getDen();if(n>2){n--;document.getElementById("den").value=n;my.denom=n;update();}}
function denUp(){let n=getDen();if(n<100){n++;document.getElementById("den").value=n;my.denom=n;update();}}
CanvasRenderingContext2D.prototype.drawChosenSectors=function(sectors,denom,onClr,offClr){let g=this;let n=0;if(denom>100){let f=100/denom;denom*=f;console.log("drawSectors=",denom);}
let dAngle=2*Math.PI/denom;let angleNum=0;for(let k=0;k<denom;k++){g.beginPath();g.lineWidth=1;g.strokeStyle="black";g.moveTo(my.circle.x,my.circle.y);g.arc(my.circle.x,my.circle.y,my.circle.rad,-angleNum,-angleNum-dAngle,true);g.lineTo(my.circle.x,my.circle.y);g.stroke();if(sectors[k]){g.fillStyle=onClr;g.fill();n++;}else{g.fillStyle=offClr;g.fill();}
angleNum+=dAngle;}
return n;};CanvasRenderingContext2D.prototype.drawChosenRectSlices=function(sectors,denom,onClr,offClr){let g=this;let n=0;if(denom>100){let f=100/denom;denom*=f;console.log("drawSectors=",denom);}
let wd=my.circle.rad*2;let ht=my.circle.rad*2;let lt=my.circle.x-wd/2;let tp=my.circle.y-ht/2;let dWd=wd/denom;let currWd=0;for(let k=0;k<denom;k++){g.beginPath();g.lineWidth=1;g.strokeStyle="black";g.rect(lt+currWd,tp,dWd,ht)
g.stroke();if(sectors[k]){g.fillStyle=onClr;g.fill();n++;}else{g.fillStyle=offClr;g.fill();}
currWd+=dWd;}
return n;};function getRadioHTML(prompt,id,lbls,func){let s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+=prompt;for(let i=0;i<lbls.length;i++){let idi=id+i;let lbl=lbls[i];s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');">';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
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
class Words{constructor(){let lang="en";switch(lang){case "en":this.langDescrNumberComma=",";this.langDescrDenomUnit="One";this.langDescrDenomHalves="Halves";this.langDescr10Join=" ";this.langAnd="and";this.langPoint="Point";this.langDescrDenomHyphen="-";this.langDescrDenomOrdQ="y";this.langDescrDenom_th="th";this.langDescrDenom_s="s";this.langNumExact=new Array('Zero');this.langThousands=['','Thousand','Million','Billion','Trillion','Quadrillion','Quintillion','Sextillion','Septillion'];this.langNum=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty','Twenty One','Twenty Two','Twenty Three','Twenty Four','Twenty Five','Twenty Six','Twenty Seven','Twenty Eight','Twenty Nine'];this.langNum10=['Zero','Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];this.langNum100=['Zero','One Hundred','Two Hundred','Three Hundred','Four Hundred','Five Hundred','Six Hundred','Seven Hundred','Eight Hundred','Nine Hundred'];this.langNumer=['Zero'];this.langfirstfractions=[null,'Whole','Half','Third','Quarter'];this.langunitord=['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth'];this.langtenord=['','Tenth','Twentieth','Thirtieth','Fortieth','Fiftieth','Sixtieth','Seventieth','Eightieth','Ninetieth'];break;case "es":this.langDescrNumberComma="";this.langDescrDenomUnit="un";this.langDescrDenomHalves="medios";this.langDescr10Join=" y ";this.langAnd="y";this.langPoint="Point";this.langDescrDenomHyphen=" ";this.langDescrDenomOrdQ="n";this.langDescrDenom_th="avo";this.langDescrDenom_s="s";this.langNumExact=['cero','uno'];this.langNumExact[100]='cien';this.langThousands=['','mil','millón','billón','trillón','cuatrillón','quintillón','sextillón','septillón'];this.langNum=['','un','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve','treinta',[40,'cuarenta'],[50,'cincuenta'],[60,'sesenta'],[70,'setenta'],[80,'ochenta'],[90,'noventa'],[100,'ciento'],[200,'doscientos'],[300,'trescientos'],[400,'cuatrocientos'],[500,'quinientos'],[600,'seiscientos'],[700,'setecientos'],[800,'ochocientos'],[900,'novecientos']];this.langNumer=['cero','un',[21,'veintiún'],[31,'treinta y un'],[41,'cuarenta y un'],[51,'cincuenta y un'],[61,'sesenta y un'],[71,'setenta y un'],[81,'ochenta y un'],[91,'noventa y un']];this.langfirstfractions=['','entero','medio','tercio','cuarto','quinto','sexto','séptimo','octavo','noveno','décimo',[100,'centésimo'],[1000,'milésimo']];this.langunitord=['','Primero','Segundo','Tercero','Cuarto','Quinto','Sexto','Séptimo','Octavo','Noveno','Décimo','Decimoprimero','Decimosegundo','Decimotercero','Decimocuarto','Decimoquinto','Decimosexto','Decimoséptimo','Decimoctavo','Decimonoveno'];this.langtenord=['','Décimo','Vigésimo','Trigésimo','Cuadragésimo','Quincuagésimo','Sexagésimo','Septuagésimo','Octogésimo','Nonagésimo'];break;default:}}
num2words(numer,reduceQ,denom,decAsFractionQ){if(isNaN(numer))return 0;if(reduceQ){let agcf=gcf(numer,denom);numer/=agcf;denom/=agcf;}
return this.str2words(numer.toString(),reduceQ,denom,decAsFractionQ);}
str2words(num,reduceQ,showdenom,decAsFractionQ){let s="";let negative_flag="";if(num.charAt(0)=="-"){negative_flag='Negative ';num=num.substring(1);}
let origNumber=num;let parts=num.split('.');let integer=parts[0];let decpart=parts[1];let decimalQ=(showdenom!=0||parts.length>1);if(this.langNumExact[integer]!=undefined){s=this.langNumExact[integer];}else{if(showdenom!=0&&this.langNumer[integer]!=undefined){s=this.langNumer[integer];}else{for(let i=0;integer.length>0;i++){let threedig=integer.substr(-Math.min(3,integer.length));integer=integer.substr(0,integer.length-3);if(parseInt(threedig)!=0){if(i==0){s=this.handleThreeDigit(threedig);}else{if(this.langThousands[i]!=undefined){if(s.length==0){s=this.handleThreeDigit(threedig)+' '+this.langThousands[i];}else{s=this.handleThreeDigit(threedig)+' '+this.langThousands[i]+this.langDescrNumberComma+' '+s;}}else{s="A Big Number!";}}}}
s=negative_flag+s;}}
if(decimalQ){if(showdenom!=0){if(origNumber=="1")
s=this.langDescrDenomUnit;s+=' '+this.describeDenom(showdenom,false,origNumber!="1");}else{let decimal="";if(reduceQ){decimal=this.handleDecimal(decpart,true,decAsFractionQ);}else{decimal=this.handleDecimal(decpart,false,decAsFractionQ);}
if(decimal.length>0){if(decAsFractionQ){if(s==this.langNumExact[0]){s=decimal;}else{s+=' '+this.langAnd+' '+decimal;}}else{s+=' '+this.langPoint+' '+decimal;}}else{}}}
return(s);}
placeStr(power10){let numStr="";if(power10>=0){numStr="1"+"0".repeat(power10);}else{if(power10<-9){return "";}
numStr="0."+"0".repeat(-1-power10)+"1";}
let s=this.str2words(numStr);if(s.substr(0,4)=="One "){s=s.substr(4);if(s.substr(0,4)=="One-"){s=s.substr(4);}}
if(s=="One")
s="Unit";s+="s";return(s);}
handleThreeDigit(number){let s="";if(number.length>=3){if(number.charAt(0)!="0"){let hundreds=number.substr(0,1);s+=this.langNum100[hundreds];}
number=number.substr(1);}
let twodig=this.handleTwoDigit(number);if(s.length>0&&twodig.length>0)
s+=' ';s+=twodig;return(s);}
handleTwoDigit(num){num=parseInt(num).toString();if(parseInt(num)<30){return(this.langNum[num]);}
let s="";let units=parseInt(num.toString().substr(-1));let tens=parseInt(num.toString().substr(0,1));if(units==0){s=this.langNum10[tens];}else{s=this.langNum10[tens]+" "+this.langNum[units];}
return(s);}
handleDecimal(numStr,reduceQ,asFractionQ){let s="";if(numStr=="")
return(s);let denominator="1"+"0".repeat(numStr.length);if(reduceQ){}
if(asFractionQ){let num=parseInt(numStr);if(this.langNumer[numStr]!=undefined){s=this.langNumer[numStr];}else{s=this.num2words(num);}
console.log("q1="+denominator);s+=" "+this.describeDenom(parseInt(denominator),false,num!=1);}else{for(let i=0;i<numStr.length;i++){s+=this.num2words(numStr.charAt(i),false,0,false)+" ";}}
return(s);}
describeDenom(denom,callself,pluralq){if(denom==0)
return "undefined";if(denom==2&&pluralq)
return this.langDescrDenomHalves;let s="umptienths";denom=Math.abs(denom);let hyphen=this.langDescrDenomHyphen;if(!callself&&this.langfirstfractions[denom]!=undefined){s=this.langfirstfractions[denom];}else{if(this.langDescrDenomOrdQ=="y"){if(denom<100){if(denom<20){s=this.langunitord[denom];}else{let tens=parseInt(denom/10);let units=denom-tens*10;if(units==0){s=this.langtenord[tens];}else{s=this.num2words(tens*10,false,0)+hyphen+this.langunitord[units];}}}else{let tens=parseInt(denom.toString().slice(-2));let rest=parseInt(denom.toString().substr(0,denom.toString().length-2)+"00");if(tens==0){s=(this.num2words(rest,false,0)).trim()+this.langDescrDenom_th;}else{s=this.num2words(rest,false,0)+" "+this.describeDenom(tens,false);}}}else{s=this.num2words(denom)+this.langDescrDenom_th;}}
if(pluralq&&!callself)
s+=this.langDescrDenom_s;s=s.replace(/,/g,"");s=s.replace(/ /g,hyphen);s=s.replace(hyphen+hyphen,hyphen);return(s);}}
function gcf(n1,n2){let x=1;if(n1>n2){n1=n1+n2;n2=n1-n2;n1=n1-n2;}
if(n2==(Math.round(n2/n1))*n1){x=n1;}else{for(let i=Math.round(n1/2);i>1;i=i-1){if(n1==(Math.round(n1/i))*i)
if(n2==(Math.round(n2/i))*i){x=i;i=-1;}}}
return x;}
class Frac{constructor(canName){this.wd=180;this.ht=120;this.lt=105;this.tp=60;let el=document.getElementById(canName);let ratio=2;el.width=this.wd*ratio;el.height=this.ht*ratio;el.style.width=this.wd+"px";el.style.height=this.ht+"px";this.g=el.getContext("2d");this.g.setTransform(ratio,0,0,ratio,0,0);this.labelsQ=true;this.labels=['Slices we','have:','Total','slices:'];}
drawMe(numer,denom){let plusQ=true;let xp=this.lt;let yp=this.tp;let sz=50;let g=this.g;g.clearRect(0,0,g.canvas.width,g.canvas.height);g.font=(sz*1.5)+"px Arial";g.textAlign="center";g.fillStyle='#def';g.beginPath();g.rect(xp-35,0,70,this.ht);g.fill();if(plusQ){}else{g.fillText("-",xp-18,yp+4);}
g.font="bold "+sz+"px Arial";let up=sz*0.2;let dn=sz*0.95;g.fillStyle=my.numClr;g.fillText(numer,xp,yp-up);g.fillStyle=my.denClr;g.fillText(denom,xp,yp+dn);if(this.labelsQ){g.font="bold "+(sz/4)+"px Arial";g.textAlign="right";g.fillStyle=my.numClr;g.fillText(this.labels[0],xp-40,yp-up-sz/3-7);g.fillText(this.labels[1],xp-40,yp-up-sz/3+7);g.fillStyle=my.denClr;g.fillText(this.labels[2],xp-40,yp+dn-sz/3-7);g.fillText(this.labels[3],xp-40,yp+dn-sz/3+7);}
g.strokeStyle='black';g.beginPath();g.lineWidth=sz/14;g.moveTo(xp-sz*0.6,yp);g.lineTo(xp+sz*0.6,yp);g.stroke();}}