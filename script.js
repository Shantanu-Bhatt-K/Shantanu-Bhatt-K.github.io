const loadingBar = document.getElementById("loadingBar");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const loaderOverlay = document.getElementById("loader-overlay");
const home = document.getElementById("HomePage");

document.body.classList.add("loading");


setTimeout(() => {
  loadingBar.style.width = "100%";
}, 100);

setTimeout(() => {
  loaderOverlay.classList.add("fade-out");
  game.style.display = "block";
  startGame();
  AnimateCards();
  setTimeout(() => {
    loaderOverlay.style.display = "none";
    document.body.classList.remove("loading");
  }, 500);
}, 2100);

const cards = document.querySelectorAll(".card");

function AnimateCards()
{
  const fans = document.querySelectorAll('.card-fan');
  fans.forEach(fan => {
    fan.classList.add('fan-open');
  });

    // Remove fan-in delay after animation completes (600ms animation + 400ms max delay)
    setTimeout(() => {
      cards.forEach(card => {
        card.style.transitionDelay = '0s';
      });
    }, 1000);
};

cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Click outside to reset
  document.body.addEventListener('click', (e) => {
    if (!e.target.closest('.card')) {
      cards.forEach(c => c.classList.remove('active'));
    }
  });
function startGame() {
    const letters = {
      "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
      "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
      "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
      "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
      "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
      "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
      "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
      " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"]
    };
  
    let nameLines;
    if (game.clientWidth < 1000) {
      nameLines = ["SHANTANU", "BHATT"];
    } else {
      nameLines = ["SHANTANU BHATT"];
    }
    const isNarrow = game.clientWidth < 1000;
    const pixelSize = isNarrow
      ? Math.min(8, Math.floor(game.clientWidth / 50))   // smaller pixels for narrow layout
      : Math.min(10, Math.floor(game.clientWidth / 100));
    const spacing = 0;
    const ballSize = 12;
    const charWidth = 5 * (pixelSize + spacing);
    const charSpacing = 1 * (pixelSize + spacing);
    const spaceWidth = 3 * (pixelSize + spacing);

    // One source of truth for text layout, used by both the ball spawn and
    // generateTextPixels. Previously this block iterated `name`, which resolves
    // to window.name (an empty string), so the width it produced was always 0.
    const lineStride = 7 * (pixelSize + spacing) + pixelSize;
    const totalTextHeight = nameLines.length * lineStride;
    const textTop = (game.clientHeight - totalTextHeight) / 2;
  
    const pixels = [];
    let paddleX = game.clientWidth / 2 - 40;
    let paddleVX = 0;
    let paddleOffset = 0;
    let useMouseControl = false;


  
    const paddle = createPaddle();
    const ball = createBall();
    let { vx, vy, ballX, ballY } = launchBall();
  
    generateTextPixels();

  
    game.addEventListener("mouseenter", () => useMouseControl = true);
    game.addEventListener("mouseleave", () => useMouseControl = false);
    document.addEventListener("mousemove", handleMouseMove);
  
    function createPaddle() {
      const paddle = document.createElement("div");
      paddle.className = "paddle";
      paddle.style.height =  `${ballSize}px`;
      game.appendChild(paddle);
      return paddle;
    }
  
    function createBall() {
      const ball = document.createElement("div");
      ball.className = "ball";
      ball.style.width = `${ballSize}px`;
      ball.style.height = `${ballSize}px`;
      game.appendChild(ball);
      return ball;
    }
  
    function launchBall() {
      const angle = -Math.random() * Math.PI;
      const speed = 4;
      return {
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        ballX: game.clientWidth / 2,
        ballY: Math.min(game.clientHeight - 30, textTop + totalTextHeight + 40)
      };
    }
  
    function handleMouseMove(e) {
      if (useMouseControl) {
        const rect = game.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        paddleX = Math.max(0, Math.min(game.clientWidth - paddle.offsetWidth, relativeX - paddle.offsetWidth / 2));
        paddle.style.left = `${paddleX}px`;
      }
    }
  
    function generateTextPixels() {
      nameLines.forEach((line, lineIndex) => {
        let totalWidth = 0;
        for (let c of line) {
          totalWidth += (c === " ") ? spaceWidth : charWidth;
          totalWidth += charSpacing;
        }
        totalWidth -= charSpacing;
    
        let currentX = (game.clientWidth - totalWidth) / 2;
        const lineY = textTop + lineIndex * lineStride;
    
        for (let c of line) {
          const bitmap = letters[c] || letters[" "];
          const isSpace = c === " ";
          const width = isSpace ? spaceWidth : charWidth;
    
          if (!isSpace) {
            bitmap.forEach((row, y) => {
              [...row].forEach((bit, x) => {
                if (bit === "1") {
                  const px = document.createElement("div");
                  px.className = "pixel";
                  px.style.width = `${pixelSize}px`;
                  px.style.height = `${pixelSize}px`;
                  px.style.left = `${currentX + x * (pixelSize + spacing)}px`;
                  px.style.top = `${lineY + y * (pixelSize + spacing)}px`;
                  game.appendChild(px);
                  pixels.push(px);
                }
              });
            });
          }
    
          currentX += width + charSpacing;
        }
      });
    }
  
    
  
    function update() {
      ballX += vx;
      ballY += vy;
  
      if (ballX < 0) {
        ballX = 0;
        vx *= -1;
      } else if (ballX > game.clientWidth - ballSize) {
        ballX = game.clientWidth - ballSize;
        vx *= -1;
      }
      if (ballY < 0) vy *= -1;
  
      if (ballY > game.clientHeight - ballSize) {
        ({ vx, vy, ballX, ballY } = launchBall());
      }
  
      const ballRect = {
        left: ballX,
        right: ballX + ball.offsetWidth,
        top: ballY,
        bottom: ballY + ball.offsetHeight
      };
  
      // Walk backwards so removing an element cannot skip the next one.
      // Collect every brick hit this frame and reflect once off their averaged
      // normal, rather than reflecting repeatedly and scrambling the direction.
      const ballCenterX = ballX + ball.offsetWidth / 2;
      const ballCenterY = ballY + ball.offsetHeight / 2;
      let normalX = 0;
      let normalY = 0;
      let hits = 0;

      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i];
        const pxX = parseFloat(p.style.left);
        const pxY = parseFloat(p.style.top);
        const pxW = p.offsetWidth;
        const pxH = p.offsetHeight;

        if (
          ballX + ball.offsetWidth > pxX &&
          ballX < pxX + pxW &&
          ballY + ball.offsetHeight > pxY &&
          ballY < pxY + pxH
        ) {
          normalX += ballCenterX - (pxX + pxW / 2);
          normalY += ballCenterY - (pxY + pxH / 2);
          hits++;

          game.removeChild(p);
          pixels.splice(i, 1);
        }
      }

      if (hits > 0) {
        const magnitude = Math.sqrt(normalX * normalX + normalY * normalY);
        if (magnitude > 0) {
          const speed = Math.sqrt(vx * vx + vy * vy);
          vx = (normalX / magnitude) * speed;
          vy = (normalY / magnitude) * speed;
        }
      }
  
      // The paddle is positioned by CSS `bottom`, so style.top is never set.
      // Derive its top directly instead of relying on parseFloat returning NaN.
      const paddleTop = game.clientHeight - paddle.offsetHeight - 10;
      const paddleRect = {
        left: paddleX,
        right: paddleX + paddle.offsetWidth,
        top: paddleTop,
        bottom: paddleTop + paddle.offsetHeight
      };
    if (
      ballRect.bottom >= paddleRect.top &&
      ballRect.right > paddleRect.left &&
      ballRect.left < paddleRect.right &&
      ballRect.top < paddleRect.bottom
    ) {
      paddleOffset = (Math.random() - 0.5) * 40;
      const paddleCenter = paddleX + paddle.offsetWidth / 2;
      const hitPos = (ballX + 6 - paddleCenter) / (paddle.offsetWidth / 2);
      const clamped = Math.max(-1, Math.min(1, hitPos));
      const maxBounceAngle = Math.PI / 3;
      const angle = clamped * maxBounceAngle;
      const speed = Math.sqrt(vx * vx + vy * vy);
      vx = speed * Math.sin(angle);
      vy = -Math.abs(speed * Math.cos(angle));
    }
  
      ball.style.left = ballX + "px";
      ball.style.top = ballY + "px";
  
      const stiffness = 0.05;
      const damping = 0.7;
  
      if (!useMouseControl) {
        const targetX = ballX + paddleOffset - paddle.offsetWidth / 2;
        let force = (targetX - paddleX) * stiffness;
        paddleVX = paddleVX * damping + force;
        paddleX += paddleVX;
        paddleX = Math.max(0, Math.min(game.clientWidth - paddle.offsetWidth, paddleX));
        paddle.style.left = `${paddleX}px`;
      }
  
      requestAnimationFrame(update);
    }
  
    update();
  }
  