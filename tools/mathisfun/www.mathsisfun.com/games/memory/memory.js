var IMG_PATH="images/index.html";var imgBackside=new Image();var imgArrStartStop=new Array(4);var imgArrPlusMinus=new Array(4);var imgArrNumber=new Array(11);var bRunning=false;var nLevel=4;var nSeconds=0;var nAttempts=0;var nHit=0;var nSelected1=-1;var nSelected2=-1;var bShowCard=false;var IMG_START,IMG_STOP,IMG_PLUS,IMG_MINUS;var IMG_LEVEL,IMG_SEC,IMG_ATTEMPTS,IMG_HIT;var IMG_OFFSET,IMG_MODE,imgArrField,nImages,nSumImages;function loadImages(nPairs,nImageMode)
{IMG_MODE=nImageMode;nImages=nPairs;imgArrField=new Array(nImages*2);nSumImages=nImages*2+4+4+11;IMG_START=2+nImages*2;IMG_STOP=4+nImages*2;IMG_PLUS=12+nImages*2;IMG_MINUS=8+nImages*2;IMG_LEVEL=10+nImages*2;IMG_SEC=17+nImages*2;IMG_ATTEMPTS=25+nImages*2;IMG_HIT=33+nImages*2;if(document.images)
{imgBackside.src=IMG_PATH+"card.jpg";for(var i=0;i<4;i++)
{imgArrStartStop[i]=new Image();imgArrStartStop[i].src=IMG_PATH+"startstop"+(i+1)+".gif";}
for(var i=0;i<4;i++)
{imgArrPlusMinus[i]=new Image();imgArrPlusMinus[i].src=IMG_PATH+"plusminus"+(i+1)+".gif";}
for(var i=0;i<11;i++)
{imgArrNumber[i]=new Image();imgArrNumber[i].src=IMG_PATH+i+".gif";}
for(var i=0;i<nImages;i++)
{if(IMG_MODE==1)
{imgArrField[i*2]=new Image();imgArrField[i*2].src=IMG_PATH+"pic"+(i+1)+"a.jpg";imgArrField[i*2+1]=new Image();imgArrField[i*2+1].src=IMG_PATH+"pic"+(i+1)+"b.jpg";}
else
{IMG_MODE=0;imgArrField[i*2]=new Image();imgArrField[i*2].src=IMG_PATH+"pic"+(i+1)+".jpg";imgArrField[i*2+1]=new Image();imgArrField[i*2+1].src=IMG_PATH+"pic"+(i+1)+".jpg";}}
nLevel=4;nSeconds=0;nAttempts=0;nHit=0;searchFirstImage();clearField();updateAll();setTimeout("checkLoading()",1000)}}
function shuffle()
{if(document.images)
{var j=Math.floor(new Date().getSeconds()*Math.random()+60);for(var i=0;i<j;i++)
{n1=Math.round(Math.random()*(nImages*2-1));n2=Math.round(Math.random()*(nImages*2-1));img=imgArrField[n1];imgArrField[n1]=imgArrField[n2];imgArrField[n2]=img;}}}
function startGame()
{if(document.images)
{if(!bRunning)
{shuffle();clearField();nSeconds=0;nSelected1=-1;nSelected2=-1;nAttempts=0;nHit=0;id=setInterval("countSeconds()",1000)
bRunning=true;bShowCard=false;updateAll();}}}
function stopGame()
{if(document.images)
{if(bRunning)
{clearInterval(id);bRunning=false;updateAll();}}
return;}
function countSeconds()
{nSeconds++;showNumber(nSeconds,IMG_SEC+IMG_OFFSET,5);}
function showNumber(nNumber,nPosition,nCount)
{if(document.images)
{nNumber+="";while(nNumber.length<nCount)nNumber=" "+nNumber;for(var i=0;i<nCount;i++)
{var n=nNumber.charAt(i);if(n==" ")
{document.images[nPosition+i].src=imgArrNumber[10].src;}
else
{document.images[nPosition+i].src=imgArrNumber[n].src;}}}}
function clearField()
{if(document.images)
{for(var i=0;i<nImages*2;i++)
{document.images[i+IMG_OFFSET].src=imgBackside.src;}}}
function showCard(nImage)
{if(document.images)
{if(bRunning&&!bShowCard)
{if(nSelected1==-1||nSelected2==-1)
{if(document.images[nImage+IMG_OFFSET].src==imgBackside.src)
{document.images[nImage+IMG_OFFSET].src=imgArrField[nImage].src;if(nSelected1==-1)
{nSelected1=nImage;}
else
{nSelected2=nImage;}}}
if(nSelected1!=-1&&nSelected2!=-1)
{showNumber(++nAttempts,IMG_ATTEMPTS+IMG_OFFSET,5);var pic1=document.images[nSelected1+IMG_OFFSET].src;var len1=pic1.length;var pic2=document.images[nSelected2+IMG_OFFSET].src;var len2=pic2.length;if(pic1.substr(0,len1-IMG_MODE-4)==pic2.substr(0,len2-IMG_MODE-4))
{showNumber(++nHit,IMG_HIT+IMG_OFFSET,5);nSelected1=-1;nSelected2=-1;if(nHit==nImages)
{stopGame();nPoints=Math.round(100000*(nLevel+1)/nSeconds/nAttempts);strMsg="Well done, you solved it!\nYour score is "+nPoints+" points";alert(strMsg);}}
else
{bShowCard=true;setTimeout("clearCard()",2000-nLevel*200);}}}
else
{if(!bRunning)
{alert("Please press the start button !");}}}}
function clearCard()
{document.images[nSelected1+IMG_OFFSET].src=imgBackside.src;document.images[nSelected2+IMG_OFFSET].src=imgBackside.src;nSelected1=-1;nSelected2=-1;bShowCard=false;}
function setLevel(nValue)
{if(document.images&&!bRunning)
{nLevel+=nValue;if(nLevel<0)nLevel=0;if(nLevel>9)nLevel=9;showNumber(nLevel,IMG_LEVEL+IMG_OFFSET,1);}}
function updateAll()
{if(document.images)
{showNumber(nLevel,IMG_LEVEL+IMG_OFFSET,1);showNumber(nSeconds,IMG_SEC+IMG_OFFSET,5);showNumber(nAttempts,IMG_ATTEMPTS+IMG_OFFSET,5);showNumber(nHit,IMG_HIT+IMG_OFFSET,5);if(bRunning)
{document.images[IMG_START+IMG_OFFSET].src=imgArrStartStop[1].src;document.images[IMG_STOP+IMG_OFFSET].src=imgArrStartStop[2].src;document.images[IMG_PLUS+IMG_OFFSET].src=imgArrPlusMinus[1].src;document.images[IMG_MINUS+IMG_OFFSET].src=imgArrPlusMinus[3].src;}
else
{document.images[IMG_START+IMG_OFFSET].src=imgArrStartStop[0].src;document.images[IMG_STOP+IMG_OFFSET].src=imgArrStartStop[3].src;document.images[IMG_PLUS+IMG_OFFSET].src=imgArrPlusMinus[0].src;document.images[IMG_MINUS+IMG_OFFSET].src=imgArrPlusMinus[2].src;}}}
function strTrim(str)
{var strReturn="";for(var i=0;i<str.length;i++)
{if(str.charAt(i)!=" ")
{strReturn+=str.charAt(i);}}
return strReturn;}
function getY2kDate()
{var strReturn="";var d=new Date();var strDate=addLeadingZero(d.getDate(),2)+"."+addLeadingZero(d.getMonth()+1,2)+"."+getY2kYear(d);var strTime=addLeadingZero(d.getHours(),2)+":"+addLeadingZero(d.getMinutes(),2);strReturn=strDate+" "+strTime;return strReturn;}
function getY2kYear(d)
{var y=d.getYear();if(y<1970)
{return y+1900;}
else
{return y;}}
function addLeadingZero(value,nTotalLength)
{value+="";while(value.length<nTotalLength)value="0"+value;return value;}
function searchFirstImage()
{for(var i=0;i<document.images.length;i++)
{if(document.images[i].name=="memory_id")
{IMG_OFFSET=i+1;break;}}}
function countLoadedImages()
{var nCompleted=0;for(var i=0;i<2*nImages;i++)
{if(imgArrField[i].complete)
{nCompleted++;}}
for(var i=0;i<4;i++)
{if(imgArrStartStop[i].complete)
{nCompleted++;}}
for(var i=0;i<4;i++)
{if(imgArrPlusMinus[i].complete)
{nCompleted++;}}
for(var i=0;i<11;i++)
{if(imgArrNumber[i].complete)
{nCompleted++;}}
return nCompleted;}
function checkLoading()
{var nLoaded=countLoadedImages();if(nLoaded<nSumImages)
{document.images[IMG_OFFSET-1].width=456-(456/nSumImages*nLoaded);window.status=""+nLoaded+" of "+nSumImages+" pictures loaded";setTimeout("checkLoading()",250);}
else
{document.images[IMG_OFFSET-1].src=IMG_PATH+"blank.gif";document.images[IMG_OFFSET-1].width=5;window.status="";updateAll();}}