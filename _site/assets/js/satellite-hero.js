(function () {
  var hero   = document.getElementById('hero');
  var canvas = document.getElementById('sat-canvas');
  if (!hero || !canvas) return;

  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.src = '/assets/sat-bg.jpg';

  var currentX = 0, currentY = 0;
  var targetX  = 0, targetY  = 0;
  var raf = null;

  function draw(ox, oy) {
    if (!img.complete || !canvas.width) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale image to cover the canvas
    var scale = Math.max(canvas.width / img.width, canvas.height / img.height) * 1.08;
    var sw = img.width  * scale;
    var sh = img.height * scale;
    var baseX = (canvas.width  - sw) / 2;
    var baseY = (canvas.height - sh) / 2;

    ctx.drawImage(img, baseX + ox, baseY + oy, sw, sh);
  }

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    draw(currentX, currentY);
  }

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    draw(currentX, currentY);
    if (Math.abs(targetX - currentX) > 0.3 || Math.abs(targetY - currentY) > 0.3) {
      raf = requestAnimationFrame(animate);
    } else { raf = null; }
  }

  function startAnim() { if (!raf) raf = requestAnimationFrame(animate); }

  img.onload = function () { resize(); };

  hero.addEventListener('mouseenter', function () {
    canvas.classList.add('revealed');
  });
  hero.addEventListener('mousemove', function (e) {
    var r  = hero.getBoundingClientRect();
    var dx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
    var dy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
    targetX = dx * 30;   // ← increase for more parallax, decrease for less
    targetY = dy * 30;
    startAnim();
  });
  hero.addEventListener('mouseleave', function () {
    canvas.classList.remove('revealed');
    targetX = 0; targetY = 0;
    startAnim();
  });

  window.addEventListener('resize', resize);
  resize();
})();