const video = document.getElementById('video');
    const countdown = document.getElementById('countdown');
    const captureBtn = document.getElementById('captureBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const photoRow = document.getElementById('photoRow');
    const frameCanvas = document.getElementById('frameResult');
    const frameCtx = frameCanvas.getContext('2d');

    let capturedImages = [];

    // Start camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => video.srcObject = stream)
      .catch(err => console.error("Gagal membuka kamera:", err));

    // Countdown function
    function startCountdown(callback) {
      let count = 3;
      countdown.textContent = count;
      countdown.style.display = 'block';

      const timer = setInterval(() => {
        count--;
        countdown.textContent = count;
        if (count === 0) {
          clearInterval(timer);
          countdown.style.display = 'none';
          callback();
        }
      }, 1000);
    }

    function takePhoto() {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');

      // tampilkan hasil di bawah kamera
      const img = document.createElement('img');
      img.src = dataUrl;
      img.className = 'photo-preview';
      photoRow.appendChild(img);

      // Simpan ke array
      capturedImages.push(dataUrl);

      // Jika sudah 3 foto, tampilkan hasil akhir di frame
      if (capturedImages.length === 3) {
        drawFrameWithPhotos();
      }
    }

    function drawFrameWithPhotos() {
      const frame = new Image();
      frame.src = 'public/images/Frame.png'; // pastikan path ini benar

      const loadedImages = [];
      let loadedCount = 0;

      capturedImages.forEach((src, i) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedImages[i] = img;
          loadedCount++;
          if (loadedCount === 3) {
            frameCtx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);

            const positions = [
              { x: 0, y: 10, w: 591, h: 500 },
              { x: 0, y: 510, w: 591, h: 500 },
              { x: 0, y: 1010, w: 591, h: 500 }
            ];

            loadedImages.forEach((img, i) => {
              const pos = positions[i];
              frameCtx.drawImage(img, pos.x, pos.y, pos.w, pos.h);
            });

            frame.onload = () => {
              frameCtx.drawImage(frame, 0, 0, frameCanvas.width, frameCanvas.height);

              frameCanvas.style.display = 'block';
              downloadBtn.style.display = 'inline-block';
            };
          }
        };
      });
    }

    captureBtn.addEventListener('click', () => {
      if (capturedImages.length >= 3) return;
      startCountdown(takePhoto);
    });

    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      const rand = Math.floor(Math.random() * 100000);
      link.download = `photo_frame_${rand}.png`;
      link.href = frameCanvas.toDataURL('image/png');
      link.click();
    });