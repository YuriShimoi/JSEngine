/** =-=-= WAKEUPASSIST =-=-= */
var EXECUTEWHENDOCREADY = [];
function documentReady(fn) {
    EXECUTEWHENDOCREADY.push(fn);
}
var documentWakeUpInterval = setInterval(()=>{if(document.readyState!="complete")return;clearInterval(documentWakeUpInterval);
    EXECUTEWHENDOCREADY.map(fn => fn());
},1);


/** =-=-= DRAWERS =-=-= */
documentReady(() => {
        var drawerCloseBtn = document.getElementsByClassName("drawer-close");
        for(let drawerCloseIndex = 0; drawerCloseIndex < drawerCloseBtn.length; drawerCloseIndex++) {
            drawerCloseBtn[drawerCloseIndex].addEventListener("click", () => {
                let drawerCloseParentClasses = drawerCloseBtn[drawerCloseIndex].parentElement.classList;
                if(drawerCloseParentClasses.contains("drawer")) {
                    if(drawerCloseParentClasses.contains("drawer-closed"))
                        drawerCloseParentClasses.remove("drawer-closed");
                    else
                        drawerCloseParentClasses.add("drawer-closed");
                }
            });
        }
    }
);