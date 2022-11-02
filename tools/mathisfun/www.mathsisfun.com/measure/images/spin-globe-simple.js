let my={};function spinGlobe(){console.log('spinGlobe')
my.xVal=0;my.skip=0;my.skipN=3;doAnim();}
function doAnim(){my.skip++;if(my.skip>=my.skipN){my.skip=0;my.xVal+=0.5;if(my.xVal>150)my.xVal=1;let divNames=['left1','middle1'];for(let i=0;i<divNames.length;i++){let name=divNames[i];let div=document.getElementById(name);div.setAttribute("transform","translate("+my.xVal+",5)");}}
if(my.xVal<400)
requestAnimationFrame(doAnim);}