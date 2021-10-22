class GridMap {
    _parentElement = null;
    _instance = null;
    _mapping = [];
    _internal = class GridMapInternal {
        static instantiate(gmap) {
            let gridmapArrowInstantiate = dir => `<div class="gridmap-arrow gridmap-arrow-${dir}"></div>`;

            let eInstance = document.createElement("div");
            eInstance.classList.add("gridmap-content");
            
            let gridMapTable = document.createElement("div");
            gridMapTable.classList.add("gridmap-table");
            
            gridMapTable.createTHead().insertRow().insertCell(1)
                        .innerHTML = gridmapArrowInstantiate("top");

            let gridMapTableMiddle = gridMapTable.insertRow();
            gridMapTableMiddle.insertCell(0).innerHTML = gridmapArrowInstantiate("left");
            gridMapTableMiddle.insertCell(1).innerHTML = this.mapGrid({x:gmap.sizeX, y:gmap.sizeY}, gmap._mapping);
            gridMapTableMiddle.insertCell(2).innerHTML = gridmapArrowInstantiate("right");

            gridMapTable.createTFoot().insertRow().insertCell(1)
                        .innerHTML = gridmapArrowInstantiate("bottom");
            
            eInstance.append(gridMapTable);
            gmap._instance = eInstance;
            gmap._parentElement.append(eInstance);
        }

        mapGrid(size, mapping, diff=null, instance=null) {
            if(diff != null) remap(diff, mapping);
            
            let generatedGrid;
            if(instance == null) {
                generatedGrid = document.createElement("div");
                generatedGrid.classList.add("gridmap-grid");
            }
            else {
                generatedGrid = instance.querySelector(".grimap-grid");
            }
            generatedGrid


            return generatedGrid;
        }

        remap(diff, mapping) {
            mapping.map(sqe => { sqe.x += diff.x; sqe.y += diff.y }, this._instance);
        }
    }

    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    init(eQuery) {
        if(this.parentElement != null && this.instance != null)
            this.parentElement.remove(this.instance);
        this._parentElement = document.querySelector(eQuery);

        this._internal.instantiate(this);
    }

    resize(diffX, diffY) {
        this.sizeX = this.sizeX + diffX;
        this.sizeY = this.sizeY + diffY;

        this._internal.genGrid({x:this.sizeX, y:this.sizeY}, this._mapping, {x:diffX, y:diffY});
    }
}