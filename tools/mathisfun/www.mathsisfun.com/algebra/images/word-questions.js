let w,h,ratio,i,s,el,g,div,dragQ,game,my={};let QNoLast=-1;function wordquestionsMain(filterOp=''){let version='0.63';my.filter={op:filterOp,lvl:0}
my.qPrevs=[]
w=460;h=320;coords=new CoordsFull(w-90,200,'-1','-10,','1000','10',true);tickSparseness=0.04;my.choices=[]
for(let i=0;i<4;i++){my.choices.push({id:'ans'+i})}
my.gameRadioN=0;my.games=[{name:'Add Tens',typ:'add',min:10,max:99,num:[20,100],dec:0},{name:'Add 100s',typ:'add',min:100,max:999,num:[200,1000],dec:0},{name:'Add 1/10ths',typ:'add',min:1,max:20,num:[0,10],dec:1,input:'num'},{name:'Subtract 10s',typ:'sub',min:10,max:50,num:[0,40],dec:0},{name:'Subtract 100s',typ:'sub',min:100,max:500,num:[0,400],dec:0},{name:'Subtract 1/10ths',typ:'sub',min:1,max:20,num:[0,10],dec:1,input:'num'},{name:'Multiply',typ:'mul',min:2,max:10,num:[0,100],dec:0},{name:'Multiply Tens',typ:'mul',min:10,max:30,num:[100,1000],dec:0},{name:'Multiply 1/10ths',typ:'mul',min:2,max:20,num:[0,10],dec:1,input:'num'},];my.score=0
my.numMax=8
this.marks=[];this.midX=w/2;this.midY=h-90;this.width=w-40;let s='';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 2px #666; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: #def; margin:auto; display:block; border: 1px solid black; border-radius: 10px;">';s+='<div id="scorebd" style="font: 16px Verdana; background-color:blue; margin:4px; ">';s+='<div style="display:inline-block; font: 12px Verdana; color:white; margin:4px;">Score:</div>';s+='<div id="score" style="display:inline-block; font: 22px Verdana; color:white; margin:4px; width:90px; ">0</div>';s+='</div>';s+='<div style=" width:'+w+'px;  border-radius:5px; text-align:center; ">';s+='<div id="quest" style="font: 16px Verdana; background-color:lightyellow; margin:12px 0 10px 0; padding: 4px; ">?</div>';s+='<div id="anss" style="font: 20px Verdana; margin:4px; ">'
my.choices.map(choice=>{s+=`<button id="${choice.id}" class="btn" style="font: 16px Verdana; padding:4px 6px 4px 6px; margin:4px;z-index: 10; " onclick="ansClick(this.id)">???</button>`})
s+='</div>';s+='<div id="msg" style="font: 16px Verdana; margin:10px 0 4px 0; min-height:20px;">&nbsp;</div>';s+='<div id="method" style="font: 16px Verdana; background-color:lightblue; margin:4px; min-height:50px; padding:5px;">&nbsp;</div>';s+='</div>';s+=getPopHTML();s+='<div id="btns" style=" text-align:right;">'
s+=' &nbsp; ';s+='<button id="nextBtn" style="height:26px; z-index: 10;" class="btn" onclick="qNext()" >Next ></button>';s+='</div>';s+='<div style="font: 11px Arial; color: #6600cc; position:absolute; bottom:5px; left:'+(w/2-100)+'px; width:200px; text-align:center;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);dragType='';my.clrs=[["Blue",'#0000FF'],["Red",'#FF0000'],["Black",'#000000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F']];clrNum=0;parser=new Parser();my.qs=qsLoad();my.names=namesGet();my.things=thingsLoad();qNext()}
function ontouchstart(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onmouseDown(evt)}
function ontouchmove(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;onmouseMove(evt);evt.preventDefault();}
function ontouchend(evt){el2.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);}
function onmouseDown(evt){if(my.resultQ)return;let bRect=el2.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left);let xVal=numlineVal(mouseX);choose(xVal);if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function onmouseMove(evt){if(my.resultQ)return;let bRect=el2.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left);let mouseY=(evt.clientY-bRect.top);let xVal=numlineVal(mouseX);drawNumLine(g2,50,30,0,10,mouseX,mouseY);}
function numlineVal(mousex){return coords.toXVal(mousex-50);}
function calcScore(diff){let pct=Math.abs(diff/(my.game.num[1]-my.game.num[0]))*100;if(pct<=2){return 5;}else{if(pct<=4){return 4;}else{if(pct<=7){return 3;}else{if(pct<=10){return 2;}else{if(pct<=15)return 1;}}}}
return 0;}
function fancyText(s,x,y){let clr=g.fillStyle;g.fillStyle='#fff';let d=1;g.fillText(s,x-d,y-d);g.fillText(s,x-d,y+d);g.fillText(s,x+d,y+d);g.fillText(s,x+d,y-d);g.fillStyle=clr;g.fillText(s,x,y);}
function qNext(){document.getElementById('msg').innerHTML=''
my.q=qGet();if(my.q==null){return}
my.numMax++
my.numMax=Math.min(my.numMax,20)
console.log('my.numMax',my.numMax)
document.getElementById('quest').innerHTML=my.q.txtStr
let div=document.getElementById('method')
div.style.visibility='hidden'
div.innerHTML=my.q.methodStr
document.getElementById('nextBtn').style.visibility='hidden'
anssGet(my.q)
console.log("qNext",my.q);let i=0
my.choices.map(choice=>{let div=document.getElementById(choice.id)
div.innerHTML=my.q.anss[i++]
div.classList.remove("lo")
div.classList.remove("hi")})}
function ansClick(id){let idNo=parseInt(id.substr(3))
console.log('ansClick',id,idNo)
if(idNo==my.q.ansNo){document.getElementById(id).classList.add("hi")
let div=document.getElementById('msg')
div.style.color='gold'
div.innerHTML='Well done!'
my.score+=5
document.getElementById('score').innerHTML=my.score
document.getElementById('method').style.visibility='visible'
document.getElementById('nextBtn').style.visibility='visible'}else{document.getElementById(id).classList.add("lo")
let div=document.getElementById('msg')
div.style.color='#888'
div.innerHTML='Whoops, that was the wrong answer, try again ...'
my.score-=2
my.score=Math.max(0,my.score)
document.getElementById('score').innerHTML=my.score}}
function qsLoad(){let qs=[];qs.push([2,"y-x",["y>x","Cups:give"],"You chose [x] Cupsx and your friend chose [y] Cupsx. How many more Cupsx did your friend choose?","[y] - [x] = [y-x]"]);qs.push([1,"x+y",["x>2","Cups:give"],"Betty gives John [x] Cupsx. John already had [y] Cupsy. So how many does John have now?","[x] Cupsy + [y] Cupsx = [x+y] Cups"]);qs.push([2,"y-x",["y>6","y>x"],"In your class today, only [x] of the [y] students were at school. How many were absent?","[y] - [x] = [y-x]"]);qs.push([2,"x-y",["x>y","Cups:money"],"You saved [x] Cupsx and your brother saved [y] Cupsy. How many more Cups did you save?","[x] - [y] = [x-y]"]);qs.push([2,"x-y",["x>2","x>y","y>2"],"You have [x] birthday gifts! [y] came from your family, the rest came from your friends. How many gifts did your friends give you?","[x] - [y] = [x-y]"]);qs.push([2,"y-x",["y>x","x>2","Cups:give"],"Your friends just gave you [x] Cupsx, now you have [y].<br>How many did you have before your friends gave you them?","[y] - [x] = [y-x]"]);qs.push([1,"x+y",["y>1","x>1","Cups:gift"],"John got [x] new Cups on his birthday. If he already had [y], how many Cups does he have now?","[x] + [y] = [x+y]"]);qs.push([1,"x-y",["y>1","x>y","Cups:eat"],"John ate [x] Cups and Betty ate [y] Cups. How many more Cups did John eat than Betty?","[x] - [y] = [x-y]"]);qs.push([1,"3x",["x>1"],"How many corners are on [x] triangles?","[x] &times; 3 = [x*3]"]);qs.push([1,"4x",["x>1"],"How many corners are on [x] squares?","[x] &times; 4 = [x*4]"]);qs.push([3,"y",["x>3","y>x","Cups:eat"],"John is preparing Cupsx for the tennis event. He has already prepared [x] Cupsx, but needs [x+y].<br>How many more Cupsx does he need?","[x+y] - [x] = [y]"]);qs.push([1,"x-y",["x>y","y>1","Cups:clr"],"John has [x] Cupsx. [y] are green and the rest are blue. How many Cups are blue?","[x] Cupsx - [y] Cupsy  = [x-y] Cups"]);qs.push([1,"y-x",["x>2","y>x","Cups:give"],"John has just been given [x] Cupsx, he now has [y] Cupsy. How many did he have before?","[y] Cupsx - [x] Cupsy  = [y-x] Cups"]);qs.push([1,"x+y",["x>2","Cups:give"],"John lost [x] Cupsx, and now has only [y] Cupsy. How many did he have before?","[x] Cupsy + [y] Cupsx = [x+y] Cups"]);qs.push([1,"x+y",["x>2","Cups:give"],"John had [x] Cupsx and was given [y] more, how many Cups does he have now?","[x] Cupsy + [y] Cupsx = [x+y] Cups"]);qs.push([1,"x+y",["x>2","Cups:give"],"John has [x] Cupsx and plans to get [y] more tomorrow. How many will he have then?","[x] Cupsy + [y] Cupsx = [x+y] Cups"]);qs.push([1,"x+y",["x>2","Cups:money"],"On Monday John earned [x] Cupsx. On Tuesday he earned [y] Cupsy. How much did he earn on the two days?","[x] Cupsy + [y] Cupsx = [x+y] Cups"]);qs.push([3,"y",["x=30","y>2","y<10"],"It takes [x*y] days to save enough money for my vacation. About how many months is that?","[x*y] &divide; [x] = [(x*y)/x]"]);qs.push([3,"y",["x>6","x<20","y>10","y<30","Cups:give"],"John has [x*y] Cupsx to share among [x] friends. How many Cupsx will each of them receive?","[x*y] &divide; [x] = [y]"]);qs.push([2,"y-x",["x>2","y>x","Cups:give"],"John just gave you [x] Cupsx, now you have [y].<br>How many did you have before he gave you [x] more?","[y] Cupsy - [x] Cupsx = [y-x] Cups"]);qs.push([1,"x+y",["x>2","Cups:give"],"John had [x] Cupsx and was given [y] more, how many Cups does he have now?","[x] Cupsy + [y] Cupsx = [x+y] Cups"]);let qobjs=[];for(let i=0;i<qs.length;i++){let q=qs[i];qobjs.push({lvl:q[0],formula:q[1],cond:q[2],txt:q[3],method:q[4]})}
return qobjs;}
function qGet(){let qs=qsFilter();console.log('qs',qs)
if(qs.length==0)return null
let notInLast=Math.min(my.qPrevs.length,(qs.length/2)<<0)
let qNo=0
let okQ=true
do{qNo=getRandomInt(0,qs.length-1)
okQ=true
for(let i=my.qPrevs.length-1;i>=my.qPrevs.length-notInLast;i--){if(qNo==my.qPrevs[i]){okQ=false
break}}}while(!okQ)
my.qPrevs.push(qNo)
let q=qs[qNo];if(q==null)return null;let qStr=q.txt;let methodStr=q.method;if(methodStr==null){methodStr="";}
vals=[];let GTs=[0,0,0];let maxP1=my.numMax+1
let LTs=[maxP1,maxP1,maxP1];let anss=[];let attempts=0;let OKQ=false
let Name1,Name2
do{for(i=0;i<3;i++){vals[i]=randomInt(GTs[i]+1,LTs[i]-1);}
OKQ=true;for(i=0;i<q.cond.length;i++){let cond=q.cond[i];condarr=getCondArr(cond,["<",">","="]);if(condarr.length==3){let lhs=evalExpr(condarr[0],vals);let condtype=condarr[1];let rhs=evalExpr(condarr[2],vals);if(condarr[0]=="a"){anss.push(condarr[2]);}else{let n=varNo(condarr[0]);if(n>=0){switch(condtype){case ">":GTs[n]=rhs;LTs[n]=Math.max(LTs[n],GTs[n]+2);vals[n]=randomInt(GTs[n]+1,LTs[n]);break;case "<":LTs[n]=rhs;GTs[n]=Math.min(GTs[n],LTs[n]-2);vals[n]=randomInt(GTs[n]+1,LTs[n]);break;case "=":vals[n]=Number(rhs);break;default:}}}}}
attempts++;}while(!OKQ&&attempts<100);if(!OKQ){return(null);}
Name1=my.names[randomInt(0,my.names.length-1)];do{Name2=my.names[randomInt(0,my.names.length-1)];}while(Name2.name==Name1.name);console.log("Name1, Name2",Name1,Name2);let t=my.things.slice(0);for(let i=0;i<q.cond.length;i++){cond=q.cond[i];condarr=getCondArr(cond,[":"])
if(condarr.length==3){condtype=condarr[1];let prop=condarr[2];switch(condtype){case ":":let tnew=[];for(let j=0;j<t.length;j++){let FoundPropQ=false;for(let k=0;k<t[j].props.length;k++){if(prop==t[j].props[k]){FoundPropQ=true;break;}}
if(FoundPropQ)
tnew.push(t[j]);}
if(tnew.length>0){t=tnew.slice(0);}
break;default:}}}
if(t.length==1){let Thing1=t[0];let Thing2=t[0];}else{Thing1=t[randomInt(0,t.length-1)];attempts=0;do{Thing2=t[randomInt(0,t.length-1)];attempts++;}while(Thing2==Thing1&&attempts<100);if(Thing2==Thing1){return(null);}}
console.log('Thing1',Thing1)
q.thing=Thing1
q.txtStr=qFmt(qStr,Name1,Name2,Thing1,Thing2,vals)
console.log('methodStr',methodStr)
q.methodStr=qFmt(methodStr,Name1,Name2,Thing1,Thing2,vals)
return q}
function namesGet(){let names=[{sex:"n",name:"Sam"},{sex:"n",name:"Alex"},{sex:"m",name:"Raj"},{sex:"m",name:"Emir"},{sex:"f",name:"Aisha"},{sex:"n",name:"Jìngyi"},{sex:"n",name:"Li"},{sex:"m",name:"John"},{sex:"m",name:"Henry"},{sex:"m",name:"Patrick"},{sex:"m",name:"Josh"},{sex:"m",name:"Mr Edwards"},{sex:"m",name:"the man"},{sex:"f",name:"Betty"},{sex:"f",name:"Jill"},{sex:"f",name:"Tiffany"},{sex:"f",name:"Sofia"},{sex:"f",name:"Jasmine"},{sex:"f",name:"Mrs Jones"},{sex:"f",name:"the woman"},{sex:"n",name:"the teacher"},{sex:"n",name:"Hunter"},{sex:"n",name:"Billy"},{sex:"n",name:"Angel"},{sex:"n",name:"Drew"},{sex:"n",name:"Jazz"},{sex:"n",name:"Riley"},{sex:"n",name:"Sky"},{sex:"n",name:"Toby"},{sex:"n",name:"Sage"},{sex:"n",name:"Ariel"},{sex:"n",name:"Mason"},{sex:"n",name:"Noel"},]
return names}
function thingsLoad(){let things=[];things.push({one:"apple",many:"apples",props:["eat","give","buy"]});things.push({one:"pear",many:"pears",props:["eat","give","buy"]});things.push({one:"banana",many:"bananas",props:["eat","give","buy"]});things.push({one:"orange",many:"oranges",props:["eat","give","buy"]});things.push({one:"sandwich",many:"sandwiches",props:["eat","give","buy"]});things.push({one:"sausage",many:"sausages",props:["eat","give","buy"]});things.push({one:"salad",many:"salads",props:["eat","give","buy"]});things.push({one:"chocolate",many:"chocolates",props:["eat","give","buy"]});things.push({one:"cupcake",many:"cupcakes",props:["eat","give","buy"]});things.push({one:"pie",many:"pies",props:["eat","give","buy"]});things.push({one:"drink",many:"drinks",props:["eat","give","buy"]});things.push({one:"mouse",many:"mice",props:["give","buy"]});things.push({one:"marble",many:"marbles",props:["clr","gift","give","buy"]});things.push({one:"balloon",many:"balloons",props:["clr","give","buy"]});things.push({one:"toy",many:"toys",props:["clr","give","gift","buy"]});things.push({one:"plant",many:"plants",props:["give","gift","buy"]});things.push({one:"ball",many:"balls",props:["clr","gift","give","buy"]});things.push({one:"cat",many:"cats",props:["4legs"]});things.push({one:"dog",many:"dogs",props:["4legs"]});things.push({one:"horse",many:"horses",props:["4legs"]});things.push({one:"person",many:"people",props:["2legs"]});things.push({one:"bird",many:"birds",props:["bird","2legs","buy"]});things.push({one:"seagull",many:"seagulls",props:["bird","2legs"]});things.push({one:"robin",many:"robins",props:["bird","2legs"]});things.push({one:"blackbird",many:"blackbirds",props:["bird","2legs"]});things.push({one:"pen",many:"pens",props:["clr","give","buy"]});things.push({one:"book",many:"books",props:["give","buy"]});things.push({one:"May",many:"May",props:["month"]});things.push({one:"July",many:"July",props:["month"]});things.push({one:"March",many:"March",props:["month"]});things.push({one:"dollar",many:"dollars",props:["give","money"]});things.push({one:"coin",many:"coins",props:["give","money"]});return things}
function str2Tokens(s){let a=[];while(s.length>0){let bracStt=s.indexOf("[");if(bracStt>-1){let bracEnd=s.indexOf("]",bracStt);if(bracEnd<0){return null;}
let before=s.substr(0,bracStt);let inside=s.substr(bracStt+1,bracEnd-bracStt-1);let after=s.substr(bracEnd+1,s.length-bracEnd-1);if(before.length>0)
a.push(["o",before]);if(inside.length>0)
a.push(["i",inside]);s=after;}else{if(s.length>0)
a.push(["o",s]);s="";}}
return a;}
function doLang(){let Lang="en";switch(Lang){case "en":let LangNo=0;LangMistake="Whoops, that was the wrong answer, try again";LangSuccess="Well Done!";LangSkipQ="(skip question)";LangClue="Clue";break;case "es":LangNo=1;break;default:}}
function qsFilter(){let qs=my.qs.slice(0);if(my.filter.lvl>0){let temp=[];for(let i=0;i<qs.length;i++){if(qs[i][QLevelAt]>=my.filter.lvl-1&&qs[i][QLevelAt]<=my.filter.lvl+1)
temp.push(qs[i]);}
qs=temp.slice(0);}
if(my.filter.op.length>0){let temp=[];for(i=0;i<qs.length;i++){let formula=qs[i].formula
switch(my.filter.op){case "add":if(formula=="x+y"||formula=="y+x")
temp.push(qs[i]);break;case "sub":if(formula=="x-y"||formula=="y-x")
temp.push(qs[i]);break;case "mlt":if(formula=="x*y"||formula=="y*x")
temp.push(qs[i]);break;case "div":if(formula=="x/y"||formula=="y/x")
temp.push(qs[i]);break;default:}}
qs=temp.slice(0);}
return qs}
function qFmt(qStr,Name1,Name2,Thing1,Thing2,vals){qStr=namesChg(qStr,Name1,Name2)
let tokens=str2Tokens(qStr);let tags=["img","/img"];let s="";let plural=0;for(let i=0;i<tokens.length;i++){if(tokens[i][0]=="o"){s+=thingsChg(tokens[i][1],Thing1,Thing2,plural);}else{if(tags.indexOf(tokens[i][1])>=0){s+="["+tokens[i][1]+"]";}else{parser.setVarVal("x",vals[0]);parser.setVarVal("y",vals[1]);parser.setVarVal("z",vals[2]);parser.newParse(tokens[i][1]);let val=parser.getVal();plural=val;s+=val.toString()}}}
s=toSentenceCase(s);return(s);}
function namesChg(qStr,Name1,Name2){qStr=qStr.replace(/ he /gi," %he1 ");qStr=qStr.replace(/ she /gi," %he2 ");qStr=qStr.replace(/ his /gi," %his1 ");qStr=qStr.replace(/ her /gi," %his2 ");console.log('qStr before:',qStr)
qStr=qStr.replace(/John/g,Name1.name);let sex1=Name1.sex=='n'?Math.random()>0.5?'m':'f':Name1.sex
qStr=qStr.replace(/%he1/gi,sex1=='m'?"he":"she");qStr=qStr.replace(/%his1/gi,sex1=='m'?"his":"her");qStr=qStr.replace(/Betty/g,Name2.name);let sex2=Name2.sex=='n'?Math.random()>0.5?'m':'f':Name2.sex
qStr=qStr.replace(/%he2/gi,sex2=='m'?"he":"she");qStr=qStr.replace(/%his2/gi,sex2=='m'?"his":"her");console.log('qStr after:',qStr)
return qStr}
function thingsChg(qStr,Thing1,Thing2,plural){qStr=thingChg(qStr,/Cupsx/g,Thing1,plural);qStr=thingChg(qStr,/Cupsy/g,Thing1,plural);qStr=thingChg(qStr,/Platesx/g,Thing2,plural);qStr=thingChg(qStr,/Platesy/g,Thing2,plural);qStr=thingChg(qStr,/Cups/g,Thing1,plural);qStr=thingChg(qStr,/Plates/g,Thing2,plural);return qStr;}
function thingChg(s,from,thing,plural){if(s.search(from)>-1){return s.replace(from,thingGet(thing,plural))}else{return s}}
function anssGet(q){console.log('anssGet',q)
parser.setVarVal("x",vals[0]);parser.setVarVal("y",vals[1]);parser.setVarVal("z",vals[2]);parser.newParse(q.formula);correctAnswer=parser.getVal();let answers=getWrongAnswers(correctAnswer,true,true);let anspos=randomInt(0,3);answers[anspos]=correctAnswer;if(hasThing(q)){answers=answers.map(ans=>{ans+=' '
ans+=Math.abs(ans)==1?q.thing.one:q.thing.many
return ans})}
q.anss=answers
q.ansNo=anspos}
function hasThing(q){let s=q.txt
if(s.search(/cups/i)>=0)return true
if(s.indexOf('plates')>=0)return true
return false}
function getWrongAnswers(ans,NoNegQ,NoZeroQ){var wrongs=[]
wrongs.push(ans+Math.round(Math.random()*(9-2)+2));wrongs.push(ans-Math.round(Math.random()*(9-2)+2));wrongs.push(ans+1);wrongs.push(ans+2);wrongs.push(ans+3);wrongs.push(ans-1);wrongs.push(ans-2);wrongs.push(ans-3);wrongs.push(ans+10);wrongs.push(ans-10);wrongs.push(ans+20);wrongs.push(ans*2);wrongs.push(ans*2-1);wrongs.push(ans*2+1);wrongs.push(Math.round(ans/2));var temp=[]
for(var i=0;i<wrongs.length;i++){var OKQ=true;if(wrongs[i]==ans)
OKQ=false;if(NoNegQ&&(wrongs[i]<0))
OKQ=false;if(NoZeroQ&&(wrongs[i]==0))
OKQ=false;if(OKQ)
temp.push(wrongs[i]);}
wrongs=temp.slice(0)
wrongs=[...new Set(wrongs)];wrongs.sort(function(){return 0.5-Math.random()});wrongs=wrongs.slice(0,4);return(wrongs);}
function getHe(Gender){let s="";switch(Gender){case "m":s="he";break;case "f":s="she";break;case "n":s=randomInt(0,1)?"he":"she";break;}
return(s);}
function getHis(Gender){let s="";switch(Gender){case "m":s="his";break;case "f":s="her";break;case "n":s=randomInt(0,1)?"his":"her";break;}
return(s);}
function thingGet(ThingObj,n){let s="";if(n==1||n==-1){s=ThingObj.one;}else{s=ThingObj.many;}
return(s);}
function getIs(Num){let s="";if(Num==1){s="is";}else{s="are";}
return(s);}
function setupClues(){cluetypes=getClueTypes();cluelevel=0;LangClueNo=LangClue+" "+(cluelevel+1);}
function newClue(){cluelevel++;LangClueNo=LangClue+" "+(cluelevel+1);if(cluelevel<cluetypes.length){NextBtn.visible=false;ClueBtn.visible=true;}else{NextBtn.visible=true;ClueBtn.visible=false;}
setScore("clue",-25);}
function getClue(level){var s="";for(var i=0;i<clues.length;i++){var clue=clues[i];var OKQ=false;for(var lvl=0;lvl<level;lvl++){if(cluetypes[lvl]=="x"&&clue=="x"){clue=evalExpr(clue,vals).toString();OKQ=true;}
if(cluetypes[lvl]=="y"&&clue=="y"){clue=evalExpr(clue,vals).toString();OKQ=true;}
if(cluetypes[lvl]=="z"&&clue=="z"){clue=evalExpr(clue,vals).toString();OKQ=true;}
if(cluetypes[lvl]=="*"){if(clue=="(")
OKQ=true;if(clue==")")
OKQ=true;if(clue=="+")
OKQ=true;if(clue=="-")
OKQ=true;if(clue=="*"){clue="Ã�";OKQ=true};if(clue=="../index.html")
OKQ=true;}}
if(OKQ){s+=clue;}else{s+="?";}
s+=" ";}
return(s)}
function getClueTypes(){var types=[]();for(var i=0;i<clues.length;i++){clue=clues[i];if(clue=="(")
types.push("*");if(clue==")")
types.push("*");if(clue=="+")
types.push("*");if(clue=="-")
types.push("*");if(clue=="*")
types.push("*");if(clue=="../index.html")
types.push("*");if(clue=="x")
types.push("x");if(clue=="y")
types.push("y");if(clue=="z")
types.push("z");}
return(types.unique().sort())}
function gameNew(){my.score=0;document.getElementById('score').innerHTML=my.score;my.gameQ=true;my.minAns=my.game.num[0];my.maxAns=my.game.num[1];console.log("my",my);drawNumLine(g2,50,30,0,10,0,0);my.ctimer.restart(60);newRound();}
function newRound(){my.resultQ=false;if(!my.gameQ)return;let input='numline';if(my.game.hasOwnProperty('input'))input=my.game.input;let numline=document.getElementById('numlinecan');let numuser=document.getElementById('user');if(input=='numline'){numline.style.visibility='visible';numuser.style.visibility='hidden';}else{numline.style.visibility='hidden';numuser.style.visibility='visible';}
switch(my.game.typ){case 'count':newCountGame();break;case 'add':case 'sub':case 'mul':case 'div':newMathGame(my.game.typ);break;case 'pct':newPctGame();break;default:}}
function newPctGame(){my.tgtN=getRandomInt(5,95);let clr=my.clrs[getRandomInt(0,my.clrs.length-1)][1];console.log("newPctGame",my.game,my.tgtN,clr);let wd=graphWd*0.3+Math.random()*graphWd*0.7;let ht=graphHt*0.1+Math.random()*graphHt*0.3;g.clearRect(0,0,el.width,el.height);g.fillStyle=clr;g.beginPath();g.rect((graphWd/2-wd/2),graphHt/2-ht/2,wd*my.tgtN/100,ht);g.fill();g.strokeStyle='#888';g.lineWidth=2;g.beginPath();g.rect(graphWd/2-wd/2,graphHt/2-ht/2,wd,ht);g.stroke();let div=document.getElementById('user');div.value='';div.focus();}
function newMathGame(typ){let min=my.game.min;let max=my.game.max;let dec=my.game.dec;console.log("newMathGame",min,max,typ,dec);let decAns=dec;let a,b,dec1,dec2
switch(typ){case 'add':my.tgtN=getRandomInt(min*2,max);a=getRandomInt(min,my.tgtN-min);b=my.tgtN-a;if(dec>0){dec1=getRandomInt(0,dec-a.toString().length+1);dec2=getRandomInt(0,dec-b.toString().length+1);if(dec1>0)a*=Math.pow(10,dec1);if(dec2>0)b*=Math.pow(10,dec2);}
my.q=fmtDec(a,dec)+' + '+fmtDec(b,dec)+' =';my.tgtN=fmtDec(a+b,dec)
break;case 'sub':a=getRandomInt(min,max);b=getRandomInt(min,max);if(dec>0){let dec1=getRandomInt(0,dec-a.toString().length+1);let dec2=getRandomInt(0,dec-b.toString().length+1);if(dec1>0)a*=Math.pow(10,dec1);if(dec2>0)b*=Math.pow(10,dec2);}
if(a<b){let t=a
a=b;b=t;}
my.tgtN=fmtDec(a-b,dec)
my.q=fmtDec(a,dec)+' - '+fmtDec(b,dec)+' =';break;case 'mul':a=getRandomInt(min,max);b=getRandomInt(min,max);if(dec>0){dec1=getRandomInt(0,dec);dec2=dec-dec1;decAns=dec*2;if(dec1>0)a*=Math.pow(10,dec1);if(dec2>0)b*=Math.pow(10,dec2);}
my.tgtN=fmtDec(a*b,decAns,true)
my.q=fmtDec(a,dec)+' × '+fmtDec(b,dec)+' =';break;case 'div':a=getRandomInt(min,max);b=getRandomInt(min,max);if(dec>0){dec1=getRandomInt(0,dec);dec2=dec-dec1;decAns=dec*2;if(dec1>0)a*=Math.pow(10,dec1);if(dec2>0)b*=Math.pow(10,dec2);}
my.tgtN=fmtDec(a,dec,true);my.q=fmtDec(a*b,decAns,true)+' / '+fmtDec(b,dec)+' =';break;default:}
document.getElementById('quest').innerHTML=my.q;}
function chgVal(val,doneQ){console.log("chgVal",val,val.length,my.tgtN.toString().length,doneQ);if(doneQ||(val.length==my.tgtN.toString().length)||(Number(val)==Number(my.tgtN))){choose(val);document.getElementById('user').value='';}}
function choose(val){if(!my.gameQ)return;my.resultQ=true;let gap,score
switch(my.game.typ){case 'count':val=Math.round(val);console.log("choose",my.game.typ,val,my.tgtN);g.textAlign='center';g.font='bold 65px Arial';s=''+my.tgtN;g.fillStyle='blue';fancyText(s,w/2,120);if(val==my.tgtN){g.font='bold 40px Arial';s='Exactly Right!';g.fillStyle='gold';fancyText(s,w/2,170);}
let gap=val-my.tgtN;let score=calcScore(gap/2);if(score!=0){my.score+=score;document.getElementById('score').innerHTML=my.score;g.font='36px Arial';s='Score +'+score;g.fillStyle='black';fancyText(s,w/2,250);}
break;case 'pct':val=Math.round(val);console.log("choose",my.game.typ,val,my.tgtN);g.font='bold 44px Arial';g.textAlign='center';s=my.tgtN+'%';g.fillStyle='black';fancyText(s,graphWd/2,graphHt/2+18);gap=val-my.tgtN;score=calcScore(gap);if(score!=0){my.score+=score;document.getElementById('score').innerHTML=my.score;s='Score +'+score;g.fillStyle='black';fancyText(s,w/2,250);}
break;case 'add':case 'sub':case 'mul':case 'div':document.getElementById('quest').innerHTML=my.q+' '+my.tgtN;gap=val-my.tgtN;score=calcScore(gap);if(score!=0){my.score+=score;document.getElementById('score').innerHTML=my.score;}
break;default:}
if(my.gameQ)setTimeout(newRound,1500);}
function getRegular(midX,midY,radius,sttAngle,n){let pts=[];let dAngle=Math.PI*2/n;for(let i=0;i<n;i++){let angle=sttAngle+i*dAngle;let x=midX+radius*Math.cos(angle);let y=midY+radius*Math.sin(angle);pts.push({x:x,y:y});}
return pts;}
function typChg(){let div=document.getElementById('typSel');typ=div.options[div.selectedIndex].text;typ=typ.toLowerCase();console.log("typChg",typ);restart();}
function getCondArr(cond,condtypes){for(let j=0;j<condtypes.length;j++){condarr=splitCond(cond,condtypes[j]);if(condarr.length==3)
break;}
return condarr;}
function splitCond(cond,condtype){if(cond.indexOf(condtype)>-1){let condarr=cond.split(condtype);return([condarr[0],condtype,condarr[1]]);}else{return([]);}}
function evalExpr(expr,vals){let x=0;let no=varNo(expr);if(no>=0){x=vals[no];}else{x=Number(expr);}
return(x);}
function varNo(valName){switch(valName){case "x":return 0;case "y":return 1;case "z":return 2;default:}
return-1;}
function getRadioHTML(prompt,id,lbls,func){let s='';s+='<div style="display:inline-block; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5); width:360px;column-count: 2;" >';for(let i=0;i<lbls.length;i++){s+='<div style="">';let idi=id+i;let lbl=lbls[i];let check='';if(i==0)check='  checked="checked" ';s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');"'+check+'   autocomplete="off" >';s+='<label for="'+idi+'">'+lbl+' </label>';s+='</div>';}
s+='</div>';return s;}
function radioClick(n){my.gameRadioN=n;}
function getPopHTML(){s='';s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+='<div id="editpop" style="position:absolute; left:-450px; top:40px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; font: 14px Arial;  ">';let gms=[];for(let i=0;i<my.games.length;i++){gms.push(my.games[i].name);}
s+=getRadioHTML('','game',gms,'radioClick');s+='<div style="text-align:center;">';s+='<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';s+='<button onclick="editNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';s+='</div>';s+='</div>';return s;}
function editpop(){console.log("editpop");let pop=document.getElementById('editpop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='50px';}
function editYes(){let pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';console.log("editYes",my.fn);my.game=my.games[my.gameRadioN];gameNew();}
function editNo(){let pop=document.getElementById('editpop');pop.style.opacity=0;pop.style.zIndex=1;pop.style.left='-500px';}
function gameOverCallback(){console.log("end!!");my.gameQ=false;g.clearRect(0,0,el.width,el.height);g.textAlign='center';s='Game: '+my.game.name;g.font='36px Arial';g.fillStyle='orange';fancyText(s,w/2,100);s='Total Score: '+my.score;g.font='bold 36px Arial';g.fillStyle='orange';fancyText(s,w/2,145);}
function Timer(g,rad,secs,clr,funcEnd){this.g=g;this.rad=rad;this.secs=secs;this.clr=clr;this.funcEnd=funcEnd;this.x=rad;this.y=rad;this.stt=performance.now();this.stopQ=false;}
Timer.prototype.update=function(){let now=performance.now();let elapsed=now-this.stt;};Timer.prototype.restart=function(secs){this.secs=secs;this.stt=performance.now();this.stopQ=false;requestAnimationFrame(this.draw.bind(this));};Timer.prototype.more=function(secs){this.stt+=secs*1000;};Timer.prototype.stop=function(){this.stopQ=true;};Timer.prototype.draw=function(){if(this.stopQ)return;let now=performance.now();let elapsed=now-this.stt;let ratio=Math.min(1,elapsed/this.secs/1000);let g=this.g;g.beginPath();g.fillStyle="#def";g.arc(this.x,this.y,this.rad,0,2*Math.PI);g.fill();g.beginPath();g.moveTo(this.x,this.y);g.fillStyle=this.clr;g.arc(this.x,this.y,this.rad,-Math.PI/2,ratio*2*Math.PI-Math.PI/2);g.fill();if(ratio<1){requestAnimationFrame(this.draw.bind(this));}else{this.funcEnd();}};function drawNumLine(g,lt,tp,min,max,currx,curry){g.clearRect(0,0,el2.width,el2.height);min=my.minAns;max=my.maxAns;coords=new CoordsFull(w-90,200,min,'-10,',max,'10',true);let wd=coords.width;let ticks=getTicks();g.textAlign='center';g.lineWidth=1;let minV=Infinity;let maxV=-Infinity;let zeroPx=-999;for(let i=0;i<ticks.length;i++){let tick=ticks[i];let majorQ=tick[0];let vStr=tick[3];let v=Number(vStr);let xp=lt+tick[2];if(v>maxV)maxV=v;if(v<minV)minV=v;g.font='16px Arial';let clr='black';if(v<0)clr='red';if(v==0){zeroPx=xp;g.font='22px Arial';clr='black';}
if(v>0)clr='blue';g.strokeStyle=clr;g.fillStyle=clr;let txtY=30;if(vStr.length>5){let lastChr=vStr.replace(/0+$/,'').slice(-1);let evenQ=Number(lastChr)%2==0;if(!evenQ){txtY=50;}}
let tickHt=1;if(majorQ){g.lineWidth=2;tickHt=12;g.fillText(vStr,xp,tp+txtY);}else{g.lineWidth=1;tickHt=8;}
g.beginPath();g.moveTo(xp,tp-tickHt);g.lineTo(xp,tp+tickHt);g.stroke();v+=1;}
if(zeroPx==-999){if(maxV<0)zeroPx=wd;if(minV>0)zeroPx=-1;}
let lnStt=lt-25;let lnEnd=lt+wd+25;if(zeroPx>lnStt){g.strokeStyle='red';g.drawPipe(lnStt+10,tp,Math.min(zeroPx,lnEnd-10),tp,g.strokeStyle);}
if(zeroPx<lnEnd){g.strokeStyle='blue';g.drawPipe(Math.max(zeroPx,lnStt+10),tp,lnEnd-10,tp,g.strokeStyle);}
g.fillStyle=zeroPx>lnStt?'red':'blue';g.beginPath();g.drawArrow(lt-35,tp,30,2,45,25,Math.PI);g.fill();g.fillStyle=zeroPx>lnEnd?'red':'blue';g.beginPath();g.drawArrow(lt+wd+35,tp,30,2,45,25,0);g.fill();if(currx>0&&currx<w){let xVal=numlineVal(currx);let yLn=60;let xStr=Math.round(xVal).toString();g.font='bold 28px Arial';g.textAlign='center';g.fillStyle='black';g.strokeStyle=g.fillStyle;g.fillText(xStr,currx,yLn-38);g.lineWidth=1;g.lineCap='round';let wd=50;yLn=curry;g.strokeStyle='black';g.moveTo(currx-wd/2,yLn);g.lineTo(currx+wd/2,yLn);g.moveTo(currx,yLn-wd/2);g.lineTo(currx,yLn+wd/2);g.stroke();g.beginPath();g.fillStyle='rgba(20,100,255,0.1)';g.arc(currx,yLn,wd/2-5,0,2*Math.PI);g.fill();g.stroke();}
g.fillStyle='gold';g.strokeStyle=g.fillStyle;g.font='bold 17px Arial';g.lineWidth=2;for(i=0;i<marks.length;i++){let mark=marks[i];let rel=coords.num2Rel(mark[0]);if(rel>0&&rel<1){xp=lt+rel*wd;g.fillText(mark[1],xp,tp-25);g.beginPath();g.moveTo(xp,tp);g.lineTo(xp,tp-20);g.stroke();g.drawArrow(xp,tp,20,2,20,10,3*Math.PI/2);g.fill();}}}
function getTicks(){let majorTick=coords.xTickInterval(tickSparseness,true);let minorTick=coords.xTickInterval(tickSparseness,false);let minorTickEvery=majorTick.div(minorTick,0).getNumber();let majorNum=majorTick;let minorNum=majorNum.div(new Num(minorTickEvery.toString()),30);let curNum=coords.xStt;curNum=curNum.div(majorNum,0);curNum=curNum.sub(new Num("1"));curNum=curNum.mult(majorNum);let gap=num2pix(minorNum)-num2pix(new Num("0"));let textWd=majorNum.add(minorNum).fmt().length*9;let labelQ=(textWd<gap);let ticks=[];let tickCount=0;while(curNum.compare(coords.xEnd)<=0&&tickCount<100){tickCount++;let tick=curNum.clone();for(let minorTickNo=0;minorTickNo<minorTickEvery;minorTickNo++,tick=tick.add(minorNum)){if(tick.compare(coords.xStt)<0)
continue;if(tick.compare(coords.xEnd)>0)
continue;let tickPx=num2pix(tick);ticks.push([minorTickNo==0,minorTickNo,tickPx,tick.fmt(10)]);}
curNum=curNum.add(majorNum);}
return ticks;}
function makeCursor(el,typ,clr){let div=document.createElement('canvas');let ctx=div.getContext('2d');let wd
switch(typ){case 'none':break;case 'arrow':wd=24;div.width=wd;div.height=wd;ctx.strokeStyle=clr;ctx.lineWidth=5;ctx.lineCap='round';ctx.moveTo(2,wd-6);ctx.lineTo(2,2);ctx.lineTo(wd-6,2);ctx.moveTo(2,2);ctx.lineTo(wd,wd);ctx.stroke();break;case 'crosshair':wd=30;div.width=wd;div.height=wd;ctx.translate(wd/2,wd/2);div.left=(-wd/2);div.style.left=(-wd/2)+'px';ctx.strokeStyle=clr;ctx.lineWidth=1;ctx.lineCap='round';ctx.moveTo(-wd/2,0);ctx.lineTo(wd/2,0);ctx.moveTo(0,-wd/2);ctx.lineTo(0,wd/2);ctx.stroke();break;default:}
el.style.cursor='url('+div.toDataURL()+'), auto';}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy);}
function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1)+min);}
CanvasRenderingContext2D.prototype.drawPipe=function(x0,y0,x1,y1,clr){let g=this;let alpha=[1.00,0.80,0.60,0.40,0.40,0.20,0.40,0.60,1.00];let size=alpha.length;for(let i=0;i<size;i++){for(let j=0;j<2;j++){if(j==0){g.strokeStyle='#ffffff';}else{g.strokeStyle=hex2rgba(clr,alpha[i]);}
let dist=size/4-i/2;g.beginPath();if(y0==y1){g.moveTo(x0,y0-dist);g.lineTo(x1,y1-dist);}
if(x0==x1){g.moveTo(x0+dist,y0);g.lineTo(x1+dist,y1);}
g.stroke();}}};CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){let g=this;let pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0]];if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2]);}
for(let i=0;i<pts.length;i++){let cosa=Math.cos(-angle);let sina=Math.sin(-angle);let xPos=pts[i][0]*cosa+pts[i][1]*sina;let yPos=pts[i][0]*sina-pts[i][1]*cosa;if(i==0){g.moveTo(x0+xPos,y0+yPos);}else{g.lineTo(x0+xPos,y0+yPos);}}};function CoordsFull(width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.maxDigits=30;this.width=width;this.height=height;this.xStt=new Num(xStt.toString());this.yStt=new Num(yStt.toString());this.xEnd=new Num(xEnd.toString());this.yEnd=new Num(yEnd.toString());this.uniScaleQ=uniScaleQ;this.calcScale();}
CoordsFull.prototype.setCoords=function(xStt,yStt,xEnd,yEnd,uniScaleQ){this.xStt=new Num(xStt.toString());this.yStt=new Num(yStt.toString());this.xEnd=new Num(xEnd.toString());this.yEnd=new Num(yEnd.toString());this.uniScaleQ=uniScaleQ;calcScale();};CoordsFull.prototype.update=function(){calcScale();};CoordsFull.prototype.rel2Num=function(rel){let relNum=new Num(rel.toString());return this.xStt.add(this.xEnd.sub(this.xStt).mult(relNum));};CoordsFull.prototype.num2Rel=function(num){let x0=this.xStt.getNumber();let xv=num.getNumber();let x1=this.xEnd.getNumber();return(xv-x0)/(x1-x0);};CoordsFull.prototype.scale=function(factor,mid){let factNum=new Num((factor-1).toString());let loNum=new Num((0-mid).toString());let hiNum=new Num((1-mid).toString());let rangeNum=this.xEnd.sub(this.xStt);this.xStt=this.xStt.add(rangeNum.mult(factNum).mult(loNum));this.xEnd=this.xEnd.add(rangeNum.mult(factNum).mult(hiNum));this.trimDigits();this.calcScale();};CoordsFull.prototype.moveRel=function(val){let moveNum=this.xEnd.sub(this.xStt).mult(new Num(val.toString()));this.xStt=this.xStt.add(moveNum);this.xEnd=this.xEnd.add(moveNum);this.trimDigits();this.calcScale();};CoordsFull.prototype.trimDigits=function(){this.xStt.trimDigits(this.maxDigits);this.xEnd.trimDigits(this.maxDigits);this.yStt.trimDigits(this.maxDigits);this.yEnd.trimDigits(this.maxDigits);};CoordsFull.prototype.calcScale=function(){let temp=new Num();if(this.xStt.compare(this.xEnd)>0){temp=this.xStt;this.xStt=this.xEnd;this.xEnd=temp;}
let xSpan=this.xEnd.sub(this.xStt);if(xSpan.compare(new Num("0"))<=0)xSpan.setNum("0.1");xScale=xSpan.div(new Num(this.width.toString()),10);};CoordsFull.prototype.toXVal=function(pix){return(this.xStt.add(xScale.mult(new Num(pix.toString())))).getNumber();};CoordsFull.prototype.toXNum=function(pix){return(this.xStt.add(xScale.mult(new Num(pix.toString()))));};CoordsFull.prototype.xTickInterval=function(tickSparseness,majorQ){return this.tickInterval(this.xEnd.sub(this.xStt).mult(new Num(tickSparseness.toString())),majorQ);};CoordsFull.prototype.yTickInterval=function(tickSparseness,majorQ){return this.tickInterval(this.yEnd.sub(this.yStt).mult(new Num(tickSparseness.toString())),majorQ);};CoordsFull.prototype.tickInterval=function(span,majorQ){let mantissa=span.getSci()[0];let intervals=[[7,10,1],[3,1,1],[2,1,0.5],[1,1,0.1]];let interval=null
for(let i=0;i<intervals.length;i++){interval=intervals[i];if(mantissa>=interval[0]||i==intervals.length-1){break;}}
if(majorQ){result=interval[1];}else{result=interval[2];}
let num=new Num(result.toString());num=num.mult10(span.getSci()[1]+1);return num;};function Num(s,base){s=typeof s!=='undefined'?s:'';base=typeof base!=='undefined'?base:10;this.sign=1;this.digits="";this.dec=0;this.setNum(s,base);}
Num.prototype.baseDigits="0123456789ABCDEFGHJKLMNP";Num.prototype.MAXDEC=20;Num.prototype.setNum=function(s,base){base=typeof base!=='undefined'?base:10;if(s==0){this.digits='0';return;}
if(base==10){let digits=s;if(digits.charAt(0)=="-"){this.sign=-1;digits=digits.substring(1);}else{this.sign=1;}
let eVal=0;let ePos=digits.indexOf("e");if(ePos>=0){eVal=(digits.substr(ePos+1))>>0;digits=digits.substr(0,ePos);}
this.dec=digits.length-(digits.indexOf(".")+1);if(this.dec==digits.length){this.dec=0;}
this.dec-=eVal;digits=digits.split(".").join("");digits=digits.replace(/^0+/,'');if(digits.length==0){this.sign=1;}else{let s1="";for(let i=0;i<digits.length;i++){let digit=digits.charAt(i);if(this.baseDigits.indexOf(digit)>=0){s1+=digit;}}
digits=s1;}
this.digits=digits;}else{this.setFromBase(s,base);}};Num.prototype.setFromBase=function(numStr,base){let srcSign="";if(numStr.charAt(0)=="-"){srcSign="-";numStr=numStr.substring(1);}
let baseDec=numStr.length-(numStr.indexOf(".")+1);if(baseDec==numStr.length){baseDec=0;}
numStr=numStr.split(".").join("");numStr=numStr.replace(/^0+/,'');if(numStr.length==0){this.setNum("0");}else{let i=0;let len=numStr.length;let baseStr=base.toString();let digit=this.baseDigits.indexOf(numStr.charAt(i++).toUpperCase()).toString();let result=digit;while(i<len){digit=this.baseDigits.indexOf(numStr.charAt(i++).toUpperCase()).toString();result=this.fullMultiply(result,baseStr);result=this.fullAdd(result,digit);}
if(baseDec>0){let divBy=this.fullPower(baseStr,baseDec);result=this.fullDivide(result,divBy,this.MAXDEC);}
this.setNum(srcSign+result);}};Num.prototype.toBase=function(base,places){let parts=this.splitWholeFrac();let s=this.fullBaseWhole(parts[0],base);if(parts[1].length>0){s+="."+this.fullBaseFrac(parts[1],base,places);}
if(this.sign==-1){if(s!="0"){s="-"+s;}}
return s;};Num.prototype.getNumber=function(){return Number(this.fmt(10,0));};Num.prototype.mult10=function(n){let xNew=this.clone();xNew.dec=xNew.dec-n;if(xNew.dec<0){xNew.digits=xNew.digits+"0".repeat(-xNew.dec);xNew.dec=0;}
return xNew;};Num.prototype.clone=function(){let ansNum=new Num();ansNum.digits=this.digits;ansNum.dec=this.dec;ansNum.sign=this.sign;return ansNum;};Num.prototype.mult=function(num){return this.multNums(this,num);};Num.prototype.fullMultiply=function(x,y){return this.multNums(new Num(x),new Num(y)).fmt();};Num.prototype.multNums=function(xNum,yNum){let N1=xNum.digits;let N2=yNum.digits;let ans="0";for(let i=N1.length-1;i>=0;i--){ans=this.fullAdd(ans,(this.fullMultiply1(N2,N1.charAt(i))+"0".repeat(N1.length-i-1)));}
let ansNum=new Num(ans);ansNum.dec=xNum.dec+yNum.dec;ansNum.sign=xNum.sign*yNum.sign;return ansNum;};Num.prototype.fullMultiply1=function(x,y1){let carry="0";let ans="";for(let i=x.length-1;i>(-1);i--){let product=((x.charAt(i))>>0)*(y1>>0)+(carry>>0);let prodStr=product.toString();if(product<10){prodStr="0"+prodStr;}
carry=prodStr.charAt(0);ans=prodStr.charAt(1)+ans;}
if(carry!="0"){ans=carry+ans;}
return ans;};Num.prototype.fullMultiplyInt=function(x,y){let xLen=x.length;let yLen=y.length;if(xLen==0)return "0";if(yLen==0)return "0";if(xLen+yLen<=9){return(parseInt(x)*parseInt(y)).toString();}
let maxLen=Math.max(xLen,yLen);let split=Math.ceil(maxLen/2);if(xLen<yLen){let temp=x;x=y;y=temp;let tInt=xLen;xLen=yLen;yLen=tInt;}
let xSplit=xLen-split;let x0;let x1;x0=x.substr(xSplit,split);x1=x.substr(0,xSplit);let ySplit=yLen-split;let y0;let y1;let ans="0";if(ySplit<=0){let w2=this.fullMultiplyInt(x0,y);let w1=this.fullMultiplyInt(x1,y);w1=w1+'0'.repeat(split);ans=this.fullAdd(w1,w2);}else{y0=y.substr(ySplit,split);y1=y.substr(0,ySplit);let z0=this.fullMultiplyInt(x1,y1);let z2=this.fullMultiplyInt(x0,y0);let z1=this.fullMultiplyInt(this.fullAdd(x1,x0),this.fullAdd(y1,y0));z1=this.fullSubtract(z1,z2);z1=this.fullSubtract(z1,z0);z0=z0+'0'.repeat(split*2);z1=z1+'0'.repeat(split);ans=this.fullAdd(this.fullAdd(z0,z1),z2);}
return ans;};Num.prototype.abs=function(){let ansNum=this.clone();ansNum.sign=1;return ansNum;};Num.prototype.fullAdd=function(x,y){return this.addNums(new Num(x),new Num(y)).fmt(10);};Num.prototype.add=function(num){return this.addNums(this,num);};Num.prototype.addNums=function(xNum,yNum){let ansNum=new Num();if(xNum.sign*yNum.sign==-1){ansNum=this.subNums(xNum.abs(),yNum.abs());if(xNum.sign==-1){ansNum.sign*=-1;}
return ansNum;}
let maxdec=Math.max(xNum.dec,yNum.dec);let xdig=xNum.digits+"0".repeat(maxdec-xNum.dec);let ydig=yNum.digits+"0".repeat(maxdec-yNum.dec);let maxlen=Math.max(xdig.length,ydig.length);xdig="0".repeat(maxlen-xdig.length)+xdig;ydig="0".repeat(maxlen-ydig.length)+ydig;let ans="";let carry=0;for(let i=xdig.length-1;i>=0;i--){let temp=((xdig.charAt(i))>>0)+((ydig.charAt(i))>>0)+carry;if((temp>=0)&&(temp<20)){if(temp>9){carry=1;ans=temp-10+ans;}else{carry=0;ans=temp+ans;}}}
if(carry==1){ans="1"+ans;}
ansNum.setNum(ans);ansNum.sign=xNum.sign;ansNum.dec=maxdec;return ansNum;};Num.prototype.fullPower=function(x,n){return this.expNums(new Num(x),n).fmt();};Num.prototype.expNums=function(xNum,nInt){let n=nInt;let b2pow=0;while((n&1)==0){b2pow++;n>>=1;}
let x=xNum.digits;let r=x;while((n>>=1)>0){x=this.fullMultiply(x,x);if((n&1)!=0){r=this.fullMultiply(r,x);}}
while(b2pow-->0){r=this.fullMultiply(r,r);}
let ansNum=new Num(r);ansNum.dec=xNum.dec*nInt;return ansNum;};Num.prototype.div=function(num,decimals){return this.divNums(this,num,decimals);};Num.prototype.fullDivide=function(x,y,decimals){return this.divNums(new Num(x),new Num(y),decimals).fmt();};Num.prototype.divNums=function(xNum,yNum,decimals){decimals=typeof decimals!=='undefined'?decimals:this.MAXDEC;if(xNum.digits.length==0){return new Num("0");}
if(yNum.digits.length==0){return new Num("0");}
let xDec=xNum.mult10(decimals);let fullDec=Math.max(xDec.dec,yNum.dec);let xdig=xDec.digits+"0".repeat(fullDec-xDec.dec);let ydig=yNum.digits+"0".repeat(fullDec-yNum.dec);xdig=xdig.replace(/^0+/,'');if(this.compareDigits(xdig,"0")==0){return new Num("0");}
ydig=ydig.replace(/^0+/,'');if(this.compareDigits(ydig,"0")==0){return new Num("0");}
let timestable=[];timestable.push("0");timestable.push(ydig);let tdig=ydig;for(let i=2;i<10;i++){tdig=this.fullAdd(tdig,ydig);timestable.push(tdig);}
let ans="0";let xNew=xdig;let n=0;while(this.compareDigits(xNew,ydig)>=0){let col=1;while(this.compareDigits(xNew.substring(0,col),ydig)<0){col++;}
let xCurr=xNew.substring(0,col);let mult=9;while(this.compareDigits(timestable[mult],xCurr)>0){mult--;}
let fullmult=mult+""+"0".repeat(xNew.length-xCurr.length);ans=this.fullAdd(ans,fullmult);xNew=this.fullSubtract(xNew,this.fullMultiply(ydig,fullmult));if(n++>100){console.log("runaway code divNums");break;}}
let ansNum=new Num(ans);ansNum.dec=decimals;ansNum.sign=xNum.sign*yNum.sign;return ansNum;};Num.prototype.sub=function(num){return this.subNums(this,num);};Num.prototype.fullSubtract=function(x,y){return this.subNums(new Num(x),new Num(y)).fmt();};Num.prototype.subNums=function(xNum,yNum){let ansNum=new Num();if(xNum.sign*yNum.sign==-1){ansNum=xNum.abs().add(yNum.abs());if(xNum.sign==-1){ansNum.sign*=-1;}
return ansNum;}
let maxdec=Math.max(xNum.dec,yNum.dec);let xdig=xNum.digits+"0".repeat(maxdec-xNum.dec);let ydig=yNum.digits+"0".repeat(maxdec-yNum.dec);let maxlen=Math.max(xdig.length,ydig.length);xdig="0".repeat(maxlen-xdig.length)+xdig;ydig="0".repeat(maxlen-ydig.length)+ydig;let sign=this.compareDigits(xdig,ydig);if(sign==0){return new Num("0");}
if(sign==-1){let temp=xdig;xdig=ydig;ydig=temp;}
let ans="";let isborrow=0;for(let i=xdig.length-1;i>=0;i--){let xPiece=(xdig.charAt(i))>>0;let yPiece=(ydig.charAt(i))>>0;if(isborrow==1){isborrow=0;xPiece=xPiece-1;}
if(xPiece<0){xPiece=9;isborrow=1;}
if(xPiece<yPiece){xPiece=xPiece+10;isborrow=1;}
ans=(xPiece-yPiece)+ans;}
ansNum.setNum(ans);ansNum.sign=sign*xNum.sign;ansNum.dec=maxdec;return ansNum;};Num.prototype.fmt=function(sigDigits,eStt){sigDigits=typeof sigDigits!=='undefined'?sigDigits:0;eStt=typeof eStt!=='undefined'?eStt:0;let decWas=this.dec;let digitsWas=this.digits;if(this.digits.length<sigDigits){this.dec+=sigDigits-this.digits.length;this.digits+=strRepeat("0",sigDigits-this.digits.length);}
let s=this.digits;let decpos=s.length-this.dec;let roundQ=false;let roundType="5up";if(roundQ){if(this.digits.length>sigDigits){let cutDigit="";if(sigDigits>=0){s=this.digits.substr(0,sigDigits);cutDigit=this.digits.charAt(sigDigits);}else{s="";cutDigit="";}
switch(roundType){case "5up":if(cutDigit>"5"||(cutDigit=="5"&&this.sign==1)){s=this.fullAdd(s,"1",10);}
break;case "5down":if(cutDigit>"5"||(cutDigit=="5"&&this.sign==-1)){s=fullAdd(s,"1");}
break;case "5away0":if(cutDigit>="5"){s=fullAdd(s,"1");}
break;case "5to0":if(cutDigit>"5"){s=fullAdd(s,"1");}
break;case "5even":if(cutDigit>"5"){s=fullAdd(s,"1");}else{if(cutDigit=="5"){if((parseInt(s.charAt(s.length-1))&1)!=0){s=fullAdd(s,"1");}}}
break;case "5odd":if(cutDigit>"5"){s=fullAdd(s,"1");}else{if(cutDigit=="5"){if((parseInt(s.charAt(s.length-1))&1)==0){s=fullAdd(s,"1");}}}
break;case "floor":if(sigDigits<0){decpos-=sigDigits;if(this.sign==-1){s="1";}else{s="";}}else{if(this.sign==-1){if(Strings.trimLeft(digits.substr(sigDigits),"0").length!=0){s=fullAdd(s,"1");}}}
break;case "ceiling":if(sigDigits<0){decpos-=sigDigits;if(this.sign==1){s="1";}else{s="";}}else{if(this.sign==1){if(Strings.trimLeft(digits.substr(sigDigits),"0").length!=0){s=fullAdd(s,"1");}}}
break;default:}
if(s.length>sigDigits){if(sigDigits>0)
s=s.substr(0,sigDigits);decpos++;}
if(s.length==0){s="0";}else{if(decpos-sigDigits>0)
s+="0".repeat(decpos-sigDigits);}}}
let eVal=decpos-1;if(eStt>0&&Math.abs(eVal)>=eStt){let s1=s.substr(0,1)+"."+s.substr(1);s1=s1.replace(/0+$/,'');if(s1.charAt(s1.length-1)=="."){s1=s1.substr(0,s1.length-1);}
if(eVal>0){s=s1+"e+"+eVal;}else{s=s1+"e"+eVal;}}else{if(decpos<0){s="0."+"0".repeat(-decpos)+s;}else if(decpos==0){s="0."+s;}else if(decpos>0){if(this.dec>=0){s=s.substr(0,decpos)+"."+s.substr(decpos,this.dec);}else{s=s+"0".repeat(-this.dec)+".";}}
if(s.indexOf(".")>=0){s=s.replace(/0+$/,'');}
if(s.charAt(s.length-1)=="."){s=s.substring(0,s.length-1);}}
if(this.sign==-1){if(s!="0"){s="-"+s;}}
this.dec=decWas;this.digits=digitsWas;return s;};Num.prototype.compare=function(yNum){return this.compareNums(this,yNum);};Num.prototype.compareNums=function(xNum,yNum){if(xNum.digits.length==0)
xNum.sign=1;if(xNum.digits=="0")
xNum.sign=1;if(yNum.digits.length==0)
yNum.sign=1;if(yNum.digits=="0")
yNum.sign=1;if(xNum.sign==1&&yNum.sign==-1){return 1;}
if(xNum.sign==-1&&yNum.sign==1){return-1;}
let maxdec=Math.max(xNum.dec,yNum.dec);let xdig=xNum.digits+strRepeat("0",maxdec-xNum.dec);let ydig=yNum.digits+strRepeat("0",maxdec-yNum.dec);let maxlen=Math.max(xdig.length,ydig.length);xdig=strRepeat("0",maxlen-xdig.length)+xdig;ydig=strRepeat("0",maxlen-ydig.length)+ydig;for(let i=0;i<xdig.length;i++){if(xdig.charAt(i)<ydig.charAt(i)){return-1*xNum.sign;}
if(xdig.charAt(i)>ydig.charAt(i)){return 1*xNum.sign;}}
return 0;};Num.prototype.compareDigits=function(x,y){if(x.length>y.length){return 1;}
if(x.length<y.length){return-1;}
for(let i=0;i<x.length;i++){if(x.charAt(i)<y.charAt(i)){return-1;}
if(x.charAt(i)>y.charAt(i)){return 1;}}
return 0;};Num.prototype.splitWholeFrac=function(){let s=this.digits;let decpos=s.length-this.dec;if(decpos<0){s="0".repeat(-decpos)+s;decpos=0;}
if(this.dec<0){s=s+"0".repeat(-this.dec)+".";}
let wholePart=s.substr(0,decpos);let fracPart=s.substr(decpos);if(fracPart.replace(/^0+/,'').length==0){fracPart="";}else{fracPart="0."+fracPart;}
return[wholePart,fracPart];};Num.prototype.fullBaseWhole=function(d,base){let baseStr=base.toString();let dWhole=this.fullDivide(d,baseStr,0);let dRem=this.fullSubtract(d,this.fullMultiply(dWhole,baseStr));if(dWhole=="0"){return this.baseDigits.charAt(dRem>>0);}else{return this.fullBaseWhole(dWhole,base)+this.baseDigits.charAt(dRem>>0);}};Num.prototype.fullBaseFrac=function(d,base,places,level){level=typeof level!=='undefined'?level:0;let r=this.fullMultiply(d,base.toString());let parts=r.split(".");let wholePart=parts[0];if(parts.length==1||level>=places-1){return this.baseDigits.charAt(wholePart>>0);}else{let fracPart="0."+parts[1];return this.baseDigits.charAt(wholePart>>0)+this.fullBaseFrac(fracPart,base,places,level+1);}};Num.prototype.getSignStr=function(){if(this.sign==-1){return "-";}else{return "";}};Num.prototype.getWholeStr=function(){let s=this.digits;let decpos=s.length-this.dec;if(decpos<0){s="0".repeat(-decpos)+s;decpos=0;}
if(this.dec<0){s=s+"0".repeat(-this.dec)+".";}
return s.substr(0,decpos);};Num.prototype.getDecStr=function(){let s=this.digits;let decpos=s.length-this.dec;if(decpos<0){s="0".repeat(-decpos)+s;decpos=0;}
if(this.dec<0){s=s+"0".repeat(-this.dec)+".";}
return s.substr(decpos);};Num.prototype.fullProdSeq=function(n0,n1){if(n0==n1)return n1.toString();let nMid=((n1+n0)/2)<<0;return(this.fullMultiplyInt(this.fullProdSeq(n0,nMid),this.fullProdSeq(nMid+1,n1)));};Num.prototype.getSci=function(){let len=this.digits.length;let s=this.digits.substr(0,1)+"."+this.digits.substr(1);s=s.replace(/0+$/,'');if(s.charAt(s.length-1)=="."){s=s.substr(0,s.length-1);}
if(this.sign==-1){s="-"+s;}
return[s,len-this.dec-1];};Num.prototype.fullCombPerm=function(n,r,orderQ,replaceQ){let i=1;let s="";if(orderQ){if(replaceQ){s=this.fullPower(n.toString(),r);}else{if(r>n){s="";}else{s=this.fullProdSeq(n-r+1,n);}}}else{let tops=[];let bots=[];if(replaceQ){if(false){}else{for(i=n;i<=n+r-1;i++){tops.push(i);}
for(i=2;i<=r;i++){bots.push(i);}}}else{if(r>n){s="";}else{if(r<n-r){for(i=n-r+1;i<=n;i++){tops.push(i);}
for(i=2;i<=r;i++){bots.push(i);}}else{for(i=n-(n-r)+1;i<=n;i++){tops.push(i);}
for(i=2;i<=n-r;i++){bots.push(i);}}}}
cancelFrac(tops,bots);s="1";for(i=0;i<tops.length;i++){s=this.fullMultiplyInt(s,tops[i].toString());}}
return s;};Num.prototype.trimDigits=function(trimToLen){if(this.digits.length>trimToLen){let origLen=this.digits.length;this.digits=this.digits.substr(0,trimToLen);this.dec-=(origLen-this.digits.length);}};function strRepeat(chr,count){let s="";while(count>0){s+=chr;count-=1;}
return s;}
function Parser(){this.operators="+-*(/),^.";this.rootNode;this.tempNode=[];this.Variable="x";this.errMsg="";this.radiansQ=true;this.vals=[];for(let i=0;i<26;i++){this.vals[i]=0;}
this.reset();}
Parser.prototype.setVarVal=function(varName,newVal){switch(varName){case "x":this.vals[23]=newVal;break;case "y":this.vals[24]=newVal;break;case "z":this.vals[25]=newVal;break;default:if(varName.length==1){this.vals[varName.charCodeAt(0)-'a'.charCodeAt(0)]=newVal;}}};Parser.prototype.getVal=function(){return(this.rootNode.walk(this.vals));};Parser.prototype.newParse=function(s){this.reset();s=s.split(" ").join("");s=s.split("�").join("../index.html");s=s.split("[").join("(");s=s.split("]").join(")");s=s.replace(/\u2212/g,'-');s=s.replace(/\u00F7/g,'../index.html');s=s.replace(/\u00D7/g,'*');s=s.replace(/\u00B2/g,'^2');s=s.replace(/\u00B3/g,'^3');s=s.replace(/\u221a/g,'sqrt');s=this.fixParentheses(s);s=this.fixUnaryMinus(s);s=this.fixImplicitMultply(s);this.rootNode=this.parse(s);};Parser.prototype.fixParentheses=function(s){let sttParCount=0;let endParCount=0;for(let i=0;i<s.length;i++){if(s.charAt(i)=="(")sttParCount++;if(s.charAt(i)==")")endParCount++;}
while(sttParCount<endParCount){s="("+s;sttParCount++;}
while(endParCount<sttParCount){s+=")";endParCount++;}
return(s);};Parser.prototype.fixUnaryMinus=function(s){let x=s+"\n";let y="";let OpenQ=false;let prevType="(";let thisType="";for(let i=0;i<s.length;i++){let c=s.charAt(i);if(c>="0"&&c<="9"){thisType="N";}else{if(this.operators.indexOf(c)>=0){if(c=="-"){thisType="-";}else{thisType="O";}}else{if(c=="."||c==this.Variable){thisType="N";}else{thisType="C";}}
if(c=="("){thisType="(";}
if(c==")"){thisType=")";}}
x+=thisType;if(prevType=="("&&thisType=="-"){y+="0";}
if(OpenQ){switch(thisType){case "N":break;default:y+=")";OpenQ=false;}}
if(prevType=="O"&&thisType=="-"){y+="(0";OpenQ=true;}
y+=c;prevType=thisType;}
if(OpenQ){y+=")";OpenQ=false;}
return(y);};Parser.prototype.fixImplicitMultply=function(s){let x=s+"\n";let y="";let prevType="?";let prevName="";let thisType="?";let thisName="";for(let i=0;i<s.length;i++){let c=s.charAt(i);if(c>="0"&&c<="9"){thisType="N";}else{if(this.operators.indexOf(c)>=0){thisType="O";thisName="";}else{thisType="C";thisName+=c;}
if(c=="("){thisType="(";}
if(c==")"){thisType=")";}}
x+=thisType;if(prevType=="N"&&thisType=="C"){y+="*";thisName="";}
if(prevType=="N"&&thisType=="("){y+="*";}
if(prevType==")"&&thisType=="("){y+="*";}
if(thisType=="("){switch(prevName){case "i":case "pi":case "e":case "a":case this.Variable:y+="*";break;}}
y+=c;prevType=thisType;prevName=thisName;}
return(y);};Parser.prototype.reset=function(){this.tempNode=[];this.errMsg="";};Parser.prototype.parse=function(s){if(s==""){return new MathNode("real","0",this.radiansQ);}
if(isNumeric(s)){return new MathNode("real",s,this.radiansQ);}
if(s.charAt(0)=="$"){if(isNumeric(s.substr(1))){return this.tempNode[Number(s.substr(1))];}}
let sLo=s.toLowerCase();if(sLo.length==1){if(sLo>="a"&&sLo<="z"){return new MathNode("var",sLo,this.radiansQ);}}
switch(sLo){case "pi":return new MathNode("var",sLo,this.radiansQ);}
let bracStt=s.lastIndexOf("(");if(bracStt>-1){let bracEnd=s.indexOf(")",bracStt);if(bracEnd<0){this.errMsg+="Missing ')'\n";return new MathNode("real","0",this.radiansQ);}
let isParam=false;if(bracStt==0){isParam=false;}else{let prefix=s.substr(bracStt-1,1);isParam=this.operators.indexOf(prefix)<=-1;}
if(!isParam){this.tempNode.push(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)));return this.parse(s.substr(0,bracStt)+"$"+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1));}else{let startM=-1;for(let u=bracStt-1;u>-1;u--){let found=this.operators.indexOf(s.substr(u,1));if(found>-1){startM=u;break;}}
nnew=new MathNode("func",s.substr(startM+1,bracStt-1-startM),this.radiansQ);nnew.addchild(this.parse(s.substr(bracStt+1,bracEnd-bracStt-1)));this.tempNode.push(nnew);return this.parse(s.substr(0,startM+1)+"$"+(this.tempNode.length-1).toString()+s.substr(bracEnd+1,s.length-bracEnd-1));}}
let k;let k1=s.lastIndexOf("+");let k2=s.lastIndexOf("-");if(k1>-1||k2>-1){if(k1>k2){k=k1;let nnew=new MathNode("op","add",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}else{k=k2;nnew=new MathNode("op","sub",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}}
k1=s.lastIndexOf("*");k2=s.lastIndexOf("../index.html");if(k1>-1||k2>-1){if(k1>k2){k=k1;nnew=new MathNode("op","mult",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}else{k=k2;nnew=new MathNode("op","div",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}}
k=s.indexOf("^");if(k>-1){nnew=new MathNode("op","pow",this.radiansQ);nnew.addchild(this.parse(s.substr(0,k)));nnew.addchild(this.parse(s.substr(k+1,s.length-k-1)));return nnew;}
if(isNumeric(s)){return new MathNode("real",s,this.radiansQ);}else{if(s.length==0){return new MathNode("real","0",this.radiansQ);}else{this.errMsg+="'"+s+"' is not a number.\n";return new MathNode("real","0",this.radiansQ);}}};function MathNode(typ,val,radQ){this.tREAL=0;this.tVAR=1;this.tOP=2;this.tFUNC=3;this.radiansQ=true;this.setNew(typ,val,radQ);}
MathNode.prototype.setNew=function(typ,val,radQ){this.radiansQ=typeof radQ!=='undefined'?radQ:true;this.clear();switch(typ){case "real":this.typ=this.tREAL;this.r=Number(val);break;case "var":this.typ=this.tVAR;this.v=val;break;case "op":this.typ=this.tOP;this.op=val;break;case "func":this.typ=this.tFUNC;this.op=val;break;}
return(this);};MathNode.prototype.clear=function(){this.r=1;this.v="";this.op="";this.child=[];this.childCount=0;};MathNode.prototype.addchild=function(n){this.child.push(n);this.childCount++;return(this.child[this.child.length-1]);};MathNode.prototype.getLevelsHigh=function(){let lvl=0;for(let i=0;i<this.childCount;i++){lvl=Math.max(lvl,this.child[i].getLevelsHigh());}
return(lvl+1);};MathNode.prototype.isLeaf=function(){return(this.childCount==0);};MathNode.prototype.getLastBranch=function(){if(this.isLeaf()){return(null);}
for(let i=0;i<this.childCount;i++){if(!this.child[i].isLeaf()){return(this.child[i].getLastBranch());}}
return(this);};MathNode.prototype.fmt=function(htmlQ){htmlQ=typeof htmlQ!=='undefined'?htmlQ:true;let s="";if(this.typ==this.tOP){switch(this.op.toLowerCase()){case "add":s="+";break;case "sub":s=htmlQ?"&minus;":"-";break;case "mult":s=htmlQ?"&times;":"x";break;case "div":s=htmlQ?"&divide;":"/";break;case "pow":s="^";break;default:s=this.op;}}
if(this.typ==this.tREAL){s=this.r.toString();}
if(this.typ==this.tVAR){if(this.r==1){s=this.v;}else{if(this.r!=0){s=this.r+this.v;}}}
if(this.typ==this.tFUNC){s=this.op;}
return s;};MathNode.prototype.walkFmt=function(){let s=this.walkFmta(true,"");s=s.replace("Infinity","Undefined");return s;};MathNode.prototype.walkFmta=function(noparq,prevop){let s="";if(this.childCount>0){let parq=false;if(this.op=="add")parq=true;if(this.op=="sub")parq=true;if(prevop=="div")parq=true;if(noparq)parq=false;if(this.typ==this.tFUNC)parq=true;if(this.typ==this.tOP){}else{s+=this.fmt(true);}
if(parq)s+="(";for(let i=0;i<this.childCount;i++){if(this.typ==this.tOP&&i>0)s+=this.fmt();s+=this.child[i].walkFmta(false,this.op);if(this.typ==this.tFUNC||(parq&&i>0)){s+=")";}}}else{s+=this.fmt();if(prevop=="sin"||prevop=="cos"||prevop=="tan"){if(this.radiansQ){s+=" rad";}else{s+="&deg;";}}}
return s;};MathNode.prototype.walkNodesFmt=function(level){let s="";for(let i=0;i<level;i++){s+="|   ";}
s+=this.fmt();s+="\n";for(i=0;i<this.childCount;i++){s+=this.child[i].walkNodesFmt(level+1);}
return s;};MathNode.prototype.walk=function(vals){if(this.typ==this.tREAL)return(this.r);if(this.typ==this.tVAR){switch(this.v){case "x":return(vals[23]);case "y":return(vals[24]);case "z":return(vals[25]);case "pi":return(Math.PI);case "e":return(Math.exp(1));case "a":return(vals[0]);case "n":return(vals[13]);break;default:return(0);}}
if(this.typ==this.tOP){let val=0;for(let i=0;i<this.childCount;i++){let val2=0;if(this.child[i]!=null)
val2=this.child[i].walk(vals);if(i==0){val=val2;}else{switch(this.op){case "add":val+=val2;break;case "sub":val-=val2;break;case "mult":val*=val2;break;case "div":val/=val2;break;case "pow":if(val2==2){val=val*val;}else{val=Math.pow(val,val2);}
break;default:}}}
return val;}
if(this.typ==this.tFUNC){let lhs=this.child[0].walk(vals);let angleFact=1;if(!this.radiansQ)angleFact=180/Math.PI;switch(this.op){case "sin":val=Math.sin(lhs/angleFact);break;case "cos":val=Math.cos(lhs/angleFact);break;case "tan":val=Math.tan(lhs/angleFact);break;case "asin":val=Math.asin(lhs)*angleFact;break;case "acos":val=Math.acos(lhs)*angleFact;break;case "atan":val=Math.atan(lhs)*angleFact;break;case "sinh":val=(Math.exp(lhs)-Math.exp(-lhs))/2;break;case "cosh":val=(Math.exp(lhs)+Math.exp(-lhs))/2;break;case "tanh":val=(Math.exp(lhs)-Math.exp(-lhs))/(Math.exp(lhs)+Math.exp(-lhs));break;case "exp":val=Math.exp(lhs);break;case "log":val=Math.log(lhs)*Math.LOG10E;break;case "ln":val=Math.log(lhs);break;case "abs":val=Math.abs(lhs);break;case "deg":val=lhs*180.0/Math.PI;break;case "rad":val=lhs*Math.PI/180.0
break;case "sign":if(lhs<0){val=-1;}else{val=1;}
break;case "sqrt":val=Math.sqrt(lhs);break;case "round":val=Math.round(lhs);break;case "int":val=Math.floor(lhs);break;case "floor":val=Math.floor(lhs);break;case "ceil":val=Math.ceil(lhs);break;case "fact":val=factorial(lhs);break;default:val=NaN;}
return val;}
return val;};function factorial(n){if(n<0)return NaN;if(n<2)return 1;n=n<<0;let i;i=n;let f=n;while(i-->2){f*=i;}
return f;}
function isNumeric(n){return!isNaN(parseFloat(n))&&isFinite(n);}
function num2pix(num){return(num.sub(coords.xStt).getNumber()/coords.xEnd.sub(coords.xStt).getNumber()*coords.width);}
function pix2num(pix){return(coords.xStt.getNumber()+pix/coords.width*(coords.xEnd.getNumber()-coords.xStt.getNumber()));}
function hex2rgba(hex,opacity){hex=hex.replace('#','');let r=parseInt(hex.substring(0,2),16);let g=parseInt(hex.substring(2,4),16);let b=parseInt(hex.substring(4,6),16);result='rgba('+r+','+g+','+b+','+opacity+')';return result;}
function fmtDec(v,dec,dropZerosQ){dropZerosQ=typeof dropZerosQ!=='undefined'?dropZerosQ:false;let s=(v/Math.pow(10,dec)).toFixed(dec);if(dropZerosQ){if(s.indexOf(".")>=0){s=s.replace(/0+$/,'');}
if(s.charAt(s.length-1)=="."){s=s.substring(0,s.length-1);}}
return s;}
function addZeros(num,digits){let counter=0;let temp="";do{temp+="0";counter++;}while(counter<digits);temp+=num;let tempString="";tempString=temp.substring(temp.length-digits,temp.length);return tempString;}
function toSentenceCase(s){let ends=[". ","? ","! "];for(let e=0;e<ends.length;e++){let temp=[];temp=s.split(ends[e]);for(let i=0;i<temp.length;i++){let sentence=temp[i];temp[i]=sentence.charAt(0).toUpperCase()+sentence.substr(1);}
s=temp.join(ends[e]);}
return(s);}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}