var THREE,my={};function d3flyerMain(type){var version='0.52'
my.type=typeof type!=='undefined'?type:'cube'
my.clrs=[["Blue",'#0000ff'],["Red",'#ff0000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F'],["Black",'#000000']];var s=''
s+=`
<div id="main" style="position:relative; margin:0; height:90vh; display:block;">

<div id="anim" style="position:absolute; left:0; top:0; width:100%; height:90vh; margin:auto; display:block;"></div>

<div id="speedSlider" style="position:absolute; left:0; top:0; width:100%;  margin:auto; display:block; z-index:3; color:white; 
font: 2.5vmin Arial; text-align: center;">
  <input type="range" id="speedSlider" value="0" min="-100" max="100" step="1"  style="width:60vmin; height:1vmin; border: none;"
   oninput="speedChg(0,this.value)" onchange="speedChg(1,this.value)" />
</div>
  
<div id="osd" style="position:absolute; left:0; top:0; width:100%; height:90vh;  margin:auto; display:block; z-index:2; 
color:white; font: 2.5vmin Arial; text-align: center;">
  <br>
  <div style="display:inline-block; width: 10vw; text-align: right; margin-right: 1vw;">Speed:</div>
  <div id="osdSpeed" style="display:inline-block; width: 5vw; backgroun ">0</div>
  
  <div style="display:inline-block; width: 10vw; text-align: right; margin-right: 1vw;">Yaw: </div>
  <div id="osdYaw" style="display:inline-block;  width: 5vw;">0</div>
  
  <div style="display:inline-block; width: 10vw; text-align: right; margin-right:2vw;">Pitch: </div>
  <div id="osdPitch" style="display:inline-block;  width: 5vw;">0</div>
</div>
  
</div>
  
<div style="font: 1.2vw Arial; ">&copy; 2019 MathsIsFun.com  v${version}</div>
`
document.write(s);my.imgHome=(document.domain=='localhost')?'/mathsisfun/images/':'/images/'
sceneSetup()
my.move={speed:0,side:0,up:0,yaw:0,pitch:0,roll:0}
my.yaw={tgt:0,stt:0}
my.pitch={tgt:0,stt:0}
my.moveVector=new THREE.Vector3(0,0,0);my.rotationVector=new THREE.Vector3(0,0,0);my.dragToLook=false;my.autoForward=false;my.mouseStatus=0;window.addEventListener('keydown',keydown,false);window.addEventListener('resize',resize,false);var div=document.getElementById('osd')
div.addEventListener('touchstart',touchStart,false);div.addEventListener('touchmove',touchMove,false);div.addEventListener('touchend',touchEnd,false);div.addEventListener('mousedown',mouseDown,false);div.addEventListener('mousemove',mouseMove,false);div.addEventListener('mouseup',mouseUp,false);resize();osdUpdate()
my.animWhen=0
my.fpsStt=0
animate();}
function osdUpdate(){document.getElementById('osdSpeed').innerHTML=-Math.round(my.move.speed*100)+'%'
document.getElementById('osdYaw').innerHTML=Math.round(my.move.yaw*100)+'%'
document.getElementById('osdPitch').innerHTML=Math.round(my.move.pitch*100)+'%'}
function speedChg(a,val){my.move.speed=-val/100
updateMovementVector()
osdUpdate()}
function sceneSetup(){my.scene=new THREE.Scene();var scene=my.scene
my.camera=new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,0.2,1000);my.camera.eulerOrder="YXZ"
my.tmpQuaternion=new THREE.Quaternion();my.renderer=new THREE.WebGLRenderer();my.renderer.setSize(window.innerWidth,window.innerHeight);my.el=my.renderer.domElement;var div=document.getElementById('anim')
div.appendChild(my.el);var texture=new THREE.TextureLoader().load(my.imgHome+'bg/a7.jpg');var texture2=new THREE.TextureLoader().load(my.imgHome+'bg/singlt12.jpg');var geometry=new THREE.BoxGeometry(2,2,2);var material=new THREE.MeshPhongMaterial({color:0xffffff,specular:0x444444,shininess:90,emissive:0x0,map:texture});var cube=new THREE.Mesh(geometry,material);cube.position.set(10,7,10);scene.add(cube);var geometry=new THREE.BoxGeometry(2,1,1);var material=new THREE.MeshPhongMaterial({color:0xffffff});var cube2=new THREE.Mesh(geometry,material);cube2.position.y+=1;cube2.receiveShadow=true;cube2.castShadow=true;my.polys=getPolyData();my.objs=objsMake(my.type,texture)
var geometry=new THREE.Geometry();var material=new THREE.MeshPhongMaterial({color:0x00ff00});geometry.vertices.push(new THREE.Vector3(-1,0,0));geometry.vertices.push(new THREE.Vector3(0,1,0));geometry.vertices.push(new THREE.Vector3(1,0,0));if(false){var meshFloor=new THREE.Mesh(new THREE.PlaneGeometry(10,10,10,10),new THREE.MeshPhongMaterial({color:0x0000ff,wireframe:false,map:texture2}));meshFloor.rotation.x-=Math.PI/2;meshFloor.receiveShadow=true;my.scene.add(meshFloor);}
if(false){my.poly=new Poly()
my.polyN=2
my.poly.shapeSource="data";my.poly.shapeType=my.polys[my.polyN][0];geometry=polyToGeometry();var material=new THREE.MeshPhongMaterial({color:0x0000ff,specular:0x888888,shininess:40,emissive:0x0,map:texture2});material.side=THREE.DoubleSide;var zz=new THREE.Mesh(geometry,material);zz.position.y+=2
zz.receiveShadow=true;zz.castShadow=true;my.scene.add(zz);my.objs.push(zz)}
var ambientLight=new THREE.AmbientLight(0xffffff,0.8);scene.add(ambientLight);var light=new THREE.PointLight(0xffffee,1.4,200,0.1);light.position.set(60,20,4);light.castShadow=true;light.shadow.camera.near=100;light.shadow.camera.far=250;scene.add(light);if(true){light=new THREE.PointLight(0x00ff00,0.1,18);light.position.set(0,7,6);light.castShadow=true;light.shadow.camera.near=0.1;light.shadow.camera.far=25;scene.add(light);}
var skyGeom=new THREE.SphereBufferGeometry(300,60,60);var texture=new THREE.TextureLoader().load(my.imgHome+'bg/sky7.jpg');var material=new THREE.MeshPhongMaterial({map:texture});var sky=new THREE.Mesh(skyGeom,material);sky.material.side=THREE.BackSide;scene.add(sky);my.camera.position.y=2
my.camera.position.z=4
my.moveVector=new THREE.Vector3(0,0,0);my.rotationVector=new THREE.Vector3(0,0,0);}
function polyToGeometry(){var surfs=my.poly.getSolid();console.log('polyToGeometry',my.poly,surfs)
var geometry=new THREE.Geometry();var joinVertsQ=true
var n=0
var verts=[]
for(var i=0;i<surfs.length;i++){var surf=surfs[i];var ns=[];for(var j=0;j<surf.length;j++){var pt=surf[j]
if(joinVertsQ){var vertN=vertexNo(pt,verts)
if(vertN<0){verts.push(pt)
vertN=verts.length-1
geometry.vertices.push(new THREE.Vector3(pt[0],pt[1],pt[2]));}
ns.push(vertN)}else{geometry.vertices.push(new THREE.Vector3(pt[0],pt[1],pt[2]));ns.push(n++)}}
for(var j=0;j<surf.length-2;j++){geometry.faces.push(new THREE.Face3(ns[0],ns[j+1],ns[j+2]));}}
console.log('geometry',geometry)
return geometry}
function vertexNo(v,verts){for(var i=0;i<verts.length;i++){var vert=verts[i]
if(!near(v[0],vert[0]))continue
if(!near(v[1],vert[1]))continue
if(!near(v[2],vert[2]))continue
return i}
return-1}
function near(a,b){return(Math.abs(a-b)<0.001)}
function assignUVs(geometry){geometry.faceVertexUvs[0]=[];geometry.faces.forEach(function(face){var components=['x','y','z'].sort(function(a,b){return Math.abs(face.normal[a])>Math.abs(face.normal[b]);});var v1=geometry.vertices[face.a];var v2=geometry.vertices[face.b];var v3=geometry.vertices[face.c];geometry.faceVertexUvs[0].push([new THREE.Vector2(v1[components[0]],v1[components[1]]),new THREE.Vector2(v2[components[0]],v2[components[1]]),new THREE.Vector2(v3[components[0]],v3[components[1]])]);});geometry.uvsNeedUpdate=true;}
function objsMake(type,texture){var objs=[];if(type=='pyramids'){for(var i=3;i<=8;i++){var geometry=new THREE.ConeGeometry(1,1.7,i);var clr='#46d'
var material=new THREE.MeshPhongMaterial({color:clr,specular:0x444444,shininess:70,emissive:0x0,map:texture});material.side=THREE.DoubleSide;var obj=new THREE.Mesh(geometry,material);obj.position.set(-9+i*2,1.5,2-i*1.1);obj.rotation.x=Math.PI/4
my.scene.add(obj);objs.push(obj);}}
if(type=='prisms'){for(var i=3;i<=8;i++){var geometry=new THREE.CylinderGeometry(0.8,0.8,2,i)
var clr='#46d'
var material=new THREE.MeshPhongMaterial({color:clr,specular:0x888888,shininess:90,emissive:0x0,map:texture});material.side=THREE.DoubleSide;var obj=new THREE.Mesh(geometry,material);obj.position.set(-9+i*2,1.5,2-i*1.1);obj.rotation.x=Math.PI/2
my.scene.add(obj);objs.push(obj);}}
if(type=='cube'){var clr=my.clrs[2][1]
var geometry=new THREE.BoxGeometry(1.5,1.5,1.5);var material=new THREE.MeshPhongMaterial({color:0x2194ce,specular:0x111111,shininess:50,emissive:0x0,map:texture});material.side=THREE.DoubleSide;var obj=new THREE.Mesh(geometry,material);obj.position.set(0,2,0);obj.receiveShadow=true;obj.castShadow=true;my.scene.add(obj);objs.push(obj);}
if(type=='sphere'){var clr=my.clrs[2][1]
var geometry=new THREE.SphereGeometry(1.2,50,50)
var material=new THREE.MeshPhongMaterial({color:0x2194ce,specular:0x111111,shininess:10,emissive:0x0,map:texture});material.side=THREE.DoubleSide;var obj=new THREE.Mesh(geometry,material);obj.position.set(0,2,0);obj.receiveShadow=true;obj.castShadow=true;my.scene.add(obj);objs.push(obj);}
if(type=='torus'){var clr=my.clrs[2][1]
var geometry=new THREE.TorusGeometry(1,0.5,16,100)
var material=new THREE.MeshPhongMaterial({color:0x2194ce,specular:0x111111,shininess:30,emissive:0x0,map:texture});material.side=THREE.DoubleSide;var obj=new THREE.Mesh(geometry,material);obj.position.set(0,2,0);obj.receiveShadow=true;obj.castShadow=true;my.scene.add(obj);objs.push(obj);}
if(type=='data'){var clr=my.clrs[2][1]
my.poly=new Poly()
my.polyN=8
my.poly.shapeSource="data";my.poly.shapeType=my.polys[my.polyN][0];var geometry=polyToGeometry();assignUVs(geometry)
geometry.computeFaceNormals();geometry.computeBoundingSphere();texture.wrapS=THREE.RepeatWrapping;texture.wrapT=THREE.RepeatWrapping;var material=new THREE.MeshPhongMaterial({color:0xaaaaaa,specular:0xffffff,shininess:30,emissive:0x0,map:texture,wireframe:false});material.side=THREE.DoubleSide;var obj=new THREE.Mesh(geometry,material);obj.position.set(0,2,0);obj.receiveShadow=true;obj.castShadow=true;my.scene.add(obj);objs.push(obj);}
if(type=='cuboid'){var clr=my.clrs[2][1]
var geometry=new THREE.BoxGeometry(4,2,2);texture.wrapS=THREE.RepeatWrapping;texture.wrapT=THREE.RepeatWrapping;texture.repeat.x=2
texture.repeat.y=1
var material=new THREE.MeshPhongMaterial({color:0x2194ce,specular:0x111111,shininess:50,emissive:0x0,map:texture});material.side=THREE.DoubleSide;var obj=new THREE.Mesh(geometry,material);obj.position.set(0,2,0);obj.receiveShadow=true;obj.castShadow=true;my.scene.add(obj);objs.push(obj);}
return objs}
function animate(){var now=performance.now();var animTime=now-my.animWhen;my.animWhen=now;my.move.yaw=0;my.move.roll=0;my.move.pitch=0;var speed=0.5
if(my.mouseStatus==1){my.yaw.stt=performance.now()
if(Math.abs(my.yaw.tgt)<0.001)my.yaw.tgt=0
my.move.yaw=my.yaw.tgt*speed
my.pitch.stt=performance.now()
if(Math.abs(my.pitch.tgt)<0.001)my.pitch.tgt=0
my.move.pitch=-my.pitch.tgt*speed}else{var elapse=(performance.now()-my.yaw.stt)/1000;if(elapse<1){var ease=Math.sqrt(1-elapse)
my.move.yaw=ease*my.yaw.tgt*speed}
elapse=(performance.now()-my.pitch.stt)/1000;if(elapse<1){var ease=Math.sqrt(1-elapse)
my.move.pitch=-ease*my.pitch.tgt*speed}}
osdUpdate()
my.frameNo=loop(my.frameNo,0,60);if(my.frameNo==0){var fps=1000/((performance.now()-my.fpsStt)/60)
my.fpsStt=performance.now()}
if(my.pauseQ){my.pauseFrame++;my.camera.quaternion.slerp(my.toQuat,my.pauseFrame/1000);my.camera.position.y=((100-my.pauseFrame)*my.pauseHeight+my.pauseFrame*2)/100;if(my.pauseFrame>100){my.pauseQ=false;my.camera.quaternion.slerp(my.toQuat,1);my.camera.position.y=2;}}
if(Math.abs(my.camera.rotation.z)>0.03){my.camera.rotation.z*=0.99}
updateRotationVector(animTime);for(var i=0;i<my.objs.length;i++){var obj=my.objs[i];obj.rotation.x-=0.002
obj.rotation.y+=0.006}
var moveMult=0.05;my.camera.translateX(my.moveVector.x*moveMult);my.camera.translateY(my.moveVector.y*moveMult);my.camera.translateZ(my.moveVector.z*moveMult);var rotMult=0.01;my.tmpQuaternion.set(my.rotationVector.x*rotMult,my.rotationVector.y*rotMult,my.rotationVector.z*rotMult,1).normalize();my.camera.quaternion.multiply(my.tmpQuaternion);my.renderer.render(my.scene,my.camera);requestAnimationFrame(animate);}
function keydown(ev){keychg(ev,true);}
function keychg(ev){var keys={32:'space',87:'w',65:'a',83:'s',68:'d',82:'r',70:'f',81:'q',69:'e',37:'left',39:'right',38:'up',40:'down'};if(!keys.hasOwnProperty(ev.keyCode))return;var keyName=keys[ev.keyCode];var maps={space:'pause',w:'speed+',s:'speed-',a:'side+',d:'side-',q:'roll+',e:'roll-',r:'speed+',f:'speed-',left:'yaw+',right:'yaw-',up:'pitch+',down:'pitch-'};if(!maps.hasOwnProperty(keyName))return;var type=maps[keyName];my.pauseQ=false;var speed=1
console.log('keychg',ev.keyCode,keyName,type)
switch(type){case 'pause':my.move.speed=0
my.move.side=0
my.move.up=0
my.move.yaw=0;my.move.pitch=0;my.move.roll=0;document.getElementById('speedSlider').value=0
break;case 'speed+':my.move.speed-=0.05;my.move.speed=constrain0(my.move.speed,1);document.getElementById('speedSlider').value=-my.move.speed*100
break;case 'speed-':my.move.speed+=0.05;my.move.speed=constrain0(my.move.speed,1);document.getElementById('speedSlider').value=-my.move.speed*100
break;case 'side+':my.move.x+=0.05;my.move.x=constrain0(my.move.x,1);break;case 'side-':my.move.x-=0.05;my.move.x=constrain0(my.move.x,1);break;case 'yaw+':my.yaw.tgt=speed
my.yaw.stt=performance.now()
break;case 'yaw-':my.yaw.tgt=-speed
my.yaw.stt=performance.now()
break;case 'pitch+':my.pitch.tgt=-speed
my.pitch.stt=performance.now()
break;case 'pitch-':my.pitch.tgt=speed
my.pitch.stt=performance.now()
break;case 'roll+':break;case 'roll-':break;default:}
ev.preventDefault();ev.stopPropagation();updateMovementVector();updateRotationVector();osdUpdate()}
function constrain0(x,lim){x=Math.max(-lim,Math.min(x,lim))
if(Math.abs(x)<lim/100)x=0;return x;}
function touchStart(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;my.lastTouch=ev
mouseDown(ev)}
function touchMove(ev){var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;my.lastTouch=ev
mouseMove(ev)}
function touchEnd(){my.mouseStatus=0
var ev=my.lastTouch
var touch=ev.targetTouches[0];ev.clientX=touch.clientX;ev.clientY=touch.clientY;ev.touchQ=true;moveUpdate(ev)}
function mouseDown(ev){my.mouseStatus=1
moveUpdate(ev)}
function mouseMove(ev){if(my.mouseStatus==1){moveUpdate(ev)}}
function mouseUp(ev){my.mouseStatus=0
moveUpdate(ev)}
function moveUpdate(ev){var rect=my.domRect
var halfWidth=rect.width/2;var halfHeight=rect.height/2;var val=-((ev.clientX-rect.left)-halfWidth)/halfWidth
my.yaw.tgt=Math.abs(val)>0.2?val:0
var val=((ev.clientY-rect.top)-halfHeight)/halfHeight
my.pitch.tgt=Math.abs(val)>0.2?val:0
ev.preventDefault();ev.stopPropagation();}
function updateMovementVector(){my.moveVector.x=my.move.side
my.moveVector.y=my.move.up
my.moveVector.z=my.move.speed}
function updateRotationVector(){my.rotationVector.x=my.move.pitch;my.rotationVector.y=my.move.yaw;my.rotationVector.z=my.move.roll;}
function resize(){my.camera.aspect=window.innerWidth/window.innerHeight;my.domRect=document.getElementById('anim').getBoundingClientRect();my.camera.aspect=my.domRect.width/my.domRect.height
my.camera.updateProjectionMatrix();my.renderer.setSize(my.domRect.width,my.domRect.height)}
function Poly(){this.shapeType='cube';this.shapeSource='calc';this.scale=90;}
Poly.prototype.getSolid=function(){var C=[];switch(this.shapeSource){case "file":case "data":var solid=my.polys[my.polyN][1];var vertices=solid[3];var solidFaces=solid[5];C=[];for(var i=0;i<solidFaces.length;i++){var faceVerts=[];for(var j=0;j<solidFaces[i].length;j++){faceVerts.push(vertices[solidFaces[i][j]]);}
C.push(faceVerts);}
this.clrMethod="Glass";this.scale=120;break;case "calc":C=this.getCalcSolid();break;default:}
return C;};Poly.prototype.getNet=function(){var solid=my.polys[my.polyNo][1];var vertices=solid[3];var netFaces=solid[4];var C=[];for(var i=0;i<netFaces.length;i++){var faceVerts=[];for(var j=0;j<netFaces[i].length;j++){faceVerts.push(vertices[netFaces[i][j]]);}
C.push(faceVerts);}
return C;};Poly.prototype.getCalcSolid=function(){var C=[];this.scale=90;var i;var j;switch(this.shapeType.toLowerCase()){case "net":C=[[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],[[1,0,0],[2,0,0],[2,1,0],[1,1,0]],[[2,0,0],[3,0,0],[3,1,0],[2,1,0]]];this.clrMethod="Glass";this.scale=100;break;case "sphere":C=this.createNSphere(3);this.clrMethod="Alternating";this.scale=110;break;case "hemisphere":C=this.createNSphere(3,true);this.clrMethod="Shaded";this.scale=110;break;case "cone":C=this.createNCone(60,1.3);this.scale=140;this.clrMethod="Smooth";break;case "cylinder":C=this.createNCylinder(60);this.clrMethod="Smooth";this.scale=110;break;case "square-pyramid":C=this.createNCone(4,0.5);this.scale=180;break;case "pent-pyramid":C=this.createNCone(5,0.7);this.scale=180;break;case "tetrahedron":C=[[[1,1,1],[-1,1,-1],[1,-1,-1]],[[-1,1,-1],[-1,-1,1],[1,-1,-1]],[[1,1,1],[1,-1,-1],[-1,-1,1]],[[1,1,1],[-1,-1,1],[-1,1,-1]]];break;case "irr-tetrahedron":C=[[[2,1,-0.2],[-1,1,-1],[1,-1,-1]],[[-1,1,-1],[-1,-1,1],[1,-1,-1]],[[2,1,-0.2],[1,-1,-1],[-1,-1,1]],[[2,1,-0.2],[-1,-1,1],[-1,1,-1]]];this.scale=80;break;case "cube":C=[[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]];break;case "3 points":C=[[[-1,-1,-1],[1,-1,-1],[1,-1,1]]];this.scale=80;break;case "4 coplanar points":C=[[[-1.5,-1,-1],[1,-1,-1],[0.3,-1,1],[-1.5,-1,1]]];this.scale=80;break;case "4 points":C=[[[-1.1,-2,-2],[1,-1,-1],[0.8,2,1]],[[1,-1,-1],[0.8,2,1],[1.5,-1,1]]];this.scale=70;break;case "plane":var a=0.5;var b=0.5;var c=0.5;var d=-3;C=[];for(i=0;i<6;i++){for(j=0;j<6;j++){C.push([[a,-b+d+i,-c+d+j],[a,b+d+i,-c+d+j],[a,b+d+i,c+d+j],[a,-b+d+i,c+d+j]]);}}
this.scale=80;break;case "cuboid":case "rect-prism":a=1.2;b=0.7;c=0.7;C=[[[-a,-b,-c],[a,-b,-c],[a,-b,c],[-a,-b,c]],[[-a,-b,-c],[-a,-b,c],[-a,b,c],[-a,b,-c]],[[-a,-b,c],[a,-b,c],[a,b,c],[-a,b,c]],[[-a,b,-c],[-a,b,c],[a,b,c],[a,b,-c]],[[a,-b,-c],[a,b,-c],[a,b,c],[a,-b,c]],[[-a,-b,-c],[-a,b,-c],[a,b,-c],[a,-b,-c]]];break;case "pent-prism":a=1.2;b=0.70;c=0.73;d=0.16;var e=0.44;C=[[[-a,0,b],[-a,c,d],[-a,e,-b],[-a,-e,-b],[-a,-c,d]],[[a,0,b],[a,c,d],[a,e,-b],[a,-e,-b],[a,-c,d]],[[-a,0,b],[-a,c,d],[a,c,d],[a,0,b]],[[-a,c,d],[-a,e,-b],[a,e,-b],[a,c,d]],[[-a,e,-b],[-a,-e,-b],[a,-e,-b],[a,e,-b]],[[-a,-e,-b],[-a,-c,d],[a,-c,d],[a,-e,-b]],[[-a,-c,d],[-a,0,b],[a,0,b],[a,-c,d]]];break;case "oct-prism":a=1.1;b=0.33;c=0.79;C=[[[-a,b,c],[-a,c,b],[-a,c,-b],[-a,b,-c],[-a,-b,-c],[-a,-c,-b],[-a,-c,b],[-a,-b,c]],[[a,b,c],[a,c,b],[a,c,-b],[a,b,-c],[a,-b,-c],[a,-c,-b],[a,-c,b],[a,-b,c]]];for(i=0;i<8;i++){j=loop(i,0,7,1);C.push([[C[0][i][0],C[0][i][1],C[0][i][2]],[C[0][j][0],C[0][j][1],C[0][j][2]],[C[1][j][0],C[1][j][1],C[1][j][2]],[C[1][i][0],C[1][i][1],C[1][i][2]]]);}
break;case "irr-pent-prism":a=1.2;b=0.70;c=0.73;d=0.16;e=0.9;C=[[[-a,0,b],[-a,c,d],[-a,e,-b],[-a,-e,-b],[-a,-c,d]],[[a,0,b],[a,c,d],[a,e,-b],[a,-e,-b],[a,-c,d]],[[-a,0,b],[-a,c,d],[a,c,d],[a,0,b]],[[-a,c,d],[-a,e,-b],[a,e,-b],[a,c,d]],[[-a,e,-b],[-a,-e,-b],[a,-e,-b],[a,e,-b]],[[-a,-e,-b],[-a,-c,d],[a,-c,d],[a,-e,-b]],[[-a,-c,d],[-a,0,b],[a,0,b],[a,-c,d]]];break;case "tri-prism-n":C=this.createNCylinder(3);this.scale=100;break;case "tri-prism":a=1.2;b=0.7;c=0.7;d=0.6;C=[[[-a,-b,-c],[-a,-b,c],[-a,d,0]],[[a,-b,-c],[a,-b,c],[a,d,0]],[[-a,-b,-c],[a,-b,-c],[a,-b,c],[-a,-b,c]],[[-a,-b,c],[a,-b,c],[a,d,0],[-a,d,0]],[[-a,-b,-c],[-a,d,0],[a,d,0],[a,-b,-c]]];break;case "strange-prism":a=1.2;b=0.7;c=0.7;C=[[[-a,-b,-c],[a,-b,-c],[a,-b,c]],[[-a,-b,-c],[-a,-b,c],[-a,b,c]],[[-a,-b,c],[a,-b,c],[a,b,c]],[[-a,b,-c],[-a,b,c],[a,b,c]],[[a,-b,-c],[a,b,-c],[a,b,c]],[[-a,-b,-c],[-a,b,-c],[a,b,-c]]];break;case "octahedron":a=3/(2*Math.sqrt(2));b=3/2;C=[[[-a,0,a],[-a,0,-a],[0,b,0]],[[-a,0,-a],[a,0,-a],[0,b,0]],[[a,0,-a],[a,0,a],[0,b,0]],[[a,0,a],[-a,0,a],[0,b,0]],[[a,0,-a],[-a,0,-a],[0,-b,0]],[[-a,0,-a],[-a,0,a],[0,-b,0]],[[a,0,a],[a,0,-a],[0,-b,0]],[[-a,0,a],[a,0,a],[0,-b,0]]];this.scale=100;break;case "dodecahedron":var phi=(1+Math.sqrt(5))/2;a=1;b=1/phi;c=2-phi;a*=1.5;b*=1.5;c*=1.5;C=[[[c,0,a],[-c,0,a],[-b,b,b],[0,a,c],[b,b,b]],[[-c,0,a],[c,0,a],[b,-b,b],[0,-a,c],[-b,-b,b]],[[c,0,-a],[-c,0,-a],[-b,-b,-b],[0,-a,-c],[b,-b,-b]],[[-c,0,-a],[c,0,-a],[b,b,-b],[0,a,-c],[-b,b,-b]],[[0,a,-c],[0,a,c],[b,b,b],[a,c,0],[b,b,-b]],[[0,a,c],[0,a,-c],[-b,b,-b],[-a,c,0],[-b,b,b]],[[0,-a,-c],[0,-a,c],[-b,-b,b],[-a,-c,0],[-b,-b,-b]],[[0,-a,c],[0,-a,-c],[b,-b,-b],[a,-c,0],[b,-b,b]],[[a,c,0],[a,-c,0],[b,-b,b],[c,0,a],[b,b,b]],[[a,-c,0],[a,c,0],[b,b,-b],[c,0,-a],[b,-b,-b]],[[-a,c,0],[-a,-c,0],[-b,-b,-b],[-c,0,-a],[-b,b,-b]],[[-a,-c,0],[-a,c,0],[-b,b,b],[-c,0,a],[-b,-b,b]]];break;case "icosahedron-intersected":phi=(1+Math.sqrt(5))/2;a=1;b=1/phi;c=2-phi;a*=1.5;b*=1.5;c*=1.5;C=[[[0,b,-a],[b,a,0],[-b,a,0]],[[0,0,0],[-b,a,0],[b,a,0]],[[0,0,0],[0,-b,a],[-a,0,b]],[[0,0,0],[a,0,b],[0,-b,a]],[[0,b,-a],[0,0,0],[a,0,-b]],[[0,b,-a],[-a,0,-b],[0,0,0]],[[0,-b,a],[b,-a,0],[-b,-a,0]],[[0,0,0],[-b,-a,0],[b,-a,0]],[[-b,a,0],[-a,0,b],[-a,0,-b]],[[-b,-a,0],[-a,0,-b],[-a,0,b]],[[b,a,0],[a,0,-b],[a,0,b]],[[b,-a,0],[a,0,b],[a,0,-b]],[[0,0,0],[-a,0,b],[-b,a,0]],[[0,0,0],[b,a,0],[a,0,b]],[[0,b,-a],[-b,a,0],[-a,0,-b]],[[0,b,-a],[a,0,-b],[b,a,0]],[[0,0,0],[-a,0,-b],[-b,-a,0]],[[0,0,0],[b,-a,0],[a,0,-b]],[[0,-b,a],[-b,-a,0],[-a,0,b]],[[0,-b,a],[a,0,b],[b,-a,0]]];break;case "icosahedron":phi=(1+Math.sqrt(5))/2;a=1/2;b=1/(2*phi);a*=3;b*=3;C=[[[0,b,-a],[b,a,0],[-b,a,0]],[[0,b,a],[-b,a,0],[b,a,0]],[[0,b,a],[0,-b,a],[-a,0,b]],[[0,b,a],[a,0,b],[0,-b,a]],[[0,b,-a],[0,-b,-a],[a,0,-b]],[[0,b,-a],[-a,0,-b],[0,-b,-a]],[[0,-b,a],[b,-a,0],[-b,-a,0]],[[0,-b,-a],[-b,-a,0],[b,-a,0]],[[-b,a,0],[-a,0,b],[-a,0,-b]],[[-b,-a,0],[-a,0,-b],[-a,0,b]],[[b,a,0],[a,0,-b],[a,0,b]],[[b,-a,0],[a,0,b],[a,0,-b]],[[0,b,a],[-a,0,b],[-b,a,0]],[[0,b,a],[b,a,0],[a,0,b]],[[0,b,-a],[-b,a,0],[-a,0,-b]],[[0,b,-a],[a,0,-b],[b,a,0]],[[0,-b,-a],[-a,0,-b],[-b,-a,0]],[[0,-b,-a],[b,-a,0],[a,0,-b]],[[0,-b,a],[-b,-a,0],[-a,0,b]],[[0,-b,a],[a,0,b],[b,-a,0]]];this.scale=80;break;default:}
return C;};Poly.prototype.createNCone=function(ngon,ht){var D=[];D[0]=[];var sumx=0;var sumy=0;for(var i=0;i<ngon;i++){var Angle=(Math.PI*2*i)/ngon;D[0][i]=[];D[0][i][0]=Math.sin(Angle)*0.8;D[0][i][1]=Math.cos(Angle)*0.8;D[0][i][2]=-ht/2;sumx=sumx+D[0][i][0];sumy=sumy+D[0][i][1];}
var apexx=sumx/ngon;var apexy=sumy/ngon;for(i=0;i<ngon;i++){var n=i+1;D[n]=[];D[n][0]=[];D[n][0][0]=apexx;D[n][0][1]=apexy;D[n][0][2]=ht;D[n][1]=[];D[n][1][0]=D[0][i][0];D[n][1][1]=D[0][i][1];D[n][1][2]=D[0][i][2];var i1=i+1;if(i1==ngon)
i1=0;D[n][2]=[];D[n][2][0]=D[0][i1][0];D[n][2][1]=D[0][i1][1];D[n][2][2]=D[0][i1][2];}
return D;};Poly.prototype.createNCylinder=function(ngon){var D=[];D[0]=[];var ang=0
for(var i=0;i<ngon;i++){ang=(Math.PI*2*i)/ngon;D[0][i]=[];D[0][i][0]=Math.sin(ang)*0.8;D[0][i][1]=Math.cos(ang)*0.8;D[0][i][2]=1.4;}
D[1]=[];for(i=0;i<ngon;i++){ang=(Math.PI*2*i)/ngon;D[1][i]=[];D[1][i][0]=Math.sin(ang)*0.8;D[1][i][1]=Math.cos(ang)*0.8;D[1][i][2]=-1.1;}
for(i=0;i<ngon;i++){var n=i+2;D[n]=[];var i1=i+1;if(i1==ngon)
i1=0;D[n][0]=[];D[n][0][0]=D[0][i][0];D[n][0][1]=D[0][i][1];D[n][0][2]=D[0][i][2];D[n][1]=[];D[n][1][0]=D[0][i1][0];D[n][1][1]=D[0][i1][1];D[n][1][2]=D[0][i1][2];D[n][2]=[];D[n][2][0]=D[1][i1][0];D[n][2][1]=D[1][i1][1];D[n][2][2]=D[1][i1][2];D[n][3]=[];D[n][3][0]=D[1][i][0];D[n][3][1]=D[1][i][1];D[n][3][2]=D[1][i][2];}
return D;};Poly.prototype.sphereNormalise=function(p){var vectorLength=Math.sqrt(p[0]*p[0]+p[1]*p[1]+p[2]*p[2]);if(vectorLength!=0){p[0]/=vectorLength;p[1]/=vectorLength;p[2]/=vectorLength;}else{p[0]=0;p[1]=0;p[2]=0;}};function loop(currNo,minNo,maxNo,incr){if(incr===undefined)incr=1;currNo+=incr;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}