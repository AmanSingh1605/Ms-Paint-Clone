export function printText(
  text,
  startX,
  startY,
  endX,
  endY,
  primaryColor,
  secondaryColor,
  canvasRef
) {
  const addLineBreaks = (paragraph) => paragraph.replace(/\n/g, "<br/>");

  const brText = addLineBreaks(text);
  const svgCode = `
    <svg width="${Math.round(endX - startX)}" height="${Math.round(
    endY - startY
  )}" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="0" y="0" width="${Math.round(
          endX - startX
        )}" height="${Math.round(endY - startY)}">
            <style>
            p{  
                color: ${"%23" + primaryColor.substring(1)};
                background-color: ${"%23" + secondaryColor.substring(1)};
                height: ${endY - startY};
                width: ${endX - startX};
                font-size: 20px;
                line-height: 1.5;
                margin:0;
                word-wrap: break-word;
                word-break: break;
            }
            </style>
            <p xmlns="http://www.w3.org/1999/xhtml"> 
            ${brText}
            </p>
        </foreignObject>
    </svg>`;

  const svgCodeEncoded = svgCode.replace(/\n/g, "").replace(/"/g, "'");
  const img = document.createElement("img");
  img.onload = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(img, startX, startY);
  };
  img.src = `data:image/svg+xml,${svgCodeEncoded}`;
}
