class SpritePalette {
    _parentElement = null;
    _instance = null;
    _internal = class PaletteInternal {
        static b64toBlob(b64Data, contentType='image/png') {
            const SLICESIZE = 512;
            let byteCharacters = atob(b64Data);
            let byteArrays     = [];
          
            for (let offset = 0; offset < byteCharacters.length; offset += SLICESIZE) {
                let byteSlice = byteCharacters.slice(offset, offset + SLICESIZE);
                let byteNumbers = new Array(byteSlice.length);
                for (let i = 0; i < byteSlice.length; i++) {
                    byteNumbers[i] = byteSlice.charCodeAt(i);
                }
                
                byteArrays.push(new Uint8Array(byteNumbers));
            }
            
            return new Blob(byteArrays, {type: contentType});
        }

        static createPalette(pSize, imgProps=null) {
            let paletteTable = document.createElement("table");

            for(let y = 0; y < pSize.y; y++) {
                let paletteTableRow = paletteTable.insertRow(y);
                for(let x = 0; x < pSize.x; x++) {
                    let imageElement = paletteTableRow.insertCell(x);
                    imageElement.classList.add("sprite-palette-tile");
                    
                    imageElement.setAttribute("clip", `${x}|${y}`);
                    if(imgProps !== null) {
                        imageElement.style.backgroundImage    = `url("${imgProps.image}")`;
                        imageElement.style.backgroundSize     = `${imgProps.size.x * imgProps.scale.x}px ${imgProps.size.y * imgProps.scale.y}px`;
                        imageElement.style.backgroundPosition = `-${(x*imgProps.clip.x) * imgProps.scale.x}px -${(y*imgProps.clip.y) * imgProps.scale.y}px`;
                    }
                }
            }

            return paletteTable;
        }

        static loadPalette(imageLoad, clip, parent, imageBinary) {
            const TILESIZE  = 50;

            let minors = {
                'x': Math.floor(imageLoad.width / clip.x),
                'y': Math.floor(imageLoad.height / clip.y)
            };

            let imgProps = {
                'image': imageBinary,
                'clip' : clip,
                'scale': {
                    'x': (TILESIZE * minors.x) / imageLoad.width,
                    'y': (TILESIZE * minors.y) / imageLoad.height
                },
                'size' : {
                    'x': imageLoad.width,
                    'y': imageLoad.height
                }
            };
            
            parent.innerHTML = "";
            return parent.append(this.createPalette(minors, imgProps));
        }

        static bindTileEvents(parent) {
            let bindTiles = parent.getElementsByClassName("sprite-palette-tile");
            for(let bdt = 0; bdt < bindTiles.length; bdt++) {
                bindTiles[bdt].addEventListener("click", () => {
                    GlobalSpritePaletteHolder.click(bindTiles[bdt]);
                });
            }
        }
    }

    constructor(parent, size) {
        this._parentElement = parent;
        this.size = size; // {x: <number>, y: <number>}
    }

    init() {
        if(this._instance !== null) return this._instance;

        this._instance = document.createElement("div");
        this._instance.classList.add("sprite-palette-container");

        this._parentElement.append(this._instance);
        return this._instance;
    }

    resize(size) {
        if(size.x > 0 && size.y > 0) {
            this.size = size;
            return true;
        }
        return false;
    }

    loadImage(image) {
        if(this._instance === null) this.init();

        let fullImageLoaded = new Image();
        fullImageLoaded.src = image.src;
        let imageBinary = URL.createObjectURL(this._internal.b64toBlob(fullImageLoaded.src.substr(22)));

        fullImageLoaded.onload = () => {
            this._internal.loadPalette(fullImageLoaded, this.size, this._instance, imageBinary);
            this._internal.bindTileEvents(this._instance);
        };
    }

    loadEmpty(size) {
        if(this._instance === null) this.init();

        this._instance.innerHTML = "";
        this._instance.append(this._internal.createPalette(size));
        this._internal.bindTileEvents(this._instance);
    }
}

class GlobalSpritePaletteHolder {
    static _holdTile = null;
    static _internal = class InternalGlobalSpritePaletteHolder {
        static draw(tile) {
            return tile.setAttribute("style", GlobalSpritePaletteHolder._holdTile.getAttribute("style"));
        }
    
        static clear(tile) {
            return tile.setAttribute("style", "");
        }
    
        static getParentWindow(tile) {
            let parentWindow = tile.parentElement;
            while(!parentWindow.classList.contains("palette-window-grid")) {
                parentWindow = parentWindow.parentElement;
            }
            return parentWindow;
        }
    }

    static click(tile) {
        let parentWindow = this._internal.getParentWindow(tile);
        if(this._holdTile === null) {
            if(parentWindow.getAttribute("--palette-select") === "false")
                this._internal.clear(tile);
            else
                this.hold(tile);
        }
        else {
            if(parentWindow.getAttribute("--palette-draw") === "false")
                this.hold(tile);
            else
                this._internal.draw(tile);
        }
    }

    static hold(tile) {
        if(this._holdTile == tile) {
            this._holdTile.classList.remove("sprite-palette-holder");
            this._holdTile = null;
        }
        else {
            if(this._holdTile != null)
                this._holdTile.classList.remove("sprite-palette-holder");
            this._holdTile = tile;
            this._holdTile.classList.add("sprite-palette-holder");
        }
    }
}