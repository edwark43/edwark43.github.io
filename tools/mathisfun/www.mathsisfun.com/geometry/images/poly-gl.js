let my={}
function init(){my.shapeName=getJSQueryVar('mode','cylinder')
console.log('shapeName',my.shapeName)
let version='0.853'
w=450
h=w
my.clrType='Rainbow'
my.clrTypes=['Rainbow','Confetti','Multi','Pattern','TwoTone']
let clrSels=Object.entries(my.clrTypes).map(([k,v])=>({name:v,descr:v}))
my.holeType='Whole'
my.holeTypes=['Whole','Holes']
let holeSels=Object.entries(my.holeTypes).map(([k,v])=>({name:v,descr:v}))
let s=''
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border-radius: 10px;  margin:auto; display:block;">'
s+='<button id="dragBtn" onclick="toggleDrag()" style="z-index:2; " class="btn lo" >Spin</button>'
s+=' Style:'
s+=wrap({id:'clrType',tag:'sel',opts:clrSels,fn:'clrTypeChg()'})
if(my.shapeName=='cone'||my.shapeName=='cylinder'){}else{s+=wrap({id:'holeType',tag:'sel',opts:holeSels,fn:'holeTypeChg()'})}
s+='<canvas width="'+w+'" height="'+h+'" id="canvasgl"></canvas>'
s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},`&copy; 2022 Rod Pierce  v${version}`)
s+='</div>'
docInsert(s)
my.el=document.getElementById('canvasgl')
my.ratio=1
my.gl=my.el.getContext('webgl')
polySetup()
my.modMat=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
my.proj_matrix=getProjection(17,my.el.width/my.el.height,1,100)
my.view_matrix=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
my.view_matrix[14]=my.view_matrix[14]-5
AMORTIZATION=0.99
draggingQ=false
my.dragQ=false
dx=0.02
dy=-0.01
prevmouseX=0
prevmouseY=0
let el=my.el
el.addEventListener('touchstart',ontouchstart,false)
el.addEventListener('touchmove',ontouchmove,false)
el.addEventListener('mousedown',onmouseDown,false)
el.addEventListener('mousemove',onmouseMove,false)
el.addEventListener('mouseup',onmouseUp,false)
animate(0)}
function clrTypeChg(){console.log('sdf')
let div=document.getElementById('clrType')
my.clrType=div.options[div.selectedIndex].value
console.log('clrTypeChg',my.clrType)
polySetup()}
function holeTypeChg(){console.log('sdf')
let div=document.getElementById('holeType')
my.holeType=div.options[div.selectedIndex].value
console.log('holeTypeChg',my.holeType)
polySetup()}
function polySetup(){let poly=new Poly()
poly.shapeType=my.shapeName
poly.clrType='Mesh'
let C=poly.getCalcSolid()
if(my.holeType=='Holes'){let c1=[]
for(let i=0;i<C.length;i++){let tri=C[i]
if(Math.random()>0.3){c1.push(tri)}}
C=c1.slice()}
let triClrs=[]
let rgb=[0.1,0.1,0]
let inc=1/(C.length+1)
let dirs=[1,1,1]
for(let i=0;i<C.length;i++){if(my.clrType=='Confetti'){for(let j=0;j<3;j++){rgb[j]=Math.random()}}
if(my.clrType=='Multi'){for(let j=0;j<3;j++){rgb[j]+=dirs[j]*inc*(j+1)
if(rgb[j]>1)dirs[j]=-1
if(rgb[j]<0)dirs[j]=1}}
if(my.clrType=='TwoTone'){rgb[2]+=inc
if(rgb[2]>1){rgb[2]=0}}
if(my.clrType=='Pattern'){rgb[2]+=0.01
if(rgb[2]>1){rgb[2]=0}}
triClrs.push([rgb[0],rgb[1],rgb[2]])}
vertices=[]
normals=[]
colors=[]
indices=[]
let ind=0
for(let i=0;i<C.length;i++){let face=C[i]
let clr=triClrs[i]
let pt0={x:face[0][0],y:face[0][1],z:face[0][2],}
let pt1={x:face[1][0],y:face[1][1],z:face[1][2],}
let pt2={x:face[2][0],y:face[2][1],z:face[2][2],}
if(my.clrType=='Rainbow')clr=clrPtNorm([pt0,pt1,pt2])
let normal=getNormal([pt0,pt1,pt2])
for(let j=0;j<face.length;j++){vertices.push(face[j][0],face[j][1],face[j][2])
normals.push(normal)
colors.push(clr[0],clr[1],clr[2])}
for(let j=2;j<face.length;j++){indices.push(ind,ind+j-1,ind+j)}
ind+=face.length}
glSetup()}
function getProjection(angle,a,zMin,zMax){let ang=Math.tan((angle*0.5*Math.PI)/180)
return[0.5/ang,0,0,0,0,(0.5*a)/ang,0,0,0,0,-(zMax+zMin)/(zMax-zMin),-1,0,0,(-2*zMax*zMin)/(zMax-zMin),0]}
function toggleDrag(){my.dragQ=!my.dragQ
toggleBtn('dragBtn',my.dragQ)
if(my.dragQ){document.getElementById('dragBtn').innerHTML='Drag'}else{document.getElementById('dragBtn').innerHTML='Spin'}}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
function ontouchstart(evt){draggingQ=true
let touch=evt.targetTouches[0]
let bRect=el.getBoundingClientRect()
prevmouseX=(touch.clientX-bRect.left)*(el.width/ratio/bRect.width)
prevmouseY=(touch.clientY-bRect.top)*(el.height/ratio/bRect.height)}
function ontouchmove(evt){let touch=evt.targetTouches[0]
evt.clientX=touch.clientX
evt.clientY=touch.clientY
evt.touchQ=true
onmouseMove(evt)
evt.preventDefault()}
function onmouseDown(evt){draggingQ=true
prevmouseX=mouseX
prevmouseY=mouseY
evt.preventDefault()
return false}
function onmouseUp(evt){draggingQ=false}
function onmouseMove(evt){let bRect=my.el.getBoundingClientRect()
mouseX=(evt.clientX-bRect.left)*(my.el.width/my.ratio/bRect.width)
mouseY=(evt.clientY-bRect.top)*(my.el.height/my.ratio/bRect.height)
if(my.dragQ){if(draggingQ){let fact=2.7
dx=((mouseX-prevmouseX)*fact*Math.PI)/my.el.width
dy=((mouseY-prevmouseY)*fact*Math.PI)/my.el.height
prevmouseX=mouseX
prevmouseY=mouseY}}else{let fact=0.007
dx=((mouseX-w/2)*fact*Math.PI)/my.el.width
dy=((mouseY-h/2)*fact*Math.PI)/my.el.height}
evt.preventDefault()}
function rotateX(m,angle){let c=Math.cos(angle)
let s=Math.sin(angle)
let mv1=m[1],mv5=m[5],mv9=m[9]
m[1]=c*m[1]-s*m[2]
m[5]=c*m[5]-s*m[6]
m[9]=c*m[9]-s*m[10]
m[2]=c*m[2]+s*mv1
m[6]=c*m[6]+s*mv5
m[10]=c*m[10]+s*mv9}
function rotateY(m,angle){let c=Math.cos(angle)
let s=-Math.sin(angle)
let mv0=m[0],mv4=m[4],mv8=m[8]
m[0]=c*m[0]-s*m[2]
m[4]=c*m[4]-s*m[6]
m[8]=c*m[8]-s*m[10]
m[2]=c*m[2]+s*mv0
m[6]=c*m[6]+s*mv4
m[10]=c*m[10]+s*mv8}
function rotateXYZ(x,y,z){let vectorLength=Math.sqrt(x*x+y*y+z*z)
if(vectorLength>0.0001){x/=vectorLength
y/=vectorLength
z/=vectorLength
let Theta=vectorLength/500
let cosT=Math.cos(Theta)
let sinT=Math.sin(Theta)
let tanT=1-cosT
let T=[[],[],[]]
T[0][0]=tanT*x*x+cosT
T[0][1]=tanT*x*y-sinT*z
T[0][2]=tanT*x*z+sinT*y
T[1][0]=tanT*x*y+sinT*z
T[1][1]=tanT*y*y+cosT
T[1][2]=tanT*y*z-sinT*x
T[2][0]=tanT*x*z-sinT*y
T[2][1]=tanT*y*z+sinT*x
T[2][2]=tanT*z*z+cosT
transMat=matMatMult(T,M)}}
function clrPtNorm(pts){let alpha=0.8
let angle=getNormalAngle(pts,0)
let dark=1-angle/Math.PI
let red=((dark*255)>>0)+1
let grn=((dark*255)>>0)+1
angle=getNormalAngle(pts,1)
dark=1-angle/Math.PI
let blu=((dark*255)>>0)+1
return[red/256,grn/256,blu/256]}
function getNormal(pts){let a=[pts[1].x-pts[0].x,pts[1].y-pts[0].y,pts[1].z-pts[0].z]
let b=[pts[2].x-pts[1].x,pts[2].y-pts[1].y,pts[2].z-pts[1].z]
let cross=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
return cross}
function getNormalAngle(pts,dimN){let a=[pts[1].x-pts[0].x,pts[1].y-pts[0].y,pts[1].z-pts[0].z]
let b=[pts[2].x-pts[1].x,pts[2].y-pts[1].y,pts[2].z-pts[1].z]
let cross=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
let mag=Math.sqrt(cross[0]*cross[0]+cross[1]*cross[1]+cross[2]*cross[2])
let theta=Math.acos(cross[dimN]/mag)
return theta}
class Poly{constructor(){this.shapeType='cube'
this.shapeSource='calc'
this.scale=90}
getSolid(){let C=[]
switch(this.shapeSource){case 'file':case 'data':C=[]
for(let i=0;i<solidFaces.length;i++){let faceVerts=[]
for(let j=0;j<solidFaces[i].length;j++){faceVerts.push(vertices[solidFaces[i][j]])}
C.push(faceVerts)}
this.clrMethod='Glass'
Scale=100
break
case 'calc':C=this.getCalcSolid()
break
default:}
return C}
getCalcSolid(){let C=[]
this.scale=90
let i
let j
switch(this.shapeType.toLowerCase()){case 'net':C=[[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],[[1,0,0],[2,0,0],[2,1,0],[1,1,0]],[[2,0,0],[3,0,0],[3,1,0],[2,1,0]]]
this.clrMethod='Glass'
this.scale=100
break
case 'torus':C=this.createNTorus(1,0.4,60,120)
this.scale=110
break
case 'sphere':C=this.createNSphere(5)
break
case 'spheroid':C=this.createNSphere(5)
for(let i=0;i<C.length;i++){let tri=C[i]
for(let j=0;j<3;j++){tri[j][0]*=0.5}}
break
case 'hemisphere':C=this.createNSphere(5,true)
this.clrMethod='Shaded'
this.scale=110
break
case 'cone':C=this.createNCone(600,1.3)
this.scale=140
this.clrMethod='Smooth'
break
case 'cylinder':C=this.createNCylinder(600)
this.clrMethod='Smooth'
break
case 'square-pyramid':C=this.createNCone(4,0.5)
this.scale=180
break
case 'pent-pyramid':C=this.createNCone(5,0.7)
this.scale=180
break
case 'tetrahedron':C=[[[1,1,1],[-1,1,-1],[1,-1,-1]],[[-1,1,-1],[-1,-1,1],[1,-1,-1]],[[1,1,1],[1,-1,-1],[-1,-1,1]],[[1,1,1],[-1,-1,1],[-1,1,-1]]]
break
case 'irr-tetrahedron':C=[[[2,1,-0.2],[-1,1,-1],[1,-1,-1]],[[-1,1,-1],[-1,-1,1],[1,-1,-1]],[[2,1,-0.2],[1,-1,-1],[-1,-1,1]],[[2,1,-0.2],[-1,-1,1],[-1,1,-1]]]
this.scale=80
break
case 'cube':C=[[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]]
break
case '3 points':C=[[[-1,-1,-1],[1,-1,-1],[1,-1,1]]]
this.scale=80
break
case '4 coplanar points':C=[[[-1.5,-1,-1],[1,-1,-1],[0.3,-1,1],[-1.5,-1,1]]]
this.scale=80
break
case '4 points':C=[[[-1.1,-2,-2],[1,-1,-1],[0.8,2,1]],[[1,-1,-1],[0.8,2,1],[1.5,-1,1]]]
this.scale=60
break
case 'plane':let a=0.5
let b=0.5
let c=0.5
let d=-3
C=[]
for(i=0;i<6;i++){for(j=0;j<6;j++){C.push([[a,-b+d+i,-c+d+j],[a,b+d+i,-c+d+j],[a,b+d+i,c+d+j],[a,-b+d+i,c+d+j]])}}
this.scale=80
break
case 'cuboid':case 'rect-prism':a=1.2
b=0.7
c=0.7
C=[[[-a,-b,-c],[a,-b,-c],[a,-b,c],[-a,-b,c]],[[-a,-b,-c],[-a,-b,c],[-a,b,c],[-a,b,-c]],[[-a,-b,c],[a,-b,c],[a,b,c],[-a,b,c]],[[-a,b,-c],[-a,b,c],[a,b,c],[a,b,-c]],[[a,-b,-c],[a,b,-c],[a,b,c],[a,-b,c]],[[-a,-b,-c],[-a,b,-c],[a,b,-c],[a,-b,-c]]]
break
case 'pent-prism':a=1.2
b=0.7
c=0.73
d=0.16
let e=0.44
C=[[[-a,0,b],[-a,c,d],[-a,e,-b],[-a,-e,-b],[-a,-c,d]],[[a,0,b],[a,c,d],[a,e,-b],[a,-e,-b],[a,-c,d]],[[-a,0,b],[-a,c,d],[a,c,d],[a,0,b]],[[-a,c,d],[-a,e,-b],[a,e,-b],[a,c,d]],[[-a,e,-b],[-a,-e,-b],[a,-e,-b],[a,e,-b]],[[-a,-e,-b],[-a,-c,d],[a,-c,d],[a,-e,-b]],[[-a,-c,d],[-a,0,b],[a,0,b],[a,-c,d]]]
break
case 'oct-prism':a=1.1
b=0.33
c=0.79
C=[[[-a,b,c],[-a,c,b],[-a,c,-b],[-a,b,-c],[-a,-b,-c],[-a,-c,-b],[-a,-c,b],[-a,-b,c],],[[a,b,c],[a,c,b],[a,c,-b],[a,b,-c],[a,-b,-c],[a,-c,-b],[a,-c,b],[a,-b,c],],]
for(i=0;i<8;i++){j=Maths.loop(i,0,7,1)
C.push([[C[0][i][0],C[0][i][1],C[0][i][2]],[C[0][j][0],C[0][j][1],C[0][j][2]],[C[1][j][0],C[1][j][1],C[1][j][2]],[C[1][i][0],C[1][i][1],C[1][i][2]]])}
break
case 'irr-pent-prism':a=1.2
b=0.7
c=0.73
d=0.16
e=0.9
C=[[[-a,0,b],[-a,c,d],[-a,e,-b],[-a,-e,-b],[-a,-c,d]],[[a,0,b],[a,c,d],[a,e,-b],[a,-e,-b],[a,-c,d]],[[-a,0,b],[-a,c,d],[a,c,d],[a,0,b]],[[-a,c,d],[-a,e,-b],[a,e,-b],[a,c,d]],[[-a,e,-b],[-a,-e,-b],[a,-e,-b],[a,e,-b]],[[-a,-e,-b],[-a,-c,d],[a,-c,d],[a,-e,-b]],[[-a,-c,d],[-a,0,b],[a,0,b],[a,-c,d]]]
break
case 'tri-prism-n':C=createNCylinder(3)
this.scale=100
break
case 'tri-prism':a=1.2
b=0.7
c=0.7
d=0.6
C=[[[-a,-b,-c],[-a,-b,c],[-a,d,0]],[[a,-b,-c],[a,-b,c],[a,d,0]],[[-a,-b,-c],[a,-b,-c],[a,-b,c],[-a,-b,c]],[[-a,-b,c],[a,-b,c],[a,d,0],[-a,d,0]],[[-a,-b,-c],[-a,d,0],[a,d,0],[a,-b,-c]]]
break
case 'strange-prism':a=1.2
b=0.7
c=0.7
C=[[[-a,-b,-c],[a,-b,-c],[a,-b,c]],[[-a,-b,-c],[-a,-b,c],[-a,b,c]],[[-a,-b,c],[a,-b,c],[a,b,c]],[[-a,b,-c],[-a,b,c],[a,b,c]],[[a,-b,-c],[a,b,-c],[a,b,c]],[[-a,-b,-c],[-a,b,-c],[a,b,-c]]]
break
case 'octahedron':a=3/(2*Math.sqrt(2))
b=3/2
C=[[[-a,0,a],[-a,0,-a],[0,b,0]],[[-a,0,-a],[a,0,-a],[0,b,0]],[[a,0,-a],[a,0,a],[0,b,0]],[[a,0,a],[-a,0,a],[0,b,0]],[[a,0,-a],[-a,0,-a],[0,-b,0]],[[-a,0,-a],[-a,0,a],[0,-b,0]],[[a,0,a],[a,0,-a],[0,-b,0]],[[-a,0,a],[a,0,a],[0,-b,0]]]
Scale=100
break
case 'dodecahedron':let phi=(1+Math.sqrt(5))/2
a=1
b=1/phi
c=2-phi
a*=1.5
b*=1.5
c*=1.5
C=[[[c,0,a],[-c,0,a],[-b,b,b],[0,a,c],[b,b,b]],[[-c,0,a],[c,0,a],[b,-b,b],[0,-a,c],[-b,-b,b]],[[c,0,-a],[-c,0,-a],[-b,-b,-b],[0,-a,-c],[b,-b,-b]],[[-c,0,-a],[c,0,-a],[b,b,-b],[0,a,-c],[-b,b,-b]],[[0,a,-c],[0,a,c],[b,b,b],[a,c,0],[b,b,-b]],[[0,a,c],[0,a,-c],[-b,b,-b],[-a,c,0],[-b,b,b]],[[0,-a,-c],[0,-a,c],[-b,-b,b],[-a,-c,0],[-b,-b,-b]],[[0,-a,c],[0,-a,-c],[b,-b,-b],[a,-c,0],[b,-b,b]],[[a,c,0],[a,-c,0],[b,-b,b],[c,0,a],[b,b,b]],[[a,-c,0],[a,c,0],[b,b,-b],[c,0,-a],[b,-b,-b]],[[-a,c,0],[-a,-c,0],[-b,-b,-b],[-c,0,-a],[-b,b,-b]],[[-a,-c,0],[-a,c,0],[-b,b,b],[-c,0,a],[-b,-b,b]]]
break
case 'icosahedron-intersected':phi=(1+Math.sqrt(5))/2
a=1
b=1/phi
c=2-phi
a*=1.5
b*=1.5
c*=1.5
C=[[[0,b,-a],[b,a,0],[-b,a,0]],[[0,0,0],[-b,a,0],[b,a,0]],[[0,0,0],[0,-b,a],[-a,0,b]],[[0,0,0],[a,0,b],[0,-b,a]],[[0,b,-a],[0,0,0],[a,0,-b]],[[0,b,-a],[-a,0,-b],[0,0,0]],[[0,-b,a],[b,-a,0],[-b,-a,0]],[[0,0,0],[-b,-a,0],[b,-a,0]],[[-b,a,0],[-a,0,b],[-a,0,-b]],[[-b,-a,0],[-a,0,-b],[-a,0,b]],[[b,a,0],[a,0,-b],[a,0,b]],[[b,-a,0],[a,0,b],[a,0,-b]],[[0,0,0],[-a,0,b],[-b,a,0]],[[0,0,0],[b,a,0],[a,0,b]],[[0,b,-a],[-b,a,0],[-a,0,-b]],[[0,b,-a],[a,0,-b],[b,a,0]],[[0,0,0],[-a,0,-b],[-b,-a,0]],[[0,0,0],[b,-a,0],[a,0,-b]],[[0,-b,a],[-b,-a,0],[-a,0,b]],[[0,-b,a],[a,0,b],[b,-a,0]]]
break
case 'icosahedron':phi=(1+Math.sqrt(5))/2
a=1/2
b=1/(2*phi)
a*=3
b*=3
C=[[[0,b,-a],[b,a,0],[-b,a,0]],[[0,b,a],[-b,a,0],[b,a,0]],[[0,b,a],[0,-b,a],[-a,0,b]],[[0,b,a],[a,0,b],[0,-b,a]],[[0,b,-a],[0,-b,-a],[a,0,-b]],[[0,b,-a],[-a,0,-b],[0,-b,-a]],[[0,-b,a],[b,-a,0],[-b,-a,0]],[[0,-b,-a],[-b,-a,0],[b,-a,0]],[[-b,a,0],[-a,0,b],[-a,0,-b]],[[-b,-a,0],[-a,0,-b],[-a,0,b]],[[b,a,0],[a,0,-b],[a,0,b]],[[b,-a,0],[a,0,b],[a,0,-b]],[[0,b,a],[-a,0,b],[-b,a,0]],[[0,b,a],[b,a,0],[a,0,b]],[[0,b,-a],[-b,a,0],[-a,0,-b]],[[0,b,-a],[a,0,-b],[b,a,0]],[[0,-b,-a],[-a,0,-b],[-b,-a,0]],[[0,-b,-a],[b,-a,0],[a,0,-b]],[[0,-b,a],[-b,-a,0],[-a,0,b]],[[0,-b,a],[a,0,b],[b,-a,0]]]
this.scale=80
break
default:}
return C}
createNTorus(radius,tube,radialSegments,tubularSegments){let arc=Math.PI*2
let verts=[]
for(let j=0;j<=radialSegments;j++){for(let i=0;i<=tubularSegments;i++){let u=(i/tubularSegments)*arc
let v=(j/radialSegments)*Math.PI*2
let vertex=[]
vertex.push((radius+tube*Math.cos(v))*Math.cos(u))
vertex.push((radius+tube*Math.cos(v))*Math.sin(u))
vertex.push(tube*Math.sin(v))
verts.push(vertex)}}
let D=[]
for(let j=1;j<=radialSegments;j++){for(let i=1;i<=tubularSegments;i++){let a=(tubularSegments+1)*j+i-1
let b=(tubularSegments+1)*(j-1)+i-1
let c=(tubularSegments+1)*(j-1)+i
let d=(tubularSegments+1)*j+i
let face=[verts[a],verts[b],verts[d]]
D.push(face)
face=[verts[b],verts[c],verts[d]]
D.push(face)}}
return D}
createNCone(ngon,ht){let D=[]
D[0]=[]
let sumx=0
let sumy=0
for(let i=0;i<ngon;i++){let Angle=(Math.PI*2*i)/ngon
D[0][i]=[]
D[0][i][0]=Math.sin(Angle)*0.8
D[0][i][1]=Math.cos(Angle)*0.8
D[0][i][2]=-ht/2
sumx=sumx+D[0][i][0]
sumy=sumy+D[0][i][1]}
let apexx=sumx/ngon
let apexy=sumy/ngon
for(let i=0;i<ngon;i++){let n=i+1
D[n]=[]
D[n][0]=[]
D[n][0][0]=apexx
D[n][0][1]=apexy
D[n][0][2]=ht
D[n][1]=[]
D[n][1][0]=D[0][i][0]
D[n][1][1]=D[0][i][1]
D[n][1][2]=D[0][i][2]
let i1=i+1
if(i1==ngon)i1=0
D[n][2]=[]
D[n][2][0]=D[0][i1][0]
D[n][2][1]=D[0][i1][1]
D[n][2][2]=D[0][i1][2]}
return D}
createNCylinder(ngon){let D=[]
let ang
D[0]=[]
for(let i=0;i<ngon;i++){ang=(Math.PI*2*i)/ngon
D[0][i]=[]
D[0][i][0]=Math.sin(ang)*0.8
D[0][i][1]=Math.cos(ang)*0.8
D[0][i][2]=1.4}
D[1]=[]
for(let i=0;i<ngon;i++){let ang=(Math.PI*2*i)/ngon
D[1][i]=[]
D[1][i][0]=Math.sin(ang)*0.8
D[1][i][1]=Math.cos(ang)*0.8
D[1][i][2]=-1.1}
for(let i=0;i<ngon;i++){let n=i+2
D[n]=[]
let i1=i+1
if(i1==ngon)i1=0
D[n][0]=[]
D[n][0][0]=D[0][i][0]
D[n][0][1]=D[0][i][1]
D[n][0][2]=D[0][i][2]
D[n][1]=[]
D[n][1][0]=D[0][i1][0]
D[n][1][1]=D[0][i1][1]
D[n][1][2]=D[0][i1][2]
D[n][2]=[]
D[n][2][0]=D[1][i1][0]
D[n][2][1]=D[1][i1][1]
D[n][2][2]=D[1][i1][2]
D[n][3]=[]
D[n][3][0]=D[1][i][0]
D[n][3][1]=D[1][i][1]
D[n][3][2]=D[1][i][2]}
return D}
createNSphere(iterations,hemiQ){let i,it
let p=[[0,0,1],[0,0,-1],[-1,-1,0],[1,-1,0],[1,1,0],[-1,1,0],]
let nt=0
let ntOld
let a=1/Math.sqrt(2)
for(i=0;i<6;i++){p[i][0]*=a
p[i][1]*=a}
let f1=[]
for(i=0;i<8;i++){f1[i]=[]
f1[i][0]=[]
f1[i][1]=[]
f1[i][2]=[]}
for(i=0;i<3;i++){f1[0][0][i]=p[0][i]
f1[0][1][i]=p[3][i]
f1[0][2][i]=p[4][i]
f1[1][0][i]=p[0][i]
f1[1][1][i]=p[4][i]
f1[1][2][i]=p[5][i]
f1[2][0][i]=p[0][i]
f1[2][1][i]=p[5][i]
f1[2][2][i]=p[2][i]
f1[3][0][i]=p[0][i]
f1[3][1][i]=p[2][i]
f1[3][2][i]=p[3][i]
if(!hemiQ){f1[4][0][i]=p[1][i]
f1[4][1][i]=p[4][i]
f1[4][2][i]=p[3][i]
f1[5][0][i]=p[1][i]
f1[5][1][i]=p[5][i]
f1[5][2][i]=p[4][i]
f1[6][0][i]=p[1][i]
f1[6][1][i]=p[2][i]
f1[6][2][i]=p[5][i]
f1[7][0][i]=p[1][i]
f1[7][1][i]=p[3][i]
f1[7][2][i]=p[2][i]}}
if(iterations<1)return f1
let pa=[]
let pb=[]
let pc=[]
nt=8
for(it=0;it<iterations;it++){ntOld=nt
for(i=0;i<ntOld;i++){pa[0]=(f1[i][0][0]+f1[i][1][0])/2
pa[1]=(f1[i][0][1]+f1[i][1][1])/2
pa[2]=(f1[i][0][2]+f1[i][1][2])/2
pb[0]=(f1[i][1][0]+f1[i][2][0])/2
pb[1]=(f1[i][1][1]+f1[i][2][1])/2
pb[2]=(f1[i][1][2]+f1[i][2][2])/2
pc[0]=(f1[i][2][0]+f1[i][0][0])/2
pc[1]=(f1[i][2][1]+f1[i][0][1])/2
pc[2]=(f1[i][2][2]+f1[i][0][2])/2
this.sphereNormalise(pa)
this.sphereNormalise(pb)
this.sphereNormalise(pc)
for(let j=0;j<3;j++){f1[nt+j]=[]
f1[nt+j][0]=[]
f1[nt+j][1]=[]
f1[nt+j][2]=[]}
for(let j=0;j<3;j++){f1[nt+0][0][j]=f1[i][0][j]
f1[nt+0][1][j]=pa[j]
f1[nt+0][2][j]=pc[j]
f1[nt+1][0][j]=pa[j]
f1[nt+1][1][j]=f1[i][1][j]
f1[nt+1][2][j]=pb[j]
f1[nt+2][0][j]=pb[j]
f1[nt+2][1][j]=f1[i][2][j]
f1[nt+2][2][j]=pc[j]
f1[i][0][j]=pa[j]
f1[i][1][j]=pb[j]
f1[i][2][j]=pc[j]}
nt=nt+3}}
if(hemiQ){let ht=0
let D=new Array()
for(i=0;i<20;i++){let Angle=(Math.PI*2*i)/20
D[i]=[]
D[i][0]=Math.sin(Angle)*1.0
D[i][1]=Math.cos(Angle)*1.0
D[i][2]=-ht/2}
f1.push(D)}
return f1}
sphereNormalise(p){let vectorLength=Math.sqrt(p[0]*p[0]+p[1]*p[1]+p[2]*p[2])
if(vectorLength!=0){p[0]/=vectorLength
p[1]/=vectorLength
p[2]/=vectorLength}else{p[0]=0
p[1]=0
p[2]=0}}}
function animate(time){if(my.dragQ){dx*=AMORTIZATION
dy*=AMORTIZATION
if(Math.abs(dx)+Math.abs(dy)<0.001){dx=0
dy=0}}
if(dx==0&&dy==0){}else{rotateX(my.modMat,dy)
rotateY(my.modMat,dx)
glDraw(my.modMat)}
if(my.dragQ){dx=0
dy=0}
window.requestAnimationFrame(animate)}
function glSetup(){let gl=my.gl
let vertex_buffer=gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,vertex_buffer)
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW)
let color_buffer=gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER,color_buffer)
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colors),gl.STATIC_DRAW)
my.index_buffer=gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,my.index_buffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),gl.STATIC_DRAW)
let vertCode='attribute vec3 position;'+
'uniform mat4 Pmatrix;'+
'uniform mat4 Vmatrix;'+
'uniform mat4 Mmatrix;'+
'attribute vec3 color;'+
'varying vec3 vColor;'+
'void main(void) { '+
'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);'+
'vColor = color;'+
'}'
let fragCode='precision mediump float;'+
'varying vec3 vColor;'+
'void main(void) {'+
'gl_FragColor = vec4(vColor, 0.9);'+
'}'
let vertShader=gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertShader,vertCode)
gl.compileShader(vertShader)
let fragShader=gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragShader,fragCode)
gl.compileShader(fragShader)
let shaderprogram=gl.createProgram()
gl.attachShader(shaderprogram,vertShader)
gl.attachShader(shaderprogram,fragShader)
gl.linkProgram(shaderprogram)
let blendQ=false
if(blendQ){gl.blendFunc(gl.SRC_ALPHA,gl.ONE)
gl.enable(gl.BLEND)}else{gl.disable(gl.BLEND)
gl.enable(gl.DEPTH_TEST)}
my.Pmatrix=gl.getUniformLocation(shaderprogram,'Pmatrix')
my.Vmatrix=gl.getUniformLocation(shaderprogram,'Vmatrix')
my.Mmatrix=gl.getUniformLocation(shaderprogram,'Mmatrix')
gl.bindBuffer(gl.ARRAY_BUFFER,vertex_buffer)
let _position=gl.getAttribLocation(shaderprogram,'position')
gl.vertexAttribPointer(_position,3,gl.FLOAT,false,0,0)
gl.enableVertexAttribArray(_position)
gl.bindBuffer(gl.ARRAY_BUFFER,color_buffer)
let _color=gl.getAttribLocation(shaderprogram,'color')
gl.vertexAttribPointer(_color,3,gl.FLOAT,false,0,0)
gl.enableVertexAttribArray(_color)
gl.useProgram(shaderprogram)}
function glDraw(modelMat){let gl=my.gl
gl.clearColor(0,0,0,0)
gl.clearDepth(1)
gl.viewport(0.0,0.0,my.el.width,my.el.height)
gl.clear(gl.COLOR_BUFFER_BIT)
gl.uniformMatrix4fv(my.Pmatrix,false,my.proj_matrix)
gl.uniformMatrix4fv(my.Vmatrix,false,my.view_matrix)
gl.uniformMatrix4fv(my.Mmatrix,false,modelMat)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,my.index_buffer)
gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0)}
function getJSQueryVar(varName,defaultVal){let scripts=document.getElementsByTagName('script')
let lastScript=scripts[scripts.length-1]
let scriptName=lastScript.src
let bits=scriptName.split('?')
if(bits.length<2)return defaultVal
let query=bits[1]
console.log('query: ',query)
let vars=query.split('&')
for(let i=0;i<vars.length;i++){let pair=vars[i].split('=')
if(pair[0]==varName){return pair[1]}}
return defaultVal}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
s+={btn:()=>{if(cls.length==0)cls='btn'
return '<button onclick="'+fn+'"'},can:()=>'<canvas',div:()=>{let s='<div'
s+=fn.length>0?' onclick="'+fn+'" ':''
style+=fn.length>0?' cursor:pointer;':''
return s},edit:()=>{let s=''
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
return s},radio:()=>{if(cls.length==0)cls='radio'
return '<div '},sel:()=>{if(cls.length==0)cls='select'
let s=''
s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<select '
s+=fn.length>0?'  onchange="'+fn+'"':''
return s},sld:()=>{s+=lbl.length>0?'<label class="label">'+lbl+' ':''
s+='<input type="range" '+txt+' oninput="'+fn+'" onchange="'+fn+'"'
return s},}[tag]()||''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+={btn:()=>'>'+txt+'</button>',can:()=>'></canvas>',div:()=>' >'+txt+'</div>',edit:()=>' >'+txt+'</textarea>',inp:()=>'>'+(lbl.length>0?'</label>':''),out:()=>' >'+txt+'</span>'+(lbl.length>0?'</label>':''),radio:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
let idi=id+i
let lbl=opts[i]
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+fn+'('+i+');" '+chk+' >'
s+='<label for="'+idi+'">'+lbl.name+' </label>'}
s+='</div>'
return s},sel:()=>{let s=''
s+='>\n'
for(let i=0;i<opts.length;i++){let opt=opts[i]
let idStr=id+i
let chkStr=opt.descr==txt?' selected ':''
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+opt.descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'
return s},sld:()=>{let s='>'
if(lbl.length>0)s+='</label>'
if(lbl.length>0)s+='<span id="'+id+'0">0</span>'
return s},}[tag]()||''
s+='\n'
return s.trim()}
init()