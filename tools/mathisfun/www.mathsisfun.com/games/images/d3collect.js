var THREE,my={};function d3collectMain(){var version='0.52'
my.lvls=[{name:'Level 1',typ:'metal',tgt:100,even:[20,40]},{name:'Level 2',typ:'money',tgt:1000,even:[20,40]}];my.lvl=my.lvls[0];my.textNo=0;my.moveCost=2
my.metal=0;my.money=0;my.dist=0;my.clrs=[["Blue",'#0000ff'],["Red",'#ff0000'],["Green",'#00cc00'],["Orange",'#FFA500'],["Slate Blue",'#6A5ACD'],["Lime",'#00FF00'],["Spring Green",'#00FF7F'],["Teal",'#008080'],["Gold",'#ffd700'],["Med Purple",'#aa00aa'],["Light Blue",'#ADD8E6'],["Navy",'#000080'],["Purple",'#800080'],["Dark SeaGreen",'#8FBC8F'],["Black",'#000000']];var s=''
s+=`
<div id="main" style="position:relative; margin:0; height:90vh; display:block;">

<div id="anim" style="position:absolute; left:0; top:0; width:100%; height:90vh; margin:auto; display:block;"></div>

<div id="speedSlider" style="position:absolute; left:0; top:0; width:100%;  margin:auto; display:block; z-index:3; color:white; 
font: 2.5vmin Arial; text-align: center;">
  <input type="range" id="speedSlider" value="0" min="-100" max="100" step="1"  style="width:60vmin; height:1vmin; border: none; "
 oninput="speedChg(0,this.value)" onchange="speedChg(1,this.value)" />
</div>
  
<div id="osd" style="position:absolute; left:0; top:0; width:100%; height:90vh;  margin:auto; display:block;  z-index:2; 
color:white; font: 2.5vmin Arial; text-align: center; border: 1px solid blue;">
  <br>
  <div style="display:inline-block; width: 10vw; text-align: right; margin-right: 1vw;">Yaw: </div>
  <div id="osdYaw" style="display:inline-block;  width: 5vw;">0</div>
  <div style="display:inline-block; width: 10vw; text-align: right; margin-right: 1vw;">Speed:</div>
  <div id="osdSpeed" style="display:inline-block; width: 5vw; backgroun ">0</div>
  
  
  <div style="display:inline-block; width: 10vw; text-align: right; margin-right:2vw;">Pitch: </div>
  <div id="osdPitch" style="display:inline-block;  width: 5vw;">0</div>

  
  <div style="margin-top:5px;"> 
    <span style="color:lightblue; font:20px Arial;">Metal:&nbsp;</span><span id="metal" style="color:lightblue; font:20px Arial;">0</span>
    <span style="color:gold; font:20px Arial;"> &nbsp; Credit:&nbsp;$</span><span id="money" style="color:gold; font:20px Arial;">0</span>
    <!--
    <span style="color:gold; font:20px Arial;">&nbsp; FPS:&nbsp;</span><span id="fps" style="color:gold; font:20px Arial;">0</span>
    -->	
  </div>

    <div id="plus" style="position:absolute; color:white; font:28px Arial; opacity: 1; transition: opacity .25s ease-in-out;"></div>

  </div>
  
</div>
  
<div style="font: 1.2vw Arial; ">&copy; 2019 MathsIsFun.com  v${version}</div>
`
document.write(s);my.osd=document.getElementById('osd')
my.imgHome=(document.domain=='localhost')?'/mathsisfun/images/':'/images/'
sceneSetup()
my.move={speed:0,side:0,up:0,yaw:0,pitch:0,roll:0}
my.yaw={tgt:0,stt:0}
my.pitch={tgt:0,stt:0}
my.moveVector=new THREE.Vector3(0,0,0);my.rotationVector=new THREE.Vector3(0,0,0);my.dragToLook=false;my.autoForward=false;my.mouseStatus=0;window.addEventListener('keydown',keydown,false);window.addEventListener('resize',resize,false);var div=document.getElementById('osd')
div.addEventListener('touchstart',touchStart,false);div.addEventListener('touchmove',touchMove,false);div.addEventListener('touchend',touchEnd,false);div.addEventListener('mousedown',mouseDown,false);div.addEventListener('mousemove',mouseMove,false);div.addEventListener('mouseup',mouseUp,false);my.pauseQ=false;my.fromQuat=null;my.toQuat=null;my.frameNo=0;resize();osdUpdate()
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
scene.fog=new THREE.Fog(0x000000,10,30)
my.camera=new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight,0.2,1000);my.camera.eulerOrder="YXZ"
my.tmpQuaternion=new THREE.Quaternion();my.renderer=new THREE.WebGLRenderer();my.renderer.setSize(window.innerWidth,window.innerHeight);my.el=my.renderer.domElement;var div=document.getElementById('anim')
div.appendChild(my.el);my.floorTexture=new THREE.TextureLoader().load(my.imgHome+'bg/singlt12.jpg');my.orbTexture=new THREE.TextureLoader().load(my.imgHome+'bg/medium10.jpg');my.traderTexture=new THREE.TextureLoader().load(my.imgHome+'bg/medium10.jpg');if(false){var geometry=new THREE.BoxGeometry(2,1,1);var material=new THREE.MeshPhongMaterial({color:0xffffff});var cube2=new THREE.Mesh(geometry,material);cube2.position.y+=1;cube2.receiveShadow=true;cube2.castShadow=true;scene.add(cube2);}
if(true){var geometry=new THREE.SphereBufferGeometry(3,12,12);var material=new THREE.MeshPhongMaterial({color:0xffffff,fog:false});my.sun=new THREE.Mesh(geometry,material);my.sun.position.set(0,2,-100)
my.sun.receiveShadow=true;my.sun.castShadow=true;scene.add(my.sun);}
if(false){var skyGeom=new THREE.SphereBufferGeometry(300,60,60);var texture=new THREE.TextureLoader().load(my.imgHome+'bg/stars5.jpg');var material=new THREE.MeshPhongMaterial({map:texture,fog:false});var sky=new THREE.Mesh(skyGeom,material);sky.material.side=THREE.BackSide;scene.add(sky);}
my.cellSize=10;my.cells=[];cellAdd(0,0,0);var ambientLight=new THREE.AmbientLight(0xffffff,2);scene.add(ambientLight);var light=new THREE.PointLight(0xffffff,1,100)
light.position.set(0,0,0);my.light=light;scene.add(my.light);my.renderer.shadowMap.enabled=true;my.renderer.shadowMap.type=THREE.BasicShadowMap;if(true){my.camera.position.set(0,2,9);}else{my.camera.position.set(0,25,0);my.camera.lookAt(0,0,0);}
light.target=my.camera;cellUpdate(my.camera.position);}
function cellAdd(x,y,z){var size=my.cellSize;var material=new THREE.MeshPhongMaterial({color:0x4466ff,transparent:true,opacity:0.2,})
material.side=THREE.DoubleSide;var gap=0.3
var floor=new THREE.Mesh(new THREE.PlaneGeometry(size-gap,size-gap,1,1),material);floor.rotation.x-=Math.PI/2;floor.position.set(x*size,y*size,z*size)
floor.receiveShadow=true;my.scene.add(floor);var orbs=[];for(var i=0;i<8;i++){var typ='metal';if(Math.random()<0.02)typ='trader';var geom,matl,textDiv,val,fee=0;switch(typ){case 'metal':val=Math.round(1+Math.random()*6)
geom=new THREE.SphereBufferGeometry(0.3*Math.pow(val,0.33),12,12);var clrN=Math.round(val)
var clr=Number('0x'+my.clrs[clrN][1].substring(1));matl=new THREE.MeshLambertMaterial({color:clr,transparent:true,opacity:0.5,reflectivity:0.8,map:my.traderTexture});break;case 'trader':geom=new THREE.CylinderBufferGeometry(0.3,0.3,2,5);matl=new THREE.MeshStandardMaterial({color:0x00ff00,metalness:0.6,map:my.traderTexture});val=randomInt(3,9);var brkEven=randomInt(10,50);fee=val*brkEven;textDiv=textAdd(val,fee);break;default:}
var mesh=new THREE.Mesh(geom,matl);mesh.position.x=floor.position.x+(Math.random()-0.5)*size;mesh.position.y=0+Math.random()*4
mesh.position.z=floor.position.z+(Math.random()-0.5)*size;my.scene.add(mesh);orbs.push({mesh:mesh,val:val,fee:fee,typ:typ,textDiv:textDiv});}
var cell={mesh:floor,orbs:orbs,x:x,y:y,z:z,when:performance.now()}
my.cells.push(cell)
return cell;}
function cellDel(cell){my.scene.remove(cell.mesh);cell.mesh.geometry.dispose();cell.mesh.material.dispose();cell.mesh=undefined;for(var i=0;i<cell.orbs.length;i++){var orb=cell.orbs[i];if(orb.typ=='trader'){textDel(orb.textDiv);}
var mesh=orb.mesh;my.scene.remove(mesh);mesh.geometry.dispose();mesh.material.dispose();mesh=undefined;}}
function cellUpdate(pos){var span=51;var size=my.cellSize;var minx=Math.round((pos.x-span)/size);var maxx=Math.round((pos.x+span)/size);var minz=Math.round((pos.z-span)/size);var maxz=Math.round((pos.z+span)/size);var needs=[];for(var i=minx;i<=maxx;i++){for(var j=minz;j<=maxz;j++){var d=dist(pos.x-i*size,pos.z-j*size);if(d<=span)
needs.push({x:i,y:0,z:j});}}
for(var i=0;i<my.cells.length;i++){var cell=my.cells[i];for(var j=needs.length-1;j>=0;j--){var need=needs[j];if(cell.x==need.x&&cell.z==need.z){needs.splice(j,1);cell.when=performance.now();}}}
for(var i=0;i<needs.length;i++){cellAdd(needs[i].x,0,needs[i].z);}
if(my.frameNo==10){var now=performance.now();for(var i=my.cells.length-1;i>=0;i--){var cell=my.cells[i];if((now-cell.when)/1000>5){my.cells.splice(i,1);cellDel(cell);}}}}
function textAdd(val,fee){var node=document.createElement("DIV");node.style.position="absolute";var wd=50;var ht=42;var s=`
<div style="position: absolute; left:-${wd/2}px; top:-${ht*2}px; width:${wd}px; height:${ht}px; border: 1px solid #353; border-radius:10px;">
<div style="font:20px Arial; color:gold; text-align:center;">$${val}</div>
<div style="font:16px Arial; color:red; text-align:center;">&minus;$${fee}</div>
</div>`
s+='</div>';node.innerHTML=s;my.osd.appendChild(node);return node;}
function textDel(node){my.osd.removeChild(node);}
function textUpdate(){for(var i=0;i<my.cells.length;i++){var cell=my.cells[i];var orbs=cell.orbs;for(var j=0;j<orbs.length;j++){var orb=orbs[j];if(orb.typ=='trader'){var mesh=orb.mesh;var pt=toScreenPosition(mesh,my.camera);var node=orb.textDiv;if(pt.z<1&&pt.x>0&&pt.y>0&&pt.x<my.domRect.width&&pt.y<my.domRect.height){node.style.visibility="visible";node.style.left=Math.round(pt.x)+"px";node.style.top=Math.round(pt.y)+"px";}else{node.style.visibility="hidden";}}}}}
function hitUpdate(pos){var size=my.cellSize;var rad=2;var needCells=[];var rect=new Rect(pos.x-rad,pos.z-rad,2*rad,2*rad);for(var i=0;i<my.cells.length;i++){var cell=my.cells[i];var cellRect=new Rect((cell.x-1/2)*size,(cell.z-1/2)*size,size,size);if(rect.collideRect(cellRect)){needCells.push(cell);}}
if(needCells.length==0)return;for(var i=0;i<needCells.length;i++){var cell=needCells[i];var orbs=cell.orbs;for(var j=0;j<orbs.length;j++){var orb=orbs[j];var mesh=orb.mesh;var d=dist(pos.x-mesh.position.x,pos.z-mesh.position.z);if(d<1&&Math.abs(pos.y-mesh.position.y)<1){if(orb.typ=='metal'){my.metal+=orb.val;var pt=toScreenPosition(mesh,my.camera);if(pt.x>100&&pt.x<my.domRect.width-100&&pt.y>100&&pt.y<my.domRect.height-100){var div=document.getElementById('plus');div.innerHTML='+'+orb.val;div.style.transition="opacity 0s";div.style.opacity=1;div.style.left=Math.round(pt.x)+"px";div.style.top=Math.round(pt.y)+"px";setTimeout(scoreFade,500);}
document.getElementById('metal').innerHTML=my.metal;my.scene.remove(orb.mesh);orbs.splice(j,1);break;}
if(orb.typ=='trader'){if(my.metal>10){console.log("trader",my.metal,orb.val,orb.fee);moneyAdd(my.metal*orb.val-orb.fee)
my.metal=0;document.getElementById('metal').innerHTML=my.metal;}}}}}}
function scoreFade(){var div=document.getElementById('plus');div.style.transition="opacity 1s";div.style.opacity=0;}
function animate(){var now=performance.now();var animTime=now-my.animWhen;my.animWhen=now;my.move.yaw=0;my.move.roll=0;my.move.pitch=0;var speed=0.5
if(my.mouseStatus==1){my.yaw.stt=performance.now()
if(Math.abs(my.yaw.tgt)<0.001)my.yaw.tgt=0
my.move.yaw=my.yaw.tgt*speed
thruster(my.move.yaw*0.02)
my.pitch.stt=performance.now()
if(Math.abs(my.pitch.tgt)<0.001)my.pitch.tgt=0
my.move.pitch=-my.pitch.tgt*speed
thruster(my.move.pitch*0.02)}else{var elapse=(performance.now()-my.yaw.stt)/1000;if(elapse<1){var ease=Math.sqrt(1-elapse)
my.move.yaw=ease*my.yaw.tgt*speed
thruster(my.move.yaw*0.02)}
elapse=(performance.now()-my.pitch.stt)/1000;if(elapse<1){var ease=Math.sqrt(1-elapse)
my.move.pitch=-ease*my.pitch.tgt*speed
thruster(my.move.pitch*0.02)}}
osdUpdate()
my.frameNo=loop(my.frameNo,0,60);if(my.frameNo==0){var fps=1000/((performance.now()-my.fpsStt)/60)
my.fpsStt=performance.now()}
if(my.pauseQ){my.pauseFrame++;my.camera.quaternion.slerp(my.toQuat,my.pauseFrame/1000);my.camera.position.y=((100-my.pauseFrame)*my.pauseHeight+my.pauseFrame*2)/100;if(my.pauseFrame>100){my.pauseQ=false;my.camera.quaternion.slerp(my.toQuat,1);my.camera.position.y=2;}}
if(Math.abs(my.camera.rotation.z)>0.03){my.camera.rotation.z*=0.99}
updateRotationVector(animTime);var moveMult=0.05*animTime/16;my.camera.translateX(my.moveVector.x*moveMult);my.camera.translateY(my.moveVector.y*moveMult);my.camera.translateZ(my.moveVector.z*moveMult);my.sun.position.z=my.camera.position.z-100
my.light.position.copy(my.camera.position);my.light.lookAt(my.camera);cellUpdate(my.camera.position);hitUpdate(my.camera.position);var rotMult=0.01;my.tmpQuaternion.set(my.rotationVector.x*rotMult,my.rotationVector.y*rotMult,my.rotationVector.z*rotMult,1).normalize();my.camera.quaternion.multiply(my.tmpQuaternion);my.renderer.render(my.scene,my.camera);textUpdate();requestAnimationFrame(animate);}
function keydown(ev){keychg(ev,true);}
function keychg(ev){var keys={32:'space',87:'w',65:'a',83:'s',68:'d',82:'r',70:'f',81:'q',69:'e',37:'left',39:'right',38:'up',40:'down'};if(!keys.hasOwnProperty(ev.keyCode))return;var keyName=keys[ev.keyCode];var maps={space:'pause',w:'speed+',s:'speed-',a:'side+',d:'side-',q:'roll+',e:'roll-',r:'speed+',f:'speed-',left:'yaw+',right:'yaw-',up:'pitch+',down:'pitch-'};if(!maps.hasOwnProperty(keyName))return;var type=maps[keyName];my.pauseQ=false;var speed=1
console.log('keychg',ev.keyCode,keyName,type)
switch(type){case 'reset':my.pauseQ=!my.pauseQ;if(my.pauseQ){my.pauseFrame=0;my.pauseHeight=my.camera.position.y;my.fromQuat=my.camera.quaternion;var dummyCam=my.camera.clone();dummyCam.lookAt(new THREE.Vector3(my.camera.position.x,my.camera.position.y,my.camera.position.z-1));my.toQuat=dummyCam.quaternion;my.camera.position.y=2;}
break;case 'pause':thruster(my.move.speed+my.move.side+my.move.up)
my.move.speed=0
my.move.side=0
my.move.up=0
my.move.yaw=0;my.move.pitch=0;my.move.roll=0;document.getElementById('speedSlider').value=0
break;case 'speed+':thruster(0.05)
my.move.speed-=0.05;my.move.speed=constrain0(my.move.speed,1);document.getElementById('speedSlider').value=-my.move.speed*100
break;case 'speed-':thruster(0.05)
my.move.speed+=0.05;my.move.speed=constrain0(my.move.speed,1);document.getElementById('speedSlider').value=-my.move.speed*100
break;case 'side+':thruster(0.05)
my.move.x+=0.05;my.move.x=constrain0(my.move.x,1);break;case 'side-':thruster(0.05)
my.move.x-=0.05;my.move.x=constrain0(my.move.x,1);break;case 'yaw+':thruster(0.01)
my.yaw.tgt=speed
my.yaw.stt=performance.now()
break;case 'yaw-':thruster(0.01)
my.yaw.tgt=-speed
my.yaw.stt=performance.now()
break;case 'pitch+':thruster(0.01)
my.pitch.tgt=-speed
my.pitch.stt=performance.now()
break;case 'pitch-':thruster(0.01)
my.pitch.tgt=speed
my.pitch.stt=performance.now()
break;case 'roll+':break;case 'roll-':break;default:}
ev.preventDefault();ev.stopPropagation();updateMovementVector();updateRotationVector();osdUpdate()}
function thruster(x){moneyAdd(-Math.abs(x)*5)}
function moneyAdd(x){my.money+=x
document.getElementById('money').innerHTML=my.money.toFixed(2)}
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
function resize(){my.camera.aspect=window.innerWidth/window.innerHeight;my.domRect=document.getElementById('osd').getBoundingClientRect()
my.camera.aspect=my.domRect.width/my.domRect.height
my.camera.updateProjectionMatrix();my.renderer.setSize(my.domRect.width,my.domRect.height)}
function toScreenPosition(obj,camera){var vector=new THREE.Vector3();obj.updateMatrixWorld();vector.setFromMatrixPosition(obj.matrixWorld);vector.project(camera);var widthHalf=0.5*my.domRect.width;var heightHalf=0.5*my.domRect.height;vector.x=(vector.x*widthHalf)+widthHalf;vector.y=-(vector.y*heightHalf)+heightHalf;return{x:vector.x,y:vector.y,z:vector.z}}
class Rect{constructor(lt,tp,wd,ht){this.lt=lt
this.tp=tp
this.wd=wd
this.ht=ht
return this}
bt(){return this.tp+this.ht}
rt(){return this.lt+this.wd}
collideRect(rect){return!(this.lt>rect.rt()||this.rt()<rect.lt||this.tp>rect.bt()||this.bt()<rect.tp)}}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function loop(currNo,minNo,maxNo,incr){if(incr===undefined)incr=1;currNo+=incr;var range=maxNo-minNo+1;if(currNo<minNo){currNo=maxNo-(-currNo+maxNo)%range;}
if(currNo>maxNo){currNo=minNo+(currNo-minNo)%range;}
return currNo;}