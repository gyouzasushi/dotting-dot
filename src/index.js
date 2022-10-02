"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const input = document.getElementById("input");
const sizeBar = document.getElementById("size_bar");
const canvas = document.createElement("canvas");
const svg = document.getElementById("svg");
const ctx = canvas.getContext("2d");
const img = new Image();
const svg_h = 400;
input.onchange = loadImage;
function loadImage() {
    return __awaiter(this, void 0, void 0, function* () {
        const promise = new Promise((resolve) => {
            img.onload = () => {
                resolve();
            };
            img.src = URL.createObjectURL(input.files[0]);
        });
        yield promise;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(img, 0, 0);
        const size = parseInt(sizeBar.value);
        createUltraPixel(size);
        console.log(size);
    });
}
function createUltraPixel(size) {
    const h = Math.floor(img.height / size) * size;
    const w = Math.floor(img.width / size) * size;
    svg.setAttribute('width', `${svg_h / h * w}`);
    console.log(h, w);
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const buf = new Array(h * w * 4);
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
            const Y = Math.floor((0.2126 * R + 0.7152 * G + 0.0722 * B) / 52 * 52);
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
    console.log(`${h / size}x${w / size}`);
}
sizeBar.onchange = () => {
    const size = parseInt(sizeBar.value);
    createUltraPixel(size);
    console.log(size);
};
