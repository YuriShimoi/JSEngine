class GridMap {
    _parentElement = null;
    _instance = null;
    _mapping = [];
    _internal = class GridMapInternal {
        static instantiate(gmap) {
            let gridmapArrowClasses = dir => `gridmap-arrow gridmap-arrow-${dir}`;

            let eInstance = document.createElement("div");
            eInstance.classList.add("gridmap-content");
            eInstance.setAttribute("uuid", gmap._uuid);
            
            let gridMapTable = document.createElement("table");
            gridMapTable.classList.add("gridmap-table");

            let gridMapTableTop = gridMapTable.createTHead().insertRow();
            gridMapTableTop.insertCell(0);

            let gridMapTableCellTop = gridMapTableTop.insertCell(1);
            gridMapTableCellTop.classList = gridmapArrowClasses("top");
            gridMapTableCellTop.setAttribute("onmousedown", "GridMapHandler.arrow(this)");

            let gridMapTableMiddle = gridMapTable.createTBody().insertRow();

            let gridMapTableCellLeft = gridMapTableMiddle.insertCell(0);
            gridMapTableCellLeft.classList = gridmapArrowClasses("left");
            gridMapTableCellLeft.setAttribute("onmousedown", "GridMapHandler.arrow(this)");

            gridMapTableMiddle.insertCell(1).append(this.mapGrid({x:gmap.sizeX, y:gmap.sizeY}, gmap._mapping));

            let gridMapTableCellRight = gridMapTableMiddle.insertCell(2);
            gridMapTableCellRight.classList = gridmapArrowClasses("right");
            gridMapTableCellRight.setAttribute("onmousedown", "GridMapHandler.arrow(this)");

            let gridMapTableFot = gridMapTable.createTFoot().insertRow();
            gridMapTableFot.insertCell(0);

            let gridMapTableCellBottom = gridMapTableFot.insertCell(1);
            gridMapTableCellBottom.classList = gridmapArrowClasses("bottom");
            gridMapTableCellBottom.setAttribute("onmousedown", "GridMapHandler.arrow(this)");
            
            eInstance.append(gridMapTable);
            gmap._instance = eInstance;
            gmap._parentElement.append(eInstance);
        }

        static mapGrid(size, mapping) {
            let generatedGrid = document.createElement("div");
            generatedGrid.classList.add("gridmap-grid");

            this.reZoom(size, 50, mapping, generatedGrid);
            this.removeOutOfGrid(size, mapping);

            return generatedGrid;
        }

        static reMap(dir, amount, mapping, zoom) {
            mapping.map(tle => {
                let tlePos = tle.getAttribute("gridpos").split('|').map(x => parseInt(x)); // x-y
                if(dir.x == -1) {
                    tlePos[0] += amount;
                    tle.style.left = `${tlePos[0] * zoom}px`;
                }
                if(dir.y == -1) {
                    tlePos[1] += amount;
                    tle.style.top = `${tlePos[1] * zoom}px`;
                }
                tle.setAttribute("gridpos", tlePos.join('|'));
            });
        }

        static reZoom(size, zoom, mapping, gridInstance) {
            gridInstance.style.width  = `${size.x * zoom}px`;
            gridInstance.style.height = `${size.y * zoom}px`;
            gridInstance.style.setProperty("--grid-zoom", `${zoom}px`);
            

            mapping.map(tle => {
                let tlePos = tle.getAttribute("gridpos").split('|').map(x => parseInt(x)); // x-y
                tle.style.left = `${tlePos[0] * zoom}px`; // x
                tle.style.top  = `${tlePos[1] * zoom}px`; // y

                tle.style.marginBottom = `-${zoom}px`;
            });
        }

        static chessTrick(dir, amount, gridInstance) {
            if(dir.x == -1) {
                let lastChessTrick = parseInt(window.getComputedStyle(gridInstance).getPropertyValue("--grid-chess-trick-x"));
                gridInstance.style.setProperty("--grid-chess-trick-x", (lastChessTrick + amount) % 2);
            }
            if(dir.y == -1) {
                let lastChessTrick = parseInt(window.getComputedStyle(gridInstance).getPropertyValue("--grid-chess-trick-y"));
                gridInstance.style.setProperty("--grid-chess-trick-y", (lastChessTrick + amount) % 2);
            }
        }

        static removeOutOfGrid(size, mapping) {
            let outOfGridCriteria = pos => (pos[0] >= size.x || pos[0] < 0) || (pos[1] >= size.y || pos[1] < 0);

            for(let tle=0; tle < mapping.length; tle++) {
                let tlePos = mapping[tle].getAttribute("gridpos").split('|').map(x => parseInt(x)); // x-y
                if(outOfGridCriteria(tlePos)) {
                    mapping[tle].remove();
                    mapping.splice(tle, 1);
                    tle--;
                }
            }
            return mapping;
        }
    }

    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this._zoom = 50;

        this._uuid = [...(new Date().toJSON())].sort(_=>Math.random()-.5).join('');
        GridMapHandler._instanceHolder[this._uuid] = this;
    }

    init(eQuery) {
        if(this.parentElement != null && this.instance != null)
            this.parentElement.remove(this.instance);
        this._parentElement = document.querySelector(eQuery);

        this._internal.instantiate(this);
        return true;
    }

    resize(dir, amount=1) {
        if(dir.x != 0) this.sizeX += amount;
        if(dir.y != 0) this.sizeY += amount;

        this._internal.reZoom({x:this.sizeX, y:this.sizeY}, this._zoom, this._mapping, this._instance.querySelector(".gridmap-grid"));

        if(dir.x == -1 || dir.y == -1) {
            this._internal.chessTrick(dir, amount, this._instance.querySelector(".gridmap-grid"));
            this._internal.reMap(dir, amount, this._mapping, this._zoom);
            this._internal.removeOutOfGrid({x:this.sizeX, y:this.sizeY}, this._mapping);
        }
        return true;
    }

    setZoom(newZoom) {
        this._zoom = newZoom < 5? 5: newZoom > 500? 500: newZoom;
        this._internal.reZoom({x:this.sizeX, y:this.sizeY}, this._zoom, this._mapping, this._instance.querySelector(".gridmap-grid"));
        return this._zoom;
    }

    newTile(x, y) {
        if((x >= this.sizeX || x < 0) || (y >= this.sizeY || y < 0)) {
            console.warn(`Invalid tile position, out of bounds. [${x},${y}]`);
            return null;
        }

        let newBlankTile = document.createElement("div");
        newBlankTile.classList.add("gridmap-gridtile");
        newBlankTile.setAttribute("gridpos", `${x}|${y}`);

        newBlankTile.style.left = `${this._zoom * x}px`;
        newBlankTile.style.top  = `${this._zoom * y}px`;
        
        newBlankTile.style.marginBottom = `-${this._zoom}px`;

        this._instance.querySelector(".gridmap-grid").append(newBlankTile);
        
        this._mapping.push(newBlankTile);
        return newBlankTile;
    }
}

class GridMapHandler {
    static _instanceHolder = {};
    static arrow(e) {
        let findParentGridContent = (childElement) => {
            let foundParent = childElement.parentElement;

            if(foundParent == null || foundParent.tagName.toUpperCase() == "BODY")
                return null;
            if(foundParent.classList.contains("gridmap-content"))
                return foundParent;
            return findParentGridContent(foundParent);
        }

        let parentGridContent = findParentGridContent(e);
        if(parentGridContent == null) {
            console.warn("Element has no valid gridmap parent.");
            return null;
        }

        let dir = {x:0, y:0};
        if(e.classList.contains("gridmap-arrow-left"))   dir.x = -1;
        if(e.classList.contains("gridmap-arrow-right"))  dir.x =  1;
        if(e.classList.contains("gridmap-arrow-top"))    dir.y = -1;
        if(e.classList.contains("gridmap-arrow-bottom")) dir.y =  1;
        console.log(dir);
        
        let parentInstance = this._instanceHolder[parentGridContent.getAttribute("uuid")];
        
        parentInstance.resize(dir);
    }
}