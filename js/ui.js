/* Sakura Requiem — UI helpers */
window.SR = window.SR || {};

(function () {
  const UI = {};
  SR.UI = UI;

  UI.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  UI.heroPortrait = function (heroId, opts) {
    return SR.Art.hero(heroId, opts);
  };

  UI.element = function (id) {
    const e = SR.DATA.elements[id];
    if (!e) return '';
    return `<span class="pill" style="color:${e.color};border-color:${e.color}44;background:${e.color}14">${e.icon} ${SR.t(e.name)}</span>`;
  };

  UI.elementIcon = function (id) {
    const e = SR.DATA.elements[id];
    return e ? e.icon : '✦';
  };

  UI.bar = function (value, max, type, label) {
    const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
    return `<div class="bar ${type || ''}" ${label ? `aria-label="${UI.esc(label)}"` : ''}><i style="width:${pct}%"></i></div>`;
  };

  UI.resourceChips = function (run, opts) {
    opts = opts || {};
    const parts = [];
    if (run) {
      parts.push(`<span class="res-chip"><span class="res-chip__icon">◉</span>${SR.fmt(run.gold)} <small class="muted">${SR.t('hud.gold')}</small></span>`);
      parts.push(`<span class="res-chip res-chip--essence"><span class="res-chip__icon">✦</span>${SR.fmt(run.essence)} <small class="muted">${SR.t('hud.essence')}</small></span>`);
    }
    if (opts.embers !== false) {
      parts.push(`<span class="res-chip res-chip--ember"><span class="res-chip__icon">✺</span>${SR.fmt(SR.Save.meta.embers)} <small class="muted">${SR.t('hud.embers')}</small></span>`);
    }
    return parts.join('');
  };

  UI.topbar = function (opts) {
    const back = opts.back === false ? '' : `<button class="icon-btn" data-act="back" aria-label="${UI.esc(SR.t('btn.back'))}">←</button>`;
    const res = opts.resources === false ? '' : `<div class="topbar__res">${UI.resourceChips(opts.run, opts)}</div>`;
    const actions = (opts.actions || []).map((a) =>
      `<button class="btn btn--sm ${a.primary ? 'btn--primary' : ''}" data-act="${a.act}" ${a.disabled ? 'disabled' : ''}>${a.icon ? `<span>${a.icon}</span>` : ''}${UI.esc(a.label)}</button>`
    ).join('');
    return `<header class="topbar">
      ${back}
      <div class="topbar__title">
        ${opts.eyebrow ? `<span class="eyebrow">${UI.esc(opts.eyebrow)}</span>` : ''}
        <h1 class="h2">${UI.esc(opts.title || '')}</h1>
      </div>
      ${res}
      ${actions ? `<div class="topbar__actions">${actions}</div>` : ''}
    </header>`;
  };

  UI.langSwitch = function () {
    return `<div class="lang-switch" role="group" aria-label="Language">
      <button data-lang="en" class="${SR.lang === 'en' ? 'is-on' : ''}">EN</button>
      <button data-lang="es" class="${SR.lang === 'es' ? 'is-on' : ''}">ES</button>
    </div>`;
  };

  UI.bindLang = function (root) {
    (root || document).querySelectorAll('[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang === SR.lang) return;
        SR.setLang(lang);
        SR.Audio.sfx('select');
        SR.App.refresh();
      });
    });
  };

  /* ---------- Toasts ---------- */
  UI.toast = function (message, type) {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' toast--' + type : '');
    el.textContent = message;
    root.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 320);
    }, 2600);
  };

  /* ---------- Modal ---------- */
  UI.modal = function (opts) {
    const root = document.getElementById('overlay-root');
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    const size = opts.wide ? 'modal--wide' : opts.small ? 'modal--sm' : '';
    wrap.innerHTML = `<div class="modal ${size}" role="dialog" aria-modal="true" aria-label="${UI.esc(opts.title || '')}">
      ${opts.hideHead ? '' : `<header class="modal__head">
        <h2 class="modal__title">${opts.title || ''}</h2>
        ${opts.closeable === false ? '' : `<button class="icon-btn" data-close aria-label="${UI.esc(SR.t('btn.close'))}">✕</button>`}
      </header>`}
      <div class="modal__body">${opts.body || ''}</div>
      ${opts.foot ? `<footer class="modal__foot">${opts.foot}</footer>` : ''}
    </div>`;
    root.appendChild(wrap);
    const close = () => {
      wrap.remove();
      document.removeEventListener('keydown', onKey);
      if (opts.onClose) opts.onClose();
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && opts.closeable !== false) close();
    };
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap && opts.closeable !== false) close();
      if (e.target.closest('[data-close]') && opts.closeable !== false) close();
    });
    document.addEventListener('keydown', onKey);
    wrap.close = close;
    if (opts.onMount) opts.onMount(wrap, close);
    const focusable = wrap.querySelector('button, input, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 30);
    return wrap;
  };

  UI.closeTopModal = function () {
    const all = document.querySelectorAll('#overlay-root .modal-backdrop');
    if (all.length) all[all.length - 1].remove();
  };

  UI.closeAllModals = function () {
    document.querySelectorAll('#overlay-root .modal-backdrop').forEach((m) => m.remove());
  };

  UI.confirm = function (title, message, onYes, danger) {
    return UI.modal({
      title,
      small: true,
      body: `<p class="muted" style="line-height:1.6">${message}</p>`,
      foot: `<button class="btn btn--ghost" data-close>${UI.esc(SR.t('btn.cancel'))}</button>
             <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-yes>${UI.esc(SR.t('btn.confirm'))}</button>`,
      onMount: (wrap, close) => {
        wrap.querySelector('[data-yes]').addEventListener('click', () => {
          close();
          onYes();
        });
      }
    });
  };

  /* ---------- Settings ---------- */
  UI.settingsModal = function () {
    const s = SR.Save.settings;
    const speed = s.speed || 'normal';
    const body = `
      <div class="settings-grid">
        <div class="setting-row">
          <div class="setting-row__label">${SR.t('settings.lang')}</div>
          ${UI.langSwitch()}
        </div>
        <div class="setting-row">
          <div class="setting-row__label">${SR.t('settings.music')}</div>
          <input type="range" min="0" max="100" value="${Math.round(s.music * 100)}" data-set="music" aria-label="${SR.t('settings.music')}">
        </div>
        <div class="setting-row">
          <div class="setting-row__label">${SR.t('settings.sfx')}</div>
          <input type="range" min="0" max="100" value="${Math.round(s.sfx * 100)}" data-set="sfx" aria-label="${SR.t('settings.sfx')}">
        </div>
        <div class="setting-row">
          <div class="setting-row__label">${SR.t('settings.textSpeed')}</div>
          <div class="segmented" data-speed>
            <button data-value="slow" class="${speed === 'slow' ? 'is-on' : ''}">${SR.t('settings.speedSlow')}</button>
            <button data-value="normal" class="${speed === 'normal' ? 'is-on' : ''}">${SR.t('settings.speedNormal')}</button>
            <button data-value="fast" class="${speed === 'fast' ? 'is-on' : ''}">${SR.t('settings.speedFast')}</button>
          </div>
        </div>
        <div class="setting-row">
          <div class="setting-row__label">${SR.t('settings.motion')}</div>
          <button class="switch ${s.motion ? 'is-on' : ''}" data-motion aria-label="${SR.t('settings.motion')}"></button>
        </div>
        <div class="setting-row">
          <div class="setting-row__label">${SR.t('settings.display')}</div>
          <button class="btn btn--sm" data-fullscreen>⛶ ${SR.t('btn.fullscreen')}</button>
        </div>
        <div class="setting-row" style="align-items:flex-start">
          <div class="setting-row__label">${SR.t('settings.about')}<small>${SR.t('settings.aboutText')}</small></div>
          <span class="pill">v${SR.VERSION}</span>
        </div>
        <div class="setting-row">
          <div class="setting-row__label">${SR.t('settings.data')}</div>
          <button class="btn btn--sm btn--danger" data-reset>${SR.t('settings.reset')}</button>
        </div>
      </div>`;
    const wrap = UI.modal({ title: SR.t('settings.title'), body, wide: true });
    UI.bindLang(wrap);
    wrap.querySelectorAll('input[data-set]').forEach((input) => {
      input.addEventListener('input', () => {
        const v = Number(input.value) / 100;
        SR.Save.setSetting(input.dataset.set, v);
        SR.Audio.setVolumes(SR.Save.settings.music, SR.Save.settings.sfx);
      });
    });
    wrap.querySelectorAll('[data-speed] button').forEach((btn) => {
      btn.addEventListener('click', () => {
        wrap.querySelectorAll('[data-speed] button').forEach((b) => b.classList.remove('is-on'));
        btn.classList.add('is-on');
        SR.Save.setSetting('speed', btn.dataset.value);
        SR.Audio.sfx('select');
      });
    });
    wrap.querySelector('[data-motion]').addEventListener('click', (e) => {
      const on = !SR.Save.settings.motion;
      SR.Save.setSetting('motion', on);
      e.currentTarget.classList.toggle('is-on', on);
      UI.applySettings();
    });
    wrap.querySelector('[data-fullscreen]').addEventListener('click', () => {
      UI.toggleFullscreen();
    });
    wrap.querySelector('[data-reset]').addEventListener('click', () => {
      UI.confirm(SR.t('settings.reset'), SR.t('settings.resetConfirm'), () => {
        UI.closeAllModals();
        try {
          localStorage.removeItem('sr.saves.v1');
          localStorage.removeItem('sr.meta.v1');
          localStorage.removeItem('sr.settings.v1');
        } catch (e) { /* ignore */ }
        location.reload();
      }, true);
    });
  };

  UI.applySettings = function () {
    const s = SR.Save.settings;
    document.body.classList.toggle('reduce-motion', !!s.motion);
    SR.Audio.setVolumes(s.music, s.sfx);
    UI.setPetals(!s.motion);
  };

  UI.toggleFullscreen = function () {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => UI.toast(SR.t('toast.fullscreen'))).catch(() => {});
      } else {
        document.exitFullscreen();
      }
    } catch (e) { /* ignore */ }
  };

  /* ---------- Save slots ---------- */
  function slotInfo(run) {
    if (!run) return null;
    const chapter = SR.DATA.chapters[(run.chapter || 1) - 1];
    const h = Math.floor((run.playtime || 0) / 3600);
    const m = Math.floor(((run.playtime || 0) % 3600) / 60);
    return {
      chapter: SR.t('slots.chapter', { n: run.chapter, name: SR.L(chapter.name) }),
      playtime: SR.t('slots.playtime', { h, m }),
      updated: SR.t('slots.updated', { date: SR.dateFmt(run.updatedAt) }),
      level: Math.round(run.party.reduce((a, p) => a + p.level, 0) / run.party.length)
    };
  }

  UI.slotsModal = function (mode) {
    const rows = SR.Save.slots.map((run, i) => {
      const info = slotInfo(run);
      const isCurrent = SR.Save.currentSlot === i;
      const actions = [];
      if (mode === 'load' || mode === 'save') {
        if (run) actions.push(`<button class="btn btn--xs" data-load="${i}">${SR.t('slots.load')}</button>`);
        actions.push(`<button class="btn btn--xs btn--primary" data-save="${i}">${run ? SR.t('slots.saveHere') : SR.t('slots.new')}</button>`);
        if (run) actions.push(`<button class="btn btn--xs" data-export="${i}">${SR.t('btn.export')}</button>`);
        if (run) actions.push(`<button class="btn btn--xs btn--danger" data-delete="${i}">${SR.t('btn.delete')}</button>`);
      } else if (mode === 'new') {
        actions.push(`<button class="btn btn--xs ${run ? '' : 'btn--primary'}" data-new="${i}">${run ? SR.t('btn.confirm') : SR.t('slots.new')}</button>`);
        if (run) actions.push(`<button class="btn btn--xs" data-export="${i}">${SR.t('btn.export')}</button>`);
      } else {
        if (run) actions.push(`<button class="btn btn--xs btn--primary" data-load="${i}">${SR.t('slots.load')}</button>`);
        if (run) actions.push(`<button class="btn btn--xs" data-export="${i}">${SR.t('btn.export')}</button>`);
        if (run) actions.push(`<button class="btn btn--xs btn--danger" data-delete="${i}">${SR.t('btn.delete')}</button>`);
      }
      return `<div class="slot-card ${run ? '' : 'slot-card--empty'}">
        <div class="slot-card__num">${i + 1}</div>
        <div class="slot-card__body">
          <div class="slot-card__title">${info ? UI.esc(info.chapter) : SR.t('slots.empty')} ${isCurrent && run ? `<span class="tag tag--gold">${SR.t('slots.current')}</span>` : ''}</div>
          <div class="slot-card__meta">${info ? `${UI.esc(info.playtime)} · ${UI.esc(info.updated)} · Lv ${info.level}` : SR.t('slots.new')}</div>
        </div>
        <div class="slot-card__actions">${actions.join('')}</div>
      </div>`;
    }).join('');

    const wrap = UI.modal({
      title: SR.t('slots.title'),
      wide: true,
      body: `<p class="slot-hint" style="margin-bottom:.8rem">${SR.t('slots.subtitle')}</p>
        <div class="slots">${rows}</div>
        <div class="row" style="margin-top:.8rem;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
          <button class="btn btn--sm" data-import>${SR.t('btn.import')}</button>
          <span class="slot-hint">${SR.t('meta.offline')}</span>
        </div>`,
      onMount: (w, close) => {
        w.addEventListener('click', (e) => {
          const t = e.target.closest('button');
          if (!t) return;
          if (t.dataset.load !== undefined) {
            close();
            SR.App.loadSlot(Number(t.dataset.load));
          } else if (t.dataset.save !== undefined) {
            close();
            SR.App.saveToSlot(Number(t.dataset.save));
          } else if (t.dataset.new !== undefined) {
            const slot = Number(t.dataset.new);
            close();
            if (SR.Save.slots[slot]) {
              UI.confirm(SR.t('slots.overwrite'), SR.t('slots.overwrite'), () => SR.App.newGame(slot));
            } else {
              SR.App.newGame(slot);
            }
          } else if (t.dataset.delete !== undefined) {
            const slot = Number(t.dataset.delete);
            UI.confirm(SR.t('btn.delete'), SR.t('slots.delete'), () => {
              SR.Save.deleteSlot(slot);
              close();
              UI.slotsModal(mode);
            }, true);
          } else if (t.dataset.export !== undefined) {
            const run = SR.Save.slots[Number(t.dataset.export)];
            if (run) UI.showSaveCode(SR.Save.exportCode(run));
          } else if (t.hasAttribute('data-import')) {
            UI.importModal(close);
          }
        });
      }
    });
    return wrap;
  };

  UI.showSaveCode = function (code) {
    const wrap = UI.modal({
      title: SR.t('btn.export'),
      body: `<p class="slot-hint" style="margin-bottom:.5rem">${SR.t('slots.copyManual')}</p>
        <textarea class="code-area" rows="6" readonly style="width:100%;background:rgba(0,0,0,.4);border:1px solid var(--line);border-radius:10px;padding:.6rem;color:var(--ink);font-family:var(--mono);font-size:.66rem;word-break:break-all">${UI.esc(code)}</textarea>`,
      foot: `<button class="btn btn--ghost" data-close>${SR.t('btn.close')}</button>
             <button class="btn btn--primary" data-copy>${SR.t('btn.copy')}</button>`,
      onMount: (w, close) => {
        w.querySelector('[data-copy]').addEventListener('click', () => {
          UI.copy(code);
          UI.toast(SR.t('slots.exported'), 'pink');
        });
      }
    });
    return wrap;
  };

  UI.importModal = function (onDone) {
    const wrap = UI.modal({
      title: SR.t('btn.import'),
      body: `<p class="slot-hint" style="margin-bottom:.5rem">${SR.t('slots.importPrompt')}</p>
        <input class="code-input" type="text" placeholder="SR1-..." style="width:100%;background:rgba(0,0,0,.4);border:1px solid var(--line);border-radius:10px;padding:.65rem;color:var(--ink);font-family:var(--mono);font-size:.7rem">
        <p class="slot-hint" data-err style="color:var(--danger);margin-top:.4rem;display:none">${SR.t('slots.importError')}</p>`,
      foot: `<button class="btn btn--ghost" data-close>${SR.t('btn.cancel')}</button>
             <button class="btn btn--primary" data-ok>${SR.t('btn.import')}</button>`,
      onMount: (w, close) => {
        w.querySelector('[data-ok]').addEventListener('click', () => {
          const code = w.querySelector('.code-input').value;
          const slot = SR.Save.slots.findIndex((s) => !s);
          const target = slot === -1 ? 0 : slot;
          const run = SR.Save.importCode(code, target);
          if (!run) {
            w.querySelector('[data-err]').style.display = 'block';
            SR.Audio.sfx('error');
            return;
          }
          close();
          if (onDone) onDone();
          UI.toast(SR.t('slots.imported'), 'gold');
          SR.App.loadSlot(target);
        });
      }
    });
    return wrap;
  };

  UI.copy = function (text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
        return true;
      }
    } catch (e) { /* ignore */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    } catch (e) { return false; }
  };

  /* ---------- Support & credits ---------- */
  UI.supportModal = function () {
    const sup = SR.config.support;
    const active = SR.Premium.isActive();
    const links = [];
    if (sup.kofi) links.push({ href: sup.kofi, label: SR.t('support.kofi'), icon: '☕' });
    if (sup.patreon) links.push({ href: sup.patreon, label: SR.t('support.patreon'), icon: '♥' });
    if (sup.itch) links.push({ href: sup.itch, label: SR.t('support.itch'), icon: '★' });
    if (sup.github) links.push({ href: sup.github, label: SR.t('support.github'), icon: '✦' });
    const body = `
      <div class="support-hero">
        <div class="support-hero__mark">${SR.Art.logoMark()}</div>
        <div>
          <h3 class="h2">${SR.t('support.title')}</h3>
          <p class="muted small" style="margin-top:.3rem;line-height:1.5">${SR.t('support.body')}</p>
        </div>
      </div>
      ${active ? `<div class="panel panel--soft" style="border-color:rgba(232,194,122,.3)">
        <div class="row"><span class="tag tag--gold">${SR.t('support.active')}</span></div>
        <p class="small muted" style="margin-top:.4rem;line-height:1.5">${SR.t('support.activeBody')}</p>
      </div>` : `<div class="panel panel--soft" style="border-color:rgba(178,140,255,.3)">
        <div class="row row--between">
          <div>
            <div class="tag tag--muted">${SR.t('support.packPerks')}</div>
            <h3 class="h3" style="margin-top:.3rem">${UI.esc(SR.config.premium.productName)} · ${UI.esc(SR.config.premium.price)}</h3>
          </div>
        </div>
        <p class="small muted" style="margin-top:.4rem;line-height:1.5">${SR.t('support.packBody')}</p>
        <div class="perk-list">
          <div class="perk"><b>✦</b> ${SR.lang === 'es' ? 'Trajes de luz de luna para Hana, Yuki y Ren' : 'Moonlight costumes for Hana, Yuki and Ren'}</div>
          <div class="perk"><b>✦</b> ${SR.lang === 'es' ? `${SR.config.premium.bonusEmbers} Brasas para mejoras permanentes` : `${SR.config.premium.bonusEmbers} Embers for permanent upgrades`}</div>
          <div class="perk"><b>✦</b> ${SR.lang === 'es' ? 'Carta de arte exclusiva del reparto' : 'Exclusive cast art card'}</div>
        </div>
        <div class="row" style="margin-top:.5rem;flex-wrap:wrap">
          <a class="btn btn--gold btn--sm" href="${UI.esc(sup.itch || '#')}" target="_blank" rel="noopener">${SR.t('support.packTitle')}</a>
          <button class="btn btn--sm" data-code-toggle>${SR.t('support.codeLabel')}</button>
        </div>
        <div class="code-row hidden" data-code-row>
          <input type="text" data-code placeholder="${SR.t('support.codePlaceholder')}" aria-label="${SR.t('support.codeLabel')}">
          <button class="btn btn--primary btn--sm" data-redeem>${SR.t('btn.redeem')}</button>
        </div>
      </div>`}
      ${links.length ? `<div class="support-links">${links.map((l) => `<a class="btn btn--sm" href="${UI.esc(l.href)}" target="_blank" rel="noopener"><span>${l.icon}</span>${UI.esc(l.label)}</a>`).join('')}</div>` : `<p class="slot-hint">${SR.t('support.noLinks')}</p>`}
      <div class="panel panel--soft" style="margin-top:.8rem">
        <h4 class="h3">${SR.t('support.freeTitle')}</h4>
        <p class="small muted" style="margin-top:.3rem;line-height:1.5">${SR.t('support.freeBody')}</p>
      </div>
      <p class="center muted tiny" style="margin-top:.8rem">${SR.t('support.thanks')}</p>`;
    const wrap = UI.modal({ title: SR.t('support.title'), body, wide: true });
    const toggle = wrap.querySelector('[data-code-toggle]');
    if (toggle) {
      toggle.addEventListener('click', () => {
        wrap.querySelector('[data-code-row]').classList.toggle('hidden');
      });
    }
    const redeem = wrap.querySelector('[data-redeem]');
    if (redeem) {
      redeem.addEventListener('click', () => {
        const code = wrap.querySelector('[data-code]').value;
        if (SR.Premium.activate(code)) {
          UI.toast(SR.t('support.redeemed'), 'gold');
          SR.Audio.sfx('levelup');
          wrap.close();
          SR.App.refresh();
          UI.supportModal();
        } else {
          UI.toast(SR.t('support.invalid'), 'pink');
          SR.Audio.sfx('error');
        }
      });
    }
    return wrap;
  };

  UI.creditsModal = function () {
    return UI.modal({
      title: SR.t('credits.title'),
      body: `<div class="center" style="padding:.4rem 0 .8rem">
          <div style="width:84px;margin:0 auto .6rem;color:var(--pink-2)">${SR.Art.logoMark()}</div>
          <h3 class="h1" style="font-size:2rem">Sakura Requiem</h3>
          <p class="muted small">${SR.t('meta.subtitle')} · v${SR.VERSION}</p>
        </div>
        <div class="stack-sm" style="gap:.8rem">
          <div><span class="eyebrow">${SR.t('credits.code')}</span><p class="small" style="margin-top:.25rem">Leandro Carlino</p></div>
          <p class="small muted" style="line-height:1.6">${SR.t('credits.engine')}</p>
          <p class="small muted" style="line-height:1.6">${SR.t('credits.license')}</p>
          <p class="serif center gold" style="margin-top:.4rem">${SR.t('credits.thanks')}</p>
        </div>`,
      foot: `<a class="btn btn--sm" href="${UI.esc(SR.config.links.privacy)}" target="_blank" rel="noopener">${SR.lang === 'es' ? 'Privacidad' : 'Privacy'}</a>
             <button class="btn btn--primary btn--sm" data-close>${SR.t('btn.close')}</button>`
    });
  };

  /* ---------- Petals ---------- */
  let petalsRAF = null;
  let petalsOn = true;
  let petals = [];

  UI.initPetals = function () {
    const canvas = document.getElementById('petals');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 700 ? 16 : w < 1200 ? 28 : 40;
      petals = Array.from({ length: count }, () => makePetal(w, h, true));
    };
    const makePetal = (width, height, anywhere) => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -20,
      r: 2 + Math.random() * 4.5,
      vy: 12 + Math.random() * 26,
      vx: -8 + Math.random() * 16,
      rot: Math.random() * Math.PI * 2,
      vr: (-0.5 + Math.random()) * 0.8,
      hue: 330 + Math.random() * 22,
      a: 0.18 + Math.random() * 0.4,
      sway: Math.random() * Math.PI * 2
    });
    let last = performance.now();
    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      if (petalsOn) {
        petals.forEach((p) => {
          p.y += p.vy * dt;
          p.x += p.vx * dt + Math.sin(now / 1600 + p.sway) * 0.25;
          p.rot += p.vr * dt;
          if (p.y > h + 20 || p.x < -30 || p.x > w + 30) Object.assign(p, makePetal(w, h, false));
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = p.a;
          ctx.fillStyle = `hsl(${p.hue} 80% 78%)`;
          ctx.beginPath();
          ctx.moveTo(0, -p.r);
          ctx.bezierCurveTo(p.r * 1.1, -p.r * 0.6, p.r * 1.1, p.r * 0.6, 0, p.r);
          ctx.bezierCurveTo(-p.r * 1.1, p.r * 0.6, -p.r * 1.1, -p.r * 0.6, 0, -p.r);
          ctx.fill();
          ctx.restore();
        });
      }
      petalsRAF = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener('resize', resize);
    cancelAnimationFrame(petalsRAF);
    petalsRAF = requestAnimationFrame(draw);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) last = performance.now();
    });
  };

  UI.setPetals = function (on) {
    petalsOn = !!on;
    const canvas = document.getElementById('petals');
    if (canvas) canvas.style.display = on ? '' : 'none';
  };

  /* ---------- Background helpers ---------- */
  UI.scene = function (kind) {
    return `<div class="title-scene">${SR.Art.scene(kind)}</div>`;
  };

  UI.applyDocumentLang = function () {
    document.documentElement.lang = SR.lang;
  };
})();
