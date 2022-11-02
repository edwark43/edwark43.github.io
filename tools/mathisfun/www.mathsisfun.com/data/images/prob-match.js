var w,h,my={};function probmatchMain(){var version='0.61';w=440;h=180;my.opts={popN:30,choiceN:365}
var s='';s+='<style>'
s+='.btn { display: inline-block; position: relative; text-align: center; margin: 2px; text-decoration: none; font: bold 14px/25px Arial, '
s+='sans-serif; color: #268; border: 1px solid #88aaff; border-radius: 10px;cursor: pointer; background: linear-gradient(to top right, rgba(170,190,255,1) 0%, rgba(255,255,255,1) 100%); outline-style:none;}'
s+='.btn:hover { background: linear-gradient(to top, rgba(255,255,0,1) 0%, rgba(255,255,255,1) 100%); }'
s+='.yy { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(255,220,130,1) 0%, rgba(255,255,255,1) 100%);  }'
s+='.hi { border: solid 2px #eeeeaa; background: linear-gradient(to top, rgba(130,220,255,1) 0%, rgba(255,255,255,1) 100%); box-shadow: 2px 2px 6px #66a; }'
s+='.lo { border: solid 1px #888888; background: linear-gradient(to top, rgba(170,170,170,1) 0%, rgba(205,205,205,1) 100%);  }'
s+='</style>'
s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: white; margin:auto; display:block; border: 1px solid blue; border-radius: 10px;">';s+='<div style="display: block; margin: 2px 30px 2px 0;" >';s+='<div style="display: inline-block; width: 190px; margin: 0 10px 0 0;  font: 18px arial; color: black; text-align: right;">Population: </div>';s+='<input type="text" id="popN" style="display: inline-block; width: 150px; color: black; text-align:center; padding: 3px; background-color: #eeffee; font: bold 17px Arial;  border-radius: 10px;" value="" />';s+='</div>';s+='<div style="display: block; margin: 2px 30px 2px 0;" >';s+='<div style="display: inline-block; width: 190px; margin: 0 10px 0 0;  font: 18px arial; color: black; text-align: right;">Available Choices: </div>';s+='<input type="text" id="choiceN" style="display: inline-block; width: 150px; color: black; text-align:center; padding: 3px; background-color: #eeffee; font: bold 17px Arial;  border-radius: 10px;" value="" />';s+='</div>';s+='<div style="display: block; text-align: center; margin: 2px 30px 2px 0;" >';s+='<button id="newBtn" type="button" style="z-index:2;" class="btn"  onclick="doIt()">Go</button>';s+='</div>'
s+='<div style="display: block; text-align: center; margin: auto;" >';s+='<textarea id="list" style="width:90%; height: 200px;"></textarea>'
s+='</div>'
s+='<div style="font: 11px Arial; color: #6600cc; margin-left:10px;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);document.getElementById('choiceN').value=optGet('choiceN')
document.getElementById('popN').value=optGet('popN')}
function doIt(){var listLen=1000
var popN=parseInt(document.getElementById('popN').value)
if(isNaN(popN))popN=0
optSet('popN',popN)
var choiceN=parseInt(document.getElementById('choiceN').value)
if(isNaN(choiceN))choiceN=0
optSet('choiceN',choiceN)
var s=''
if(isNaN(popN)||popN<1||popN>100||choiceN<1||choiceN>1000){s='choose a population between 1 and 100, and choices between 1 and 1000'}else{var res=listGet(listLen,popN,choiceN)
s+='Population: '+popN+', Available Choices: '+choiceN
s+='\n'
s+='Number of trials: '+listLen
s+='\n'
s+='\n'
s+='Has Matches = '+res.dupN+'/'+listLen+' = '+res.dupN/listLen
s+='\n'
s+='\n'
s+=res.s}
document.getElementById('list').value=s}
function listGet(listLen,popN,choiceN){var dupN=0
var s=''
for(var i=0;i<listLen;i++){var nums=[]
var dupQ=false
for(var j=0;j<popN;j++){var num=randomInt(1,choiceN)
if(j>0)s+=','
s+=num.toString()
for(var k=0;k<nums.length;k++){if(num==nums[k])dupQ=true}
nums.push(num)}
if(dupQ)dupN++
s+=' : '+dupQ
s+='\n'}
return{dupN:dupN,s:s}}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}
function optGet(name){var val=localStorage.getItem(`probmatch.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`probmatch.${name}`,val)
my.opts[name]=val}