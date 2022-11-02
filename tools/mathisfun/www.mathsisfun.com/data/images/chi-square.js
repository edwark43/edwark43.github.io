var my={}
function chisquareMain(){var version='0.65';var wd=450;my.rows=[2,2];my.cols=[2,2];var s="";s+='<div style="position:relative; width:'+wd+'px; border-radius: 10px; display:block; background-color: #ddeeff; margin:auto; ">';s+='<div id="title'+i+'" style="padding:10px; font: bold 22px Arial; text-align: center; color: darkblue; ">Chi-Square Calculator</div>';for(var i=0;i<1;i++){s+='<div style="display: inline-block; min-height:180px; min-width:250px; vertical-align: top; position: relative;">';s+='<input type="range" id="sr'+i+'" value="3" min="2" max="10" step="1" style="position:absolute; left:-72px; top:79px;  height:17px; width:150px; border: none; transform: rotate(90deg); margin-left: 10px;z-index:2; " oninput="chgDim('+i+',0,this.value)" onchange="chgDim('+i+',0,this.value)" />';s+='<input type="range" id="sc'+i+'" value="3" min="2" max="10" step="1" style=" position:absolute; left:8px; top:0px;  height:17px; width:150px; border: none; margin-left: 10px;z-index:2;" oninput="chgDim('+i+',1,this.value)" onchange="chgDim('+i+',1,this.value)" />';s+='<div id="mat'+i+'" style="margin: 25px 5px 5px 30px; text-align: left;"></div>';s+='</div>';}
s+='<div style="display: inline-block; width: 100px; margin: 0 10px 0 0;  font: bold 18px arial; color: black;">or';s+='<textarea id="outTxt" style="margin:auto; width:180px; height:100px; font: 16px Arial; text-align: left; color: darkblue; border: 1px solid blue;" onkeyup="parseNGo()" onchange="parseNGo()" ></textarea>';s+='</div>';s+='<div style="display: block; margin: 2px 30px 2px 0;" >';s+='<div style="display: inline-block; width: 190px; margin: 0 10px 0 0;  font: 18px arial; color: black; text-align: right;">Chi-Square: </div>';s+='<input type="text" id="chi2" style="display: inline-block; width: 150px; color: black; text-align:center; padding: 3px; background-color: #eeffee; font: bold 17px Arial;  border-radius: 10px;" value="" onKeyUp="chiChg()" />';s+='</div>';s+='<div style="display: block; margin: 2px 30px 2px 0;" >';s+='<div style="display: inline-block; width: 190px; margin: 0 10px 0 0;  font: 18px arial; color: black; text-align: right;">Degrees of Freedom: </div>';s+='<input type="text" id="df" style="display: inline-block; width: 150px; color: black; text-align:center; padding: 3px; background-color: #eeffee; font: bold 17px Arial;  border-radius: 10px;" value="" onKeyUp="chiChg()" />';s+='</div>';s+='<div style="display: block; margin: 2px 30px 2px 0;" >';s+='<div style="display: inline-block; width: 190px; margin: 0 10px 0 0; font: 18px arial; color: black; text-align: right; ">p: </div>';s+='<div id="pval" style="display: inline-block; width: 147px; color: black; text-align:center; padding: 6px; background-color: white; font: bold 17px Arial; border: 2px solid lightblue; border-radius: 10px;"></div>';s+='</div>';s+='<div id="result" style="display: block; width: 92%; margin: auto; padding: 6px; background-color: white; border: 2px solid lightblue; border-radius: 10px; font: 16px arial; color: #6600cc; text-align: left;"></div>';s+='<div style="margin: 10px"></div>';s+='<div style="font: 11px arial; color: #6600cc;">&copy; 2020 MathsIsFun.com  v'+version+'</div>';s+='</div>';document.write(s);this.isDirtyQ=false;this.resultMat=null;resize(0,2,2);document.getElementById('outTxt').value='209 280\n225 248';parseToA();go();}
function chiTable(){var ps=[0.995,0.99,0.975,0.95,0.9,0.5,0.2,0.1,0.05,0.025,0.02,0.01,0.005,0.002,0.001];var s=''
s+='<table border="1">'
for(var i=0;i<=50;i++){s+='\n<tr>'
s+='<th>'
s+=i
s+='</th>'
for(var j=0;j<ps.length;j++){var p=ps[j];if(i==0){s+='<th>'
s+=p
s+='</th>'}else{s+='<td>'
var chi=critchi(p,i)
if(chi<0.02){s+=chi.toPrecision(3)}else{s+=chi.toFixed(3)}
s+='</td>'}}
s+='\n</tr>'}
s+='\n</table>'
console.log('s',s)}
function cellChg(){console.log("cellChg");document.getElementById('outTxt').value=getMat(0).getFmt();go();}
function chiChg(){var s='';var chi2=document.getElementById('chi2').value;s+='Chi-Squared = '+chi2;s+='<br>';s+='<br>';var df=document.getElementById('df').value;s+='Degrees of Freedom = '+df;s+='<br>';s+='<br>';var p=pochisq(chi2,df);s+='p = '+fmtNum(p,6);document.getElementById('pval').innerHTML=fmtNum(p,4);document.getElementById('result').innerHTML=s;}
function go(){var s='';var A=getMat(0);s+='Actual Values:<br>';s+=A.getHTML();s+='<br>';s+='<br>';if(!A.isMinQ(5)){s+="Warning: Actual Value less than 5.";s+='<br>';s+="Results not reliable.";s+='<br>';s+='<br>';}
var E=A.expected();s+='Expected Values:<br>';s+=E.getHTML();s+='<br>';s+='<br>';var Chi=A.chiSquare(E);s+='Chi-Squared Values:<br>';s+=Chi.getHTML();s+='<br>';s+='<br>';var chi2=Chi.addCells();s+='Chi-Square = '+fmtNum(chi2,6);s+='<br>';s+='<br>';var df=(A.getRows()-1)*(A.getCols()-1);s+='Degrees of Freedom = '+df;s+='<br>';s+='<br>';var p=pochisq(chi2,df);s+='p = '+fmtNum(p,6);document.getElementById('chi2').value=fmtNum(chi2,6);document.getElementById('df').value=df;document.getElementById('pval').innerHTML=fmtNum(p,4);document.getElementById('result').innerHTML=s;}
function parseNGo(){parseToA();go();}
function msg(s){document.getElementById('msg').innerHTML=s;}
function getMat(n){var B=new Matrix(my.rows[n],my.cols[n]);for(var i=0;i<my.rows[n];i++){for(var j=0;j<my.cols[n];j++){var id=n+'_'+i+'_'+j;if(document.getElementById(id)!=null)
B.setEntry(i,j,document.getElementById(id).value);}}
return(B);}
function setMat(n,A){var nr=A.getRows();var nc=A.getCols();for(var i=0;i<nr;i++){for(var j=0;j<nc;j++){var id=n+'_'+i+'_'+j;if(document.getElementById(id)!=null)
document.getElementById(id).value=A.getEntry(i,j);}}}
function chgDim(mat,dirn,n){console.log("chgDim",mat,dirn,n);if(dirn==0)my.rows[mat]=n;if(dirn==1)my.cols[mat]=n;var C=getMat(mat);document.getElementById('mat'+mat).innerHTML=getMatHTML(mat,my.rows[mat],my.cols[mat]);setMat(mat,C);}
function resize(n,r,c){var C=getMat(n);my.rows[n]=r;my.cols[n]=c;document.getElementById('sr'+n).value=r;document.getElementById('sc'+n).value=c;document.getElementById('mat'+n).innerHTML=getMatHTML(n,my.rows[n],my.cols[n]);setMat(n,C);}
function getMatHTML(mat,m,n){var s='';for(var i=0;i<m;i++){for(var j=0;j<n;j++){var id=mat+'_'+i+'_'+j;s+='<input type="text" id="'+id+'" style="color: #0000ff; background-color: #eeffee; text-align:center; font: 15px Arial; width:50px; border-radius: 10px; " value="" onKeyUp="cellChg()" />';}
s+='<br>';}
return s;}
function Matrix(r,c){this.nrows=r;this.ncols=c;this.mat=[];this.initMe();}
Matrix.prototype.initMe=function(){for(var i=0;i<this.nrows;i++){this.mat[i]=[];for(var j=0;j<this.ncols;j++){this.mat[i].push(0);}}};Matrix.prototype.getRows=function(){return(this.nrows);};Matrix.prototype.getCols=function(){return(this.ncols);};Matrix.prototype.getEntry=function(row,col){return(this.mat[row][col]);};Matrix.prototype.setEntry=function(row,col,val){if(row<this.nrows&&col<this.ncols){this.mat[row][col]=Number(val);}};Matrix.prototype.isMinQ=function(v){for(var i=0;i<this.nrows;i++){for(var j=0;j<this.ncols;j++){if(this.mat[i][j]<v)return false;}}
return true;};Matrix.prototype.expected=function(){var rt=[];var ct=[];var ot=0;for(var i=0;i<this.nrows;i++){rt[i]=0;}
for(var j=0;j<this.ncols;j++){ct[j]=0;}
for(var i=0;i<this.nrows;i++){for(var j=0;j<this.ncols;j++){rt[i]+=this.mat[i][j];ct[j]+=this.mat[i][j];ot+=this.mat[i][j];}}
var B=new Matrix(this.nrows,this.ncols);for(var i=0;i<this.nrows;i++){for(var j=0;j<this.ncols;j++){B.mat[i][j]=rt[i]*ct[j]/ot;}}
return B;};Matrix.prototype.chiSquare=function(E){var Chi=new Matrix(this.nrows,this.ncols);for(var i=0;i<this.nrows;i++){for(var j=0;j<this.ncols;j++){var diff=this.mat[i][j]-E.mat[i][j];Chi.mat[i][j]=diff*diff/E.mat[i][j];}}
return Chi;};Matrix.prototype.addCells=function(){var tot=0;for(var i=0;i<this.nrows;i++){for(var j=0;j<this.ncols;j++){tot+=this.mat[i][j];}}
return tot;};Matrix.prototype.getFmt=function(){var s="";for(var i=0;i<this.nrows;i++){if(i>0)s+="\n";for(var j=0;j<this.ncols;j++){var v=this.getEntry(i,j).toPrecision(15);v=fmtNum(v,15);s+=v;s+=" ";}}
return(s);};Matrix.prototype.getHTML=function(){var s="";for(var i=0;i<this.nrows;i++){if(i>0)s+="<br>";for(var j=0;j<this.ncols;j++){var v=this.getEntry(i,j).toPrecision(7);v=fmtNum(v,6);s+=v;s+=" ";}}
return(s);};Matrix.prototype.parse=function(s){var lines=s.split("\n");this.nrows=lines.length;for(var i=0;i<lines.length;i++){var line=lines[i];line=line.trim();line=line.replace(/\s*\,\s*/g,",");line=line.replace(/\s+/g,",");var vals=line.split(",");if(i==0){this.ncols=vals.length;this.initMe();}
for(var j=0;j<vals.length;j++){this.setEntry(i,j,vals[j]);}}};function parseToA(){var C=new Matrix();C.parse(document.getElementById('outTxt').value);resize(0,C.getRows(),C.getCols());setMat(0,C);return false;}
function poz(z){var y,x,w;var Z_MAX=6.0;if(z==0.0){x=0.0;}else{y=0.5*Math.abs(z);if(y>=(Z_MAX*0.5)){x=1.0;}else if(y<1.0){w=y*y;x=((((((((0.000124818987*w-
0.001075204047)*w+0.005198775019)*w-
0.019198292004)*w+0.059054035642)*w-
0.151968751364)*w+0.319152932694)*w-
0.531923007300)*w+0.797884560593)*y*2.0;}else{y-=2.0;x=(((((((((((((-0.000045255659*y+
0.000152529290)*y-0.000019538132)*y-
0.000676904986)*y+0.001390604284)*y-
0.000794620820)*y-0.002034254874)*y+
0.006549791214)*y-0.010557625006)*y+
0.011630447319)*y-0.009279453341)*y+
0.005353579108)*y-0.002141268741)*y+
0.000535310849)*y+0.999936657524;}}
return z>0.0?((x+1.0)*0.5):((1.0-x)*0.5);}
var BIGX=20.0;function ex(x){return(x<-BIGX)?0.0:Math.exp(x);}
function pochisq(x,df){var a,y,s;var e,c,z;var even;var LOG_SQRT_PI=0.5723649429247000870717135;var I_SQRT_PI=0.5641895835477562869480795;if(x<=0.0||df<1){return 1.0;}
a=0.5*x;even=!(df&1);if(df>1){y=ex(-a);}
s=(even?y:(2.0*poz(-Math.sqrt(x))));if(df>2){x=0.5*(df-1.0);z=(even?1.0:0.5);if(a>BIGX){e=(even?0.0:LOG_SQRT_PI);c=Math.log(a);while(z<=x){e=Math.log(z)+e;s+=ex(c*z-a-e);z+=1.0;}
return s;}else{e=(even?1.0:(I_SQRT_PI/Math.sqrt(a)));c=0.0;while(z<=x){e=e*(a/z);c=c+e;z+=1.0;}
return c*y+s;}}else{return s;}}
function critchi(p,df){var CHI_EPSILON=0.000001;var CHI_MAX=99999.0;var minchisq=0.0;var maxchisq=CHI_MAX;var chisqval;if(p<=0.0){return maxchisq;}else{if(p>=1.0){return 0.0;}}
chisqval=df/Math.sqrt(p);while((maxchisq-minchisq)>CHI_EPSILON){if(pochisq(chisqval,df)<p){maxchisq=chisqval;}else{minchisq=chisqval;}
chisqval=(maxchisq+minchisq)*0.5;}
return chisqval;}
function fmtNum(v,digs){var s=(+v).toPrecision(digs);if(s.indexOf(".")>0&&s.indexOf('e')<0){s=s.replace(/0+$/,'');}
if(s.charAt(s.length-1)=='.'){s=s.substr(0,s.length-1);}
return s;}