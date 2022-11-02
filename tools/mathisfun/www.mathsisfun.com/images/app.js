// window.addEventListener('load', startApp)
// "Using document.write() after an HTML document is fully loaded, will delete all existing HTML."
// so because we document.write after page load we need to rewrite whole page below

async function startApp() {
  let folder = getQueryVariable('folder', '')
  let file = getQueryVariable('file', '')
  let parm = getQueryVariable('p', '')
  let style = getQueryVariable('style', 'y')

  let imgHome = document.domain == 'localhost' ? '/mathsisfun/images/' : '/images/'

  let path = ''
  let query = ''
  if (folder.length > 0) {
    folder = folder.replace(/[^a-z0-9\-]/gim, '') // remove all non-file-name
    path += folder + '/'
  }
  path += 'images/index.html'

  if (file.length > 0) {
    if (file.includes('?')) {
      // has a query string, TRICKY because we want to pass a query string in a query string
      // so let us treat : as an =
      file = file.replace(/[^a-z0-9\-\?\:]/gim, '') // remove all non-file-name
      let bits = file.split('?')
      console.log('bits', bits)
      path += bits[0] + '.js'
      query = bits[1].replace(':', '=')
    } else {
      file = file.replace(/[^a-z0-9\-]/gim, '') // remove all non-file-name
      path += file + '.js'
    }

    var fnStr = file
    fnStr = fnStr.replace(/[^a-z0-9]/gim, '') // remove all non alphanumeric
    fnStr += 'Main'
    if (parm.length > 0) {
      fnStr += "('" + parm + "')"
    } else {
      fnStr += '()'
    }

    console.log('app.html', path, query, fnStr)

    //<meta name="viewport" content="width=500, initial-scale=1" id="viewport-meta" />

    //console.log('path,fn', path, fnStr)
    // console.log('s=', s)

    //document.write(s)

    // let scripta = document.createElement('script')
    // scripta.onload = function () {
    //   // console.log('script',script)
    //   console.log('Scripta loaded and ready',file, script.parentElement )
    //   // init()
    //   // fullMain()
    //   // let fns = [file+'Main']
    //   // fns[0]()
    // }
    // scripta.src = 'numbers/images/decimal.js'

    // // document.getElementsByTagName('head')[0].appendChild(script)
    // document.getElementById('app').appendChild(scripta)

    //if (style == 'y') s += '<link rel="stylesheet" type="text/css" href="style4.css" />'

    // if file has 'd3' then load THREE library
    // if (file.indexOf('d3') >= 0) {
    //   s += '<script src="' + imgHome + 'three.min.js"></script>'
    //   var geo = imgHome.split('images/').join('geometry/images/')
    //   s += '<script src="' + geo + 'poly-data.js"></script>'
    // }
    if (file.indexOf('d3') >= 0) scriptLoad('images/three.min.js')
    if (file.indexOf('sol-clock') >= 0) scriptLoad('measure/images/sol-clock-tzs.js')
    if (file.indexOf('calc') >= 0) scriptLoad('numbers/images/decimal.js')
    if (file.indexOf('full') >= 0) scriptLoad('numbers/images/decimal.js')
    if (file.indexOf('matrix') >= 0) scriptLoad('numbers/images/decimal.js')
    if (file.indexOf('chessrp') >= 0) scriptLoad('games/images/garbochess.js')

    // scriptLoad('numbers/images/decimal.js')

    // SO DUMB, just wait a short while so previous scripts can load
    // really want a loop to check all scripts are loaded
    await new Promise((r) => setTimeout(r, 300))

    // or perhaps put all scripts into an array and process array?

    scriptLoad(path, query)

    try {
      fnStr
    } catch (error) {
      console.error('err:', error)
    }

    // let script = document.createElement('script')
    // script.type = "text/javascript";
    // script.src = path
    // document.getElementById('app').appendChild(script)
    // script.src = s
    // fullMain()
    // window.addEventListener('load', fullMain)
  }
}

function scriptLoad(path, query='') {
  //console.log('scriptLoad', path, query)
  let script = document.createElement('script')
  script.onload = function () {
    // console.log('script',script)
    console.log(path + ' loaded and ready', script.parentElement)
    // init()
    // fullMain()
    // let fns = [file+'Main']
    // fns[0]()
  }
  let dt = new Date()
  let alpha = 'abcdefghijklmnopqrstuvwxyz'
  alpha += alpha.toUpperCase()
  alpha += '@#$%^*~_'
  let v = alpha.charAt(dt.getMinutes()) + alpha.charAt(dt.getSeconds()) + '_' // dt.getDay()+ '' +

  path += '?v=' + v  // to prevent caching
  if (query.length > 0) path += '&' + query   // TODO: getJSQueryVar in called function picks wrong script (last works on page, but need first in app.js)

  script.src = path
  // document.getElementsByTagName('head')[0].appendChild(script)
  document.getElementById('app').appendChild(script)
}

function searchKey(ev) {
  let val = ev.target.value
  console.log('searchKey', val)

  // run external script to handle autocomplete etc (better than adding heaps of code and possible errors to main script )
  if (main.searchScript == 'no') {
    main.searchScript = 'loading'
    let script = document.createElement('script')
    script.onload = function () {
      console.log('Script loaded and ready')
      searchDo(ev)
      main.searchScript = 'yes'
    }
    let imgHome = (document.domain == 'localhost' ? '/mathsisfun' : '') + '/search/images/'
    script.src = imgHome + 'search-lib.js'
    document.getElementsByTagName('head')[0].appendChild(script)
  }
  if (main.searchScript == 'yes') searchDo(ev)
  return
}

function getQueryVariable(variable, noVal) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return noVal
}
