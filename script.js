/* ============================================================
   AURORA STARFIELD
============================================================ */
const canvas = document.getElementById('spaceCanvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildStars(); buildBlobs();
}
window.addEventListener('resize', resize);

let stars = [];
function buildStars() {
  stars = [];
  const n = Math.floor((W * H) / 40000);
  for (let i = 0; i < n; i++) {
    const r = Math.random() * 1.8 + 0.4;
    stars.push({
      x: Math.random()*W, y: Math.random()*H, r,
      alpha: 0.8,
      dx: (Math.random()-0.5)*0.025,
      dy: (Math.random()-0.5)*0.018,
      tinted: Math.random() < 0.09,
    });
  }
}

function drawStars() {
  stars.forEach(s => {
    s.x += s.dx; s.y += s.dy;
    if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
    if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
    ctx.fillStyle = s.tinted ? `rgba(120,255,180,${s.alpha})` : `rgba(255,255,255,${s.alpha})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    if (s.r > 0.85) {
      const bc = s.tinted ? '120,255,180' : '255,255,255';
      const bloom = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*5);
      bloom.addColorStop(0, `rgba(${bc},${s.alpha*0.18})`);
      bloom.addColorStop(1, `rgba(${bc},0)`);
      ctx.fillStyle = bloom;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r*5,0,Math.PI*2); ctx.fill();
    }
  });
}

let blobs = [];
function smoothNoise(t, seed) {
  const s = seed * 127.1;
  return (Math.sin(t*1.31+s)*0.500 + Math.sin(t*2.97+s*1.7)*0.250 +
          Math.sin(t*6.23+s*3.2)*0.125 + Math.sin(t*13.1+s*5.8)*0.0625) / 0.9375;
}
function buildBlobs() {
  blobs = [];
  for (let i = 0; i < 5; i++) {
    blobs.push({
      cx:W*(i/5+0.1), cy:H*(0.2+Math.random()*0.6),
      r:Math.random()*200+250, hue:140+Math.random()*30, dHue:(Math.random()-0.5)*0.02,
      alpha:0.08+Math.random()*0.07, aMin:0.04, aMax:0.18,
      aSpeed:0.0003+Math.random()*0.0003, aDir:Math.random()<0.5?1:-1,
      tx:Math.random()*500, ty:Math.random()*500,
      speed:0.0008+Math.random()*0.0008, wander:0.28+Math.random()*0.18,
    });
  }
}
function drawBlobs() {
  blobs.forEach(b => {
    b.tx+=b.speed; b.ty+=b.speed*1.23;
    const nx=smoothNoise(b.tx,b.cx*0.0001), ny=smoothNoise(b.ty,b.cy*0.0001);
    const x=W*0.5+nx*W*b.wander, y=H*0.5+ny*H*b.wander*0.6;
    b.alpha+=b.aSpeed*b.aDir;
    if(b.alpha>=b.aMax){b.alpha=b.aMax;b.aDir=-1;}
    if(b.alpha<=b.aMin){b.alpha=b.aMin;b.aDir=1;}
    b.hue+=b.dHue; if(b.hue<130||b.hue>175)b.dHue*=-1;
    const g=ctx.createRadialGradient(x,y,0,x,y,b.r);
    g.addColorStop(0,`hsla(${b.hue},85%,62%,${b.alpha})`);
    g.addColorStop(0.35,`hsla(${b.hue},80%,52%,${b.alpha*0.55})`);
    g.addColorStop(0.7,`hsla(${b.hue},75%,45%,${b.alpha*0.2})`);
    g.addColorStop(1,`hsla(${b.hue},70%,40%,0)`);
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,b.r,0,Math.PI*2); ctx.fill();
  });
}
function bgAnimate() {
  ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
  drawBlobs(); drawStars(); requestAnimationFrame(bgAnimate);
}
resize(); bgAnimate();

/* ============================================================
   TYPED NAME
============================================================ */
(function initTyped() {
  const el = document.getElementById('typed-name');
  if (!el) return;
  const NAME = 'Ayaan'; let i = 0;
  function type() {
    if (i <= NAME.length) { el.textContent = NAME.slice(0,i++); setTimeout(type, i===1?950:88); }
  }
  type();
})();

/* ============================================================
   SCROLL REVEAL
============================================================ */
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} });
  }, {threshold:0.1, rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ============================================================
   ACTIVE NAV
============================================================ */
(function() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  function update() {
    let cur='';
    sections.forEach(s => { if(window.scrollY>=s.offsetTop-110) cur=s.id; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href')==='#'+cur));
  }
  window.addEventListener('scroll', update, {passive:true}); update();
})();

/* ============================================================
   BUTTON RIPPLE
============================================================ */
(function() {
  const st = document.createElement('style');
  st.textContent=`@keyframes ripple{to{width:260px;height:260px;opacity:0}}.ripple-wave{position:absolute;border-radius:50%;background:rgba(255,255,255,0.22);width:0;height:0;transform:translate(-50%,-50%);animation:ripple 0.6s ease-out forwards;pointer-events:none}`;
  document.head.appendChild(st);
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r=this.getBoundingClientRect(), el=document.createElement('span');
      el.className='ripple-wave';
      el.style.left=(e.clientX-r.left)+'px'; el.style.top=(e.clientY-r.top)+'px';
      this.appendChild(el); setTimeout(()=>el.remove(),650);
    });
  });
})();

/* ============================================================
   CONTACT FORM
============================================================ */
(function() {
  const form=document.getElementById('contact-form'), clearBtn=document.getElementById('clear-btn');
  if(!form) return;
  if(clearBtn) clearBtn.addEventListener('click',()=>form.reset());
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn=form.querySelector('button[type="submit"]'), orig=btn.textContent;
    btn.textContent='✓ Message Sent!';
    btn.style.background='linear-gradient(135deg,#0db886,#1de9b6,#3df5c8)';
    btn.disabled=true;
    setTimeout(()=>{btn.textContent=orig;btn.style.background='';btn.disabled=false;form.reset();},3200);
  });
})();

/* ============================================================
   SMOOTH SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

/* ============================================================
   CARD TILT
============================================================ */
(function() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      card.style.transform=`translateY(-8px) rotateX(${-dy*5}deg) rotateY(${dx*5}deg)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='';
      card.style.transition='transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      setTimeout(()=>{card.style.transition='';},500);
    });
  });
})();

/* ============================================================
   ██  GLASS MONITOR — IDE ENGINE  ██
   - Fixed tilt, no mouse interaction
   - 200+ line looping code corpus
   - Scroll-up: cursor always visible at bottom
   - Clean IDE colors, ZERO glow/text-shadow
============================================================ */
(function initIDE() {

  const ideCode   = document.getElementById('ide-code');
  const ideGutter = document.getElementById('ide-gutter');
  const vsCursor  = document.getElementById('ide-vscursor');
  const sbPos     = document.getElementById('sb-position');
  const codeWrap  = ideCode ? ideCode.parentElement : null;
  if (!ideCode || !codeWrap) return;

  /* ── 200+ LINE CODE CORPUS — 4 large snippets that loop ──
     Token types: keyword, fn, type, string, number,
                  comment, prop, operator, plain           */
  const K = 'keyword', F = 'fn', T = 'type', S = 'string',
        N = 'number',  C = 'comment', P = 'prop',
        O = 'operator', X = 'plain';

  const snippets = [

    /* ── SNIPPET A — ~55 lines: TypeScript portfolio app ── */
    [
      [C,'// ┌─────────────────────────────────────┐\n'],
      [C,'//   Portfolio App · TypeScript · Ayaan  \n'],
      [C,'// └─────────────────────────────────────┘\n'],
      [X,'\n'],
      [K,'import '],[X,'{ '],[F,'createServer'],[X,' } '],[K,'from '],[S,'"http"'],[X,';\n'],
      [K,'import '],[X,'{ '],[F,'connect'],[X,' } '],[K,'from '],[S,'"mongoose"'],[X,';\n'],
      [K,'import '],[X,'{ Router } '],[K,'from '],[S,'"express"'],[X,';\n'],
      [X,'\n'],
      [C,'// — Data Models —\n'],
      [K,'interface '],[T,'Project'],[X,' {\n'],
      [P,'  id'],[X,': '],[T,'string'],[X,';\n'],
      [P,'  title'],[X,': '],[T,'string'],[X,';\n'],
      [P,'  stack'],[X,': '],[T,'string'],[X,'[];\n'],
      [P,'  live'],[X,': '],[T,'boolean'],[X,';\n'],
      [P,'  stars'],[X,': '],[T,'number'],[X,';\n'],
      [X,'}\n\n'],
      [K,'interface '],[T,'Developer'],[X,' {\n'],
      [P,'  name'],[X,': '],[T,'string'],[X,';\n'],
      [P,'  role'],[X,': '],[T,'string'],[X,';\n'],
      [P,'  yearsXP'],[X,': '],[T,'number'],[X,';\n'],
      [P,'  projects'],[X,': '],[T,'Project'],[X,'[];\n'],
      [X,'}\n\n'],
      [C,'// — Config —\n'],
      [K,'const '],[X,'CONFIG = {\n'],
      [P,'  port'],[X,': '],[N,'3000'],[X,',\n'],
      [P,'  host'],[X,': '],[S,'"0.0.0.0"'],[X,',\n'],
      [P,'  dbUrl'],[X,': '],[S,'"mongodb://localhost:27017/portfolio"'],[X,',\n'],
      [P,'  env'],[X,': process.env.NODE_ENV '],[O,'||'],[X,' '],[S,'"development"'],[X,',\n'],
      [X,'} '],[K,'as const'],[X,';\n\n'],
      [C,'// — Bootstrap —\n'],
      [K,'async function '],[F,'bootstrap'],[X,'() {\n'],
      [K,'  try '],[X,'{\n'],
      [X,'    '],[K,'await '],[F,'connect'],[X,'(CONFIG.'],[P,'dbUrl'],[X,');\n'],
      [X,'    console.'],[F,'log'],[X,'('],[S,'"✓ Database connected"'],[X,');\n\n'],
      [K,'    const '],[X,'app = '],[F,'createServer'],[X,'(router);\n'],
      [X,'    app.'],[F,'listen'],[X,'(CONFIG.'],[P,'port'],[X,', () => {\n'],
      [X,'      console.'],[F,'log'],[X,'(`Server on port ${CONFIG.'],[P,'port'],[X,'}`);\n'],
      [X,'    });\n'],
      [K,'  } catch '],[X,'(err) {\n'],
      [X,'    console.'],[F,'error'],[X,'('],[S,'"✗ Boot failed:"'],[X,', err);\n'],
      [X,'    process.'],[F,'exit'],[X,'('],[N,'1'],[X,');\n'],
      [X,'  }\n'],
      [X,'}\n\n'],
      [F,'bootstrap'],[X,'();\n'],
    ],

    /* ── SNIPPET B — ~60 lines: React hooks & components ── */
    [
      [C,'// ┌─────────────────────────────────────┐\n'],
      [C,'//   React Frontend · Next.js · Ayaan    \n'],
      [C,'// └─────────────────────────────────────┘\n'],
      [X,'\n'],
      [K,'import '],[X,'React, { '],[F,'useState'],[X,', '],[F,'useEffect'],[X,', '],[F,'useCallback'],[X,' }'],
      [X,' '],[K,'from '],[S,'"react"'],[X,';\n'],
      [K,'import '],[X,'{ '],[F,'motion'],[X,', '],[F,'AnimatePresence'],[X,' } '],
      [K,'from '],[S,'"framer-motion"'],[X,';\n'],
      [K,'import '],[X,'type { '],[T,'FC'],[X,', '],[T,'ReactNode'],[X,' } '],
      [K,'from '],[S,'"react"'],[X,';\n\n'],
      [C,'// — Types —\n'],
      [K,'type '],[T,'Theme'],[X,' = '],[S,'"light"'],[X,' | '],[S,'"dark"'],[X,' | '],[S,'"system"'],[X,';\n'],
      [K,'type '],[T,'Status'],[X,' = '],[S,'"idle"'],[X,' | '],[S,'"loading"'],[X,' | '],[S,'"success"'],[X,' | '],[S,'"error"'],[X,';\n\n'],
      [K,'interface '],[T,'AppProps'],[X,' {\n'],
      [P,'  children'],[X,': '],[T,'ReactNode'],[X,';\n'],
      [P,'  theme'],[X,'?: '],[T,'Theme'],[X,';\n'],
      [X,'}\n\n'],
      [C,'// — Custom hook: useTheme —\n'],
      [K,'function '],[F,'useTheme'],[X,'('],[P,'initial'],[X,': '],[T,'Theme'],[X,' = '],[S,'"system"'],[X,') {\n'],
      [K,'  const '],[X,'[theme, setTheme] = '],[F,'useState'],[X,'<'],[T,'Theme'],[X,'>(initial);\n\n'],
      [F,'  useEffect'],[X,'(() => {\n'],
      [X,'    '],[K,'const '],[X,'mq = window.'],[F,'matchMedia'],[X,'('],[S,'"(prefers-color-scheme: dark)"'],[X,');\n'],
      [K,'    if '],[X,'(theme === '],[S,'"system"'],[X,') {\n'],
      [F,'      setTheme'],[X,'(mq.matches ? '],[S,'"dark"'],[X,' : '],[S,'"light"'],[X,');\n'],
      [X,'    }\n'],
      [X,'  }, [theme]);\n\n'],
      [K,'  const '],[X,'toggle = '],[F,'useCallback'],[X,'(() => {\n'],
      [F,'    setTheme'],[X,'(t => t === '],[S,'"dark"'],[X,' ? '],[S,'"light"'],[X,' : '],[S,'"dark"'],[X,');\n'],
      [X,'  }, []);\n\n'],
      [K,'  return '],[X,'{ theme, toggle };\n'],
      [X,'}\n\n'],
      [C,'// — App Shell —\n'],
      [K,'const '],[T,'App'],[X,': '],[T,'FC'],[X,'<'],[T,'AppProps'],[X,'> = ({ children, theme = '],[S,'"system"'],[X,' }) => {\n'],
      [K,'  const '],[X,'{ theme: activeTheme, toggle } = '],[F,'useTheme'],[X,'(theme);\n'],
      [K,'  const '],[X,'[status, setStatus] = '],[F,'useState'],[X,'<'],[T,'Status'],[X,'>('],
      [S,'"idle"'],[X,');\n\n'],
      [K,'  return '],[X,'(\n'],
      [X,'    <'],[T,'AnimatePresence'],[X,' mode='],[S,'"wait"'],[X,'>\n'],
      [X,'      <'],[T,'motion.div'],[X,'\n'],
      [P,'        className'],[X,'='],[S,'"app"'],[X,'\n'],
      [P,'        data-theme'],[X,'={activeTheme}\n'],
      [P,'        initial'],[X,'={{ opacity: '],[N,'0'],[X,' }}\n'],
      [P,'        animate'],[X,'={{ opacity: '],[N,'1'],[X,' }}\n'],
      [P,'        exit'],[X,'={{ opacity: '],[N,'0'],[X,' }}\n'],
      [X,'      >\n'],
      [X,'        {children}\n'],
      [X,'      </'],[T,'motion.div'],[X,'>\n'],
      [X,'    </'],[T,'AnimatePresence'],[X,'>\n'],
      [X,'  );\n'],
      [X,'};\n\n'],
      [K,'export default '],[T,'App'],[X,';\n'],
    ],

    /* ── SNIPPET C — ~55 lines: Node.js API routes ── */
    [
      [C,'// ┌─────────────────────────────────────┐\n'],
      [C,'//   REST API · Express · Ayaan           \n'],
      [C,'// └─────────────────────────────────────┘\n'],
      [X,'\n'],
      [K,'import '],[X,'express, { '],[T,'Request'],[X,', '],[T,'Response'],[X,', '],[T,'NextFunction'],[X,' }'],
      [X,' '],[K,'from '],[S,'"express"'],[X,';\n'],
      [K,'import '],[X,'{ '],[F,'body'],[X,', '],[F,'validationResult'],[X,' } '],[K,'from '],[S,'"express-validator"'],[X,';\n'],
      [K,'import '],[X,'{ '],[T,'ProjectModel'],[X,' } '],[K,'from '],[S,'"../models"'],[X,';\n\n'],
      [K,'const '],[X,'router = express.'],[F,'Router'],[X,'();\n\n'],
      [C,'// GET /projects\n'],
      [X,'router.'],[F,'get'],[X,'('],[S,'"/"'],[X,', '],[K,'async '],[X,'(req: '],[T,'Request'],[X,', res: '],[T,'Response'],[X,') => {\n'],
      [K,'  try '],[X,'{\n'],
      [K,'    const '],[X,'{ page = '],[S,'"1"'],[X,', limit = '],[S,'"10"'],[X,' } = req.query;\n'],
      [K,'    const '],[X,'projects = '],[K,'await '],[T,'ProjectModel'],[X,'\n'],
      [X,'      .'],[F,'find'],[X,'({ live: '],[K,'true'],[X,' })\n'],
      [X,'      .'],[F,'sort'],[X,'({ stars: '],[O,'-'],[N,'1'],[X,' })\n'],
      [X,'      .'],[F,'skip'],[X,'((+page '],[O,'-'],[X,' '],[N,'1'],[X,') '],[O,'*'],[X,' +limit)\n'],
      [X,'      .'],[F,'limit'],[X,'(+limit)\n'],
      [X,'      .'],[F,'lean'],[X,'();\n'],
      [X,'    res.'],[F,'json'],[X,'({ ok: '],[K,'true'],[X,', data: projects });\n'],
      [K,'  } catch '],[X,'(err) {\n'],
      [X,'    res.'],[F,'status'],[X,'('],[N,'500'],[X,').'],[F,'json'],[X,'({ ok: '],[K,'false'],[X,', error: err });\n'],
      [X,'  }\n'],
      [X,'});\n\n'],
      [C,'// POST /projects\n'],
      [X,'router.'],[F,'post'],[X,'(\n'],
      [X,'  '],[S,'"/"'],[X,',\n'],
      [F,'  body'],[X,'('],[S,'"title"'],[X,').'],[F,'notEmpty'],[X,'(),\n'],
      [F,'  body'],[X,'('],[S,'"stack"'],[X,').'],[F,'isArray'],[X,'(),\n'],
      [K,'  async '],[X,'(req: '],[T,'Request'],[X,', res: '],[T,'Response'],[X,') => {\n'],
      [K,'    const '],[X,'errors = '],[F,'validationResult'],[X,'(req);\n'],
      [K,'    if '],[X,'(!errors.'],[F,'isEmpty'],[X,'()) {\n'],
      [K,'      return '],[X,'res.'],[F,'status'],[X,'('],[N,'400'],[X,').'],[F,'json'],[X,'({ errors: errors.'],[F,'array'],[X,'() });\n'],
      [X,'    }\n\n'],
      [K,'    const '],[X,'project = '],[K,'new '],[T,'ProjectModel'],[X,'(req.body);\n'],
      [K,'    await '],[X,'project.'],[F,'save'],[X,'();\n'],
      [X,'    res.'],[F,'status'],[X,'('],[N,'201'],[X,').'],[F,'json'],[X,'({ ok: '],[K,'true'],[X,', data: project });\n'],
      [X,'  }\n'],
      [X,');\n\n'],
      [K,'export default '],[X,'router;\n'],
    ],

    /* ── SNIPPET D — ~55 lines: Canvas / WebGL animation ── */
    [
      [C,'// ┌─────────────────────────────────────┐\n'],
      [C,'//   Canvas Engine · WebGL · Ayaan        \n'],
      [C,'// └─────────────────────────────────────┘\n'],
      [X,'\n'],
      [K,'import '],[X,'* '],[K,'as '],[T,'THREE'],[X,' '],[K,'from '],[S,'"three"'],[X,';\n'],
      [K,'import '],[X,'{ '],[T,'OrbitControls'],[X,' } '],[K,'from '],[S,'"three/examples/jsm/controls/OrbitControls"'],[X,';\n\n'],
      [K,'interface '],[T,'SceneConfig'],[X,' {\n'],
      [P,'  width'],[X,': '],[T,'number'],[X,';\n'],
      [P,'  height'],[X,': '],[T,'number'],[X,';\n'],
      [P,'  antialias'],[X,': '],[T,'boolean'],[X,';\n'],
      [P,'  pixelRatio'],[X,': '],[T,'number'],[X,';\n'],
      [X,'}\n\n'],
      [K,'class '],[T,'Universe'],[X,' {\n'],
      [P,'  private '],[X,'scene: '],[T,'THREE.Scene'],[X,';\n'],
      [P,'  private '],[X,'camera: '],[T,'THREE.PerspectiveCamera'],[X,';\n'],
      [P,'  private '],[X,'renderer: '],[T,'THREE.WebGLRenderer'],[X,';\n'],
      [P,'  private '],[X,'particles: '],[T,'THREE.Points'],[X,';\n'],
      [P,'  private '],[X,'frame = '],[N,'0'],[X,';\n\n'],
      [K,'  constructor'],[X,'(canvas: '],[T,'HTMLCanvasElement'],[X,', cfg: '],[T,'SceneConfig'],[X,') {\n'],
      [K,'    this'],[X,'.'],[P,'scene'],[X,' = '],[K,'new '],[T,'THREE.Scene'],[X,'();\n'],
      [K,'    this'],[X,'.'],[P,'camera'],[X,' = '],[K,'new '],[T,'THREE.PerspectiveCamera'],[X,'('],[N,'75'],[X,', cfg.'],[P,'width'],[X,'/'],[X,'cfg.'],[P,'height'],[X,', '],[N,'0.1'],[X,', '],[N,'1000'],[X,');\n'],
      [K,'    this'],[X,'.'],[P,'camera'],[X,'.'],[P,'position'],[X,'.'],[F,'set'],[X,'('],[N,'0'],[X,','],[N,'0'],[X,','],[N,'5'],[X,');\n\n'],
      [K,'    this'],[X,'.'],[P,'renderer'],[X,' = '],[K,'new '],[T,'THREE.WebGLRenderer'],[X,'({ canvas, antialias: cfg.'],[P,'antialias'],[X,' });\n'],
      [K,'    this'],[X,'.'],[P,'renderer'],[X,'.'],[F,'setPixelRatio'],[X,'(cfg.'],[P,'pixelRatio'],[X,');\n'],
      [K,'    this'],[X,'.'],[P,'renderer'],[X,'.'],[F,'setSize'],[X,'(cfg.'],[P,'width'],[X,', cfg.'],[P,'height'],[X,');\n\n'],
      [K,'    this'],[X,'.'],[P,'particles'],[X,' = '],[K,'this'],[X,'.'],[F,'createParticles'],[X,'('],[N,'8000'],[X,');\n'],
      [K,'    this'],[X,'.'],[P,'scene'],[X,'.'],[F,'add'],[X,'('],[K,'this'],[X,'.'],[P,'particles'],[X,');\n'],
      [X,'  }\n\n'],
      [P,'  private '],[F,'createParticles'],[X,'(count: '],[T,'number'],[X,'): '],[T,'THREE.Points'],[X,' {\n'],
      [K,'    const '],[X,'geo = '],[K,'new '],[T,'THREE.BufferGeometry'],[X,'();\n'],
      [K,'    const '],[X,'pos = '],[K,'new '],[T,'Float32Array'],[X,'(count '],[O,'*'],[X,' '],[N,'3'],[X,');\n'],
      [K,'    for '],[X,'('],[K,'let '],[X,'i = '],[N,'0'],[X,'; i < count '],[O,'*'],[X,' '],[N,'3'],[X,'; i++) {\n'],
      [X,'      pos[i] = (Math.'],[F,'random'],[X,'() '],[O,'-'],[X,' '],[N,'0.5'],[X,') '],[O,'*'],[X,' '],[N,'200'],[X,';\n'],
      [X,'    }\n'],
      [X,'    geo.'],[F,'setAttribute'],[X,'('],[S,'"position"'],[X,', '],[K,'new '],[T,'THREE.BufferAttribute'],[X,'(pos, '],[N,'3'],[X,'));\n'],
      [K,'    const '],[X,'mat = '],[K,'new '],[T,'THREE.PointsMaterial'],[X,'({ color: '],[N,'0x1de9b6'],[X,', size: '],[N,'0.15'],[X,' });\n'],
      [K,'    return new '],[T,'THREE.Points'],[X,'(geo, mat);\n'],
      [X,'  }\n\n'],
      [F,'  render'],[X,'() {\n'],
      [K,'    this'],[X,'.'],[P,'frame'],[X,'++;\n'],
      [K,'    this'],[X,'.'],[P,'particles'],[X,'.'],[P,'rotation'],[X,'.'],[P,'y'],[X,' += '],[N,'0.0003'],[X,';\n'],
      [K,'    this'],[X,'.'],[P,'renderer'],[X,'.'],[F,'render'],[X,'('],[K,'this'],[X,'.'],[P,'scene'],[X,', '],[K,'this'],[X,'.'],[P,'camera'],[X,');\n'],
      [X,'    '],[F,'requestAnimationFrame'],[X,'(() => '],[K,'this'],[X,'.'],[F,'render'],[X,'());\n'],
      [X,'  }\n'],
      [X,'}\n\n'],
      [K,'const '],[X,'universe = '],[K,'new '],[T,'Universe'],[X,'(\n'],
      [X,'  document.'],[F,'querySelector'],[X,'<'],[T,'HTMLCanvasElement'],[X,'>('],
      [S,'"#canvas"'],[X,')!,\n'],
      [X,'  { width: window.'],[P,'innerWidth'],[X,', height: window.'],[P,'innerHeight'],[X,', antialias: '],[K,'true'],[X,', pixelRatio: devicePixelRatio }\n'],
      [X,');\n'],
      [X,'universe.'],[F,'render'],[X,'();\n'],
    ],

  ]; // end snippets

  /* ── Token → CSS class map ── */
  const cls = { keyword:'syn-keyword', fn:'syn-fn', type:'syn-type', string:'syn-string',
                number:'syn-number', comment:'syn-comment', prop:'syn-prop',
                operator:'syn-operator', plain:'' };

  /* ── State ── */
  let si = 0, ti = 0, ci = 0, line = 1, col = 1, isClearing = false;

  /* ── Line height & char width (measured live) ── */
  function lineH() { return parseFloat(getComputedStyle(ideCode).lineHeight) || 25.3; }
  function charW() { return parseFloat(getComputedStyle(ideCode).fontSize) * 0.601 || 8.8; }

  /* ── Gutter ── */
  function updateGutter() {
    ideGutter.innerHTML = '';
    for (let i = 1; i <= line; i++) {
      const s = document.createElement('span');
      s.textContent = i;
      if (i === line) s.style.color = 'rgba(200,210,220,0.45)';
      ideGutter.appendChild(s);
    }
  }

  /* ── Scroll-up so cursor stays at bottom ── */
  function scrollToBottom() {
    const lh     = lineH();
    const wrapH  = codeWrap.clientHeight;
    const padTop = 12;
    const bottom = padTop + line * lh;
    if (bottom > wrapH) {
      const shift = bottom - wrapH + 14;
      ideCode.style.transform   = `translateY(-${shift}px)`;
      ideGutter.style.transform = `translateY(-${shift}px)`;
    } else {
      ideCode.style.transform   = '';
      ideGutter.style.transform = '';
    }
  }

  /* ── Place cursor ── */
  function updateCursor() {
    if (!vsCursor) return;
    const lh = lineH(), cw = charW();
    vsCursor.style.top    = (12 + (line-1)*lh) + 'px';
    vsCursor.style.left   = (16 + (col-1)*cw)  + 'px';
    vsCursor.style.height = (lh * 0.80)         + 'px';
    if (sbPos) sbPos.textContent = `Ln ${line}, Col ${col}`;
  }

  /* ── Build highlighted HTML up to (ti, ci) ── */
  function buildHTML(snippet, upTi, upCi) {
    let html = '';
    for (let i = 0; i <= upTi && i < snippet.length; i++) {
      const [type, text] = snippet[i];
      const klass = cls[type] || '';
      const raw   = i < upTi ? text : text.slice(0, upCi);
      const esc   = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      html += klass ? `<span class="${klass}">${esc}</span>` : esc;
    }
    ideCode.innerHTML = html;
  }

  /* ── Type one character ── */
  function typeChar() {
    if (isClearing) return;
    const snippet = snippets[si];
    if (ti >= snippet.length) { setTimeout(clearSnippet, 2200); return; }

    const [, text] = snippet[ti];
    const ch = text[ci];

    if (ch === '\n') { line++; col = 1; } else { col++; }

    buildHTML(snippet, ti, ci + 1);
    updateGutter();
    updateCursor();
    scrollToBottom();

    ci++;
    if (ci >= text.length) { ti++; ci = 0; }

    setTimeout(typeChar, ch === '\n' ? 18 : 12);
  }

  /* ── Fast-erase then advance to next snippet ── */
  function clearSnippet() {
    isClearing = true;
    const snippet = snippets[si];
    const total   = snippet.reduce((s,[,t]) => s + t.length, 0);
    const step    = Math.max(6, Math.floor(total / 25));
    let   erased  = 0;

    function erase() {
      erased += step;
      if (erased >= total) {
        ideCode.innerHTML = '';
        ideCode.style.transform = ideGutter.style.transform = '';
        line = 1; col = 1;
        updateGutter(); updateCursor();
        isClearing = false;
        ti = 0; ci = 0;
        si = (si + 1) % snippets.length;
        setTimeout(typeChar, 500);
        return;
      }
      const rem = total - erased;
      let r = rem, rTi = 0, rCi = 0;
      for (rTi = 0; rTi < snippet.length; rTi++) {
        if (r <= snippet[rTi][1].length) { rCi = r; break; }
        r -= snippet[rTi][1].length;
      }
      buildHTML(snippet, rTi, rCi);
      const txt = ideCode.textContent || '';
      line = (txt.match(/\n/g)||[]).length + 1;
      const lastNL = txt.lastIndexOf('\n');
      col = lastNL === -1 ? txt.length + 1 : txt.length - lastNL;
      updateGutter(); updateCursor(); scrollToBottom();
      setTimeout(erase, 14);
    }
    erase();
  }

  /* Boot */
  updateGutter(); updateCursor();
  setTimeout(typeChar, 1500);

})();

/* ============================================================
   CONTACT FORM - EMAIL FUNCTIONALITY
============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const clearBtn = document.getElementById('clear-btn');
  
  if (!form) return;

  // Get all input fields
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const messageInput = form.querySelector('textarea');

  // Clear button functionality
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      form.reset();
      removeValidationStates();
    });
  }

  // Remove validation states
  function removeValidationStates() {
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) {
        input.style.borderColor = '';
        input.style.background = '';
      }
    });
  }

  // Email validation regex
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show notification
  function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotif = document.querySelector('.form-notification');
    if (existingNotif) existingNotif.remove();

    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '30px',
      padding: '16px 24px',
      borderRadius: '12px',
      background: type === 'success' 
        ? 'rgba(29, 233, 182, 0.15)' 
        : 'rgba(255, 82, 82, 0.15)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${type === 'success' ? 'rgba(29, 233, 182, 0.3)' : 'rgba(255, 82, 82, 0.3)'}`,
      color: type === 'success' ? '#1de9b6' : '#ff5252',
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '0.95rem',
      fontWeight: '600',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      zIndex: '10000',
      animation: 'slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      maxWidth: '400px',
      wordWrap: 'break-word'
    });

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Add notification animations to document
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Validate field
  function validateField(input, errorMsg) {
    const value = input.value.trim();
    
    if (!value) {
      input.style.borderColor = '#ff5252';
      input.style.background = 'rgba(255, 82, 82, 0.05)';
      return false;
    }

    if (input.type === 'email' && !isValidEmail(value)) {
      input.style.borderColor = '#ff5252';
      input.style.background = 'rgba(255, 82, 82, 0.05)';
      return false;
    }

    input.style.borderColor = '#1de9b6';
    input.style.background = 'rgba(29, 233, 182, 0.04)';
    return true;
  }

  // Real-time validation on input
  [nameInput, emailInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          validateField(this);
        } else {
          this.style.borderColor = '';
          this.style.background = '';
        }
      });
    }
  });

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(nameInput, 'Please enter your name');
    const isEmailValid = validateField(emailInput, 'Please enter a valid email');
    const isMessageValid = validateField(messageInput, 'Please enter your message');

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      showNotification('Please fill in all fields correctly', 'error');
      return;
    }

    // Get form values
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim()
    };

    // Disable submit button during sending
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';

    try {
      // Initialize EmailJS (you'll need to set this up)
      // For now, we'll use Web3Forms as an alternative which is easier to set up
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '749beb00-d834-4143-a19e-927f5d706436', // You'll need to replace this
          name: formData.name,
          email: formData.email,
          message: formData.message,
          to: 'mohammedayaan80022132@gmail.com', // Your email (fixed the typo)
          subject: `New Portfolio Contact from ${formData.name}`,
          from_name: 'Portfolio Website',
          replyto: formData.email
        })
      });

      const result = await response.json();

      if (result.success) {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
        removeValidationStates();
      } else {
        throw new Error('Failed to send message');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Failed to send message. Please try again or email me directly at mohammedayaan80022132@gmail.com', 'error');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      submitBtn.style.opacity = '';
      submitBtn.style.cursor = '';
    }
  });

})();
/* ============================================================
   LOADING SCREEN WITH PROGRESS
============================================================ */
(function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingFill = document.getElementById('loading-fill');
  const loadingPercent = document.getElementById('loading-percent');
  const loadingText = document.getElementById('loading-text');
  const loadingQuote = document.getElementById('loading-quote');
  
  if (!loadingScreen) return;

  const quotes = [
    '"Great software is built with passion and precision."',
    '"Code is poetry written for machines."',
    '"First, solve the problem. Then, write the code."',
    '"Simplicity is the soul of efficiency." – Austin Freeman',
    '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." – Martin Fowler'
  ];

  // Set random quote
  if (loadingQuote) {
    loadingQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }

  let progress = 0;
  const loadingMessages = [
    'Initializing...',
    'Loading assets...',
    'Preparing interface...',
    'Almost ready...',
    'Welcome!'
  ];

  const updateProgress = (targetProgress) => {
    const increment = (targetProgress - progress) / 20;
    const interval = setInterval(() => {
      progress += increment;
      
      if (progress >= targetProgress) {
        progress = targetProgress;
        clearInterval(interval);
        
        // Update message based on progress
        if (progress >= 20 && progress < 40 && loadingText) {
          loadingText.textContent = loadingMessages[1];
        } else if (progress >= 40 && progress < 60 && loadingText) {
          loadingText.textContent = loadingMessages[2];
        } else if (progress >= 60 && progress < 90 && loadingText) {
          loadingText.textContent = loadingMessages[3];
        } else if (progress >= 90 && loadingText) {
          loadingText.textContent = loadingMessages[4];
        }
        
        if (progress >= 100) {
          setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 800);
          }, 300);
        }
      }
      
      if (loadingFill) loadingFill.style.width = progress + '%';
      if (loadingPercent) loadingPercent.textContent = Math.floor(progress) + '%';
    }, 30);
  };

  // Simulate realistic loading
  setTimeout(() => updateProgress(20), 100);
  setTimeout(() => updateProgress(40), 400);
  setTimeout(() => updateProgress(60), 800);
  setTimeout(() => updateProgress(85), 1200);
  setTimeout(() => updateProgress(100), 1800);

  // Ensure loading screen is removed even if assets take long
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (!loadingScreen.classList.contains('hidden')) {
        updateProgress(100);
      }
    }, 2500);
  });
})();

/* ============================================================
   SCROLL PROGRESS INDICATOR
============================================================ */
(function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = Math.min(progress, 100) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ============================================================
   FAQ ACCORDION
============================================================ */
(function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close all other FAQs
      faqQuestions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current FAQ
      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Keyboard accessibility
  faqQuestions.forEach(question => {
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
})();

/* ============================================================
   RESUME DOWNLOAD
============================================================ */
(function initResumeDownload() {
  const downloadBtn = document.getElementById('download-resume');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>Resume download started!</span>
    `;
    
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      padding: '16px 24px',
      background: 'rgba(29, 233, 182, 0.15)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(29, 233, 182, 0.3)',
      borderRadius: '12px',
      color: '#1de9b6',
      fontFamily: 'Rajdhani, sans-serif',
      fontSize: '0.95rem',
      fontWeight: '600',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      zIndex: '10000',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      maxWidth: '400px'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutDown 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Add animations
    if (!document.querySelector('#download-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'download-notification-styles';
      style.textContent = `
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(100px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOutDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(100px); }
        }
      `;
      document.head.appendChild(style);
    }

    // Analytics tracking (if you have analytics)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'download', {
        'event_category': 'Resume',
        'event_label': 'Resume Download'
      });
    }

    // TODO: Replace with actual resume file path
    // For now, we'll create a dummy download
    // In production, replace this with: window.open('path/to/your/resume.pdf', '_blank');
    
    console.log('Resume download initiated. Add your actual resume PDF file.');
    // Uncomment and update when you have the resume PDF:
    window.open('resume.pdf', '_blank');
  });
})();

/* ============================================================
   LAZY LOADING IMAGES
============================================================ */
(function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img.lazy-load[data-src]');
  if (!lazyImages.length) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        
        if (src) {
          img.src = src;
          img.addEventListener('load', () => {
            img.classList.add('loaded');
            img.removeAttribute('data-src');
          });
        }
        
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  lazyImages.forEach(img => imageObserver.observe(img));
})();

/* ============================================================
   MOBILE PULL-TO-REFRESH
============================================================ */
(function initPullToRefresh() {
  // Only enable on touch devices
  if (!('ontouchstart' in window)) return;

  const pullToRefresh = document.getElementById('pull-to-refresh');
  if (!pullToRefresh) return;

  let startY = 0;
  let currentY = 0;
  let pulling = false;
  const threshold = 80;

  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].pageY;
      pulling = true;
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!pulling) return;

    currentY = e.touches[0].pageY;
    const pullDistance = currentY - startY;

    if (pullDistance > 0 && window.scrollY === 0) {
      if (pullDistance > threshold) {
        pullToRefresh.classList.add('active');
      } else {
        pullToRefresh.classList.remove('active');
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!pulling) return;

    const pullDistance = currentY - startY;

    if (pullDistance > threshold && window.scrollY === 0) {
      // Trigger refresh
      pullToRefresh.querySelector('.ptr-text').textContent = 'Refreshing...';
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }

    pullToRefresh.classList.remove('active');
    pulling = false;
    startY = 0;
    currentY = 0;
  });
})();

/* ============================================================
   MOBILE SWIPE NAVIGATION
============================================================ */
(function initSwipeNavigation() {
  // Only enable on touch devices
  if (!('ontouchstart' in window)) return;

  const sections = ['home', 'projects', 'about', 'faq', 'contact'];
  let currentSection = 0;
  let startX = 0;
  let startY = 0;
  const threshold = 50;

  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].pageX;
    const endY = e.changedTouches[0].pageY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentSection > 0) {
        // Swipe right - go to previous section
        currentSection--;
        navigateToSection(sections[currentSection]);
      } else if (deltaX < 0 && currentSection < sections.length - 1) {
        // Swipe left - go to next section
        currentSection++;
        navigateToSection(sections[currentSection]);
      }
    }
  });

  function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Update current section based on scroll position
  window.addEventListener('scroll', () => {
    sections.forEach((sectionId, index) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = index;
        }
      }
    });
  }, { passive: true });
})();

/* ============================================================
   ENHANCED NAVIGATION WITH FAQ
============================================================ */
(function enhancedNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function updateActiveNav() {
    let current = 'home';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
})();

/* ============================================================
   PERFORMANCE MONITORING
============================================================ */
(function initPerformanceMonitoring() {
  window.addEventListener('load', () => {
    // Get performance data
    const perfData = performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    console.log('%c🚀 Performance Metrics', 'color: #1de9b6; font-size: 16px; font-weight: bold;');
    console.log(`Page Load Time: ${(loadTime / 1000).toFixed(2)}s`);
    console.log(`DOM Content Loaded: ${((perfData.domContentLoadedEventEnd - perfData.navigationStart) / 1000).toFixed(2)}s`);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        'name': 'page_load',
        'value': loadTime,
        'event_category': 'Performance'
      });
    }
  });
})();

/* ============================================================
   SERVICE WORKER REGISTRATION (PWA)
============================================================ */
(function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registered:', registration);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
})();

/* ============================================================
   ACCESSIBILITY ENHANCEMENTS
============================================================ */
(function initAccessibility() {
  // Add skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#home';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to content';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: #000;
    padding: 8px 16px;
    text-decoration: none;
    font-weight: 700;
    z-index: 100000;
    transition: top 0.3s;
  `;
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Announce page navigation to screen readers
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(announcer);

  // Update announcer on navigation
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        setTimeout(() => {
          announcer.textContent = `Navigated to ${target.querySelector('h2')?.textContent || 'section'}`;
        }, 100);
      }
    });
  });
})();

/* ============================================================
   CONSOLE EASTER EGG
============================================================ */
(function initConsoleEasterEgg() {
  const styles = [
    'color: #1de9b6',
    'font-size: 20px',
    'font-weight: bold',
    'text-shadow: 0 0 10px rgba(29, 233, 182, 0.5)'
  ].join(';');

  console.log('%c👋 Hello, fellow developer!', styles);
  console.log('%c💡 Like what you see? Let\'s work together!', 'color: #2dd4ff; font-size: 14px;');
  console.log('%c📧 mohammedayaan80022132@gmail.com', 'color: #8aa4b2; font-size: 12px;');
  console.log('%c🔗 https://github.com/ayaan2312', 'color: #8aa4b2; font-size: 12px;');
})();

console.log('%c🚀 Portfolio Enhanced with Advanced Features!', 'color: #1de9b6; font-size: 14px; font-weight: bold;');