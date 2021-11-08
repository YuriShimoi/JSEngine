const MAPINITSIZE = {x: 41, y:23};
var gridMap = new GridMap(MAPINITSIZE.x, MAPINITSIZE.y);
var palette = null;

documentReady(() => {
    gridMap.init("#mapChess");
    gridMap.newTile(20, 11);

    let darkThemeBtn = document.getElementById("dark-theme");
    darkThemeBtn.addEventListener("click", () => {
        darkThemeBtn.classList.toggle("dark-active");
        document.body.setAttribute("dark-theme", darkThemeBtn.classList.contains("dark-active"));
    });

    document.getElementById("file-input").addEventListener("change", () => {
        let checkPalettes = setInterval(() => {
            if(ImageLoader.files.length == 0) return;
            updatePaletteImages();
            clearInterval(checkPalettes);
        }, 1);
    });

    let paletteImage = document.getElementById("palette-form-texture");
    paletteImage.addEventListener("change", () => { paletteTextureUpdate(paletteImage) });
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

    
    if((paletteTexture.children.length - 1) == ImageLoader.files.length) {
        if(paletteTexture.value !== '-1')
            paletteTextureUpdate(paletteTexture);

        return;
    }

    let firstSelection = paletteTexture.children.length == 1 && ImageLoader.files.length;
    for(let imgFile = paletteTexture.children.length - 1; imgFile < ImageLoader.files.length; imgFile++) {
        let paletteTextureOption = document.createElement("option");
        paletteTextureOption.value = imgFile;
        paletteTextureOption.innerHTML = ImageLoader.files[imgFile].file.name.split(".")[0];
        paletteTexture.append(paletteTextureOption);
    }
    if(firstSelection) {
        let sizeX = parseInt(document.getElementById("palette-form-x").value);
        let sizeY = parseInt(document.getElementById("palette-form-y").value);
        let paletteLoaderGrid = document.getElementById("palette-loader-grid");
        palette = new SpritePalette(paletteLoaderGrid, {'x': sizeX, 'y': sizeY});
        paletteTexture.value = 0;
        paletteTextureUpdate(paletteTexture);
    }
}

function paletteTextureUpdate(paletteImage) {
    let sizeX = parseInt(document.getElementById("palette-form-x").value);
    let sizeY = parseInt(document.getElementById("palette-form-y").value);
    palette.resize({'x': sizeX, 'y':sizeY});
    palette.loadImage(ImageLoader.files[parseInt(paletteImage.value)].element);
}