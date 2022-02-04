const MAPINITSIZE = {x: 41, y:23};
var gridMap = new GridMap(MAPINITSIZE.x, MAPINITSIZE.y);
var palette = null;
var selected_palette = null; // -1 == new
var palette_list = {};
var palette_on_config = null;


documentReady(() => {
    gridMap.init("#mapChess");
    gridMap.newTile(20, 11);

    let darkThemeBtn = document.getElementById("dark-theme");
    darkThemeBtn.classList.add("dark-active");
    document.body.setAttribute("dark-theme", true);
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

    let paletteConfig = document.getElementById("palette-config-grid");
    palette_on_config = new SpritePalette(paletteConfig, {x:24,y:24});
    palette_on_config.loadEmpty({x:5,y:10});

    document.getElementById("palette-form-confirm").addEventListener("click", () => {
        savePalette();
        togglePaletteWindow();
    });
});

function togglePaletteWindow(plt=null, event=null) {
    selected_palette = plt;

    if(event !== null && event.target !== event.currentTarget)
        return;
    document.getElementById("palette-container").toggleAttribute("hidden");
    GlobalSpritePaletteHolder.clear();

    if(!document.getElementById("palette-container").hasAttribute("hidden"))
        refreshPaletteWindow();
}

function savePalette() {
    let palette_name = document.getElementById("palette-form-name").value;
    palette_name = palette_name !== ""? palette_name: null;

    newPaletteLabel(palette_name);
}

function newPaletteLabel(pltName=null) {    
    let container = document.getElementById("palette-label-container");
    
    let el_plt = document.createElement("div");
    el_plt.classList.add("palette-label");
    el_plt.id = `plt-${Object.keys(palette_list).length}`;

    let el_plt_name = document.createElement("h4");
    el_plt_name.classList.add("palette-label-title");
    el_plt_name.innerHTML = pltName?? `palette-${Object.keys(palette_list).length+1}`;
    el_plt.append(el_plt_name);
    
    container.append(el_plt);
    palette_list[el_plt.id] = palette_on_config.getConfiguration();
    // TODO: add to object SpritePalette an configuration import/export method
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
        palette = new SpritePalette(paletteLoaderGrid, {x: sizeX,y:sizeY});
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