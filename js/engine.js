/* Sakura Requiem — battle engine (pure logic, no DOM) */
window.SR = window.SR || {};

(function () {
  const E = {};
  SR.Engine = E;
  const D = SR.DATA;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const nm = (u) => SR.L(u.name);
  const key = (k) => SR.t(k);

  E.xpNeeded = (level) => Math.round(42 * Math.pow(level, 1.32));

  E.aggregateMods = function (list) {
    const out = {};
    list.forEach((m) => {
      if (!m) return;
      Object.keys(m).forEach((k) => {
        if (k === 'dmgElement') {
          out.dmgElement = out.dmgElement || {};
          Object.keys(m.dmgElement).forEach((el) => {
            out.dmgElement[el] = (out.dmgElement[el] || 0) + m.dmgElement[el];
          });
        } else if (typeof m[k] === 'number') {
          out[k] = (out[k] || 0) + m[k];
        }
      });
    });
    return out;
  };

  E.relicMods = function (relicId, awakened) {
    if (!relicId) return {};
    const relic = D.relics[relicId];
    if (!relic) return {};
    const mod = {};
    Object.keys(relic.mod).forEach((k) => {
      if (k === 'dmgElement') {
        mod.dmgElement = {};
        Object.keys(relic.mod.dmgElement).forEach((el) => {
          mod.dmgElement[el] = relic.mod.dmgElement[el] * (awakened ? 1.5 : 1);
        });
      } else {
        const v = relic.mod[k];
        mod[k] = v > 0 && awakened ? v * 1.5 : v;
      }
    });
    return mod;
  };

  E.heroStats = function (heroId, runHero, meta, relicId, awakened) {
    const hero = D.heroes.find((h) => h.id === heroId);
    if (!hero) return null;
    const lvl = runHero.level || 1;
    const boonMods = (runHero.boons || []).map((b) => (D.boons[b] ? D.boons[b].mod : null));
    const passive = hero.id === 'hana' ? { vsBurning: 0.15 }
      : hero.id === 'yuki' ? { healPct: 0.2 }
      : { evadePct: 0.1 };
    const metaUp = (meta && meta.upgrades) || {};
    const mods = E.aggregateMods(boonMods.concat([
      E.relicMods(relicId, awakened),
      passive,
      {
        maxHpPct: (metaUp.vitality || 0) * 0.06,
        atkPct: (metaUp.might || 0) * 0.04,
        resonanceStart: (metaUp.resonance || 0) * 8
      }
    ]));
    let maxHp = hero.base.hp + hero.growth.hp * (lvl - 1) + (mods.maxHpFlat || 0);
    let maxSp = hero.base.sp + hero.growth.sp * (lvl - 1) + (mods.spFlat || 0);
    let atk = hero.base.atk + hero.growth.atk * (lvl - 1) + (mods.atkFlat || 0);
    let def = hero.base.def + hero.growth.def * (lvl - 1) + (mods.defFlat || 0);
    let spd = hero.base.spd + hero.growth.spd * (lvl - 1) + (mods.spdFlat || 0);
    maxHp *= 1 + (mods.maxHpPct || 0);
    atk *= 1 + (mods.atkPct || 0);
    def *= 1 + (mods.defPct || 0);
    spd *= 1 + (mods.spdPct || 0);
    return {
      maxHp: Math.round(maxHp),
      maxSp: Math.round(maxSp),
      atk: Math.round(atk * 10) / 10,
      def: Math.round(def * 10) / 10,
      spd: Math.round(spd * 10) / 10,
      crit: clamp(hero.base.crit + (mods.critFlat || 0), 0, 0.85),
      critDmg: 1.6 + (mods.critDmgPct || 0),
      mods
    };
  };

  E.enemyStats = function (enemyId, level, waveScale) {
    const enemy = D.enemies[enemyId];
    if (!enemy) return null;
    const lvl = Math.max(1, level);
    const s = waveScale || 1;
    return {
      maxHp: Math.round((enemy.base.hp + enemy.growth.hp * (lvl - 1)) * s),
      atk: Math.round((enemy.base.atk + enemy.growth.atk * (lvl - 1)) * (1 + (s - 1) * 0.55) * 10) / 10,
      def: Math.round((enemy.base.def + enemy.growth.def * (lvl - 1)) * (1 + (s - 1) * 0.4) * 10) / 10,
      spd: Math.round((enemy.base.spd + enemy.growth.spd * (lvl - 1)) * 10) / 10,
      crit: 0.05,
      critDmg: 1.5,
      mods: {}
    };
  };

  function makeHeroUnit(run, rh, index, meta) {
    const hero = D.heroes.find((h) => h.id === rh.id);
    const relicId = (run.equipped && run.equipped[rh.id]) || null;
    const awakened = !!(run.awakened && run.awakened.includes(relicId));
    const st = E.heroStats(rh.id, rh, meta, relicId, awakened);
    const hp = rh.hp == null ? st.maxHp : clamp(rh.hp, 0, st.maxHp);
    const sp = rh.sp == null ? st.maxSp : clamp(rh.sp, 0, st.maxSp);
    return {
      uid: 'a' + index,
      side: 'ally',
      heroId: rh.id,
      name: hero.name,
      title: hero.title,
      element: hero.element,
      color: hero.color,
      level: rh.level,
      hp: hp <= 0 ? 1 : hp,
      maxHp: st.maxHp,
      sp,
      maxSp: st.maxSp,
      atk: st.atk,
      def: st.def,
      spd: st.spd,
      crit: st.crit,
      critDmg: st.critDmg,
      mods: st.mods,
      passive: hero.passive,
      basic: hero.basic,
      skills: hero.skills.filter((s) => s.unlock <= rh.level),
      ult: hero.ult,
      statuses: [],
      cooldowns: {},
      resonance: clamp(st.mods.resonanceStart || 0, 0, 100),
      alive: hp > 0,
      guarding: false,
      isHero: true
    };
  }

  function makeEnemyUnit(enemyId, level, index, waveScale) {
    const enemy = D.enemies[enemyId];
    const st = E.enemyStats(enemyId, level, waveScale);
    return {
      uid: 'e' + index,
      side: 'enemy',
      enemyId,
      name: enemy.name,
      element: enemy.element,
      color: enemy.color,
      level,
      hp: st.maxHp,
      maxHp: st.maxHp,
      sp: 999,
      maxSp: 999,
      atk: st.atk,
      def: st.def,
      spd: st.spd,
      crit: st.crit,
      critDmg: st.critDmg,
      mods: st.mods,
      skills: enemy.skills,
      basic: { name: { en: 'Strike', es: 'Golpe' }, power: 1, element: enemy.element },
      statuses: [],
      cooldowns: {},
      resonance: 0,
      alive: true,
      guarding: false,
      boss: !!enemy.boss,
      final: !!enemy.final,
      phase: enemy.phase ? Object.assign({ triggered: false }, enemy.phase) : null,
      isHero: false
    };
  }

  E.createBattle = function (opts) {
    const meta = opts.meta || { upgrades: {} };
    const allies = opts.run.party.map((rh, i) => makeHeroUnit(opts.run, rh, i, meta));
    const waveScale = opts.waveScale || 1;
    const enemies = opts.enemies.map((id, i) => makeEnemyUnit(id, opts.enemyLevel || 1, i, waveScale));
    const battle = {
      round: 0,
      queue: [],
      turn: null,
      allies,
      enemies,
      units: allies.concat(enemies),
      over: false,
      result: null,
      isBoss: !!opts.isBoss,
      isTrials: !!opts.isTrials,
      trialsWave: opts.trialsWave || 0,
      chapter: opts.chapter || 1,
      inventory: opts.inventory,
      log: [],
      startedAt: Date.now()
    };
    allies.forEach((u) => {
      if (!u.alive) return;
    });
    return battle;
  };

  E.alive = (battle, side) => battle.units.filter((u) => u.side === side && u.alive);
  E.find = (battle, uid) => battle.units.find((u) => u.uid === uid);

  function statOf(u, k) {
    let base = u[k] || 0;
    let pct = 0;
    u.statuses.forEach((s) => {
      const def = D.statuses[s.id];
      if (!def) return;
      if (def[k]) pct += def[k];
      if ((k === 'atk' || k === 'def' || k === 'spd') && s.value != null && def[k]) pct += (s.value - def[k]);
    });
    if (k === 'spd') {
      // chill handled by def.spd; nothing extra
    }
    return Math.max(1, base * (1 + pct));
  }
  E.statOf = statOf;

  function hasStatus(u, id) { return u.statuses.some((s) => s.id === id); }
  function getStatus(u, id) { return u.statuses.find((s) => s.id === id); }

  function addLog(battle, text, events) {
    if (!text) return;
    battle.log.push(text);
    if (battle.log.length > 80) battle.log.shift();
    if (events) events.push({ type: 'log', text });
  }

  function pushEvent(events, ev) { events.push(ev); }

  function addStatus(battle, target, id, turns, value, events, source) {
    if (!target.alive) return;
    if (id === 'stun' && target.boss && Math.random() < 0.5) {
      addLog(battle, key('log.resist').replace('{target}', nm(target)), events);
      return;
    }
    const def = D.statuses[id];
    if (!def) return;
    const existing = getStatus(target, id);
    if (existing) {
      existing.turns = Math.max(existing.turns, turns);
      if (value != null) existing.value = value;
    } else {
      target.statuses.push({ id, turns, value });
    }
    if (id === 'shield') {
      pushEvent(events, { type: 'shield', uid: target.uid, amount: Math.round(value || 0) });
      addLog(battle, SR.t('log.shield', { target: nm(target) }), events);
      return;
    }
    pushEvent(events, { type: 'status', uid: target.uid, status: id, turns });
    addLog(battle, SR.t('log.status', { target: nm(target), status: SR.t('status.' + id) }), events);
  }

  function cleanse(u, battle, events) {
    const had = u.statuses.some((s) => D.statuses[s.id] && D.statuses[s.id].debuff);
    u.statuses = u.statuses.filter((s) => !(D.statuses[s.id] && D.statuses[s.id].debuff));
    if (had) {
      addLog(battle, SR.t('log.cleanse', { target: nm(u) }), events);
      pushEvent(events, { type: 'cleanse', uid: u.uid });
    }
  }

  function damage(battle, actor, target, opts, events) {
    if (!target.alive) return 0;
    // evasion
    const evadeChance = (target.mods.evadePct || 0) + (getStatus(target, 'evade') ? getStatus(target, 'evade').value || 0.5 : 0);
    if (evadeChance > 0 && Math.random() < evadeChance) {
      addLog(battle, SR.t('log.evade', { target: nm(target) }), events);
      pushEvent(events, { type: 'miss', uid: target.uid });
      return 0;
    }
    const atk = statOf(actor, 'atk');
    const def = statOf(target, 'def') * (1 - clamp(opts.ignoreDef || 0, 0, 0.8));
    let dmg = atk * opts.power * (100 / (100 + def * 2.4));
    dmg *= rnd(0.94, 1.06);

    let elementMult = 1;
    if (D.strongVs[opts.element] === target.element) elementMult = 1.5;
    else if (D.weakVs[opts.element] === target.element) elementMult = 0.75;
    dmg *= elementMult;

    if (hasStatus(target, 'mark')) dmg *= 1.2;

    const mods = actor.mods || {};
    if (mods.dmgElement && mods.dmgElement[opts.element]) dmg *= 1 + mods.dmgElement[opts.element];
    if (opts.isSkill && mods.skillDmgPct) dmg *= 1 + mods.skillDmgPct;
    if (opts.isUlt && mods.ultDmgPct) dmg *= 1 + mods.ultDmgPct;
    if (opts.isBasic && mods.basicDmgPct) dmg *= 1 + mods.basicDmgPct;
    if (battle.round === 1 && mods.firstStrikePct) dmg *= 1 + mods.firstStrikePct;
    if (mods.vsBurning && hasStatus(target, 'burn')) dmg *= 1 + mods.vsBurning;
    if (mods.executePct && target.hp / target.maxHp < 0.35) dmg *= 1 + mods.executePct;
    if (opts.bonusVsStatus && hasStatus(target, opts.bonusVsStatus.status)) dmg *= 1 + opts.bonusVsStatus.bonus;
    if (opts.executeBonus && target.hp / target.maxHp < opts.executeBonus.below) dmg *= 1 + opts.executeBonus.bonus;

    const critChance = clamp((actor.crit || 0.05) + (mods.critFlat || 0), 0, 0.9);
    const crit = Math.random() < critChance;
    if (crit) dmg *= actor.critDmg || 1.6;
    if (target.guarding) dmg *= Math.max(0.15, 0.5 - (target.mods.guardBonus || 0));
    dmg = Math.max(1, Math.round(dmg));

    // shield absorb
    const shield = getStatus(target, 'shield');
    let absorbed = 0;
    if (shield) {
      absorbed = Math.min(shield.value, dmg);
      shield.value -= absorbed;
      dmg -= absorbed;
      if (shield.value <= 0) target.statuses = target.statuses.filter((s) => s !== shield);
    }

    target.hp = Math.max(0, target.hp - dmg);
    if (target.side === 'ally') {
      target.resonance = clamp(target.resonance + 6, 0, 100);
    }
    pushEvent(events, {
      type: 'damage', uid: target.uid, amount: dmg, crit, absorbed,
      element: opts.element, weak: elementMult > 1, resist: elementMult < 1
    });
    if (absorbed > 0) pushEvent(events, { type: 'shieldBreak', uid: target.uid, amount: absorbed });

    if (dmg > 0) {
      const msg = crit ? SR.t('log.crit', { target: nm(target), n: dmg }) : SR.t('log.damage', { target: nm(target), n: dmg });
      addLog(battle, msg, events);
      if (elementMult > 1) addLog(battle, SR.t('log.weak'), events);
      else if (elementMult < 0.75) addLog(battle, SR.t('log.resist', { target: nm(target) }), events);
      if (mods.lifestealPct) {
        const healAmt = Math.round(dmg * mods.lifestealPct);
        if (healAmt > 0) healUnit(battle, actor, healAmt, events);
      }
      if (target.alive && mods.counterPct && target.side !== actor.side && Math.random() < mods.counterPct) {
        const back = Math.round(atk * 0.6 * (100 / (100 + statOf(target, 'def') * 2.4)));
        target.hp = Math.max(0, target.hp - back);
        pushEvent(events, { type: 'damage', uid: actor.uid, amount: back, counter: true });
        addLog(battle, SR.t('log.damage', { target: nm(actor), n: back }), events);
      }
    }

    if (target.hp <= 0) kill(battle, target, events);
    else if (target.side === 'ally' && target.mods.guardHeal && target.guarding) {
      healUnit(battle, target, Math.round(target.maxHp * target.mods.guardHeal), events);
    }
    return dmg;
  }

  function healUnit(battle, target, amount, events) {
    if (!target.alive) return 0;
    const before = target.hp;
    target.hp = Math.min(target.maxHp, target.hp + Math.round(amount));
    const healed = target.hp - before;
    if (healed > 0) {
      pushEvent(events, { type: 'heal', uid: target.uid, amount: healed });
      addLog(battle, SR.t('log.heal', { target: nm(target), n: healed }), events);
    }
    return healed;
  }

  function kill(battle, unit, events) {
    unit.alive = false;
    unit.hp = 0;
    unit.statuses = [];
    pushEvent(events, { type: 'death', uid: unit.uid });
    addLog(battle, SR.t('log.died', { target: nm(unit) }), events);
    if (unit.boss) SR.Audio && SR.Audio.sfx('death');
  }

  function checkPhase(battle, unit, events) {
    if (!unit.phase || unit.phase.triggered) return;
    if (unit.hp / unit.maxHp <= unit.phase.at) {
      unit.phase.triggered = true;
      addLog(battle, SR.L(unit.phase.line), events);
      pushEvent(events, { type: 'phase', uid: unit.uid, text: SR.L(unit.phase.line) });
      (unit.phase.effects || []).forEach((e) => addStatus(battle, unit, e.status, e.turns || 2, e.value, events, unit));
    }
  }

  E.checkEnd = function (battle, events) {
    if (battle.over) return true;
    if (E.alive(battle, 'enemy').length === 0) {
      battle.over = true;
      battle.result = 'victory';
      if (events) events.push({ type: 'end', result: 'victory' });
      return true;
    }
    if (E.alive(battle, 'ally').length === 0) {
      battle.over = true;
      battle.result = 'defeat';
      if (events) events.push({ type: 'end', result: 'defeat' });
      return true;
    }
    return false;
  };

  function startRound(battle) {
    battle.round += 1;
    battle.queue = battle.units
      .filter((u) => u.alive)
      .sort((a, b) => statOf(b, 'spd') - statOf(a, 'spd') || (a.side === 'ally' ? -1 : 1))
      .map((u) => u.uid);
    addLog(battle, SR.t('log.round', { n: battle.round }));
  }

  E.startRound = startRound;

  function tickTurn(battle, unit, events) {
    // cooldowns
    Object.keys(unit.cooldowns).forEach((k) => {
      unit.cooldowns[k] = Math.max(0, unit.cooldowns[k] - 1);
    });
    // dots / regen
    unit.statuses.slice().forEach((s) => {
      const def = D.statuses[s.id];
      if (!def) return;
      if (def.dot && unit.alive) {
        const dmg = Math.max(1, Math.round(unit.maxHp * def.dot));
        unit.hp = Math.max(0, unit.hp - dmg);
        pushEvent(events, { type: 'damage', uid: unit.uid, amount: dmg, dot: true, element: s.id === 'burn' ? 'ember' : 'void' });
        addLog(battle, SR.t('log.damage', { target: nm(unit), n: dmg }), events);
        if (unit.hp <= 0) kill(battle, unit, events);
      }
      if (def.hot && unit.alive) {
        healUnit(battle, unit, Math.round(unit.maxHp * def.hot), events);
      }
      s.turns -= 1;
      if (s.turns <= 0) {
        unit.statuses = unit.statuses.filter((x) => x !== s);
      }
    });
    if (!unit.alive) return;
    const stunned = getStatus(unit, 'stun');
    if (stunned) {
      unit.statuses = unit.statuses.filter((s) => s !== stunned);
      addLog(battle, SR.t('log.status', { target: nm(unit), status: SR.t('status.stun') }), events);
      return 'stun';
    }
    if (unit.side === 'ally') {
      const regen = 1 + (unit.mods.spRegenFlat || 0);
      unit.sp = Math.min(unit.maxSp, unit.sp + regen);
    }
    return null;
  }

  E.next = function (battle) {
    if (battle.over) return { type: 'end', result: battle.result, events: [] };
    for (let guard = 0; guard < 40; guard++) {
      if (!battle.queue.length) {
        startRound(battle);
        if (E.checkEnd(battle)) return { type: 'end', result: battle.result, events: [] };
      }
      const uid = battle.queue.shift();
      const unit = E.find(battle, uid);
      if (!unit || !unit.alive) continue;
      unit.guarding = false;
      const events = [];
      const stunned = tickTurn(battle, unit, events);
      if (E.checkEnd(battle, events)) return { type: 'end', result: battle.result, events };
      if (!unit.alive) return { type: 'skip', unit, events };
      if (stunned === 'stun') return { type: 'skip', unit, events };
      battle.turn = unit;
      return { type: unit.side, unit, events };
    }
    return { type: 'end', result: battle.result || 'defeat', events: [] };
  };

  function resolveTargets(battle, actor, targetType, targetUid) {
    const foes = E.alive(battle, actor.side === 'ally' ? 'enemy' : 'ally');
    const friends = E.alive(battle, actor.side);
    switch (targetType) {
      case 'allEnemies': return foes;
      case 'allAllies': return friends;
      case 'self': return [actor];
      case 'ally': {
        const t = targetUid ? E.find(battle, targetUid) : null;
        return t && t.alive && t.side === actor.side ? [t] : [friends[0]];
      }
      default: {
        const t = targetUid ? E.find(battle, targetUid) : null;
        return t && t.alive && t.side !== actor.side ? [t] : [foes[0]];
      }
    }
  }

  function applySkill(battle, actor, skill, targetUid, opts, events) {
    opts = opts || {};
    const targets = resolveTargets(battle, actor, skill.target, targetUid);
    const isUlt = !!opts.isUlt;
    const isSkill = !opts.isBasic;
    const skillName = SR.L(skill.name);

    if (isUlt) {
      pushEvent(events, { type: 'ult', uid: actor.uid, name: skillName });
      addLog(battle, SR.t('log.ult', { actor: nm(actor), skill: skillName }), events);
      SR.Audio && SR.Audio.sfx('ult');
    } else {
      addLog(battle, SR.t(opts.isBasic ? 'log.uses' : 'log.uses', { actor: nm(actor), skill: skillName }), events);
    }

    // damage first
    if (skill.power > 0) {
      targets.forEach((t) => {
        if (t.side === actor.side) return;
        const hits = skill.hits || 1;
        for (let h = 0; h < hits; h++) {
          if (!t.alive) break;
          damage(battle, actor, t, {
            power: skill.power,
            element: skill.element,
            ignoreDef: (skill.ignoreDef || 0) + (actor.mods.ignoreDefPct || 0),
            isSkill: isSkill && !isUlt,
            isUlt,
            isBasic: !!opts.isBasic,
            bonusVsStatus: skill.bonusVsStatus,
            executeBonus: skill.executeBonus
          }, events);
          if (t.phase) checkPhase(battle, t, events);
        }
      });
    }

    // heal
    if (skill.heal) {
      const healTargets = skill.target === 'self' ? [actor] : targets;
      healTargets.forEach((t) => {
        if (t.alive) {
          const amount = Math.round(t.maxHp * skill.heal * (1 + (actor.mods.healPct || 0)));
          healUnit(battle, t, amount, events);
        }
      });
    }

    // shield
    if (skill.shield) {
      targets.forEach((t) => {
        if (!t.alive) return;
        const amount = Math.round(t.maxHp * skill.shield);
        addStatus(battle, t, 'shield', 99, amount, events, actor);
      });
    }

    // cleanse
    if (skill.cleanseAllies) {
      E.alive(battle, actor.side).forEach((u) => cleanse(u, battle, events));
    }

    // revive
    if (skill.reviveAllies) {
      battle.units.filter((u) => u.side === actor.side && !u.alive).forEach((u) => {
        u.alive = true;
        u.hp = Math.round(u.maxHp * skill.reviveAllies);
        u.statuses = [];
        pushEvent(events, { type: 'revive', uid: u.uid, amount: u.hp });
        addLog(battle, SR.t('log.revive', { target: nm(u) }), events);
      });
    }

    // status effects
    (skill.effects || []).forEach((eff) => {
      targets.forEach((t) => {
        if (!t.alive) return;
        if (Math.random() < (eff.chance == null ? 1 : eff.chance)) {
          addStatus(battle, t, eff.status, eff.turns || 2, eff.value, events, actor);
        }
      });
    });

    // self status effects for ally-target skills are handled above

    if (skill.resonance) {
      actor.resonance = clamp(actor.resonance + skill.resonance, 0, 100);
      pushEvent(events, { type: 'resonance', uid: actor.uid, amount: actor.resonance });
    }

    return targets;
  }

  E.canUseSkill = function (actor, skill) {
    return actor.sp >= (skill.sp || 0);
  };

  E.perform = function (battle, actor, action) {
    const events = [];
    if (!actor || !actor.alive || battle.over) return events;

    if (action.kind === 'guard') {
      actor.guarding = true;
      addLog(battle, SR.t('battle.guardLog', { name: nm(actor) }), events);
      if (actor.mods.guardHeal) healUnit(battle, actor, Math.round(actor.maxHp * actor.mods.guardHeal), events);
      actor.resonance = clamp(actor.resonance + 10, 0, 100);
      SR.Audio && SR.Audio.sfx('guard');
      E.checkEnd(battle, events);
      return events;
    }

    if (action.kind === 'item') {
      E.useItem(battle, actor, action.itemId, action.targetUid, events);
      actor.resonance = clamp(actor.resonance + 6, 0, 100);
      E.checkEnd(battle, events);
      return events;
    }

    let skill;
    let isUlt = false;
    let isBasic = false;
    if (action.kind === 'attack') {
      skill = actor.basic;
      isBasic = true;
    } else if (action.kind === 'ult') {
      if (actor.resonance < 100) return events;
      skill = actor.ult;
      isUlt = true;
      actor.resonance = 0;
    } else {
      skill = actor.skills.find((s) => s.id === action.skillId);
      if (!skill || actor.sp < (skill.sp || 0)) return events;
      actor.sp -= skill.sp || 0;
    }
    if (!skill) return events;

    applySkill(battle, actor, skill, action.targetUid, { isUlt, isBasic }, events);

    if (!isUlt) {
      actor.resonance = clamp(actor.resonance + (isBasic ? 14 : 12), 0, 100);
      if (actor.resonance >= 100) pushEvent(events, { type: 'resonanceFull', uid: actor.uid });
    }

    if (action.kind === 'skill' && actor.side === 'enemy' && skill.cd) {
      const idx = actor.skills.indexOf(skill);
      actor.cooldowns[idx] = skill.cd;
    }

    E.checkEnd(battle, events);
    return events;
  };

  E.useItem = function (battle, actor, itemId, targetUid, events) {
    events = events || [];
    const item = D.items[itemId];
    const inv = battle.inventory;
    if (!item || !inv || !inv[itemId] || inv[itemId] <= 0) {
      pushEvent(events, { type: 'error', key: 'battle.noItems' });
      return events;
    }
    inv[itemId] -= 1;
    if (inv[itemId] <= 0) delete inv[itemId];
    addLog(battle, SR.t('log.item', { actor: nm(actor), item: SR.L(item.name) }), events);
    const targets = resolveTargets(battle, actor, item.target, targetUid);
    targets.forEach((t) => {
      if (item.heal) {
        if (t.alive) healUnit(battle, t, Math.round(t.maxHp * item.heal), events);
      }
      if (item.sp) {
        t.sp = Math.min(t.maxSp, t.sp + item.sp);
        pushEvent(events, { type: 'sp', uid: t.uid, amount: item.sp });
        addLog(battle, SR.t('log.sp', { target: nm(t), n: item.sp }), events);
      }
      if (item.revive && !t.alive) {
        t.alive = true;
        t.hp = Math.round(t.maxHp * item.revive);
        t.statuses = [];
        pushEvent(events, { type: 'revive', uid: t.uid, amount: t.hp });
        addLog(battle, SR.t('log.revive', { target: nm(t) }), events);
      }
      if (item.cleanse) cleanse(t, battle, events);
      if (item.shield && t.alive) {
        addStatus(battle, t, 'shield', 99, Math.round(t.maxHp * item.shield), events, actor);
      }
      if (item.buff && t.alive) {
        addStatus(battle, t, item.buff.status, item.buff.turns, item.buff.value, events, actor);
      }
      if (item.debuff && t.alive) {
        addStatus(battle, t, item.debuff.status, item.debuff.turns, item.debuff.value, events, actor);
      }
    });
    pushEvent(events, { type: 'item', itemId });
    return events;
  };

  E.aiAction = function (battle, actor) {
    const usable = actor.skills.filter((s, i) => !actor.cooldowns[i]);
    const foes = E.alive(battle, 'ally');
    const friends = E.alive(battle, 'enemy');
    let pool = usable.length ? usable : [actor.basic];
    // Prefer healing when an ally is hurt
    const wounded = friends.filter((u) => u.hp / u.maxHp < 0.55);
    const healSkill = pool.find((s) => s.heal && s.target === 'allAllies');
    if (healSkill && wounded.length >= 2 && Math.random() < 0.75) {
      return { kind: 'skill', skillId: null, skill: healSkill };
    }
    // Weighted pick
    const weights = pool.map((s) => (s.weight || 1) * (s.power > 0 ? 1 : 0.7));
    let total = weights.reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    let chosen = pool[0];
    for (let i = 0; i < pool.length; i++) {
      roll -= weights[i];
      if (roll <= 0) { chosen = pool[i]; break; }
    }
    return { kind: 'skill', skill: chosen };
  };

  E.aiAct = function (battle, actor) {
    const choice = E.aiAction(battle, actor);
    if (!choice.skill) return [];
    let targetUid = null;
    if (choice.skill.target === 'enemy' || choice.skill.target === 'ally') {
      const foes = choice.skill.target === 'enemy' ? E.alive(battle, 'ally') : E.alive(battle, 'enemy');
      if (foes.length) {
        // 55% chance to hit the weakest
        const sorted = foes.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
        targetUid = (Math.random() < 0.55 ? sorted[0] : foes[Math.floor(Math.random() * foes.length)]).uid;
      }
    }
    const events = [];
    applySkill(battle, actor, choice.skill, targetUid, { isSkill: true }, events);
    if (choice.skill.cd) {
      const idx = actor.skills.indexOf(choice.skill);
      if (idx >= 0) actor.cooldowns[idx] = choice.skill.cd;
    }
    E.checkEnd(battle, events);
    return events;
  };

  E.estimateDamage = function (battle, actor, skill, target) {
    if (!target) return 0;
    const atk = statOf(actor, 'atk');
    const def = statOf(target, 'def') * (1 - clamp((skill.ignoreDef || 0) + (actor.mods.ignoreDefPct || 0), 0, 0.8));
    let dmg = atk * skill.power * (100 / (100 + def * 2.4));
    if (D.strongVs[skill.element] === target.element) dmg *= 1.5;
    else if (D.weakVs[skill.element] === target.element) dmg *= 0.75;
    if (hasStatus(target, 'mark')) dmg *= 1.2;
    return Math.round(dmg);
  };

  E.resetForRetry = function (battle, run, meta) {
    // rebuild a fresh battle from the same setup is handled by the app
    return battle;
  };
})();
