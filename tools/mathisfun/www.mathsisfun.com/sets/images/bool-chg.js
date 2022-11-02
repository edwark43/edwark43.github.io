// "Boolean Symbol Change" by Rod Pierce
let my = {}

my.dotQ = true

let s = ''

s += '<button id="dotQ" onclick="toggleDot();" style="" class="btn" >Dot Plus</button>'

document.write(s)

function toggleDot() {
  my.dotQ = !my.dotQ
  toggleBtn('dotQ', my.dotQ)
  document.getElementById('dotQ').innerHTML = my.dotQ ? 'Dot Plus' : 'Up Down'

  if (!my.dotQ) {
    charChgs(document.body, [
      ['·', '∧'],
      ['＋', '∨'],
    ])
  } else {
    charChgs(document.body, [
      ['∧', '·'],
      ['∨', '＋'],
    ])
  }
}

function charChgs(elem, reSpell) {
  // check if parameter is a an ELEMENT_NODE
  if (!(elem instanceof Node) || elem.nodeType !== Node.ELEMENT_NODE) return
  let children = elem.childNodes
  for (let i = 0; children[i]; ++i) {
    let node = children[i]
    switch (node.nodeType) {
      case Node.ELEMENT_NODE: // call recursively !!
        charChgs(node, reSpell)
        break
      case Node.TEXT_NODE: // fix spelling
        charChg(node, reSpell)
        break
    }
  }
}

function charChg(node, reSpell) {
  let s = node.nodeValue
  let sStt = s
  for (let j = 0; j < reSpell.length; j++) {
    let s0 = reSpell[j][0]
    let s1 = reSpell[j][1]
    // console.log('fixChar', s, s0, s1)
    s = s.replace(new RegExp(s0, 'g'), s1)
    //s = s.replace(new RegExp('\\b' + proper(s0) + '\\b', 'g'), proper(s1))
  }
  //  if (s != sStt) console.log('chg',sStt,s)
  if (s != sStt) node.nodeValue = s // only update if changed
  //}
}

function toggleBtn(btn, onq) {
  if (onq) {
    document.getElementById(btn).classList.add('hi')
    document.getElementById(btn).classList.remove('lo')
  } else {
    document.getElementById(btn).classList.add('lo')
    document.getElementById(btn).classList.remove('hi')
  }
}
