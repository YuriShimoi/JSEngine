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

            let gridMapCursor = document.createElement("div");
            gridMapCursor.classList.add("gridmap-cursor");
            gridMapCursor.setAttribute("animated", "true");
            generatedGrid.append(gridMapCursor);
            generatedGrid.setAttribute("onmousemove",  "GridMapHandler.cursor('move',  event, this)");
            generatedGrid.setAttribute("onmousedown",  "GridMapHandler.cursor('down',  event, this)");
            generatedGrid.setAttribute("onmouseup",    "GridMapHandler.cursor('up',    event, this)");
            generatedGrid.setAttribute("onmouseleave", "GridMapHandler.cursor('leave', event, this)");

            this.reZoom(size, 48, mapping, generatedGrid);
            this.removeOutOfGrid(size, mapping);

            return generatedGrid;
        }

        static reMap(dir, amount, mapping, zoom) {
            mapping.map(tle => {
                if(dir.x == -1) {
                    tle.pos.x += amount;
                    tle.element.style.left = `${tle.pos.x * zoom}px`;
                }
                if(dir.y == -1) {
                    tle.pos.y += amount;
                    tle.element.style.top = `${tle.pos.y * zoom}px`;
                }
                tle.element.setAttribute("gridpos", Object.values(tle.pos).join('|'));
            });
        }

        static reZoom(size, zoom, mapping, gridInstance) {
            gridInstance.style.width  = `${size.x * zoom}px`;
            gridInstance.style.height = `${size.y * zoom}px`;
            gridInstance.style.setProperty("--grid-zoom", `${zoom}px`);
            

            mapping.map(tle => {
                tle.element.style.left = `${tle.pos.x * zoom}px`;
                tle.element.style.top  = `${tle.pos.y * zoom}px`;

                tle.element.style.marginBottom = `-${zoom}px`;
            });
        }

        static chessTrick(dir, amount, gridInstance) {
            if(dir.x == -1) {
                let lastChessTrick = parseInt(window.getComputedStyle(gridInstance).getPropertyValue("--grid-chess-trick-x"));
                gridInstance.style.setProperty("--grid-chess-trick-x", (lastChessTrick + amount));
            }
            if(dir.y == -1) {
                let lastChessTrick = parseInt(window.getComputedStyle(gridInstance).getPropertyValue("--grid-chess-trick-y"));
                gridInstance.style.setProperty("--grid-chess-trick-y", (lastChessTrick + amount));
            }
        }

        static removeOutOfGrid(size, mapping) {
            let outOfGridCriteria = pos => (pos.x >= size.x || pos.x < 0) || (pos.y >= size.y || pos.y < 0);

            for(let tle = 0; tle < mapping.length; tle++) {
                if(outOfGridCriteria(mapping[tle].pos)) {
                    mapping[tle].element.remove();
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
        this._zoom = 48;

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
        }
        this._internal.removeOutOfGrid({x:this.sizeX, y:this.sizeY}, this._mapping);
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
        
        this._mapping.push({
            element: newBlankTile,
            pos: {x: x, y: y}
        });
        return newBlankTile;
    }

    getTile(x, y) {
        if((x >= this.sizeX || x < 0) || (y >= this.sizeY || y < 0)) {
            console.warn(`Invalid tile position, out of bounds. [${x},${y}]`);
            return null;
        }

        let foundTile = this._mapping.filter(tle => tle.pos.x == x && tle.pos.y == y);
        return foundTile.length? foundTile[0]: null;
    }
}

class GridMapHandler {
    static _instanceHolder = {};
    static _cursorHolder   = {
        mode: 0,
        x:null,
        y:null
    };

    static getElementGridMapInstance(e) {
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
        
        return this._instanceHolder[parentGridContent.getAttribute("uuid")];
    }

    static arrow(e) {
        let parentInstance = this.getElementGridMapInstance(e);

        let dir = {x:0, y:0};
        if(e.classList.contains("gridmap-arrow-left"))   dir.x = -1;
        if(e.classList.contains("gridmap-arrow-right"))  dir.x =  1;
        if(e.classList.contains("gridmap-arrow-top"))    dir.y = -1;
        if(e.classList.contains("gridmap-arrow-bottom")) dir.y =  1;
        
        parentInstance.resize(dir);
    }

    static cursor(type, event, element) {
        let gridMapCursor = element.getElementsByClassName("gridmap-cursor")[0];
        let gridMapInstance = this.getElementGridMapInstance(element);
        let gridMapCursorPos;
        switch(type) {
            case "move":
                gridMapCursorPos = {
                    x: event.offsetX - (event.offsetX % gridMapInstance._zoom),
                    y: event.offsetY - (event.offsetY % gridMapInstance._zoom)
                };
                if(gridMapCursor.style.left != `${gridMapCursorPos.x}px`
                || gridMapCursor.style.top  != `${gridMapCursorPos.y}px`) {
                    gridMapCursor.style.left = `${gridMapCursorPos.x}px`;
                    gridMapCursor.style.top  = `${gridMapCursorPos.y}px`;
                    gridMapCursor.toggleAttribute("animated");
                    setTimeout(()=>{
                        gridMapCursor.toggleAttribute("animated");
                    },1);
                }

                if(GridMapHandler._cursorHolder.mode === 0) {
                    // event.offsetX - GridMapHandler._cursorHolder.x;
                    // event.offsetY - GridMapHandler._cursorHolder.y;
                    
                }
                break;
            case "down":
                console.log("click");
                if(GridMapHandler._cursorHolder.mode === 0) {
                    GridMapHandler._cursorHolder.x = event.offsetX;
                    GridMapHandler._cursorHolder.y = event.offsetY;
                }
                break;
            case "up":
                console.log("unclick");
                if(GridMapHandler._cursorHolder.mode === 0) {
                    GridMapHandler._cursorHolder.x = null;
                    GridMapHandler._cursorHolder.y = null;
                }
                break;
            case "leave":
                gridMapCursorPos = {
                    x: gridMapInstance._zoom * -2,
                    y: gridMapInstance._zoom * -2
                };
                gridMapCursor.style.left = `${gridMapCursorPos.x}px`;
                gridMapCursor.style.top = `${gridMapCursorPos.y}px`;
                break;
        }
    }
}