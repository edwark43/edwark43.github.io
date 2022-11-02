let my={}
function init(){let version='0.84'
let s=''
s+='<div style="margin:auto; display:block;">'
s+='<div id="hdr" style="position:absolute; display:block; width:100px; height: 40px; z-index:100;">'
s+=wrap({tag:'btn',style:'width:90px;  z-index:44;',fn:'optPop()'},'Restart')
s+=wrap({tag:'btn',style:'width:90px; z-index:44;',fn:'moreBtn()'},'Jigsaws')
s+=wrap({id:'imageBtn',tag:'btn',class:'hi',style:'width:90px; z-index:44;',fn:'toggleImg()'},'Image')
s+=getPopHTML()
s+='</div>'
s+='<div style="height: 40px;"></div>'
s+='<canvas id="canvasId" style="display:block; margin:auto; z-index:1; text-align: center;"></canvas>'
s+='<div id="jig" style="position:absolute; left:0; top:0; width:100px; height: 100px;"></div>'
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2021 MathsIsFun.com  v${version}`)
s+='</div>'
docInsert(s)
my.can=new Can('canvasId',1000,1000,1)
my.jig=document.getElementById('jig')
my.fileName='passiflora.html'
let imgName=getQueryVariable('img')
if(imgName){imgName=decodeURIComponent(imgName)
imgName=imgName.replace(/[^0-9A-Za-z\-\.]+/g,'')
my.fileName=imgName}
console.log('fileName',my.fileName)
my.imgHome=(document.domain=='localhost'?'/mathsisfun':'')+'/puzzles/images/jigsaw/'
my.rowN=4
my.colN=4
my.pWd=100
my.pHt=100
my.animN=0
my.animTp=0
my.imgQ=true
my.p=[]
window.addEventListener('mousedown',mouseDown,false)
my.touchSelPiece=null
my.touchPt=null
my.jig.addEventListener('touchstart',ontouchstart,false)
my.jig.addEventListener('touchmove',ontouchmove,false)
my.jig.addEventListener('touchend',ontouchend,false)
optPop()}
function toggleImg(){my.imgQ=!my.imgQ
if(my.imgQ){loadImg(0.5,false)}else{loadImg(0,false)}
toggleBtn('imageBtn',my.imgQ)}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
function ontouchstart(evt){evt.preventDefault()
let touch=evt.targetTouches[0]
startIt(touch.clientX,touch.clientY)}
function ontouchmove(evt){let touch=evt.targetTouches[0]
my.touchSelPiece.moveTo(touch.pageX-my.touchPt.x,touch.pageY-my.touchPt.y)
my.touchPt=new Point(touch.pageX,touch.pageY)
evt.preventDefault()}
function ontouchend(evt){finishIt()
evt.preventDefault()}
function moreBtn(){window.location.href='http://www.mathsisfun.com/puzzles/jigsaw-puzzles-index.html'}
function optPop(){let pop=document.getElementById('optpop')
pop.style.transitionDuration='0.3s'
pop.style.opacity=1
pop.style.zIndex=12
pop.style.left='120px'
pop.style.top='20px'}
function userUpdate(){}
function getPopHTML(){let s=''
s+='<div id="optpop" style="position:absolute; left:-450px; top:40px; width:300px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; ">'
let opts=[]
for(let i=3;i<=12;i++){opts.push({name:i,descr:i})}
s+=wrap({id:'rowN',tag:'sel',lbl:'Rows:',txt:'6',opts:opts})
s+=' &nbsp;  '
s+=wrap({id:'colN',tag:'sel',lbl:'Cols:',txt:'6',opts:opts})
s+='<div style="float:right; margin: 0 0 5px 10px;">'
s+='<button onclick="editYes()" style="z-index:2; font: 22px Arial;" class="btn" >&#x2714;</button>'
s+='</div>'
s+='</div>'
return s}
function editYes(){let pop=document.getElementById('optpop')
pop.style.opacity=0
pop.style.zIndex=1
pop.style.left='-500px'
my.rowN=document.getElementById('rowN').value
my.rowN=Math.max(3,Math.min(my.rowN>>0,12))
my.colN=document.getElementById('colN').value
my.colN=Math.max(3,Math.min(my.colN>>0,12))
if(my.imgQ){loadImg(0.5,true)}else{loadImg(0,true)}}
function doAnim(){let pc=my.p[my.animN]
if(my.animTp%2==0){pc.left=pc.canvas.style.left
let left=parseFloat(pc.canvas.style.left)
pc.canvas.style.left=left-(Math.random()-0.5)*60+'px'
pc.top=pc.canvas.style.top
let top=parseFloat(pc.canvas.style.top)
pc.canvas.style.top=top-(Math.random()-0.5)*60+'px'}else{pc.canvas.style.left=pc.left
pc.canvas.style.top=pc.top}
my.animN++
if(my.animN<my.rowN*my.colN){requestAnimationFrame(doAnim)}else{my.animN=0
my.animTp++
if(my.animTp<6)requestAnimationFrame(doAnim)}}
function jiggle(){my.animN=0
my.animTp=0
doAnim()}
function loadImg(alpha,newQ){let g=my.can.g
let el=my.can.el
if(newQ){my.can.clear()
my.jig.innerHTML=''}
let image=new Image()
image.onload=function(){console.log('image.onload',this,this.width,this.height)
let ratio=my.can.ratio
el.width=this.width*ratio
el.style.width=this.width+'px'
el.height=this.height*ratio
el.style.height=this.height+'px'
g.save()
g.globalAlpha=alpha
g.drawImage(this,0,0)
g.restore()
g.fillStyle='rgba(255,255,255,'+alpha+')'
g.fillRect(0,0,this.width,this.height)
if(newQ)go(this)}
image.src=my.imgHome+my.fileName}
function getRandPts(){let rect=my.jig.getBoundingClientRect()
let pts=[]
let xCurr=-rect.left
let yCurr=0
for(let i=0;i<my.colN*my.rowN;i++){pts.push({x:xCurr+Math.random()*my.pWd,y:yCurr+Math.random()*my.pHt,})
xCurr+=my.pWd*1.5
if(xCurr>=document.body.clientWidth-rect.left-my.pWd*2){xCurr=-rect.left
yCurr+=my.pHt*1.5}}
return shuffle(pts)}
function shuffle(array){let tmp,current,top=array.length
if(top)
while(--top){current=Math.floor(Math.random()*(top+1))
tmp=array[current]
array[current]=array[top]
array[top]=tmp}
return array}
function go(img){my.pWd=img.width/my.colN
my.pHt=img.height/my.rowN
console.log('go',img,my.pWd,my.pHt)
let pts=getRandPts()
let ptNo=0
let p=[]
let count=0
for(let l=0;l<my.rowN;l++){for(let k=0;k<my.colN;k++){p.push(new PuzzlePiece({rotation:0,imgwidth:img.width,imgheight:img.height,width:my.pWd,height:my.pHt,image:img,imagepoint:new Point(k*my.pWd,l*my.pHt),top:{first:new Point(k*my.pWd,l*my.pHt),last:new Point(k*my.pWd+my.pWd,l*my.pHt),},right:{first:new Point(k*my.pWd+my.pWd,l*my.pHt),last:new Point(k*my.pWd+my.pWd,l*my.pHt+my.pHt),},bot:{first:new Point(k*my.pWd+my.pWd,l*my.pHt+my.pHt),last:new Point(k*my.pWd,l*my.pHt+my.pHt),},left:{first:new Point(k*my.pWd,l*my.pHt+my.pHt),last:new Point(k*my.pWd,l*my.pHt),},}))
p[p.length-1].canvas.style.setProperty('left',pts[ptNo].x+'px')
p[p.length-1].canvas.style.setProperty('top',pts[ptNo].y+'px')
ptNo++
if(k!==0){let temp=p[p.length-2].right.points
p[p.length-2].pieceright=p[p.length-1]
p[p.length-1].pieceleft=p[p.length-2]
p[p.length-1].left.points=[]
for(let i=0;i<temp.length;i++){p[p.length-1].left.points.push(new Point(temp[i].x-p[p.length-1].width,temp[i].y))}
p[p.length-1].left.points.reverse()}
if(l!==0){let temp2=p[count-my.colN].bot.points
p[count-my.colN].piecebot=p[p.length-1]
p[p.length-1].piecetop=p[count-my.colN]
p[count].top.points=[]
for(let i=0;i<temp2.length;i++){p[count].top.points.push(new Point(temp2[i].x,temp2[i].y-p[count].height))}
p[count].top.points.reverse()}
count++}}
for(let i=0;i<p.length;i++){p[i].canvas.style.zIndex=i
p[i].display()
p[i].connected.push(p[i])
if(false){for(let rotation=Math.floor(Math.random()*4.0);rotation<=4;rotation++){p[i].rotate(p[i])}}}
my.p=p}
function clone(obj){if(null===obj||'object'!=typeof obj)return obj
let copy=obj.constructor()
for(let attr in obj){if(obj.hasOwnProperty(attr))copy[attr]=obj[attr]}
return copy}
function Point(x,y){this.x=x
this.y=y
this.d=Math.sqrt(x*x+y*y)
return this}
Point.prototype={}
let PuzzlePiece=(function(){function PuzzlePiece(obj){this.imgtop=clone(obj.top)
this.rotation=obj.rotation
this.image=obj.image
this.width=obj.width+0
this.height=obj.height+0
this.canvas=document.createElement('canvas')
this.canvas.rotation=0
this.connected=[]
this.canvas.setAttribute('style','position:absolute;')
this.canvas.setAttribute('width',obj.width*3)
this.canvas.setAttribute('height',obj.height*3)
this.canvas.style.setProperty('top',this.imgtop.first.y+1+'px')
this.canvas.style.setProperty('left',this.imgtop.first.x+1+'px')
this.context=this.canvas.getContext('2d')
my.jig.appendChild(this.canvas)
let lt=obj.width
let tp=obj.height
this.top={first:new Point(lt-obj.width/2.0,tp-obj.height/2.0),last:new Point(lt+obj.width/2.0,tp-obj.height/2.0),}
this.right={first:new Point(lt+obj.width/2.0,tp-obj.height/2.0),last:new Point(lt+obj.width/2.0,tp+obj.height/2.0),}
this.bot={first:new Point(lt+obj.width/2.0,tp+obj.height/2.0),last:new Point(lt-obj.width/2.0,tp+obj.height/2.0),}
this.left={first:new Point(lt-obj.width/2.0,tp+obj.height/2.0),last:new Point(lt-obj.width/2.0,tp-obj.height/2.0),}
if(obj.left.first.x>0){this.left.points=this.makeSide(this.left)}else{this.left.points=[]
this.left.points.push(this.left.first)
this.left.points.push(this.left.last)}
if(obj.top.first.y>0){this.top.points=this.makeSide(this.top)}else{this.top.points=[]
this.top.points.push(this.top.first)
this.top.points.push(this.top.last)}
if(parseFloat(obj.right.first.x)>=parseFloat(obj.imgwidth)-1){this.right.points=[]
this.right.points.push(this.right.first)
this.right.points.push(this.right.last)}else{this.right.points=this.makeSide(this.right)}
if(parseFloat(obj.bot.last.y)>=parseFloat(obj.imgheight)-1){this.bot.points=[]
this.bot.points.push(this.bot.first)
this.bot.points.push(this.bot.last)}else{this.bot.points=this.makeSide(this.bot)}
this.display=function(){this.context.beginPath()
this.dBezierCurve(this.top.points)
this.dBezierCurve(this.right.points)
this.dBezierCurve(this.bot.points)
this.dBezierCurve(this.left.points)
this.context.closePath()
this.context.save()
this.context.clip()
this.context.drawImage(this.image,my.pWd/2-this.imgtop.first.x,my.pHt/2-this.imgtop.first.y)
this.context.strokeStyle='#333'
this.context.lineWidth=1
this.context.stroke()}}
return PuzzlePiece})()
PuzzlePiece.prototype={rotate:function(around){this.connected.forEach(function(element){let temptop=parseFloat(around.canvas.style.top)-(parseFloat(around.canvas.style.left)-parseFloat(element.canvas.style.left))
let templeft=parseFloat(around.canvas.style.left)+(parseFloat(around.canvas.style.top)-parseFloat(element.canvas.style.top))
element.canvas.style.setProperty('top',temptop+'px')
element.canvas.style.setProperty('left',templeft+'px')
element.canvas.getContext('2d').restore()
element.canvas.getContext('2d').clearRect(0,0,element.canvas.width,element.canvas.height)
element.context.translate(element.canvas.width/2.0,element.canvas.height/2.0)
element.canvas.getContext('2d').rotate(Math.PI/2.0)
element.rotation+=1
element.rotation%=4
element.context.translate(-(element.canvas.width/2.0),-(element.canvas.height/2.0))
element.display()
let origtop=element.piecetop
let origright=element.pieceright
let origbot=element.piecebot
let origleft=element.pieceleft
element.piecetop=null
element.pieceright=null
element.piecebot=null
element.pieceleft=null
element.piecetop=origleft
element.pieceright=origtop
element.piecebot=origright
element.pieceleft=origbot})},moveTo:function(x,y){this.connected.forEach(function(element){element.canvas.style.setProperty('left',parseFloat(element.canvas.style.left)+x+'px')
element.canvas.style.setProperty('top',parseFloat(element.canvas.style.top)+y+'px')})},dBezierCurve:function(){let controlpoint=3.5
let args=Array.prototype.slice.call(arguments)
if(args[0].length>1){args=args[0]}
if(args.length<=2){this.context.lineTo(args[0].x,args[0].y)
this.context.lineTo(args[1].x,args[1].y)
return}
let a=[]
a.push(args[0])
for(let j=0;j<args.length;j++){a.push(args[j])}
a.push(args[args.length-1])
args=a
for(let i=2;i<args.length-1;i++){let before=new Point(args[(i+(args.length-1))%args.length].x,args[(i+(args.length-1))%args.length].y)
let after=new Point(args[(i+(args.length+1))%args.length].x,args[(i+(args.length+1))%args.length].y)
let current=new Point(args[(i+args.length)%args.length].x,args[(i+args.length)%args.length].y)
let before2=new Point(args[(i+(args.length-2))%args.length].x,args[(i+(args.length-2))%args.length].y)
let mid1=new Point(before.x-(before2.x-current.x)/controlpoint,before.y-(before2.y-current.y)/controlpoint)
let mid2=new Point(current.x+(before.x-after.x)/controlpoint,current.y+(before.y-after.y)/controlpoint)
this.context.bezierCurveTo(mid1.x,mid1.y,mid2.x,mid2.y,current.x,current.y)}},makeSide:function(eobj){let lp=[]
let d=new Point(eobj.first.x-eobj.last.x,eobj.first.y-eobj.last.y),midpoint=new Point((eobj.first.x+eobj.last.x)/2.0,(eobj.first.y+eobj.last.y)/2.0),r=Math.round(Math.random())*2.0-1,rd=new Point((d.x/6.0)*(Math.random()*0.5+0.7),(d.y/6.0)*(Math.random()*0.5+0.7)),pt1=new Point(midpoint.x+rd.x+(rd.y/2.0)*Math.random(),midpoint.y+rd.y+(rd.x/2.0)*Math.random()),pt2=new Point(midpoint.x-rd.x+(rd.y/2.0)*Math.random(),midpoint.y-rd.y+(rd.x/2.0)*Math.random())
lp.push(new Point(eobj.first.x,eobj.first.y))
lp.push(pt1)
lp.push(new Point(pt1.x+rd.y*r,pt1.y+rd.x*r))
lp.push(new Point(pt2.x+rd.y*r,pt2.y+rd.x*r))
lp.push(pt2)
lp.push(new Point(eobj.last.x,eobj.last.y))
return lp.splice(0)},}
function mouseDown(event){startIt(event.pageX,event.pageY)}
function startIt(x,y){let p=my.p
for(let j=0;j<p.length;j++){p[j].canvas.style.zIndex=p.length-j}
for(let i=0;i<p.length;i++){let that=p[i].canvas
let rect=my.jig.getBoundingClientRect()
if(that.getContext('2d').isPointInPath(x-parseInt(that.style.getPropertyValue('left'),10),y-parseInt(that.style.getPropertyValue('top'),10))){document.selectedpiece=p[i]
my.touchSelPiece=document.selectedpiece
my.touchPt=new Point(x,y)
that=p.splice(i,1)[0]
p.unshift(that)
that=that.canvas
that.style.zIndex=p.length+1
that.mouse=new Point(x,y)
document.selected=that
document.onmousemove=mousemove
document.onmouseup=mouseup
return}}}
function dblclick(event){for(let i=0;i<my.p.length;i++){let that=my.p[i]
if(that.canvas.getContext('2d').isPointInPath(event.pageX-parseInt(that.canvas.style.getPropertyValue('left'),10),event.pageY-parseInt(that.canvas.style.getPropertyValue('top'),10))){that.rotate(that)
return}}}
function mousemove(evt){document.selectedpiece.moveTo(evt.pageX-document.selected.mouse.x,evt.pageY-document.selected.mouse.y)
document.selected.mouse=new Point(evt.pageX,evt.pageY)}
function mouseup(evt){finishIt(evt.pageX,evt.pageY)}
function finishIt(x,y){document.selectedpiece.moveTo(x-document.selected.mouse.x,y-document.selected.mouse.y)
document.selectedpiece.connected.forEach(function(element){checkForMatches(element)})
document.selectedpiece=null
document.onmouseup=''
document.onmousemove=''
document.selected.mouse=''
document.selected=null
checkDone()}
function contains(a,obj){for(let i=0;i<a.length;i++){if(a[i]===obj){return true}}
return false}
Array.prototype.myUnique=function(){let r=[]
o:for(let i=0;i<this.length;i++){for(let x=0;x<r.length;x++){if(r[x]===this[i]){continue o}}
r[r.length]=this[i]}
return r}
function checkForMatches(e){let top=parseFloat(e.canvas.style.top)
let left=parseFloat(e.canvas.style.left)
let accuracy=5.0
let topmatchmin=top-e.height/accuracy
let topmatchmax=top+e.height/accuracy
let leftmatchmin=left-e.width/accuracy
let leftmatchmax=left+e.width/accuracy
if(typeof e.piecetop!=='undefined'){let toptop=parseFloat(e.piecetop.canvas.style.top)
let topleft=parseFloat(e.piecetop.canvas.style.left)
if(toptop+e.height>topmatchmin&&toptop+e.height<topmatchmax&&topleft>leftmatchmin&&topleft<leftmatchmax&&e.rotation==e.piecetop.rotation){e.piecetop.moveTo(left-topleft,top-(toptop+e.height))
let c=e.connected.concat(e.piecetop.connected).myUnique()
c.forEach(function(element,index,array){element.connected=array})}}
if(typeof e.pieceright!=='undefined'){let righttop=parseFloat(e.pieceright.canvas.style.top)
let rightleft=parseFloat(e.pieceright.canvas.style.left)
if(righttop>topmatchmin&&righttop<topmatchmax&&rightleft-e.width>leftmatchmin&&rightleft-e.width<leftmatchmax&&e.rotation==e.pieceright.rotation){e.pieceright.moveTo(left-(rightleft-e.width),top-righttop)
let d=e.connected.concat(e.pieceright.connected).myUnique()
d.forEach(function(element,index,array){element.connected=array})}}
if(typeof e.pieceleft!=='undefined'){let lefttop=parseFloat(e.pieceleft.canvas.style.top)
let leftleft=parseFloat(e.pieceleft.canvas.style.left)
if(lefttop>topmatchmin&&lefttop<topmatchmax&&leftleft+e.width>leftmatchmin&&leftleft+e.width<leftmatchmax&&e.rotation==e.pieceleft.rotation){e.pieceleft.moveTo(left-(leftleft+e.width),top-lefttop)
let f=e.connected.concat(e.pieceleft.connected).myUnique()
f.forEach(function(element,index,array){element.connected=array})}}
if(typeof e.piecebot!=='undefined'){let bottop=parseFloat(e.piecebot.canvas.style.top)
let botleft=parseFloat(e.piecebot.canvas.style.left)
if(bottop-e.height>topmatchmin&&bottop-e.height<topmatchmax&&botleft>leftmatchmin&&botleft<leftmatchmax&&e.rotation==e.piecebot.rotation){e.piecebot.moveTo(left-botleft,top-(bottop-e.height))
let g=e.connected.concat(e.piecebot.connected).myUnique()
g.forEach(function(element,index,array){element.connected=array})}}}
function checkDone(conn){conn=my.p[0].connected
if(conn.length==my.colN*my.rowN){jiggle()}}
function getQueryVariable(variable){let query=window.location.search.substring(1)
let vars=query.split('&')
for(let i=0;i<vars.length;i++){let pair=vars[i].split('=')
if(pair[0]==variable){return pair[1]}}
return false}
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
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>'<div',edit:()=>'<textarea onkeyup="'+fn+'" onchange="'+fn+'"',inp:()=>{if(cls.length==0)cls='input'
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