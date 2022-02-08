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
    if(event !== null && event.target !== event.currentTarget)
        return;
    
    if(plt === null && selected_palette !== -1)
        refreshPaletteWindow();

    selected_palette = plt;

    if(selected_palette !== null && selected_palette !== -1) {
        palette_on_config.loadConfiguration(palette_list[selected_palette].config);
        document.getElementById("palette-form-name").value = palette_list[selected_palette].name;
    }

    document.getElementById("palette-container").toggleAttribute("hidden");
    GlobalSpritePaletteHolder.clear();
}

function savePalette() {
    let palette_name = document.getElementById("palette-form-name").value;
    palette_name = palette_name !== ""? palette_name: null;

    if(selected_palette === -1)
        newPaletteLabel(palette_name);
    else
        updatePaletteLabel(palette_name);
    selected_palette = null;
}

function newPaletteLabel(pltName=null) {
    let palette_name = pltName?? `palette-${Object.keys(palette_list).length+1}`;

    let container = document.getElementById("palette-label-container");
    
    let el_plt = document.createElement("div");
    el_plt.classList.add("palette-label");
    el_plt.id = `plt-${Object.keys(palette_list).length}`;

    let el_plt_header = document.createElement("div");
    el_plt_header.classList.add("palette-label-header");
    // HEADER
    let el_plt_name = document.createElement("h4");
    el_plt_name.classList.add("palette-label-title");
    el_plt_name.innerHTML = palette_name;
    el_plt_header.append(el_plt_name);

    let el_plt_edt = document.createElement("button");
    el_plt_edt.classList.add("palette-label-button");
    el_plt_edt.innerHTML = "E";
    el_plt_edt.onclick = () => togglePaletteWindow(el_plt.id);
    el_plt_header.append(el_plt_edt);

    let el_plt_del = document.createElement("button");
    el_plt_del.classList.add("palette-label-button");
    el_plt_del.innerHTML = "X";
    el_plt_header.append(el_plt_del);
    // HEADER
    el_plt.append(el_plt_header);

    let el_plt_body = document.createElement("div");
    el_plt_body.classList.add("palette-label-body");
    el_plt.append(el_plt_body);

    container.append(el_plt);
    palette_list[el_plt.id] = {
        'name'  : palette_name,
        'config': palette_on_config.getConfiguration()
    };
}

function updatePaletteLabel(pltName=null) {
    palette_list[selected_palette].config = palette_on_config.getConfiguration();
    if(pltName !== "" && pltName !== null) {
        palette_list[selected_palette].name = pltName;
        document.getElementById(selected_palette)
                .getElementsByClassName("palette-label-title")[0]
                .innerHTML = pltName;
    }
}

function refreshPaletteWindow() {
    updatePaletteImages();

    palette_on_config.clear();
    document.getElementById("palette-form-name").value = "";
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