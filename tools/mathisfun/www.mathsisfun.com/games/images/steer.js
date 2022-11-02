let my={}
function init(){let version='0.52'
my.wd=Math.max(600,window.innerWidth-30)
my.ht=Math.max(500,window.innerHeight-50)
console.log('my.wd,my.ht',my.wd,my.ht)
my.theme=localStorage.getItem('theme')
my.fadeClr=my.theme=='dark'?'rgba(0,0,0,0.02)':'rgba(225,235,255,0.02)'
my.playQ=true
my.frame=0
my.car=new Car()
my.imgs=[{file:'BMW-Z4.svg',lt:25,tp:38,wd:160},{file:'glibersat.svg',lt:28,tp:36,wd:160},]
my.img=my.imgs[0]
my.zone={wd:200,ht:100}
let s=''
s+=`<div style="position: relative; width: ${my.wd}px; height: ${my.ht}px; text-align: center; margin:auto;
  border-radius:10px; box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">`
s+='<canvas id="canTrack" style="position: absolute; width:0; height:0; left: 0px; top: 0px; z-index: 3; "></canvas>'
my.imgHome=document.domain=='localhost'?'/mathsisfun/games/images/':'/games/images/'
s+='<img id="car" src="'+my.imgHome+my.img.file+'" style="position: absolute; left: 0px; top: 0px; width:'+my.img.wd+'px; transform-origin: '+my.img.lt+'px '+my.img.tp+'px;z-index: 4;">'
s+='<canvas id="canBd" style="position: absolute; width:0; height:0; left: 0px; top: 0px; z-index: 5; "></canvas>'
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2022 Rod Pierce  v${version}`)
s+='</div>'
s=wrap({id:'',tag:'div',pos:'abs',style:'left:0px; height:'+my.ht+'px;'},s)
s+=wrap({id:'',tag:'div',style:'height:'+my.ht+'px;'})
docInsert(s)
my.canTrack=new Can('canTrack',my.wd,my.ht,2)
my.canBd=new Can('canBd',my.wd,my.ht,2)
my.rotLtQ=false
my.rotRtQ=false
my.speedUpQ=false
my.speedDnQ=false
my.brakeQ=false
document.onkeydown=function(e){e.preventDefault()
switch(e.keyCode){case 37:my.rotLtQ=true
break
case 39:my.rotRtQ=true
break
case 38:my.speedUpQ=true
break
case 40:my.speedDnQ=true
break
case 32:my.brakeQ=true
break
case 78:polyNext()
break
default:console.log('',e.keyCode)}}
document.onkeyup=function(e){switch(e.keyCode){case 37:my.rotLtQ=false
break
case 39:my.rotRtQ=false
break
case 38:my.speedUpQ=false
break
case 40:my.speedDnQ=false
break
case 32:my.brakeQ=false}}
window.addEventListener('mousedown',function(ev){console.log('['+ev.clientX+','+ev.clientY+']')},false)
my.polys=[[[287,60],[451,60],[451,147],[287,147],],[[36,140],[217,139],[220,252],[107,224],[38,239],],[[472,10],[580,10],[580,273],[472,273],],[[127,292],[278,327],[181,472],[115,453],],[[441,32],[299,177],[529,202],],[[100,200],[100,340],[200,340],[200,200],],[[12,11],[160,11],[160,105],[12,105],],[[430,200],[340,323],[195,276],[195,124],[340,76],],[[213,251],[288,187],[405,311],[333,374],],[[346,397],[455,290],[526,349],[522,458],],]
my.poly=new Poly()
my.polyN=-1
polyNext()
go()
anim()}
function go(){my.car.move()
my.car.draw()
my.frameN=0}
function anim(){this.frame++
my.car.update()
my.car.move()
my.car.draw()
my.car.wheelsDraw()
if(my.playQ&&my.frameN++<500000)requestAnimationFrame(anim)}
class Car{constructor(){this.len=100
this.wd=30
this.vel={ang:0,mag:0,x:0,y:0,dAng:0,dMag:0}
this.rear={x:100,y:100}
this.head={x:this.rear.x+this.len,y:100,ang:0.2}
this.carAng=0
this.wheels=[{dy:-this.wd,rearQ:true},{dy:this.wd,rearQ:true},{dy:-this.wd,rearQ:false},{dy:this.wd,rearQ:false},]
this.prev={lt:0,tp:0,ang:0}}
update(){if(my.rotLtQ)this.vel.ang-=0.018
if(my.rotRtQ)this.vel.ang+=0.018
this.vel.ang=Math.max(-0.8,Math.min(this.vel.ang,0.8))
if(my.speedUpQ)this.vel.mag+=0.05
if(my.speedDnQ)this.vel.mag-=0.05
this.vel.mag=Math.max(-1,Math.min(this.vel.mag,3))
if(my.brakeQ){this.vel.mag*=0.95
if(Math.abs(this.vel.mag)<0.3)this.vel.mag=0}}
move(){let totAng=this.vel.ang+this.carAng
this.vel.x=this.vel.mag*Math.cos(totAng)
this.vel.y=this.vel.mag*Math.sin(totAng)
this.head.x+=this.vel.x
this.head.y+=this.vel.y
this.carAng=Math.atan2(this.head.y-this.rear.y,this.head.x-this.rear.x)
let xy=polarToCart(this.len,this.carAng)
this.rear.x=this.head.x-xy.x
this.rear.y=this.head.y-xy.y
let div=document.getElementById('car')
let lt=fmt(this.rear.x-my.img.lt,5)
let tp=fmt(this.rear.y-my.img.tp,5)
let rot=fmt(this.carAng,5)
if(this.prev.lt!=lt||this.prev.tp!=tp||this.prev.rot!=rot){if(my.frame++>20){my.frame=0
let g=my.canTrack.g
g.fillStyle=my.fadeClr
g.fillRect(0,0,g.canvas.width,g.canvas.height)
g.strokeStyle='black'
g.fillStyle='#ffe'
g.beginPath()
my.poly.drawLines(g)
g.fill()
g.stroke()}
div.style.left=lt+'px'
this.prev.lt=lt
div.style.top=tp+'px'
this.prev.tp=tp
div.style.transform='rotate('+rot+'rad)'
this.prev.rot=rot
let inQ=true
for(let i=0;i<this.wheels.length;i++){let wheel=this.wheels[i]
if(!my.poly.insideQ(wheel.x,wheel.y)){inQ=false
break}}
let mid={x:(this.head.x+this.rear.x)/2,y:(this.head.y+this.rear.y)/2}
let inCanQ=true
if(mid.x<0)inCanQ=false
if(mid.y<0)inCanQ=false
if(mid.x>my.wd)inCanQ=false
if(mid.y>my.ht)inCanQ=false
if(!inCanQ){this.vel.mag=0}
let g=my.canTrack.g
if(inQ){polyDone()}else{g.strokeStyle='black'
g.beginPath()
my.poly.drawLines(g)
g.stroke()}}}
draw(){let g=my.canBd.g
g.clearRect(0,0,g.canvas.width,g.canvas.height)}
wheelsDraw(){this.carAng=Math.atan2(this.head.y-this.rear.y,this.head.x-this.rear.x)
this.wheels.map((wheel)=>{let x=wheel.rearQ?this.rear.x:this.head.x
let y=wheel.rearQ?this.rear.y:this.head.y
let ang=wheel.rearQ?this.carAng:this.carAng
let xy=polarToCart(wheel.dy,ang+Math.PI/2)
wheel.x=x+xy.x
wheel.y=y+xy.y
let wheelWd=22
let wheelHt=10
let pts=[new Pt(-wheelWd/2,-wheelHt/2),new Pt(+wheelWd/2,-wheelHt/2),new Pt(+wheelWd/2,+wheelHt/2),new Pt(-wheelWd/2,+wheelHt/2)]
let rot=wheel.rearQ?this.carAng:this.carAng+this.vel.ang
let rotPts=ptsRotate(pts,x+xy.x,y+xy.y,-rot)
let g=my.canBd.g
g.strokeStyle='black'
g.fillStyle='white'
g.beginPath()
ptsDraw(g,rotPts,true)
g.fill()
g.stroke()
g=my.canTrack.g
g.strokeStyle='green'
g.fillStyle='yellow'
g.beginPath()
ptsDraw(g,rotPts,true)
g.fill()
g.stroke()})}}
function polyDone(){console.log('polyDone')
let g=my.canTrack.g
g.strokeStyle='black'
g.fillStyle='blue'
g.beginPath()
my.poly.drawLines(g)
g.fill()
g.stroke()
polyNext()}
function polyNext(){my.polyN++
if(my.polyN>=my.polys.length)my.polyN=0
my.poly.ptsSet(my.polys[my.polyN])
console.log('polyNew: ',my.poly.toString())
console.log('my.poly',my.poly)
if(my.polyN>0){let extents=my.poly.extents()
console.log('extents',extents)
let wiggleWd=Math.random()*(my.wd-extents.xSpan)-extents.xStt
console.log('wiggleWd',wiggleWd)
let wiggleHt=Math.random()*(my.ht-extents.ySpan)-extents.yStt
console.log('wiggleHt',wiggleHt)
my.poly.trans(wiggleWd,wiggleHt)
console.log('my.poly',my.poly)}
my.poly.pts2pxs()
let g=my.canTrack.g
g.strokeStyle='black'
g.fillStyle='#ffe'
g.beginPath()
my.poly.drawLines(g)
g.fill()
g.stroke()}
function ptsRotate(pts,midX,midY,rot){var newPts=[]
for(var i=0;i<pts.length;i++){var pt=pts[i]
newPts.push(pt.rotate(rot).add(midX,midY))}
return newPts}
function polarToCart(dist,ang){return{x:dist*Math.cos(ang),y:dist*Math.sin(ang),}}
function cartToPolar(x,y){return{dist:1,ang:Math.atan2(y,x),}}
class Pt{constructor(x,y){this.x=x
this.y=y
this.name='?'
this.rad=12}
add(dx,dy){return new Pt(this.x+dx,this.y+dy)}
rotate(angle){var cosa=Math.cos(angle)
var sina=Math.sin(angle)
var xPos=this.x*cosa+this.y*sina
var yPos=-this.x*sina+this.y*cosa
return new Pt(xPos,yPos)}
getAvg(pts){let xSum=0
let ySum=0
console.log('pts',pts)
for(let i=0;i<pts.length;i++){xSum+=pts[i].x
ySum+=pts[i].y}
let newPt=new Pt(xSum/pts.length,ySum/pts.length)
newPt.x=xSum/pts.length
newPt.y=ySum/pts.length
return newPt}
setAvg(pts){let newPt=this.getAvg(pts)
this.x=newPt.x
this.y=newPt.y}}
function ptsDraw(g,pts,closeQ){closeQ=typeof closeQ!=='undefined'?closeQ:false
for(var i=0;i<pts.length;i++){if(i==0){g.moveTo(pts[i].x,pts[i].y)}else{g.lineTo(pts[i].x,pts[i].y)}}
if(closeQ){g.lineTo(pts[0].x,pts[0].y)}}
function getRegular(midX,midY,radius,sttAngle,n){let pts=[]
let dAngle=(Math.PI*2)/n
for(let i=0;i<n;i++){let angle=sttAngle+i*dAngle
let x=midX+radius*Math.cos(angle)
let y=midY+radius*Math.sin(angle)
pts.push(new Pt(x,y))}
return pts}
class Poly{constructor(){this.pts=[]
this.pxs=[]}
updateMe(){setAngles(this.pxs)
this.sides=getSides(this.pxs)}
insideQ(x,y){var inside=false
for(var i=0,j=this.pts.length-1;i<this.pts.length;j=i++){let xi=this.pts[i].x
let yi=this.pts[i].y
let xj=this.pts[j].x
let yj=this.pts[j].y
var intersect=yi>y!=yj>y&&x<((xj-xi)*(y-yi))/(yj-yi)+xi
if(intersect)inside=!inside}
return inside}
trans(dx,dy){for(let i=0;i<this.pts.length;i++){this.pts[i].x+=dx
this.pts[i].y+=dy}}
ptsSet(pts){this.pts=[]
for(let i=0;i<pts.length;i++){let pt=pts[i]
this.pts.push(new Pt(pt[0],pt[1]))}}
pts2pxs(){this.pxs=[]
if(my.coords==undefined){for(let i=0;i<this.pts.length;i++){let pt=this.pts[i]
let px=new Pt(pt.x,pt.y)
this.pxs.push(px)}}else{for(let i=0;i<this.pts.length;i++){let pt=this.pts[i]
let px=new Pt(my.coords.toXPix(pt.x),my.coords.toYPix(pt.y))
this.pxs.push(px)}}}
toString(){let s=''
for(let i=0;i<this.pts.length;i++){let pt=this.pts[i]
s+='['
s+=fmt(pt.x,4)+', '
s+=fmt(pt.y,4)
s+='],'}
return s}
extents(borderFactor=1){let xStt,xEnd,yStt,yEnd
for(let i=0;i<this.pts.length;i++){let pt=this.pts[i]
if(i==0){xStt=pt.x
xEnd=pt.x
yStt=pt.y
yEnd=pt.y}else{xStt=Math.min(xStt,pt.x)
xEnd=Math.max(xEnd,pt.x)
yStt=Math.min(yStt,pt.y)
yEnd=Math.max(yEnd,pt.y)}}
let xMid=(xStt+xEnd)/2
let xhalfspan=(borderFactor*(xEnd-xStt))/2
xStt=xMid-xhalfspan
xEnd=xMid+xhalfspan
let yMid=(yStt+yEnd)/2
let yhalfspan=(borderFactor*(yEnd-yStt))/2
yStt=yMid-yhalfspan
yEnd=yMid+yhalfspan
return{xStt:xStt,xEnd:xEnd,yStt:yStt,yEnd:yEnd,xSpan:xEnd-xStt,ySpan:yEnd-yStt}}
drawDiags(g){g.strokeStyle='#666666'
let diagCount=0
for(let i=0;i<this.pxs.length-2;i++){for(let j=i+2;j<this.pxs.length;j++){if(i==0&&j==this.pxs.length-1){}else{g.beginPath()
g.moveTo(this.pxs[i].x,this.pxs[i].y)
g.lineTo(this.pxs[j].x,this.pxs[j].y)
g.stroke()
diagCount++}}}}
drawLines(g){g.beginPath()
for(let i=0;i<this.pxs.length;i++){g.lineTo(this.pxs[i].x,this.pxs[i].y)}
g.closePath()}
drawGuides(g,orig){let ptsLen=this.pxs.length
for(let i=0;i<ptsLen;i++){let pt=this.pxs[i]
g.beginPath()
g.strokeStyle='rgba(0, 0, 0, 0.5)'
g.moveTo(orig.x,pt.y)
g.lineTo(pt.x,pt.y)
g.stroke()
g.beginPath()
g.moveTo(pt.x,pt.y)
g.lineTo(pt.x,orig.y)
g.stroke()}}
drawSides(g){let ptC=new Pt()
console.log('drawSides',this.pxs)
ptC.setAvg(this.pxs)
g.fillStyle='#000000'
g.font='bold 12px Arial'
let ptM=new Pt()
let ptsLen=this.pxs.length
for(let i=0;i<ptsLen;i++){ptM.setAvg([this.pxs[i],this.pxs[loop(i,0,ptsLen-1,1)]])
ptM.interpolate(ptM,ptC,1.2)
let side=this.sides[loop(i-1,0,ptsLen-1,1)]
side=(my.coords.xScale*side).toFixed(2)
g.fillText(side,ptM.x-10,ptM.y+5,100)}}
isConcave(){for(let i=0;i<this.pxs.length;i++){let pt=this.pxs[i]
let angDeg=Math.round((pt.getAngle()*180)/Math.PI)
if(angDeg>180)return true}
return false}
drawAngles(g){let angSum=0
let angDescr=''
let angs=[]
for(let i=0;i<this.pxs.length;i++){let pt=this.pxs[i]
let angDeg=Math.round((pt.getAngle()*180)/Math.PI)
let d=30
if(angDeg==90){g.strokeStyle='#888888'
g.drawBox(pt.x,pt.y,25,pt.angleOut-Math.PI/2)}else{if(angDeg>90){g.strokeStyle='#ff0000'
d=Math.max(20,30-(angDeg-90)/6)}else{g.strokeStyle='#4444FF'}
g.fillStyle='rgba(0, 0, 255, 0.3)'
g.beginPath()
g.moveTo(pt.x,pt.y)
g.arc(pt.x,pt.y,d,pt.angleIn,pt.angleOut,false)
g.closePath()
g.fill()}
let ang=this.userAngle(pt.getAngle())
if(i<this.pxs.length-1){angSum+=ang}else{ang=(this.pxs.length-2)*180-angSum
if(ang<0)ang+=360}
angs[i]=ang
angDescr+=ang+'° + '
let aMid=(pt.angleIn+pt.angleOut)/2
let txtPt=new Pt(0,0)
txtPt.x=pt.x+(d+15)*Math.cos(aMid)-0
txtPt.y=pt.y+(d+15)*Math.sin(aMid)-0
g.fillStyle='rgba(0, 0, 255, 1)'
g.fillText(Math.round(ang)+'°',txtPt.x-10,txtPt.y+5,100)}
return angs}
userAngle(x){return Math.round((x*180)/Math.PI,this.dec)}
getArea(){let a=0
for(let i=0;i<this.pts.length;i++){let pt0=this.pts[i]
let pt1=this.pts[loop(i,0,this.pxs.length-1,1)]
let a1=pt0.x*pt1.y-pt0.y*pt1.x
a+=a1}
a=Math.abs(a)/2
return a}
getDiagCount(){let n=this.pxs.length
return(n*(n-3))/2}
isComplex(){let lns=[]
for(let i=0;i<this.pxs.length;i++){lns.push(new Line(this.pxs[i],this.pxs[loop(i,0,this.pxs.length-1,1)]))}
for(let i=0;i<this.pxs.length-1;i++){for(let j=i+2;j<this.pxs.length;j++){if(i==0&&j==this.pxs.length-1)continue
let ln=lns[i]
if(ln.isIntersect(lns[j])){if(ln.getIntersection(lns[j],true)==null){}else{return true}}}}
return false}
isRegular(tolerRatio){tolerRatio=typeof tolerRatio!=='undefined'?tolerRatio:0.001
let ptC=new Pt()
ptC.setAvg(this.pxs)
let rads=[]
let lens=[]
for(let i=0;i<this.pxs.length;i++){let pt=this.pxs[i]
rads[i]=dist(pt.x-ptC.x,pt.y-ptC.y)
let nxt=(i+1)%this.pxs.length
let ptN=this.pxs[nxt]
lens[i]=dist(pt.x-ptN.x,pt.y-ptN.y)}
let radAvg=avg(rads)
let lenAvg=avg(lens)
let toler=radAvg*tolerRatio
let sameQ=true
for(let i=0;i<this.pxs.length;i++){if(!isNear(rads[i],radAvg,toler)){sameQ=false
break}
if(!isNear(lens[i],lenAvg,toler)){sameQ=false
break}}
return sameQ}
makeRegular(){let ptC=new Pt()
ptC.setAvg(this.pxs)
let rad=1
let avgQ=false
if(avgQ){let rads=[]
for(let i=0;i<this.pxs.length;i++){let pt=this.pxs[i]
rads[i]=dist(pt.x-ptC.x,pt.y-ptC.y)}
rad=avg(rads)}else{let pt
if(my.dragNo<this.pxs.length){pt=this.pxs[my.dragNo]}else{pt=this.pxs[0]}
rad=dist(pt.x-ptC.x,pt.y-ptC.y)}
let sttAngle=Math.atan2(this.pxs[0].y-ptC.y,this.pxs[0].x-ptC.x)
let dAngle=(Math.PI*2)/this.pxs.length
for(let i=0;i<this.pxs.length;i++){let angle=sttAngle+i*dAngle
this.pxs[i].x=ptC.x+rad*Math.cos(angle)
this.pxs[i].y=ptC.y+rad*Math.sin(angle)}}}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function fmt(num,digits=14){if(num==Number.POSITIVE_INFINITY)return 'undefined'
if(num==Number.NEGATIVE_INFINITY)return 'undefined'
num=num.toPrecision(digits)
num=num.replace(/0+$/,'')
if(num.charAt(num.length-1)=='.')num=num.substr(0,num.length-1)
if(Math.abs(num)<1e-15)num=0
return num}
class Can{constructor(id,wd,ht,ratio){this.ratio=ratio
this.el=typeof id=='string'?document.getElementById(id):id
this.g=this.el.getContext('2d')
this.resize(wd,ht)
return this}
resize(wd,ht){this.wd=wd
this.ht=ht
this.el.width=wd*this.ratio
this.el.style.width=wd+'px'
this.el.height=ht*this.ratio
this.el.style.height=ht+'px'
this.g.setTransform(this.ratio,0,0,this.ratio,0,0)}
clear(){this.g.clearRect(0,0,this.wd,this.ht)}
mousePos(ev){let bRect=this.el.getBoundingClientRect()
let x=(ev.clientX-bRect.left)*(this.el.width/this.ratio/bRect.width)
let y=(ev.clientY-bRect.top)*(this.el.height/this.ratio/bRect.height)
return{x:x,y:y}}}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
let tags={btn:{stt:'<button '+(fn.length>0?' onclick="'+fn+'" ':''),cls:'btn',fin:'>'+txt+'</button>'},can:{stt:'<canvas ',cls:'',fin:'></canvas>'},div:{stt:'<div '+(fn.length>0?' onclick="'+fn+'" ':''),cls:'',fin:' >'+txt+'</div>'},edit:{stt:'<textarea onkeyup="'+fn+'" onchange="'+fn+'"',cls:'',fin:' >'+txt+'</textarea>'},inp:{stt:'<input value="'+txt+'"'+(fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''),cls:'input',fin:'>'+(lbl.length>0?'</label>':'')},out:{stt:'<span ',cls:'output',fin:' >'+txt+'</span>'+(lbl.length>0?'</label>':'')},radio:{stt:'<div ',cls:'radio',fin:'>\n'},sel:{stt:'<select '+(fn.length>0?' onchange="'+fn+'"':''),cls:'select',fin:'>\n'},sld:{stt:'<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"',fin:(lbl.length>0?'</label>':'<span id="'+id+'0">0</span>')},}
let type=tags[tag]
if(lbl.length>0)s+='<label class="label">'+lbl+' '
s+=type.stt
if(cls.length==0)cls=type.cls
if(tag=='div')style+=fn.length>0?' cursor:pointer;':''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+=type.fin
if(tag=='radio'){for(let i=0;i<opts.length;i++){let chk=''
let idi=id+i
let lbl=opts[i]
if(lbl.name==txt)chk='checked'
s+='<div style="display:inline-block; white-space: nowrap;">'
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+fn+'('+i+');" '+chk+' >'
s+='<label for="'+idi+'"  onclick="'+fn+'('+i+');">'
s+=lbl.name+'</label>&nbsp;'
s+='</div>'}
s+='</div>'}
if(tag=='sel'){for(let i=0;i<opts.length;i++){let opt=opts[i]
let idStr=id+i
let chkStr=opt.descr==txt?' selected ':''
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+opt.descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'}
s+='\n'
return s.trim()}
init()