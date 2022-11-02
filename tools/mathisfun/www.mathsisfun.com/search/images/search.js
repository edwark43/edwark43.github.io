let my={}
function searchMain(){let version='0.531'
rpLog('stt')
my.opts={query:'algebra',}
my.resultMax=30
let s=''
s+=`<style>#search {visibility:hidden;}</style>`
s+='<div id="main" style="position:relative; width:100%; height:100%; margin:auto; display:block; ">'
s+=`<div style="margin:auto; text-align: center; ">`
s+=`<input type="text" id="search2Fld" class="input" style="width: 250px; margin: 5px; font-size: 1.3rem; " oninput="chgVal(this.value)" />`
s+=`</div>`
s+=`<div id="result" style="width:90%; min-height:3500px; margin:auto; font: 16px Arial;">... loading ...</div>`
s+='<div style="text-align: right;">'
s+='<div id="copyrt" style="font: 10px Arial; font-weight: bold; color: #acf; ">&copy; 2020 MathsIsFun.com  v'+version+'</div>'
s+='</div>'
s+='</div>'
docInsert(s)
rpLog('docInsert')
let backQ=false
if(location.href.indexOf('#ff')>0){backQ=true}else{location.href+='#ff'}
console.log('backQ',backQ)
if(backQ){}else{let query=getQueryVariable('query')
if(query&&query.length>0){query=query.replace('+',' ')
optSet('query',query)
console.log('query: ',query)}}
document.getElementById('search2Fld').value=optGet('query')
my.searchStatus='no'
my.searchData=''
cacheGet()
rpLog('searchMain end')}
function cacheGet(){rpLog('cacheGet')
my.searchStatus='loading'
caches.open('search.html').then((cache)=>{let imgHome=(document.domain=='localhost'?'/mathsisfun':'')+'/search/images/'
let url=imgHome+'pages.txt'
console.log('cache',cache,url)
cache.match(url).then((resp)=>{console.log('resp',resp)
if(resp==undefined){console.log('we need to get it')
cache.add(url).then((resp)=>{localStorage.setItem('search.cachedWhen',Date.now())
optSet('cachedWhen',Date.now())
console.log('cache.add',url)
cache.match(url).then((resp)=>{searchProcess('add',resp.text())})})}else{console.log('data is in cache',resp,resp.headers)
searchProcess('cache',resp.text())}})})
rpLog('cacheGet end')}
function searchProcess(src,prom){prom.then((data)=>{console.log('data:',data.length)
my.searchStatus='ok'
my.searchData=data
wordsDo(my.searchData)})
rpLog('searchProcess end')}
function wordsDo(s){rpLog('wordsDo stt')
my.pages=[]
let pages=s.split('\n')
for(let i=0;i<pages.length;i++){let words=pages[i].split(',')
if(words.length>3){let url=words[0]
let title=words[1]
let body=words[2]
let page={url:url,title:title,titleSrch:deAccent(title.toLowerCase()),body:body,bodySrch:deAccent(body.toLowerCase()),words:[],counts:[],}
for(let j=3;j<words.length;j++){let word=words[j]
let count=parseInt(word.charAt(word.length-1))
if(count>0){word=word.substr(0,word.length-1)}else{count=1}
page.words.push(word)
page.counts.push(count)}
my.pages.push(page)}}
document.getElementById('result').innerHTML=''
rpLog('wordsDo end')
searchDo(optGet('query'))}
function chgVal(){let query=document.getElementById('search2Fld').value
console.log('chgVal',query)
optSet('query',query)
searchDo(query)}
function searchDo(txt){rpLog('searchDo stt')
txt=txt.replace('+',' ')
let bits=txt.split(' ')
let words=[]
let stems=[]
for(let i=0;i<bits.length;i++){let word=deAccent(bits[i].toLowerCase()).trim()
word=word.replace(/[\,\+]/g,'')
if(word.length>0){word=spellDo(word)
words.push(word)
stems.push(stemmer(word))}}
console.log('words',txt,words,stems)
console.log('searchDo',words)
for(let i=0;i<my.pages.length;i++){let page=my.pages[i]
page.score=0
if(page.url.toLowerCase().indexOf('flash')>-1)page.score-=3
if(page.titleSrch.indexOf('flash')>-1)page.score-=3
for(let k=0;k<words.length;k++){let word=words[k]
if(page.url.toLowerCase().indexOf(word)>-1)page.score+=4
if(page.titleSrch.indexOf(word)>-1)page.score+=8
if(page.bodySrch.indexOf(word)>-1)page.score+=4
for(let j=0;j<page.words.length;j++){if(page.words[j]==stems[k]){page.score+=page.counts[j]}}}}
my.pages.sort(function(a,b){return b.score-a.score})
let n=0
let s=''
s+='<div style="text-align:left;">'
for(let i=0;i<my.pages.length&&n<my.resultMax;i++){let page=my.pages[i]
if(page.score>0){n++
s+='<h3>'
s+='<a href="..'+page.url+'">'+page.title+'</a>'
s+='</h3>'
s+='<p style="font-size:90%; line-height:130%; margin-top:-8px;">'
s+=page.body
s+='</p>'
s+='<p class="larger" style="font-size:80%; font-style:italic; margin-top:-16px;">'
s+=page.url
s+='</p>'}}
s+='</div>'
rpLog('searchDo end')
document.getElementById('result').innerHTML=s
rpLog('searchDo innerHTML')}
function parseWords(s){let LF=String.fromCharCode(10)
let CR=String.fromCharCode(13)
s=s.split(CR+LF).join(',')
s=s.split(CR).join(',')
s=s.split(LF).join(',')
let words=s.split(',')
words.sort()
let goods=[]
let prevWord=''
let regex=new RegExp(/^[a-zA-Z0-9 ]+$/i)
for(let i=0;i<words.length;i++){let word=words[i]
if(word.length<2)continue
if(word.length>20)continue
if(word==prevWord)continue
prevWord=word
word=word.toLowerCase()
if(!regex.test(word))continue
goods.push(word)}
console.log('goods',words.length,goods.length)
console.log('goods',goods.join(','))
return goods}
function urlSttGet(){let stack=location.href.split('../index.html')
stack.pop()
let url=stack.join('../index.html')
let urlStt='../index.html'
if(endsWith(url,'/mathsisfun'))urlStt=''
if(endsWith(url,'mathsisfun.com'))urlStt=''
return urlStt}
function endsWith(str,suffix){return str.indexOf(suffix,str.length-suffix.length)!==-1}
function stemmer(w){let step2list={ational:'ate',tional:'tion',enci:'ence',anci:'ance',izer:'ize',bli:'ble',alli:'al',entli:'ent',eli:'e',ousli:'ous',ization:'ize',ation:'ate',ator:'ate',alism:'al',iveness:'ive',fulness:'ful',ousness:'ous',aliti:'al',iviti:'ive',biliti:'ble',logi:'log',},step3list={icate:'ic',ative:'',alize:'al',iciti:'ic',ical:'ic',ful:'',ness:'',},c='[^aeiou]',v='[aeiouy]',C=c+'[^aeiouy]*',V=v+'[aeiou]*',mgr0='^('+C+')?'+V+C,meq1='^('+C+')?'+V+C+'('+V+')?$',mgr1='^('+C+')?'+V+C+V+C,s_v='^('+C+')?'+v
let stem,suffix,firstch,re,re2,re3,re4,origword=w
if(w.length<3){return w}
firstch=w.substr(0,1)
if(firstch=='y'){w=firstch.toUpperCase()+w.substr(1)}
re=/^(.+?)(ss|i)es$/
re2=/^(.+?)([^s])s$/
if(re.test(w)){w=w.replace(re,'$1$2')}else if(re2.test(w)){w=w.replace(re2,'$1$2')}
re=/^(.+?)eed$/
re2=/^(.+?)(ed|ing)$/
if(re.test(w)){let fp=re.exec(w)
re=new RegExp(mgr0)
if(re.test(fp[1])){re=/.$/
w=w.replace(re,'')}}else if(re2.test(w)){let fp=re2.exec(w)
stem=fp[1]
re2=new RegExp(s_v)
if(re2.test(stem)){w=stem
re2=/(at|bl|iz)$/
re3=new RegExp('([^aeiouylsz])\\1$')
re4=new RegExp('^'+C+v+'[^aeiouwxy]$')
if(re2.test(w)){w=w+'e'}else if(re3.test(w)){re=/.$/
w=w.replace(re,'')}else if(re4.test(w)){w=w+'e'}}}
re=/^(.+?)y$/
if(re.test(w)){let fp=re.exec(w)
stem=fp[1]
re=new RegExp(s_v)
if(re.test(stem)){w=stem+'i'}}
re=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/
if(re.test(w)){let fp=re.exec(w)
stem=fp[1]
suffix=fp[2]
re=new RegExp(mgr0)
if(re.test(stem)){w=stem+step2list[suffix]}}
re=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/
if(re.test(w)){let fp=re.exec(w)
stem=fp[1]
suffix=fp[2]
re=new RegExp(mgr0)
if(re.test(stem)){w=stem+step3list[suffix]}}
re=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/
re2=/^(.+?)(s|t)(ion)$/
if(re.test(w)){let fp=re.exec(w)
stem=fp[1]
re=new RegExp(mgr1)
if(re.test(stem)){w=stem}}else if(re2.test(w)){let fp=re2.exec(w)
stem=fp[1]+fp[2]
re2=new RegExp(mgr1)
if(re2.test(stem)){w=stem}}
re=/^(.+?)e$/
if(re.test(w)){let fp=re.exec(w)
stem=fp[1]
re=new RegExp(mgr1)
re2=new RegExp(meq1)
re3=new RegExp('^'+C+v+'[^aeiouwxy]$')
if(re.test(stem)||(re2.test(stem)&&!re3.test(stem))){w=stem}}
re=/ll$/
re2=new RegExp(mgr1)
if(re.test(w)&&re2.test(w)){re=/.$/
w=w.replace(re,'')}
if(firstch=='y'){w=firstch.toLowerCase()+w.substr(1)}
return w}
function soundex(s){let a=s.toLowerCase().split('')
let f=a.shift()
let codes={a:'',e:'',i:'',o:'',u:'',b:1,f:1,p:1,v:1,c:2,g:2,j:2,k:2,q:2,s:2,x:2,z:2,d:3,t:3,l:4,m:5,n:5,r:6}
let r=f+
a.map(function(v,i,a){return codes[v]}).filter(function(v,i,a){return i===0?v!==codes[f]:v!==a[i-1]}).join('')
return(r+'000').slice(0,4).toUpperCase()}
function getQueryVariable(variable){let query=decodeURIComponent(window.location.search.substring(1))
let vars=query.split('&')
for(let i=0;i<vars.length;i++){let pair=vars[i].split('=')
if(pair[0]==variable){return pair[1]}}
return false}
function optGet(name){let val=localStorage.getItem(`search.${name}`)
if(val==null)val=my.opts[name]
return val}
function optSet(name,val){localStorage.setItem(`search.${name}`,val)
my.opts[name]=val}
function deAccent(s){return s
let r=''
let nums=[193,201,205,211,218,225,233,237,243,250,241]
let alps=['A','E','I','O','U','a','e','i','o','u','n']
for(let i=0;i<s.length;i++){let c=s.charAt(i)
let n=s.charCodeAt(i)
for(let j=0;j<nums.length;j++){if(n==nums[j])c=alps[j]}
r+=c}
return r}
function spellDo(uk){let spells=[["liter","litre"],["liters","litres"],["milliliter","millilitre"],["milliliters","millilitres"],["centiliter","centilitre"],["centiliters","centilitres"],["megaliter","megalitre"],["megaliters","megalitres"],["meter","metre"],["meters","metres"],["nanometer","nanometre"],["nanometers","nanometres"],["micrometer","micrometre"],["micrometers","micrometres"],["millimeter","millimetre"],["millimeters","millimetres"],["centimeter","centimetre"],["centimeters","centimetres"],["kilometer","kilometre"],["kilometers","kilometres"],["megameter","megametre"],["megameters","megametres"],["gigameter","gigametre"],["gigameters","gigametres"],["analyze","analyse"],["color","colour"],["colors","colours"],["colored","coloured"],["coloring","colouring"],["center","centre"],["centers","centres"],["favor","favour"],["favorite","favourite"],["fiber","fibre"],["flavor","flavour"],["flavors","flavours"],["fulfil","fulfill"],["gage","gauge"],["gasoline","petrol"],["generalize","generalise"],["humor","humour"],["installment","instalment"],["installments","instalments"],["ionization","ionisation"],["ionizing","ionising"],["itemize","itemise"],["math","maths"],["memorize","memorise"],["memorized","memorised"],["mom","mum"],["neighbor","neighbour"],["neighbors","neighbours"],["optimize","optimise"],["optimizes","optimises"],["optimized","optimised"],["organize","organise"],["organizes","organises"],["organized","organised"],["organizing","organising"],["organization","organisation"],["organizations","organisations"],["randomize","randomise"],["rationalize","rationalise"],["rationalized","rationalised"],["rationalizing","rationalising"],["recognize","recognise"],["recognizes","recognises"],["reorganize","reorganise"],["standardize ","standardise"],["standardizes","standardises"],["standardized","standardised"],["summarize","summarise"],["summarizes","summarises"],["summarized","summarised"],["theater","theatre"],["totaling","totalling"],["traveled","travelled"],["traveling","travelling"],["tire","tyre"],["tires","tyres"],["utilize","utilise"],["visualize","visualise"],["theater","theatre"]]
for(let i=0;i<spells.length;i++){if(uk==spells[i][1])return spells[i][0]}
return uk}
function rpLog(id){let now=performance.now()
if(my.timeStt==undefined){my.timeStt=performance.now()
my.timePrev=performance.now()}
console.log(''+id+': '+parseInt(now-my.timeStt)+'ms => '+parseInt(now-my.timePrev)+'ms')
my.timePrev=now}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script);}