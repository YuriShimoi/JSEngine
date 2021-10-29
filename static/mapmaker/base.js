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
});

function togglePaletteWindow(event=null) {
    if(event !== null && event.target !== event.currentTarget)
        return;
    document.getElementById("palette-container").toggleAttribute("hidden");

    if(!document.getElementById("palette-container").hasAttribute("hidden"))
        refreshPaletteWindow();
}

function refreshPaletteWindow() {
    let paletteTexture = document.getElementById("palette-form-texture");
    if((paletteTexture.children.length - 1) == ImageLoader.files.length)
        return;

    for(let imgFile = paletteTexture.children.length - 1; imgFile < ImageLoader.files.length; imgFile++) {
        let paletteTextureOption = document.createElement("option");
        paletteTextureOption.value = imgFile;
        paletteTextureOption.innerHTML = ImageLoader.files[imgFile].file.name.split(".")[0];
        paletteTexture.append(paletteTextureOption);
    }
}