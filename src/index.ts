const input = <HTMLInputElement>document.getElementById("input")!;
const sizeBar = <HTMLInputElement>document.getElementById("size_bar")!;
const saveButton = <HTMLButtonElement>document.getElementById("save")!;
const canvas = document.createElement("canvas");
const svg = document.getElementById("svg")!;
const ctx = canvas.getContext("2d")!;
const img = new Image();
const buf = new Array<number>();
const svg_h = 400;

input.onchange = loadImage;
async function loadImage() {
    const promise = new Promise<void>((resolve) => {
        img.onload = () => {
            resolve();
        };
        img.src = URL.createObjectURL(input.files![0]);
    });
    await promise;
    canvas.height = img.height;
    canvas.width = img.width;
    ctx?.drawImage(img, 0, 0);

    const size = parseInt(sizeBar.value);
    const h = Math.floor(img.height / size);
    const w = Math.floor(img.width / size);
    document.getElementById("size")!.textContent = `${h}x${w}`;
    const len = img.height * img.width * 4;
    while (buf.length < len) buf.push(0);
    gyouza(size);
}

function gyouza(size: number) {
    const h = Math.floor(img.height / size) * size;
    const w = Math.floor(img.width / size) * size;
    svg.setAttribute('width', `${svg_h / h * w}`);
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    buf.fill(0);
    for (let y = 0; y < h; y += size) {
        for (let x = 0; x < w; x += size) {
            const i = (y * w + x) * 4;
            for (let ny = y; ny < y + size; ny++) {
                for (let nx = x; nx < x + size; nx++) {
                    const ni = (ny * w + nx) * 4;
                    for (let c = 0; c < 3; c++) {
                        buf[i + c] += data[ni + c];
                    }
                }
            }
        }
    }
    for (let y = 0; y < h; y += size) {
        for (let x = 0; x < w; x += size) {
            const i = (y * w + x) * 4;
            for (let c = 0; c < 3; c++) {
                buf[i + c] = Math.floor(buf[i + c] / (size * size));
            }
        }
    }

    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
    const D = size * svg_h / h;
    for (let y = 0, y0 = 0; y < h; y += size, y0++) {
        for (let x = 0, x0 = 0; x < w; x += size, x0++) {
            const i = (y * w + x) * 4;
            const R = buf[i + 0];
            const G = buf[i + 1];
            const B = buf[i + 2];
            const Y = Math.floor((0.2126 * R + 0.7152 * G + 0.0722 * B) / 52) * 52;
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('y', `${y0 * D}`);
            rect.setAttribute('x', `${x0 * D}`);
            rect.setAttribute('height', `${D}`);
            rect.setAttribute('width', `${D}`);
            rect.setAttribute('fill', `rgb(${Y}, ${Y}, ${Y})`);
            rect.setAttribute('stroke', `rgb(${Y}, ${Y}, ${Y})`);
            svg.appendChild(rect);
        }
    }
}

const bg = [];
const fg = [];
function sushi(size: number) {
    const h = Math.floor(img.height / size) * size;
    const w = Math.floor(img.width / size) * size;
    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);
    }
    const D = size * svg_h / h;
    for (let y = 0, y0 = 0; y < h; y += size, y0++) {
        for (let x = 0, x0 = 0; x < w; x += size, x0++) {
            const i = (y * w + x) * 4;
            const R = buf[i + 0];
            const G = buf[i + 1];
            const B = buf[i + 2];
            const id = Math.floor((0.2126 * R + 0.7152 * G + 0.0722 * B) / 52);
            const Y = id * 52;
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('y', `${y0 * D}`);
            rect.setAttribute('x', `${x0 * D}`);
            rect.setAttribute('height', `${D}`);
            rect.setAttribute('width', `${D}`);
            rect.setAttribute('fill', `rgb(${Y}, ${Y}, ${Y})`);
            rect.setAttribute('stroke', `rgb(${Y}, ${Y}, ${Y})`);
            svg.appendChild(rect);
        }
    }
}

sizeBar.onchange = () => {
    const size = parseInt(sizeBar.value);
    gyouza(size);
    const h = Math.floor(img.height / size);
    const w = Math.floor(img.width / size);
    document.getElementById("size")!.textContent = `${h}x${w}`;
};

saveButton.onclick = () => {
    // const size = parseInt(sizeBar.value);
    // sushi(size);
};