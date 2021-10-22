const MAPINITSIZE = {x: 9, y:5};
var gridMap = new GridMap(MAPINITSIZE.x, MAPINITSIZE.y);

documentReady(() => {
    gridMap.init("#mapChess");
});