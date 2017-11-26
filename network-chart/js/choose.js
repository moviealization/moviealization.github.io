var genreValue = "";
function loadJS(v){
    var d=document, h=d.getElementsByTagName('head')[0], newScript;
    try {h.removeChild(d.getElementById('lib_lang'));} catch (e){}
    newScript      = d.createElement('script');
    newScript.id   = 'lib_lang';
    newScript.type = 'text/javascript';
    newScript.src  = 'js/network.js?v=3';   // change your path here
    genreValue     = v;
    h.appendChild(newScript);}