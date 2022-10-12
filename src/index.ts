const input = <HTMLInputElement>document.getElementById("input")!;
const sizeBar = <HTMLInputElement>document.getElementById("size_bar")!;
const saveButton = <HTMLButtonElement>document.getElementById("save")!;
const canvas = document.createElement("canvas");
const svg = document.getElementById("svg")!;
const ctx = canvas.getContext("2d")!;
const img = new Image();
const buf = new Array<number>();
const svg_h = 400;
const threasholds = [50, 100, 150, 200];

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
    document.getElementById("size")!.style.visibility = 'visible';
    document.getElementById("thresholds")!.style.visibility = 'visible';
    document.getElementById("reset")!.style.visibility = 'visible';
    sizeBar.style.visibility = 'visible';
    saveButton.style.visibility = 'visible';
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
            const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
            let id = 0;
            while (id < 4 && threasholds[id] < L) id++;
            const Y = 51 * id;
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

const bg = ["#cc0a0a", "#3a0bd6", "#00bfb6", "#73d60b", "#ccba0c"];
const fg = ["#ff0000"];
function sushi(size: number) {
    const h = Math.floor(img.height / size) * size;
    const w = Math.floor(img.width / size) * size;
    const N = 29;
    const DPI = 72;
    const D = 5.71 * DPI / N;
    const H = Math.ceil(Math.floor(img.height / size) / N) * N;
    const W = Math.ceil(Math.floor(img.width / size) / N) * N;


    const sushi = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sushi.setAttribute('height', `${D * H}`);
    sushi.setAttribute('width', `${D * W}`);
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('y', '0');
    rect.setAttribute('x', '0');
    rect.setAttribute('height', `${D * H}`);
    rect.setAttribute('width', `${D * W}`);
    rect.setAttribute('fill', 'white');
    rect.setAttribute('stroke-width', `${0}`);
    sushi.appendChild(rect);

    for (let y = 0, y0 = 0; y0 < H; y += size, y0++) {
        for (let x = 0, x0 = 0; x0 < W; x += size, x0++) {
            if (y < h && x < w) {
                const i = (y * w + x) * 4;
                const R = buf[i + 0];
                const G = buf[i + 1];
                const B = buf[i + 2];
                const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
                let id = 0;
                while (id < 4 && L < threasholds[id]) id++;
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('y', `${y0 * D}`);
                rect.setAttribute('x', `${x0 * D}`);
                rect.setAttribute('height', `${D}`);
                rect.setAttribute('width', `${D}`);
                rect.setAttribute('fill', bg[id]);
                rect.setAttribute('stroke', bg[id]);
                rect.setAttribute('opacity', `${0.5}`);
                rect.setAttribute('stroke-width', `${0}`);
                sushi.appendChild(rect);
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('y', `${y0 * D + D / 2}`);
                text.setAttribute('x', `${x0 * D + D / 2}`);
                text.setAttribute('dominant-baseline', 'central');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', `${D * 0.7}`);
                text.textContent = `${id}`;
                sushi.appendChild(text);
            } else {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('y', `${y0 * D}`);
                rect.setAttribute('x', `${x0 * D}`);
                rect.setAttribute('height', `${D}`);
                rect.setAttribute('width', `${D}`);
                rect.setAttribute('fill', "white");
                rect.setAttribute('stroke', "white");
                sushi.appendChild(rect);
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('y', `${y0 * D + D / 2}`);
                text.setAttribute('x', `${x0 * D + D / 2}`);
                text.setAttribute('dominant-baseline', 'central');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('font-size', `${D * 0.7}`);
                text.textContent = `x`;
                sushi.appendChild(text);
            }
        }
    }

    const svgData = new XMLSerializer().serializeToString(sushi);
    const image = new Image;
    image.onload = function () {
        for (let sy = 0; sy < H * D; sy += N * D) {
            for (let sx = 0; sx < W * D; sx += N * D) {
                const canvas = document.createElement("canvas");
                canvas.height = N * D;
                canvas.width = N * D;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(image, sx, sy, N * D, N * D, 0, 0, N * D, N * D);
                const a = document.createElement("a");
                a.href = canvas.toDataURL("image/jpeg");
                const y = Math.floor(sy / (N * D));
                const x = Math.floor(sx / (N * D));
                a.download = `${y}-${x}.jpeg`;
                a.click();
            }
        }
    }
    image.src = "data:image/svg+xml;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(svgData)));

}

sizeBar.onchange = () => {
    const size = parseInt(sizeBar.value);
    gyouza(size);
    const h = Math.floor(img.height / size);
    const w = Math.floor(img.width / size);
    document.getElementById("size")!.textContent = `${h}x${w}`;
};

saveButton.onclick = () => {
    const size = parseInt(sizeBar.value);
    sushi(size);
};

const threshold0 = document.getElementById("ts0")!;
const threshold1 = document.getElementById("ts1")!;
const threshold2 = document.getElementById("ts2")!;
const threshold3 = document.getElementById("ts3")!;
const drag: {
    isMouseDown: boolean,
    target: HTMLElement | undefined,
    offset: number,
} = {
    isMouseDown: false,
    target: undefined,
    offset: 0,
};
function handleMouseDown(ev: MouseEvent, ts: HTMLElement) {
    drag.target = ts;
    drag.isMouseDown = true;
    drag.offset = ev.clientX - Number(ts.getAttribute('x'));
}
threshold0.onmousedown = (ev: MouseEvent) => handleMouseDown(ev, threshold0);
threshold1.onmousedown = (ev: MouseEvent) => handleMouseDown(ev, threshold1);
threshold2.onmousedown = (ev: MouseEvent) => handleMouseDown(ev, threshold2);
threshold3.onmousedown = (ev: MouseEvent) => handleMouseDown(ev, threshold3);
document.onmousemove = (ev: MouseEvent) => {
    if (!drag.isMouseDown) return;
    if (drag.target === undefined) return;
    const B = 400 / 50;
    const cursorX = ev.clientX;
    const newX = Math.min(49, Math.floor(cursorX / B)) * B;
    drag.target.setAttribute('x', `${newX - drag.offset}`);
};
document.onmouseup = () => {
    drag.isMouseDown = false;
    drag.target = undefined;
    threasholds[0] = Number(threshold0.getAttribute('x')) * 255 / 400;
    threasholds[1] = Number(threshold1.getAttribute('x')) * 255 / 400;
    threasholds[2] = Number(threshold2.getAttribute('x')) * 255 / 400;
    threasholds[3] = Number(threshold3.getAttribute('x')) * 255 / 400;
    threasholds.sort((a, b) => a - b);
    const size = parseInt(sizeBar.value);
    gyouza(size);
}
document.getElementById('reset')!.onclick = () => {
    threasholds[0] = 50, threshold0.setAttribute('x', `${50 * 400 / 255}`);
    threasholds[1] = 100, threshold1.setAttribute('x', `${100 * 400 / 255}`);
    threasholds[2] = 150, threshold2.setAttribute('x', `${150 * 400 / 255}`);
    threasholds[3] = 200, threshold3.setAttribute('x', `${200 * 400 / 255}`);
    const size = parseInt(sizeBar.value);
    gyouza(size);
};