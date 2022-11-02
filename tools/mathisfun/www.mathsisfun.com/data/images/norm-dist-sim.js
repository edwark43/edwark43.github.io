var w,h,my={};function normdistsimMain(){var version='0.90';w=360;var s='';s+='<div style="position:relative; width:'+w+'px; border-radius: 10px; margin:auto; display:block;  background-color: #e0f8ff;">';my.inputTyps=[['Mean and SD',0],['Raw Data',0]];my.inputs=[['tMean','True Mean',70,''],['tSD','True Standard Deviation',5,''],['uN','How Many in Sample',30,''],['raw','Sample Data','','raw'],['uMean','Sample Mean',70,''],['uSD','Sample Standard Deviation',5,''],['lev','Confidence Level','','levs']];my.levs=[['80%',1.28155],['85%',1.43953],['90%',1.64485],['95%',1.95996],['99%',2.57583],['99.5%',2.80703],['99.9%',3.29053]];s+='<div style="margin: 10px 0 10px 0; text-align: right; z-index:3;">';for(var i=0;i<my.inputs.length;i++){var v=my.inputs[i];s+='<div style="border: none; padding:5px; z-index:3;">';switch(v[3]){case 'raw':s+='<div style="margin: 1px 0 10px 0; text-align: center; background-color:lightblue; border-radius: 10px; ">';s+='<button id="optBtn" type="button" style="z-index:2;" class="togglebtn" onclick="go()">Generate</button>'
s+='<div style="display: inline-block; text-align:left; font: 15px Verdana;">&nbsp;'+v[1]+': &nbsp;</div>';s+='<div id="raw">';s+='<textarea id="numbers" style="width:95%; height:125px; background-color: #eeffee; text-align:left; font: 15px Arial; border-radius: 10px; color:blue;" value="" onkeyup="go(0)"></textarea>';s+='</div>';s+='</div>';s+='<div style="width:100%; text-align:left; font: italic 15px Verdana;">Leads us to: &nbsp;</div>';break;case '':s+='<div style="display: inline-block; text-align:left; font: 15px Verdana;">'+v[1]+':&nbsp;</div>';s+='<input type="text" id="'+v[0]+'" style="color: #0000ff; background-color: #eeffee; text-align:center; font-size: 16px; width:120px; border-radius: 10px; " value="'+v[2]+'" onKeyUp="go()" />';break;case 'levs':s+='<div style="display: inline-block; text-align:left; font: 15px Verdana;">'+v[1]+': &nbsp;</div>';s+=getDropdownHTML(my.levs,'go()',v[0]);break;default:}
s+='</div>';}
s+='</div>';s+='<div id="result" style="margin: 5px; font: 15px Verdana; background-color: white; border: 1px solid black; border-radius: 10px; text-align: center;"></div>';s+='<div id="copyrt" style="font: 11px Arial; color: blue; ">&copy; 2019 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);my.nMin=30;document.getElementById("lev").selectedIndex=3;var nums=[106.81782,69.84,70,0.001,1.001,1e-15,1e-16]
for(var i=0;i<nums.length;i++){}
go();}
function go(){document.getElementById('numbers').value=''
document.getElementById('result').innerHTML=''
document.getElementById('uMean').value=''
document.getElementById('uSD').value=''
var mean=parseFloat(document.getElementById("tMean").value);var sd=parseFloat(document.getElementById("tSD").value);var n=parseFloat(document.getElementById("uN").value);if(isNaN(n))return
if(n<2)return
if(n>10000){n=10000
document.getElementById("uN").value=n}
console.log('go',mean,sd,n)
var values=[]
for(var i=0;i<n;++i){var val=gaussianRandAdj(mean,sd);val=val.toPrecision(4)
values.push(val)}
console.log('values',values)
if(true){}
document.getElementById('numbers').value=values.join(', ')
var min=Infinity;var max=-Infinity;for(var i=0;i<n;++i){min=Math.min(min,values[i]);max=Math.max(max,values[i]);}
var range=max-min;var fcount=10
var finals=new Array(fcount+1).fill(0);for(var i=0;i<n;++i){var value=values[i];value=(value-min)/range
value=Math.trunc(value*fcount);finals[value]+=1;}
var maxOccurences=0;for(var i=0;i<finals.length;++i){maxOccurences=Math.max(maxOccurences,finals[i]);}
var nums=numsParse('numbers')
var stats=stdDevCalc(nums);var lev=document.getElementById("lev").selectedIndex;var confSD=my.levs[lev][1];var s=wuzzle(n,stats.mean,stats.sd,lev,confSD)
console.log('',s)
document.getElementById('result').innerHTML=s;}
function wuzzle(n,mean,sd,lev,confSD){var ciFull=confSD*(sd/Math.sqrt(n));var ci=Number(fmt(ciFull,3));var lo=fmt(mean-ci,3);var hi=fmt(mean+ci,3);console.log("calculate",n,mean,sd,lev,ci,lo,hi);var s='';if(n<my.nMin){s+='Warning: sample size is less than '+my.nMin+', you should use the POPULATION standard deviation.<br><br>'}
s+='<b>'+my.levs[lev][0]+' Confidence Interval: '+fmt(mean,3)+' &plusmn; '+fmt(ciFull,3)+'</b>';s+='<br>('+lo+' to '+hi+')';s+='<br>';var only=(n<my.nMin)?'only ':'';s+='<br>"With '+my.levs[lev][0]+' confidence the population mean is between '+lo+' and '+hi+', based on '+only+n+' samples."';s+='<br>';s+='<br>Short Styles:';s+='<br>'+fmt(mean,3)+' ('+my.levs[lev][0]+' CI '+lo+' to '+hi+')';s+='<br>'+fmt(mean,3)+', '+my.levs[lev][0]+' CI ['+lo+', '+hi+']';s+='<br>';s+='<br>Margin of Error: '+ci;s+='<br>(to more digits: '+fmt(ciFull,4)+')';s+='<br>';s+='<br>Sample Size: '+n;s+='<br>Sample Mean: '+fmt(mean,4);s+='<br>Standard Deviation: '+fmt(sd,4);s+='<br>Confidence Level: '+my.levs[lev][0];return s}
function getDropdownHTML(opts,funcName,id){var s='';s+='<select id="'+id+'" onclick="'+funcName+'" style="width:125px; text-align: center; font: 16px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px;line-height:30px;">';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==99?'checked':'';s+='<option id="'+idStr+'" value="'+opts[i][0]+'" style="height:21px;" '+chkStr+' >'+opts[i][0]+'</option>';}
s+='</select>';return s;}
function numsParse(divName){var div=document.getElementById(divName);var nStr=div.value;nStr=nStr.replace(/[^0-9, e\-\.]+/g,'');div.value=nStr;var nSplit=nStr.split(',');var nums=[];for(var i=0,len=nSplit.length;i<len;i++){if(isNumeric(nSplit[i])){nums.push(+nSplit[i]);}}
return nums}
function stdDevCalc(nums){var sum=0;for(var i=0,len=nums.length;i<len;i++){sum+=nums[i];}
var count=nums.length;document.getElementById('uN').value=count.toString();var mean=sum/count;document.getElementById('uMean').value=fmt(mean,3);var diffs=[];var diff2s=[];var sumdiff2s=0;for(i=0,len=nums.length;i<len;i++){diffs[i]=fmtNum(+nums[i]-mean);diff2s[i]=fmtNum(diffs[i]*diffs[i]);sumdiff2s+=+diff2s[i];}
var variance=sumdiff2s/(count-1);var sd=Math.sqrt(variance);document.getElementById('uSD').value=fmt(sd,3);console.log("uSD",document.getElementById('uSD').value);return{count:count,mean:mean,variance:variance,sd:sd}}
function isNumeric(n){return!isNaN(parseFloat(n))&&isFinite(n);}
function fmtNum(v){var s=(+v).toPrecision(10);if(s.indexOf(".")>0&&s.indexOf('e')<0){s=s.replace(/0+$/,'');}
if(s.charAt(s.length-1)=='.'){s=s.substr(0,s.length-1);}
return s;}
function fmt(num,digits){digits=typeof digits!=='undefined'?digits:4
if(num==Number.POSITIVE_INFINITY)return "undefined";if(num==Number.NEGATIVE_INFINITY)return "undefined";num=Number(num.toPrecision(digits));if(Math.abs(num)<1e-15)num=0;return num;}
function gaussianRand(){this.generate=true;this.value0=0.0;this.value1=0.0;var result
if(this.generate){var x1=0.0;var x2=0.0;var w=0.0;do{x1=(2.0*Math.random())-1.0;x2=(2.0*Math.random())-1.0;w=(x1*x1)+(x2*x2);}while(w>=1.0);w=Math.sqrt((-2.0*Math.log(w))/w);this.value0=x1*w;this.value1=x2*w;result=this.value0;}else{result=this.value1;}
this.generate=!this.generate
return result;}
function gaussianRandAdj(mean,stddev){var value=gaussianRand();return((value*stddev)+mean);}