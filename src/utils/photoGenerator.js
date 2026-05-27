/**
 * Utility to combine captured video snapshots into a collage with a theme frame, background texture, and text.
 */

// Draw procedural background textures on the canvas matching TemplatesBooth styles
function drawProceduralBackground(ctx, width, height, bgType) {
  // Wood texture: brown gradient + curved lines + planks
  if (bgType === 'wood') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#5a3d25');
    grad.addColorStop(0.5, '#452b18');
    grad.addColorStop(1, '#2e1c0f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw wood grain lines
    ctx.strokeStyle = '#23140a';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.12;
    for (let i = 0; i < height; i += 80) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.bezierCurveTo(width * 0.25, i + 30, width * 0.75, i - 30, width, i);
      ctx.stroke();
    }
    // Vertical plank lines
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.2;
    for (let x = 200; x < width; x += 300) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }
  // Green wood (St Patrick)
  else if (bgType === 'greenWood') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0c2e1b');
    grad.addColorStop(0.5, '#051f11');
    grad.addColorStop(1, '#02120a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#010c06';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < height; i += 80) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.bezierCurveTo(width * 0.25, i + 30, width * 0.75, i - 30, width, i);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }
  // Kraft paper
  else if (bgType === 'kraft') {
    ctx.fillStyle = '#dbcaa6';
    ctx.fillRect(0, 0, width, height);

    // Paint fine noise
    ctx.fillStyle = '#c7b693';
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rSize = Math.random() * 2 + 1;
      ctx.fillRect(rx, ry, rSize, rSize);
    }
    ctx.globalAlpha = 1.0;
  }
  // Chalkboard / Slate
  else if (bgType === 'chalkboard' || bgType === 'slate') {
    ctx.fillStyle = bgType === 'chalkboard' ? '#1c1d21' : '#2d3139';
    ctx.fillRect(0, 0, width, height);

    // Paint chalky clouds/noise
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rRadius = Math.random() * 150 + 50;
      ctx.arc(rx, ry, rRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Fine slate noise
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 3000; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, 1, 1);
    }
    ctx.globalAlpha = 1.0;
  }
  // Confetti
  else if (bgType === 'confetti') {
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, width, height);

    // Draw confetti dots
    const colors = ['#f43f5e', '#3b82f6', '#eab308', '#10b981', '#8b5cf6'];
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rRadius = Math.random() * 5 + 3;
      ctx.arc(rx, ry, rRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
  // Marble
  else if (bgType === 'marble') {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    // Marble veins
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, 0);
      ctx.bezierCurveTo(
        Math.random() * width, height * 0.3,
        Math.random() * width, height * 0.7,
        Math.random() * width, height
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }
  // Default dark fallback
  else {
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, width, height);
  }
}

// Crop video frame to aspect ratio and return mirrored snapshot as base64 JPEG
export function captureVideoSnapshot(videoElement, aspectRatio = '4:3') {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = 640;
    let height = 480; // default 4:3
    if (aspectRatio === '1:1') height = 640;
    if (aspectRatio === '16:9') height = 360;
    if (aspectRatio === '3:4') height = 853;
    if (aspectRatio === '9:16') height = 1138;

    canvas.width = width;
    canvas.height = height;

    if (videoElement && videoElement.readyState >= 2) {
      ctx.save();
      // Mirror horizontally
      ctx.translate(width, 0);
      ctx.scale(-1, 1);

      const vWidth = videoElement.videoWidth;
      const vHeight = videoElement.videoHeight;
      const targetRatio = width / height;
      const sourceRatio = vWidth / vHeight;

      let sx = 0, sy = 0, sWidth = vWidth, sHeight = vHeight;
      if (sourceRatio > targetRatio) {
        // Crop width
        sWidth = vHeight * targetRatio;
        sx = (vWidth - sWidth) / 2;
      } else {
        // Crop height
        sHeight = vWidth / targetRatio;
        sy = (vHeight - sHeight) / 2;
      }

      ctx.drawImage(videoElement, sx, sy, sWidth, sHeight, 0, 0, width, height);
      ctx.restore();
    } else {
      // Gray placeholder
      ctx.fillStyle = '#27272a';
      ctx.fillRect(0, 0, width, height);
    }

    resolve(canvas.toDataURL('image/jpeg', 0.80));
  });
}

// Generate the final framed photobooth collage. Supports video input (fallback to single)
// or array of base64 images (completed collage).
export function generateFramedPhoto(videoElementOrPhotos, frame, customText, layout = 'single', aspectRatio = '4:3') {
  return new Promise(async (resolve) => {
    let photos = [];
    if (Array.isArray(videoElementOrPhotos)) {
      photos = videoElementOrPhotos;
    } else if (videoElementOrPhotos) {
      // Capture snapshot on the fly
      const snapshot = await captureVideoSnapshot(videoElementOrPhotos, aspectRatio);
      photos = [snapshot];
    }

    // Wait for Google fonts to be loaded
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('[photoGenerator] Font loading promise rejected, proceeding with fallback fonts', e);
      }
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate slot sizes dynamically (bounding boxes are adjusted for portrait)
    const getSlotSize = () => {
      if (layout === 'single') {
        if (aspectRatio === '1:1') return { slotWidth: 960, slotHeight: 960 };
        if (aspectRatio === '16:9') return { slotWidth: 960, slotHeight: 540 };
        if (aspectRatio === '3:4') return { slotWidth: 825, slotHeight: 1100 };
        if (aspectRatio === '9:16') return { slotWidth: 620, slotHeight: 1100 };
        return { slotWidth: 960, slotHeight: 720 }; // default 4:3
      } else if (layout === 'strip') {
        if (aspectRatio === '1:1') return { slotWidth: 680, slotHeight: 680 };
        if (aspectRatio === '16:9') return { slotWidth: 680, slotHeight: 382 };
        if (aspectRatio === '3:4') return { slotWidth: 510, slotHeight: 680 };
        if (aspectRatio === '9:16') return { slotWidth: 382, slotHeight: 680 };
        return { slotWidth: 680, slotHeight: 510 }; // default 4:3
      } else { // grid (2x2)
        if (aspectRatio === '1:1') return { slotWidth: 480, slotHeight: 480 };
        if (aspectRatio === '16:9') return { slotWidth: 480, slotHeight: 270 };
        if (aspectRatio === '3:4') return { slotWidth: 360, slotHeight: 480 };
        if (aspectRatio === '9:16') return { slotWidth: 270, slotHeight: 480 };
        return { slotWidth: 480, slotHeight: 360 }; // default 4:3
      }
    };

    const { slotWidth, slotHeight } = getSlotSize();
    const borderThickness = layout === 'grid' ? 12 : 16;

    // Calculate canvas size dynamically based on layout and slot size
    const canvasWidth = layout === 'strip' ? 800 : 1200;
    const getCanvasHeight = () => {
      if (layout === 'strip') {
        const gap = 48;
        const startY = 160;
        const footerSpace = 250;
        const totalSlotHeight = 3 * slotHeight + 2 * gap;
        return startY + totalSlotHeight + footerSpace;
      } else if (layout === 'single') {
        const startY = 200;
        const footerSpace = 280;
        return startY + slotHeight + footerSpace;
      } else { // grid (2x2)
        const gapY = 40;
        const startY = 240;
        const footerSpace = 280;
        const totalSlotHeight = 2 * slotHeight + gapY;
        return startY + totalSlotHeight + footerSpace;
      }
    };
    const canvasHeight = getCanvasHeight();

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 1. Procedural Background
    drawProceduralBackground(ctx, canvasWidth, canvasHeight, frame.bgType || 'wood');

    // 2. Draw Festive Themed Overlays & Borders (Canvas equivalent of FrameDecorations)
    drawThemedDecorations(ctx, canvasWidth, canvasHeight, frame);

    // Draw slot with border and drop shadow
    const drawPhotoSlot = (imgUrl, x, y) => {
      return new Promise((res) => {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;

        const isGala = frame.id?.startsWith('gala') || frame.id?.startsWith('corpo') || frame.id?.startsWith('mariage');
        const isAnniversary = frame.category === 'Anniversaire' || isGala;
        
        ctx.fillStyle = '#ffffff';
        let customBorder = false;
        let borderGradient = null;

        if (isAnniversary) {
          borderGradient = ctx.createLinearGradient(x - borderThickness, y - borderThickness, x + slotWidth + borderThickness, y + slotHeight + borderThickness);
          borderGradient.addColorStop(0, '#bf953f');
          borderGradient.addColorStop(0.25, '#fcf6ba');
          borderGradient.addColorStop(0.5, '#b38728');
          borderGradient.addColorStop(0.75, '#fbf5b7');
          borderGradient.addColorStop(1, '#aa771c');
          ctx.fillStyle = borderGradient;
          customBorder = true;
        } else if (frame.category === 'Halloween') {
          ctx.fillStyle = '#ff8c00';
          customBorder = true;
        } else if (frame.category === 'Noël') {
          ctx.fillStyle = '#cc0000';
          customBorder = true;
        } else if (frame.category === 'St-Patrick') {
          ctx.fillStyle = '#008000';
          customBorder = true;
        } else if (frame.category === 'Pâques') {
          ctx.fillStyle = '#ffd166';
          customBorder = true;
        }

        const currentBorderThickness = customBorder ? 6 : borderThickness;
        ctx.fillRect(
          x - currentBorderThickness, 
          y - currentBorderThickness, 
          slotWidth + 2 * currentBorderThickness, 
          slotHeight + 2 * currentBorderThickness
        );
        ctx.restore();

        if (customBorder) {
          ctx.fillStyle = '#151413';
          ctx.fillRect(x, y, slotWidth, slotHeight);
        }

        if (imgUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, x, y, slotWidth, slotHeight);
            
            // Draw overlapping slot ornament
            if (frame.cornerEmoji) {
              ctx.font = `${layout === 'grid' ? 26 : 34}px serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(frame.cornerEmoji, x + slotWidth, y + slotHeight);
            }
            res();
          };
          img.onerror = () => {
            ctx.fillStyle = '#18181b';
            ctx.fillRect(x, y, slotWidth, slotHeight);
            res();
          };
          img.src = imgUrl;
        } else {
          ctx.fillStyle = '#27272a';
          ctx.fillRect(x, y, slotWidth, slotHeight);
          res();
        }
      });
    };

    // Render slots based on layout
    if (layout === 'single') {
      const x = (canvasWidth - slotWidth) / 2;
      const y = 200;
      await drawPhotoSlot(photos[0], x, y);
    } else if (layout === 'strip') {
      const startY = 160;
      const gap = 48;
      for (let i = 0; i < 3; i++) {
        const x = (canvasWidth - slotWidth) / 2;
        const y = startY + i * (slotHeight + gap);
        await drawPhotoSlot(photos[i], x, y);
      }
    } else { // grid
      const gapX = 40;
      const gapY = 40;
      const startX = (canvasWidth - (2 * slotWidth + gapX)) / 2;
      const startY = 240;

      const coords = [
        { x: startX, y: startY },
        { x: startX + slotWidth + gapX, y: startY },
        { x: startX, y: startY + slotHeight + gapY },
        { x: startX + slotWidth + gapX, y: startY + slotHeight + gapY }
      ];

      for (let i = 0; i < 4; i++) {
        await drawPhotoSlot(coords[i] ? photos[i] : null, coords[i].x, coords[i].y);
      }
    }

    // 3. Draw Emoji Logo Header
    if (frame.emoji) {
      ctx.font = '54px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frame.emoji, canvasWidth / 2, 80);
    }

    // 4. Draw Card corner ornaments
    if (frame.cornerEmoji) {
      ctx.font = '28px serif';
      // Top-Left
      ctx.fillText(frame.cornerEmoji, 40, 60);
      // Top-Right
      ctx.fillText(frame.cornerEmoji, canvasWidth - 40, 60);
      // Bottom-Left
      ctx.fillText(frame.cornerEmoji, 40, canvasHeight - 60);
      // Bottom-Right
      ctx.fillText(frame.cornerEmoji, canvasWidth - 40, canvasHeight - 60);
    }

    // 5. Draw Texts
    const footerY = canvasHeight - (layout === 'strip' ? 140 : 180);
    
    // category line
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 24px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frame.name.toUpperCase(), canvasWidth / 2, footerY);

    // custom text line
    const textVal = customText !== undefined ? customText : (frame.overlayText || "");
    if (textVal && textVal.trim() !== '') {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'normal 72px "Great Vibes", cursive';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textVal, canvasWidth / 2, footerY + 80);
      ctx.restore();
    }

    resolve(canvas.toDataURL('image/jpeg', 0.85));
  });
}

// Draw themed decorations on the Canvas
function drawThemedDecorations(ctx, width, height, frame) {
  const category = frame.category;
  const frameId = frame.id;
  const isGala = frameId?.startsWith('gala') || frameId?.startsWith('corpo') || frameId?.startsWith('mariage');
  const isAnniversary = category === 'Anniversaire' || isGala;

  // Helper to draw gold linear gradient border
  const getGoldGradient = (x1, y1, x2, y2) => {
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, '#bf953f');
    grad.addColorStop(0.25, '#fcf6ba');
    grad.addColorStop(0.5, '#b38728');
    grad.addColorStop(0.75, '#fbf5b7');
    grad.addColorStop(1, '#aa771c');
    return grad;
  };

  if (isAnniversary) {
    // Outer double border
    ctx.save();
    ctx.strokeStyle = getGoldGradient(0, 0, width, height);
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(16, 16, width - 32, height - 32);
    ctx.restore();

    // Draw gold balloons left and right
    drawGoldBalloons(ctx, 50, height * 0.25, 45);
    drawGoldBalloons(ctx, width - 50, height * 0.45, 45, true);

    // Draw confetti sparkles
    drawConfettiSparkles(ctx, width, height);
  }

  else if (category === 'Halloween') {
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#ff8c00');
    grad.addColorStop(0.5, '#7b2cbf');
    grad.addColorStop(1, '#ff8c00');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    
    ctx.strokeStyle = '#7b2cbf';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(16, 16, width - 32, height - 32);
    ctx.restore();

    drawHalloweenWeb(ctx, 0, 0, 120);
    drawHalloweenWeb(ctx, width, 0, 120, true);
    drawHalloweenBats(ctx, width - 100, height * 0.35);
  }

  else if (category === 'Noël') {
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#cc0000');
    grad.addColorStop(0.5, '#006400');
    grad.addColorStop(1, '#cc0000');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    
    ctx.strokeStyle = '#ffea00';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(16, 16, width - 32, height - 32);
    ctx.restore();

    drawChristmasOrnamentsCanvas(ctx, width - 120, 0);
    drawSnowflakesCanvas(ctx, width, height);
  }

  else if (category === 'St-Patrick') {
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#008000');
    grad.addColorStop(0.5, '#ffd700');
    grad.addColorStop(1, '#004d00');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(16, 16, width - 32, height - 32);
    ctx.restore();

    drawGreenBalloons(ctx, 50, height * 0.25, 45);
    drawGreenBalloons(ctx, width - 50, height * 0.45, 45, true);
    drawStPatrickCoinsCanvas(ctx, width - 100, height - 140);
  }

  else if (category === 'Pâques') {
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#ffd166');
    grad.addColorStop(0.5, '#ffb7b2');
    grad.addColorStop(1, '#ffc6ff');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(16, 16, width - 32, height - 32);
    ctx.restore();

    drawEasterDecoCanvas(ctx, 50, height - 120);
    drawEasterDecoCanvas(ctx, width - 100, 40, true);
  }
}

// Helpers for drawing specific canvas items
function drawGoldBalloons(ctx, cx, cy, size, flip = false) {
  ctx.save();
  if (flip) {
    ctx.translate(cx, cy);
    ctx.scale(-1, 1);
    ctx.translate(-cx, -cy);
  }

  ctx.strokeStyle = '#dddddd';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 20);
  ctx.quadraticCurveTo(cx - 10, cy + 80, cx, cy + 130);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy + 10);
  ctx.quadraticCurveTo(cx, cy + 80, cx, cy + 130);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 30, cy + 20);
  ctx.quadraticCurveTo(cx + 10, cy + 80, cx, cy + 130);
  ctx.stroke();

  const drawSingleBalloon = (bx, by, rx, ry, angle) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle);
    
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;

    const balloonGrad = ctx.createRadialGradient(-rx*0.3, -ry*0.3, rx*0.1, 0, 0, rx);
    balloonGrad.addColorStop(0, '#ffffff');
    balloonGrad.addColorStop(0.25, '#fdf0cd');
    balloonGrad.addColorStop(0.55, '#d4af37');
    balloonGrad.addColorStop(0.85, '#aa771c');
    balloonGrad.addColorStop(1, '#5c4008');

    ctx.fillStyle = balloonGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#aa771c';
    ctx.beginPath();
    ctx.moveTo(0, ry - 1);
    ctx.lineTo(-5, ry + 6);
    ctx.lineTo(5, ry + 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  ctx.globalAlpha = 1.0;
  drawSingleBalloon(cx - 30, cy + 15, size * 0.7, size * 0.95, -Math.PI / 12);
  drawSingleBalloon(cx + 30, cy + 15, size * 0.7, size * 0.95, Math.PI / 12);
  drawSingleBalloon(cx, cy, size * 0.8, size * 1.05, 0);

  ctx.restore();
}

function drawGreenBalloons(ctx, cx, cy, size, flip = false) {
  ctx.save();
  if (flip) {
    ctx.translate(cx, cy);
    ctx.scale(-1, 1);
    ctx.translate(-cx, -cy);
  }

  ctx.strokeStyle = '#dddddd';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 20);
  ctx.quadraticCurveTo(cx - 10, cy + 80, cx, cy + 130);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy + 10);
  ctx.quadraticCurveTo(cx, cy + 80, cx, cy + 130);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 30, cy + 20);
  ctx.quadraticCurveTo(cx + 10, cy + 80, cx, cy + 130);
  ctx.stroke();

  const drawSingleBalloon = (bx, by, rx, ry, angle) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle);
    
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;

    const balloonGrad = ctx.createRadialGradient(-rx*0.3, -ry*0.3, rx*0.1, 0, 0, rx);
    balloonGrad.addColorStop(0, '#ffffff');
    balloonGrad.addColorStop(0.25, '#c2ffd0');
    balloonGrad.addColorStop(0.55, '#00a82d');
    balloonGrad.addColorStop(0.85, '#004d11');
    balloonGrad.addColorStop(1, '#002107');

    ctx.fillStyle = balloonGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#004d11';
    ctx.beginPath();
    ctx.moveTo(0, ry - 1);
    ctx.lineTo(-5, ry + 6);
    ctx.lineTo(5, ry + 6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  ctx.globalAlpha = 1.0;
  drawSingleBalloon(cx - 30, cy + 15, size * 0.7, size * 0.95, -Math.PI / 12);
  drawSingleBalloon(cx + 30, cy + 15, size * 0.7, size * 0.95, Math.PI / 12);
  drawSingleBalloon(cx, cy, size * 0.8, size * 1.05, 0);

  ctx.restore();
}

function drawConfettiSparkles(ctx, width, height) {
  ctx.save();
  const drawStarLocal = (cx, cy, spikes, outerRadius, innerRadius, color) => {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const points = [
    { x: width * 0.12, y: height * 0.4, r: 8, color: '#ffd700' },
    { x: width * 0.85, y: height * 0.25, r: 10, color: '#ffffff' },
    { x: width * 0.78, y: height * 0.75, r: 9, color: '#ffd700' },
    { x: width * 0.2, y: height * 0.85, r: 7, color: '#ffd700' }
  ];

  points.forEach(pt => {
    ctx.save();
    ctx.shadowColor = 'rgba(255,215,0,0.4)';
    ctx.shadowBlur = 6;
    drawStarLocal(pt.x, pt.y, 5, pt.r, pt.r * 0.4, pt.color);
    ctx.restore();
  });

  ctx.fillStyle = '#ffd700';
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    if (rx < 80 || rx > width - 80 || ry < 80 || ry > height - 80) {
      ctx.globalAlpha = Math.random() * 0.6 + 0.3;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 4 + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawHalloweenWeb(ctx, cx, cy, size, flip = false) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 1.5;

  const dx = flip ? -1 : 1;

  ctx.beginPath();
  ctx.moveTo(cx, cy); ctx.lineTo(cx + size * dx, cy);
  ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + size);
  ctx.moveTo(cx, cy); ctx.lineTo(cx + size * 0.8 * dx, cy + size * 0.8);
  ctx.stroke();

  for (let r = size * 0.25; r <= size; r += size * 0.25) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, flip ? Math.PI : 0, flip ? Math.PI * 1.5 : Math.PI * 0.5);
    ctx.stroke();
  }

  if (!flip) {
    const sx = cx + size * 0.25;
    const sy = cy + size * 0.25;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy + 60);
    ctx.stroke();

    ctx.fillStyle = '#151413';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx, sy + 65, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy + 64); ctx.quadraticCurveTo(sx - 10, sy + 62, sx - 8, sy + 58);
    ctx.moveTo(sx + 4, sy + 64); ctx.quadraticCurveTo(sx + 10, sy + 62, sx + 8, sy + 58);
    ctx.moveTo(sx - 4, sy + 65); ctx.quadraticCurveTo(sx - 11, sy + 65, sx - 9, sy + 61);
    ctx.moveTo(sx + 4, sy + 65); ctx.quadraticCurveTo(sx + 11, sy + 65, sx + 9, sy + 61);
    ctx.moveTo(sx - 4, sy + 66); ctx.quadraticCurveTo(sx - 10, sy + 70, sx - 7, sy + 73);
    ctx.moveTo(sx + 4, sy + 66); ctx.quadraticCurveTo(sx + 10, sy + 70, sx + 7, sy + 73);
    ctx.stroke();
  }

  ctx.restore();
}

function drawHalloweenBats(ctx, cx, cy) {
  ctx.save();
  ctx.fillStyle = '#151413';
  ctx.strokeStyle = '#ff8c00';
  ctx.lineWidth = 1;

  const drawBat = (bx, by, scale) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-15, -15, -45, 5, -25, 20);
    ctx.bezierCurveTo(-15, 10, -5, 15, 0, 10);
    ctx.bezierCurveTo(5, 15, 15, 10, 25, 20);
    ctx.bezierCurveTo(45, 5, 15, -15, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  drawBat(cx, cy, 0.8);
  drawBat(cx - 80, cy - 40, 0.5);
  ctx.restore();
}

function drawChristmasOrnamentsCanvas(ctx, cx, cy) {
  ctx.save();
  
  const drawOrnament = (ox, oy, r, isRed) => {
    ctx.save();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, oy - r);
    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.fillRect(ox - 5, oy - r - 4, 10, 4);

    const ballGrad = ctx.createRadialGradient(ox - r*0.3, oy - r*0.3, r*0.1, ox, oy, r);
    if (isRed) {
      ballGrad.addColorStop(0, '#ffffff');
      ballGrad.addColorStop(0.3, '#ff5e5e');
      ballGrad.addColorStop(0.75, '#cc0000');
      ballGrad.addColorStop(1, '#590000');
    } else {
      ballGrad.addColorStop(0, '#ffffff');
      ballGrad.addColorStop(0.3, '#fdf0cd');
      ballGrad.addColorStop(0.70, '#d4af37');
      ballGrad.addColorStop(1, '#6b4c04');
    }

    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawOrnament(cx - 30, 80, 20, true);
  drawOrnament(cx + 30, 60, 20, false);
  drawOrnament(cx, 110, 24, true);

  ctx.restore();
}

function drawSnowflakesCanvas(ctx, width, height) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';

  const drawSnowflake = (sx, sy, size) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let d = 0; d < 4; d++) {
      const angle = (d * Math.PI) / 4;
      const dx = Math.cos(angle) * size;
      const dy = Math.sin(angle) * size;
      ctx.moveTo(sx - dx, sy - dy);
      ctx.lineTo(sx + dx, sy + dy);
      
      const branchX = Math.cos(angle) * size * 0.6;
      const branchY = Math.sin(angle) * size * 0.6;
      const vAngle1 = angle + Math.PI / 4;
      const vAngle2 = angle - Math.PI / 4;
      ctx.moveTo(sx + branchX, sy + branchY);
      ctx.lineTo(sx + branchX + Math.cos(vAngle1)*6, sy + branchY + Math.sin(vAngle1)*6);
      ctx.moveTo(sx + branchX, sy + branchY);
      ctx.lineTo(sx + branchX + Math.cos(vAngle2)*6, sy + branchY + Math.sin(vAngle2)*6);
    }
    ctx.stroke();
    ctx.restore();
  };

  drawSnowflake(60, 160, 22);
  drawSnowflake(width - 60, 260, 20);
  drawSnowflake(60, height - 200, 18);
  drawSnowflake(width - 60, height - 160, 22);

  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    if (rx < 80 || rx > width - 80 || ry < 80 || ry > height - 80) {
      ctx.globalAlpha = Math.random() * 0.5 + 0.4;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 4 + 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawStPatrickCoinsCanvas(ctx, cx, cy) {
  ctx.save();
  
  const drawCoin = (x, y, r) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#b38728';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffea00';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b38728';
    ctx.font = 'bold 12px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('☘', x, y + 1);

    ctx.restore();
  };

  drawCoin(cx - 20, cy + 10, 15);
  drawCoin(cx + 20, cy + 20, 15);
  drawCoin(cx, cy, 18);

  ctx.restore();
}

function drawEasterDecoCanvas(ctx, cx, cy, flip = false) {
  ctx.save();
  if (flip) {
    ctx.translate(cx, cy);
    ctx.scale(-1, -1);
    ctx.translate(-cx, -cy);
  }

  const drawFlower = (fx, fy, r) => {
    ctx.save();
    ctx.fillStyle = '#ffb7b2';
    ctx.beginPath();
    ctx.arc(fx - r, fy, r * 0.9, 0, Math.PI * 2);
    ctx.arc(fx + r, fy, r * 0.9, 0, Math.PI * 2);
    ctx.arc(fx, fy - r, r * 0.9, 0, Math.PI * 2);
    ctx.arc(fx, fy + r, r * 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(fx, fy, r * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawFlower(cx - 20, cy - 20, 10);
  
  ctx.save();
  ctx.translate(cx + 20, cy + 10);
  ctx.fillStyle = '#ffc6ff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#ffb703';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-12, -4);
  ctx.quadraticCurveTo(0, -8, 12, -4);
  ctx.moveTo(-12, 6);
  ctx.quadraticCurveTo(0, 2, 12, 6);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

