/**
 * MATRIX RAIN — Canvas digital rain effect
 * Self-contained: creates own canvas, appends to body.
 * Disable: prefers-reduced-motion, viewport < 768px, no .rain-enabled class.
 */
(function () {
  'use strict';

  var CHARS =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var FONT_SIZE = 16;
  var TRAIL_ALPHA = 0.05;

  var canvas, ctx, columns, drops, animId, running;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function canRun() {
    return (
      document.body.classList.contains('rain-enabled') &&
      window.innerWidth >= 768 &&
      !prefersReducedMotion()
    );
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
  }

   function resize() {
     var dpr = window.devicePixelRatio || 1;
     var width = window.innerWidth;
     var height = window.innerHeight;
     
     canvas.width = width * dpr;
     canvas.height = height * dpr;
     canvas.style.width = width + 'px';
     canvas.style.height = height + 'px';
     
     // Reset transform before scaling to prevent compounding
     ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
     
     columns = Math.floor(width / FONT_SIZE);
     drops = new Array(columns);
     for (var i = 0; i < columns; i++) {
       drops[i] = Math.random() * -100;
     }
   }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, ' + TRAIL_ALPHA + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = FONT_SIZE + 'px monospace';

    for (var i = 0; i < columns; i++) {
      var ch = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      var x = i * FONT_SIZE;
      var y = drops[i] * FONT_SIZE;

      // Head character: bright white-green
      var brightness = 0.8 + Math.random() * 0.2;
      ctx.fillStyle =
        'rgba(0, 255, 65, ' + brightness + ')';
      ctx.fillText(ch, x, y);

      // Dim previous position for depth
      if (drops[i] > 1) {
        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.fillText(
          CHARS.charAt(Math.floor(Math.random() * CHARS.length)),
          x,
          (drops[i] - 1) * FONT_SIZE
        );
      }

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    animId = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    if (!canvas) createCanvas();
    canvas.style.display = '';
    resize();
    running = true;
    animId = requestAnimationFrame(draw);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(animId);
    if (canvas) canvas.style.display = 'none';
  }

  function check() {
    if (canRun()) {
      start();
    } else {
      stop();
    }
  }

  // Theme editor support — registered BEFORE early return so they work regardless of canRun()
  document.addEventListener('shopify:section:load', function() {
    check();
  });

   document.addEventListener('shopify:section:unload', function() {
     stop();
     var c = document.getElementById('matrix-rain-canvas');
     if (c) c.remove();
     canvas = null;
     ctx = null;
   });

   // Resize listener — registered BEFORE early return so it works regardless of canRun()
   window.addEventListener('resize', function() {
     if (canvas && running) resize();
     check();
   });

   if (!canRun()) return;

   createCanvas();
   resize();
   running = true;
   animId = requestAnimationFrame(draw);

  window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .addEventListener('change', check);
})();
