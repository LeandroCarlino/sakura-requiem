/* Sakura Requiem — battle presentation */
window.SR = window.SR || {};

(function () {
  const Battle = {};
  SR.Battle = Battle;
  const t = (k, v) => SR.t(k, v);
  const L = (o) => SR.L(o);
  let B = null;
  let runToken = 0;

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  function unitNode(uid) {
    return document.querySelector(`.unit[data-uid="${uid}"]`);
  }
  function findUnit(uid) {
    return B && B.battle.units.find((u) => u.uid === uid);
  }
  function alive() {
    return B && !B.ended && B.runId === runToken;
  }

  function sceneKind() {
    if (B.battle.isTrials) return 'hollow';
    const chapter = SR.DATA.chapters[B.battle.chapter - 1];
    return chapter ? chapter.bg : 'shrine';
  }

  function unitHTML(u) {
    const isAlly = u.side === 'ally';
    const art = isAlly
      ? SR.Art.hero(u.heroId, { moonlight: B.opts.moonlight })
      : SR.Art.enemy(u.enemyId);
    const el = SR.DATA.elements[u.element] || {};
    const hpPct = Math.max(0, Math.min(100, (u.hp / u.maxHp) * 100));
    return `<div class="unit ${isAlly ? 'unit--ally' : 'unit--enemy'}" data-uid="${u.uid}">
      <div class="unit__float">
        <div class="unit__portrait">
          ${art}
          <span class="unit__el" style="color:${el.color || '#fff'}">${el.icon || '✦'}</span>
          ${isAlly ? `<div class="unit__res" style="--res:${Math.round(u.resonance)}%"><span>${Math.round(u.resonance)}</span></div>` : ''}
        </div>
        <div class="unit__plate">
          <div class="unit__name">${SR.UI.esc(L(u.name))}<span>${t('hud.level', { n: u.level })}</span></div>
          <div class="unit__bars">
            <div class="unit__bar-row">
              <div class="bar ${isAlly ? 'bar--hp' : 'bar--enemy'}"><i style="width:${hpPct}%"></i></div>
              <b class="hp-num">${Math.ceil(u.hp)}</b>
            </div>
            ${isAlly ? `<div class="unit__bar-row">
              <div class="bar bar--sp"><i style="width:${(u.sp / u.maxSp) * 100}%"></i></div>
              <b class="sp-num">${Math.round(u.sp)}</b>
            </div>` : ''}
          </div>
          <div class="unit__status"></div>
        </div>
      </div>
    </div>`;
  }

  function refreshUnit(u) {
    const node = unitNode(u.uid);
    if (!node) return;
    node.classList.toggle('is-dead', !u.alive);
    const hpBar = node.querySelector('.bar--hp i, .bar--enemy i');
    if (hpBar) hpBar.style.width = Math.max(0, (u.hp / u.maxHp) * 100) + '%';
    const hpNum = node.querySelector('.hp-num');
    if (hpNum) hpNum.textContent = Math.max(0, Math.ceil(u.hp));
    const spBar = node.querySelector('.bar--sp i');
    if (spBar) spBar.style.width = Math.max(0, (u.sp / u.maxSp) * 100) + '%';
    const spNum = node.querySelector('.sp-num');
    if (spNum) spNum.textContent = Math.round(u.sp);
    const res = node.querySelector('.unit__res');
    if (res) {
      res.style.setProperty('--res', Math.round(u.resonance) + '%');
      const span = res.querySelector('span');
      if (span) span.textContent = Math.round(u.resonance);
    }
    const statusEl = node.querySelector('.unit__status');
    if (statusEl) {
      statusEl.innerHTML = u.statuses.map((s) => {
        const def = SR.DATA.statuses[s.id] || {};
        return `<span class="status-chip" style="color:${def.color || '#ccc'};border-color:${(def.color || '#ccc') + '55'}" title="${SR.t('status.' + s.id)}">${def.icon || '•'}${s.turns < 90 ? s.turns : ''}</span>`;
      }).join('');
    }
  }

  function refreshAll() {
    if (!B) return;
    B.battle.units.forEach(refreshUnit);
    updateTop();
  }

  function updateActive() {
    document.querySelectorAll('.unit').forEach((n) => n.classList.remove('is-active'));
    if (B.actor && B.actor.alive) {
      const node = unitNode(B.actor.uid);
      if (node) node.classList.add('is-active');
    }
  }

  function updateTop() {
    if (!B) return;
    const round = document.querySelector('.round-chip');
    if (round) round.textContent = t('hud.round', { n: B.battle.round });
    const q = document.querySelector('.turn-queue');
    if (!q) return;
    const list = [];
    if (B.actor && B.actor.alive) list.push(B.actor.uid);
    B.battle.queue.forEach((uid) => {
      const u = findUnit(uid);
      if (u && u.alive && !list.includes(uid)) list.push(uid);
    });
    q.innerHTML = `<span class="queue-label">${t('hud.turnOrder')}</span>` + list.slice(0, 9).map((uid, i) => {
      const u = findUnit(uid);
      if (!u) return '';
      const initial = SR.UI.esc(L(u.name)).slice(0, 1).toUpperCase();
      return `<span class="queue-item ${u.side === 'ally' ? 'queue-item--ally' : 'queue-item--enemy'} ${i === 0 ? 'queue-item--now' : ''}" title="${SR.UI.esc(L(u.name))}">${initial}</span>`;
    }).join('');
  }

  function renderLog() {
    const log = document.getElementById('battle-log');
    if (!log) return;
    const lines = B.battle.log.slice(-5);
    log.innerHTML = lines.map((line) => `<div class="log-line">${SR.UI.esc(line)}</div>`).join('');
  }

  function renderDock() {
    const dock = document.getElementById('dock');
    if (!dock) return;
    const u = B.actor;
    if (!u) { dock.innerHTML = ''; return; }
    const st = u.side === 'ally' ? '' : `<span class="tag tag--muted">${t('battle.enemyTurn')}</span>`;
    const portrait = u.side === 'ally'
      ? SR.Art.hero(u.heroId, { moonlight: B.opts.moonlight })
      : SR.Art.enemy(u.enemyId);
    const activeCard = `<div class="active-card">
      <div class="active-card__portrait">${portrait}</div>
      <div class="active-card__info">
        <div class="active-card__name">${SR.UI.esc(L(u.name))}<span>${t('hud.level', { n: u.level })}</span></div>
        <div class="active-card__bars">
          <div class="bar bar--hp"><i style="width:${(u.hp / u.maxHp) * 100}%"></i></div>
          ${u.side === 'ally' ? `<div class="bar bar--sp"><i style="width:${(u.sp / u.maxSp) * 100}%"></i></div>` : ''}
        </div>
      </div>
    </div>`;

    if (u.side !== 'ally' || B.busy) {
      dock.innerHTML = activeCard + `<div class="commands" style="grid-template-columns:1fr">${st ? `<div class="cmd" style="grid-column:1/-1;min-height:64px">${st}</div>` : ''}</div>`;
      dock.classList.toggle('is-busy', !!B.busy);
      return;
    }

    const items = Object.keys(B.battle.inventory || {}).filter((id) => B.battle.inventory[id] > 0);
    const canUlt = u.resonance >= 100;
    dock.classList.remove('is-busy');
    dock.innerHTML = `${activeCard}
      <div class="commands">
        <button class="cmd" data-cmd="attack"><span class="cmd__icon">⚔</span><span class="cmd__label">${t('battle.attack')}</span><span class="cmd__sub">${t('battle.ready')}</span></button>
        <button class="cmd" data-cmd="skills"><span class="cmd__icon">❀</span><span class="cmd__label">${t('battle.skills')}</span><span class="cmd__sub">${u.skills.length} · ${Math.round(u.sp)} SP</span></button>
        <button class="cmd cmd--item" data-cmd="items"><span class="cmd__icon">◈</span><span class="cmd__label">${t('battle.items')}</span><span class="cmd__sub">${items.length}</span></button>
        <button class="cmd cmd--guard" data-cmd="guard"><span class="cmd__icon">🛡</span><span class="cmd__label">${t('battle.guard')}</span><span class="cmd__sub">-50%</span></button>
        <button class="cmd cmd--ult ${canUlt ? 'is-ready' : ''}" data-cmd="ult" ${canUlt ? '' : 'disabled'}><span class="cmd__icon">✦</span><span class="cmd__label">${t('battle.ultimate')}</span><span class="cmd__sub">${Math.round(u.resonance)}%</span></button>
      </div>
      <div id="submenu-root"></div>`;
  }

  function closeSubmenu() {
    const root = document.getElementById('submenu-root');
    if (root) root.innerHTML = '';
    if (B) B.mode = B.mode === 'skills' || B.mode === 'items' ? 'command' : B.mode;
  }

  function clearTargets() {
    document.querySelectorAll('.unit.is-targetable').forEach((n) => n.classList.remove('is-targetable'));
    const hint = document.getElementById('target-hint');
    if (hint) { hint.classList.add('hidden'); hint.innerHTML = ''; }
  }

  function targetableUnits(kind, includeDead) {
    const side = kind === 'ally' ? 'ally' : 'enemy';
    return B.battle.units.filter((u) => u.side === side && (u.alive || includeDead));
  }

  function openTarget(kind, pending, includeDead) {
    B.mode = 'target';
    B.pending = Object.assign({ targetType: kind }, pending);
    clearTargets();
    targetableUnits(kind, includeDead).forEach((u) => {
      const node = unitNode(u.uid);
      if (node) node.classList.add('is-targetable');
    });
    const hint = document.getElementById('target-hint');
    if (hint) {
      hint.classList.remove('hidden');
      hint.innerHTML = `<span>${kind === 'ally' ? t('battle.chooseAlly') : t('battle.chooseTarget')}</span>
        <button class="btn btn--xs btn--ghost" data-cmd="cancel">${t('battle.back')}</button>`;
    }
  }

  function openSkills() {
    if (B.busy) return;
    B.mode = 'skills';
    clearTargets();
    const u = B.actor;
    const root = document.getElementById('submenu-root');
    root.innerHTML = `<div class="submenu">
      <div class="submenu__head"><h3>${t('battle.chooseSkill')}</h3><button class="btn btn--sm" data-cmd="back">${t('battle.back')}</button></div>
      <div class="submenu-grid">
        ${u.skills.map((s) => {
          const disabled = u.sp < (s.sp || 0);
          return `<button class="choice" data-skill="${s.id}" ${disabled ? 'disabled' : ''}>
            <span class="choice__icon" style="color:${(SR.DATA.elements[s.element] || {}).color}">${SR.UI.elementIcon(s.element)}</span>
            <span class="choice__body">
              <span class="choice__name">${SR.UI.esc(L(s.name))}<span>${s.sp} SP</span></span>
              <span class="choice__desc">${SR.UI.esc(L(s.desc))}</span>
              <span class="choice__meta"><span class="pill" style="font-size:.58rem">${s.target === 'allEnemies' ? t('battle.targetAll') : s.target === 'allAllies' ? t('party.hp') : t('battle.ready')}</span></span>
            </span>
          </button>`;
        }).join('')}
      </div>
    </div>`;
  }

  function openItems() {
    if (B.busy) return;
    B.mode = 'items';
    clearTargets();
    const inv = B.battle.inventory || {};
    const ids = Object.keys(SR.DATA.items).filter((id) => inv[id] > 0);
    const root = document.getElementById('submenu-root');
    root.innerHTML = `<div class="submenu">
      <div class="submenu__head"><h3>${t('battle.chooseItem')}</h3><button class="btn btn--sm" data-cmd="back">${t('battle.back')}</button></div>
      <div class="submenu-grid">
        ${ids.length ? ids.map((id) => {
          const item = SR.DATA.items[id];
          return `<button class="choice" data-item="${id}">
            <span class="choice__icon">◈</span>
            <span class="choice__body">
              <span class="choice__name">${SR.UI.esc(L(item.name))}<span>×${inv[id]}</span></span>
              <span class="choice__desc">${SR.UI.esc(L(item.desc))}</span>
            </span>
          </button>`;
        }).join('') : `<p class="muted small">${t('battle.noItems')}</p>`}
      </div>
    </div>`;
  }

  function startTargetFor(kind, pending) {
    let includeDead = false;
    if (pending.kind === 'item') {
      const item = SR.DATA.items[pending.itemId];
      includeDead = !!(item && item.revive);
    } else if (pending.kind === 'skill') {
      const skill = B.actor.skills.find((s) => s.id === pending.skillId);
      includeDead = !!(skill && skill.reviveAllies);
    }
    openTarget(kind, pending, includeDead);
  }

  function chooseSkill(skillId) {
    const u = B.actor;
    const skill = u.skills.find((s) => s.id === skillId);
    if (!skill) return;
    if (u.sp < (skill.sp || 0)) {
      SR.UI.toast(t('battle.noSp'), 'pink');
      SR.Audio.sfx('error');
      return;
    }
    closeSubmenu();
    if (skill.target === 'allEnemies' || skill.target === 'allAllies' || skill.target === 'self') {
      perform({ kind: 'skill', skillId, targetUid: skill.target === 'self' ? u.uid : null });
    } else if (skill.target === 'ally') {
      startTargetFor('ally', { kind: 'skill', skillId });
    } else {
      startTargetFor('enemy', { kind: 'skill', skillId });
    }
  }

  function chooseItem(itemId) {
    const item = SR.DATA.items[itemId];
    if (!item) return;
    closeSubmenu();
    if (item.target === 'allAllies' || item.target === 'allEnemies' || item.target === 'self') {
      perform({ kind: 'item', itemId, targetUid: item.target === 'self' ? B.actor.uid : null });
    } else {
      startTargetFor(item.target, { kind: 'item', itemId });
    }
  }

  function chooseUlt() {
    const u = B.actor;
    if (u.resonance < 100) {
      SR.UI.toast(t('battle.locked'), 'pink');
      SR.Audio.sfx('error');
      return;
    }
    const ult = u.ult;
    if (ult.target === 'allEnemies' || ult.target === 'allAllies' || ult.target === 'self') {
      perform({ kind: 'ult', targetUid: ult.target === 'self' ? u.uid : null });
    } else if (ult.target === 'ally') {
      startTargetFor('ally', { kind: 'ult' });
    } else {
      startTargetFor('enemy', { kind: 'ult' });
    }
  }

  async function playEvents(events) {
    for (const ev of events) {
      if (!alive()) return;
      switch (ev.type) {
        case 'log':
          renderLog();
          break;
        case 'damage': {
          const u = findUnit(ev.uid);
          if (!u) break;
          refreshUnit(u);
          const node = unitNode(ev.uid);
          if (node) {
            const f = document.createElement('div');
            f.className = 'dmg-float' + (ev.crit ? ' is-crit' : '');
            f.textContent = (ev.crit ? '✸ ' : '') + '-' + SR.fmt(ev.amount);
            node.appendChild(f);
            node.classList.add('is-hit');
            setTimeout(() => f.remove(), 1000);
            setTimeout(() => node.classList.remove('is-hit'), 380);
          }
          SR.Audio.sfx(ev.crit ? 'crit' : 'hit');
          await sleep(ev.crit ? 360 : 230);
          break;
        }
        case 'heal': {
          const u = findUnit(ev.uid);
          if (!u) break;
          refreshUnit(u);
          const node = unitNode(ev.uid);
          if (node) {
            const f = document.createElement('div');
            f.className = 'dmg-float is-heal';
            f.textContent = '+' + SR.fmt(ev.amount);
            node.appendChild(f);
            node.classList.add('is-healed');
            setTimeout(() => f.remove(), 1000);
            setTimeout(() => node.classList.remove('is-healed'), 520);
          }
          SR.Audio.sfx('heal');
          await sleep(200);
          break;
        }
        case 'status':
        case 'shield':
        case 'cleanse': {
          const u = findUnit(ev.uid);
          if (u) refreshUnit(u);
          await sleep(90);
          break;
        }
        case 'death': {
          const u = findUnit(ev.uid);
          if (u) {
            refreshUnit(u);
            const node = unitNode(ev.uid);
            if (node) node.classList.add('is-dead');
          }
          await sleep(320);
          break;
        }
        case 'revive': {
          const u = findUnit(ev.uid);
          if (u) { refreshUnit(u); }
          await sleep(280);
          break;
        }
        case 'miss': {
          const node = unitNode(ev.uid);
          if (node) {
            const f = document.createElement('div');
            f.className = 'dmg-float is-miss';
            f.textContent = t('log.evade').replace('{target}', '');
            node.appendChild(f);
            setTimeout(() => f.remove(), 900);
          }
          await sleep(180);
          break;
        }
        case 'ult': {
          flash(ev.name);
          await sleep(520);
          break;
        }
        case 'phase': {
          flash(ev.text, true);
          renderLog();
          await sleep(600);
          break;
        }
        case 'resonanceFull': {
          SR.UI.toast(t('battle.resonanceFull'), 'pink');
          SR.Audio.sfx('levelup');
          break;
        }
        case 'resonance': {
          const u = findUnit(ev.uid);
          if (u) refreshUnit(u);
          break;
        }
        case 'sp': {
          const u = findUnit(ev.uid);
          if (u) refreshUnit(u);
          break;
        }
        case 'item':
          break;
        case 'error':
          SR.UI.toast(t(ev.key || 'toast.error'), 'pink');
          break;
      }
    }
    refreshAll();
  }

  function flash(text, dark) {
    const fx = document.createElement('div');
    fx.className = 'fx-flash';
    if (dark) fx.style.background = 'radial-gradient(circle at 50% 45%, rgba(178,140,255,.7), rgba(60,20,90,.4) 35%, transparent 70%)';
    document.body.appendChild(fx);
    setTimeout(() => fx.remove(), 650);
    if (text) {
      const banner = document.createElement('div');
      banner.className = 'ult-banner';
      banner.textContent = text;
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 1500);
    }
  }

  async function perform(action) {
    if (!B || B.busy || B.ended) return;
    if (B.mode === 'target' && action.kind !== 'guard') {
      clearTargets();
    }
    B.busy = true;
    B.mode = 'action';
    closeSubmenu();
    clearTargets();
    const actor = B.actor;
    const actorNode = unitNode(actor.uid);
    if (actorNode && action.kind !== 'guard' && action.kind !== 'item') {
      actorNode.classList.add(action.kind === 'ult' ? 'is-casting' : 'is-lunge');
      setTimeout(() => actorNode.classList.remove('is-lunge', 'is-casting'), 500);
    }
    renderDock();
    const events = SR.Engine.perform(B.battle, actor, action);
    await playEvents(events);
    if (!alive()) return;
    if (B.battle.over) return finish(B.battle.result);
    await sleep(140);
    if (!alive()) return;
    nextTurn();
  }

  async function enemyTurn(actor) {
    if (!alive()) return;
    B.busy = true;
    B.actor = actor;
    updateActive();
    renderDock();
    await sleep(520);
    if (!alive()) return;
    const node = unitNode(actor.uid);
    if (node) {
      node.classList.add('is-lunge');
      setTimeout(() => node.classList.remove('is-lunge'), 400);
    }
    const events = SR.Engine.aiAct(B.battle, actor);
    await playEvents(events);
    if (!alive()) return;
    if (B.battle.over) return finish(B.battle.result);
    await sleep(160);
    if (!alive()) return;
    nextTurn();
  }

  async function nextTurn() {
    if (!alive()) return;
    B.busy = true;
    const res = SR.Engine.next(B.battle);
    updateTop();
    if (res.events && res.events.length) await playEvents(res.events);
    if (!alive()) return;
    updateTop();
    if (res.type === 'end') return finish(res.result);
    if (res.type === 'skip') {
      refreshAll();
      await sleep(320);
      if (!alive()) return;
      return nextTurn();
    }
    B.actor = res.unit;
    refreshAll();
    updateActive();
    if (res.type === 'ally') {
      B.busy = false;
      B.mode = 'command';
      renderDock();
      SR.Audio.sfx('select');
    } else {
      renderDock();
      await sleep(480);
      if (!alive()) return;
      enemyTurn(res.unit);
    }
  }

  function finish(result) {
    if (!B || B.ended) return;
    B.ended = true;
    B.busy = true;
    clearTargets();
    closeSubmenu();
    if (result === 'victory') SR.Audio.sfx('victory');
    else if (result === 'defeat') SR.Audio.sfx('defeat');
    const battle = B.battle;
    const onEnd = B.opts.onEnd;
    setTimeout(() => {
      if (onEnd) onEnd(result, battle);
    }, result === 'victory' ? 650 : 450);
  }

  Battle.start = function (opts) {
    runToken += 1;
    B = {
      battle: opts.battle,
      opts,
      actor: null,
      mode: 'command',
      pending: null,
      busy: true,
      ended: false,
      runId: runToken
    };
    const battle = opts.battle;
    const enemyHTML = battle.enemies.map(unitHTML).join('');
    const allyHTML = battle.allies.map(unitHTML).join('');
    const chapter = SR.DATA.chapters[battle.chapter - 1];
    const title = battle.isTrials
      ? t('trials.wave', { n: battle.trialsWave })
      : battle.isBoss
        ? t('map.boss') + ' · ' + L(chapter.name)
        : L(chapter.name);
    document.getElementById('app').innerHTML = `<section class="screen battle-screen">
      <div class="battle-bg">${SR.Art.scene(sceneKind())}</div>
      <div class="fx-vignette"></div>
      <header class="battle-top">
        <span class="round-chip">${t('hud.round', { n: 1 })}</span>
        <div class="turn-queue"></div>
        <div class="spacer"></div>
        <span class="pill" style="display:none" id="battle-title">${SR.UI.esc(title)}</span>
        <button class="icon-btn" data-act="menu" aria-label="${t('hud.menu')}">☰</button>
      </header>
      <div class="battle-field">
        <div class="enemy-row">${enemyHTML}</div>
        <div class="ally-row">${allyHTML}</div>
      </div>
      <div class="battle-log" id="battle-log"></div>
      <div class="command-dock" id="dock"></div>
      <div class="target-hint hidden" id="target-hint"></div>
    </section>`;
    document.getElementById('app').scrollTop = 0;

    // global click handling for this battle instance
    const app = document.getElementById('app');
    app.onclick = (e) => {
      if (!B || B.ended) return;
      const cmd = e.target.closest('[data-cmd]');
      if (cmd) {
        const c = cmd.dataset.cmd;
        if (c === 'cancel' || c === 'back') {
          clearTargets();
          closeSubmenu();
          B.mode = 'command';
          B.pending = null;
          SR.Audio.sfx('back');
          renderDock();
          return;
        }
        if (B.busy || B.mode === 'target') return;
        if (c === 'attack') {
          startTargetFor('enemy', { kind: 'attack' });
          SR.Audio.sfx('select');
        } else if (c === 'skills') {
          openSkills();
          SR.Audio.sfx('select');
        } else if (c === 'items') {
          openItems();
          SR.Audio.sfx('select');
        } else if (c === 'guard') {
          perform({ kind: 'guard' });
        } else if (c === 'ult') {
          chooseUlt();
        }
        return;
      }
      const skillBtn = e.target.closest('[data-skill]');
      if (skillBtn) {
        SR.Audio.sfx('select');
        chooseSkill(skillBtn.dataset.skill);
        return;
      }
      const itemBtn = e.target.closest('[data-item]');
      if (itemBtn) {
        SR.Audio.sfx('select');
        chooseItem(itemBtn.dataset.item);
        return;
      }
      const unitEl = e.target.closest('.unit.is-targetable');
      if (unitEl && B.mode === 'target' && B.pending) {
        const uid = unitEl.dataset.uid;
        const action = Object.assign({}, B.pending, { targetUid: uid });
        B.pending = null;
        B.mode = 'action';
        SR.Audio.sfx('select');
        perform(action);
        return;
      }
      const act = e.target.closest('[data-act="menu"]');
      if (act) openMenu();
    };

    document.onkeydown = (e) => {
      if (!B || B.ended) return;
      if (e.key === 'Escape') {
        if (B.mode === 'target' || B.mode === 'skills' || B.mode === 'items') {
          clearTargets();
          closeSubmenu();
          B.mode = 'command';
          B.pending = null;
          renderDock();
        }
      }
    };

    SR.Audio.playMusic(battle.isBoss ? 'boss' : 'battle');
    renderDock();
    renderLog();
    refreshAll();
    updateTop();
    setTimeout(() => {
      if (alive()) nextTurn();
    }, 350);
  };

  function openMenu() {
    if (!B || B.ended) return;
    SR.Audio.sfx('select');
    const wrap = SR.UI.modal({
      title: t('hud.menu'),
      small: true,
      body: `<div class="col" style="gap:.5rem">
        <button class="btn btn--wide" data-menu="resume">${t('battle.ready')}</button>
        <button class="btn btn--wide" data-menu="log">${t('battle.log')}</button>
        <button class="btn btn--wide" data-menu="settings">${t('btn.settings')}</button>
        <button class="btn btn--wide btn--danger" data-menu="retreat">${t('battle.retreat')}</button>
      </div>`,
      onMount: (w, close) => {
        w.querySelectorAll('[data-menu]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const m = btn.dataset.menu;
            if (m === 'resume') close();
            if (m === 'settings') SR.UI.settingsModal();
            if (m === 'log') {
              const log = document.getElementById('battle-log');
              if (log) {
                const open = getComputedStyle(log).display === 'none';
                log.classList.toggle('is-open', open);
                log.classList.toggle('is-hidden', !open);
                if (open) log.scrollTop = log.scrollHeight;
              }
              close();
            }
            if (m === 'retreat') {
              close();
              SR.UI.confirm(t('battle.retreat'), t('battle.retreatConfirm'), () => {
                if (!B || B.ended) return;
                B.ended = true;
                if (B.opts.onEnd) B.opts.onEnd('retreat', B.battle);
              }, true);
            }
          });
        });
      }
    });
    return wrap;
  }

  Battle.cleanup = function () {
    runToken += 1;
    B = null;
    const app = document.getElementById('app');
    if (app) app.onclick = null;
    document.onkeydown = null;
    if (SR.UI && SR.UI.closeAllModals) SR.UI.closeAllModals();
  };
})();
