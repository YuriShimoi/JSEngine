const MAPINITSIZE = {x: 12, y:9};
var gridMap = new GridMap(MAPINITSIZE.x, MAPINITSIZE.y);

documentReady(() => {
    gridMap.init("#mapChess");
    gridMap.newTile(6, 5);
});