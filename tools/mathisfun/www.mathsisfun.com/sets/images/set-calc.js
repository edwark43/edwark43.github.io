var w,h,el,g,my={};function setcalcMain(mode){var version='0.622';my.typ=typeof mode!=='undefined'?mode:'bla';w=Math.min(window.innerWidth-20,500)
h=220;var s='';s+='<div id="main" style="position:relative; max-width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 1px solid black; border-radius: 10px; text-align:center;">';s+='<div style="z-index:2; position: relative;">';var clr='blue'
s+='<textarea id="texta" style="width: 48%; height: 80px; text-align: center; border-radius: 10px; font: 18px Arial; color: #0000ff; color: '+clr+'; background-color: #eeffee; " value="" onKeyUp="go()"></textarea>';s+='<textarea id="textb" style="width: 48%; height: 80px; text-align: center; border-radius: 10px; font: 18px Arial; color: #0000ff; color: '+clr+'; background-color: #eeffee; " value="" onKeyUp="go()"></textarea>';s+='<div style="font: 18px Arial; margin:auto; padding:3px;">';my.types=['union','intersection','difference'];s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+=radioHTML('Type','type',my.types,'go');s+='</div>';s+='<textarea id="textc" style="width: 96%; height: 80px; text-align: center; border-radius: 10px; font: 18px Arial; color: #0000ff; color: '+clr+'; background-color: #eeffee; " value="" onKeyUp="go()"></textarea>';s+='<div id="info" style="width: 96%; border-radius: 10px; font: 15px Arial; color: black; background-color: #def; padding:6px; margin:10px auto;"></div>';s+='</div>';s+='<button id="sortBtn" onclick="sortToggle()" class="togglebtn lo" style="z-index:2; position: relative; ">sort</button>';s+='<button id="swapBtn" onclick="swap()" class="togglebtn hi" style="z-index:2; position: relative; ">swap</button>';s+='<button id="exampleBtn" onclick="example()" class="togglebtn hi" style="z-index:2; position: relative; ">example</button>';s+='<div style="font: 10px Arial; color: #6600cc; position:relative; text-align:right;">&copy; 2019 MathsIsFun.com  v'+version+'&nbsp; &nbsp;</div>';s+='</div>';document.write(s);my.examples=[{a:'a,b,c,d',b:'c,d,e,f'},{a:'a b,c , d,a,a, q a ,a',b:'q,c,d,e,f,w'},{a:'1,3,5,7,9',b:'2,4,6,8,10'},{a:'{a,b,c,d}',b:'{c,d}'},{a:'cow, horse, chicken, dog, cat',b:'cow, horse, dog, cat, mouse'},{a:'a a a a b',b:'b b b b c'},]
my.exampleNo=-1
this.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];console.log("my.typ",my.typ);my.sortQ=false
example()}
function go(){var a=document.getElementById('texta').value
var b=document.getElementById('textb').value
var c=document.getElementById('textc').value
var type=document.querySelector('input[name="type"]:checked').value;console.log('go',a,b,c,type)
var as=parse(a)
as=removeDups(as)
console.log('as',a,as)
var bs=parse(b)
bs=removeDups(bs)
console.log('bs',b,bs)
var cs=[]
var symb=''
switch(type){case 'union':cs=as.slice()
for(var i=0;i<bs.length;i++){var dupq=false
for(var j=0;j<cs.length;j++){if(bs[i]==cs[j]){dupq=true
break}}
if(!dupq)cs.push(bs[i])}
symb='&cup;'
break
case 'intersection':var cs=[]
for(var i=0;i<as.length;i++){var dupq=false
for(var j=0;j<bs.length;j++){if(as[i]==bs[j]){dupq=true
break}}
if(dupq)cs.push(as[i])}
symb='&cap;'
break
case 'difference':var cs=[]
for(var i=0;i<as.length;i++){var dupq=false
for(var j=0;j<bs.length;j++){if(as[i]==bs[j]){dupq=true
break}}
if(!dupq)cs.push(as[i])}
symb='&minus;'
break
default:}
console.log('result cs',cs)
if(my.sortQ){cs=cs.sort(function(a,b){if(isNaN(a)||isNaN(b)){if(a>b)return 1;return-1;}else{return a-b;}});console.log('post sort',cs)}
document.getElementById('textc').value=cs.join(', ')
var s=''
s+='{'+as.join(',')+'} '+symb+' {'+bs.join(',')+'} '+'='+' {'+cs.join(',')+'}'
document.getElementById('info').innerHTML=s}
function example(){my.exampleNo=loop(my.exampleNo,0,my.examples.length-1)
console.log('my.exampleNo',my.exampleNo)
var example=my.examples[my.exampleNo]
document.getElementById('texta').value=example.a
document.getElementById('textb').value=example.b
go()}
function loop(currNo,minNo,maxNo,incr){if(incr===undefined)incr=1;currNo+=incr;console.log('loop',currNo,minNo,maxNo,incr)
var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
function swap(){var a=document.getElementById('texta').value
var b=document.getElementById('textb').value
document.getElementById('textb').value=a
document.getElementById('texta').value=b
go()}
function removeDups(a){var result=[];a.forEach(function(item){if(result.indexOf(item)<0){result.push(item);}});return result}
function parse(s){s=s.trim();s=s.replace(/({|})/gi,"");s=s.replace(/\s*\,\s*/g,",");s=s.replace(/\s+/g,",");while(s[s.length-1]==','||s[s.length-1]==' ')s=s.slice(0,-1);if(s.length==0)return[]
var vals=s.split(",");return vals}
function radioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';for(var i=0;i<lbls.length;i++){var lbl=lbls[i];var idi=id+i;var chkStr=(i==0)?' checked ':'';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');" autocomplete="off" '+chkStr+' >';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function sortToggle(){my.sortQ=!my.sortQ
toggleBtn('sortBtn',my.sortQ)
console.log('sortToggle',my.sortQ)
go()}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi")
document.getElementById(btn).classList.remove("lo")}else{document.getElementById(btn).classList.add("lo")
document.getElementById(btn).classList.remove("hi")}}