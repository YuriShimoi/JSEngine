window.EXECUTEWHENDOCREADY = [];
window.documentReady = function documentReady(fn) { EXECUTEWHENDOCREADY.push(fn) }
documentWakeUpInterval = setInterval(()=>{
    if(document.readyState != "complete") return;
    clearInterval(documentWakeUpInterval);
    delete documentWakeUpInterval;
    EXECUTEWHENDOCREADY.map(fn => fn());
},1);