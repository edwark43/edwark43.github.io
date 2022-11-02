function initVideo(id){if(navigator.appName=="Microsoft Internet Explorer")window.onresize=resizeVideo;title=document.getElementById("title").innerHTML;s='';s+='<div class="centerfull" style="clear:both; font-weight:400; padding: 3px 0 5px 0;">';s+='<div style="float:left; width:60px; text-align:left;">';s+='  <a href="javascript:doVideo(\''+id+'\')">';s+='    <img src="images/style/video2.gif" alt="Video" width="75" height="33" style="vertical-align:middle; border:none;" />';s+=' </a>';s+='</div>';s+='<div style="float:right; width:60px; text-align:right;">&nbsp;</div>';s+='  <div style="margin:0 auto;">';s+='    <h1 align="center">'+title+'</h1>';s+='  </div>';s+='</div>';document.getElementById("title").innerHTML=s;}
function doVideo(id){var s="";if(!videoQ){s+='<div class="center">';s+='<iframe id="v1" src="http://www.youtube.com/embed/'+id+'?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>';s+='</div>';}else{var frame=document.getElementById("v1");frame.parentNode.removeChild(frame);}
videoQ=!videoQ;var vid=document.getElementById("video");vid.innerHTML=s;if(videoQ)resizeVideo();if(videoQ){var pg=id;var pgHex='';for(var i=0;i<pg.length;i++){pgHex+=''+pg.charCodeAt(i).toString(16);}
addView(pgHex,"View",window.location.hostname);}}
function resizeVideo(){var v1=document.getElementById("v1");var wd=window.innerWidth-40;if(wd>640)wd=640;v1.style.width=wd+"px";v1.style.height=(wd*(340/640)+80)+"px";}
function addView(pg,viewtype,hostname){var xmlHttp;try{xmlHttp=new XMLHttpRequest();}
catch(e){try{xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");}
catch(e){try{xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");}
catch(e){return false;}}}
xmlHttp.onreadystatechange=function(){if(xmlHttp.readyState==4){if(Boolean(xmlHttp.responseText)){}else{}}}
params="type="+viewtype;params+="&pg="+encodeURIComponent(pg);if(hostname=="faith"){xmlHttp.open("POST.html","http://faith/mathopolis/links/update.php",false);}else{xmlHttp.open("POST.html","http://www.mathopolis.com/links/update.php",false);}
xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");xmlHttp.setRequestHeader("Content-length",params.length);xmlHttp.setRequestHeader("Connection","close");xmlHttp.send(params);return false;}
videoQ=false;