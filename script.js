
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const svgCodeTextArea = document.getElementById('svg-code');
    const colorInput = document.getElementById('color-code');
    const lineWidthInput = document.getElementById('line-width');
    const lineWidthValue = document.getElementById('line-width-value');
    const svgSizeInput = document.getElementById('svg-size');
    const svgSizeValue = document.getElementById('svg-size-value');
    const backgroundColorInput = document.getElementById('background-color');
    const transparentBgCheckbox = document.getElementById('transparent-bg');

    let drawing = false;
    let lastX = 0, lastY = 0;
    let paths = [];
    let currentColor = colorInput.value;
    let currentLineWidth = lineWidthInput.value;
    let svgSize = svgSizeInput.value;
    let backgroundColor = backgroundColorInput.value;

    canvas.width = svgSize;
    canvas.height = svgSize;
    canvas.style.backgroundColor = backgroundColor;

    function startDrawing(e) {
      drawing = true;
      const { x, y } = getCoords(e);
      lastX = x;
      lastY = y;
      paths.push({ color: currentColor, lineWidth: currentLineWidth, pathData: `M${x},${y} ` });
    }

    function draw(e) {
      if (!drawing) return;
      const { x, y } = getCoords(e);
      const currentPath = paths[paths.length - 1];
      currentPath.pathData += `L${x},${y} `;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentLineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      lastX = x;
      lastY = y;
    }

    function stopDrawing() {
      drawing = false;
      updateSVGCode();
    }

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
      return { x, y };
    }

    function updateSVGCode() {
      const svgPaths = paths.map(({ color, lineWidth, pathData }) => {
        return `<path d="${pathData.trim()}" fill="none" stroke="${color}" stroke-width="${lineWidth}" />`;
      }).join('\n');

      const bgAttribute = transparentBgCheckbox.checked ? '' : `style="background-color: ${backgroundColor};"`;

      const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" ${bgAttribute}>
${svgPaths}
</svg>`;

      svgCodeTextArea.value = svgCode;
    }

    function resetCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      paths = [];
      updateSVGCode();
    }

    function copySVG() {
      navigator.clipboard.writeText(svgCodeTextArea.value).then(() => {
        alert('SVG code copied to clipboard!');
      });
    }

    colorInput.addEventListener('input', (e) => {
      currentColor = e.target.value;
    });

    lineWidthInput.addEventListener('input', (e) => {
      currentLineWidth = e.target.value;
      lineWidthValue.textContent = currentLineWidth;
    });

    svgSizeInput.addEventListener('input', (e) => {
      svgSize = e.target.value;
      svgSizeValue.textContent = svgSize;
      canvas.width = svgSize;
      canvas.height = svgSize;
      canvas.style.backgroundColor = transparentBgCheckbox.checked ? 'transparent' : backgroundColor;
      resetCanvas();
    });

    backgroundColorInput.addEventListener('input', (e) => {
      backgroundColor = e.target.value;
      if (!transparentBgCheckbox.checked) {
        canvas.style.backgroundColor = backgroundColor;
      }
      updateSVGCode();
    });

    transparentBgCheckbox.addEventListener('change', (e) => {
      canvas.style.backgroundColor = e.target.checked ? 'transparent' : backgroundColor;
      updateSVGCode();
    });

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    updateSVGCode();
  
