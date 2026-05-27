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

    // Draw slot with white border and drop shadow
    const drawPhotoSlot = (imgUrl, x, y) => {
      return new Promise((res) => {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
          x - borderThickness, 
          y - borderThickness, 
          slotWidth + 2 * borderThickness, 
          slotHeight + 2 * borderThickness
        );
        ctx.restore();

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

