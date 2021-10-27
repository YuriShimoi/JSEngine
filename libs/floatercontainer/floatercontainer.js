documentReady(() => {
    let floaterContainers = document.getElementsByClassName("floatercontainer");
    for(flc = 0; flc < floaterContainers.length; flc++) {
        let FloaterContainersContainer = document.createElement("div");
        FloaterContainersContainer.classList.add("floatercontainer-container");
        FloaterContainersContainer.append(floaterContainers[flc]);
        document.body.append(FloaterContainersContainer);
    }
});