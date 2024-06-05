
export default function PickerTool(e, canvasRef){
    const mouseX = e.layerX;
    const mouseY = e.layerY;
    const pen = canvasRef.current.getContext('2d');
    const color = pen.getImageData( mouseX, mouseY + 16, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(color[0], color[1], color[2])).slice(-6);
    return hex;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
