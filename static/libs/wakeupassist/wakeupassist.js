var EXECUTEWHENDOCREADY = [];
function documentReady(fn) {
    EXECUTEWHENDOCREADY.push(fn);
}
var documentWakeUpInterval = setInterval(()=>{if(document.readyState!="complete")return;clearInterval(documentWakeUpInterval);
    EXECUTEWHENDOCREADY.map(fn => fn());
},1);