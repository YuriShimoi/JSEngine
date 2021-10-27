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

function toggleTilesetWindow() {
    document.getElementById("tileset-container").toggleAttribute("hidden");
}

function refreshTilesetWindow() {
    
}