/* Sakura Requiem — procedural audio (WebAudio, no files) */
window.SR = window.SR || {};

(function () {
  let ctx = null;
  let master, musicGain, sfxGain, noiseBuf;
  let timer = null;
  let state = { mode: null, step: 0, next: 0, tempo: 0.5, scale: [], root: 0 };
  let musicVolume = 0.55;
  let sfxVolume = 0.7;
  let enabled = true;

  const SCALES = {
    menu:   { notes: [0, 3, 5, 7, 10], root: 293.66, step: 0.46, pad: [146.83, 220.0], density: 0.55 },
    map:    { notes: [0, 2, 5, 7, 9], root: 261.63, step: 0.52, pad: [130.81, 196.0], density: 0.45 },
    battle: { notes: [0, 3, 5, 7, 10], root: 220.0, step: 0.28, pad: [110.0, 164.81], density: 0.8 },
    boss:   { notes: [0, 1, 5, 6, 10], root: 174.61, step: 0.24, pad: [87.31, 130.81], density: 0.9 },
    sad:    { notes: [0, 2, 3, 7, 8], root: 246.94, step: 0.6, pad: [123.47, 185.0], density: 0.3 }
  };

  function ensure() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = musicVolume * 0.42;
      musicGain.connect(master);
      sfxGain = ctx.createGain();
      sfxGain.gain.value = sfxVolume * 0.6;
      sfxGain.connect(master);
      const len = ctx.sampleRate * 0.8;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      return true;
    } catch (e) {
      ctx = null;
      return false;
    }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  function pluck(freq, time, dur, gain, type) {
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(Math.min(freq * 6, 6000), time);
    f.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 200), time + dur);
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(f); f.connect(g); g.connect(musicGain);
    o.start(time); o.stop(time + dur + 0.05);
  }

  function pad(freq, time, dur, gain) {
    if (!ctx) return;
    const o = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 700;
    o.type = 'sawtooth'; o2.type = 'sine';
    o.frequency.value = freq; o2.frequency.value = freq * 1.005;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(gain, time + dur * 0.35);
    g.gain.linearRampToValueAtTime(0.0001, time + dur);
    o.connect(f); o2.connect(f); f.connect(g); g.connect(musicGain);
    o.start(time); o2.start(time); o.stop(time + dur + 0.1); o2.stop(time + dur + 0.1);
  }

  function drum(time, gain, pitch) {
    if (!ctx || !noiseBuf) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = pitch || 180;
    f.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    src.connect(f); f.connect(g); g.connect(musicGain);
    src.start(time); src.stop(time + 0.2);
  }

  function scheduleStep(s) {
    const cfg = SCALES[state.mode] || SCALES.menu;
    const t = state.next;
    const stepDur = cfg.step;
    const note = cfg.notes[s % cfg.notes.length];
    const octave = s % 8 < 4 ? 1 : 2;
    const freq = cfg.root * Math.pow(2, note / 12) * (octave === 2 ? 2 : 1);
    const intensity = state.mode === 'battle' || state.mode === 'boss';
    if (s % 4 === 0) {
      pad(cfg.pad[0], t, stepDur * 8, 0.05);
      pad(cfg.pad[1], t, stepDur * 8, 0.028);
    }
    if (Math.random() < cfg.density) pluck(freq, t, stepDur * 2.6, intensity ? 0.12 : 0.1, s % 5 === 0 ? 'sine' : 'triangle');
    if (s % 2 === 1 && Math.random() < cfg.density * 0.6) {
      pluck(freq * 2, t + stepDur * 0.5, stepDur * 1.4, 0.045, 'sine');
    }
    if (intensity) {
      if (s % 4 === 0) drum(t, 0.16, 120);
      if (s % 4 === 2) drum(t, 0.09, 420);
      if (state.mode === 'boss' && s % 8 === 6) drum(t, 0.12, 90);
    }
    state.next += stepDur;
  }

  function tick() {
    if (!ctx || !state.mode) return;
    while (state.next < ctx.currentTime + 0.5) scheduleStep(state.step++);
  }

  const Audio = {
    unlock() {
      if (!ensure()) return;
      resume();
    },
    setVolumes(music, sfx) {
      if (typeof music === 'number') musicVolume = Math.max(0, Math.min(1, music));
      if (typeof sfx === 'number') sfxVolume = Math.max(0, Math.min(1, sfx));
      if (musicGain) musicGain.gain.value = musicVolume * 0.42;
      if (sfxGain) sfxGain.gain.value = sfxVolume * 0.6;
    },
    setEnabled(on) { enabled = !!on; },
    playMusic(mode) {
      if (!ensure()) return;
      resume();
      if (state.mode === mode) return;
      state.mode = mode;
      state.step = 0;
      state.next = ctx.currentTime + 0.1;
      if (timer) clearInterval(timer);
      timer = setInterval(tick, 120);
      tick();
    },
    stopMusic() {
      state.mode = null;
      if (timer) { clearInterval(timer); timer = null; }
    },
    sfx(name) {
      if (!enabled || !ensure()) return;
      resume();
      const t = ctx.currentTime + 0.001;
      const beep = (f, d, type, vol, slide) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(f, t);
        if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); g.connect(sfxGain);
        o.start(t); o.stop(t + d + 0.03);
      };
      const noise = (d, vol, freq, type) => {
        if (!noiseBuf) return;
        const src = ctx.createBufferSource();
        src.buffer = noiseBuf;
        const f = ctx.createBiquadFilter();
        f.type = type || 'bandpass';
        f.frequency.value = freq;
        f.Q.value = 0.7;
        const g = ctx.createGain();
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        src.connect(f); f.connect(g); g.connect(sfxGain);
        src.start(t); src.stop(t + d);
      };
      switch (name) {
        case 'select': beep(660, 0.08, 'sine', 0.18, 880); break;
        case 'back': beep(440, 0.09, 'sine', 0.14, 330); break;
        case 'hit': noise(0.12, 0.3, 900, 'lowpass'); beep(120, 0.12, 'square', 0.12, 70); break;
        case 'crit': noise(0.2, 0.42, 1400, 'highpass'); beep(180, 0.2, 'square', 0.18, 60); break;
        case 'heal': beep(523, 0.25, 'sine', 0.16, 784); beep(659, 0.3, 'sine', 0.1, 988); break;
        case 'guard': beep(180, 0.16, 'triangle', 0.2, 120); noise(0.12, 0.16, 600, 'lowpass'); break;
        case 'ult': beep(110, 0.5, 'sawtooth', 0.14, 440); beep(220, 0.6, 'sine', 0.12, 880); noise(0.5, 0.2, 2200, 'highpass'); break;
        case 'victory': [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.35, 'triangle', 0.14), i * 110)); break;
        case 'defeat': [392, 349, 293, 220].forEach((f, i) => setTimeout(() => beep(f, 0.45, 'sine', 0.14), i * 160)); break;
        case 'levelup': [659, 784, 988, 1318].forEach((f, i) => setTimeout(() => beep(f, 0.4, 'sine', 0.13), i * 90)); break;
        case 'buy': beep(880, 0.1, 'triangle', 0.16); setTimeout(() => beep(1174, 0.16, 'triangle', 0.13), 90); break;
        case 'error': beep(180, 0.18, 'square', 0.12, 120); break;
        case 'petal': beep(1200, 0.06, 'sine', 0.05, 1600); break;
        case 'death': noise(0.4, 0.2, 300, 'lowpass'); beep(220, 0.5, 'sine', 0.1, 55); break;
        default: beep(600, 0.07, 'sine', 0.1); break;
      }
    }
  };

  SR.Audio = Audio;
})();
