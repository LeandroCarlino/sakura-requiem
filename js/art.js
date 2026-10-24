/* Sakura Requiem — original SVG art (no external assets) */
window.SR = window.SR || {};

(function () {
  let uid = 0;
  const nid = (p) => p + '-' + (++uid);

  function eye(x, y, iris, light, opts) {
    opts = opts || {};
    const flip = opts.flip ? -1 : 1;
    return `<g transform="translate(${x} ${y}) scale(${flip} 1)">
      <path d="M-21 -2 Q-4 -17 20 -3 Q11 12 0 13 Q-13 12 -21 -2 Z" fill="#fffaf7" stroke="#3b2433" stroke-width="2.6" stroke-linejoin="round"/>
      <ellipse cx="1" cy="2" rx="8.6" ry="11.4" fill="${iris}"/>
      <ellipse cx="1" cy="-4" rx="8.6" ry="6" fill="${light}" opacity=".65"/>
      <ellipse cx="1" cy="3" rx="4.2" ry="6.2" fill="#20111f"/>
      <circle cx="-3" cy="-4" r="3.2" fill="#fff"/>
      <circle cx="5" cy="6" r="1.7" fill="#fff" opacity=".75"/>
      <path d="M-22 -3 Q-2 -19 21 -3" fill="none" stroke="#2b1728" stroke-width="4.2" stroke-linecap="round"/>
      <path d="M-22 -3 l-5 -6" fill="none" stroke="#2b1728" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M21 -3 l5 -5" fill="none" stroke="#2b1728" stroke-width="3.6" stroke-linecap="round"/>
    </g>`;
  }

  function brow(x, y, color, flip) {
    const d = flip
      ? `M${x + 20} ${y} Q${x} ${y - 8} ${x - 18} ${y + 1}`
      : `M${x - 20} ${y} Q${x} ${y - 8} ${x + 18} ${y + 1}`;
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity=".85"/>`;
  }

  function faceBase(u) {
    return `
      <path d="M138 232 L136 278 Q160 294 184 278 L182 232 Z" fill="#f0b9a5"/>
      <path d="M138 232 L136 278 Q148 286 160 288 L160 232 Z" fill="#e2a48f" opacity=".55"/>
      <path d="M160 78 C118 78 92 108 90 150 C88 196 112 236 160 250 C208 236 232 196 230 150 C228 108 202 78 160 78 Z" fill="url(#skin-${u})"/>
      <ellipse cx="88" cy="172" rx="10" ry="15" fill="#f3c0ac"/>
      <ellipse cx="232" cy="172" rx="10" ry="15" fill="#f3c0ac"/>
      <path d="M92 148 C94 192 114 228 158 246" fill="none" stroke="#e7a891" stroke-width="5" opacity=".35"/>
      <ellipse cx="108" cy="208" rx="16" ry="7" fill="#ff9aa8" opacity=".32"/>
      <ellipse cx="212" cy="208" rx="16" ry="7" fill="#ff9aa8" opacity=".32"/>
      <path d="M157 198 q4 6 0 9" fill="none" stroke="#d9927e" stroke-width="3" stroke-linecap="round"/>
      <path d="M150 220 q10 7 20 0" fill="none" stroke="#a8505c" stroke-width="3.4" stroke-linecap="round"/>`;
  }

  function frameDefs(u, hero) {
    return `<defs>
      <linearGradient id="skin-${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffe9dc"/><stop offset=".6" stop-color="#ffd8c6"/><stop offset="1" stop-color="#f4bda8"/>
      </linearGradient>
      <linearGradient id="hair-${u}" x1="0" y1="0" x2=".3" y2="1">
        <stop offset="0" stop-color="${hero.hair[0]}"/><stop offset=".55" stop-color="${hero.hair[1]}"/><stop offset="1" stop-color="${hero.hair[2]}"/>
      </linearGradient>
      <linearGradient id="cloth-${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${hero.cloth[0]}"/><stop offset="1" stop-color="${hero.cloth[1]}"/>
      </linearGradient>
      <radialGradient id="bg-${u}" cx=".5" cy=".38" r=".72">
        <stop offset="0" stop-color="${hero.color}" stop-opacity=".5"/>
        <stop offset=".62" stop-color="${hero.color}" stop-opacity=".13"/>
        <stop offset="1" stop-color="#0a0714" stop-opacity="0"/>
      </radialGradient>
    </defs>`;
  }

  const HEROES = {
    hana: {
      hair: ['#5a2036', '#3a1226', '#210a17'],
      cloth: ['#2a1b30', '#160d1e'],
      color: '#ff7a8a'
    },
    yuki: {
      hair: ['#f4fbff', '#cfe6f6', '#9dbfd8'],
      cloth: ['#f3f7ff', '#d6e4f2'],
      color: '#8fd4ff'
    },
    ren: {
      hair: ['#3b2a55', '#241834', '#140c20'],
      cloth: ['#1d2532', '#0e131d'],
      color: '#c39bff'
    }
  };

  function hanaPortrait(u) {
    return `
      <g>
        <path d="M160 40 C96 40 64 90 68 152 C71 202 54 252 48 330 C44 370 58 394 78 402 L242 402 C262 394 276 370 272 330 C266 252 249 202 252 152 C256 90 224 40 160 40 Z" fill="url(#hair-${u})"/>
        <path d="M60 300 C50 336 54 372 70 396 L96 396 C80 360 76 328 82 292 Z" fill="#1c0814" opacity=".5"/>
        <path d="M260 300 C270 336 266 372 250 396 L224 396 C240 360 244 328 238 292 Z" fill="#1c0814" opacity=".5"/>
        <path d="M46 402 C52 328 94 290 160 290 C226 290 268 328 274 402 Z" fill="url(#cloth-${u})"/>
        <path d="M122 292 L160 348 L198 292 L216 300 L178 402 L142 402 L104 300 Z" fill="#401a2c"/>
        <path d="M130 294 L160 342 L190 294" fill="none" stroke="#f0c987" stroke-width="4"/>
        <path d="M146 314 L124 402 M174 314 L196 402" stroke="#d9a85c" stroke-width="2.4" opacity=".55"/>
        <path d="M96 338 q18 12 34 14 M224 338 q-18 12 -34 14" stroke="#f0c987" stroke-width="2.6" fill="none" opacity=".5"/>
        ${faceBase(u)}
        ${eye(126, 178, '#ff9d3c', '#ffd58a')}
        ${eye(194, 178, '#ff9d3c', '#ffd58a', { flip: true })}
        ${brow(124, 156, '#4a2033')}
        ${brow(196, 156, '#4a2033', true)}
        <path d="M84 132 C86 84 118 54 160 54 C204 54 236 86 238 134 C224 122 214 108 206 92 C202 120 190 142 172 154 C176 128 168 106 158 94 C150 120 134 142 116 152 C110 134 98 126 84 132 Z" fill="url(#hair-${u})"/>
        <path d="M86 136 C76 198 78 258 92 308 C102 270 98 214 106 172 Z" fill="url(#hair-${u})"/>
        <path d="M234 136 C244 198 242 258 228 308 C218 270 222 214 214 172 Z" fill="url(#hair-${u})"/>
        <path d="M104 96 C122 72 148 62 172 64" fill="none" stroke="#ff9fb2" stroke-width="3" opacity=".35" stroke-linecap="round"/>
        <g transform="translate(226 108)">
          <g fill="#ffc3d4" stroke="#ff8fae" stroke-width="1.5">
            <ellipse cx="0" cy="-11" rx="7" ry="10"/>
            <ellipse cx="10" cy="-4" rx="7" ry="10" transform="rotate(72 10 -4)"/>
            <ellipse cx="7" cy="9" rx="7" ry="10" transform="rotate(144 7 9)"/>
            <ellipse cx="-7" cy="9" rx="7" ry="10" transform="rotate(216 -7 9)"/>
            <ellipse cx="-10" cy="-4" rx="7" ry="10" transform="rotate(288 -10 -4)"/>
          </g>
          <circle cx="0" cy="0" r="4" fill="#ffe8a3"/>
        </g>
        <path d="M212 122 q14 10 22 26" fill="none" stroke="#ff8fae" stroke-width="2" opacity=".7"/>
      </g>`;
  }

  function yukiPortrait(u) {
    return `
      <g>
        <path d="M160 42 C100 42 70 90 74 152 L70 332 C72 364 88 386 110 394 L210 394 C232 386 248 364 250 332 L246 152 C250 90 220 42 160 42 Z" fill="url(#hair-${u})"/>
        <path d="M76 310 C74 344 84 372 102 386 L120 386 C102 360 96 334 98 304 Z" fill="#a9c8e0" opacity=".55"/>
        <path d="M244 310 C246 344 236 372 218 386 L200 386 C218 360 224 334 222 304 Z" fill="#a9c8e0" opacity=".55"/>
        <path d="M46 402 C52 330 94 292 160 292 C226 292 268 330 274 402 Z" fill="url(#cloth-${u})"/>
        <path d="M122 292 L160 352 L198 292 L214 300 L180 402 L140 402 L106 300 Z" fill="#f8fbff"/>
        <path d="M130 294 L160 346 L190 294" fill="none" stroke="#d94a63" stroke-width="5"/>
        <path d="M96 344 q26 16 48 18 M224 344 q-26 16 -48 18" stroke="#d94a63" stroke-width="3" fill="none" opacity=".65"/>
        <path d="M104 368 L216 368 L216 402 L104 402 Z" fill="#c93a55"/>
        <path d="M140 368 L140 402 M180 368 L180 402" stroke="#8f2338" stroke-width="2" opacity=".6"/>
        ${faceBase(u)}
        ${eye(126, 178, '#4f9dff', '#b9e0ff')}
        ${eye(194, 178, '#4f9dff', '#b9e0ff', { flip: true })}
        ${brow(124, 156, '#7f9bb2')}
        ${brow(196, 156, '#7f9bb2', true)}
        <path d="M82 138 C84 86 116 54 160 54 C204 54 236 86 238 138 L238 152 L82 152 Z" fill="url(#hair-${u})"/>
        <path d="M82 152 L96 140 L104 154 L118 140 L126 154 L140 140 L150 154 L160 140 L170 154 L180 140 L190 154 L204 140 L212 154 L224 140 L238 152 L238 158 L82 158 Z" fill="url(#hair-${u})"/>
        <path d="M80 140 C72 200 74 262 88 312 C98 272 94 214 100 168 Z" fill="url(#hair-${u})"/>
        <path d="M240 140 C248 200 246 262 232 312 C222 272 226 214 220 168 Z" fill="url(#hair-${u})"/>
        <path d="M104 96 C124 74 148 64 170 64" fill="none" stroke="#ffffff" stroke-width="3" opacity=".6" stroke-linecap="round"/>
        <g transform="translate(222 106)" stroke="#8fd4ff" stroke-width="2.6" stroke-linecap="round">
          <path d="M0 -13 V13 M-11 -6 L11 6 M-11 6 L11 -6"/>
          <circle cx="0" cy="0" r="3.4" fill="#e6f7ff" stroke="none"/>
        </g>
        <path d="M136 232 q10 4 22 2" fill="none" stroke="#e7a891" stroke-width="2" opacity=".5"/>
      </g>`;
  }

  function renPortrait(u) {
    return `
      <g>
        <path d="M160 40 C104 40 76 86 80 148 C82 190 92 218 100 248 L220 248 C228 218 238 190 240 148 C244 86 216 40 160 40 Z" fill="url(#hair-${u})"/>
        <path d="M46 402 C52 332 94 294 160 294 C226 294 268 332 274 402 Z" fill="url(#cloth-${u})"/>
        <path d="M118 294 L160 350 L202 294 L216 302 L184 402 L136 402 L104 302 Z" fill="#141a26"/>
        <path d="M120 300 L160 346 L200 300" fill="none" stroke="#57b6bd" stroke-width="3" opacity=".7"/>
        <path d="M118 286 C130 306 190 306 202 286 C214 300 208 330 160 336 C112 330 106 300 118 286 Z" fill="#2f7a82"/>
        <path d="M118 300 C134 316 186 316 202 300" fill="none" stroke="#67c8cf" stroke-width="2.4" opacity=".7"/>
        <path d="M108 342 L212 342" stroke="#2a3446" stroke-width="8" opacity=".8"/>
        ${faceBase(u)}
        ${eye(126, 178, '#a97bff', '#e0ccff')}
        ${eye(194, 178, '#a97bff', '#e0ccff', { flip: true })}
        ${brow(124, 156, '#3a2a4d')}
        ${brow(196, 156, '#3a2a4d', true)}
        <path d="M82 134 C88 84 118 54 160 54 C204 54 236 88 240 138 C226 124 214 110 206 92 C202 122 190 146 172 160 C174 134 166 112 156 100 C152 130 136 152 116 164 C110 146 96 132 82 134 Z" fill="url(#hair-${u})"/>
        <path d="M140 92 C132 130 136 164 146 192 C154 158 152 122 160 98 Z" fill="url(#hair-${u})"/>
        <path d="M84 138 C78 182 82 214 92 240 C100 212 96 178 100 154 Z" fill="url(#hair-${u})"/>
        <path d="M236 138 C242 182 238 214 228 240 C220 212 224 178 220 154 Z" fill="url(#hair-${u})"/>
        <path d="M112 94 C130 72 152 62 174 62" fill="none" stroke="#8f6cc4" stroke-width="2.6" opacity=".45" stroke-linecap="round"/>
        <path d="M146 224 q12 4 22 -2" fill="none" stroke="#a8505c" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M196 226 q6 2 9 -3" fill="none" stroke="#a8505c" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M90 168 q10 22 6 40" fill="none" stroke="#57b6bd" stroke-width="2" opacity=".5"/>
      </g>`;
  }

  const PORTRAITS = { hana: hanaPortrait, yuki: yukiPortrait, ren: renPortrait };

  SR.Art = {};

  SR.Art.hero = function (id, opts) {
    opts = opts || {};
    const hero = HEROES[id];
    if (!hero) return '';
    const u = nid('h' + id);
    const moonlight = opts.moonlight;
    const bg = moonlight ? '#8fb8ff' : hero.color;
    const tint = moonlight
      ? `<rect width="320" height="400" fill="#7fb0ff" opacity=".18"/><rect width="320" height="400" fill="url(#moon-${u})"/>`
      : '';
    return `<svg class="portrait-svg" viewBox="0 0 320 400" role="img" aria-label="${id}">
      ${frameDefs(u, Object.assign({}, hero, { color: bg }))}
      ${moonlight ? `<defs><radialGradient id="moon-${u}" cx=".3" cy=".15" r=".8"><stop offset="0" stop-color="#eaf4ff" stop-opacity=".55"/><stop offset="1" stop-color="#8fb8ff" stop-opacity="0"/></radialGradient></defs>` : ''}
      <rect width="320" height="400" fill="url(#bg-${u})"/>
      <circle cx="160" cy="160" r="118" fill="none" stroke="${bg}" stroke-opacity=".22" stroke-width="1.5" stroke-dasharray="2 8"/>
      <circle cx="160" cy="168" r="104" fill="${bg}" opacity=".07"/>
      ${PORTRAITS[id](u)}
      ${tint}
    </svg>`;
  };

  /* ---------------- Enemies ---------------- */
  const ENEMY_COLORS = {
    wisp: '#ffb066', wrapper: '#cfe8d5', onibi: '#ff9a4d', kitsune: '#d8b4ff',
    monk: '#8fc8e8', sentinel: '#c3c9d8', courtier: '#b28cff', mirror: '#b9e6ff',
    drummer: '#e8cfa8', spider: '#a9d8b8', blightbloom: '#d38cff', lanternEater: '#ff8a5c',
    abbot: '#7fb6d9', shogun: '#a9b6c9', empress: '#d3c2ff', conductor: '#c0a0ff'
  };

  function enemyGlow(u, color, boss) {
    return `<defs>
      <radialGradient id="eg-${u}" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="${color}" stop-opacity=".55"/>
        <stop offset=".6" stop-color="${color}" stop-opacity=".16"/>
        <stop offset="1" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="eb-${u}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#1b1026"/>
      </linearGradient>
    </defs>
    <circle cx="160" cy="160" r="${boss ? 150 : 128}" fill="url(#eg-${u})"/>
    <circle cx="160" cy="160" r="${boss ? 118 : 96}" fill="none" stroke="${color}" stroke-opacity=".35" stroke-width="${boss ? 2.5 : 1.6}" stroke-dasharray="2 9"/>
    ${boss ? `<circle cx="160" cy="160" r="134" fill="none" stroke="${color}" stroke-opacity=".18" stroke-width="1"/>` : ''}`;
  }

  function enemyArt(id, u) {
    const color = ENEMY_COLORS[id] || '#c39bff';
    switch (id) {
      case 'wisp':
        return `<g>
          <ellipse cx="160" cy="286" rx="58" ry="10" fill="#000" opacity=".28"/>
          <path d="M108 250 C96 274 100 292 118 296 L202 296 C220 292 224 274 212 250 Z" fill="url(#eb-${u})" opacity=".8"/>
          <rect x="112" y="92" width="96" height="146" rx="46" fill="url(#eb-${u})" stroke="#3b2030" stroke-width="3"/>
          <rect x="124" y="82" width="72" height="14" rx="7" fill="#3b2030"/>
          <rect x="124" y="232" width="72" height="12" rx="6" fill="#3b2030"/>
          <path d="M138 160 q10 -26 22 0 q10 26 22 0" fill="none" stroke="#2a1424" stroke-width="6" stroke-linecap="round"/>
          <path d="M144 206 q16 14 32 0" fill="none" stroke="#2a1424" stroke-width="5" stroke-linecap="round"/>
          <path d="M160 120 q-14 -22 4 -34 q10 18 12 34" fill="#ffe9a8" opacity=".8"/>
          <path d="M112 130 q-16 -10 -18 8 M208 130 q16 -10 18 8" stroke="${color}" stroke-width="3" fill="none" opacity=".6"/>
        </g>`;
      case 'wrapper':
        return `<g transform="rotate(-4 160 160)">
          <path d="M118 70 L202 70 L214 246 L106 246 Z" fill="#f2ead6" stroke="#cbbfa4" stroke-width="2"/>
          <path d="M118 70 L160 96 L202 70" fill="#e3d8bd"/>
          <path d="M106 246 L118 226 L202 226 L214 246 Z" fill="#d9cbae"/>
          <path d="M128 132 q14 -12 24 0 M172 132 q14 -12 24 0" fill="none" stroke="#4a3a44" stroke-width="5" stroke-linecap="round"/>
          <path d="M146 180 q14 12 30 0" fill="none" stroke="#8b4a5c" stroke-width="4" stroke-linecap="round"/>
          <path d="M120 96 L120 210 M200 96 L200 210" stroke="#b9a988" stroke-width="1.4" opacity=".7"/>
          <path d="M104 118 q-24 12 -20 40 M216 118 q24 12 20 40" stroke="#e8dfc8" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M136 246 q-6 26 8 38 M184 246 q6 26 -8 38" stroke="#e8dfc8" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M132 108 q10 8 20 2 M168 108 q10 6 20 -2" stroke="#b04a5c" stroke-width="2" fill="none" opacity=".6"/>
        </g>`;
      case 'onibi':
        return `<g>
          <path d="M120 214 C92 178 106 132 136 116 C132 158 150 168 154 138 C162 92 198 76 210 108 C188 118 188 140 202 148 C232 166 232 210 204 226 C190 198 168 206 166 236 C152 254 130 246 120 214 Z" fill="#ff8a3d" opacity=".92"/>
          <path d="M136 200 C122 178 132 152 148 142 C146 166 158 174 162 156 C170 132 186 126 192 144 C180 152 182 164 190 170 C206 182 202 202 188 210 C180 194 166 200 166 218 C156 228 144 222 136 200 Z" fill="#ffe08a"/>
          <ellipse cx="154" cy="172" rx="7" ry="10" fill="#2a1424"/>
          <ellipse cx="184" cy="172" rx="7" ry="10" fill="#2a1424"/>
          <path d="M160 196 q10 8 20 0" fill="none" stroke="#7a2a1a" stroke-width="3" stroke-linecap="round"/>
          <path d="M96 250 q14 -16 28 -4 M208 250 q14 -16 28 -4" stroke="#ff8a3d" stroke-width="3" fill="none" opacity=".5"/>
          <circle cx="110" cy="120" r="4" fill="#ffcf7a" opacity=".8"/>
          <circle cx="226" cy="136" r="3" fill="#ffcf7a" opacity=".6"/>
        </g>`;
      case 'kitsune':
        return `<g>
          <path d="M104 118 L88 44 L142 88 Z" fill="#f8f2ea" stroke="#d9c9c0" stroke-width="3"/>
          <path d="M216 118 L232 44 L178 88 Z" fill="#f8f2ea" stroke="#d9c9c0" stroke-width="3"/>
          <path d="M100 112 L94 68 L124 92 Z" fill="#ffb3c8" opacity=".8"/>
          <path d="M220 112 L226 68 L196 92 Z" fill="#ffb3c8" opacity=".8"/>
          <path d="M160 82 C204 82 232 116 228 164 C224 216 196 250 160 258 C124 250 96 216 92 164 C88 116 116 82 160 82 Z" fill="#fbf6ef" stroke="#dccfc4" stroke-width="3"/>
          <path d="M96 142 q-14 20 -6 40 M224 142 q14 20 6 40" stroke="#f8f2ea" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M118 160 q16 -14 32 -2 q-14 16 -32 2 Z" fill="#2a1a2a"/>
          <path d="M170 158 q16 -12 32 2 q-18 14 -32 -2 Z" fill="#2a1a2a"/>
          <circle cx="132" cy="159" r="3" fill="#ffcf6b"/>
          <circle cx="186" cy="159" r="3" fill="#ffcf6b"/>
          <path d="M160 186 l-10 10 q10 8 20 0 Z" fill="#3a2333"/>
          <path d="M138 208 q22 16 44 0" fill="none" stroke="#3a2333" stroke-width="3.4" stroke-linecap="round"/>
          <path d="M104 168 l-24 6 M104 180 l-22 12 M216 168 l24 6 M216 180 l22 12" stroke="#b04a5c" stroke-width="3" stroke-linecap="round"/>
          <path d="M148 106 q12 10 24 0" fill="none" stroke="#d9a85c" stroke-width="4" stroke-linecap="round"/>
          <circle cx="160" cy="118" r="4" fill="#d9a85c"/>
          <path d="M84 210 q-10 24 4 40 M236 210 q10 24 -4 40" stroke="#ff8a3d" stroke-width="3" fill="none" opacity=".55"/>
        </g>`;
      case 'monk':
        return `<g>
          <path d="M160 58 C118 58 92 92 92 142 L92 250 C92 280 124 298 160 298 C196 298 228 280 228 250 L228 142 C228 92 202 58 160 58 Z" fill="#2b4b58"/>
          <path d="M160 70 C126 70 106 98 106 140 L106 246 C106 272 132 286 160 286 C188 286 214 272 214 246 L214 140 C214 98 194 70 160 70 Z" fill="#16303a"/>
          <path d="M160 96 C138 96 124 116 124 144 C124 182 140 204 160 214 C180 204 196 182 196 144 C196 116 182 96 160 96 Z" fill="#0b1c24"/>
          <ellipse cx="142" cy="146" rx="8" ry="5" fill="#8fe8ff"/>
          <ellipse cx="178" cy="146" rx="8" ry="5" fill="#8fe8ff"/>
          <path d="M148 178 q12 8 24 0" fill="none" stroke="#5fa8c0" stroke-width="3" stroke-linecap="round"/>
          <path d="M96 250 q-18 20 -14 46 M224 250 q18 20 14 46" stroke="#2b4b58" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M124 260 q36 22 72 0" fill="none" stroke="#c9a86a" stroke-width="3"/>
          <circle cx="136" cy="270" r="3.4" fill="#c9a86a"/><circle cx="152" cy="276" r="3.4" fill="#c9a86a"/>
          <circle cx="168" cy="276" r="3.4" fill="#c9a86a"/><circle cx="184" cy="270" r="3.4" fill="#c9a86a"/>
          <path d="M110 108 q-14 30 -6 58 M210 108 q14 30 6 58" stroke="#3f6b7a" stroke-width="3" fill="none" opacity=".7"/>
          <path d="M160 58 q-20 -24 0 -36 q20 12 0 36" fill="#5fa8c0" opacity=".7"/>
        </g>`;
      case 'sentinel':
        return `<g>
          <g stroke="#8a7a5a" stroke-width="4" fill="none" opacity=".8">
            <circle cx="160" cy="160" r="112" stroke-dasharray="8 10"/>
            <circle cx="160" cy="160" r="96" stroke-dasharray="4 12"/>
          </g>
          <g fill="#b9a36a" opacity=".7">
            <circle cx="160" cy="48" r="7"/><circle cx="272" cy="160" r="7"/><circle cx="160" cy="272" r="7"/><circle cx="48" cy="160" r="7"/>
          </g>
          <path d="M160 80 C196 80 220 108 220 148 L220 206 C220 240 196 262 160 262 C124 262 100 240 100 206 L100 148 C100 108 124 80 160 80 Z" fill="#d8d2c2" stroke="#8f856d" stroke-width="3"/>
          <path d="M160 96 C186 96 204 116 204 146 L204 202 C204 228 186 246 160 246 C134 246 116 228 116 202 L116 146 C116 116 134 96 160 96 Z" fill="#2a2f3a"/>
          <path d="M124 154 q16 -12 34 -2 q-16 16 -34 2 Z" fill="#ffd27a"/>
          <path d="M162 152 q16 -10 34 2 q-18 14 -34 -2 Z" fill="#ffd27a"/>
          <path d="M136 202 q24 14 48 0" fill="none" stroke="#8f856d" stroke-width="4" stroke-linecap="round"/>
          <path d="M160 96 L160 80 M148 74 L172 74" stroke="#8f856d" stroke-width="3"/>
          <g fill="#8f856d" opacity=".65">
            <rect x="108" y="222" width="18" height="6" rx="3"/><rect x="194" y="222" width="18" height="6" rx="3"/>
            <rect x="108" y="236" width="18" height="6" rx="3"/><rect x="194" y="236" width="18" height="6" rx="3"/>
          </g>
          <path d="M74 120 l18 10 -18 10 Z M246 120 l-18 10 18 10 Z" fill="#b9a36a"/>
        </g>`;
      case 'courtier':
        return `<g>
          <path d="M160 60 C200 60 224 94 222 140 C220 186 198 232 160 246 C122 232 100 186 98 140 C96 94 120 60 160 60 Z" fill="#efe6f8" stroke="#cbb8e8" stroke-width="2.5"/>
          <path d="M112 122 q22 -16 44 -2 q-22 18 -44 2 Z" fill="#1c1026"/>
          <path d="M164 120 q22 -14 44 2 q-22 16 -44 -2 Z" fill="#1c1026"/>
          <path d="M122 128 q12 26 6 54 M198 128 q-12 26 -6 54" stroke="#6a4a86" stroke-width="3" fill="none" opacity=".8"/>
          <path d="M144 196 q16 10 32 0" fill="none" stroke="#6a4a86" stroke-width="3.4" stroke-linecap="round"/>
          <path d="M160 246 L160 292" stroke="#cbb8e8" stroke-width="6"/>
          <path d="M96 292 q64 -34 128 0 q-64 42 -128 0 Z" fill="#3a2452"/>
          <path d="M96 292 q64 -34 128 0" fill="none" stroke="#8a6ab0" stroke-width="2"/>
          <g transform="translate(232 206) rotate(18)">
            <path d="M0 0 L38 -26 L38 26 Z" fill="#efe6f8" stroke="#cbb8e8" stroke-width="2"/>
            <path d="M8 0 L34 -18 M8 0 L34 0 M8 0 L34 18" stroke="#cbb8e8" stroke-width="1.4"/>
          </g>
          <path d="M82 100 q-18 20 -12 44 M238 100 q18 20 12 44" stroke="#b28cff" stroke-width="3" fill="none" opacity=".5"/>
          <circle cx="160" cy="86" r="5" fill="#b28cff"/>
        </g>`;
      case 'mirror':
        return `<g>
          <path d="M160 54 C208 54 238 92 236 150 C234 212 202 254 160 268 C118 254 86 212 84 150 C82 92 112 54 160 54 Z" fill="#cfe8f5" stroke="#e8d9a8" stroke-width="8"/>
          <path d="M160 66 C200 66 226 98 224 150 C222 202 196 238 160 252 C124 238 98 202 96 150 C94 98 120 66 160 66 Z" fill="#7fb6d9" opacity=".55"/>
          <path d="M160 66 C200 66 226 98 224 150 C222 202 196 238 160 252" fill="none" stroke="#ffffff" stroke-width="3" opacity=".7"/>
          <path d="M104 90 L132 210 M136 74 L156 236 M186 70 L170 240 M212 92 L188 214" stroke="#eaf7ff" stroke-width="2" opacity=".75"/>
          <path d="M100 150 q30 -20 56 0 q-26 26 -56 0 Z" fill="#12222e" opacity=".8"/>
          <path d="M168 150 q30 -20 56 0 q-26 26 -56 0 Z" fill="#12222e" opacity=".8"/>
          <path d="M130 206 q30 14 60 0" fill="none" stroke="#12222e" stroke-width="3" opacity=".6"/>
          <path d="M160 268 L160 300 M112 300 q48 -22 96 0 q-48 30 -96 0 Z" fill="#3a2a4a" stroke="#e8d9a8" stroke-width="3"/>
          <path d="M160 54 q-16 -30 0 -40 q16 10 0 40" fill="#e8d9a8"/>
          <circle cx="82" cy="150" r="8" fill="#e8d9a8" opacity=".8"/>
          <circle cx="238" cy="150" r="8" fill="#e8d9a8" opacity=".8"/>
        </g>`;
      case 'drummer':
        return `<g>
          <ellipse cx="160" cy="250" rx="72" ry="40" fill="#6b3f2a" stroke="#d9b06a" stroke-width="4"/>
          <ellipse cx="160" cy="238" rx="72" ry="34" fill="#e8d3a8"/>
          <ellipse cx="160" cy="238" rx="58" ry="24" fill="none" stroke="#b08a4a" stroke-width="2"/>
          <path d="M160 74 C198 74 222 104 220 148 C218 186 196 212 160 218 C124 212 102 186 100 148 C98 104 122 74 160 74 Z" fill="#efe6d0" stroke="#cbbfa4" stroke-width="2.5"/>
          <path d="M122 134 q20 -14 40 0 q-20 22 -40 0 Z" fill="#241820"/>
          <path d="M158 134 q20 -14 40 0 q-20 22 -40 0 Z" fill="#241820"/>
          <circle cx="142" cy="136" r="4" fill="#ff8a5c"/>
          <circle cx="178" cy="136" r="4" fill="#ff8a5c"/>
          <path d="M150 188 q10 8 20 0" fill="none" stroke="#7a5a4a" stroke-width="3" stroke-linecap="round"/>
          <path d="M128 164 q-4 10 0 16 M192 164 q4 10 0 16" stroke="#a88f70" stroke-width="2"/>
          <path d="M92 100 L64 62 M228 100 L256 62" stroke="#d9b06a" stroke-width="6" stroke-linecap="round"/>
          <circle cx="60" cy="58" r="8" fill="#efe6d0" stroke="#cbbfa4" stroke-width="2"/>
          <circle cx="260" cy="58" r="8" fill="#efe6d0" stroke="#cbbfa4" stroke-width="2"/>
          <path d="M100 240 q-18 16 -14 34 M220 240 q18 16 14 34" stroke="#e8d3a8" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M160 218 L160 238" stroke="#cbbfa4" stroke-width="6"/>
        </g>`;
      case 'spider':
        return `<g>
          <g stroke="#b8e8cc" stroke-width="1.6" fill="none" opacity=".4">
            <path d="M160 30 L160 290 M30 160 L290 160 M68 68 L252 252 M252 68 L68 252"/>
            <circle cx="160" cy="160" r="80"/><circle cx="160" cy="160" r="112"/>
          </g>
          <g stroke="#8ecfa8" stroke-width="6" fill="none" stroke-linecap="round">
            <path d="M136 170 q-40 -18 -62 -52 M132 186 q-48 0 -76 -8 M136 200 q-38 22 -58 52 M146 210 q-18 34 -24 60"/>
            <path d="M184 170 q40 -18 62 -52 M188 186 q48 0 76 -8 M184 200 q38 22 58 52 M174 210 q18 34 24 60"/>
          </g>
          <ellipse cx="160" cy="186" rx="42" ry="48" fill="#2b3a30" stroke="#8ecfa8" stroke-width="2.5"/>
          <ellipse cx="160" cy="140" rx="30" ry="26" fill="#22302a" stroke="#8ecfa8" stroke-width="2.5"/>
          <g fill="#ff6b8a">
            <circle cx="148" cy="134" r="5"/><circle cx="160" cy="130" r="5"/><circle cx="172" cy="134" r="5"/>
            <circle cx="142" cy="144" r="3.4"/><circle cx="178" cy="144" r="3.4"/>
          </g>
          <path d="M146 160 q14 8 28 0" fill="none" stroke="#8ecfa8" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M120 96 q-20 10 -18 30 M200 96 q20 10 18 30" stroke="#b8e8cc" stroke-width="2" fill="none" opacity=".5"/>
        </g>`;
      /* Bosses */
      case 'blightbloom':
        return `<g>
          <g fill="#7a3a9a" opacity=".8">
            <path d="M160 250 C110 232 92 190 108 150 C128 168 148 186 160 210 C172 186 192 168 212 150 C228 190 210 232 160 250 Z"/>
            <path d="M160 236 C100 222 70 180 80 132 C108 156 136 178 160 204 C184 178 212 156 240 132 C250 180 220 222 160 236 Z" fill="#5a2878" opacity=".85"/>
          </g>
          <g fill="#b76ad8">
            <path d="M160 196 C126 184 114 150 128 118 C144 140 154 162 160 182 C166 162 176 140 192 118 C206 150 194 184 160 196 Z"/>
            <path d="M160 190 C196 176 224 148 218 112 C192 132 174 158 160 180 C146 158 128 132 102 112 C96 148 124 176 160 190 Z" fill="#9a4cbe"/>
          </g>
          <ellipse cx="160" cy="148" rx="34" ry="30" fill="#2a1038" stroke="#ff8ae0" stroke-width="2"/>
          <ellipse cx="160" cy="148" rx="14" ry="18" fill="#ff8ae0"/>
          <ellipse cx="160" cy="148" rx="6" ry="12" fill="#1a0a22"/>
          <path d="M132 118 q-8 -22 6 -34 M188 118 q8 -22 -6 -34" stroke="#c98ae8" stroke-width="3" fill="none" opacity=".7"/>
          <path d="M160 250 C150 276 132 290 104 300 M160 250 C170 276 188 290 216 300" stroke="#7a3a9a" stroke-width="5" fill="none" stroke-linecap="round"/>
          <g fill="#ffb3f0" opacity=".7">
            <circle cx="92" cy="80" r="3"/><circle cx="232" cy="96" r="4"/><circle cx="216" cy="228" r="3"/><circle cx="104" cy="222" r="3"/>
          </g>
        </g>`;
      case 'lanternEater':
        return `<g>
          <path d="M112 96 L74 40 L136 72 Z" fill="#3a1a1a" stroke="#ff8a5c" stroke-width="3"/>
          <path d="M208 96 L246 40 L184 72 Z" fill="#3a1a1a" stroke="#ff8a5c" stroke-width="3"/>
          <path d="M160 62 C212 62 244 104 242 164 C240 228 206 268 160 278 C114 268 80 228 78 164 C76 104 108 62 160 62 Z" fill="url(#eb-${u})" stroke="#ffb066" stroke-width="3"/>
          <path d="M104 118 q28 -18 54 -2 q-28 24 -54 2 Z" fill="#2a0f16"/>
          <path d="M162 116 q28 -16 54 2 q-28 22 -54 -2 Z" fill="#2a0f16"/>
          <circle cx="130" cy="118" r="7" fill="#ffe08a"/>
          <circle cx="188" cy="118" r="7" fill="#ffe08a"/>
          <path d="M160 150 q-6 20 8 24" fill="none" stroke="#2a0f16" stroke-width="4" stroke-linecap="round"/>
          <path d="M120 198 q40 34 80 0 q-12 40 -40 44 q-28 -4 -40 -44 Z" fill="#2a0f16"/>
          <g fill="#ffe08a">
            <path d="M128 200 l8 16 l-14 -4 Z"/><path d="M144 204 l6 18 l-12 -6 Z"/>
            <path d="M192 200 l-8 16 l14 -4 Z"/><path d="M176 204 l-6 18 l12 -6 Z"/>
          </g>
          <path d="M94 170 q-22 12 -20 36 M226 170 q22 12 20 36" stroke="#ff8a5c" stroke-width="3" fill="none" opacity=".6"/>
          <g fill="#ffcf6b" opacity=".8">
            <circle cx="94" cy="72" r="3"/><circle cx="230" cy="84" r="2.4"/><circle cx="110" cy="252" r="2.6"/>
          </g>
        </g>`;
      case 'abbot':
        return `<g>
          <g fill="none" stroke="#8fe8ff" opacity=".55">
            <circle cx="160" cy="156" r="118" stroke-width="2"/>
            <circle cx="160" cy="156" r="104" stroke-width="1" stroke-dasharray="2 8"/>
          </g>
          <path d="M160 54 C112 54 84 90 84 142 L84 238 C84 272 116 294 160 294 C204 294 236 272 236 238 L236 142 C236 90 208 54 160 54 Z" fill="#203a4a"/>
          <path d="M160 68 C122 68 98 98 98 142 L98 234 C98 262 124 280 160 280 C196 280 222 262 222 234 L222 142 C222 98 198 68 160 68 Z" fill="#0e2029"/>
          <path d="M160 100 C136 100 122 122 122 150 C122 184 138 206 160 216 C182 206 198 184 198 150 C198 122 184 100 160 100 Z" fill="#08151c"/>
          <ellipse cx="142" cy="150" rx="9" ry="6" fill="#8fe8ff"/>
          <ellipse cx="178" cy="150" rx="9" ry="6" fill="#8fe8ff"/>
          <path d="M146 186 q14 10 28 0" fill="none" stroke="#4a8a9a" stroke-width="3" stroke-linecap="round"/>
          <path d="M84 238 q-22 22 -18 54 M236 238 q22 22 18 54" stroke="#203a4a" stroke-width="7" fill="none" stroke-linecap="round"/>
          <path d="M112 246 q48 28 96 0" fill="none" stroke="#c9a86a" stroke-width="3"/>
          <g fill="#c9a86a">
            <circle cx="124" cy="256" r="3.4"/><circle cx="140" cy="262" r="3.4"/><circle cx="160" cy="266" r="3.4"/><circle cx="180" cy="262" r="3.4"/><circle cx="196" cy="256" r="3.4"/>
          </g>
          <path d="M232 120 q30 30 30 78" stroke="#c9a86a" stroke-width="4" fill="none" opacity=".8"/>
          <circle cx="262" cy="200" r="8" fill="#8fe8ff" opacity=".7"/>
          <path d="M120 78 q40 -26 80 0" fill="none" stroke="#4a8a9a" stroke-width="2" opacity=".6"/>
        </g>`;
      case 'shogun':
        return `<g>
          <g fill="none" stroke="#b9a36a" stroke-width="2" opacity=".45">
            <circle cx="160" cy="160" r="126" stroke-dasharray="10 12"/>
            <circle cx="160" cy="160" r="112" stroke-dasharray="3 14"/>
          </g>
          <path d="M104 108 L66 54 L126 82 Z" fill="#8a2a2a" stroke="#e8c27a" stroke-width="3"/>
          <path d="M216 108 L254 54 L194 82 Z" fill="#8a2a2a" stroke="#e8c27a" stroke-width="3"/>
          <path d="M160 70 C202 70 230 104 228 158 C226 214 198 250 160 260 C122 250 94 214 92 158 C90 104 118 70 160 70 Z" fill="#3a404c" stroke="#8f9aab" stroke-width="3"/>
          <path d="M160 84 C194 84 216 112 214 156 L214 196 C214 224 192 244 160 252 C128 244 106 224 106 196 L106 156 C106 112 128 84 160 84 Z" fill="#242a34"/>
          <path d="M120 146 q20 -14 40 0 q-20 18 -40 0 Z" fill="#ffcf6b"/>
          <path d="M160 146 q20 -14 40 0 q-20 18 -40 0 Z" fill="#ffcf6b"/>
          <path d="M122 174 q38 18 76 0" fill="none" stroke="#8f9aab" stroke-width="3"/>
          <path d="M136 188 q24 22 48 0" fill="#1a1e26" stroke="#8f9aab" stroke-width="2"/>
          <path d="M142 190 l4 12 M152 192 l2 12 M168 192 l-2 12 M178 190 l-4 12" stroke="#8f9aab" stroke-width="2"/>
          <path d="M160 70 L160 54 M144 56 L176 56" stroke="#e8c27a" stroke-width="3"/>
          <path d="M90 200 q-24 8 -28 32 M230 200 q24 8 28 32" stroke="#8f9aab" stroke-width="4" fill="none" opacity=".7"/>
          <path d="M70 250 L250 120 M70 120 L250 250" stroke="#8f9aab" stroke-width="2" opacity=".18"/>
          <g fill="#b9a36a" opacity=".7">
            <circle cx="76" cy="94" r="4"/><circle cx="244" cy="94" r="4"/><circle cx="160" cy="286" r="4"/>
          </g>
        </g>`;
      case 'empress':
        return `<g>
          <g fill="#d3c2ff" opacity=".65">
            <path d="M160 34 l12 30 l30 -12 l-12 30 l30 12 l-30 12 l12 30 l-30 -12 l-12 30 l-12 -30 l-30 12 l12 -30 l-30 -12 l30 -12 l-12 -30 l30 12 Z" opacity=".22"/>
          </g>
          <path d="M160 58 C206 58 236 96 234 154 C232 214 200 250 160 262 C120 250 88 214 86 154 C84 96 114 58 160 58 Z" fill="#efe8ff" stroke="#e8d9a8" stroke-width="7"/>
          <path d="M160 72 C198 72 224 102 222 152 C220 202 194 234 160 246 C126 234 100 202 98 152 C96 102 122 72 160 72 Z" fill="#b9a8e8" opacity=".5"/>
          <path d="M104 100 L132 214 M136 80 L156 238 M188 78 L170 242 M216 100 L190 218" stroke="#fff" stroke-width="2" opacity=".7"/>
          <path d="M112 148 q26 -18 52 0 q-26 22 -52 0 Z" fill="#2a1a3a"/>
          <path d="M156 148 q26 -18 52 0 q-26 22 -52 0 Z" fill="#2a1a3a"/>
          <circle cx="136" cy="149" r="4" fill="#ffd27a"/>
          <circle cx="184" cy="149" r="4" fill="#ffd27a"/>
          <path d="M138 202 q22 12 44 0" fill="none" stroke="#6a4a86" stroke-width="3"/>
          <path d="M160 262 L160 294" stroke="#e8d9a8" stroke-width="6"/>
          <path d="M96 294 q64 -30 128 0 q-64 34 -128 0 Z" fill="#4a3068" stroke="#e8d9a8" stroke-width="2"/>
          <g fill="#c9a8ff" opacity=".8">
            <path d="M70 120 l10 -22 l10 22 Z"/><path d="M230 120 l10 -22 l10 22 Z"/>
            <circle cx="80" cy="152" r="4"/><circle cx="240" cy="152" r="4"/>
          </g>
          <path d="M118 92 q-18 24 -12 50 M202 92 q18 24 12 50" stroke="#d3c2ff" stroke-width="2" fill="none" opacity=".5"/>
        </g>`;
      case 'conductor':
        return `<g>
          <g fill="none" stroke="#c0a0ff" stroke-width="1.2" opacity=".4">
            <path d="M36 220 q124 -80 248 0" />
            <path d="M36 238 q124 -80 248 0" />
            <path d="M36 256 q124 -80 248 0" />
            <path d="M36 274 q124 -80 248 0" />
          </g>
          <path d="M160 52 C206 52 232 88 230 142 C228 200 198 244 160 258 C122 244 92 200 90 142 C88 88 114 52 160 52 Z" fill="#f2ecff" stroke="#cbb8e8" stroke-width="2.5"/>
          <path d="M118 116 q24 -18 46 -2 q-24 20 -46 2 Z" fill="#120a1c"/>
          <path d="M156 114 q24 -16 46 2 q-24 18 -46 -2 Z" fill="#120a1c"/>
          <path d="M128 130 q10 34 4 62 M192 130 q-10 34 -4 62" stroke="#5a4a72" stroke-width="3" fill="none" opacity=".7"/>
          <path d="M146 202 q14 8 28 0" fill="none" stroke="#5a4a72" stroke-width="3"/>
          <path d="M160 52 q-24 -34 0 -46 q24 12 0 46" fill="#c0a0ff" opacity=".8"/>
          <path d="M160 258 C120 268 96 292 88 320 L232 320 C224 292 200 268 160 258 Z" fill="#140c20"/>
          <path d="M160 258 L160 320" stroke="#c0a0ff" stroke-width="2" opacity=".4"/>
          <path d="M220 220 L292 120" stroke="#e8d9a8" stroke-width="3" stroke-linecap="round"/>
          <path d="M286 128 l14 -18" stroke="#f2ecff" stroke-width="5" stroke-linecap="round"/>
          <g fill="#8a6ab0" opacity=".8">
            <path d="M70 96 q18 -22 36 -4 q-18 20 -36 4 Z"/>
            <path d="M228 74 q18 -20 34 0 q-18 18 -34 0 Z"/>
            <path d="M84 264 q18 -20 34 0 q-18 18 -34 0 Z"/>
          </g>
          <path d="M160 280 q-40 16 -52 40 M160 280 q40 16 52 40" stroke="#8a6ab0" stroke-width="2" fill="none" opacity=".5"/>
        </g>`;
      default:
        return `<circle cx="160" cy="160" r="80" fill="url(#eb-${u})"/>`;
    }
  }

  SR.Art.enemy = function (id) {
    const u = nid('e' + id);
    const color = ENEMY_COLORS[id] || '#c39bff';
    const boss = !!(SR.DATA.enemies[id] && SR.DATA.enemies[id].boss);
    return `<svg class="enemy-svg" viewBox="0 0 320 320" role="img" aria-label="${id}">
      ${enemyGlow(u, color, boss)}
      ${enemyArt(id, u)}
    </svg>`;
  };

  /* ---------------- Scenery ---------------- */
  const SCENES = {
    shrine: (u, hue) => `
      <defs>
        <linearGradient id="sky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 45% 12%)"/>
          <stop offset=".55" stop-color="hsl(${hue} 55% 22%)"/>
          <stop offset="1" stop-color="hsl(${hue + 20} 40% 9%)"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky-${u})"/>
      <circle cx="880" cy="170" r="110" fill="hsl(${hue} 90% 88%)" opacity=".16"/>
      <circle cx="880" cy="170" r="76" fill="hsl(${hue} 95% 92%)" opacity=".22"/>
      <path d="M0 520 Q220 400 430 510 T900 500 T1200 470 V800 H0 Z" fill="hsl(${hue} 35% 10%)" opacity=".85"/>
      <path d="M0 600 Q300 500 600 590 T1200 560 V800 H0 Z" fill="hsl(${hue} 30% 6%)"/>
      <g fill="#1a0f18" opacity=".9">
        <rect x="196" y="330" width="26" height="330"/>
        <rect x="378" y="330" width="26" height="330"/>
        <rect x="160" y="316" width="280" height="22" rx="4"/>
        <rect x="186" y="360" width="228" height="14" rx="3"/>
        <path d="M150 300 Q300 260 450 300 L450 316 L150 316 Z"/>
      </g>
      <g stroke="#2a1826" stroke-width="6" opacity=".7">
        <path d="M120 660 q80 -30 160 0" fill="none"/>
      </g>
      <g fill="hsl(${hue} 80% 82%)" opacity=".35">
        <circle cx="160" cy="180" r="3"/><circle cx="300" cy="120" r="2"/><circle cx="520" cy="220" r="4"/>
        <circle cx="700" cy="140" r="2.4"/><circle cx="1040" cy="240" r="3"/><circle cx="980" cy="420" r="2"/>
      </g>`,
    market: (u, hue) => `
      <defs>
        <linearGradient id="sky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 40% 8%)"/>
          <stop offset=".6" stop-color="hsl(${hue} 50% 17%)"/>
          <stop offset="1" stop-color="#150c12"/>
        </linearGradient>
        <radialGradient id="lamp-${u}"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky-${u})"/>
      <g stroke="#241620" stroke-width="3" fill="none" opacity=".8">
        <path d="M-40 120 Q300 210 640 130 T1240 150"/>
        <path d="M-40 260 Q300 340 640 270 T1240 290"/>
      </g>
      <g>
        <circle cx="140" cy="180" r="52" fill="url(#lamp-${u})"/><circle cx="140" cy="180" r="18" fill="#ffd9a0"/>
        <circle cx="360" cy="215" r="46" fill="url(#lamp-${u})"/><circle cx="360" cy="215" r="16" fill="#ffd9a0"/>
        <circle cx="620" cy="180" r="58" fill="url(#lamp-${u})"/><circle cx="620" cy="180" r="20" fill="#ffd9a0"/>
        <circle cx="880" cy="225" r="44" fill="url(#lamp-${u})"/><circle cx="880" cy="225" r="15" fill="#ffd9a0"/>
        <circle cx="1100" cy="180" r="50" fill="url(#lamp-${u})"/><circle cx="1100" cy="180" r="17" fill="#ffd9a0"/>
      </g>
      <g fill="#1a0f16" opacity=".92">
        <path d="M0 620 L120 520 L260 620 Z"/><path d="M200 640 L340 500 L500 640 Z"/>
        <path d="M440 620 L600 490 L760 620 Z"/><path d="M700 650 L860 510 L1020 650 Z"/>
        <path d="M960 620 L1120 500 L1260 620 Z"/>
        <rect x="0" y="620" width="1200" height="180"/>
      </g>
      <g fill="#2a1a22">
        <rect x="90" y="640" width="120" height="60"/><rect x="330" y="650" width="150" height="70"/>
        <rect x="620" y="640" width="130" height="60"/><rect x="900" y="650" width="140" height="70"/>
      </g>
      <g fill="#ffcf7a" opacity=".5">
        <circle cx="250" cy="150" r="3"/><circle cx="500" cy="160" r="2.4"/><circle cx="760" cy="120" r="3.4"/><circle cx="1000" cy="300" r="2.4"/>
      </g>`,
    sea: (u, hue) => `
      <defs>
        <linearGradient id="sky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 50% 8%)"/>
          <stop offset=".5" stop-color="hsl(${hue} 55% 18%)"/>
          <stop offset=".72" stop-color="hsl(${hue} 45% 26%)"/>
          <stop offset="1" stop-color="#061014"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky-${u})"/>
      <circle cx="300" cy="180" r="86" fill="#dff6ff" opacity=".22"/>
      <circle cx="300" cy="180" r="60" fill="#eaf9ff" opacity=".3"/>
      <path d="M0 560 H1200 V800 H0 Z" fill="hsl(${hue} 50% 12%)" opacity=".8"/>
      <path d="M0 560 H1200" stroke="hsl(${hue} 70% 60%)" stroke-opacity=".25" stroke-width="2"/>
      <g fill="none" stroke="hsl(${hue} 70% 65%)" stroke-opacity=".2" stroke-width="3">
        <path d="M0 610 q150 -18 300 0 t300 0 t300 0 t300 0"/>
        <path d="M0 670 q150 -18 300 0 t300 0 t300 0 t300 0"/>
        <path d="M0 730 q150 -18 300 0 t300 0 t300 0 t300 0"/>
      </g>
      <g fill="#120a16" opacity=".95">
        <rect x="500" y="280" width="34" height="360"/>
        <rect x="760" y="280" width="34" height="360"/>
        <rect x="450" y="262" width="400" height="26" rx="5"/>
        <rect x="480" y="310" width="340" height="16" rx="4"/>
        <path d="M440 244 Q630 200 820 244 L820 262 L440 262 Z"/>
      </g>
      <g fill="#dff6ff" opacity=".5">
        <circle cx="560" cy="360" r="2"/><circle cx="700" cy="420" r="3"/><circle cx="900" cy="300" r="2"/><circle cx="1040" cy="460" r="2.6"/>
      </g>`,
    clock: (u, hue) => `
      <defs>
        <linearGradient id="sky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 30% 8%)"/>
          <stop offset=".6" stop-color="hsl(${hue} 35% 18%)"/>
          <stop offset="1" stop-color="#100c12"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky-${u})"/>
      <g stroke="hsl(${hue} 60% 55%)" fill="none" opacity=".2">
        <circle cx="930" cy="210" r="150" stroke-width="10" stroke-dasharray="14 18"/>
        <circle cx="930" cy="210" r="110" stroke-width="3"/>
        <path d="M930 120 V210 L1000 250" stroke-width="6"/>
      </g>
      <g fill="#1a1410" opacity=".95">
        <path d="M420 700 L470 260 L540 220 L610 260 L660 700 Z"/>
        <path d="M400 700 L440 300 L540 260 L640 300 L680 700 Z" opacity=".6"/>
        <path d="M360 700 L390 340 L420 320 L450 700 Z" opacity=".4"/>
        <path d="M700 700 L720 360 L760 330 L800 360 L820 700 Z" opacity=".5"/>
        <rect x="300" y="700" width="620" height="100"/>
      </g>
      <g fill="hsl(${hue} 55% 65%)" opacity=".22">
        <circle cx="540" cy="430" r="34"/><circle cx="540" cy="430" r="14" fill="#100c12"/>
        <circle cx="760" cy="500" r="26"/><circle cx="760" cy="500" r="10" fill="#100c12"/>
      </g>
      <g stroke="#0e0a10" stroke-width="3" opacity=".5">
        <path d="M0 720 Q300 680 600 720 T1200 700" fill="none"/>
      </g>`,
    court: (u, hue) => `
      <defs>
        <linearGradient id="sky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 45% 8%)"/>
          <stop offset=".65" stop-color="hsl(${hue} 45% 18%)"/>
          <stop offset="1" stop-color="#0c0714"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky-${u})"/>
      <g fill="none" stroke="hsl(${hue} 60% 70%)" stroke-opacity=".22" stroke-width="3">
        <path d="M120 800 V300 Q120 180 240 180 H420 Q540 180 540 300 V800"/>
        <path d="M660 800 V300 Q660 180 780 180 H960 Q1080 180 1080 300 V800"/>
      </g>
      <g fill="hsl(${hue} 45% 10%)" opacity=".85">
        <path d="M120 800 V300 Q120 180 240 180 H420 Q540 180 540 300 V800 Z"/>
        <path d="M660 800 V300 Q660 180 780 180 H960 Q1080 180 1080 300 V800 Z"/>
      </g>
      <g fill="#d9c8ff" opacity=".18">
        <ellipse cx="330" cy="380" rx="80" ry="120"/>
        <ellipse cx="870" cy="380" rx="80" ry="120"/>
      </g>
      <g fill="none" stroke="#e8d9a8" stroke-width="4" opacity=".35">
        <ellipse cx="330" cy="380" rx="80" ry="120"/>
        <ellipse cx="870" cy="380" rx="80" ry="120"/>
      </g>
      <g stroke="#0a0610" stroke-width="2" opacity=".5">
        <path d="M0 640 H1200 M0 700 H1200 M0 760 H1200"/>
        <path d="M300 640 L150 800 M500 640 L420 800 M700 640 L780 800 M900 640 L1050 800"/>
      </g>
      <g fill="hsl(${hue} 80% 80%)" opacity=".3">
        <circle cx="180" cy="140" r="3"/><circle cx="620" cy="100" r="2"/><circle cx="1020" cy="160" r="3.4"/><circle cx="740" cy="240" r="2"/>
      </g>`,
    hollow: (u, hue) => `
      <defs>
        <linearGradient id="sky-${u}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="hsl(${hue} 55% 6%)"/>
          <stop offset=".55" stop-color="hsl(${hue} 55% 15%)"/>
          <stop offset="1" stop-color="#07040c"/>
        </linearGradient>
        <radialGradient id="vortex-${u}"><stop offset="0" stop-color="hsl(${hue} 90% 70%)" stop-opacity=".5"/><stop offset="1" stop-color="hsl(${hue} 90% 50%)" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#sky-${u})"/>
      <circle cx="600" cy="330" r="330" fill="url(#vortex-${u})"/>
      <g fill="none" stroke="hsl(${hue} 80% 78%)" stroke-opacity=".25">
        <ellipse cx="600" cy="330" rx="280" ry="120" stroke-width="2"/>
        <ellipse cx="600" cy="330" rx="230" ry="92" stroke-width="1.5"/>
        <ellipse cx="600" cy="330" rx="170" ry="64" stroke-width="1"/>
        <ellipse cx="600" cy="330" rx="110" ry="40" stroke-width="1"/>
      </g>
      <g fill="#0a0610" opacity=".9">
        <path d="M380 800 L540 560 H660 L820 800 Z"/>
        <path d="M440 800 L560 620 H640 L760 800 Z" opacity=".7"/>
      </g>
      <g fill="hsl(${hue} 85% 80%)" opacity=".35">
        <path d="M180 260 q26 -14 52 0 q-26 14 -52 0 Z"/><path d="M980 220 q26 -14 52 0 q-26 14 -52 0 Z"/>
        <path d="M300 520 q26 -14 52 0 q-26 14 -52 0 Z"/><path d="M860 560 q26 -14 52 0 q-26 14 -52 0 Z"/>
      </g>
      <g fill="none" stroke="#e8d9a8" stroke-width="1.4" opacity=".2">
        <path d="M120 640 q480 -100 960 0 M120 672 q480 -100 960 0 M120 704 q480 -100 960 0"/>
      </g>`
  };

  SR.Art.scene = function (kind) {
    const chapter = SR.DATA.chapters.find((c) => c.bg === kind);
    const hue = chapter ? chapter.hue : 330;
    const u = nid('s' + kind);
    const fn = SCENES[kind] || SCENES.shrine;
    return `<svg class="scene-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${fn(u, hue)}</svg>`;
  };

  SR.Art.logoMark = function () {
    return `<svg viewBox="0 0 120 120" class="logo-mark" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="60" cy="60" r="46" opacity=".35"/>
        <circle cx="60" cy="60" r="38" opacity=".18" stroke-dasharray="2 7"/>
      </g>
      <g fill="currentColor">
        <path d="M60 22 C72 38 72 50 60 62 C48 50 48 38 60 22 Z" opacity=".9"/>
        <path d="M98 60 C82 72 70 72 58 60 C70 48 82 48 98 60 Z" opacity=".7"/>
        <path d="M22 60 C38 48 50 48 62 60 C50 72 38 72 22 60 Z" opacity=".7"/>
        <path d="M60 98 C48 82 48 70 60 58 C72 70 72 82 60 98 Z" opacity=".9"/>
      </g>
      <circle cx="60" cy="60" r="5" fill="currentColor"/>
    </svg>`;
  };

  SR.Art.heroMini = function (id) {
    const hero = SR.DATA.heroes.find((h) => h.id === id);
    const color = hero ? hero.color : '#c39bff';
    const el = SR.DATA.elements[hero ? hero.element : 'void'];
    return `<span class="mini" style="--c:${color}"><span class="mini-glyph">${el.icon}</span></span>`;
  };
})();
