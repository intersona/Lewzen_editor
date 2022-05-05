export function createText() {
    var fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")
    var div = document.createElementNS("http://www.w3.org/1999/xhtml", "div")

    // div.innerHTML = "<p><em>hel11111</em><em><strong>111</strong></em><u><em><strong>111</strong></em></u><u><em>1lo</em></u></p>";
    var text = document.createTextNode('123',)
    var p = document.createElement('p')
    p.setAttribute("width", "100%")
    p.setAttribute("height", "100%")
    p.appendChild(text)
    div.appendChild(p)
    div.setAttribute("width", "100%")
    div.setAttribute("height", "100%")
    fo.appendChild(div)
    fo.setAttribute("width", "100%")
    fo.setAttribute("height", "100%")
    fo.setAttribute("style", "overflow: visible")
    fo.setAttribute("x", "100")
    fo.setAttribute("y", "100")
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g")
    g.appendChild(fo)
    g.setAttribute("x", "100")
    g.setAttribute("y", "100")
    console.log(g)
    console.log('create')
    console.log(document.body.getElementsByTagName("svg"))
    document.body.getElementsByTagName("svg")[0].appendChild(g)
    div.onclick = function () {
        console.log(document.body.getElementsByd)
    }
}
