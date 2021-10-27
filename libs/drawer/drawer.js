documentReady(() => {
    var drawerCloseBtn = document.getElementsByClassName("drawer-bookmark");
    for(let drawerCloseIndex = 0; drawerCloseIndex < drawerCloseBtn.length; drawerCloseIndex++) {
        drawerCloseBtn[drawerCloseIndex].addEventListener("click", () => {
            let drawerCloseParentClasses = drawerCloseBtn[drawerCloseIndex].parentElement.classList;
            if(drawerCloseParentClasses.contains("drawer")) {
                if(drawerCloseParentClasses.contains("drawer-closed"))
                    drawerCloseParentClasses.remove("drawer-closed");
                else if(!drawerCloseBtn[drawerCloseIndex].parentElement.hasAttribute("unclosable"))
                        drawerCloseParentClasses.add("drawer-closed");
            }
            else if(drawerCloseParentClasses.contains("multi-drawer-bookmarks")) {
                let drawerCloseParentId = drawerCloseBtn[drawerCloseIndex].getAttribute("for");
                let drawerFoundParentClasses = document.getElementById(drawerCloseParentId).classList;

                let multiDrawerParentClasses = drawerCloseBtn[drawerCloseIndex].parentElement.parentElement.classList;
                if(multiDrawerParentClasses.contains("drawer-closed")) {
                    multiDrawerParentClasses.remove("drawer-closed");
                    
                    let drawerFoundParentSiblings = document.getElementById(drawerCloseParentId).parentElement.getElementsByClassName("drawer-opened")
                    for(let dfps=0; dfps < drawerFoundParentSiblings.length; dfps++)
                        drawerFoundParentSiblings[dfps].classList.remove("drawer-opened");

                    drawerFoundParentClasses.add("drawer-opened");
                    drawerCloseBtn[drawerCloseIndex].classList.add("drawer-bookmark-focused");
                }
                else {
                    if(drawerCloseBtn[drawerCloseIndex].classList.contains("drawer-bookmark-focused")
                    && !drawerCloseBtn[drawerCloseIndex].parentElement.parentElement.hasAttribute("unclosable")) {
                        multiDrawerParentClasses.add("drawer-closed");
                        drawerCloseBtn[drawerCloseIndex].classList.remove("drawer-bookmark-focused");
                    }
                    else {
                        let drawerCloseBtnSiblings = drawerCloseBtn[drawerCloseIndex].parentElement.getElementsByClassName("drawer-bookmark-focused");
                        for(let dcbs=0; dcbs < drawerCloseBtnSiblings.length; dcbs++)
                            drawerCloseBtnSiblings[dcbs].classList.remove("drawer-bookmark-focused");
                        
                        let drawerFoundParentSiblings = document.getElementById(drawerCloseParentId).parentElement.getElementsByClassName("drawer-opened")
                        for(let dfps=0; dfps < drawerFoundParentSiblings.length; dfps++)
                            drawerFoundParentSiblings[dfps].classList.remove("drawer-opened");

                        drawerFoundParentClasses.add("drawer-opened");
                        drawerCloseBtn[drawerCloseIndex].classList.add("drawer-bookmark-focused");
                    }
                }
            }
        });
    }
});