var w,h,ratio,i,s,el,g,my={}
function init(){let version='0.89'
w=500
h=420
my.shapes=[]
my.drag={type:'block',q:false,n:0,hold:{x:0,y:0}}
my.baseClrs=clrsGet()
my.clrs=clrsGet()
my.opts={vals:'5,3,7,8,2',lbls:'A,B,C,D,E',title:'Title',xtitl:'Category',ytitl:'How Many'}
s=''
s+='<div style="position:relative; width:'+w+'px; border: none; margin:auto; display:block;">'
s+='<div style="display: block; text-align: center; backgrz-index: 20;">'
s+='<div style="">'
s+='<div class="control" style="display: inline-block; margin:5px auto;">'
my.types=['Bar','Line','Dot','Pie','Histogram']
for(var i=0;i<my.types.length;i++){var typ=my.types[i]
s+='<button class="btn" id="btn'+typ+'" style="font-size: 14px;" class="btn lo"  onclick="go('+i+')" >'+typ+'</button>'}
s+='</div>'
s+=' &nbsp; '
s+='<div class="control" style="display: inline-block; margin:5px auto;  ">'
s+='<button id="rawBtn" onclick="toggleRaw()" style="z-index:2;" class="btn lo" >Raw Data</button>'
s+='</div>'
s+='</div>'
var inps=[{lbl:'&nbsp;&nbsp;Title',id:'title',ht:20,type:0},{lbl:'X',id:'xtitl',ht:20,type:0},{lbl:'Y',id:'ytitl',ht:20,type:0},{lbl:'Raw',id:'raws',ht:52,type:1},{lbl:'Values',id:'vals',ht:20,type:1},{lbl:'Labels',id:'lbls',ht:20,type:1},{lbl:'Group Size',id:'grp',ht:20,type:0},]
for(var i=0;i<inps.length;i++){var inp=inps[i]
s+='<div style="display: inline-block; " id="'+inp.id+'div">'
switch(inp.type){case 0:s+=wrap({id:inp.id,tag:'inp',style:'width:110px;',lbl:' '+inp.lbl+': '})
break
case 1:s+=wrap({id:inp.id,tag:'edit',style:'width:400px; font: bold 16px Arial; margin:4px; vertical-align: top;',fn:'go(-1)',lbl:inp.lbl+': '})
break
case 2:break
default:}
s+='</div>'}
s+='<div style="">'
s+='<button id="clrsBtn" onclick="toggleClrs()" style="z-index:2;" class="btn hi" >Clrs</button>'
s+='<button id="numsBtn" onclick="toggleNums()" style="z-index:2;" class="btn lo" >Nums</button>'
s+='<button id="pntsBtn" onclick="togglePnts()" style="z-index:2;" class="btn lo" > &bull; </button>'
s+='<button id="pctsBtn" onclick="togglePcts()" style="z-index:2;" class="btn lo" >%</button>'
s+=' &nbsp; '
s+='<button style="color: #8888ff; font-size: 14px;" class="btn" onclick="canvasPrint()" >Print</button>'
s+='<button style="color: #8888ff; font-size: 14px;" class="btn" onclick="canvasSave()" >Save</button>'
s+='</div>'
s+='</div>'
s+=`<div id="editPop" style="position:absolute; left:0; top:0; font: bold 36px Arial; text-align: center; color: gold;">`
s+=dropdownHTML(my.baseClrs,'clrChg','clrs')
s+=`</div>`
s+='<canvas id="can" width="'+w+'" height="'+h+'" style="z-index:1;"></canvas>'
s+='<div style="font: 10px Arial; color: #6600cc;  text-align:center;">&copy; 2021 MathsIsFun.com  v'+version+'</div>'
s+='</div>'
docInsert(s)
el=document.getElementById('can')
ratio=2
el.width=w*ratio
el.height=h*ratio
el.style.width=w+'px'
el.style.height=h+'px'
g=el.getContext('2d')
g.setTransform(ratio,0,0,ratio,0,0)
el.addEventListener('mousedown',mouseDown,false)
el.addEventListener('touchstart',touchStart,false)
el.addEventListener('mousemove',doPointer,false)
my.editPop=new Pop('editPop','','','','')
var valStr=optGet('vals')
my.vals=valStr.split(',')
document.getElementById('vals').value=arr2str(my.vals)
var lblStr=optGet('lbls')
my.lbls=lblStr.split(',')
document.getElementById('lbls').value=arr2str(my.lbls)
document.getElementById('title').value=optGet('title')
document.getElementById('xtitl').value=optGet('xtitl')
document.getElementById('ytitl').value=optGet('ytitl')
this.lt=55
this.tp=30
this.wd=440
this.ht=300
my.lblYMax=0
my.xstt=0
my.xend=6
my.ystt=0
my.yend=10
my.rawQ=false
my.clrsQ=true
my.numsQ=false
my.pntsQ=false
my.pctsQ=false
document.getElementById('grp').value=2
this.type=0
go(0)}
function clrsGet(){return[['Gold','#FFD700'],['Red','#FF0000'],['Blue','#0000FF'],['Green','#008000'],['Fuchsia','#ff00ff'],['DarkOrange','#ff9900'],['MedVioletRed','#cc0066'],['Indigo','#330099'],['Lime','#00FF00'],['DarkOrchid','#993399'],['Cyan','#00FFFF'],['LightSalmon','#FFA07A'],['PaleGreen','#98FB98'],['SpringGreen','#00FF7F'],['DarkSeaGreen','#8FBC8F'],['Black','#000000'],['DarkRed','#8B0000'],['Pink','#FFC0CB'],['HotPink','#FF69B4'],['Coral','#FF7F50'],['DarkGreen','#006600'],['Orange','#FFA500'],['Khaki','#F0E68C'],['Thistle','#D8BFD8'],['Violet','#EE82EE'],['SlateBlue','#6A5ACD'],['Teal','#008080'],['Aquamarine','#7FFFD4'],['LightBlue','#ADD8E6'],['SkyBlue','#87CEEB'],['Navy','#000080'],['Purple','#800080'],['Wheat','#F5DEB3'],['Tan','#D2B48C'],['AntiqueWhite','#FAEBD7'],['Silver','#C0C0C0'],]}
function arr2str(arr){return arr.join(',')}
function str2arr(s){return s.split(',')}
function toggleRaw(){my.rawQ=!my.rawQ
toggleBtn('rawBtn',my.rawQ)
if(my.rawQ){valsToRaw()}else{rawToVals()}
go(-1)}
function toggleClrs(){my.clrsQ=!my.clrsQ
toggleBtn('clrsBtn',my.clrsQ)
go(-1)}
function toggleNums(){my.numsQ=!my.numsQ
toggleBtn('numsBtn',my.numsQ)
go(-1)}
function togglePnts(){my.pntsQ=!my.pntsQ
toggleBtn('pntsBtn',my.pntsQ)
go(-1)}
function togglePcts(){my.pctsQ=!my.pctsQ
toggleBtn('pctsBtn',my.pctsQ)
go(-1)}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
function rawToVals(){console.log('rawToVals')
var s=document.getElementById('raws').value
var raws=str2arr(s)
var cols=[]
for(var i=0;i<raws.length;i++){var raw=raws[i]
var bits=raw.split('*')
var n=1
var lbl=bits[0].trim()
if(lbl.length==0)continue
if(bits.length>1)n=parseFloat(bits[1])
var foundQ=false
for(var j=0;j<cols.length;j++){if(cols[j].lbl==lbl){cols[j].n+=n
foundQ=true
break}}
if(!foundQ){cols.push({lbl:lbl,n:n})}}
var lbls=[]
var vals=[]
for(var i=0;i<cols.length;i++){var col=cols[i]
lbls.push(col.lbl)
vals.push(col.n)}
document.getElementById('lbls').value=lbls.join(',')
document.getElementById('vals').value=vals.join(',')}
function valsToRaw(){console.log('valsToRaw')
var s=document.getElementById('lbls').value
optSet('lbls',s)
var lbls=str2arr(s)
s=document.getElementById('vals').value
optSet('vals',s)
var vals=str2arr(s)
var raws=[]
for(var i=0;i<vals.length;i++){var val=parseFloat(vals[i])
var lbl='['+(i+1)+']'
if(lbls.length>i)lbl=lbls[i]
var s=lbl
if(val!=1){s+='*'+val}
raws.push(s)}
document.getElementById('raws').value=raws.join(', ')}
function go(n){if(n>=0){this.type=my.types[n]
for(var i=0;i<my.types.length;i++){var div=document.getElementById('btn'+my.types[i])
if(i==n){div.classList.add('hi')
div.classList.remove('lo')}else{div.classList.add('lo')
div.classList.remove('hi')}}}
optSet('title',document.getElementById('title').value)
optSet('xtitl',document.getElementById('xtitl').value)
optSet('ytitl',document.getElementById('ytitl').value)
if(my.rawQ){rawToVals()
document.getElementById('rawsdiv').style.display='block'
document.getElementById('lblsdiv').style.display='none'
document.getElementById('valsdiv').style.display='none'}else{document.getElementById('rawsdiv').style.display='none'
document.getElementById('lblsdiv').style.display='block'
document.getElementById('valsdiv').style.display='block'}
var lblStr=document.getElementById('lbls').value
optSet('lbls',lblStr)
my.lbls=str2arr(lblStr)
var valStr=document.getElementById('vals').value
optSet('vals',valStr)
my.vals=str2arr(valStr)
my.shapes=[]
for(var i=0;i<my.vals.length;i++){my.vals[i]=parseFloat(my.vals[i])}
console.log('go',my.vals)
g.clearRect(0,0,el.width,el.height)
document.getElementById('grpdiv').style.display='none'
switch(this.type.toLowerCase()){case 'bar':setScale(my.vals,my.lbls)
drawGraph('',my.lbls)
drawBarLine('bar',my.vals)
break
case 'line':setScale(my.vals,my.lbls)
drawGraph('',my.lbls)
drawBarLine('line',my.vals)
break
case 'dot':setScale(my.vals,my.lbls)
drawGraph('dot',my.lbls)
drawBarLine('dot',my.vals)
break
case 'pie':setScale(my.vals,my.lbls)
drawPie(my.vals,my.lbls)
break
case 'histogram':document.getElementById('lblsdiv').style.display='none'
document.getElementById('grpdiv').style.display='block'
histogramDo(my.vals)
break
default:}}
function histogramDo(vals){var min=Number.MAX_VALUE
var max=-Number.MAX_VALUE
for(i=0;i<vals.length;i++){var v=vals[i]
min=Math.min(min,v)
max=Math.max(max,v)}
var grpSize=document.getElementById('grp').value
grpSize=parseFloat(grpSize)
if(isNaN(grpSize)){return}
var mingrp=Math.floor(min/grpSize)*grpSize
var maxgrp=Math.ceil(max/grpSize)*grpSize
var grps=[]
var lbls=[]
for(i=0;i<vals.length;i++){var v=vals[i]
var grpNo=Math.floor((v-mingrp)/grpSize)
if(grps[grpNo]!=null){grps[grpNo]++}else{grps[grpNo]=1}}
for(var i=0;i<=grps.length;i++){var grpFr=mingrp+i*grpSize
var grpTo=mingrp+(i+1)*grpSize
lbls.push(grpFr+'')}
setScale(grps,[])
drawGraph('histogram',lbls)
drawBarLine('histogram',grps)}
function touchStart(evt){var touch=evt.targetTouches[0]
evt.clientX=touch.clientX
evt.clientY=touch.clientY
evt.touchQ=true
mouseDown(evt)}
function touchMove(evt){var touch=evt.targetTouches[0]
evt.clientX=touch.clientX
evt.clientY=touch.clientY
evt.touchQ=true
mouseMove(evt)
evt.preventDefault()}
function touchEnd(evt){el.addEventListener('touchstart',touchStart,false)
window.removeEventListener('touchend',touchEnd,false)
if(my.drag.q){my.drag.q=false
my.disks[my.drag.n].hiliteQ=false
my.drag.n=-1
window.removeEventListener('touchmove',touchMove,false)}}
function doPointer(e){var bRect=el.getBoundingClientRect()
var mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width)
var mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height)
var inQ=false
for(var i=0;i<my.shapes.length;i++){var shape=my.shapes[i]
if(hitTest(shape,mouseX,mouseY)){inQ=true
console.log('doPointer',i)}}
if(inQ){document.body.style.cursor='pointer'}else{document.body.style.cursor='default'}}
function mouseDown(evt){var i
var bRect=el.getBoundingClientRect()
var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width)
var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height)
for(var i=0;i<my.shapes.length;i++){var shape=my.shapes[i]
if(hitTest(shape,mouseX,mouseY)){console.log('mouseDown',i,shape)
my.currN=i
clrSet(my.clrs[i][0])
my.editPop.open()}}
if(evt.preventDefault){evt.preventDefault()}
else if(evt.returnValue){evt.returnValue=false}
return false}
function mouseUp(evt){el.addEventListener('mousedown',mouseDown,false)
window.removeEventListener('mouseup',mouseUp,false)
if(my.drag.q){my.drag.q=false
my.disks[my.drag.n].hiliteQ=false
my.drag.n=-1
window.removeEventListener('mousemove',mouseMove,false)}}
function mouseMove(evt){if(my.drag.n<0)return
var bRect=el.getBoundingClientRect()
var mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width)
var mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height)
var posX=mouseX-my.drag.hold.x
var posY=mouseY-my.drag.hold.y
my.disks[my.drag.n].x=posX
my.disks[my.drag.n].y=posY
my.disks[my.drag.n].moveMe(true)}
function setScale(vals,lbls){my.xstt=0
my.xend=Math.max(vals.length,lbls.length)+1
my.xspan=my.xend-my.xstt
if(my.xspan<=0)my.xspan=0.1
my.xscale=my.xspan/this.wd
my.ystt=0
my.yend=0
for(var i=0;i<vals.length;i++){var v=Number(vals[i])
if(v<my.ystt)my.ystt=v
if(v>my.yend)my.yend=v}
my.yend+=1
my.yspan=my.yend-my.ystt
if(Math.abs(my.yspan)<0.1)my.yspan=0.1
my.yscale=my.yspan/this.ht}
function drawBarLine(typ,vals){g.font=' bold 18px Verdana'
g.textAlign='center'
g.fillStyle='#204080'
g.fillText(optGet('title'),this.lt+this.wd/2,this.tp-8)
g.font='16px Verdana'
g.fillStyle='blue'
g.fillText(optGet('xtitl'),this.lt+this.wd/2,my.lblYMax+20)
g.fillStyle='darkorange'
var rot=-Math.PI/2
g.rotate(rot)
g.fillText(optGet('ytitl'),-this.ht/2-10,15)
g.rotate(-rot)
var valTot=0
if(my.pctsQ){for(i=0;i<vals.length;i++){if(vals[i]!=undefined){valTot+=Number(vals[i])}}}
console.log('drawBarLine',typ,vals)
var xTick=1
var clrnum=0
g.lineStyle='0000ff'
g.lineWidth=1
var prevPt=[]
for(var x=my.xstt;x<=my.xend;x+=xTick){if(x>my.xstt&&x<my.xend){var v=0
if(vals[x-1]!=undefined)v=vals[x-1]
i=this.lt+(x-my.xstt)/my.xscale
var j=v/my.yscale
var clr='#8888ff'
if(my.clrsQ){clr=my.clrs[clrnum][1]}
var barwidth=(0.8*this.wd)/my.xspan
if(barwidth>50)barwidth=50
switch(typ){case 'bar':if(v!=0){g.beginPath()
g.strokeStyle='black'
g.fillStyle=clr
g.rect(i-barwidth/2,this.tp+this.ht+my.ystt/my.yscale,barwidth,-j)
g.stroke()
g.fill()
my.shapes.push({x:i-barwidth/2,y:this.tp+this.ht+my.ystt/my.yscale-j,wd:barwidth,ht:j})}
break
case 'histogram':if(v!=0){g.beginPath()
g.strokeStyle='black'
g.fillStyle=clr
barwidth=1/my.xscale
g.rect(i-barwidth/2,this.tp+this.ht+my.ystt/my.yscale,barwidth,-j)
g.stroke()
g.fill()
my.shapes.push({x:i-barwidth/2,y:this.tp+this.ht+my.ystt/my.yscale-j,wd:barwidth,ht:j})}
break
case 'dot':var dirn=1
if(v<0){v=-v
dirn=-1}
if(v>0&&v<=200){g.strokeStyle='black'
g.fillStyle=clr
var radius=Math.min(barwidth/2,0.4/my.yscale)
for(var yN=0;yN<v;yN++){var yPos=this.tp+this.ht+my.ystt/my.yscale-dirn*(yN+0.6)*radius*2*1.2
g.beginPath()
g.arc(i,yPos,radius,0,2*Math.PI)
g.stroke()
g.fill()}
my.shapes.push({x:i-barwidth/2,y:this.tp+this.ht+my.ystt/my.yscale-j,wd:barwidth,ht:j})}
break
case 'line':var pt=[i,this.tp+this.ht-j+my.ystt/my.yscale]
var rad=20
my.shapes.push({x:i-rad,y:this.tp+this.ht+my.ystt/my.yscale-j-rad,wd:rad*2,ht:rad*2})
if(prevPt.length>0){g.beginPath()
g.strokeStyle='#204080'
g.lineWidth=2
g.fillStyle=clr
g.moveTo(prevPt[0],prevPt[1])
g.lineTo(pt[0],pt[1])
g.stroke()
g.fill()}
if(my.pntsQ){g.fillStyle='#204080'
g.beginPath()
g.arc(pt[0],pt[1],4,0,2*Math.PI)
g.fill()}
prevPt[0]=pt[0]
prevPt[1]=pt[1]
break
default:}
var txtWidth=80
if(v!=0){var valPct=Math.round((1000*v)/valTot)/10
var txt=''
if(my.numsQ){if(my.pctsQ){txt+=v+'  ('+valPct+'%)'}else{txt+=v}}else{if(my.pctsQ){txt+=valPct+'%'}}
if(txt.length>0){g.fillStyle=clr
g.font='14px Arial'
var extra=5
g.fillText(txt,i,this.tp+this.ht-j+my.ystt/my.yscale-extra)}}
clrnum++
if(clrnum>=my.clrs.length){clrnum=0}}}}
function drawPie(vals,lbls){var cx=w/2
var cy=40+this.ht/2
var radius=130
g.font='16px Verdana'
g.textAlign='center'
g.fillStyle='black'
g.fillText(optGet('title'),cx,25)
g.fillStyle='blue'
g.fillText(optGet('xtitl'),cx,cy+radius+55)
var totVal=0
for(i=0;i<vals.length;i++){if(vals[i]!=undefined){totVal+=Number(vals[i])}}
var count=Math.max(vals.length,lbls.length)
var cumVal=0
if(totVal>0){var prevAngle=-Math.PI/2
for(i=0;i<count;i++){var v=0
if(vals[i]!=undefined)v=vals[i]
if(v!=0){cumVal+=Number(v)
var newAngle=2*Math.PI*(cumVal/totVal)-Math.PI/2
var clr='#0000ff'
if(my.clrsQ){clr=my.clrs[i][1]}
g.beginPath()
g.strokeStyle='black'
g.fillStyle=clr
g.moveTo(cx,cy)
g.arc(cx,cy,radius,prevAngle,newAngle)
g.lineTo(cx,cy)
g.stroke()
g.fill()
var pctVal=Math.round((1000*vals[i])/totVal)/10
var avgAngle=(prevAngle+newAngle)/2
var lbl=''
if(lbls[i]!=undefined){if(lbls[i].length>0){lbl=lbls[i]}}
var valStr=''
if(my.numsQ){if(my.pctsQ){valStr+=vals[i]+'  ('+pctVal+'%)'}else{valStr+=vals[i]}}else{if(my.pctsQ){valStr+=pctVal+'%'}else{}}
var txtX=cx+Math.cos(avgAngle)*(radius+10)
var txtY=cy+Math.sin(avgAngle)*(radius+10)
var txt=''
if(lbl.length>0){txt=lbl}
if(valStr.length>0){if(txt.length>0)txt+=': '
txt+=valStr}
var place=getPlace(avgAngle)
g.textAlign=place[2]
g.font='14px Verdana'
g.fillText(txt,txtX+place[0],txtY+place[1])
prevAngle=newAngle}}}}
function getPlace(angle){var places=[[0,75,[0,0,'left']],[75,105,[0,15,'center']],[105,255,[0,0,'right']],[255,285,[0,0,'center']],[285,360,[]],]
places[4][2]=places[0][2]
var angled=(angle*180)/Math.PI
angled-=Math.round(angled/360-0.5)*360
for(var i=0;i<places.length;i++){if(angled>=places[i][0]&&angled<=places[i][1]){return places[i][2]}}
return places[0][2]}
function drawGraph(typ,lbls){g.beginPath()
g.lineWidth=1
g.strokeStyle='#204080'
g.fillStyle='rgba(0,0,255,0.3)'
g.rect(this.lt,this.tp,this.wd,this.ht)
g.stroke()
my.lblYMax=0
var xIntq=true
var xMajorTick=1
var xMinorTick=1
var yIntQ=false
var yMajorTick=1
var yMinorTick=1
if(!yIntQ){var logSpan=Math.log(my.yspan*0.6)*Math.LOG10E
yMajorTick=Math.pow(10,Math.floor(logSpan))
if(logSpan-Math.floor(logSpan)<0.4){yMajorTick/=2}
yMinorTick=yMajorTick/5}
for(var tickLevel=0;tickLevel<1;tickLevel++){var xTick,yTick
var lbl=''
if(tickLevel==0){g.strokeStyle='rgba(0,0,255,0.2)'
xTick=xMajorTick
yTick=yMajorTick}else{g.strokeStyle='rgba(0,0,255,0.1)'
xTick=xMinorTick
yTick=yMinorTick}
for(var x=Math.ceil(my.xstt/xTick)*xTick;x<=my.xend;x+=xTick){i=(x-my.xstt)/my.xscale
lbl='['+x+']'
var lineQ=false
var lblQ=false
if(xIntq){if(tickLevel==0){if(x>my.xstt&&x<my.xend){lineQ=true
lblQ=true
if(lbls.length>x-1){if(lbls[x-1].length>0){lbl=lbls[x-1]}}}}}else{lineQ=true
if(tickLevel==0){lblQ=true}}
if(typ!='dot'){if(lineQ){g.beginPath()
g.moveTo(this.lt+i,this.tp)
g.lineTo(this.lt+i,this.tp+this.ht)
g.stroke()}}
if(typ=='histogram'){if(lblQ){var txtWidth=this.wd/my.xend
g.font='14px Verdana'
g.fillStyle='blue'
g.textAlign='center'
wrapText(g,lbl,this.lt+i-txtWidth/2,this.tp+this.ht+18,txtWidth,16)}}else{if(lblQ){var txtWidth=100
if(my.xend>2)txtWidth=this.wd/my.xend
g.font='14px Verdana'
g.fillStyle='blue'
g.textAlign='center'
wrapText(g,lbl,this.lt+i,this.tp+this.ht+18,txtWidth,16)}}}
if(typ=='histogram'){lbl=lbls[my.xend-1]
i=(my.xend-my.xstt)/my.xscale
var txtWidth=this.wd/my.xend
g.font='14px Verdana'
g.fillStyle='blue'
g.textAlign='center'
g.fillText(lbl,this.lt+i-txtWidth/2,this.tp+this.ht+20)}
for(var y=Math.ceil(my.ystt/yTick)*yTick;y<=my.yend;y+=yTick){var j=(my.yend-y)/my.yscale
var lbl=y
var lineQ=false
var lblQ=true
if(yIntQ){if(tickLevel==0){if(y>my.ystt&&y<my.yend){lineQ=true}}}else{lineQ=true
if(tickLevel==0){lblQ=true}}
if(typ!='dot'){if(lineQ){g.beginPath()
g.moveTo(this.lt,this.tp+j)
g.lineTo(this.lt+this.wd,this.tp+j)
g.stroke()}}
if(typ!='dot'){if(lblQ){g.font='16px Verdana'
g.fillStyle='darkorange'
g.textAlign='right'
g.fillText(y,this.lt-5,this.tp+j+5)}}}
if(my.ystt!=0){var j=my.yend/my.yscale
g.strokeStyle='black'
g.lineWidth=1.6
g.beginPath()
g.moveTo(this.lt,this.tp+j)
g.lineTo(this.lt+this.wd,this.tp+j)
g.stroke()}}}
function canvasSave(){var can=document.getElementById('can')
var dataUrl=can.toDataURL('image/png')
var win=window.open()
win.document.write("<img src='"+dataUrl+"'/>")
win.document.location='#'}
function canvasPrint(){var can=document.getElementById('can')
var dataUrl=can.toDataURL('image/png')
var win=window.open()
win.document.write("<img src='"+dataUrl+"'/>")
win.document.location='#'
var isChrome=window.navigator.userAgent.toLowerCase().indexOf('chrome')>-1
if(isChrome){win.focus()
setTimeout(function(){win.focus()
win.print()},500)}else{win.focus()
win.print()
win.close()}}
function wrapText(context,text,x,y,maxWidth,lineHeight){var words=text.split(' ')
var line=''
for(var n=0;n<words.length;n++){var testLine=line+words[n]+' '
var metrics=context.measureText(testLine)
var testWidth=metrics.width
if(testWidth>maxWidth&&n>0){context.fillText(line,x,y)
line=words[n]+' '
y+=lineHeight}else{line=testLine}}
my.lblYMax=Math.max(my.lblYMax,y)
context.fillText(line,x,y)}
function hitTest(shape,mx,my){if(mx<shape.x)return false
if(my<shape.y)return false
if(mx>shape.x+shape.wd)return false
if(my>shape.y+shape.ht)return false
return true}
class Pop{constructor(id,yesStr,yesFunc,noStr,noFunc){this.id=id
this.div=document.getElementById(this.id)
this.div.style='position:absolute; left:-450px; top:10px; width:auto; padding: 5px; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; '
this.bodyDiv=document.createElement('div')
this.div.appendChild(this.bodyDiv)
if(true){var yesBtn=document.createElement('button')
this.div.appendChild(yesBtn)
if(yesStr.length<1){yesStr='&#x2714;'
yesBtn.style='font: 22px Arial;'}
yesBtn.innerHTML=yesStr
yesBtn.classList.add('togglebtn')
yesBtn.onclick=this.yes.bind(this)}
if(false){var noBtn=document.createElement('button')
this.div.appendChild(noBtn)
if(noStr.length<1){noStr='&#x2718;'
noBtn.style='font: 22px Arial;'}
noBtn.innerHTML=noStr
noBtn.classList.add('togglebtn')
noBtn.onclick=this.no.bind(this)}
this.yesFunc=yesFunc
this.noFunc=noFunc
return this}
open(){var div=this.div
div.style.transitionDuration='0.3s'
div.style.opacity=1
div.style.zIndex=12
div.style.left=130+'px'
div.style.top=110+'px'}
yes(me){console.log('me',me)
var div=document.getElementById(this.id)
div.style.opacity=0
div.style.zIndex=1
div.style.left='-999px'
if(typeof this.yesFunc==='function'){this.yesFunc()}}
no(){console.log('Pop no')
var div=this.div
div.style.opacity=0
div.style.zIndex=1
div.style.left='-999px'
if(typeof this.noFunc==='function'){this.noFunc()}}
bodySet(s){this.bodyDiv.innerHTML=s
return s}}
function dropdownHTML(opts,funcName,id){var s=''
s+='<select id="'+id+'" style="font: 15px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off" >'
for(var i=0;i<opts.length;i++){var idStr=id+i
var chkStr=i==0?'selected':''
var opt=opts[i][0]
s+='<option id="'+idStr+'" value="'+opt+'" style="height:18px;" '+chkStr+' >'+opt+'</option>'}
s+='</select>'
return s}
function clrChg(){var div=document.getElementById('clrs')
var str=div.options[div.selectedIndex].value
console.log('clrChg',str,div.selectedIndex,my.baseClrs[div.selectedIndex])
my.clrs[my.currN]=my.baseClrs[div.selectedIndex]
go()}
function clrSet(val){var div=document.getElementById('clrs')
div.value=val}
function optGet(name){var val=localStorage.getItem(`datagraph.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`datagraph.${name}`,val)
my.opts[name]=val}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
class Can{constructor(id,wd,ht,ratio){this.id=id
this.wd=wd
this.ht=ht
this.ratio=ratio
let el=document.getElementById(id)
el.width=wd*ratio
el.style.width=wd+'px'
el.height=ht*ratio
el.style.height=ht+'px'
this.g=el.getContext('2d')
this.g.setTransform(ratio,0,0,ratio,0,0)
this.el=el
return this}
clear(){this.g.clearRect(0,0,this.wd,this.ht)}
mousePos(ev){let bRect=this.el.getBoundingClientRect()
let mouseX=(ev.clientX-bRect.left)*(this.el.width/this.ratio/bRect.width)
let mouseY=(ev.clientY-bRect.top)*(this.el.height/this.ratio/bRect.height)
return[mouseX,mouseY]}}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
s+={btn:()=>{if(cls.length==0)cls='btn'
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>'<div',edit:()=>{let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<textarea onkeyup="'+fn+'" onchange="'+fn+'"'
return s},inp:()=>{if(cls.length==0)cls='input'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input value="'+txt+'"'
s+=fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''
return s},out:()=>{pos='dib'
if(cls.length==0)cls='output'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<span '
return s},rad:()=>{if(cls.length==0)cls='radio'
return '<form'+(fn.length>0?(s+=' onclick="'+fn+'"'):'')},sel:()=>{if(cls.length==0)cls='select'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<select '
s+=fn.length>0?'  onchange="'+fn+'"':''
return s},sld:()=>'<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"',}[tag]()||''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+={btn:()=>'>'+txt+'</button>',can:()=>'></canvas>',div:()=>' >'+txt+'</div>',edit:()=>' >'+txt+'</textarea>',inp:()=>'>'+(lbl.length>0?'</label>':''),out:()=>' >'+txt+'</span>'+(lbl.length>0?'</label>':''),rad:()=>{let s=''
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
let chkStr=opt.descr==txt?' selected ':''
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+opt.descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'
return s},sld:()=>'>',}[tag]()||''
s+='\n'
return s.trim()}
init()