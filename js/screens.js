/* Sakura Requiem — screens */
window.SR = window.SR || {};

(function () {
  const Screens = {};
  SR.Screens = Screens;
  const D = SR.DATA;
  const t = (k, v) => SR.t(k, v);
  const L = (o) => SR.L(o);
  const esc = (s) => SR.UI.esc(s);
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  const ITEM_ICONS = {
    onigiri: '🍙', bigOnigiri: '🍙', sake: '🍶', petalRevive: '🌸', salt: '🧂',
    warDrum: '🥁', elixir: '🧪', smokeBomb: '💨', moonCharm: '🌙'
  };
  const RELIC_ICONS = {
    sakuraPin: '🌸', foxBell: '🔔', ironFan: '🪭', bloodOath: '🩸', moonMirror: '🪞',
    kitsuneMask: '🦊', abyssSigil: '✺', stormBeads: '📿', emberLocket: '🔥',
    frozenTear: '❄', voidShard: '✦', guardianStone: '🛡', dancerVeil: '🎐'
  };
  const BOON_ICONS = {
    ironPetal: '❀', bloodSong: '⚔', stoneSkin: '◈', swiftWind: '🍃', keenEdge: '✦',
    deepWound: '✧', firstStrike: '⚡', executioner: '☠', lifedrain: '🩸', guardMaster: '🛡',
    resonant: '✺', purifier: '✚', voidtouched: '◐', emberHeart: '🔥', frostVein: '❄',
    galeStep: '🍃', hollowGift: '✦', counter: '↺', spiritFlow: '◉', phantomStep: '≈'
  };

  function heroOf(id) { return D.heroes.find((h) => h.id === id); }
  function runNow() { return SR.Save.current(); }

  /* ============================================================
     TITLE
     ============================================================ */
  Screens.title = function () {
    const recent = SR.Save.mostRecent();
    const run = recent >= 0 ? SR.Save.slots[recent] : null;
    const chapter = run ? D.chapters[run.chapter - 1] : null;
    const continueBtn = run
      ? `<button class="btn btn--primary btn--wide title-continue" data-act="continue">
           <span>${t('btn.continue')}</span>
           <small>${t('title.continueHint', { n: run.chapter, name: L(chapter.name) })}</small>
         </button>`
      : '';
    return `<section class="screen title-screen">
      <div class="title-scene">${SR.Art.scene('shrine')}</div>
      <div class="title-top">
        ${SR.UI.langSwitch()}
        <span class="pill">v${SR.VERSION}</span>
      </div>
      <div class="title-content">
        <div class="logo">
          <div class="logo__jp">桜</div>
          ${SR.Art.logoMark()}
          <div class="logo__kicker">${t('meta.subtitle')}</div>
          <h1 class="logo__title">SAKURA<em>REQUIEM</em></h1>
          <p class="logo__tag">${t('meta.tagline')}</p>
        </div>
        <div class="title-menu">
          ${continueBtn}
          <button class="btn ${run ? '' : 'btn--primary'} btn--wide" data-act="new">${t('btn.newGame')}</button>
          <div class="title-menu__secondary">
            <button class="btn btn--sm" data-act="load">${t('btn.load')}</button>
            <button class="btn btn--sm" data-act="settings">${t('btn.settings')}</button>
            <button class="btn btn--sm" data-act="support">${t('btn.support')}</button>
          </div>
          <button class="btn btn--sm btn--ghost" data-act="credits">${t('btn.credits')}</button>
        </div>
      </div>
      <div class="title-foot">
        <span>${t('meta.footer')}</span>
        <span class="dot">·</span>
        <span>${t('meta.offline')}</span>
      </div>
    </section>`;
  };

  Screens.mountTitle = function (root) {
    SR.UI.bindLang(root);
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      SR.Audio.sfx('select');
      switch (btn.dataset.act) {
        case 'continue': SR.App.continueGame(); break;
        case 'new': SR.UI.slotsModal('new'); break;
        case 'load': SR.UI.slotsModal('load'); break;
        case 'settings': SR.UI.settingsModal(); break;
        case 'support': SR.UI.supportModal(); break;
        case 'credits': SR.UI.creditsModal(); break;
      }
    });
  };

  /* ============================================================
     WORLD MAP
     ============================================================ */
  Screens.worldmap = function () {
    const run = runNow();
    if (!run) return Screens.title();
    const chapter = D.chapters[run.chapter - 1];
    const isBoss = run.battleIndex >= chapter.encounters.length;
    const rested = !!(run.flags.rested && run.flags.rested[run.chapter]);
    const total = chapter.encounters.length + 1;
    const done = run.battleIndex;

    const cards = D.chapters.map((c) => {
      const cleared = run.cleared.includes(c.n);
      const current = c.n === run.chapter;
      const locked = c.n > run.unlocked;
      const cls = ['chapter-card'];
      if (current) cls.push('is-current');
      if (cleared) cls.push('is-cleared');
      if (locked) cls.push('is-locked');
      const prog = current ? Math.min(100, (done / total) * 100) : cleared ? 100 : 0;
      const tag = current ? `<span class="tag">${isBoss ? t('map.boss') : t('btn.enter')}</span>`
        : cleared ? `<span class="tag tag--gold">${t('map.cleared')}</span>`
        : `<span class="tag tag--muted">${t('map.locked')}</span>`;
      return `<button class="${cls.join(' ')}" style="--hue:${c.hue}" data-chapter="${c.n}" ${locked ? 'aria-disabled="true"' : ''}>
        <div class="chapter-card__top">
          <span class="chapter-card__num">${roman[c.n - 1]}</span>
          ${tag}
        </div>
        <h3>${esc(L(c.name))}</h3>
        <p>${esc(L(c.desc))}</p>
        <div class="chapter-card__bar"><i style="width:${prog}%"></i></div>
        <div class="chapter-card__foot">
          <span>${current ? t('map.progress', { done, total }) : cleared ? t('map.chapterDone') : t('map.lockedHint', { n: c.n - 1 })}</span>
          <span>${locked ? '🔒' : '→'}</span>
        </div>
      </button>`;
    }).join('');

    const party = run.party.map((rh) => {
      const hero = heroOf(rh.id);
      const st = SR.Progress.maxOf(run, rh);
      const hp = rh.hp == null ? st.maxHp : rh.hp;
      const sp = rh.sp == null ? st.maxSp : rh.sp;
      return `<div class="party-mini__row">
        <div class="party-mini__avatar">${SR.Art.hero(rh.id, { moonlight: run.flags.moonlight })}</div>
        <div>
          <div class="party-mini__name"><span>${esc(L(hero.name))}</span><span>${t('hud.level', { n: rh.level })}</span></div>
          <div class="party-mini__bars">
            ${SR.UI.bar(hp, st.maxHp, 'bar--hp bar--slim')}
            ${SR.UI.bar(sp, st.maxSp, 'bar--sp bar--slim')}
          </div>
        </div>
      </div>`;
    }).join('');

    const trials = run.trialsUnlocked
      ? `<div class="map-trials">
          <div class="row row--between"><span class="tag tag--muted">${t('map.trials')}</span><span class="tiny muted">${t('map.trialsBest', { n: SR.Save.meta.bestWave || 0 })}</span></div>
          <p class="map-note">${t('map.trialsHint')}</p>
          <button class="btn btn--sm" data-act="trials">✦ ${t('btn.trials')}</button>
        </div>`
      : `<div class="map-trials is-locked">
          <div class="row row--between"><span class="tag tag--muted">${t('map.trials')}</span><span>🔒</span></div>
          <p class="map-note">${t('map.trialsLocked')}</p>
        </div>`;

    return `<section class="screen map-screen">
      ${SR.UI.topbar({
        title: t('map.title'),
        eyebrow: `${t('hud.chapter', { n: run.chapter })} · ${L(chapter.name)}`,
        run,
        actions: [
          { act: 'party', label: t('btn.party'), icon: '❀' },
          { act: 'shop', label: t('btn.shop'), icon: '⛩' },
          { act: 'save', label: t('btn.save'), icon: '◈' },
          { act: 'settings', label: '⚙', }
        ]
      })}
      <div class="map-layout">
        <div class="map-main">
          <div class="map-banner">
            ${SR.Art.scene(chapter.bg)}
            <div class="map-banner__body">
              <span class="eyebrow">${t('dialogue.chapter', { n: chapter.n })}</span>
              <h2 class="h1">${esc(L(chapter.name))}</h2>
              <p>${esc(L(chapter.desc))}</p>
              <div class="row" style="margin-top:.5rem">
                <button class="btn btn--primary" data-act="battle">${isBoss ? '☠ ' + t('map.boss') : '⚔ ' + t('map.next')}</button>
                <span class="pill">${t('map.progress', { done, total })}</span>
              </div>
            </div>
          </div>
          <div class="chapter-grid">${cards}</div>
        </div>
        <aside class="map-side">
          <div class="panel">
            <div class="panel__head"><span class="panel__title">${t('map.party')}</span><span class="pill">Lv ${Math.round(run.party.reduce((a, p) => a + p.level, 0) / run.party.length)}</span></div>
            <div class="party-mini">${party}</div>
            <div class="row" style="margin-top:.8rem;flex-wrap:wrap">
              <button class="btn btn--sm" data-act="party">${t('btn.party')}</button>
              <button class="btn btn--sm" data-act="shop">${t('btn.shop')}</button>
            </div>
          </div>
          <div class="panel">
            <div class="panel__head"><span class="panel__title">${t('map.rest')}</span><span class="tag ${rested ? 'tag--muted' : 'tag--gold'}">${rested ? t('map.restDone').slice(0, 24) + '…' : 'FREE'}</span></div>
            <p class="map-note">${rested ? t('map.restDone') : t('map.essenceHint')}</p>
            <button class="btn btn--sm btn--wide" data-act="rest" ${rested ? 'disabled' : ''} style="margin-top:.5rem">✚ ${t('btn.rest')}</button>
          </div>
          <div class="panel panel--tight">
            ${trials}
          </div>
          <div class="map-actions">
            <button class="btn btn--sm" data-act="save">◈ ${t('map.save')}</button>
            <button class="btn btn--sm" data-act="settings">⚙ ${t('map.settings')}</button>
          </div>
          ${SR.config.ads.enabled && SR.config.ads.showOnMap && SR.config.ads.slotHtml ? `<div class="ad-slot">${SR.config.ads.slotHtml}</div>` : ''}
        </aside>
      </div>
    </section>`;
  };

  Screens.mountMap = function (root) {
    const run = runNow();
    if (!run) return;
    root.addEventListener('click', (e) => {
      const card = e.target.closest('[data-chapter]');
      if (card) {
        const n = Number(card.dataset.chapter);
        if (n > run.unlocked) {
          SR.UI.toast(t('map.lockedHint', { n: n - 1 }), 'pink');
          SR.Audio.sfx('error');
          return;
        }
        if (n !== run.chapter) {
          SR.UI.toast(t('map.chapterDone'), 'gold');
          return;
        }
        SR.App.startStoryBattle();
        return;
      }
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;
      SR.Audio.sfx('select');
      switch (act) {
        case 'battle': SR.App.startStoryBattle(); break;
        case 'party': SR.App.go('party'); break;
        case 'shop': SR.App.go('shop'); break;
        case 'trials': SR.App.go('trials'); break;
        case 'save': SR.UI.slotsModal('save'); break;
        case 'settings': SR.UI.settingsModal(); break;
        case 'rest': {
          if (run.flags.rested[run.chapter]) return;
          run.flags.rested[run.chapter] = true;
          SR.Progress.fullHeal(run);
          SR.Save.autosave();
          SR.Audio.sfx('heal');
          SR.UI.toast(t('map.restHealed'), 'gold');
          SR.App.refresh();
          break;
        }
      }
    });
  };

  /* ============================================================
     SHOP
     ============================================================ */
  let shopTab = 'items';

  Screens.shop = function () {
    const run = runNow();
    if (!run) return Screens.title();
    const restCost = SR.Shop.restCost(run);
    let body = '';
    if (shopTab === 'items') {
      body = `<div class="shop-grid">${Object.keys(D.items).map((id) => {
        const item = D.items[id];
        const count = run.inventory[id] || 0;
        return `<div class="shop-card">
          <div class="shop-card__top">
            <div class="shop-card__icon">${ITEM_ICONS[id] || '◈'}</div>
            <div><div class="shop-card__name">${esc(L(item.name))}</div><div class="shop-card__desc">${esc(L(item.desc))}</div></div>
          </div>
          <div class="shop-card__foot">
            <span class="price">${SR.fmt(item.price)} G <span class="muted tiny">· ×${count}</span></span>
            <button class="btn btn--xs ${run.gold >= item.price ? 'btn--primary' : ''}" data-buy-item="${id}" ${run.gold < item.price ? 'disabled' : ''}>${t('btn.buy')}</button>
          </div>
        </div>`;
      }).join('')}</div>`;
    } else if (shopTab === 'relics') {
      body = `<div class="shop-grid">${Object.keys(D.relics).map((id) => {
        const relic = D.relics[id];
        const owned = run.relics.includes(id);
        const awakened = run.awakened.includes(id);
        const equippedBy = Object.keys(run.equipped).filter((h) => run.equipped[h] === id);
        const canBuy = !owned && run.gold >= relic.price;
        const canAwaken = owned && !awakened && run.essence >= relic.essence;
        return `<div class="shop-card">
          <div class="shop-card__top">
            <div class="shop-card__icon">${RELIC_ICONS[id] || '✦'}</div>
            <div>
              <div class="shop-card__name">${esc(L(relic.name))} ${awakened ? `<span class="tag tag--gold">${t('shop.awakened')}</span>` : ''}</div>
              <div class="shop-card__desc">${esc(L(relic.desc))}</div>
              ${equippedBy.length ? `<div class="tiny muted" style="margin-top:.2rem">${t('shop.equipped')}: ${equippedBy.map((h) => esc(L(heroOf(h).name))).join(', ')}</div>` : ''}
            </div>
          </div>
          <div class="shop-card__foot">
            <span class="price">${owned ? (awakened ? '✓' : `✦ ${relic.essence}`) : `${SR.fmt(relic.price)} G`}</span>
            ${owned
              ? `<button class="btn btn--xs ${canAwaken ? 'btn--gold' : ''}" data-awaken="${id}" ${awakened || !canAwaken ? 'disabled' : ''}>${awakened ? t('shop.awakened') : t('shop.awaken')}</button>`
              : `<button class="btn btn--xs ${canBuy ? 'btn--primary' : ''}" data-buy-relic="${id}" ${canBuy ? '' : 'disabled'}>${t('btn.buy')}</button>`}
          </div>
        </div>`;
      }).join('')}</div>`;
    } else {
      body = `<div class="upgrade-grid">${D.upgrades.map((up) => {
        const lvl = SR.Save.meta.upgrades[up.id] || 0;
        const cost = lvl < up.max ? up.costs[lvl] : null;
        return `<div class="upgrade-card">
          <div class="upgrade-card__top">
            <span class="upgrade-card__name">${up.icon} ${t(up.name)}</span>
            <span class="upgrade-card__icon">${t('trials.level', { n: lvl, max: up.max })}</span>
          </div>
          <p class="upgrade-card__desc">${t(up.desc)}</p>
          <div class="pips">${Array.from({ length: up.max }, (_, i) => `<span class="pip ${i < lvl ? 'is-on' : ''}"></span>`).join('')}</div>
          <button class="btn btn--xs ${cost && SR.Save.meta.embers >= cost ? 'btn--primary' : ''}" data-buy-upgrade="${up.id}" ${!cost || SR.Save.meta.embers < cost ? 'disabled' : ''}>
            ${cost ? t('trials.cost', { n: cost }) : t('shop.max')}
          </button>
        </div>`;
      }).join('')}</div>`;
    }

    return `<section class="screen shop-screen">
      ${SR.UI.topbar({
        title: t('shop.title'),
        eyebrow: t('shop.subtitle'),
        run,
        actions: [{ act: 'map', label: t('btn.map'), icon: '⛩' }]
      })}
      <div class="row row--between row--wrap">
        <div class="tabs">
          <button data-tab="items" class="${shopTab === 'items' ? 'is-on' : ''}">${t('shop.items')}</button>
          <button data-tab="relics" class="${shopTab === 'relics' ? 'is-on' : ''}">${t('shop.relics')}</button>
          <button data-tab="upgrades" class="${shopTab === 'upgrades' ? 'is-on' : ''}">${t('shop.upgrades')}</button>
        </div>
        <div class="row">
          <span class="pill pill--gold">✦ ${SR.fmt(SR.Save.meta.embers)} ${t('hud.embers')}</span>
        </div>
      </div>
      <div class="panel panel--tight row row--between row--wrap">
        <div>
          <div class="h3">${t('shop.rest')}</div>
          <div class="tiny muted">${t('shop.restDesc')} · ${t('shop.restCost', { n: restCost })}</div>
        </div>
        <button class="btn btn--sm ${run.gold >= restCost ? 'btn--gold' : ''}" data-act="rest" ${run.gold < restCost ? 'disabled' : ''}>✚ ${t('btn.rest')}</button>
      </div>
      ${body}
      <p class="center muted tiny" style="margin-top:1rem">${t('map.essenceHint')}</p>
    </section>`;
  };

  Screens.mountShop = function (root) {
    const run = runNow();
    if (!run) return;
    root.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (tab) { shopTab = tab.dataset.tab; SR.Audio.sfx('select'); SR.App.refresh(); return; }
      const itemBtn = e.target.closest('[data-buy-item]');
      if (itemBtn) {
        const id = itemBtn.dataset.buyItem;
        if (SR.Shop.buyItem(run, id)) {
          SR.Audio.sfx('buy');
          SR.UI.toast(t('shop.bought', { name: L(D.items[id].name) }), 'gold');
          SR.App.refresh();
        } else {
          SR.UI.toast(t('shop.noGold'), 'pink');
          SR.Audio.sfx('error');
        }
        return;
      }
      const relicBtn = e.target.closest('[data-buy-relic]');
      if (relicBtn) {
        const id = relicBtn.dataset.buyRelic;
        if (SR.Shop.buyRelic(run, id)) {
          SR.Audio.sfx('buy');
          SR.UI.toast(t('shop.bought', { name: L(D.relics[id].name) }), 'gold');
          SR.App.refresh();
        } else {
          SR.UI.toast(t('shop.noGold'), 'pink');
          SR.Audio.sfx('error');
        }
        return;
      }
      const awakenBtn = e.target.closest('[data-awaken]');
      if (awakenBtn) {
        const id = awakenBtn.dataset.awaken;
        if (SR.Shop.awakenRelic(run, id)) {
          SR.Audio.sfx('levelup');
          SR.UI.toast(t('toast.relicAwakened', { name: L(D.relics[id].name) }), 'gold');
          SR.App.refresh();
        } else {
          SR.UI.toast(SR.lang === 'es' ? 'No tienes suficiente Esencia.' : 'Not enough Essence.', 'pink');
          SR.Audio.sfx('error');
        }
        return;
      }
      const upBtn = e.target.closest('[data-buy-upgrade]');
      if (upBtn) {
        if (SR.Shop.buyUpgrade(upBtn.dataset.buyUpgrade)) {
          SR.Audio.sfx('buy');
          SR.UI.toast(t('shop.bought', { name: t(D.upgrades.find((u) => u.id === upBtn.dataset.buyUpgrade).name) }), 'gold');
          SR.App.refresh();
        } else {
          SR.UI.toast(t('shop.noEmbers'), 'pink');
          SR.Audio.sfx('error');
        }
        return;
      }
      const act = e.target.closest('[data-act]');
      if (act) {
        if (act.dataset.act === 'map') SR.App.go('map');
        if (act.dataset.act === 'rest') {
          if (SR.Shop.rest(run)) {
            SR.Audio.sfx('heal');
            SR.UI.toast(t('shop.restDone'), 'gold');
            SR.App.refresh();
          } else {
            SR.UI.toast(t('shop.noGold'), 'pink');
            SR.Audio.sfx('error');
          }
        }
      }
    });
  };

  /* ============================================================
     PARTY
     ============================================================ */
  Screens.party = function () {
    const run = runNow();
    if (!run) return Screens.title();
    const supporter = SR.Premium.isActive();
    const cards = run.party.map((rh) => {
      const hero = heroOf(rh.id);
      const st = SR.Progress.maxOf(run, rh);
      const relicId = run.equipped[rh.id];
      const relic = relicId ? D.relics[relicId] : null;
      const hp = rh.hp == null ? st.maxHp : rh.hp;
      const sp = rh.sp == null ? st.maxSp : rh.sp;
      const skills = hero.skills.map((s) => {
        const locked = s.unlock > rh.level;
        return `<div class="skill-row" style="${locked ? 'opacity:.45' : ''}">
          <div class="skill-row__icon">${SR.UI.elementIcon(s.element)}</div>
          <div style="flex:1;min-width:0">
            <div class="skill-row__name"><span style="color:var(--ink)">${esc(L(s.name))} ${locked ? `🔒 ${t('hud.level', { n: s.unlock })}` : ''}</span><span>${s.sp} SP</span></div>
            <div class="skill-row__desc">${esc(L(s.desc))}</div>
          </div>
        </div>`;
      }).join('');
      const ult = `<div class="skill-row" style="border-top:1px solid rgba(178,140,255,.2);margin-top:.2rem;padding-top:.4rem">
        <div class="skill-row__icon" style="background:rgba(178,140,255,.15)">✦</div>
        <div style="flex:1;min-width:0">
          <div class="skill-row__name"><span style="color:#d9c8ff">${esc(L(hero.ult.name))}</span><span>100 RES</span></div>
          <div class="skill-row__desc">${esc(L(hero.ult.desc))}</div>
        </div>
      </div>`;
      return `<article class="panel hero-card">
        <div class="hero-card__head">
          <div class="hero-card__portrait">${SR.Art.hero(rh.id, { moonlight: run.flags.moonlight })}</div>
          <div class="hero-card__id">
            <span class="eyebrow">${esc(L(hero.title))}</span>
            <h3>${esc(L(hero.name))}</h3>
            <div class="row" style="gap:.3rem;margin-top:.2rem">${SR.UI.element(hero.element)}<span class="pill">${t('hud.level', { n: rh.level })}</span></div>
            <p class="hero-card__quote">“${esc(L(hero.quote))}”</p>
          </div>
        </div>
        <div class="hero-card__body">
          <div class="stat-grid">
            <div class="stat"><b>${t('party.hp')}</b><span>${hp}/${st.maxHp}</span></div>
            <div class="stat"><b>${t('party.sp')}</b><span>${sp}/${st.maxSp}</span></div>
            <div class="stat"><b>${t('party.atk')}</b><span>${Math.round(st.atk)}</span></div>
            <div class="stat"><b>${t('party.def')}</b><span>${Math.round(st.def)}</span></div>
            <div class="stat"><b>${t('party.spd')}</b><span>${Math.round(st.spd)}</span></div>
            <div class="stat"><b>${t('party.crit')}</b><span>${Math.round(st.crit * 100)}%</span></div>
          </div>
          <div>
            <div class="panel__head" style="margin-bottom:.2rem"><span class="eyebrow">${t('party.relic')}</span><button class="btn btn--xs" data-relic-hero="${rh.id}">${relic ? t('btn.unequip') : t('btn.equip')}</button></div>
            <div class="relic-slot">
              <div class="relic-slot__icon">${relic ? (RELIC_ICONS[relicId] || '✦') : '◇'}</div>
              <div style="flex:1;min-width:0">
                <div class="relic-slot__name">${relic ? esc(L(relic.name)) : t('party.noRelic')}</div>
                <div class="relic-slot__desc">${relic ? esc(L(relic.desc)) : t('party.relicBonus')}</div>
              </div>
            </div>
          </div>
          <div>
            <div class="panel__head" style="margin-bottom:.2rem"><span class="eyebrow">${t('party.skills')}</span><span class="tiny muted">${t('party.passive')}: ${esc(L(hero.passive.name))}</span></div>
            ${skills}
            ${ult}
          </div>
          <div>
            <div class="panel__head" style="margin-bottom:.2rem"><span class="eyebrow">${t('party.boons')}</span></div>
            ${rh.boons.length ? `<div class="boon-list">${rh.boons.map((b) => `<span class="boon-chip">${BOON_ICONS[b] || '✦'} ${esc(L(D.boons[b].name))}</span>`).join('')}</div>` : `<p class="tiny muted">${t('party.noBoons')}</p>`}
          </div>
        </div>
      </article>`;
    }).join('');

    return `<section class="screen party-screen">
      ${SR.UI.topbar({
        title: t('party.title'),
        eyebrow: t('party.subtitle'),
        run,
        actions: [{ act: 'map', label: t('btn.map'), icon: '⛩' }]
      })}
      ${supporter ? `<div class="row row--between row--wrap">
        <span class="tag tag--gold">✦ ${t('support.active')}</span>
        <div class="row">
          <button class="btn btn--sm ${run.flags.moonlight ? 'btn--primary' : ''}" data-act="moonlight">🌙 ${SR.lang === 'es' ? 'Trajes de luz de luna' : 'Moonlight costumes'}</button>
          <button class="btn btn--sm" data-act="artcard">✧ ${SR.lang === 'es' ? 'Carta de arte' : 'Art card'}</button>
        </div>
      </div>` : ''}
      <div class="hero-grid">${cards}</div>
      <div class="row" style="margin-top:1rem;justify-content:center">
        <button class="btn btn--sm" data-act="map">${t('party.close')}</button>
      </div>
    </section>`;
  };

  Screens.mountParty = function (root) {
    const run = runNow();
    if (!run) return;
    root.addEventListener('click', (e) => {
      const relicBtn = e.target.closest('[data-relic-hero]');
      if (relicBtn) {
        const heroId = relicBtn.dataset.relicHero;
        const hero = heroOf(heroId);
        const current = run.equipped[heroId];
        const options = run.relics.map((id) => {
          const r = D.relics[id];
          return `<button class="relic-option ${current === id ? 'is-on' : ''}" data-pick="${id}">
            <span style="font-size:1.1rem">${RELIC_ICONS[id] || '✦'}</span>
            <span style="flex:1"><span class="relic-slot__name">${esc(L(r.name))}</span><span class="relic-slot__desc">${esc(L(r.desc))}</span></span>
            ${current === id ? '✓' : ''}
          </button>`;
        }).join('');
        SR.UI.modal({
          title: t('party.chooseRelic', { name: L(hero.name) }),
          body: `<div class="relic-pick">
            ${run.relics.length ? options : `<p class="muted small">${t('party.noRelics')}</p>`}
            <button class="relic-option" data-pick=""><span>◇</span><span style="flex:1"><span class="relic-slot__name">${t('party.noRelic')}</span></span>${current ? '' : '✓'}</button>
          </div>`,
          onMount: (wrap, close) => {
            wrap.querySelectorAll('[data-pick]').forEach((btn) => {
              btn.addEventListener('click', () => {
                run.equipped[heroId] = btn.dataset.pick || null;
                SR.Progress.sync(run);
                SR.Save.autosave();
                close();
                SR.Audio.sfx('select');
                SR.App.refresh();
              });
            });
          }
        });
        return;
      }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      if (act.dataset.act === 'map') SR.App.go('map');
      if (act.dataset.act === 'moonlight') {
        run.flags.moonlight = !run.flags.moonlight;
        SR.Save.autosave();
        SR.UI.toast(run.flags.moonlight ? t('toast.premium') : (SR.lang === 'es' ? 'Trajes originales.' : 'Original costumes.'), 'gold');
        SR.App.refresh();
      }
      if (act.dataset.act === 'artcard') Screens.artCardModal();
    });
  };

  Screens.artCardModal = function () {
    const run = runNow();
    const body = `<div class="art-card" style="text-align:center">
      <div class="row" style="justify-content:center;align-items:flex-end;gap:0;margin:-.4rem -1rem .6rem">
        ${D.heroes.map((h) => `<div style="width:33%;max-width:180px">${SR.Art.hero(h.id, { moonlight: true })}</div>`).join('')}
      </div>
      <div class="eyebrow">${t('meta.subtitle')}</div>
      <h2 class="h1" style="margin:.2rem 0 .4rem">SAKURA REQUIEM</h2>
      <p class="serif muted" style="font-size:.8rem">${t('support.thanks')}</p>
      <p class="tiny muted" style="margin-top:.6rem">✦ ${t('support.active')} · ${run ? t('slots.playtime', { h: Math.floor(run.playtime / 3600), m: Math.floor((run.playtime % 3600) / 60) }) : ''}</p>
    </div>`;
    SR.UI.modal({ title: SR.lang === 'es' ? 'Carta de arte' : 'Art card', body, wide: true });
  };

  /* ============================================================
     TRIALS
     ============================================================ */
  Screens.trials = function () {
    const run = runNow();
    if (!run) return Screens.title();
    if (!run.trialsUnlocked) {
      SR.UI.toast(t('map.trialsLocked'), 'pink');
      return Screens.worldmap();
    }
    const upgrades = D.upgrades.map((up) => {
      const lvl = SR.Save.meta.upgrades[up.id] || 0;
      const cost = lvl < up.max ? up.costs[lvl] : null;
      return `<div class="upgrade-card">
        <div class="upgrade-card__top">
          <span class="upgrade-card__name">${up.icon} ${t(up.name)}</span>
          <span class="upgrade-card__icon">${t('trials.level', { n: lvl, max: up.max })}</span>
        </div>
        <p class="upgrade-card__desc">${t(up.desc)}</p>
        <div class="pips">${Array.from({ length: up.max }, (_, i) => `<span class="pip ${i < lvl ? 'is-on' : ''}"></span>`).join('')}</div>
        <button class="btn btn--xs ${cost && SR.Save.meta.embers >= cost ? 'btn--primary' : ''}" data-buy-upgrade="${up.id}" ${!cost || SR.Save.meta.embers < cost ? 'disabled' : ''}>
          ${cost ? t('trials.cost', { n: cost }) : t('shop.max')}
        </button>
      </div>`;
    }).join('');

    return `<section class="screen trials-screen">
      ${SR.UI.topbar({
        title: t('trials.title'),
        eyebrow: t('trials.subtitle'),
        run,
        actions: [{ act: 'map', label: t('btn.map'), icon: '⛩' }]
      })}
      <div class="panel" style="border-color:rgba(178,140,255,.3)">
        <div class="row row--between row--wrap">
          <div>
            <div class="row"><span class="tag tag--muted">${t('trials.best', { n: SR.Save.meta.bestWave || 0 })}</span><span class="pill pill--violet">✺ ${SR.fmt(SR.Save.meta.embers)} ${t('hud.embers')}</span></div>
            <p class="muted small" style="margin-top:.5rem;line-height:1.6;max-width:640px">${t('trials.desc')}</p>
          </div>
          <button class="btn btn--primary" data-act="start">✦ ${t('trials.start')}</button>
        </div>
      </div>
      <div class="panel">
        <div class="panel__head"><span class="panel__title">${t('trials.upgrades')}</span><span class="tiny muted">${t('trials.upgradesHint')}</span></div>
        <div class="upgrade-grid">${upgrades}</div>
      </div>
      <div class="row" style="justify-content:center;margin-top:.4rem">
        <button class="btn btn--sm" data-act="map">${t('btn.map')}</button>
      </div>
    </section>`;
  };

  Screens.mountTrials = function (root) {
    root.addEventListener('click', (e) => {
      const up = e.target.closest('[data-buy-upgrade]');
      if (up) {
        if (SR.Shop.buyUpgrade(up.dataset.buyUpgrade)) {
          SR.Audio.sfx('buy');
          SR.App.refresh();
        } else {
          SR.UI.toast(t('shop.noEmbers'), 'pink');
          SR.Audio.sfx('error');
        }
        return;
      }
      const act = e.target.closest('[data-act]');
      if (!act) return;
      if (act.dataset.act === 'map') SR.App.go('map');
      if (act.dataset.act === 'start') SR.App.startTrials();
    });
  };

  /* ============================================================
     DIALOGUE
     ============================================================ */
  let DLG = null;

  Screens.dialogue = function (opts) {
    DLG = { opts, i: 0, typing: false, timer: null, done: false, keyHandler: null };
    const ch = opts.chapter ? D.chapters[opts.chapter - 1] : null;
    const scene = opts.scene || (ch ? ch.bg : 'shrine');
    return `<section class="screen dialogue-screen">
      <div class="dialogue-bg">${SR.Art.scene(scene)}</div>
      <div class="dialogue-chapter">
        <span class="eyebrow">${opts.ending ? t('dialogue.ending') : t('dialogue.chapter', { n: opts.chapter || 1 })}</span>
        <h2 class="h2 serif">${ch ? esc(L(ch.name)) : ''}</h2>
      </div>
      <button class="btn btn--sm btn--ghost" data-skip style="position:absolute;top:16px;right:16px;z-index:6">${t('btn.skip')} ⏭</button>
      <div class="dialogue-stage">
        <div class="dialogue-portrait" id="dlg-portrait"></div>
      </div>
      <div class="dialogue-box" id="dlg-box" role="button" tabindex="0">
        <div class="dialogue-speaker">
          <h3 id="dlg-speaker"></h3>
          <span class="line"></span>
          <span id="dlg-el"></span>
        </div>
        <div class="dialogue-text" id="dlg-text"></div>
        <div class="dialogue-controls">
          <span class="dialogue-hint">${t('dialogue.tap')}</span>
          <div class="dialogue-actions">
            <button class="btn btn--sm btn--primary" data-next>${t('btn.next')}</button>
          </div>
        </div>
      </div>
    </section>`;
  };

  Screens.mountDialogue = function (root, opts) {
    if (!DLG) return;
    const state = DLG;
    const portrait = root.querySelector('#dlg-portrait');
    const speakerEl = root.querySelector('#dlg-speaker');
    const elEl = root.querySelector('#dlg-el');
    const textEl = root.querySelector('#dlg-text');
    const nextBtn = root.querySelector('[data-next]');
    const speedMap = { slow: 28, normal: 15, fast: 6 };
    const speed = speedMap[SR.Save.settings.speed] || 15;

    function stopTyping() {
      if (state.timer) clearInterval(state.timer);
      state.timer = null;
      state.typing = false;
    }

    function completeLine() {
      stopTyping();
      textEl.textContent = state.full;
      state.typing = false;
    }

    function showLine() {
      const line = opts.lines[state.i];
      if (!line) return finish();
      const sp = D.speakers[line.s] || {};
      const name = sp.name ? L(sp.name) : '';
      speakerEl.textContent = name || (opts.ending ? '' : '');
      const heroData = sp.hero ? heroOf(sp.hero) : null;
      const enemyData = sp.enemy ? D.enemies[sp.enemy] : null;
      if (heroData) {
        elEl.innerHTML = SR.UI.element(heroData.element);
      } else if (enemyData) {
        elEl.innerHTML = SR.UI.element(enemyData.element);
      } else {
        elEl.innerHTML = '';
      }
      if (sp.hero) {
        portrait.className = 'dialogue-portrait';
        portrait.style.display = '';
        portrait.innerHTML = SR.Art.hero(sp.hero, { moonlight: SR.Save.current() && SR.Save.current().flags.moonlight });
        void portrait.offsetWidth;
        portrait.classList.add('is-on');
      } else if (sp.enemy) {
        portrait.className = 'dialogue-portrait dialogue-portrait--enemy';
        portrait.style.display = '';
        portrait.innerHTML = SR.Art.enemy(sp.enemy);
        void portrait.offsetWidth;
        portrait.classList.add('is-on');
      } else {
        portrait.className = 'dialogue-portrait';
        portrait.style.display = 'none';
        portrait.innerHTML = '';
      }
      state.full = L(line.t);
      textEl.textContent = '';
      state.typing = true;
      let idx = 0;
      state.timer = setInterval(() => {
        idx += 1;
        textEl.textContent = state.full.slice(0, idx);
        if (idx >= state.full.length) {
          stopTyping();
          textEl.textContent = state.full;
        }
      }, speed);
      nextBtn.textContent = state.i >= opts.lines.length - 1
        ? (opts.ending ? t('dialogue.continue') : t('dialogue.continue'))
        : t('btn.next');
    }

    function advance() {
      if (state.done) return;
      if (state.typing) { completeLine(); return; }
      state.i += 1;
      if (state.i >= opts.lines.length) finish();
      else { SR.Audio.sfx('petal'); showLine(); }
    }

    function finish() {
      if (state.done) return;
      state.done = true;
      stopTyping();
      if (state.keyHandler) document.removeEventListener('keydown', state.keyHandler);
      DLG = null;
      if (opts.onDone) opts.onDone();
    }

    root.querySelector('#dlg-box').addEventListener('click', advance);
    root.querySelector('[data-skip]').addEventListener('click', (e) => {
      e.stopPropagation();
      finish();
    });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); advance(); });
    state.keyHandler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); advance(); }
      else if (e.key === 'Escape') { finish(); }
    };
    document.addEventListener('keydown', state.keyHandler);
    showLine();
  };

  /* ============================================================
     RESULTS
     ============================================================ */
  Screens.showResult = function (opts) {
    const run = runNow();
    const rewards = opts.rewards || {};
    const pending = (opts.levels || []).slice();
    let current = pending.shift();
    let options = null;
    let boonIndex = 0;

    const rewardHTML = opts.victory ? `<div class="reward-row">
      <div class="reward"><b>${SR.fmt(rewards.xp || 0)}</b><span>${t('result.xp')}</span></div>
      <div class="reward"><b>${SR.fmt(rewards.gold || 0)}</b><span>${t('result.gold')}</span></div>
      ${rewards.essence ? `<div class="reward"><b>${SR.fmt(rewards.essence)}</b><span>${t('hud.essence')}</span></div>` : ''}
    </div>` : '';

    const levelHTML = (opts.levels && opts.levels.length)
      ? `<div class="levelup-list">${opts.levels.map((l) => `<div class="levelup-line">✦ <b>${esc(L(heroOf(l.heroId).name))}</b> — ${t('hud.level', { n: l.level })}</div>`).join('')}</div>`
      : '';
    const skillHTML = (opts.unlockedSkills && opts.unlockedSkills.length)
      ? `<div class="levelup-list">${opts.unlockedSkills.map((s) => `<div class="levelup-line">❀ ${t('result.newSkill', { name: esc(L(s.skill.name)) })}</div>`).join('')}</div>`
      : '';
    const relicHTML = opts.relic ? `<p class="small" style="margin:.4rem 0"><span class="tag tag--gold">${t('result.relicFound', { name: esc(L(D.relics[opts.relic].name)) })}</span></p>` : '';

    const body = `<div class="result-panel">
      <div class="result-badge">${opts.victory ? '✿' : '✧'}</div>
      <h2 class="result-title">${opts.victory ? t('result.victory') : t('result.defeat')}</h2>
      <p class="result-sub">${opts.subtitle || ''}</p>
      ${rewardHTML}
      ${levelHTML}
      ${skillHTML}
      ${relicHTML}
      <div id="boon-area"></div>
      ${SR.config.ads.enabled && SR.config.ads.showOnResults && SR.config.ads.slotHtml ? `<div class="ad-slot">${SR.config.ads.slotHtml}</div>` : ''}
    </div>`;

    const wrap = SR.UI.modal({
      hideHead: true,
      closeable: false,
      wide: true,
      body,
      foot: `<button class="btn btn--primary" data-continue>${t('result.continue')}</button>`,
      onMount: (w, close) => {
        const continueBtn = w.querySelector('[data-continue]');
        const area = w.querySelector('#boon-area');

        function renderBoon() {
          if (!current) {
            area.innerHTML = '';
            continueBtn.disabled = false;
            return;
          }
          const hero = heroOf(current.heroId);
          options = SR.Progress.randomBoons(run, current.heroId, 3);
          if (!options.length) { current = pending.shift(); renderBoon(); return; }
          area.innerHTML = `<div style="margin-top:.8rem">
            <div class="row" style="justify-content:center;gap:.6rem">
              <div style="width:44px;height:54px;border-radius:9px;overflow:hidden;border:1px solid var(--line)">${SR.Art.hero(hero.id, { moonlight: run.flags.moonlight })}</div>
              <div style="text-align:left"><div class="eyebrow">${t('result.boon')}</div><div class="h3">${esc(L(hero.name))} · ${t('hud.level', { n: current.level })}</div></div>
            </div>
            <p class="tiny muted center" style="margin:.35rem 0 .5rem">${t('result.boonHint')}</p>
            <div class="boon-grid">${options.map((b) => `<button class="boon-card" data-boon="${b}">
              <span class="boon-card__icon">${BOON_ICONS[b] || '✦'}</span>
              <h4>${esc(L(D.boons[b].name))}</h4>
              <p>${esc(L(D.boons[b].desc))}</p>
            </button>`).join('')}</div>
          </div>`;
          area.querySelectorAll('[data-boon]').forEach((btn) => {
            btn.addEventListener('click', () => {
              SR.Progress.addBoon(run, current.heroId, btn.dataset.boon);
              SR.Save.autosave();
              SR.Audio.sfx('levelup');
              SR.UI.toast(t('toast.boon', { name: L(D.boons[btn.dataset.boon].name) }), 'gold');
              current = pending.shift();
              renderBoon();
            });
          });
        }

        continueBtn.disabled = !!current;
        renderBoon();
        continueBtn.addEventListener('click', () => {
          close();
          if (opts.onContinue) opts.onContinue();
        });
      }
    });
    return wrap;
  };

  Screens.showDefeat = function (opts) {
    const body = `<div class="result-panel">
      <div class="result-badge">✧</div>
      <h2 class="result-title">${t('result.defeat')}</h2>
      <p class="result-sub">${t('result.defeatHint')}</p>
    </div>`;
    return SR.UI.modal({
      hideHead: true,
      closeable: false,
      small: true,
      body,
      foot: `<button class="btn btn--ghost" data-map>${t('result.retreat')}</button>
             <button class="btn btn--primary" data-retry>${t('result.retry')}</button>`,
      onMount: (w, close) => {
        w.querySelector('[data-retry]').addEventListener('click', () => { close(); opts.onRetry(); });
        w.querySelector('[data-map]').addEventListener('click', () => { close(); opts.onMap(); });
      }
    });
  };

  Screens.showTrialsResult = function (opts) {
    const body = `<div class="result-panel">
      <div class="result-badge">${opts.victory ? '✺' : '✧'}</div>
      <h2 class="result-title" style="font-size:2.4rem">${opts.victory ? t('result.trials') : t('result.defeat')}</h2>
      <p class="result-sub">${t('result.wave', { n: opts.wave })}</p>
      <div class="reward-row">
        <div class="reward"><b>+${SR.fmt(opts.embers)}</b><span>${t('hud.embers')}</span></div>
        ${opts.best ? `<div class="reward"><b>★</b><span>${t('result.best')}</span></div>` : ''}
      </div>
      <p class="tiny muted">${t('trials.reward', { n: opts.embers })}</p>
    </div>`;
    return SR.UI.modal({
      hideHead: true,
      closeable: false,
      small: true,
      body,
      foot: opts.victory
        ? `<button class="btn btn--ghost" data-leave>${t('trials.exit')}</button>
           <button class="btn btn--primary" data-next>${t('trials.start')}</button>`
        : `<button class="btn btn--primary" data-leave>${t('btn.continue')}</button>`,
      onMount: (w, close) => {
        const next = w.querySelector('[data-next]');
        if (next) next.addEventListener('click', () => { close(); opts.onNext(); });
        w.querySelector('[data-leave]').addEventListener('click', () => { close(); opts.onLeave(); });
      }
    });
  };

  /* ============================================================
     ENDING
     ============================================================ */
  Screens.ending = function () {
    const run = runNow();
    const h = run ? Math.floor(run.playtime / 3600) : 0;
    const m = run ? Math.floor((run.playtime % 3600) / 60) : 0;
    return `<section class="screen screen--center" style="justify-content:center;text-align:center;gap:1rem">
      <div class="title-scene">${SR.Art.scene('hollow')}</div>
      <div style="position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:.6rem;max-width:760px">
        <div style="width:64px;color:var(--pink-2)">${SR.Art.logoMark()}</div>
        <span class="eyebrow">${t('dialogue.ending')}</span>
        <h1 class="logo__title" style="font-size:clamp(2.4rem,7vw,4.6rem)">SAKURA<em>REQUIEM</em></h1>
        <p class="serif" style="color:#f0dce9;font-size:1.05rem;line-height:1.7">${t('credits.thanks')}</p>
        <div class="row" style="justify-content:center;margin:.6rem 0;align-items:flex-end">
          ${D.heroes.map((h2) => `<div style="width:110px">${SR.Art.hero(h2.id, { moonlight: run && run.flags.moonlight })}</div>`).join('')}
        </div>
        <div class="row" style="justify-content:center;flex-wrap:wrap">
          <span class="pill">${t('slots.playtime', { h, m })}</span>
          <span class="pill pill--violet">${t('trials.best', { n: SR.Save.meta.bestWave || 0 })}</span>
          <span class="pill pill--gold">✺ ${SR.fmt(SR.Save.meta.embers)}</span>
        </div>
        <div class="row" style="justify-content:center;flex-wrap:wrap;margin-top:.6rem">
          <button class="btn btn--primary" data-act="map">${t('btn.continue')}</button>
          <button class="btn" data-act="support">${t('btn.support')}</button>
          <button class="btn btn--ghost" data-act="new">${t('btn.newGame')}</button>
        </div>
      </div>
    </section>`;
  };

  Screens.mountEnding = function (root) {
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      SR.Audio.sfx('select');
      if (btn.dataset.act === 'map') SR.App.go('map');
      if (btn.dataset.act === 'support') SR.UI.supportModal();
      if (btn.dataset.act === 'new') SR.UI.slotsModal('new');
    });
  };
})();
