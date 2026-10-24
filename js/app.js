/* Sakura Requiem — application shell / router */
window.SR = window.SR || {};

(function () {
  const App = {};
  SR.App = App;

  const t = (k, v) => SR.t(k, v);
  const L = (o) => SR.L(o);
  const D = SR.DATA;
  const clone = (v) => JSON.parse(JSON.stringify(v));

  const SCREENS = {
    title: { render: 'title', mount: 'mountTitle' },
    map: { render: 'worldmap', mount: 'mountMap' },
    shop: { render: 'shop', mount: 'mountShop' },
    party: { render: 'party', mount: 'mountParty' },
    trials: { render: 'trials', mount: 'mountTrials' },
    dialogue: { render: 'dialogue', mount: 'mountDialogue' },
    ending: { render: 'ending', mount: 'mountEnding' }
  };

  let screen = 'title';
  let screenOpts = {};
  let trials = null;
  let tickTimer = null;
  let lastTick = Date.now();
  let errorShown = false;
  let audioUnlocked = false;

  /* ============================================================
     Helpers
     ============================================================ */
  function ensureFlags(run) {
    if (!run) return null;
    run.flags = run.flags || {};
    run.flags.rested = run.flags.rested || {};
    run.flags.intro = run.flags.intro || {};
    run.flags.bossIntro = run.flags.bossIntro || {};
    if (typeof run.flags.moonlight !== 'boolean') run.flags.moonlight = SR.Premium.isActive();
    run.equipped = run.equipped || {};
    D.heroes.forEach((h) => {
      if (!(h.id in run.equipped)) run.equipped[h.id] = null;
    });
    return run;
  }

  function currentRun() {
    return ensureFlags(SR.Save.current());
  }

  function captureSnapshot(run) {
    return {
      party: clone(run.party),
      inventory: Object.assign({}, run.inventory),
      gold: run.gold,
      essence: run.essence
    };
  }

  function restoreSnapshot(snapshot) {
    const run = currentRun();
    if (!run || !snapshot) return;
    run.party = clone(snapshot.party);
    run.inventory = Object.assign({}, snapshot.inventory);
    run.gold = snapshot.gold;
    run.essence = snapshot.essence;
  }

  function syncFromBattle(run, battle) {
    if (!run || !battle) return;
    battle.allies.forEach((u) => {
      const rh = run.party.find((p) => p.id === u.heroId);
      if (!rh) return;
      rh.hp = Math.max(0, Math.round(u.hp));
      rh.sp = Math.max(0, Math.round(u.sp));
    });
  }

  function chapterOf(run) {
    return D.chapters[Math.max(0, Math.min(D.chapters.length - 1, run.chapter - 1))];
  }

  /* ============================================================
     Music
     ============================================================ */
  function updateMusic() {
    if (screen === 'battle') return;
    if (screen === 'title') {
      SR.Audio.playMusic('menu');
    } else if (screen === 'ending' || (screen === 'dialogue' && screenOpts.ending)) {
      SR.Audio.playMusic('sad');
    } else if (screen === 'dialogue' && screenOpts.chapter === 6) {
      SR.Audio.playMusic('sad');
    } else {
      SR.Audio.playMusic('map');
    }
  }

  /* ============================================================
     Router
     ============================================================ */
  function render() {
    const cfg = SCREENS[screen] || SCREENS.title;
    const renderFn = SR.Screens[cfg.render];
    const app = document.getElementById('app');
    if (!app || !renderFn) return;

    let html;
    try {
      html = renderFn(screenOpts);
    } catch (err) {
      fail(err);
      return;
    }
    app.innerHTML = html;
    app.scrollTop = 0;

    const mountFn = SR.Screens[cfg.mount];
    if (mountFn) {
      try {
        mountFn(app, screenOpts);
      } catch (err) {
        fail(err);
      }
    }
  }

  App.go = function (name, opts) {
    if (name === 'battle') {
      SR.Battle.cleanup();
      screen = 'battle';
      screenOpts = opts || {};
      try {
        SR.Battle.start(screenOpts);
      } catch (err) {
        fail(err);
      }
      updateMusic();
      window.scrollTo(0, 0);
      return;
    }

    if (!SCREENS[name]) name = 'title';
    if (screen === 'battle') SR.Battle.cleanup();

    if (name !== 'title' && !SR.Save.current()) name = 'title';

    screen = name;
    screenOpts = opts || {};
    render();
    updateMusic();
    window.scrollTo(0, 0);
  };

  App.refresh = function () {
    if (screen === 'battle' || screen === 'dialogue') return;
    if (screen !== 'title' && !SR.Save.current()) {
      screen = 'title';
      screenOpts = {};
    }
    render();
    updateMusic();
  };

  /* ============================================================
     Save slots & new game
     ============================================================ */
  App.newGame = function (slot) {
    try {
      const run = ensureFlags(SR.Save.startRun(slot));
      run.flags.moonlight = SR.Premium.isActive();
      SR.Progress.sync(run);
      SR.Save.autosave();
      SR.Audio.sfx('select');

      App.go('dialogue', {
        lines: D.prologue,
        chapter: 1,
        scene: 'shrine',
        onDone: () => {
          showChapterIntro(1, () => App.go('map'));
        }
      });
    } catch (err) {
      fail(err);
    }
  };

  App.loadSlot = function (slot) {
    const run = SR.Save.loadSlot(slot);
    if (!run) {
      SR.UI.toast(t('toast.noSave'), 'pink');
      return;
    }
    ensureFlags(run);
    SR.Progress.sync(run);
    SR.Save.autosave();
    App.go('map');
    SR.UI.toast(t('toast.loaded'), 'gold');
    SR.Audio.sfx('select');
  };

  App.saveToSlot = function (slot) {
    const run = currentRun();
    if (!run) {
      SR.UI.toast(t('toast.noSave'), 'pink');
      return;
    }
    SR.Save.writeSlot(slot, run);
    ensureFlags(run);
    SR.UI.toast(t('toast.saved'), 'gold');
    SR.Audio.sfx('select');
    if (screen === 'map' || screen === 'party' || screen === 'shop') App.refresh();
  };

  App.continueGame = function () {
    const slot = SR.Save.mostRecent();
    if (slot < 0) {
      SR.UI.toast(t('toast.noSave'), 'pink');
      return;
    }
    App.loadSlot(slot);
  };

  /* ============================================================
     Story dialogue
     ============================================================ */
  function showChapterIntro(n, done) {
    const run = currentRun();
    if (!run) { if (done) done(); return; }
    const chapter = D.chapters[n - 1];
    if (!chapter) { if (done) done(); return; }
    if (run.flags.intro[n]) { if (done) done(); return; }
    if (!chapter.intro || !chapter.intro.length) {
      run.flags.intro[n] = true;
      SR.Save.autosave();
      if (done) done();
      return;
    }
    App.go('dialogue', {
      lines: chapter.intro,
      chapter: n,
      scene: chapter.bg,
      onDone: () => {
        const r = currentRun();
        if (r) { r.flags.intro[n] = true; SR.Save.autosave(); }
        if (done) done();
      }
    });
  }

  function showBossIntro(n, done) {
    const run = currentRun();
    if (!run) { if (done) done(); return; }
    const chapter = D.chapters[n - 1];
    if (!chapter) { if (done) done(); return; }
    if (run.flags.bossIntro[n]) { if (done) done(); return; }
    if (!chapter.bossIntro || !chapter.bossIntro.length) {
      run.flags.bossIntro[n] = true;
      SR.Save.autosave();
      if (done) done();
      return;
    }
    App.go('dialogue', {
      lines: chapter.bossIntro,
      chapter: n,
      scene: chapter.bg,
      onDone: () => {
        const r = currentRun();
        if (r) { r.flags.bossIntro[n] = true; SR.Save.autosave(); }
        if (done) done();
      }
    });
  }

  function showEndingDialogue() {
    const run = currentRun();
    if (run) {
      run.endingSeen = true;
      run.flags.ending = true;
      SR.Save.autosave();
    }
    App.go('dialogue', {
      lines: D.ending,
      ending: true,
      chapter: 6,
      scene: 'hollow',
      onDone: () => App.go('ending')
    });
  }

  /* ============================================================
     Story battles
     ============================================================ */
  App.startStoryBattle = function () {
    const run = currentRun();
    if (!run) { App.go('title'); return; }
    const chapter = chapterOf(run);
    const isBoss = run.battleIndex >= chapter.encounters.length;

    const afterChapterIntro = () => {
      if (isBoss) showBossIntro(run.chapter, () => launchStoryBattle());
      else launchStoryBattle();
    };

    if (!run.flags.intro[run.chapter]) showChapterIntro(run.chapter, afterChapterIntro);
    else afterChapterIntro();
  };

  function launchStoryBattle() {
    const run = currentRun();
    if (!run) { App.go('title'); return; }
    const enc = SR.Progress.encounterFor(run);
    const chapter = enc.chapter;
    const isBoss = enc.isBoss;
    const snapshot = captureSnapshot(run);
    const enemyLevel = Math.max(1, Math.min(30, chapter.n + (isBoss ? 1 : 0) + Math.floor(run.battleIndex / 2)));

    let battle;
    try {
      battle = SR.Engine.createBattle({
        run,
        meta: SR.Save.meta,
        enemies: enc.enemies,
        enemyLevel,
        isBoss,
        chapter: chapter.n,
        inventory: run.inventory
      });
    } catch (err) {
      fail(err);
      return;
    }

    App.go('battle', {
      battle,
      moonlight: run.flags.moonlight,
      onEnd: (result, b) => onStoryEnd(result, b, snapshot)
    });
  }

  function onStoryEnd(result, battle, snapshot) {
    const run = currentRun();
    if (!run) { App.go('title'); return; }

    if (result === 'retreat') {
      restoreSnapshot(snapshot);
      SR.Save.autosave();
      App.go('map');
      return;
    }

    if (result === 'defeat') {
      restoreSnapshot(snapshot);
      SR.Save.autosave();
      SR.Screens.showDefeat({
        onRetry: () => launchStoryBattle(),
        onMap: () => App.go('map')
      });
      return;
    }

    if (result !== 'victory') {
      App.go('map');
      return;
    }

    syncFromBattle(run, battle);
    const chapter = chapterOf(run);
    const isBoss = run.battleIndex >= chapter.encounters.length;
    const rewards = SR.Progress.rewardFor(run, run.chapter, isBoss);
    const gained = SR.Progress.grantRewards(run, rewards);

    let relic = null;
    if (isBoss || Math.random() < 0.12) relic = SR.Progress.rollRelic(run);

    SR.Save.autosave();

    const done = isBoss
      ? chapter.encounters.length + 1
      : run.battleIndex + 1;

    SR.Screens.showResult({
      victory: true,
      rewards,
      levels: gained.levels,
      unlockedSkills: gained.unlocked,
      relic,
      subtitle: isBoss
        ? L(chapter.name)
        : t('map.progress', { done, total: chapter.encounters.length + 1 }),
      onContinue: () => {
        const adv = SR.Progress.advance(run, true);
        SR.Save.autosave();

        if (adv.chapterAdvanced) {
          SR.UI.toast(t('toast.unlocked', { n: adv.newChapter }), 'gold');
        }

        if (!isBoss) {
          App.go('map');
          return;
        }

        const outro = chapter.outro || [];
        if (!outro.length) {
          afterBoss();
          return;
        }
        App.go('dialogue', {
          lines: outro,
          chapter: chapter.n,
          scene: chapter.bg,
          onDone: afterBoss
        });

        function afterBoss() {
          if (adv.ending) {
            showEndingDialogue();
          } else if (adv.chapterAdvanced) {
            showChapterIntro(run.chapter, () => App.go('map'));
          } else {
            App.go('map');
          }
        }
      }
    });
  }

  /* ============================================================
     Rift Trials (endless mode)
     ============================================================ */
  App.startTrials = function () {
    const run = currentRun();
    if (!run) { App.go('title'); return; }
    if (!run.trialsUnlocked) {
      SR.UI.toast(t('map.trialsLocked'), 'pink');
      return;
    }
    trials = {
      wave: 1,
      snapshot: captureSnapshot(run)
    };
    SR.Progress.fullHeal(run);
    SR.Save.autosave();
    launchTrialsWave();
  };

  function launchTrialsWave() {
    const run = currentRun();
    if (!run || !trials) { App.go('map'); return; }
    const wave = trials.wave;
    const avgLevel = Math.round(run.party.reduce((a, p) => a + p.level, 0) / Math.max(1, run.party.length));
    const enemyLevel = Math.max(1, Math.min(30, avgLevel + Math.floor(wave / 2)));
    const waveScale = 1 + (wave - 1) * 0.07;
    const enemies = SR.Progress.trialsEnemies(wave);

    let battle;
    try {
      battle = SR.Engine.createBattle({
        run,
        meta: SR.Save.meta,
        enemies,
        enemyLevel,
        isTrials: true,
        trialsWave: wave,
        chapter: run.chapter,
        inventory: run.inventory,
        waveScale
      });
    } catch (err) {
      fail(err);
      return;
    }

    App.go('battle', {
      battle,
      moonlight: run.flags.moonlight,
      onEnd: (result, b) => onTrialsEnd(result, b)
    });
  }

  function onTrialsEnd(result, battle) {
    const run = currentRun();
    if (!run) { App.go('title'); return; }
    const wave = trials ? trials.wave : 1;

    if (result === 'retreat') {
      endTrials();
      return;
    }

    syncFromBattle(run, battle);

    if (result === 'defeat') {
      run.party.forEach((rh) => { rh.hp = Math.max(1, rh.hp || 1); });
      const embers = 3 + wave * 2;
      SR.Save.addEmbers(embers);
      const best = wave > (SR.Save.meta.bestWave || 0);
      if (best) SR.Save.meta.bestWave = wave;
      SR.Save.persist();
      SR.Screens.showTrialsResult({
        victory: false,
        wave,
        embers,
        best: false,
        onLeave: () => endTrials()
      });
      return;
    }

    if (result !== 'victory') {
      endTrials();
      return;
    }

    const reward = SR.Progress.trialsReward(wave);
    SR.Save.addEmbers(reward.embers);
    run.gold += reward.gold;
    SR.Progress.gainXP(run, reward.xp);

    run.party.forEach((rh) => {
      if (rh.hp <= 0) return;
      const st = SR.Progress.maxOf(run, rh);
      if (!st) return;
      rh.hp = Math.min(st.maxHp, rh.hp + Math.round(st.maxHp * 0.25));
      rh.sp = Math.min(st.maxSp, rh.sp + Math.round(st.maxSp * 0.2));
    });

    const best = wave > (SR.Save.meta.bestWave || 0);
    if (best) SR.Save.meta.bestWave = wave;
    SR.Save.persist();

    SR.Screens.showTrialsResult({
      victory: true,
      wave,
      embers: reward.embers,
      best,
      onNext: () => {
        if (!trials) { App.go('map'); return; }
        trials.wave += 1;
        launchTrialsWave();
      },
      onLeave: () => endTrials()
    });
  }

  function endTrials() {
    const run = currentRun();
    if (run && trials && trials.snapshot) {
      trials.snapshot.party.forEach((saved) => {
        const rh = run.party.find((p) => p.id === saved.id);
        if (!rh) return;
        const st = SR.Progress.maxOf(run, rh);
        if (!st) return;
        rh.hp = saved.hp == null ? st.maxHp : Math.max(1, Math.min(st.maxHp, Math.round(saved.hp)));
        rh.sp = saved.sp == null ? st.maxSp : Math.max(0, Math.min(st.maxSp, Math.round(saved.sp)));
      });
    }
    trials = null;
    SR.Save.autosave();
    App.go('map');
  }

  /* ============================================================
     Playtime & autosave
     ============================================================ */
  function startTicker() {
    if (tickTimer) clearInterval(tickTimer);
    lastTick = Date.now();
    tickTimer = setInterval(() => {
      const now = Date.now();
      const delta = Math.max(0, Math.min(90, Math.round((now - lastTick) / 1000)));
      lastTick = now;
      if (screen === 'title') return;
      if (SR.Save.current()) SR.Save.tick(delta);
      SR.Save.autosave();
    }, 20000);
  }

  function bindGlobal() {
    const unlock = () => {
      if (audioUnlocked) return;
      audioUnlocked = true;
      SR.Audio.unlock();
      updateMusic();
    };
    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });

    const saveNow = () => {
      if (screen !== 'title') SR.Save.autosave();
    };
    window.addEventListener('pagehide', saveNow);
    window.addEventListener('beforeunload', saveNow);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) saveNow();
      else lastTick = Date.now();
    });

    window.addEventListener('error', (e) => {
      if (e && e.error) fail(e.error);
    });
    window.addEventListener('unhandledrejection', (e) => {
      if (e && e.reason) fail(e.reason);
    });
  }

  /* ============================================================
     Fatal error screen
     ============================================================ */
  function fail(err) {
    try { console.error('[Sakura Requiem]', err); } catch (e) { /* ignore */ }
    if (errorShown) return;
    errorShown = true;
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `<section class="screen screen--center" style="text-align:center;justify-content:center;gap:.7rem">
      <div class="logo__jp" style="font-size:3rem;color:var(--pink)">桜</div>
      <span class="eyebrow">${t('error.title')}</span>
      <h1 class="h1">${t('error.title')}</h1>
      <p class="muted" style="max-width:520px;line-height:1.6">${t('error.body')}</p>
      <button class="btn btn--primary" onclick="location.reload()">${t('error.reload')}</button>
    </section>`;
    try { SR.Battle.cleanup(); } catch (e) { /* ignore */ }
    SR.UI.closeAllModals();
  }

  App.fail = fail;

  /* ============================================================
     Boot
     ============================================================ */
  function boot() {
    try {
      SR.Premium.checkUrl();
      SR.Save.slots.forEach((run) => { if (run) ensureFlags(run); });
      SR.UI.initPetals();
      SR.UI.applySettings();
      bindGlobal();
      App.go('title');
      startTicker();
    } catch (err) {
      fail(err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
