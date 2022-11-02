var w,h,my={};function randomwordsMain(mode){my.version='0.62';my.typ=typeof mode!=='undefined'?mode:'simple';w=450;h=250;var s='';s+='<div id="main" style="position:relative; width:'+w+'px; min-height:'+h+'px; background-color: #ffd; margin:auto; display:block; border: none; border-radius: 10px;">';s+='<div style="z-index:11;font: 14px Arial;">';s+="&nbsp;Type: ";s+=getDropdownHTML(['Simple','Vowel Needed','Frequency'],'typChg','typSel');s+='</div>';my.lens=[1,2,3,4,5,6,7,8];s+='<style>input[type="radio"]:checked+label {font-weight: bold;}</style>';s+=getRadioHTML('Length','len',my.lens,'lenChg');s+='<button id="goBtn" onclick="go();" style="" class="clickbtn" >Go</button>';s+='<textarea id="outp" style="width: 95%; height: 150px; text-align: left; border-radius: 10px; font: 14px Courier; color: #0000ff; background-color: #eeffee; " value=""></textarea>';s+='<div id="copyrt" style="font: 10px Arial; font-weight: bold; color: #6600cc; position:absolute; bottom:5px; left:5px; text-align:center;">&copy; 2019 MathsIsFun.com  v'+my.version+'</div>';s+='</div>';document.write(s);document.getElementById("len3").checked=true;my.len=my.lens[3];console.log("typ",my.typ);wordsLoad();go();}
function go(){wordsMake();}
function typChg(){var div=document.getElementById('typSel');my.typ=div.options[div.selectedIndex].text;my.typ=my.typ.toLowerCase();go();}
function lenChg(n){my.len=my.lens[n];go();}
function getRadioHTML(prompt,id,lbls,func){var s='';s+='<div style="display:inline-block; font:14px Arial; border: 1px solid white; border-radius:5px; padding:3px; margin:3px; background-color:rgba(255,255,255,0.5);">';s+=prompt+':';for(var i=0;i<lbls.length;i++){var idi=id+i;var lbl=lbls[i];s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl+'" onclick="'+func+'('+i+');">';s+='<label for="'+idi+'">'+lbl+' </label>';}
s+='</div>';return s;}
function getDropdownHTML(opts,funcName,id){var s='';s+='<select id="'+id+'" style="font: 15px Arial; color: #6600cc; background: rgba(200,220,256,0.7); padding: 1px; border-radius: 6px;" onchange="'+funcName+'()" autocomplete="off" >';for(var i=0;i<opts.length;i++){var idStr=id+i;var chkStr=i==0?'selected':'';s+='<option id="'+idStr+'" value="'+opts[i]+'" style="height:18px;" '+chkStr+' >'+opts[i]+'</option>';}
s+='</select>';return s;}
function wordsMake(){var s=''
var col=0;var i=0;while(i<40){switch(my.typ.toLowerCase()){case "simple":s=s+wordFilter(randomWord());break;case "vowel needed":s=s+wordFilter(randomWordVowel());break;case "frequency":s=s+wordFilter(randomWordFreq());break;default:}
s=s+" ";col=col+(my.len+1);if(50<col+my.len+1){col=0;s=s+"\n";}
i++;}
document.getElementById('outp').value=s;}
function randomWord(){var word="";var i=0;while(i<my.len){word=word+String.fromCharCode(97+randomInt(0,25));i++;}
return word;}
function randomWordVowel(){var word="";var hasVowelQ=false;var i=0;while(i<my.len){var letter=String.fromCharCode(97+randomInt(0,25));if(isVowel(letter)){hasVowelQ=true;}
word=word+letter;i++;}
if(hasVowelQ){return word;}
return randomWordVowel();}
function randomWordFreq(){var word="";var hasVowelQ=false;var i=0;while(i<my.len){var letter=String.fromCharCode(97+getFreq(my.freqs));if(isVowel(letter)){hasVowelQ=true;}
word=word+letter;i++;}
hasVowelQ=true;if(hasVowelQ){return word;}
return randomWordFreq();}
function wordFilter(word){if(my.rudeWords.indexOf(word)>=0){return "";}
return word;}
function isVowel(c){if(c=="a")return true;if(c=="e")return true;if(c=="i")return true;if(c=="o")return true;if(c=="u")return true;return false;}
function getFreq(freqs){var Count=0;var i=0;while(i<freqs.length){Count=Count+freqs[i];i++;}
var Spot=randomInt(0,Count-1);var Stt=0;var i=0;while(i<freqs.length){Stt=Stt+freqs[i];if(Spot<Stt){return i;}
i++;}
return 0;}
function wordsLoad(){my.rudeWords=["fuck","shit","bugger","arse","ass","bitch","crap","cunt","dick","nigger","penis","vagina","twat","wank","anus","poo","pussy","willy","piss","tits","sucks","cock","sex","rape","suck"];my.freqs=[82,15,28,42,127,22,20,61,70,2,8,40,24,67,75,19,1,60,63,90,27,10,24,2,20,1];}
function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}