let my={}
function rememberMain(){let version='0.62';my.opts={gameN:0,lvl:2}
my.imgHome=(document.domain=='localhost')?'/mathsisfun/images/style/':'/images/style/'
let s="";s+='<div style="position: relative; text-align: center;  ">';s+='<div style="display: inline-block; position: relative; width: 360px; text-align: center; vertical-align: top;  ">';let style='font: 25px Arial; height:25px; margin: 3px auto 3px auto; padding:5px;'
s+='<div id="info" style="margin: 3px auto 3px auto;">Enter this number:</div>';s+='<div id="chall" class="input" style="'+style+'"></div>';s+='<div id="resp" class="input" style="'+style+'"></div>';s+='<div style="text-align: center; height:42px;">'
s+='<img id="yesImg" src="'+my.imgHome+'yes.svg" style="" />';s+='<img id="noImg" src="'+my.imgHome+'no.svg" style="" />';s+='</div>'
s+='</div>';s+='<div style="font: 11px Arial; color: #6600cc;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);window.addEventListener("keydown",checkKeyPressed,false);my.memTime=1000
my.goQ=false
my.waitForUserQ=true
gameNew()}
function gameNew(){my.chall='123'
my.chall=randDigits(my.opts.lvl)
my.resp=''
if(my.opts.lvl>3)document.getElementById('info').innerHTML='Level '+my.opts.lvl
my.memTime=200+500*my.opts.lvl
document.getElementById('chall').innerHTML=my.chall
document.getElementById('resp').innerHTML=my.resp
document.getElementById('chall').style.visibility='visible'
document.getElementById('resp').style.visibility='hidden'
document.getElementById('yesImg').style.display='none'
document.getElementById('noImg').style.display='none'
if(my.waitForUserQ){my.goQ=false}else{statusWait()
my.goQ=false
setTimeout(gameGo,my.memTime)}}
function gameGo(){document.getElementById('chall').style.visibility='hidden'
document.getElementById('resp').style.visibility='visible'
my.goQ=true
statusGo()}
function randDigits(n){let s=''
for(let i=0;i<n;i++){s+=randomInt((i==0?1:0),9)}
return s}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function check(){if(my.resp.length>=my.chall.length){if(matchQ(my.chall,my.resp)){console.log('SUCCESS')
my.opts.lvl++
statusYes()
setTimeout(gameNew,1000)}else{console.log('FAIL')
statusNo()
setTimeout(gameNew,700+my.opts.lvl*200)}}}
function statusYes(){document.getElementById('chall').style.visibility='visible'
document.getElementById('yesImg').style.display='inline-block'}
function statusNo(){document.getElementById('chall').style.visibility='visible'
document.getElementById('resp').style.borderColor='red'
document.getElementById('noImg').style.display='inline-block'}
function statusGo(){document.getElementById('chall').style.visibility='hidden'
document.getElementById('resp').style.visibility='visible'
document.getElementById('resp').style.borderColor='gold'}
function statusWait(){document.getElementById('resp').style.borderColor='white'}
function matchQ(chall,resp){if(resp==chall)return true
return false}
function fmt(num,digits){digits=14;if(num==Number.POSITIVE_INFINITY)return "undefined";if(num==Number.NEGATIVE_INFINITY)return "undefined";num=num.toPrecision(digits);num=num.replace(/0+$/,"");if(num.charAt(num.length-1)==".")num=num.substr(0,num.length-1);if(Math.abs(num)<1e-15)num=0;return num;}
function checkKeyPressed(ev){var keyCode=ev.keyCode;if(keyCode>=96&&keyCode<=105){doKey((keyCode-96).toString());ev.preventDefault();}
if(keyCode>=48&&keyCode<=57){doKey((keyCode-48).toString());ev.preventDefault();}
if(keyCode==8||keyCode==46){if(my.resp.length>0){my.resp=my.resp.substr(0,my.resp.length-1);document.getElementById('resp').innerHTML=my.resp;}
ev.preventDefault();}
if(keyCode==9||keyCode==13||keyCode==32||keyCode==110){ev.preventDefault();}
if(my.isGameOver){my.resp='';}}
function doKey(c){if(my.waitForUserQ){statusGo()}else{if(!my.goQ)return}
if(c.charCodeAt(0)==8592){my.resp=my.resp.substring(0,my.resp.length-1);document.getElementById('resp').innerHTML=my.resp;}else{my.resp+=c;document.getElementById('resp').innerHTML=my.resp;check();}}