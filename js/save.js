/* Sakura Requiem — saves, settings, progression, meta and supporter pack */
window.SR = window.SR || {};

(function () {
  const KEY_SAVES = 'sr.saves.v1';
  const KEY_META = 'sr.meta.v1';
  const KEY_SETTINGS = 'sr.settings.v1';

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; }
  }

  const DEFAULT_SETTINGS = {
    music: 0.55, sfx: 0.7, motion: false, speed: 'normal', autoBattle: false
  };
  const DEFAULT_META = {
    embers: 0,
    upgrades: { vitality: 0, might: 0, fortune: 0, wisdom: 0, resonance: 0 },
    bestWave: 0,
    supporter: false,
    supporterCode: null,
    runs: 0,
    endings: 0
  };

  const Save = {};
  SR.Save = Save;

  Save.settings = Object.assign({}, DEFAULT_SETTINGS, read(KEY_SETTINGS, {}));
  Save.meta = Object.assign({}, DEFAULT_META, read(KEY_META, {}));
  Save.meta.upgrades = Object.assign({}, DEFAULT_META.upgrades, Save.meta.upgrades || {});
  const storedSlots = read(KEY_SAVES, [null, null, null]);
  Save.slots = [0, 1, 2].map((i) => (storedSlots && storedSlots[i] ? normalizeRun(storedSlots[i]) : null));
  Save.currentSlot = -1;

  function normalizeRun(run) {
    if (!run || !Array.isArray(run.party)) return null;
    run.v = 1;
    run.createdAt = run.createdAt || Date.now();
    run.updatedAt = run.updatedAt || Date.now();
    run.playtime = run.playtime || 0;
    run.chapter = Math.min(6, Math.max(1, run.chapter || 1));
    run.unlocked = Math.min(6, Math.max(1, run.unlocked || 1));
    run.battleIndex = Math.max(0, Math.min(4, run.battleIndex || 0));
    run.cleared = Array.isArray(run.cleared) ? run.cleared : [];
    run.gold = Math.max(0, run.gold || 0);
    run.essence = Math.max(0, run.essence || 0);
    run.party = run.party.filter((p) => p && p.id).map((p) => ({
      id: p.id,
      level: Math.max(1, Math.min(30, p.level || 1)),
      xp: Math.max(0, p.xp || 0),
      hp: p.hp === undefined ? null : p.hp,
      sp: p.sp === undefined ? null : p.sp,
      boons: Array.isArray(p.boons) ? p.boons.filter((b) => SR.DATA.boons[b]) : [],
      relic: p.relic || null
    }));
    if (!run.party.length) {
      run.party = SR.DATA.heroes.map((h) => ({ id: h.id, level: 1, xp: 0, hp: null, sp: null, boons: [], relic: null }));
    }
    run.inventory = run.inventory && typeof run.inventory === 'object' ? run.inventory : {};
    Object.keys(run.inventory).forEach((k) => {
      if (!SR.DATA.items[k]) delete run.inventory[k];
      else run.inventory[k] = Math.max(0, Math.floor(run.inventory[k]));
    });
    run.relics = Array.isArray(run.relics) ? run.relics.filter((r) => SR.DATA.relics[r]) : [];
    run.awakened = Array.isArray(run.awakened) ? run.awakened.filter((r) => run.relics.includes(r)) : [];
    run.equipped = run.equipped || {};
    run.flags = run.flags || {};
    run.flags.rested = run.flags.rested || {};
    run.trialsUnlocked = run.trialsUnlocked || run.unlocked >= 4 || run.cleared.includes(3);
    run.endingSeen = !!run.endingSeen;
    return run;
  }
  Save.normalizeRun = normalizeRun;

  Save.persist = function () {
    write(KEY_SAVES, Save.slots);
    write(KEY_META, Save.meta);
    write(KEY_SETTINGS, Save.settings);
  };

  Save.setSetting = function (key, value) {
    Save.settings[key] = value;
    write(KEY_SETTINGS, Save.settings);
  };

  Save.current = function () {
    if (Save.currentSlot < 0 || Save.currentSlot > 2) return null;
    return Save.slots[Save.currentSlot];
  };

  Save.createRun = function () {
    return {
      v: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      playtime: 0,
      chapter: 1,
      battleIndex: 0,
      unlocked: 1,
      cleared: [],
      gold: 120,
      essence: 0,
      party: SR.DATA.heroes.map((h) => ({ id: h.id, level: 1, xp: 0, hp: null, sp: null, boons: [], relic: null })),
      inventory: { onigiri: 3, sake: 1, petalRevive: 1 },
      relics: [],
      equipped: { hana: null, yuki: null, ren: null },
      awakened: [],
      flags: { rested: {} },
      trialsUnlocked: false,
      endingSeen: false
    };
  };

  Save.startRun = function (slot) {
    const run = Save.createRun();
    Save.slots[slot] = run;
    Save.currentSlot = slot;
    Save.meta.runs += 1;
    Save.persist();
    return run;
  };

  Save.loadSlot = function (slot) {
    const run = Save.slots[slot];
    if (!run) return null;
    Save.currentSlot = slot;
    return normalizeRun(run);
  };

  Save.writeSlot = function (slot, run) {
    run.updatedAt = Date.now();
    Save.slots[slot] = normalizeRun(run);
    Save.currentSlot = slot;
    Save.persist();
  };

  Save.autosave = function () {
    const run = Save.current();
    if (!run) return false;
    run.updatedAt = Date.now();
    Save.persist();
    return true;
  };

  Save.deleteSlot = function (slot) {
    Save.slots[slot] = null;
    if (Save.currentSlot === slot) Save.currentSlot = -1;
    Save.persist();
  };

  Save.mostRecent = function () {
    let best = -1;
    let ts = 0;
    Save.slots.forEach((run, i) => {
      if (run && run.updatedAt > ts) { ts = run.updatedAt; best = i; }
    });
    return best;
  };

  Save.tick = function (seconds) {
    const run = Save.current();
    if (!run) return;
    run.playtime = (run.playtime || 0) + seconds;
  };

  Save.addEmbers = function (n) {
    Save.meta.embers = Math.max(0, Save.meta.embers + n);
    write(KEY_META, Save.meta);
  };

  /* ---------- Save codes ---------- */
  function b64encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64decode(str) {
    const bin = atob(str);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  Save.exportCode = function (run) {
    const clean = normalizeRun(JSON.parse(JSON.stringify(run)));
    const json = JSON.stringify({ run: clean, meta: { embers: Save.meta.embers, upgrades: Save.meta.upgrades, bestWave: Save.meta.bestWave } });
    return 'SR1-' + b64encode(json);
  };

  Save.importCode = function (code, slot) {
    try {
      const trimmed = (code || '').trim();
      if (!trimmed.startsWith('SR1-')) return null;
      const parsed = JSON.parse(b64decode(trimmed.slice(4)));
      const run = normalizeRun(parsed.run);
      if (!run) return null;
      if (parsed.meta && typeof parsed.meta.embers === 'number') {
        Save.meta.embers = Math.max(Save.meta.embers, parsed.meta.embers);
        if (parsed.meta.upgrades) {
          Object.keys(Save.meta.upgrades).forEach((k) => {
            Save.meta.upgrades[k] = Math.max(Save.meta.upgrades[k] || 0, parsed.meta.upgrades[k] || 0);
          });
        }
        Save.meta.bestWave = Math.max(Save.meta.bestWave || 0, parsed.meta.bestWave || 0);
      }
      if (typeof slot === 'number') {
        Save.slots[slot] = run;
        Save.currentSlot = slot;
      }
      Save.persist();
      return run;
    } catch (e) { return null; }
  };

  /* ---------- Progression ---------- */
  const Progress = {};
  SR.Progress = Progress;

  Progress.heroOf = function (run, id) {
    return run.party.find((p) => p.id === id);
  };

  Progress.maxOf = function (run, rh) {
    const st = SR.Engine.heroStats(rh.id, rh, Save.meta, rh.relic, run.awakened && run.awakened.includes(rh.relic));
    return st;
  };

  Progress.sync = function (run) {
    if (!run) return;
    run.party.forEach((rh) => {
      const st = Progress.maxOf(run, rh);
      if (st) {
        rh.hp = rh.hp == null ? st.maxHp : Math.max(1, Math.min(st.maxHp, Math.round(rh.hp)));
        rh.sp = rh.sp == null ? st.maxSp : Math.max(0, Math.min(st.maxSp, Math.round(rh.sp)));
        if (rh.hp <= 0) rh.hp = 1;
      }
    });
    if (run.chapter < 1) run.chapter = 1;
  };

  Progress.fullHeal = function (run) {
    run.party.forEach((rh) => {
      const st = Progress.maxOf(run, rh);
      rh.hp = st.maxHp;
      rh.sp = st.maxSp;
    });
    return run;
  };

  Progress.gainXP = function (run, amount) {
    const levels = [];
    const unlocked = [];
    run.party.forEach((rh) => {
      rh.xp = (rh.xp || 0) + amount;
      let needed = SR.Engine.xpNeeded(rh.level);
      while (rh.xp >= needed && rh.level < 30) {
        rh.xp -= needed;
        rh.level += 1;
        levels.push({ heroId: rh.id, level: rh.level });
        const hero = SR.DATA.heroes.find((h) => h.id === rh.id);
        hero.skills.forEach((s) => {
          if (s.unlock === rh.level) unlocked.push({ heroId: rh.id, skill: s });
        });
        needed = SR.Engine.xpNeeded(rh.level);
      }
      const st = Progress.maxOf(run, rh);
      rh.hp = Math.min(st.maxHp, (rh.hp == null ? st.maxHp : rh.hp) + Math.round(st.maxHp * 0.2));
      rh.sp = st.maxSp;
    });
    return { levels, unlocked };
  };

  Progress.addBoon = function (run, heroId, boonId) {
    const rh = Progress.heroOf(run, heroId);
    if (!rh || !SR.DATA.boons[boonId] || rh.boons.includes(boonId)) return false;
    rh.boons.push(boonId);
    const st = Progress.maxOf(run, rh);
    if (st) {
      rh.hp = Math.min(st.maxHp, (rh.hp || st.maxHp) + 20);
      rh.sp = st.maxSp;
    }
    return true;
  };

  Progress.randomBoons = function (run, heroId, count) {
    const rh = Progress.heroOf(run, heroId);
    const pool = Object.keys(SR.DATA.boons).filter((b) => !rh.boons.includes(b));
    const out = [];
    while (out.length < (count || 3) && pool.length) {
      out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    }
    return out;
  };

  Progress.rewardFor = function (run, chapter, isBoss) {
    const c = SR.DATA.chapters[chapter - 1];
    const meta = Save.meta.upgrades || {};
    const xpMul = 1 + (meta.wisdom || 0) * 0.08;
    const goldMul = 1 + (meta.fortune || 0) * 0.1;
    if (isBoss) {
      return {
        xp: Math.round(c.rewards.xp * xpMul),
        gold: Math.round(c.rewards.gold * goldMul),
        essence: 2
      };
    }
    return {
      xp: Math.round((16 + chapter * 10) * xpMul),
      gold: Math.round((22 + chapter * 7) * goldMul),
      essence: 0
    };
  };

  Progress.grantRewards = function (run, rewards) {
    run.gold += rewards.gold || 0;
    run.essence += rewards.essence || 0;
    return Progress.gainXP(run, rewards.xp || 0);
  };

  Progress.rollRelic = function (run) {
    const pool = Object.keys(SR.DATA.relics).filter((r) => !run.relics.includes(r));
    if (!pool.length) return null;
    const id = pool[Math.floor(Math.random() * pool.length)];
    run.relics.push(id);
    return id;
  };

  Progress.advance = function (run, victory) {
    if (!victory) return { chapterAdvanced: false, ending: false };
    const chapter = SR.DATA.chapters[run.chapter - 1];
    const isBoss = run.battleIndex >= chapter.encounters.length;
    if (!isBoss) {
      run.battleIndex += 1;
      return { chapterAdvanced: false, ending: false, isBoss: false };
    }
    if (!run.cleared.includes(run.chapter)) run.cleared.push(run.chapter);
    if (run.chapter >= 6) {
      run.endingSeen = true;
      Save.meta.endings = (Save.meta.endings || 0) + 1;
      run.battleIndex = 0;
      return { chapterAdvanced: false, ending: true, isBoss: true };
    }
    run.chapter += 1;
    run.battleIndex = 0;
    run.unlocked = Math.max(run.unlocked, run.chapter);
    run.trialsUnlocked = true;
    Progress.fullHeal(run);
    return { chapterAdvanced: true, ending: false, isBoss: true, newChapter: run.chapter };
  };

  Progress.encounterFor = function (run) {
    const chapter = SR.DATA.chapters[run.chapter - 1];
    const isBoss = run.battleIndex >= chapter.encounters.length;
    if (isBoss) return { chapter, enemies: [chapter.boss], isBoss: true };
    return { chapter, enemies: chapter.encounters[run.battleIndex].slice(), isBoss: false };
  };

  Progress.trialsEnemies = function (wave) {
    const roster = ['wisp', 'wrapper', 'onibi', 'kitsune', 'monk', 'sentinel', 'courtier', 'mirror', 'drummer', 'spider'];
    const count = wave < 3 ? 2 : wave < 7 ? 3 : wave < 12 ? 3 : 3;
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(roster[Math.floor(Math.random() * roster.length)]);
    }
    if (wave % 5 === 0) list[0] = 'shogun';
    return list;
  };

  Progress.trialsReward = function (wave) {
    return {
      embers: 4 + wave * 2,
      gold: 20 + wave * 6,
      xp: Math.round(18 + wave * 7)
    };
  };

  /* ---------- Shop ---------- */
  const Shop = {};
  SR.Shop = Shop;

  Shop.buyItem = function (run, itemId) {
    const item = SR.DATA.items[itemId];
    if (!item || run.gold < item.price) return false;
    run.gold -= item.price;
    run.inventory[itemId] = (run.inventory[itemId] || 0) + 1;
    Save.autosave();
    return true;
  };

  Shop.buyRelic = function (run, relicId) {
    const relic = SR.DATA.relics[relicId];
    if (!relic || run.gold < relic.price || run.relics.includes(relicId)) return false;
    run.gold -= relic.price;
    run.relics.push(relicId);
    Save.autosave();
    return true;
  };

  Shop.awakenRelic = function (run, relicId) {
    const relic = SR.DATA.relics[relicId];
    if (!relic || !run.relics.includes(relicId) || run.awakened.includes(relicId)) return false;
    if (run.essence < relic.essence) return false;
    run.essence -= relic.essence;
    run.awakened.push(relicId);
    Save.autosave();
    return true;
  };

  Shop.restCost = function (run) {
    return 40 + run.chapter * 10;
  };

  Shop.rest = function (run) {
    const cost = Shop.restCost(run);
    if (run.gold < cost) return false;
    run.gold -= cost;
    Progress.fullHeal(run);
    Save.autosave();
    return true;
  };

  Shop.buyUpgrade = function (id) {
    const up = SR.DATA.upgrades.find((u) => u.id === id);
    if (!up) return false;
    const lvl = Save.meta.upgrades[id] || 0;
    if (lvl >= up.max) return false;
    const cost = up.costs[lvl];
    if (Save.meta.embers < cost) return false;
    Save.meta.embers -= cost;
    Save.meta.upgrades[id] = lvl + 1;
    Save.persist();
    return true;
  };

  /* ---------- Supporter pack ---------- */
  const Premium = {};
  SR.Premium = Premium;

  Premium.normalize = function (code) {
    return (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  };

  Premium.isActive = function () {
    return !!(SR.config.premium.enabled && Save.meta.supporter);
  };

  Premium.activate = function (code) {
    if (!SR.config.premium.enabled) return false;
    const norm = Premium.normalize(code);
    const valid = (SR.config.premium.codes || []).some((c) => Premium.normalize(c) === norm);
    if (!valid) return false;
    if (!Save.meta.supporter) {
      Save.meta.supporter = true;
      Save.meta.supporterCode = norm;
      Save.meta.embers = (Save.meta.embers || 0) + (SR.config.premium.bonusEmbers || 0);
      Save.persist();
    }
    return true;
  };

  Premium.checkUrl = function () {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('supporter') === '1') {
        Save.meta.supporter = true;
        if (!Save.meta.supporterCode) {
          Save.meta.supporterCode = 'URL';
          Save.meta.embers = (Save.meta.embers || 0) + (SR.config.premium.bonusEmbers || 0);
        }
        Save.persist();
      }
    } catch (e) { /* ignore */ }
  };

  /* ---------- Init ---------- */
  SR.setLang(SR.detectLang());
  Save.persist();
})();
