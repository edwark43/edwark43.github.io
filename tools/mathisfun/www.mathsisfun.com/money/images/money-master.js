let w,h,g,el,ratio,dragging,dragIndex,dragHoldX,dragHoldY,my={};function moneymasterMain(){let version='1.441';w=540;h=540;my.rect={x:220,y:65,wd:300,ht:300};my.moneys=[{code:"CA",name:"Canada",symbol:"$",denoms:[5,10,25,100,200,500,1000,2000,5000],ext:'gif',paid:[200,500,1000,2000,5000,10000],make:100,dec:2,coords:[40,140]},{code:"US",name:"USA",symbol:"$",denoms:[1,5,10,25,50,100,500,1000,2000],ext:'gif',paid:[100,500,1000,2000],make:100,dec:2,coords:[40,180]},{code:"MX",name:"Mexico",symbol:"$",denoms:[20,50,100,200,500,1000,2000],ext:'gif',paid:[2000,5000,10000,20000,50000,100000],make:1000,dec:2,coords:[40,220]},{code:"UK",name:"UK",symbol:"£",denoms:[1,2,5,10,20,50,100,200],ext:'gif',paid:[200,500,1000,2000],make:100,dec:2,coords:[230,130]},{code:"EU",name:"Europe",symbol:"€",denoms:[1,2,5,10,20,50,100,500],ext:'gif',paid:[100,200,500,1000,2000,5000],make:100,dec:2,coords:[220,160]},{code:"ILS",name:"Israel",symbol:"₪",denoms:[10,50,100,200,500,1000],ext:'gif',paid:[1000,2000,5000,10000,20000,50000],make:1000,dec:2,coords:[250,190]},{code:"LBP",name:"Lebanon",symbol:"L",denoms:[250,500,1000,5000,10000,20000,50000],ext:'gif',paid:[1000,2000,5000,10000,20000,50000],make:100,dec:0,coords:[300,160]},{code:"EGP",name:"Egypt",symbol:"LE",denoms:[50,100,500,1000,2000,5000,10000],ext:'gif',paid:[1000,2000,5000,10000,20000,50000],make:1000,dec:2,coords:[320,190]},{code:"PKR",name:"Pakistan",symbol:"Rs",denoms:[1,2,5,10,20,50,100],ext:'gif',paid:[100,500,1000,2000,5000,10000,20000,50000],make:100,dec:0,coords:[290,215]},{code:"RUB",name:"Russia",symbol:"₽",denoms:[1,2,5,10,50,100,500,1000,5000],ext:'gif',paid:[500,1000,2000,5000,10000,20000],make:100,dec:0,coords:[340,130]},{code:"CNY",name:"China",symbol:"¥",denoms:[50,100,500,1000,2000,5000,10000],ext:'gif',paid:[500,1000,2000,5000,10000,20000],make:1000,dec:2,coords:[400,160]},{code:"BDT",name:"Bangladesh",symbol:"Tk",denoms:[1,2,5,10,20,50,100],ext:'gif',paid:[100,500,1000,2000,5000,10000,20000,50000],make:100,dec:0,coords:[430,215]},{code:"IN",name:"India",symbol:"Rs",denoms:[1,2,5,10,20,50,100,200],ext:'gif',paid:[100,500,1000,2000,5000,10000,20000,50000],make:100,dec:0,coords:[375,215]},{code:"HK",name:"Hong&nbsp;Kong",symbol:"$",denoms:[10,20,50,100,200,500,1000],ext:'gif',paid:[2000,5000,10000,20000,50000,100000],make:100,dec:2,coords:[470,240]},{code:"THB",name:"Thai",symbol:"฿",denoms:[1,2,5,10,20,50,100,500,1000],ext:'png',paid:[50,100,500,1000,2000,5000,10000],make:100,dec:0,coords:[380,265]},{code:"PHP",name:"Philippines",symbol:"P",denoms:[1,5,10,20,50,100,200],ext:'gif',paid:[200,500,1000,2000,5000,10000,20000,50000],make:100,dec:0,coords:[470,265]},{code:"MYR",name:"Malaysia",symbol:"RM",denoms:[5,10,20,50,100,200,500],ext:'gif',paid:[500,1000,2000,5000,10000,20000,50000],make:100,dec:2,coords:[350,290]},{code:"SG",name:"Singapore",symbol:"$",denoms:[5,10,20,50,100,200,500],ext:'gif',paid:[1000,2000,5000,10000,20000,50000,100000],make:100,dec:2,coords:[430,290]},{code:"JPY",name:"Japan",symbol:"¥",denoms:[1,5,10,50,100,500,1000,5000,10000],ext:'png',paid:[500,1000,2000,5000,10000,20000],make:100,dec:0,coords:[500,160]},{code:"NGN",name:"Nigeria",symbol:"₦",denoms:[5,10,20,50,100,200,500,1000],ext:'gif',paid:[20,50,100,200,500,1000,2000,5000],make:100,dec:0,coords:[220,240]},{code:"ZA",name:"South Africa",symbol:"R",denoms:[5,10,20,50,100,200,500],ext:'gif',paid:[500,1000,2000,5000,10000],make:100,dec:2,coords:[260,320]},{code:"AU",name:"Australia",symbol:"$",denoms:[5,10,20,50,100,200,500,1000,2000],ext:'gif',paid:[200,500,1000,2000,5000],make:100,dec:2,coords:[460,315]},{code:"NZD",name:"NZ",symbol:"$",denoms:[10,20,50,100,200,500,1000],ext:'gif',paid:[1000,2000,5000,10000,20000,50000,100000],make:100,dec:2,coords:[530,340]},{code:"GEN",name:"Generic",symbol:"$",denoms:[1,2,5,10,20,50,100],ext:'gif',paid:[100,200,500,1000,2000,5000],make:100,dec:2,coords:[400,360]}];my.games=[{mode:"simptot",names:["Target","simple"],showTot:true,fewCoins:false,giveChg:false,doAdd:false,score:1},{mode:"simp",names:["Target (no totals)","simple (sin totales)"],showTot:false,fewCoins:false,giveChg:false,doAdd:false,score:2},{mode:"fewtot",names:["Handful","algunas monedas"],showTot:true,fewCoins:true,giveChg:false,doAdd:false,score:2},{mode:"few",names:["Handful (no totals)","algunas monedas (sin totales)"],showTot:false,fewCoins:true,giveChg:false,doAdd:false,score:3},{mode:"givetot",names:["Give Change","da el cambio"],showTot:true,fewCoins:false,giveChg:true,doAdd:false,score:3},{mode:"give",names:["Give Change (no totals)","da el cambio (sin totales)"],showTot:false,fewCoins:false,giveChg:true,doAdd:false,score:4},{mode:"addtot",names:["Add/Remove",""],showTot:true,fewCoins:false,giveChg:false,doAdd:true,score:1}];my.game=my.games[0];this.tgt=0;my.lvls=[{name:'easy',coinMax:2,denEach:1,scoreFact:1},{name:'medium',coinMax:3,denEach:2,scoreFact:1.5},{name:'hard',coinMax:4,denEach:2,scoreFact:2},{name:'advanced',coinMax:6,denEach:2,scoreFact:2.5},];my.lvl=my.lvls[0];this.denHTML='';my.imgHome=(document.domain=='localhost')?'/mathsisfun/money/images/':'/money/images/'
let s='';my.sndHome=(document.domain=='localhost')?'/mathsisfun/images/sounds/':'/images/sounds/'
s+='<audio id="sndYes" src="'+my.sndHome+'yes2.mp3" preload="auto"></audio>';s+='<audio id="sndDrop" src="'+my.sndHome+'click1.mp3" preload="auto"></audio>';s+='<audio id="sndUndo" src="'+my.sndHome+'down.mp3" preload="auto"></audio>'
my.snds=[];s+=`<div class="js" style="position:relative; width: ${w}px; height:${h}px; 
  margin:auto; display:block;  " >`
s+=`<div style="position:absolute; left:0; top:0; width:100%; height:100%; border-radius: 20px;  z-index:-99; 
    background-color: #eef; z-index:2;">`
s+='<div style="position:absolute; left:'+my.rect.x+'px; top:'+my.rect.y+'px; width:'+my.rect.wd+'px; height:'+my.rect.ht+'px; border-radius: 10px; background-image: url('+my.imgHome+'bg3.gif); border: 2px solid white; box-shadow: 0 0 4px 4px #aaf; z-index:3; "></div>';s+='<div id="denomDad" style="position: absolute; left: 0px; top: 0px;width:'+w+'px;height:'+h+'px;z-index:5; ">';s+='</div>';s+='<canvas id="canvasId" width="'+w+'" height="'+h+'" style="position:absolute;z-index:6;left:0;"></canvas>';s+='<div style="position: absolute; left:25px; top: 5px; display: block; margin: 2px; width:150px; background-color:#8888ff; text-align: center;border-radius: 10px; border: 2px solid white;" >';s+='<div style="display: inline-block; margin: 0 10px 0 0; font: 22px arial; color: white; ">Score:</div>';s+='<div id="score" style="display: inline-block; color: white; text-align:center; padding: 3px;font: bold 26px Arial;  " >0</div>';s+='</div>';let vals=[['cust','Customer gives',0],['need','Your Target',25],['user','Total',68]];for(let i=0;i<vals.length;i++){let v=vals[i];s+='<div style="position: absolute; left:'+(my.rect.x-30)+'px; top:'+v[2]+'px; display: block; margin: 2px 30px 2px 0; text-align: center; z-index:7;" >';s+='<div id="'+v[0]+'Lbl" style="display: inline-block; margin: 0 10px 0 0; width:150px; font: 20px arial; text-align: right; color:black;">'+v[1]+':</div>';s+='<div id="'+v[0]+'Val" style="display: inline-block;  width:90px;  color: black; text-align:right; padding: 3px 5px 3px 0; background-color: #eeffee; font: bold 22px Arial;  border-radius: 10px;" >100</div>';s+='</div>';}
s+='<button id="checkBtn" onclick="check()" style="position: absolute; left:'+(my.rect.x+my.rect.wd/2-45)+'px; top:'+(my.rect.y+5)+'px; width:90px; font-size: 18px; z-index:44;" class="btn hi" >Check</button>';s+='<button onclick="gameNew()" style="position: absolute; right: 3px; top: 26px; width:80px; z-index:7;" class="btn hi" >Next!</button>';s+='<img id="success" src="'+my.imgHome+'tick.png" style="position:absolute; left:'+(my.rect.x+my.rect.wd-75)+'px; top:'+(my.rect.y+2)+'px; opacity: 0; z-index:7;">';s+='<div id="info" style="position:absolute; left:10%; top:39px; width:80%; font: bold 22px Arial; color: gold; border-radius: 10px; text-align: center; "></div>';s+=`<div id="lvl" class="sect" style="position:absolute; right:3px; bottom:105px; font: 17px Arial; color: green; border-radius: 10px; text-align: center; 
   z-index:7; ">`
s+=lvlHTML();s+='</div>';s+='<div id="using" style="position:absolute; right:3px; bottom:3px; font: 17px Arial; color: green; border-radius: 10px; text-align: center; z-index:7; ">';s+=gameHTML();s+='</div>';s+='<div style="position:absolute; right:15px; top:0px; z-index:7;">';my.soundQ=true
s+=soundBtnHTML()
s+='</div>';s+='<button onclick="moneyNew()" style="position: absolute; left: 3px; bottom: 26px; width:90px; z-index:7;" class="btn hi" >Currencies</button>';s+='<div style="font: 11px Arial; color: blue; position:absolute; left:3px; bottom:3px;">&copy; 2021 MathsIsFun.com  v'+version+'</div>';s+=moneyPopHTML('money',20,360);s+='</div>';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=2;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.money=my.moneys[1];shapesNew();dragging=false;dragHoldX=0;dragHoldY=0;my.score=0;document.getElementById('score').innerHTML=my.score.toString();gameChg(0)
lvlChg(1)
gameNew();moneyPop()
el.addEventListener("mousedown",mouseDownListener,false);el.addEventListener('touchstart',ontouchstart,false);el.addEventListener("mousemove",dopointer,false);}
function setVis(id,onQ){if(onQ){document.getElementById(id).style.visibility='visible';}else{document.getElementById(id).style.visibility='hidden';}}
function moneyNew(){moneyPop()}
function gameNew(){document.getElementById('success').style.opacity=0;setVis('userLbl',my.game.showTot);setVis('userVal',my.game.showTot);setVis('checkBtn',false);setVis('custLbl',my.game.giveChg);setVis('custVal',my.game.giveChg);let userLbl=my.game.giveChg?"Change:":"Total:";document.getElementById('userLbl').innerHTML=userLbl;if(my.game.doAdd){this.tgt=newTargetAdd()}else{shapesNew();if(my.game.giveChg){console.log('tgt',this.tgt)
let tryN=0;let gives=0;do{this.tgt=newTarget();gives=my.money.paid[getRandomInt(0,my.money.paid.length-1)];console.log('gives',tryN,gives)
tryN++;}while(gives<=this.tgt&&tryN<100);document.getElementById('custVal').innerHTML=moneyFmt(gives);document.getElementById('needLbl').innerHTML="Items cost:";document.getElementById('needVal').innerHTML=moneyFmt(gives-this.tgt);}else{document.getElementById('needLbl').innerHTML="Your Target:";this.tgt=newTarget();document.getElementById('needVal').innerHTML=moneyFmt(this.tgt);}}
denHTMLSet();drawShapes();}
function newTarget(){let denoms=my.money.denoms
let sels=[];let tryCount=0;let x=0
let loopCount=0
let each=my.lvl.denEach
do{let den=Math.floor(Math.random()*denoms.length);for(let i=0;i<each;i++){x+=denoms[den];sels.push(den)
loopCount++;console.log('loopCount',loopCount)}}while((loopCount<my.lvl.coinMax&&loopCount<100)||moneyNeeded(x).count<my.lvl.coinMax);if(my.game.fewCoins){for(let i=0;i<denoms.length;i++){my.shapes[i].visQ=false;}
console.log("FewCoins",sels);for(let i=0;i<sels.length;i++){my.shapes[sels[i]].visQ=true;}
for(let i=0;i<2;i++){let n=Math.floor(Math.random()*denoms.length);my.shapes[n].visQ=true;}}
console.log('newTarget',x)
return x;}
function moneyNeeded(x){let count=0;let moneys=[]
for(let i=my.money.denoms.length-1;i>=0;i--){let moneyVal=my.money.denoms[i];if(moneyVal!=0){let moneyN=Math.round(x/moneyVal-0.5);x-=moneyN*moneyVal;if(moneyN>0)moneys.unshift({denom:i,n:moneyN})
count+=moneyN;if(x==0)break;}}
let s=''
for(let i=0;i<moneys.length;i++){let money=moneys[i];s+=my.money.denoms[money.denom]+'x'+money.n+' '}
console.log("moneyNeeded",count,s);if(x!=0)return(0);return{count:count,moneys:moneys}}
function newTargetAdd(){let currCoinArr=[];let tempArr=[];for(let i=0;i<currCoinArr.length;i++){let obj=currCoinArr[i];if(_root.Table.hitTest(obj._x,obj._y,false)){tempArr.push(currCoinArr[i]);}else{currCoinArr[i].removeMovieClip();}}
currCoinArr=[];for(let i=0;i<tempArr.length;i++){currCoinArr.push(tempArr[i]);}
let currCount=currCoinArr.length;let currTotal=calcTotal();let chgCount=0;let newCount=currCount;let newTotal=currTotal;do{let addQ=(Math.randomInt(2)==1);if(newCount>8)addQ=false;if(newCount<3)addQ=true;let denom=0;let coinAdd
if(addQ){let choice=Math.randomInt(my.money.denoms.length);denom=my.money.denoms[choice];coinAdd=1;}else{let choice=Math.randomInt(currCoinArr.length);denom=currCoinArr[choice].denom;coinAdd=-1;}
newCount+=coinAdd;newTotal+=coinAdd*denom;chgCount++;}while(chgCount<2||newTotal==currTotal||newTotal<=0);return(newTotal);}
function shapesNew(){my.shapes=[];my.shapesZ=10
for(let i=0;i<my.money.denoms.length;i++){let temp=new Money(my.money.denoms[i]);my.shapes.push(temp);}
denHTMLSet();setMoneyPos();}
function setMoneyPos(){let hts=[60,90];for(let i=0;i<my.shapes.length;i++){let mon=my.shapes[i];if(mon.typ=='base'){let col=i-2*Math.floor(i/2);mon.x=10+100*(col+0.5)-mon.wd/2;mon.y=hts[col];mon.setStt();hts[col]+=20+mon.ht;}
if(mon.visQ){let div=document.getElementById('denom'+i);div.style.left=mon.x+'px';div.style.top=mon.y+'px';}}}
function denHTMLSet(){let sNew=denHTMLGet();if(sNew!=this.denHTML){this.denHTML=sNew;document.getElementById('denomDad').innerHTML=sNew;}}
function denHTMLGet(){let s="";for(let i=0;i<my.shapes.length;i++){let mon=my.shapes[i];if(mon.visQ){let denom=mon.denom;s+='<img id="denom'+i+'" src="'+my.imgHome+'currency/'+my.money.code.toLowerCase()+denom+'.'+my.money.ext+'" style="position:absolute; left: 10px; z-index:-1;">';}}
return s;}
function moneyPop(){let pop=document.getElementById('moneyPop');pop.style.transitionDuration="0.3s";pop.style.opacity=1;pop.style.zIndex=12;pop.style.left='20px';}
function moneyYes(){let pop=document.getElementById('moneyPop');pop.style.opacity=0;pop.style.zIndex=-1;pop.style.left='-900px';}
function ontouchstart(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseDownListener(evt)}
function ontouchmove(evt){let touch=evt.targetTouches[0];evt.clientX=touch.clientX;evt.clientY=touch.clientY;evt.touchQ=true;mouseMoveListener(evt);}
function ontouchend(){el.addEventListener('touchstart',ontouchstart,false);window.removeEventListener("touchend",ontouchend,false);if(dragging){dragging=false;moneyDrop();window.removeEventListener("touchmove",ontouchmove,false);}}
function dopointer(e){let bRect=el.getBoundingClientRect();let mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height);let overQ=false;for(let i=0;i<my.shapes.length;i++){if(hitTest(my.shapes[i],mouseX,mouseY)){overQ=true;}}
if(overQ){document.body.style.cursor="pointer";}else{document.body.style.cursor="default";}}
function mouseDownListener(evt){let i;let highestIndex=-1;let bRect=el.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);for(i=0;i<my.shapes.length;i++){if(hitTest(my.shapes[i],mouseX,mouseY)){dragging=true;if(i>highestIndex){dragHoldX=mouseX-my.shapes[i].x;dragHoldY=mouseY-my.shapes[i].y;highestIndex=i;dragIndex=i;}}}
if(dragging){my.shapes[dragIndex].shadowQ=true;if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false);}else{window.addEventListener("mousemove",mouseMoveListener,false);}}
if(evt.touchQ){el.removeEventListener("touchstart",ontouchstart,false);window.addEventListener("touchend",ontouchend,false);}else{el.removeEventListener("mousedown",mouseDownListener,false);window.addEventListener("mouseup",mouseUpListener,false);}
if(evt.preventDefault){evt.preventDefault();}
else if(evt.returnValue){evt.returnValue=false;}
return false;}
function mouseUpListener(){el.addEventListener("mousedown",mouseDownListener,false);window.removeEventListener("mouseup",mouseUpListener,false);if(dragging){dragging=false;moneyDrop();window.removeEventListener("mousemove",mouseMoveListener,false);}}
function mouseMoveListener(evt){if(dragIndex<0)return;let bRect=el.getBoundingClientRect();let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width);let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height);let minX=-my.shapes[dragIndex].wd/2;let maxX=w-my.shapes[dragIndex].wd/2;let posX=mouseX-dragHoldX;posX=(posX<minX)?minX:((posX>maxX)?maxX:posX);let minY=-my.shapes[dragIndex].ht*0.7;let maxY=h-my.shapes[dragIndex].ht*0.3;let posY=mouseY-dragHoldY;posY=(posY<minY)?minY:((posY>maxY)?maxY:posY);my.shapes[dragIndex].x=posX;my.shapes[dragIndex].y=posY;let div=document.getElementById('denom'+dragIndex);div.style.left=posX+'px';div.style.top=posY+'px';if(my.shapes[dragIndex].shadowQ){div.style.filter='drop-shadow(5px 5px 5px #222)';div.style.zIndex=my.shapesZ}else{div.style.filter='none';}}
function moneyDrop(){let me=my.shapes[dragIndex];me.shadowQ=false;if(me.typ=='base'){if(hitTest(my.rect,me.x+me.wd/2,me.y+me.ht/2)){soundPlay('sndDrop')
let temp=new Money(me.denom);temp.setxy(me.x,me.y);temp.typ='copy';my.shapes.push(temp);denHTMLSet();}
me.moveStt();}
if(me.typ=='copy'){if(hitTest(my.rect,me.x+me.wd/2,me.y+me.ht/2)){}else{soundPlay('sndUndo')
my.shapes.splice(dragIndex,1);denHTMLSet();}}
drawShapes();}
function moneyPopHTML(id,yp,ht){let s='';s+='<div id="'+id+'Pop" style="position:absolute; left:-900px; top:'+yp+'px; height:'+ht+'px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: blue; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; ">';s+=moneyHTML();s+='<button class="btn" style="z-index:2; font: 22px Arial; float:right; margin: 0 0 5px 10px;" onclick="'+id+'Yes()">&#x2714;</button>';s+='</div>';return s;}
function moneyHTML(){let s='';s+='<div style="width:543px; height:320px;">';s+='<img style="position:absolute; left:1px; top:5px;" src="'+my.imgHome+'world.gif" >';for(let i=0;i<my.moneys.length-1;i++){let m=my.moneys[i];s+='<button onclick="moneyDo('+i+')" style="position: absolute; left:'+(m.coords[0]-30)+'px; top:'+(m.coords[1]-80)+'px; z-index:2; font: 16px Arial;" class="btn" >'+m.name+'</button>';}
s+='</div>';return s;}
function moneyDo(n){my.money=my.moneys[n];shapesNew();gameNew();let pop=document.getElementById('moneyPop');pop.style.opacity=0;pop.style.zIndex=-1;pop.style.left='-900px';}
function gameHTML(){let s='';s+='<div style="">';for(let i=0;i<my.games.length-1;i++){let game=my.games[i];s+='<button id="game'+i+'" onclick="gameChg('+i+')" style="z-index:2; font: 17px Arial;" class="btn" >'+game.names[0]+'</button>';if(i%2)s+='<br>';}
s+='</div>';return s;}
function lvlHTML(){let s='';s+='<div style="">';for(let i=0;i<my.lvls.length;i++){let lvl=my.lvls[i];s+='<button id="lvl'+i+'" onclick="lvlChg('+i+')" style="z-index:2; font: 18px Arial;" class="btn" >'+lvl.name+'</button>';}
s+='</div>';return s;}
function lvlChg(n){my.lvl=my.lvls[n]
for(var i=0;i<my.lvls.length;i++){toggleBtn("lvl"+i,(i==n));}
gameNew();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}
function gameChg(n){my.game=my.games[n]
for(var i=0;i<my.games.length-1;i++){toggleBtn("game"+i,(i==n));}
gameNew();}
function hitTest(shape,mx,my){if(mx<shape.x)return false;if(my<shape.y)return false;if(mx>(shape.x+shape.wd))return false;if(my>(shape.y+shape.ht))return false;return true;}
class Money{constructor(den){this.typ='base';this.shadowQ=false;this.denom=den;this.visQ=true;this.wd=76;this.ht=76;let me=this;this.image=new Image();this.image.onload=function(){me.wd=this.width;me.ht=this.height;setMoneyPos();};this.image.src=my.imgHome+'currency/'+my.money.code.toLowerCase()+this.denom+'.'+my.money.ext;}
setxy(x,y){this.x=x;this.y=y;}
setStt(){this.xStt=this.x;this.yStt=this.y;}
moveStt(){this.x=this.xStt;this.y=this.yStt;}}
function drawShapes(){g.clearRect(0,0,g.canvas.width,g.canvas.height)
let tot=0;for(let i=0;i<my.shapes.length;i++){let mon=my.shapes[i];if(mon.visQ){if(mon.typ=='copy')tot+=mon.denom;}}
setMoneyPos();document.getElementById('userVal').innerHTML=moneyFmt(tot);checkSuccess(tot);}
function checkSuccess(tot){if(tot==this.tgt){my.score+=(my.game.score*my.lvl.scoreFact)<<0
document.getElementById('score').innerHTML=my.score;doSuccess();}}
function doSuccess(){document.getElementById('success').style.opacity=1;soundPlay('sndYes')
setTimeout(gameNew,1500);}
function loop(currNo,minNo,maxNo,incr){currNo+=incr;let range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}
CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath();let pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0]];for(let i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1]);}}
g.stroke();};function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function moneyFmt(cents){let x=0
if(my.money.dec==2){let dollars=Math.floor(cents/100);cents=cents-dollars*100;if(cents<10){x=".0"+cents;}else{x="."+cents;}
x=dollars+x;}else{x=cents;}
return(my.money.symbol+x);}
function soundBtnHTML(){let s=''
s+='<style> '
s+=' .speaker { height: 30px; width: 30px; position: relative; overflow: hidden; display: inline-block; vertical-align:top; } '
s+=' .speaker span { display: block; width: 9px; height: 9px; background-color: blue; margin: 10px 0 0 1px; }'
s+=' .speaker span:after { content: ""; position: absolute; width: 0; height: 0; border-style: solid; border-color: transparent blue transparent transparent; border-width: 10px 16px 10px 15px; left: -13px; top: 5px; }'
s+=' .speaker span:before { transform: rotate(45deg); border-radius: 0 60px 0 0; content: ""; position: absolute; width: 5px; height: 5px; border-style: double; border-color: blue; border-width: 7px 7px 0 0; left: 18px; top: 9px; transition: all 0.2s ease-out; }'
s+=' .speaker:hover span:before { transform: scale(.8) translate(-3px, 0) rotate(42deg); }'
s+=' .speaker.mute span:before { transform: scale(.5) translate(-15px, 0) rotate(36deg); opacity: 0; }'
s+=' .speaker.mute span { background-color: #bbb; }'
s+=' .speaker.mute span:after {border-color: transparent #bbb transparent #bbb;}'
s+=' </style>'
s+='<div id="sound" onClick="soundToggle()" class="speaker"><span></span></div>'
return s}
function soundPlay(id,simulQ){if(!my.soundQ)return
simulQ=typeof simulQ!=='undefined'?simulQ:false
if(simulQ){if(id.length>0)document.getElementById(id).play()}else{my.snds.push(id)
soundPlayQueue(id)}}
function soundPlayQueue(id){let div=document.getElementById(my.snds[0])
div.play()
div.onended=function(){my.snds.shift();if(my.snds.length>0)soundPlayQueue(my.snds[0]);};}
function soundToggle(){let btn='sound'
if(my.soundQ){my.soundQ=false
document.getElementById(btn).classList.add("mute")}else{my.soundQ=true
document.getElementById(btn).classList.remove("mute")}}