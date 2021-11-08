class SpritePalette {
    _parentElement = null;
    _instance = null;
    _internal = class PaletteInternal {
        static b64toBlob(b64Data, contentType='image/png', sliceSize=512) {
            let byteCharacters = atob(b64Data);
            let byteArrays     = [];
          
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                let byteSlice = byteCharacters.slice(offset, offset + sliceSize);
                let byteNumbers = new Array(byteSlice.length);
                for (let i = 0; i < byteSlice.length; i++) {
                    byteNumbers[i] = byteSlice.charCodeAt(i);
                }
                
                byteArrays.push(new Uint8Array(byteNumbers));
            }
            
            return new Blob(byteArrays, {type: contentType});
        }

        static loadPalette(imageLoad, clip, parent, imageBinary) {
            const TILESIZE  = 60;

            let imgSize = {
                'x': imageLoad.width,
                'y': imageLoad.height
            }

            let minors = {
                'x': Math.floor(imgSize.x / clip.x),
                'y': Math.floor(imgSize.y / clip.y)
            };
            let tileScale = {
                'x': (TILESIZE * minors.x) / imgSize.x,
                'y': (TILESIZE * minors.y) / imgSize.y
            };

            parent.innerHTML = "";
            let parentTable = document.createElement("table");
            
            for(let y = 0; y < minors.y; y++) {
                let parentTableRow = parentTable.insertRow(y);
                for(let x = 0; x < minors.x; x++) {
                    let imageElement = parentTableRow.insertCell(x);
                    imageElement.classList.add("sprite-palette-tile");
                    
                    imageElement.setAttribute("clip", `${x}|${y}`);
                    imageElement.style.backgroundImage = `url("${imageBinary}")`;
                    imageElement.style.backgroundSize  = `${imgSize.x * tileScale.x}px ${imgSize.y * tileScale.y}px`;
                    let coord = {
                        'x': `${(x*clip.x) * tileScale.x}px`,
                        'y': `${(y*clip.y) * tileScale.y}px`
                    };
                    imageElement.style.backgroundPosition = `-${coord.x} -${coord.y}`;
                }
            }

            parent.append(parentTable);
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
        };
    }
}