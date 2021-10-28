const MAPINITSIZE = {x: 15, y:9};
var gridMap = new GridMap(MAPINITSIZE.x, MAPINITSIZE.y);

documentReady(() => {
    gridMap.init("#mapChess");
    gridMap.newTile(7, 4);

    let darkThemeBtn = document.getElementById("dark-theme");
    darkThemeBtn.addEventListener("click", () => {
        darkThemeBtn.classList.toggle("dark-active");
        document.body.setAttribute("dark-theme", darkThemeBtn.classList.contains("dark-active"));
    });
});

function toggleTilesetWindow(event=null) {
    if(event !== null && event.target !== event.currentTarget)
        return;
    document.getElementById("tileset-container").toggleAttribute("hidden");

    if(!document.getElementById("tileset-container").hasAttribute("hidden"))
        refreshTilesetWindow();
}

function refreshTilesetWindow() {
    let tilesetTexture = document.getElementById("tileset-form-texture");
    if(tilesetTexture.children.length == ImageLoader.files.length)
        return;

    for(let imgFile = tilesetTexture.children.length; imgFile < ImageLoader.files.length; imgFile++) {
        let tilesetTextureOption = document.createElement("option");
        tilesetTextureOption.id = `tileset-texture-option-${imgFile}`;
        tilesetTextureOption.innerHTML = ImageLoader.files[imgFile].file.name.split(".")[0];
        tilesetTexture.append(tilesetTextureOption);
    }
}