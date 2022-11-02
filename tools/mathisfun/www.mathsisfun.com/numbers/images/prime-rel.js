var w,h,numLeft,my={};function primerelMain(){my.version='0.93';w=540;h=180;my.MAX=9007199254740991;my.lowPrimes=[];loadLowPrimes();my.lowPrimeN=100;console.log("my.lowPrimes.length",my.lowPrimes.length);var s=''
s+='<div style="position:relative; max-width:'+w+'px; border: none; border-radius: 20px; background-color: #eeeeff; margin:auto; display:block;">'
s+='<br>'
my.inputMax=2
var stts=[12,35]
for(var i=0;i<my.inputMax;i++){var ltr=String.fromCharCode(65+i)
s+='<div style=" text-align:center;">'
s+='<span style="font: bold 16px Arial; color: #000000;">Number '+ltr+': </span>'
s+='<input type="text" id="inp'+i+'" style="font-size: 19px; color: #0000ff; background-color: #f0f8ff; text-align:center; border-radius: 10px; margin-right:60px; " value="'+stts[i]+'" onkeyup="go(0)" />'
s+='</div>'}
for(var i=0;i<my.inputMax;i++){var ltr=String.fromCharCode(65+i)
s+='<div style="font: 14px arial; color: #000000; margin:5px 0 0 5px;">Factors of '+ltr+': </div>'
s+='<div id="out'+i+'" style="background-color: #ffffff; max-height: 100px; overflow: auto; font: 20px arial; text-align:center; border: 1px solid black; padding: 2px; margin:5px; ">&nbsp;</div>'}
s+='<div style="font: 14px arial; color: #000000; margin:15px 0 0 5px;">Result: </div>'
s+='<div id="ansText" style="background-color: #ffffff; max-height: 100px; overflow: auto; font: 20px arial; text-align:center; border: 1px solid black; padding: 2px; margin:5px; ">&nbsp;</div>'
s+='<div id="copyrt" style="font: 11px arial; color: #6600cc; text-align:left;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>'
s+='</div>'
document.write(s);go(0);}
function go(typ){var inps=[]
for(var i=0;i<my.inputMax;i++){var inp={val:0,facts:[]}
inps.push(inp)
document.getElementById("out"+i).innerHTML="&nbsp;";var nStr=document.getElementById("inp"+i).value
var nStrWas=nStr;nStr=nStr.replace(/[^0-9]/g,'');if(nStr!=nStrWas){document.getElementById("inp"+i).value=nStr}
if(nStr.length==0){continue}
if(nStr=="0"){document.getElementById("inp"+i).value='';continue}
var n=parseInt(nStr);if(n<2||n>my.MAX){continue}
inp.val=n
var facts=getFactors(n);inp.facts=facts
var s="&nbsp;";}
console.log('inps',inps)
if(inps[0].facts.length==0||inps[1].facts.length==0){document.getElementById("ansText").innerHTML="Please enter numbers between 2 and  "+my.MAX
return}
var aFacts=inps[0].facts
var bFacts=inps[1].facts
var bPos=0
var aFounds=inps[0].facts.slice()
var bFounds=inps[1].facts.slice()
var bothFacts=[]
for(var i=0;i<aFacts.length;i++){for(var j=bPos;j<bFacts.length;j++){if(aFacts[i]==bFacts[j]){aFounds[i]='<b>'+aFounds[i]+'</b>'
bFounds[j]='<b>'+bFounds[j]+'</b>'
bPos=j+1
bothFacts.push(aFacts[i]);break}}}
console.log('bothFacts',aFounds,bFounds,bothFacts)
outFmt(inps[0].val,0,aFounds)
outFmt(inps[1].val,1,bFounds)
var s=''
if(bothFacts.length==0){s+='No shared factors<br><br>They are <b>coprime</b>'}else{s+='Shared factors: <b>'+arrayFmt(bothFacts)+'</b>'
if(bothFacts.length>1){var prod=1
for(var i=0;i<bothFacts.length;i++){prod*=bothFacts[i]}
s+=' = '+prod}
s+='<br>'
s+='<br>'
s+='They are <b>not coprime</b>'}
document.getElementById("ansText").innerHTML=s;}
function outFmt(n,idx,facts){var s=''
if(facts.length==1){s=n+' is a Prime Number';}else{s=n+' = '+arrayFmt(facts)}
document.getElementById("out"+idx).innerHTML=s}
function getExpFactors(F){var FP=[[F[0],1]];var n=0;for(var i=1;i<F.length;i++){if(F[i]==FP[n][0]){FP[n][1]++;}else{n++;FP[n]=[F[i],1];}}
return FP;}
function getFactors(TheNum){my.FArr=[];if(TheNum>my.MAX){return my.FArr;}
numLeft=TheNum;if(numLeft==0||numLeft==1){return my.FArr;}else{var doneQ=false;for(var p=0;p<my.lowPrimeN;p++){if(!testFact(my.lowPrimes[p])){doneQ=true;break;}}
if(!doneQ){var fact=(((my.lowPrimes[p-1]+5)/6)<<0)*6-1;while(true){if(!testFact(fact))break;fact+=2;if(!testFact(fact))break;fact+=4;}}
if(numLeft!=1)addFact(numLeft,1);}
return my.FArr;}
function testFact(fact){var power=0;while(numLeft%fact==0){power++;numLeft=numLeft/fact;}
if(power!=0){addFact(fact,power);}
return numLeft/fact>fact;}
function addFact(fact,power){for(var i=0;i<power;i++){my.FArr.push(fact);}}
function arrayFmt(P){var s="";for(var i=0;i<P.length;i++){if(i>0)
s+=" &times; ";s+=P[i];}
return s;}
function expArrayFmt(P){var s="";for(var i=0;i<P.length;i++){if(i>0)
s+=" &times; ";s+=P[i][0];if(P[i][1]>1)
s+='<sup>'+P[i][1]+'</sup>';}
return s;}
function loadLowPrimes(){my.lowPrimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997,1009,1013,1019,1021,1031,1033,1039];}