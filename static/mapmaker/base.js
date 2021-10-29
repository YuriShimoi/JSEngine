const MAPINITSIZE = {x: 41, y:23};
var gridMap = new GridMap(MAPINITSIZE.x, MAPINITSIZE.y);

documentReady(() => {
    gridMap.init("#mapChess");
    gridMap.newTile(20, 11);

    let darkThemeBtn = document.getElementById("dark-theme");
    darkThemeBtn.addEventListener("click", () => {
        darkThemeBtn.classList.toggle("dark-active");
        document.body.setAttribute("dark-theme", darkThemeBtn.classList.contains("dark-active"));
    });

    document.getElementById("file-input").addEventListener("change", () => { setTimeout(updatePaletteImages, 1) });
});

function togglePaletteWindow(event=null) {
    if(event !== null && event.target !== event.currentTarget)
        return;
    document.getElementById("palette-container").toggleAttribute("hidden");

    if(!document.getElementById("palette-container").hasAttribute("hidden"))
        refreshPaletteWindow();
}

function refreshPaletteWindow() {
    updatePaletteImages();

}

function updatePaletteImages() {
    let paletteTexture = document.getElementById("palette-form-texture");
    if((paletteTexture.children.length - 1) == ImageLoader.files.length)
        return;

    let selectFirstAtEnd = paletteTexture.children.length == 1 && ImageLoader.files.length;
    for(let imgFile = paletteTexture.children.length - 1; imgFile < ImageLoader.files.length; imgFile++) {
        let paletteTextureOption = document.createElement("option");
        paletteTextureOption.value = imgFile;
        paletteTextureOption.innerHTML = ImageLoader.files[imgFile].file.name.split(".")[0];
        paletteTexture.append(paletteTextureOption);
    }
    if(selectFirstAtEnd) paletteTexture.value = 0;
}