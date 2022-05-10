/**
 * @description parse LaTeX formula into MathML
 * @author lzh
 */
/* eslint-disable */
/*
    the type of latex commands
    CONST:character with no parameter

    UNARY:func or symbol with 1 parameter, such as '\sqrt'
        sqrt/not;
        function(triangle);
        special marks;
        type styles

    BINARY:func or symbol with 2 parameters, such as '\frac'
        root/frac/stackrel
        textcolor/colorbox

    INFIX:symbol with 1 parameter, such as '^'
        atop/choose
        ^/_

    LEFTBRACKET&RIGHTBRACKET:closed symbols
        left & right
        { & }

    SPACE:space between elements

    UNDEROVER:two para and have to be <munder> and <mover>

    TEXT:text for notes
 */

// TODO: 命名空间问题有待解决，不确定哪种情况下能够显示MathML
const MathMLNS
    // = "http://www.w3.org/1999/xhtml";
    = "http://www.w3.org/1998/Math/MathML";
var CONST = 0, UNARY = 1, BINARY = 2, INFIX = 3, LEFTBRACKET = 4,
    RIGHTBRACKET = 5, SPACE = 6, UNDEROVER = 7, DEFINITION = 8,
    TEXT = 9, BIG = 10, LONG = 11, STRETCHY = 12, MATRIX = 13; // token types

// character lists for Mozilla/Netscape fonts
var AMcal = ["\uD835\uDC9C", "\uD835\uDC9D", "\uD835\uDC9E", "\uD835\uDC9F", "\uD835\uDCA0", "\uD835\uDCA1", "\uD835\uDCA2", "\uD835\uDCA3", "\uD835\uDCA4", "\uD835\uDCA5", "\uD835\uDCA6", "\uD835\uDCA7", "\uD835\uDCA8", "\uD835\uDCA9", "\uD835\uDCAA", "\uD835\uDCAB", "\uD835\uDCAC", "\uD835\uDCAD", "\uD835\uDCAE", "\uD835\uDCAF", "\uD835\uDCB0", "\uD835\uDCB1", "\uD835\uDCB2", "\uD835\uDCB3", "\uD835\uDCB4", "\uD835\uDCB5"];
var AMfrk = ["\uD835\uDD04", "\uD835\uDD05", "\uD835\uDD06", "\uD835\uDD07", "\uD835\uDD08", "\uD835\uDD09", "\uD835\uDD0A", "\uD835\uDD0B", "\uD835\uDD0C", "\uD835\uDD0D", "\uD835\uDD0E", "\uD835\uDD0F", "\uD835\uDD10", "\uD835\uDD11", "\uD835\uDD12", "\uD835\uDD13", "\uD835\uDD14", "\uD835\uDD15", "\uD835\uDD16", "\uD835\uDD17", "\uD835\uDD18", "\uD835\uDD19", "\uD835\uDD1A", "\uD835\uDD1B", "\uD835\uDD1C", "\uD835\uDD1D"];
var AMbbb = ["\uD835\uDD38", "\uD835\uDD39", "\uD835\uDD3A", "\uD835\uDD3B", "\uD835\uDD3C", "\uD835\uDD3D", "\uD835\uDD3E", "\uD835\uDD3F", "\uD835\uDD40", "\uD835\uDD41", "\uD835\uDD42", "\uD835\uDD43", "\uD835\uDD44", "\uD835\uDD45", "\uD835\uDD46", "\uD835\uDD47", "\uD835\uDD48", "\uD835\uDD49", "\uD835\uDD4A", "\uD835\uDD4B", "\uD835\uDD4C", "\uD835\uDD4D", "\uD835\uDD4E", "\uD835\uDD4F", "\uD835\uDD50", "\uD835\uDD51"];


// the translation between latex commands and mathml element tag

/*
    input:latex key words
    tag:the tag of corresponding elements in MathML
    output:the content of the tag
    ttype:the type of the latex commands
 */
// commands with args
var AMsqrt = {input: "\\sqrt", tag: "msqrt", output: "sqrt", ttype: UNARY},
    AMnot = {input: "\\not", tag: "mnot", output: "not", ttype: UNARY},
    AMroot = {input: "\\root", tag: "mroot", output: "root", ttype: BINARY},
    AMfrac = {input: "\\frac", tag: "mfrac", output: "/", ttype: BINARY},
    AMover = {input: "\\stackrel", tag: "mover", output: "stackrel", ttype: BINARY},
    AMatop = {input: "\\atop", tag: "mfrac", output: "", ttype: INFIX},
    AMchoose = {input: "\\choose", tag: "mfrac", output: "", ttype: INFIX},
    AMsub = {input: "_", tag: "msub", output: "_", ttype: INFIX},
    AMsup = {input: "^", tag: "msup", output: "^", ttype: INFIX},
    AMtext = {input: "\\mathrm", tag: "mtext", output: "text", ttype: TEXT},
    AMmbox = {input: "\\mbox", tag: "mtext", output: "mbox", ttype: TEXT};

// List of negations obtained from http://frodo.elon.edu/tutorial/tutorial.pdf
// symbol:not symbol
var AMRelationNegations = {
    "\u003C": "\u226E", "\u003E": "\u226F", "\u2264": "\u2270", "\u2265": "\u2271",
    "\u003D": "\u2260", "\u2261": "\u2262", "\u227A": "\u2280", "\u227B": "\u2281",
    "\u227C": "\u22E0", "\u227D": "\u22E1", "\u223C": "\u2241", "\u2243": "\u2244",
    "\u2282": "\u2284", "\u2283": "\u2285", "\u2286": "\u2288", "\u2287": "\u2289",
    "\u2248": "\u2249", "\u2245": "\u2247", "\u2291": "\u22E2", "\u2292": "\u22E3",
    "\u224D": "\u226D"
}

// eslint-disable-next-line no-unused-vars
var AMsymbols = [
//Greek letters
    {input: "\\alpha", tag: "mi", output: "\u03B1", ttype: CONST},
    {input: "\\beta", tag: "mi", output: "\u03B2", ttype: CONST},
    {input: "\\gamma", tag: "mi", output: "\u03B3", ttype: CONST},
    {input: "\\delta", tag: "mi", output: "\u03B4", ttype: CONST},
    {input: "\\epsilon", tag: "mi", output: "\u03B5", ttype: CONST},
    {input: "\\varepsilon", tag: "mi", output: "\u025B", ttype: CONST},
    {input: "\\zeta", tag: "mi", output: "\u03B6", ttype: CONST},
    {input: "\\eta", tag: "mi", output: "\u03B7", ttype: CONST},
    {input: "\\theta", tag: "mi", output: "\u03B8", ttype: CONST},
    {input: "\\vartheta", tag: "mi", output: "\u03D1", ttype: CONST},
    {input: "\\iota", tag: "mi", output: "\u03B9", ttype: CONST},
    {input: "\\kappa", tag: "mi", output: "\u03BA", ttype: CONST},
    {input: "\\lambda", tag: "mi", output: "\u03BB", ttype: CONST},
    {input: "\\mu", tag: "mi", output: "\u03BC", ttype: CONST},
    {input: "\\nu", tag: "mi", output: "\u03BD", ttype: CONST},
    {input: "\\xi", tag: "mi", output: "\u03BE", ttype: CONST},
    {input: "\\pi", tag: "mi", output: "\u03C0", ttype: CONST},
    {input: "\\varpi", tag: "mi", output: "\u03D6", ttype: CONST},
    {input: "\\rho", tag: "mi", output: "\u03C1", ttype: CONST},
    {input: "\\varrho", tag: "mi", output: "\u03F1", ttype: CONST},
    {input: "\\varsigma", tag: "mi", output: "\u03C2", ttype: CONST},
    {input: "\\sigma", tag: "mi", output: "\u03C3", ttype: CONST},
    {input: "\\tau", tag: "mi", output: "\u03C4", ttype: CONST},
    {input: "\\upsilon", tag: "mi", output: "\u03C5", ttype: CONST},
    {input: "\\phi", tag: "mi", output: "\u03C6", ttype: CONST},
    {input: "\\varphi", tag: "mi", output: "\u03D5", ttype: CONST},
    {input: "\\chi", tag: "mi", output: "\u03C7", ttype: CONST},
    {input: "\\psi", tag: "mi", output: "\u03C8", ttype: CONST},
    {input: "\\omega", tag: "mi", output: "\u03C9", ttype: CONST},
    {input: "\\Gamma", tag: "mo", output: "\u0393", ttype: CONST},
    {input: "\\Delta", tag: "mo", output: "\u0394", ttype: CONST},
    {input: "\\Theta", tag: "mo", output: "\u0398", ttype: CONST},
    {input: "\\Lambda", tag: "mo", output: "\u039B", ttype: CONST},
    {input: "\\Xi", tag: "mo", output: "\u039E", ttype: CONST},
    {input: "\\Pi", tag: "mo", output: "\u03A0", ttype: CONST},
    {input: "\\Sigma", tag: "mo", output: "\u03A3", ttype: CONST},
    {input: "\\Upsilon", tag: "mo", output: "\u03A5", ttype: CONST},
    {input: "\\Phi", tag: "mo", output: "\u03A6", ttype: CONST},
    {input: "\\Psi", tag: "mo", output: "\u03A8", ttype: CONST},
    {input: "\\Omega", tag: "mo", output: "\u03A9", ttype: CONST},

//fractions
    {input: "\\frac12", tag: "mo", output: "\u00BD", ttype: CONST},
    {input: "\\frac14", tag: "mo", output: "\u00BC", ttype: CONST},
    {input: "\\frac34", tag: "mo", output: "\u00BE", ttype: CONST},
    {input: "\\frac13", tag: "mo", output: "\u2153", ttype: CONST},
    {input: "\\frac23", tag: "mo", output: "\u2154", ttype: CONST},
    {input: "\\frac15", tag: "mo", output: "\u2155", ttype: CONST},
    {input: "\\frac25", tag: "mo", output: "\u2156", ttype: CONST},
    {input: "\\frac35", tag: "mo", output: "\u2157", ttype: CONST},
    {input: "\\frac45", tag: "mo", output: "\u2158", ttype: CONST},
    {input: "\\frac16", tag: "mo", output: "\u2159", ttype: CONST},
    {input: "\\frac56", tag: "mo", output: "\u215A", ttype: CONST},
    {input: "\\frac18", tag: "mo", output: "\u215B", ttype: CONST},
    {input: "\\frac38", tag: "mo", output: "\u215C", ttype: CONST},
    {input: "\\frac58", tag: "mo", output: "\u215D", ttype: CONST},
    {input: "\\frac78", tag: "mo", output: "\u215E", ttype: CONST},

//binary operation symbols
    {input: "\\pm", tag: "mo", output: "\u00B1", ttype: CONST},
    {input: "\\mp", tag: "mo", output: "\u2213", ttype: CONST},
    {input: "\\triangleleft", tag: "mo", output: "\u22B2", ttype: CONST},
    {input: "\\triangleright", tag: "mo", output: "\u22B3", ttype: CONST},
    {input: "\\cdot", tag: "mo", output: "\u22C5", ttype: CONST},
    {input: "\\star", tag: "mo", output: "\u22C6", ttype: CONST},
    {input: "\\ast", tag: "mo", output: "\u002A", ttype: CONST},
    {input: "\\times", tag: "mo", output: "\u00D7", ttype: CONST},
    {input: "\\div", tag: "mo", output: "\u00F7", ttype: CONST},
    {input: "\\circ", tag: "mo", output: "\u2218", ttype: CONST},
//{input:"\\bullet",	  tag:"mo", output:"\u2219", ttype:CONST},
    {input: "\\bullet", tag: "mo", output: "\u2022", ttype: CONST},
    {input: "\\oplus", tag: "mo", output: "\u2295", ttype: CONST},
    {input: "\\ominus", tag: "mo", output: "\u2296", ttype: CONST},
    {input: "\\otimes", tag: "mo", output: "\u2297", ttype: CONST},
    {input: "\\bigcirc", tag: "mo", output: "\u25CB", ttype: CONST},
    {input: "\\oslash", tag: "mo", output: "\u2298", ttype: CONST},
    {input: "\\odot", tag: "mo", output: "\u2299", ttype: CONST},
    {input: "\\land", tag: "mo", output: "\u2227", ttype: CONST},
    {input: "\\wedge", tag: "mo", output: "\u2227", ttype: CONST},
    {input: "\\lor", tag: "mo", output: "\u2228", ttype: CONST},
    {input: "\\vee", tag: "mo", output: "\u2228", ttype: CONST},
    {input: "\\cap", tag: "mo", output: "\u2229", ttype: CONST},
    {input: "\\cup", tag: "mo", output: "\u222A", ttype: CONST},
    {input: "\\sqcap", tag: "mo", output: "\u2293", ttype: CONST},
    {input: "\\sqcup", tag: "mo", output: "\u2294", ttype: CONST},
    {input: "\\uplus", tag: "mo", output: "\u228E", ttype: CONST},
    {input: "\\amalg", tag: "mo", output: "\u2210", ttype: CONST},
    {input: "\\bigtriangleup", tag: "mo", output: "\u25B3", ttype: CONST},
    {input: "\\bigtriangledown", tag: "mo", output: "\u25BD", ttype: CONST},
    {input: "\\dag", tag: "mo", output: "\u2020", ttype: CONST},
    {input: "\\dagger", tag: "mo", output: "\u2020", ttype: CONST},
    {input: "\\ddag", tag: "mo", output: "\u2021", ttype: CONST},
    {input: "\\ddagger", tag: "mo", output: "\u2021", ttype: CONST},
    {input: "\\lhd", tag: "mo", output: "\u22B2", ttype: CONST},
    {input: "\\rhd", tag: "mo", output: "\u22B3", ttype: CONST},
    {input: "\\unlhd", tag: "mo", output: "\u22B4", ttype: CONST},
    {input: "\\unrhd", tag: "mo", output: "\u22B5", ttype: CONST},


//BIG Operators
    {input: "\\sum", tag: "mo", output: "\u2211", ttype: UNDEROVER},
    {input: "\\prod", tag: "mo", output: "\u220F", ttype: UNDEROVER},
    {input: "\\bigcap", tag: "mo", output: "\u22C2", ttype: UNDEROVER},
    {input: "\\bigcup", tag: "mo", output: "\u22C3", ttype: UNDEROVER},
    {input: "\\bigwedge", tag: "mo", output: "\u22C0", ttype: UNDEROVER},
    {input: "\\bigvee", tag: "mo", output: "\u22C1", ttype: UNDEROVER},
    {input: "\\bigsqcap", tag: "mo", output: "\u2A05", ttype: UNDEROVER},
    {input: "\\bigsqcup", tag: "mo", output: "\u2A06", ttype: UNDEROVER},
    {input: "\\coprod", tag: "mo", output: "\u2210", ttype: UNDEROVER},
    {input: "\\bigoplus", tag: "mo", output: "\u2A01", ttype: UNDEROVER},
    {input: "\\bigotimes", tag: "mo", output: "\u2A02", ttype: UNDEROVER},
    {input: "\\bigodot", tag: "mo", output: "\u2A00", ttype: UNDEROVER},
    {input: "\\biguplus", tag: "mo", output: "\u2A04", ttype: UNDEROVER},
    {input: "\\int", tag: "mo", output: "\u222B", ttype: CONST},
    {input: "\\oint", tag: "mo", output: "\u222E", ttype: CONST},

//binary relation symbols
    {input: ":=", tag: "mo", output: ":=", ttype: CONST},
    {input: "\\lt", tag: "mo", output: "<", ttype: CONST},
    {input: "\\gt", tag: "mo", output: ">", ttype: CONST},
    {input: "\\ne", tag: "mo", output: "\u2260", ttype: CONST},
    {input: "\\neq", tag: "mo", output: "\u2260", ttype: CONST},
    {input: "\\le", tag: "mo", output: "\u2264", ttype: CONST},
    {input: "\\leq", tag: "mo", output: "\u2264", ttype: CONST},
    {input: "\\leqslant", tag: "mo", output: "\u2264", ttype: CONST},
    {input: "\\ge", tag: "mo", output: "\u2265", ttype: CONST},
    {input: "\\geq", tag: "mo", output: "\u2265", ttype: CONST},
    {input: "\\geqslant", tag: "mo", output: "\u2265", ttype: CONST},
    {input: "\\equiv", tag: "mo", output: "\u2261", ttype: CONST},
    {input: "\\ll", tag: "mo", output: "\u226A", ttype: CONST},
    {input: "\\gg", tag: "mo", output: "\u226B", ttype: CONST},
    {input: "\\doteq", tag: "mo", output: "\u2250", ttype: CONST},
    {input: "\\prec", tag: "mo", output: "\u227A", ttype: CONST},
    {input: "\\succ", tag: "mo", output: "\u227B", ttype: CONST},
    {input: "\\preceq", tag: "mo", output: "\u227C", ttype: CONST},
    {input: "\\succeq", tag: "mo", output: "\u227D", ttype: CONST},
    {input: "\\subset", tag: "mo", output: "\u2282", ttype: CONST},
    {input: "\\supset", tag: "mo", output: "\u2283", ttype: CONST},
    {input: "\\subseteq", tag: "mo", output: "\u2286", ttype: CONST},
    {input: "\\supseteq", tag: "mo", output: "\u2287", ttype: CONST},
    {input: "\\subsetneq", tag: "mo", output: "\u228A", ttype: CONST},
    {input: "\\supsetneq", tag: "mo", output: "\u228B", ttype: CONST},
    {input: "\\sqsubset", tag: "mo", output: "\u228F", ttype: CONST},
    {input: "\\sqsupset", tag: "mo", output: "\u2290", ttype: CONST},
    {input: "\\sqsubseteq", tag: "mo", output: "\u2291", ttype: CONST},
    {input: "\\sqsupseteq", tag: "mo", output: "\u2292", ttype: CONST},
    {input: "\\sim", tag: "mo", output: "\u223C", ttype: CONST},
    {input: "\\simeq", tag: "mo", output: "\u2243", ttype: CONST},
    {input: "\\approx", tag: "mo", output: "\u2248", ttype: CONST},
    {input: "\\cong", tag: "mo", output: "\u2245", ttype: CONST},
    {input: "\\Join", tag: "mo", output: "\u22C8", ttype: CONST},
    {input: "\\bowtie", tag: "mo", output: "\u22C8", ttype: CONST},
    {input: "\\in", tag: "mo", output: "\u2208", ttype: CONST},
    {input: "\\ni", tag: "mo", output: "\u220B", ttype: CONST},
    {input: "\\owns", tag: "mo", output: "\u220B", ttype: CONST},
    {input: "\\propto", tag: "mo", output: "\u221D", ttype: CONST},
    {input: "\\vdash", tag: "mo", output: "\u22A2", ttype: CONST},
    {input: "\\dashv", tag: "mo", output: "\u22A3", ttype: CONST},
    {input: "\\models", tag: "mo", output: "\u22A8", ttype: CONST},
    {input: "\\perp", tag: "mo", output: "\u22A5", ttype: CONST},
    {input: "\\smile", tag: "mo", output: "\u2323", ttype: CONST},
    {input: "\\frown", tag: "mo", output: "\u2322", ttype: CONST},
    {input: "\\asymp", tag: "mo", output: "\u224D", ttype: CONST},
    {input: "\\notin", tag: "mo", output: "\u2209", ttype: CONST},

//matrices
    {input: "\\begin{eqnarray}", output: "X", ttype: MATRIX, invisible: true},
    {input: "\\begin{array}", output: "X", ttype: MATRIX, invisible: true},
    {input: "\\\\", output: "}&{", ttype: DEFINITION},
    {input: "\\end{eqnarray}", output: "}}", ttype: DEFINITION},
    {input: "\\end{array}", output: "}}", ttype: DEFINITION},

//grouping and literal brackets -- ieval is for IE
    {input: "\\big", tag: "mo", output: "X", atval: "1.2", ieval: "2.2", ttype: BIG},
    {input: "\\Big", tag: "mo", output: "X", atval: "1.6", ieval: "2.6", ttype: BIG},
    {input: "\\bigg", tag: "mo", output: "X", atval: "2.2", ieval: "3.2", ttype: BIG},
    {input: "\\Bigg", tag: "mo", output: "X", atval: "2.9", ieval: "3.9", ttype: BIG},
    {input: "\\left", tag: "mo", output: "X", ttype: LEFTBRACKET},
    {input: "\\right", tag: "mo", output: "X", ttype: RIGHTBRACKET},
    {input: "{", output: "{", ttype: LEFTBRACKET, invisible: true},
    {input: "}", output: "}", ttype: RIGHTBRACKET, invisible: true},

    {input: "(", tag: "mo", output: "(", atval: "1", ttype: STRETCHY},
    {input: "[", tag: "mo", output: "[", atval: "1", ttype: STRETCHY},
    {input: "\\lbrack", tag: "mo", output: "[", atval: "1", ttype: STRETCHY},
    {input: "\\{", tag: "mo", output: "{", atval: "1", ttype: STRETCHY},
    {input: "\\lbrace", tag: "mo", output: "{", atval: "1", ttype: STRETCHY},
    {input: "\\langle", tag: "mo", output: "\u2329", atval: "1", ttype: STRETCHY},
    {input: "\\lfloor", tag: "mo", output: "\u230A", atval: "1", ttype: STRETCHY},
    {input: "\\lceil", tag: "mo", output: "\u2308", atval: "1", ttype: STRETCHY},

// rtag:"mi" causes space to be inserted before a following sin, cos, etc.
// (see function AMparseExpr() )
    {input: ")", tag: "mo", output: ")", rtag: "mi", atval: "1", ttype: STRETCHY},
    {input: "]", tag: "mo", output: "]", rtag: "mi", atval: "1", ttype: STRETCHY},
    {input: "\\rbrack", tag: "mo", output: "]", rtag: "mi", atval: "1", ttype: STRETCHY},
    {input: "\\}", tag: "mo", output: "}", rtag: "mi", atval: "1", ttype: STRETCHY},
    {input: "\\rbrace", tag: "mo", output: "}", rtag: "mi", atval: "1", ttype: STRETCHY},
    {input: "\\rangle", tag: "mo", output: "\u232A", rtag: "mi", atval: "1", ttype: STRETCHY},
    {input: "\\rfloor", tag: "mo", output: "\u230B", rtag: "mi", atval: "1", ttype: STRETCHY},
    {input: "\\rceil", tag: "mo", output: "\u2309", rtag: "mi", atval: "1", ttype: STRETCHY},

// "|", "\\|", "\\vert" and "\\Vert" modified later: lspace = rspace = 0em
    {input: "|", tag: "mo", output: "\u2223", atval: "1", ttype: STRETCHY},
    {input: "\\|", tag: "mo", output: "\u2225", atval: "1", ttype: STRETCHY},
    {input: "\\vert", tag: "mo", output: "\u2223", atval: "1", ttype: STRETCHY},
    {input: "\\Vert", tag: "mo", output: "\u2225", atval: "1", ttype: STRETCHY},
    {input: "\\mid", tag: "mo", output: "\u2223", atval: "1", ttype: STRETCHY},
    {input: "\\parallel", tag: "mo", output: "\u2225", atval: "1", ttype: STRETCHY},
    {input: "/", tag: "mo", output: "/", atval: "1.01", ttype: STRETCHY},
    {input: "\\backslash", tag: "mo", output: "\u2216", atval: "1", ttype: STRETCHY},
    {input: "\\setminus", tag: "mo", output: "\\", ttype: CONST},

//miscellaneous symbols
    {input: "\\!", tag: "mspace", atname: "width", atval: "-0.167em", ttype: SPACE},
    {input: "\\,", tag: "mspace", atname: "width", atval: "0.167em", ttype: SPACE},
    {input: "\\>", tag: "mspace", atname: "width", atval: "0.222em", ttype: SPACE},
    {input: "\\:", tag: "mspace", atname: "width", atval: "0.222em", ttype: SPACE},
    {input: "\\;", tag: "mspace", atname: "width", atval: "0.278em", ttype: SPACE},
    {input: "~", tag: "mspace", atname: "width", atval: "0.333em", ttype: SPACE},
    {input: "\\quad", tag: "mspace", atname: "width", atval: "1em", ttype: SPACE},
    {input: "\\qquad", tag: "mspace", atname: "width", atval: "2em", ttype: SPACE},
//{input:"{}",		  tag:"mo", output:"\u200B", ttype:CONST}, // zero-width
    {input: "\\prime", tag: "mo", output: "\u2032", ttype: CONST},
    {input: "'", tag: "mo", output: "\u02B9", ttype: CONST},
    {input: "''", tag: "mo", output: "\u02BA", ttype: CONST},
    {input: "'''", tag: "mo", output: "\u2034", ttype: CONST},
    {input: "''''", tag: "mo", output: "\u2057", ttype: CONST},
    {input: "\\ldots", tag: "mo", output: "\u2026", ttype: CONST},
    {input: "\\cdots", tag: "mo", output: "\u22EF", ttype: CONST},
    {input: "\\vdots", tag: "mo", output: "\u22EE", ttype: CONST},
    {input: "\\ddots", tag: "mo", output: "\u22F1", ttype: CONST},
    {input: "\\forall", tag: "mo", output: "\u2200", ttype: CONST},
    {input: "\\exists", tag: "mo", output: "\u2203", ttype: CONST},
    {input: "\\Re", tag: "mo", output: "\u211C", ttype: CONST},
    {input: "\\Im", tag: "mo", output: "\u2111", ttype: CONST},
    {input: "\\aleph", tag: "mo", output: "\u2135", ttype: CONST},
    {input: "\\hbar", tag: "mo", output: "\u210F", ttype: CONST},
    {input: "\\ell", tag: "mo", output: "\u2113", ttype: CONST},
    {input: "\\wp", tag: "mo", output: "\u2118", ttype: CONST},
    {input: "\\emptyset", tag: "mo", output: "\u2205", ttype: CONST},
    {input: "\\infty", tag: "mo", output: "\u221E", ttype: CONST},
    {input: "\\surd", tag: "mo", output: "\\sqrt{}", ttype: DEFINITION},
    {input: "\\partial", tag: "mo", output: "\u2202", ttype: CONST},
    {input: "\\nabla", tag: "mo", output: "\u2207", ttype: CONST},
    {input: "\\triangle", tag: "mo", output: "\u25B3", ttype: CONST},
    {input: "\\therefore", tag: "mo", output: "\u2234", ttype: CONST},
    {input: "\\angle", tag: "mo", output: "\u2220", ttype: CONST},
//{input:"\\\\ ",	  tag:"mo", output:"\u00A0", ttype:CONST},
    {input: "\\diamond", tag: "mo", output: "\u22C4", ttype: CONST},
//{input:"\\Diamond",	  tag:"mo", output:"\u25CA", ttype:CONST},
    {input: "\\Diamond", tag: "mo", output: "\u25C7", ttype: CONST},
    {input: "\\neg", tag: "mo", output: "\u00AC", ttype: CONST},
    {input: "\\lnot", tag: "mo", output: "\u00AC", ttype: CONST},
    {input: "\\bot", tag: "mo", output: "\u22A5", ttype: CONST},
    {input: "\\top", tag: "mo", output: "\u22A4", ttype: CONST},
    {input: "\\square", tag: "mo", output: "\u25AB", ttype: CONST},
    {input: "\\Box", tag: "mo", output: "\u25A1", ttype: CONST},
    {input: "\\wr", tag: "mo", output: "\u2240", ttype: CONST},

//standard functions
//Note UNDEROVER *must* have tag:"mo" to work properly
    {input: "\\arccos", tag: "mi", output: "arccos", ttype: UNARY, func: true},
    {input: "\\arcsin", tag: "mi", output: "arcsin", ttype: UNARY, func: true},
    {input: "\\arctan", tag: "mi", output: "arctan", ttype: UNARY, func: true},
    {input: "\\arg", tag: "mi", output: "arg", ttype: UNARY, func: true},
    {input: "\\cos", tag: "mi", output: "cos", ttype: UNARY, func: true},
    {input: "\\cosh", tag: "mi", output: "cosh", ttype: UNARY, func: true},
    {input: "\\cot", tag: "mi", output: "cot", ttype: UNARY, func: true},
    {input: "\\coth", tag: "mi", output: "coth", ttype: UNARY, func: true},
    {input: "\\csc", tag: "mi", output: "csc", ttype: UNARY, func: true},
    {input: "\\deg", tag: "mi", output: "deg", ttype: UNARY, func: true},
    {input: "\\det", tag: "mi", output: "det", ttype: UNARY, func: true},
    {input: "\\dim", tag: "mi", output: "dim", ttype: UNARY, func: true}, //CONST?
    {input: "\\exp", tag: "mi", output: "exp", ttype: UNARY, func: true},
    {input: "\\gcd", tag: "mi", output: "gcd", ttype: UNARY, func: true}, //CONST?
    {input: "\\hom", tag: "mi", output: "hom", ttype: UNARY, func: true},
    {input: "\\inf", tag: "mo", output: "inf", ttype: UNDEROVER},
    {input: "\\ker", tag: "mi", output: "ker", ttype: UNARY, func: true},
    {input: "\\lg", tag: "mi", output: "lg", ttype: UNARY, func: true},
    {input: "\\lim", tag: "mo", output: "lim", ttype: UNDEROVER},
    {input: "\\liminf", tag: "mo", output: "liminf", ttype: UNDEROVER},
    {input: "\\limsup", tag: "mo", output: "limsup", ttype: UNDEROVER},
    {input: "\\ln", tag: "mi", output: "ln", ttype: UNARY, func: true},
    {input: "\\log", tag: "mi", output: "log", ttype: UNARY, func: true},
    {input: "\\max", tag: "mo", output: "max", ttype: UNDEROVER},
    {input: "\\min", tag: "mo", output: "min", ttype: UNDEROVER},
    {input: "\\Pr", tag: "mi", output: "Pr", ttype: UNARY, func: true},
    {input: "\\sec", tag: "mi", output: "sec", ttype: UNARY, func: true},
    {input: "\\sin", tag: "mi", output: "sin", ttype: UNARY, func: true},
    {input: "\\sinh", tag: "mi", output: "sinh", ttype: UNARY, func: true},
    {input: "\\sup", tag: "mo", output: "sup", ttype: UNDEROVER},
    {input: "\\tan", tag: "mi", output: "tan", ttype: UNARY, func: true},
    {input: "\\tanh", tag: "mi", output: "tanh", ttype: UNARY, func: true},

//arrows
    {input: "\\gets", tag: "mo", output: "\u2190", ttype: CONST},
    {input: "\\leftarrow", tag: "mo", output: "\u2190", ttype: CONST},
    {input: "\\to", tag: "mo", output: "\u2192", ttype: CONST},
    {input: "\\rightarrow", tag: "mo", output: "\u2192", ttype: CONST},
    {input: "\\leftrightarrow", tag: "mo", output: "\u2194", ttype: CONST},
    {input: "\\uparrow", tag: "mo", output: "\u2191", ttype: CONST},
    {input: "\\downarrow", tag: "mo", output: "\u2193", ttype: CONST},
    {input: "\\updownarrow", tag: "mo", output: "\u2195", ttype: CONST},
    {input: "\\Leftarrow", tag: "mo", output: "\u21D0", ttype: CONST},
    {input: "\\Rightarrow", tag: "mo", output: "\u21D2", ttype: CONST},
    {input: "\\Leftrightarrow", tag: "mo", output: "\u21D4", ttype: CONST},
    {input: "\\iff", tag: "mo", output: "~\\Longleftrightarrow~", ttype: DEFINITION},
    {input: "\\Uparrow", tag: "mo", output: "\u21D1", ttype: CONST},
    {input: "\\Downarrow", tag: "mo", output: "\u21D3", ttype: CONST},
    {input: "\\Updownarrow", tag: "mo", output: "\u21D5", ttype: CONST},
    {input: "\\mapsto", tag: "mo", output: "\u21A6", ttype: CONST},
    {input: "\\longleftarrow", tag: "mo", output: "\u2190", ttype: LONG},
    {input: "\\longrightarrow", tag: "mo", output: "\u2192", ttype: LONG},
    {input: "\\longleftrightarrow", tag: "mo", output: "\u2194", ttype: LONG},
    {input: "\\Longleftarrow", tag: "mo", output: "\u21D0", ttype: LONG},
    {input: "\\Longrightarrow", tag: "mo", output: "\u21D2", ttype: LONG},
    {input: "\\Longleftrightarrow", tag: "mo", output: "\u21D4", ttype: LONG},
    {input: "\\longmapsto", tag: "mo", output: "\u21A6", ttype: CONST},
    // disaster if LONG

//commands with argument
    AMsqrt, AMnot, AMroot, AMfrac, AMover, AMsub, AMsup, AMtext, AMmbox, AMatop, AMchoose,

//AMdiv, AMquote,

//diacritical marks
    {input: "\\acute", tag: "mover", output: "\u00B4", ttype: UNARY, acc: true},
//{input:"\\acute",	  tag:"mover",  output:"\u0317", ttype:UNARY, acc:true},
//{input:"\\acute",	  tag:"mover",  output:"\u0301", ttype:UNARY, acc:true},
//{input:"\\grave",	  tag:"mover",  output:"\u0300", ttype:UNARY, acc:true},
//{input:"\\grave",	  tag:"mover",  output:"\u0316", ttype:UNARY, acc:true},
    {input: "\\grave", tag: "mover", output: "\u0060", ttype: UNARY, acc: true},
    {input: "\\breve", tag: "mover", output: "\u02D8", ttype: UNARY, acc: true},
    {input: "\\check", tag: "mover", output: "\u02C7", ttype: UNARY, acc: true},
    {input: "\\dot", tag: "mover", output: ".", ttype: UNARY, acc: true},
    {input: "\\ddot", tag: "mover", output: "..", ttype: UNARY, acc: true},
//{input:"\\ddot",	  tag:"mover",  output:"\u00A8", ttype:UNARY, acc:true},
    {input: "\\mathring", tag: "mover", output: "\u00B0", ttype: UNARY, acc: true},
    {input: "\\vec", tag: "mover", output: "\u20D7", ttype: UNARY, acc: true},
    {input: "\\overrightarrow", tag: "mover", output: "\u20D7", ttype: UNARY, acc: true},
    {input: "\\overleftarrow", tag: "mover", output: "\u20D6", ttype: UNARY, acc: true},
    {input: "\\hat", tag: "mover", output: "\u005E", ttype: UNARY, acc: true},
    {input: "\\widehat", tag: "mover", output: "\u0302", ttype: UNARY, acc: true},
    {input: "\\tilde", tag: "mover", output: "~", ttype: UNARY, acc: true},
//{input:"\\tilde",	  tag:"mover",  output:"\u0303", ttype:UNARY, acc:true},
    {input: "\\widetilde", tag: "mover", output: "\u02DC", ttype: UNARY, acc: true},
    {input: "\\bar", tag: "mover", output: "\u203E", ttype: UNARY, acc: true},
    {input: "\\overbrace", tag: "mover", output: "\uFE37", ttype: UNARY, acc: true}, //Changed unicode overbrace
    {input: "\\overbracket", tag: "mover", output: "\u23B4", ttype: UNARY, acc: true}, //old overbrace = overbracket
    {input: "\\overline", tag: "mover", output: "\u00AF", ttype: UNARY, acc: true},
    {input: "\\underbrace", tag: "munder", output: "\uFE38", ttype: UNARY, acc: true}, //Changed unicode underbrace
    {input: "\\underbracket", tag: "munder", output: "\u23B5", ttype: UNARY, acc: true}, //old underbrace = underbracket
    {input: "\\underline", tag: "munder", output: "\u00AF", ttype: UNARY, acc: true},
//{input:"underline",	tag:"munder", output:"\u0332", ttype:UNARY, acc:true},

//typestyles and fonts
    {input: "\\displaystyle", tag: "mstyle", atname: "displaystyle", atval: "true", ttype: UNARY},
    {input: "\\textstyle", tag: "mstyle", atname: "displaystyle", atval: "false", ttype: UNARY},
    {input: "\\scriptstyle", tag: "mstyle", atname: "scriptlevel", atval: "1", ttype: UNARY},
    {input: "\\scriptscriptstyle", tag: "mstyle", atname: "scriptlevel", atval: "2", ttype: UNARY},
    {input: "\\textrm", tag: "mstyle", output: "\\mathrm", ttype: DEFINITION},
    {input: "\\mathbf", tag: "mstyle", atname: "mathvariant", atval: "bold", ttype: UNARY},
    {input: "\\textbf", tag: "mstyle", atname: "mathvariant", atval: "bold", ttype: UNARY},
    {input: "\\mathit", tag: "mstyle", atname: "mathvariant", atval: "italic", ttype: UNARY},
    {input: "\\textit", tag: "mstyle", atname: "mathvariant", atval: "italic", ttype: UNARY},
    {input: "\\mathtt", tag: "mstyle", atname: "mathvariant", atval: "monospace", ttype: UNARY},
    {input: "\\texttt", tag: "mstyle", atname: "mathvariant", atval: "monospace", ttype: UNARY},
    {input: "\\mathsf", tag: "mstyle", atname: "mathvariant", atval: "sans-serif", ttype: UNARY},
    {input: "\\mathbb", tag: "mstyle", atname: "mathvariant", atval: "double-struck", ttype: UNARY, codes: AMbbb},
    {input: "\\mathcal", tag: "mstyle", atname: "mathvariant", atval: "script", ttype: UNARY, codes: AMcal},
    {input: "\\mathfrak", tag: "mstyle", atname: "mathvariant", atval: "fraktur", ttype: UNARY, codes: AMfrk},
    {input: "\\textcolor", tag: "mstyle", atname: "mathvariant", atval: "mathcolor", ttype: BINARY},
    {input: "\\colorbox", tag: "mstyle", atname: "mathvariant", atval: "background", ttype: BINARY},
    {input: "\\", tag: "test", ttype: CONST},
];

// list of all command inputs in dic order
let LTXNames = []

// sort the symbols by input
function compareNames(s1, s2) {
    if (s1.input > s2.input) return 1
    else return -1;
}

// sort all symbols
function initSymbols() {
    AMsymbols.sort(compareNames);
    for (let i = 0; i < AMsymbols.length; i++) {
        LTXNames[i] = AMsymbols[i].input;
    }
    // console.log(LTXNames)
}

// append a new command to AMsymbols
function appendNewCommand() {
}


/**
 * create MathML dom elements with namespace by the tag
 * @param tag tag of new MathML element
 * @returns {Element} new MathML element (DOM node)
 */
function createMathMLElements(tag) {
    return document.createElementNS(MathMLNS, tag);
}

/**
 * create element with child
 * @param tag tag of new MathML element
 * @param frag child of the element
 * @returns {Element} new MathML element (DOM node)
 */
function createMathMLElementsWithChild(tag, frag) {
    let node = document.createElementNS(MathMLNS, tag);
    node.appendChild(frag);
    return node;
}

/**
 * remove n characters and any following blanks(invisible characters)
 * @param str original string(latex command string)
 * @param n num of character to be removed
 * @returns {*}
 */
function removeCharsAndBlanks(str, n) {
    let st;
    st = str.slice(n);
    for (var i = 0; i < st.length && st.charCodeAt(i) <= 32; i++) {
        // if (!st.charCodeAt(i) <= 32) {
        //     break;
        // }
    }
    return st.slice(i);
}

/**
 * return position >= n where str appears(even do not exist)
 * find potential start position where str appears(even do not exist)
 * @param arr LTXNames(all symbols)
 * @param str potential latex command string to be searched
 * @param n search strat position
 * @returns {*}
 */
function getPosition(arr, str, n) {
    // binary search
    // to search the corresponding symbol with str
    if (n == 0) {
        // h:the right edge
        // m:the middle
        // n:the left edge
        let h, m;
        n = -1;
        h = arr.length;
        while (n + 1 < h) {
            m = (n + h) >> 1;
            if (str > arr[m]) {
                n = m;
            } else {
                h = m;
            }
        }
        return h;
    } else {
        for (var i = n; i < arr.length; i++) {
            if (!(str > arr[i])) {
                break;
            }
        }
    }
    // i = arr.length || str <= arr[i]
    return i;
}

var previousSymbol, currentSymbol;

/**
 * get the maximal initial substring of str that appears in names
 * return the 1st char as CONST if there is none
 * @param str original string or substring of latex code
 * @returns {{output: string, input: string, ttype: number, tag: string}}
 */
function getSymbol(str) {
    let oldp = 0;
    let newp = 0;
    let matchp;
    let substr;
    let tagstr;
    let match = '';
    let more = true;
    for (let i = 1; i <= str.length && more; i++) {
        substr = str.slice(0, i); // initial substring of length i
        oldp = newp;
        newp = getPosition(LTXNames, substr, oldp);
        if (newp < LTXNames.length && str.slice(0, LTXNames[newp].length) == LTXNames[newp]) {
            match = LTXNames[newp];
            matchp = newp;
            i = match.length;
        }
        more = newp < LTXNames.length && str.slice(0, LTXNames[newp].length) >= LTXNames[newp];
    }
    previousSymbol = currentSymbol;
    // if get matched symbol, there is a corresponding command
    if (match != '') {
        currentSymbol = AMsymbols[matchp].ttype;
        return AMsymbols[matchp];
    }
    // no corresponding command, meaning number or identifier or operator
    // console.log('no match')
    currentSymbol = CONST;
    newp = 1;
    // take 1 character
    substr = str.slice(0, newp);
    // if is number
    if (substr >= "0" && substr <= "9") {
        tagstr = "mn";
    } else {
        // if is operator or identifier
        tagstr = ((substr < "A" || substr > "Z") && (substr < "a" || substr > "z") ? "mo" : "mi");
    }
    return {input: substr, tag: tagstr, output: substr, ttype: currentSymbol};
}

/**
 * parse symbol command and returns [node, remain_sub_str, tag]
 * if there is parameter or bracket parse too
 * @param str
 * @returns {(Element|*|string)[]}
 */
function parseSymbolExpr(str) {
    var symbol, node, result, result2, i, st,
        newFrag = document.createDocumentFragment();
    // remove the initial blanks
    str = removeCharsAndBlanks(str, 0);
    // get the initial symbol of the string
    symbol = getSymbol(str);
    // remove the initial symbol of str
    str = removeCharsAndBlanks(str, symbol.input.length);
    switch (symbol.ttype) {
        case SPACE:
            node = createMathMLElements(symbol.tag);
            node.setAttribute(symbol.atname, symbol.atval);
            return [node, str, symbol.tag]
        case CONST:
            // if is CONST, return node with text node child
            var output = symbol.output;
            node = createMathMLElementsWithChild(symbol.tag, document.createTextNode(output));
            return [node, str, symbol.tag];
        case LEFTBRACKET:
            // if is left bracket symbol, then read expr
            if (symbol.input == "\\left") {
                symbol = getSymbol(str);
                if (symbol != null) {
                    if (symbol.input == ".")
                        symbol.invisible = true;
                    str = removeCharsAndBlanks(str, symbol.input.length);
                }
            }
            result = parseExpr(str, true, false);
            if (symbol == null ||
                (typeof symbol.invisible == "boolean" && symbol.invisible))
                node = createMathMLElementsWithChild("mrow", result[0]);
            else {
                node = createMathMLElementsWithChild("mo", document.createTextNode(symbol.output));
                node = createMathMLElementsWithChild("mrow", node);
                node.appendChild(result[0]);
            }
            return [node, result[1], result[2]];
        case UNARY:
            // if is command with 1 parameter
            result = parseSymbolExpr(str);
            if (result[0] == null) {
                return [createMathMLElementsWithChild(symbol.tag, document.createTextNode(symbol.output)), str]
            }
            // if is function command
            if (typeof symbol.func == "boolean" && symbol.func) {
                st = str.charAt(0);
                // such as \exp, \log
                if (st == '^' || st == '_' || st == ',') {
                    return [createMathMLElementsWithChild(
                        symbol.tag, document.createTextNode(symbol.output)
                    ), str, symbol.tag];
                } else {
                    node = createMathMLElementsWithChild(
                        "mrow", createMathMLElementsWithChild(
                            symbol.tag, document.createTextNode(symbol.output)
                        )
                    );
                    node.appendChild(result[0]);
                    return [node, result[1], symbol.tag];
                }
            }
            // if is sqrt command
            if (symbol.input == "\\sqrt") {
                return [createMathMLElementsWithChild(symbol.tag, result[0]), result[1], symbol.tag]
            } else if (symbol.input == "\\not") {
                // not
                var text = result[0].childNodes[0].nodeValue;
                if (typeof text == "string" && text.length == 1 && text in AMRelationNegations) {
                    result[0].childNodes[0].nodeValue = AMRelationNegations[text];
                    return [createMathMLElementsWithChild(
                        symbol.tag, result[0]
                    ), result[1], symbol.tag];
                }
                // TODO:删除线
                return [createMathMLElementsWithChild(
                    "mo", document.createTextNode("\\")
                ), "not " + str, symbol.tag];

            } else if (typeof symbol.acc == "boolean" && symbol.acc) {
                node = createMathMLElementsWithChild(
                    symbol.tag, result[0]
                );
                let output = symbol.output;
                // if is special mark(accent)
                let node1 = createMathMLElementsWithChild(
                    "mo", document.createTextNode(output)
                );
                // TODO: adjust css
                if (symbol.input == "\\vec" || symbol.input == "\\check") {
                    node1.setAttribute("maxsize", "1.2")
                }
                if (symbol.input == "\\bar") {
                    node1.setAttribute("maxsize", "0.5");
                }
                if (symbol.input == "\\underbrace" || symbol.input == "\\underline") {
                    node1.setAttribute("accentunder", "true");
                } else {
                    node1.setAttribute("accent", "true");
                }
                node.appendChild(node1);
                if (symbol.input == "\\overbrace" || symbol.input == "\\underbrace")
                    node.ttype = UNDEROVER;
                return [node, result[1], symbol.tag];
            } else {
                // TODO:if is type style
            }
        case BINARY:
            // if is binary command, 2 parameters
            result = parseSymbolExpr(str);
            if (result[0] == null) {
                return [createMathMLElementsWithChild("mo", document.createTextNode(symbol.input)), str, null];
            }
            result2 = parseSymbolExpr(result[1]);
            if (result2[0] == null) {
                return [createMathMLElementsWithChild("mo", document.createTextNode(symbol.input)), str, null];
            }
            // if is root or stackrel, the order of parameters is different from frac
            // {over}{under} -> <>under</> <>over</>
            if (symbol.input == "\\root" || symbol.input == "\\stackrel") {
                newFrag.appendChild(result2[0]);
            }
            newFrag.appendChild(result[0]);
            // if is frac
            // {child}{parent} -> <>child</> <>parent</>
            if (symbol.input == "\\frac") {
                newFrag.appendChild(result2[0]);
            }
            return [createMathMLElementsWithChild(symbol.tag, newFrag), result2[1], symbol.tag];
        case UNDEROVER:
            return [createMathMLElementsWithChild(
                symbol.tag, document.createTextNode(symbol.output)), str, symbol.tag];
        case INFIX:
            str = removeCharsAndBlanks(
                str, symbol.input.length
            );
            return [createMathMLElementsWithChild(
                "mo", document.createTextNode(symbol.output)
            ), str, symbol.tag]
        default:
            return [createMathMLElementsWithChild(
                symbol.tag, document.createTextNode(symbol.output)
            ), str, symbol.tag]
    }
}

/**
 * parse infix command before others
 *
 * parse infix differently cause it's position is between 2 parameter
 * @param str
 */
function parseInfixExpr(str) {
    var symbol, sym1, sym2, node, result, tag, underover;
    str = removeCharsAndBlanks(str, 0);
    sym1 = getSymbol(str);
    result = parseSymbolExpr(str);
    node = result[0];
    str = result[1];
    tag = result[2];
    symbol = getSymbol(str);
    // if true the above node is 1st parameter
    if (symbol.ttype == INFIX) {
        // if tag is infix
        str = removeCharsAndBlanks(str, symbol.input.length);
        result = parseSymbolExpr(str);
        // show box in place of missing argument
        if (result[0] == null) {
            result[0] = createMathMLElementsWithChild(
                'mo', document.createTextNode('\u25A1'));
        }
        str = result[1];
        tag = result[2];
        // if is under or over
        if (symbol.input == "_" || symbol.input == "^") {
            // the second parameter
            sym2 = getSymbol(str);
            tag = null;
            // for command like $ /sum_1^k $
            underover = (sym1.ttype == UNDEROVER);
            if (symbol.input == '_' && sym2.input == '^') {
                str = removeCharsAndBlanks(str, sym2.input.length);
                let res2 = parseSymbolExpr(str);
                str = res2[1];
                tag = res2[2];
                node = createMathMLElementsWithChild((underover ? "munderover" : "msubsup"), node);
                node.appendChild(result[0]);
                node.appendChild(res2[0]);
            } else if (symbol.input == "_") {
                node = createMathMLElementsWithChild((underover ? "munder" : "msub"), node);
                node.appendChild(result[0]);
            } else {
                // symbol.input == "^"
                node = createMathMLElementsWithChild((underover ? "mover" : "msup"), node);
                node.appendChild(result[0]);
            }
            node = createMathMLElementsWithChild("mrow", node)
        } else {
            // atop & choose
            node = createMathMLElementsWithChild(symbol.tag, node);
            if (symbol.input == "\\atop" || symbol.input == "\\choose") {

            }
            node.appendChild(result[0])
        }
    }
    return [node, str, tag];
}

/**
 * parse parameter in bracket
 * @param str
 * @param rightbracket
 * @param matrix
 */
function parseExpr(str, rightbracket, matrix) {
    var symbol, node, result, i, tag,
        newFrag = document.createDocumentFragment();
    do {
        // if not in bracket or
        str = removeCharsAndBlanks(str, 0);
        result = parseInfixExpr(str);
        node = result[0];
        str = result[1];
        tag = result[2];
        symbol = getSymbol(str);
        if (node != undefined) {
            if ((tag == "mn" || tag == "mi") && symbol != null &&
                typeof symbol.func == "boolean" && symbol.func) {
                // add space before \sin in 2\sin x
                let space = createMathMLElements("mspace");
                space.setAttribute("width", "0.167em");
                node = createMathMLElementsWithChild("mrow", node);
                node.appendChild(space);
            }
            newFrag.appendChild(node);
        }
    } while ((symbol.ttype != RIGHTBRACKET) && symbol != null
    && symbol.output != "");
    tag = null;
    // if get right bracket, back to top level
    if (symbol.ttype == RIGHTBRACKET) {
        if (symbol.input == "\\right") {
            str = removeCharsAndBlanks(str, symbol.input.length);
            symbol = getSymbol(str);
            if (symbol != null && symbol.input == '.') {
                symbol.invisible = true;
            }
            if (symbol != null) {
                tag = symbol.rtag;
            }
        }
        if (symbol != null) {
            str = removeCharsAndBlanks(str, symbol.input.length);
        }
        var len = newFrag.childNodes.length;
        // if the bracket is matrix
        if (matrix) {
        }
        if (typeof symbol.invisible != "boolean" || !symbol.invisible) {
            node = createMathMLElementsWithChild("mo", document.createTextNode(symbol.output));
            newFrag.appendChild(node);
        }
        return [newFrag, str, tag];
    }
    return [newFrag, str, tag];
}

/**
 *
 * @param {*} str latex公式源代码
 * @returns
 */
export function parseMath(str) {
    var node = createMathMLElements("mstyle");
    // TODO:set mstyle

    node.appendChild(parseExpr(str.replace(/^\s+/g, ""), false, false)[0]);
    node = createMathMLElementsWithChild("math", node);
    return node;
}

/**
 * important!!!!!!!
 */
initSymbols()

// let msg = '\\frac12'
// // let msg = '\\sqrt{1+\\sqrt{1+\\sqrt{1+\\sqrt{1+\\sqrt{1+\\sqrt{1+\\sqrt{1+x}}}}}}}'
// let msg2 = '\\Gamma(t) = \\lim_{n \\to \\infty} \\frac{n! \\; n^t}{t \\; (t+1)\\cdots(t+n)}= \\frac{1}{t} \\prod_{n=1}^\\infty \\frac{\\left(1+\\frac{1}{n}\\right)^t}{1+\\frac{t}{n}} = \\frac{e^{-\\gamma t}}{t} \\prod_{n=1}^\\infty \\left(1 + \\frac{t}{n}\\right)^{-1} e^{\\frac{t}{n}}'
// msg = removeCharsAndBlanks(msg, 0);
// let sym = parseMath(msg)
// sym.setAttribute('id', 'math1')
// // console.log(parseStrExpr(msg))
// // console.log(sym)
// document.body.appendChild(sym)

import * as htmlToImage from 'html-to-image';
import {toPng, toJpeg, toBlob, toPixelData, toSvg} from 'html-to-image';

// function filter (node) {
//     return (node.tagName !== 'i');
// }

// htmlToImage.toSvg(document.getElementById('math1'), { filter: filter })
//     .then(function (dataUrl) {
//         /* do something */
//         console.log(dataUrl)
//     });


