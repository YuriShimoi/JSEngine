class ImageLoader {
    static files = [];
    static newFile(file, loadedInput, loadedElement=null) {
        let fileLoaded = {
            file: file,
            input: loadedInput,
            element: loadedElement
        };
        this.files.push(fileLoaded);
    }
}

documentReady(() => {
    let imageLoaderContainers = document.getElementsByClassName("imageloader");
    for(let ilc=0; ilc < imageLoaderContainers.length; ilc++) {
        let imageLoaderPixelPerfectToggle = document.createElement("input");
        imageLoaderPixelPerfectToggle.type = "checkbox";
        imageLoaderPixelPerfectToggle.id = `imageloader-pixeltoggle-${ilc}`;
        imageLoaderPixelPerfectToggle.classList.add("imageloader-pixeltoggle");
        imageLoaderContainers[ilc].append(imageLoaderPixelPerfectToggle);

        let imageLoaderTargetId = imageLoaderContainers[ilc].getAttribute("for");
        let imageLoaderTarget   = document.getElementById(imageLoaderTargetId);
        imageLoaderTarget.addEventListener("change", (e) => {
            let loadedFiles = e.target.files;

            if (FileReader && loadedFiles && loadedFiles.length) {
                for(let lfl=0; lfl < loadedFiles.length; lfl++) {
                    let fileReader = new FileReader();
                    fileReader.onload = function () {
                        let imageLoaderImage = document.createElement("img");
                        imageLoaderImage.classList.add("imageloader-image");
                        imageLoaderImage.src = fileReader.result;
                        imageLoaderContainers[ilc].append(imageLoaderImage);

                        ImageLoader.newFile(loadedFiles[lfl], imageLoaderTarget, imageLoaderImage);
                    }
                    fileReader.readAsDataURL(loadedFiles[lfl]);
                }
            }
        });
    }
});