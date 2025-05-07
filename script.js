const loadingBar = document.getElementById("loadingBar");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const loaderOverlay = document.getElementById("loader-overlay");
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

function AnimateCards()
{
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show");
    }, index * 300);
  });
};
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
  ? Math.min(8, Math.floor(game.clientWidth / 50))  // Smaller pixels for narrow layout
  : Math.min(10, Math.floor(game.clientWidth / 100));
    const spacing =0;
    const ballSize = 12;
    const charWidth = 5 * (pixelSize + spacing);
    const charSpacing = 1 * (pixelSize + spacing);
    const spaceWidth = 3 * (pixelSize + spacing);
    const textHeight = 5 * (pixelSize + spacing);
    let totalWidth = 0;
for (let c of name) {
  if (c === " ") {
    totalWidth += spaceWidth;
  } else {
    totalWidth += charWidth;
  }
  totalWidth += charSpacing;
}
totalWidth -= charSpacing; // remove final extra spacing

const startX = (game.clientWidth - totalWidth) / 2;
    const startY = (game.clientHeight - textHeight) / 2;
  
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
        ballY: Math.min(game.clientHeight - 30, startY + textHeight + 40)
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
      const totalTextHeight = nameLines.length * (7 * (pixelSize + spacing) + pixelSize); // line spacing
      const startY = (game.clientHeight - totalTextHeight) / 2;
    
      nameLines.forEach((line, lineIndex) => {
        let totalWidth = 0;
        for (let c of line) {
          totalWidth += (c === " ") ? spaceWidth : charWidth;
          totalWidth += charSpacing;
        }
        totalWidth -= charSpacing;
    
        let currentX = (game.clientWidth - totalWidth) / 2;
        const lineY = startY + lineIndex * (7 * (pixelSize + spacing) + pixelSize);
    
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
  
      pixels.forEach((p, i) => {
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
            const pixelCenterX = pxX + pxW / 2;
            const pixelCenterY = pxY + pxH / 2;
            const ballCenterX = ballX + ball.offsetWidth / 2;
            const ballCenterY = ballY + ball.offsetHeight / 2;
  
          let dx = ballCenterX - pixelCenterX;
          let dy = ballCenterY - pixelCenterY;
          const magnitude = Math.sqrt(dx * dx + dy * dy);
          if (magnitude > 0) {
            dx /= magnitude;
            dy /= magnitude;
            const speed = Math.sqrt(vx * vx + vy * vy);
            vx = dx * speed;
            vy = dy * speed;
          }
  
          game.removeChild(p);
          pixels.splice(i, 1);
        }
      });
  
      const paddleRect = {
        left: paddleX,
        right: paddleX + paddle.offsetWidth,
        top: parseFloat(paddle.style.top || (game.clientHeight - paddle.offsetHeight - 10)) || (game.clientHeight - paddle.offsetHeight - 10),
        bottom: parseFloat(paddle.style.top || (game.clientHeight - paddle.offsetHeight - 10)) + paddle.offsetHeight || (game.clientHeight - 10)
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
  