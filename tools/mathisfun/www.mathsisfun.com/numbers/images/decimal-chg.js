let my={}
function decimalchgMain(){let version='0.82'
let w=360;let h=150;let s="";s+='<div style="position: relative; text-align: center; margin:auto; max-width:'+w+'px; border-radius: 20px; ">';s+='<input type="text" id="number" class="input" style="font-size: 1.2rem; width:220px; z-index:2; color: #0000ff; background-color: #f0f8ff; text-align:center; border-radius: 10px; " value="3.1416" onKeyUp="updateDec(this.value)" />';s+=wrap('','','rel','font: 0.7rem Arial; color: #6600cc; margin-top:0.3rem;','<input id="aBtn" type="button" class="btn" style="z-index:2; " value="× 10"  onclick="mult10()"/>'+
' &nbsp; '+
'<input id="bBtn" type="button" class="btn" style="z-index:2; " value="÷ 10"  onclick="div10()"/>')
s+=wrap('fracWords','output','rel','font: 1.2rem Arial; margin-top:0.3rem;','')
s+=wrap('','','rel','font: 0.7rem Arial; color: #6600cc; margin-top:0.3rem;',`&copy; 2021 MathsIsFun.com v${version}`)
s+='</div>';document.write(s);updateDec(document.getElementById("number").value);}
function mult10(){let s="";let was=document.getElementById("number").value;let bits=was.split(".");switch(bits.length){case 0:s=0;break;case 1:s=was+"0";break;default:if(bits[1].length==0){s=bits[0]+"0";}else{s=bits[0]+bits[1].charAt(0)+"."+bits[1].substr(1);}}
s=s.replace(/^0+/,'');document.getElementById("number").value=s;updateDec(document.getElementById("number").value);}
function div10(){let s="";let was=document.getElementById("number").value;let bits=was.split(".");if(bits[0].length==0)bits[0]="0";switch(bits.length){case 0:s=0;break;case 1:s=was.substr(0,was.length-1)+"."+was.charAt(was.length-1);break;default:s=bits[0].substr(0,bits[0].length-1)+"."+bits[0].charAt(bits[0].length-1)+bits[1];}
document.getElementById("number").value=s;updateDec(document.getElementById("number").value);}
function updateDec(val){wordObj=new Words();let wordStr=wordObj.num2words(val,false,0,false);document.getElementById("fracWords").innerHTML=wordStr;}
function gcf(n1,n2){let x=1;if(n1>n2){n1=n1+n2;n2=n1-n2;n1=n1-n2;}
if(n2==(Math.round(n2/n1))*n1){x=n1;}else{for(let i=Math.round(n1/2);i>1;i=i-1){if(n1==(Math.round(n1/i))*i)
if(n2==(Math.round(n2/i))*i){x=i;i=-1;}}}
return x;}
String.prototype.repeat=function(count){if(count<1)return '';let result='',pattern=this.valueOf();while(count>1){if(count&1)result+=pattern;count>>=1,pattern+=pattern;}
return result+pattern;};class Words{constructor(){let lang="en";switch(lang){case "en":this.langDescrNumberComma=",";this.langDescrDenomUnit="One";this.langDescrDenomHalves="Halves";this.langDescr10Join=" ";this.langAnd="and";this.langPoint="Point";this.langDescrDenomHyphen="-";this.langDescrDenomOrdQ="y";this.langDescrDenom_th="th";this.langDescrDenom_s="s";this.langNumExact=new Array('Zero');this.langThousands=['','Thousand','Million','Billion','Trillion','Quadrillion','Quintillion','Sextillion','Septillion'];this.langNum=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty','Twenty One','Twenty Two','Twenty Three','Twenty Four','Twenty Five','Twenty Six','Twenty Seven','Twenty Eight','Twenty Nine'];this.langNum10=['Zero','Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];this.langNum100=['Zero','One Hundred','Two Hundred','Three Hundred','Four Hundred','Five Hundred','Six Hundred','Seven Hundred','Eight Hundred','Nine Hundred'];this.langNumer=['Zero'];this.langfirstfractions=[null,'Whole','Half','Third','Quarter'];this.langunitord=['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth'];this.langtenord=['','Tenth','Twentieth','Thirtieth','Fortieth','Fiftieth','Sixtieth','Seventieth','Eightieth','Ninetieth'];break;case "es":this.langDescrNumberComma="";this.langDescrDenomUnit="un";this.langDescrDenomHalves="medios";this.langDescr10Join=" y ";this.langAnd="y";this.langPoint="Point";this.langDescrDenomHyphen=" ";this.langDescrDenomOrdQ="n";this.langDescrDenom_th="avo";this.langDescrDenom_s="s";this.langNumExact=['cero','uno'];this.langNumExact[100]='cien';this.langThousands=['','mil','millón','billón','trillón','cuatrillón','quintillón','sextillón','septillón'];this.langNum=['','un','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve','treinta',[40,'cuarenta'],[50,'cincuenta'],[60,'sesenta'],[70,'setenta'],[80,'ochenta'],[90,'noventa'],[100,'ciento'],[200,'doscientos'],[300,'trescientos'],[400,'cuatrocientos'],[500,'quinientos'],[600,'seiscientos'],[700,'setecientos'],[800,'ochocientos'],[900,'novecientos']];this.langNumer=['cero','un',[21,'veintiún'],[31,'treinta y un'],[41,'cuarenta y un'],[51,'cincuenta y un'],[61,'sesenta y un'],[71,'setenta y un'],[81,'ochenta y un'],[91,'noventa y un']];this.langfirstfractions=['','entero','medio','tercio','cuarto','quinto','sexto','séptimo','octavo','noveno','décimo',[100,'centésimo'],[1000,'milésimo']];this.langunitord=['','Primero','Segundo','Tercero','Cuarto','Quinto','Sexto','Séptimo','Octavo','Noveno','Décimo','Decimoprimero','Decimosegundo','Decimotercero','Decimocuarto','Decimoquinto','Decimosexto','Decimoséptimo','Decimoctavo','Decimonoveno'];this.langtenord=['','Décimo','Vigésimo','Trigésimo','Cuadragésimo','Quincuagésimo','Sexagésimo','Septuagésimo','Octogésimo','Nonagésimo'];break;default:}}
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