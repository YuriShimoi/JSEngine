const MAPINITSIZE = {x: 41, y:23};
var gridMap = new GridMap(MAPINITSIZE.x, MAPINITSIZE.y);
var palette = null;
var selected_palette = null; // -1 == new
var palette_list = {};
var palette_on_config = null;


documentReady(() => {
    gridMap.init("#mapChess");
    // gridMap.newTile(20, 11);

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

    GlobalSpritePaletteHolder.clickTrigger(() => {
        let hold_parent = GlobalSpritePaletteHolder._holdTile?.parentElement?? null;
        while(hold_parent !== null
            && hold_parent.id != "palette-label-container"
            && hold_parent.tagName != "BODY") {
            hold_parent = hold_parent.parentElement;
        }
        if(hold_parent === null || hold_parent.id === "palette-label-container") {
            document.getElementById("tool-tile").innerHTML = "";
            if(hold_parent !== null) {
                let ttile = document.createElement("span");
                
                let sizeConvert = (strSize) => (strSize.slice(0, -2)/48*40 + "px");
                ttile.style.setProperty(
                    "background-image",
                    GlobalSpritePaletteHolder._holdTile.style.backgroundImage
                );
                ttile.style.setProperty(
                    "background-size",
                    GlobalSpritePaletteHolder._holdTile
                    .style.backgroundSize.split(' ').map(s => sizeConvert(s)).join(' ')
                );
                ttile.style.setProperty(
                    "background-position",
                    GlobalSpritePaletteHolder._holdTile
                    .style.backgroundPosition.split(' ').map(s => sizeConvert(s)).join(' ')
                );
                
                document.getElementById("tool-tile").append(ttile);
            }
        }
    });

    let draw_tools = document.getElementById("drawing-tools")
                             .getElementsByClassName("draw-tool");
    for(let dt=0; dt < draw_tools.length; dt++) {
        draw_tools[dt].onclick = (e) => {
            e.target.parentElement.parentElement
                    .querySelectorAll(".draw-tool[active]")
                    .forEach(drt => drt.removeAttribute("active"));
            e.target.setAttribute("active", true);
            GridMapHandler._cursorHolder.mode = Number(e.target.getAttribute("mode"));
        };
    }

    let layer_input = document.getElementById("tool-layer")
                              .getElementsByTagName("input")[0];
    layer_input.onkeydown = (e) => {
        let li_val = Number(e.target.value);
        let li_min = Number(e.target.min);
        let li_max = Number(e.target.max);

        let last_value = li_val;
        if(li_val < li_min) last_value = li_min;
        if(li_val > li_max) last_value = li_max;
        
        e.target.setAttribute("lastValue", last_value);
    };
    layer_input.onkeyup = (e) => {
        let li_val = Number(e.target.value);
        let li_min = Number(e.target.min);
        let li_max = Number(e.target.max);
        if(li_val < li_min || li_val > li_max) {
            let li_last_value = Number(e.target.getAttribute("lastValue"));
            e.target.value = li_last_value;
        }
    };

    let visib_input = document.getElementById("tool-visibility");
    visib_input.onclick = () => {
        visib_input.toggleAttribute("active");
        // visib_input.hasAttribute("active");
    };
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
    el_plt_edt.innerHTML = "⇗";
    el_plt_edt.style.fontSize = "large";
    el_plt_edt.style.lineHeight = "26px";
    el_plt_edt.onclick = () => togglePaletteWindow(el_plt.id);
    el_plt_header.append(el_plt_edt);

    let el_plt_del = document.createElement("button");
    el_plt_del.classList.add("palette-label-button");
    el_plt_del.innerHTML = "⨯";
    el_plt_del.onclick = () => deletePaletteWindow(el_plt.id);
    el_plt_header.append(el_plt_del);
    // HEADER
    el_plt.append(el_plt_header);

    let el_plt_body = document.createElement("div");
    el_plt_body.classList.add("palette-label-body");
    // BODY
    let el_plt_spr = document.createElement("div");
    el_plt_spr.classList.add("palette-label-spritesheet");
    el_plt_spr.setAttribute("palette-draw", "false");

    let el_plt_spr_config = new SpritePalette(el_plt_spr, {x:24,y:24});
    el_plt_spr_config.loadConfiguration(palette_on_config.getConfiguration());

    el_plt_body.append(el_plt_spr);
    // BODY
    el_plt.append(el_plt_body);

    container.append(el_plt);
    palette_list[el_plt.id] = {
        'name'  : palette_name,
        'config': palette_on_config.getConfiguration()
    };
}

function updatePaletteLabel(pltName=null) {
    palette_list[selected_palette].config = palette_on_config.getConfiguration();
    
    let plt_sheet = document.getElementById(selected_palette)
                            .getElementsByClassName("palette-label-spritesheet")[0];
    plt_sheet.innerHTML = "";
    let plt_sheet_cfg = new SpritePalette(plt_sheet, {x:24,y:24});
    plt_sheet_cfg.loadConfiguration(palette_on_config.getConfiguration());

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

function deletePaletteWindow(plt) {
    if(confirm("Delete palette?")) {
        palette_list[plt] = null;
        document.getElementById(plt).remove();
    }
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