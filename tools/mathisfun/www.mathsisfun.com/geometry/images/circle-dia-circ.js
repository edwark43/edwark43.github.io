let my={}
function init(){let version='0.87';let w=280;let h=360;let s="";s+='<div class="js" style="position:relative; width:'+w+'px; height:'+h+'px; margin:auto; display:block;">';s+='<img id="pizza" src="../geometry/images/circle-dia-circ.svg" style="z-index:1; position: absolute; top: 2px; left: 2px;" />';let flds=[{id:'circ',lt:136,tp:2,clr:'#3465a4',fn:'chgCirc'},{id:'dia',lt:148,tp:125,clr:'#000000',fn:'chgDia'},{id:'rad',lt:135,tp:180,clr:'#4e9a06',fn:'chgRad'},{id:'area',lt:145,tp:300,clr:'#ce5c00',fn:'chgArea'},]
for(let i=0;i<flds.length;i++){let fld=flds[i]
s+=wrap({id:fld.id,tag:'inp',pos:'abs',style:'font-size: 17px; top:'+fld.tp+'px; left:'+fld.lt+'px; width:118px; z-index:2; ',fn:fld.fn+'(this.value)'})}
s+='<div style="font: 10px Arial; color: blue; position:absolute; bottom:1px; right:8px;">&copy; 2021 MathsIsFun.com  v'+version+'</div>';s+='</div>';docInsert(s);document.getElementById("dia").value=1;chgDia(1);}
function chgCirc(v){let circ=getNumPart(v);let unit=getUnitPart(v);let radi=circ/(2*Math.PI);document.getElementById("rad").value=fmtNum(radi,unit);document.getElementById("dia").value=fmtNum(radi*2,unit);document.getElementById("area").value=fmtNum(radi*radi*Math.PI,unit,2);}
function chgRad(v){let radi=getNumPart(v);let unit=getUnitPart(v);document.getElementById("dia").value=fmtNum(radi*2,unit);document.getElementById("circ").value=fmtNum(radi*2*Math.PI,unit);document.getElementById("area").value=fmtNum(radi*radi*Math.PI,unit,2);}
function chgDia(v){let diam=getNumPart(v);let unit=getUnitPart(v);document.getElementById("rad").value=fmtNum(diam/2,unit);document.getElementById("circ").value=fmtNum(diam*Math.PI,unit);document.getElementById("area").value=fmtNum(diam*diam*Math.PI/4,unit,2);}
function chgArea(v){let area=getNumPart(v);let unit=getUnitPart(v);let radi=Math.sqrt(area/Math.PI);document.getElementById("rad").value=fmtNum(radi,unit);document.getElementById("dia").value=fmtNum(radi*2,unit);document.getElementById("circ").value=fmtNum(radi*2*Math.PI,unit);}
function getNumPart(text){return splitNum(text,true);}
function getUnitPart(text){return splitNum(text,false);}
function splitNum(text,wantNumQ){let splitCol=0;let isAllNumQ=true;for(let i=0;i<text.length;i++){let isNumQ=false;let charCode=text.charCodeAt(i);if(charCode==45&&i==0)
isNumQ=true;if(charCode==46)
isNumQ=true;if(charCode>=48&&charCode<=57)
isNumQ=true;if(!isNumQ){isAllNumQ=false;splitCol=i;break;}}
if(wantNumQ){if(isAllNumQ){return text;}else{return text.substr(0,splitCol);}}else{if(isAllNumQ){return "";}else{return text.substr(splitCol).trim();}}}
function fmtNum(val,unit,exp){exp=typeof exp!=='undefined'?exp:1;let s="";if(unit.length>0){if(unit.charAt(unit.length-1)=="²"){unit=unit.substr(0,unit.length-1);}
s=fmt(val,7)+" "+unit;if(exp==2)
s+="²";}else{s=fmt(val,10);}
return s;}
function fmt(val,len){return val.toPrecision(len);}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script);}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
s+={btn:()=>{if(cls.length==0)cls='btn'
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>'<div',inp:()=>{if(cls.length==0)cls='input'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input value="'+txt+'"'
s+=fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''
return s},rad:()=>{if(cls.length==0)cls='radio'
return '<form'+(fn.length>0)?(s+=' onclick="'+fn+'"'):''},sel:()=>{if(cls.length==0)cls='select'
return '<select onchange="'+fn+'"'+(lbl.length>0)?'<label class="label">'+lbl+' ':''},sld:()=>'<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"',}[tag]()||''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+={btn:()=>'>'+txt+'</button>',can:()=>'></canvas>',div:()=>' >'+txt+'</div>',inp:()=>('>'+(lbl.length>0)?'></label>':''),rad:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
s+='<input type="radio" id="r'+i+'" name="typ" style="cursor:pointer;" value="'+opts[i][0]+'" '+chk+' />\n'
s+='<label for="r'+i+'" style="cursor:pointer;">'+opts[i][1]+'</label><br/>\n'}
s+='</form>'
return s},sel:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let opt=opts[i]
let idStr=id+i
let chkStr=i==99?' checked ':''
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+opt.descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'
return s},sld:()=>'>',}[tag]()||''
s+='\n'
return s}
init()