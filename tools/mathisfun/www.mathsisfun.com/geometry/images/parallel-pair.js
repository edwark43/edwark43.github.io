var s,i,my={};function parallelpairMain(){my.version='0.82';w=420;h=280;my.shows=[{id:'tran',name:'Transversal',angNums:[[0,1,2,3,4,5,6,7]],descr:''},{id:'para',name:'Parallel Lines',angNums:[[0],[1],[2],[3],[4],[5],[6],[7]],descr:''},{id:'vert',name:'Vertical Angles',angNums:[[0,3],[1,2],[4,7],[5,6]],descr:''},{id:'corr',name:'Corresponding Angles',angNums:[[0,4],[1,5],[2,6],[3,7]],descr:''},{id:'altint',name:'Alternate Interior Angles',angNums:[[2,5],[3,4]],descr:''},{id:'altext',name:'Alternate Exterior Angles',angNums:[[0,7],[1,6]],descr:''},{id:'conint',name:'Consecutive Interior Angles',angNums:[[2,4],[3,5]],descr:'Angles add to 180&deg;'}];my.showNo=0
for(var i=0;i<my.shows.length;i++){if(my.shows[i].id==my.mode){my.showNo=i
break}}
my.show=my.shows[my.showNo]
s=''
s+='<style>'
s+='.togglebtn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none;  font: bold 14px/25px Arial, sans-serif; color: #19667d; border: 1px solid #88aaff; border-radius: 10px; cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.togglebtn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.hi { border: solid 2px #8af; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.lo { border: solid 2px #e8f8ff; background: linear-gradient(to top, rgba(170,170,220,1) 0%, rgba(205,205,235,1) 100%);  }'
s+='button:focus {outline:0;}'
s+='</style>'
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none; border-radius: 20px; background-color: #e8f8ff; margin:auto; display:block; text-align:left; ">';s+='<canvas id="canvasId" width="'+w+'" height="'+h+'" style="z-index:1; position:absolute; left:200px; top:0px;"></canvas>';s+='<img src="../geometry/images/parallel-line-pairs.gif" width="230" height="280"  style="z-index:2; position:absolute; left:200px; top:0px;" />';s+='<div id="info" style="z-index:1; position:absolute; left:110px; top:20px; font: bold 28px Arial; width:200px; border: none; text-align:center;"></div>';s+='<div style="margin: 5px 5px 5px 0;">Choose One:</div>';for(var i=0;i<my.shows.length;i++){s+='<button id="b'+i+'" style="font: 15px Arial; margin-left: 15px;" class="togglebtn lo" onclick="start('+i+')" >'+my.shows[i].name+'</button><br />';}
s+='<div id="copyrt" style="position: absolute; left:3px; bottom:0px; font: 10px Arial; color: #6600cc; ">&copy; 2018 MathsIsFun.com  v'+my.version+'</div>';s+='';s+='</div>';document.write(s);el=document.getElementById('canvasId');ratio=4;el.width=w*ratio;el.height=h*ratio;el.style.width=w+"px";el.style.height=h+"px";g=el.getContext("2d");g.setTransform(ratio,0,0,ratio,0,0);my.playQ=true
my.timeStt=performance.now()
my.animNum=0
start(0)
anim()}
function anim(){if(my.playQ){if(performance.now()-my.timeStt>1500){my.timeStt=performance.now()
my.animNum++
if(my.animNum>=my.show.angNums.length)my.animNum=0
update()}
requestAnimationFrame(anim);}}
function update(){g.clearRect(0,0,el.width,el.height)
draw()}
function start(setTyp){my.typ=setTyp;for(var i=0;i<my.shows.length;i++){if(i==my.typ){toggleBtn("b"+i,true);}else{toggleBtn("b"+i,false);}}
my.show=my.shows[my.typ]
flashes=my.show.angNums
my.animNum=0;my.timeStt=performance.now()
g.clearRect(0,0,el.width,el.height);draw()}
function draw(){var descr=''
switch(my.show.id){case 'tran':g.lineWidth=12;g.strokeStyle='#ff0';g.beginPath();g.moveTo(177,-2);g.lineTo(39,282);g.stroke();break;case 'para':g.lineWidth=12;g.strokeStyle='#ff0';g.beginPath();g.moveTo(0,77);g.lineTo(230,77);g.stroke();g.beginPath();g.moveTo(0,215);g.lineTo(230,215);g.stroke();break;case 'vert':case 'corr':case 'altint':case 'altext':flash=flashes[my.animNum];descr=ltr(flash[0])+" = "+ltr(flash[1])
hilite(flash[0]);hilite(flash[1]);break;case 'conint':flash=flashes[my.animNum];descr=ltr(flash[0])+" + "+ltr(flash[1])+" = 180&deg;";hilite(flash[0]);hilite(flash[1]);break;default:}
document.getElementById("info").innerHTML=descr}
function ltr(n){return String.fromCharCode(97+n)}
function hilite(n){pts=[["a",106,30],["b",188,40],["c",90,112],["d",172,114],["e",38,173],["f",124,178],["g",24,254],["h",113,258]];pt=pts[n]
g.fillStyle='#ff0';g.beginPath();g.arc(pt[1],pt[2],20,0,2*Math.PI);g.fill();}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add("hi");document.getElementById(btn).classList.remove("lo");}else{document.getElementById(btn).classList.add("lo");document.getElementById(btn).classList.remove("hi");}}