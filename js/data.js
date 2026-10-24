/* Sakura Requiem — content data (bilingual) */
window.SR = window.SR || {};

SR.DATA = {};

/* ---------- Elements ---------- */
SR.DATA.elements = {
  ember: { name: 'element.ember', color: '#ff7a6b', icon: '🔥' },
  frost: { name: 'element.frost', color: '#7cc7ff', icon: '❄' },
  gale:  { name: 'element.gale',  color: '#7ee0b0', icon: '🍃' },
  void:  { name: 'element.void',  color: '#c39bff', icon: '✦' }
};

// attacker element -> element it is strong against
SR.DATA.strongVs = { ember: 'frost', frost: 'gale', gale: 'ember' };

SR.DATA.weakVs = { frost: 'ember', gale: 'frost', ember: 'gale' };

/* ---------- Statuses ---------- */
SR.DATA.statuses = {
  burn:   { debuff: true,  dot: 0.05, color: '#ff7a4d', icon: '🔥' },
  poison: { debuff: true,  dot: 0.04, color: '#a6e05a', icon: '☠' },
  bleed:  { debuff: true,  dot: 0.035, color: '#ff5f7a', icon: '🩸' },
  chill:  { debuff: true,  spd: -0.25, color: '#8fd4ff', icon: '❄' },
  stun:   { debuff: true,  skip: true, color: '#ffe066', icon: '✷' },
  atkDown:{ debuff: true,  atk: -0.25, color: '#ff9a9a', icon: '↓' },
  defDown:{ debuff: true,  def: -0.25, color: '#ffb28f', icon: '↓' },
  spdDown:{ debuff: true,  spd: -0.2, color: '#b7c4ff', icon: '↓' },
  mark:   { debuff: true,  taken: 0.2, color: '#ff86c8', icon: '◎' },
  atkUp:  { debuff: false, atk: 0.3, color: '#ffcf6b', icon: '↑' },
  defUp:  { debuff: false, def: 0.3, color: '#9fd8ff', icon: '↑' },
  spdUp:  { debuff: false, spd: 0.25, color: '#b6ffce', icon: '↑' },
  regen:  { debuff: false, hot: 0.06, color: '#8ff0b0', icon: '✚' },
  shield: { debuff: false, color: '#cfe9ff', icon: '◈' },
  evade:  { debuff: false, color: '#d8c6ff', icon: '≈' }
};

/* ---------- Heroes ---------- */
SR.DATA.heroes = [
  {
    id: 'hana',
    name: { en: 'Hana', es: 'Hana' },
    title: { en: 'Ember Warden', es: 'Guardiana de la Brasa' },
    element: 'ember',
    color: '#ff7a8a',
    accent: '#ffc4a8',
    quote: {
      en: 'If the dead want a song, they will hear mine first.',
      es: 'Si los muertos quieren una canción, oirán la mía primero.'
    },
    base: { hp: 124, sp: 26, atk: 25, def: 15, spd: 18, crit: 0.07 },
    growth: { hp: 10, sp: 2, atk: 3.2, def: 1.6, spd: 0.8 },
    passive: {
      name: { en: 'Ember Bloom', es: 'Flor de Brasa' },
      desc: { en: 'Deals 15% more damage to burning foes.', es: 'Hace un 15% más de daño a enemigos en llamas.' }
    },
    basic: { name: { en: 'Petal Blade', es: 'Hoja de Pétalo' }, power: 1.05, element: 'ember', spGain: 2 },
    skills: [
      {
        id: 'bloomSlash', sp: 6, element: 'ember', power: 1.55, target: 'enemy', unlock: 1,
        name: { en: 'Bloom Slash', es: 'Tajo Florido' },
        desc: { en: 'A blazing cut. 40% chance to Burn.', es: 'Un corte ardiente. 40% de quemar.' },
        effects: [{ status: 'burn', chance: 0.4, turns: 3 }]
      },
      {
        id: 'petalStorm', sp: 16, element: 'ember', power: 0.82, target: 'allEnemies', unlock: 1,
        name: { en: 'Petal Storm', es: 'Tormenta de Pétalos' },
        desc: { en: 'Scorching petals strike all foes. 30% chance to Burn.', es: 'Pétalos abrasadores golpean a todos. 30% de quemar.' },
        effects: [{ status: 'burn', chance: 0.3, turns: 3 }]
      },
      {
        id: 'crimsonVow', sp: 8, element: 'ember', power: 0, target: 'self', unlock: 3,
        name: { en: 'Crimson Vow', es: 'Juramento Carmesí' },
        desc: { en: 'Raises own ATK by 35% for 3 turns and gains 20 resonance.', es: 'Aumenta su ATQ un 35% durante 3 turnos y gana 20 de resonancia.' },
        effects: [{ status: 'atkUp', chance: 1, turns: 3, value: 0.35 }],
        resonance: 20
      },
      {
        id: 'fallingBlossom', sp: 22, element: 'ember', power: 2.7, target: 'enemy', unlock: 6,
        name: { en: 'Falling Blossom', es: 'Flor que Cae' },
        desc: { en: 'A devastating strike. +60% damage to burning foes.', es: 'Un golpe devastador. +60% de daño a enemigos en llamas.' },
        bonusVsStatus: { status: 'burn', bonus: 0.6 }
      }
    ],
    ult: {
      id: 'thousandPetals', sp: 0, element: 'ember', power: 3.0, target: 'allEnemies',
      name: { en: 'Thousand Petal Requiem', es: 'Réquiem de Mil Pétalos' },
      desc: { en: 'A storm of burning petals. Burns all foes. Ignores 20% DEF.', es: 'Una tormenta de pétalos ardientes. Quema a todos. Ignora un 20% de DEF.' },
      effects: [{ status: 'burn', chance: 0.7, turns: 3 }], ignoreDef: 0.2
    }
  },
  {
    id: 'yuki',
    name: { en: 'Yuki', es: 'Yuki' },
    title: { en: 'Frost Shrine Maiden', es: 'Sacerdotisa de Escarcha' },
    element: 'frost',
    color: '#8fd4ff',
    accent: '#e6f6ff',
    quote: {
      en: 'A requiem is not an ending. It is permission to rest.',
      es: 'Un réquiem no es un final. Es permiso para descansar.'
    },
    base: { hp: 112, sp: 40, atk: 19, def: 18, spd: 15, crit: 0.05 },
    growth: { hp: 8, sp: 3, atk: 2.2, def: 2.0, spd: 0.6 },
    passive: {
      name: { en: 'Moonlit Mercy', es: 'Misericordia Lunar' },
      desc: { en: 'All healing is 20% stronger.', es: 'Todas las curaciones son un 20% más fuertes.' }
    },
    basic: { name: { en: 'Frost Staff', es: 'Bastón de Escarcha' }, power: 0.9, element: 'frost', spGain: 3 },
    skills: [
      {
        id: 'frostLance', sp: 6, element: 'frost', power: 1.45, target: 'enemy', unlock: 1,
        name: { en: 'Frost Lance', es: 'Lanza de Escarcha' },
        desc: { en: 'A spear of ice. 40% chance to Chill.', es: 'Una lanza de hielo. 40% de aplicar Frío.' },
        effects: [{ status: 'chill', chance: 0.4, turns: 2 }]
      },
      {
        id: 'veilOfSnow', sp: 14, element: 'frost', power: 0, target: 'allAllies', unlock: 1,
        name: { en: 'Veil of Snow', es: 'Velo de Nieve' },
        desc: { en: 'Heals all allies for 22% HP and grants Regen.', es: 'Cura a todos un 22% de PV y otorga Regeneración.' },
        heal: 0.22,
        effects: [{ status: 'regen', chance: 1, turns: 3 }]
      },
      {
        id: 'moonlitWard', sp: 10, element: 'frost', power: 0, target: 'ally', unlock: 3,
        name: { en: 'Moonlit Ward', es: 'Amparo Lunar' },
        desc: { en: 'Shields an ally for 30% max HP and raises DEF.', es: 'Escuda a un aliado un 30% de sus PV máximos y sube su DEF.' },
        shield: 0.3,
        effects: [{ status: 'defUp', chance: 1, turns: 3 }]
      },
      {
        id: 'hymnOfEndings', sp: 20, element: 'frost', power: 1.05, target: 'allEnemies', unlock: 6,
        name: { en: 'Hymn of Endings', es: 'Himno de los Finales' },
        desc: { en: 'Chills all foes and cleanses the party.', es: 'Aplica Frío a todos los enemigos y purifica al grupo.' },
        effects: [{ status: 'chill', chance: 0.45, turns: 2 }], cleanseAllies: true
      }
    ],
    ult: {
      id: 'silverLament', sp: 0, element: 'frost', power: 0, target: 'allAllies',
      name: { en: 'Silver Moon Lament', es: 'Lamento de Luna Plateada' },
      desc: { en: 'Heals all allies 40%, cleanses, revives the fallen at 25%.', es: 'Cura un 40% a todos, purifica y revive a los caídos al 25%.' },
      heal: 0.4, cleanseAllies: true, reviveAllies: 0.25,
      effects: [{ status: 'defUp', chance: 1, turns: 2 }]
    }
  },
  {
    id: 'ren',
    name: { en: 'Ren', es: 'Ren' },
    title: { en: 'Void Shinobi', es: 'Shinobi del Vacío' },
    element: 'void',
    color: '#c39bff',
    accent: '#9fe8ff',
    quote: {
      en: 'I do not pray. I make sure the prayer has a target.',
      es: 'Yo no rezo. Me aseguro de que la plegaria tenga un objetivo.'
    },
    base: { hp: 108, sp: 32, atk: 27, def: 12, spd: 22, crit: 0.12 },
    growth: { hp: 8, sp: 2.4, atk: 3.4, def: 1.3, spd: 1.1 },
    passive: {
      name: { en: 'Hollow Step', es: 'Paso Hueco' },
      desc: { en: '10% chance to evade incoming attacks.', es: '10% de probabilidad de esquivar ataques.' }
    },
    basic: { name: { en: 'Kunai', es: 'Kunai' }, power: 1.0, element: 'void', spGain: 2 },
    skills: [
      {
        id: 'shadowCut', sp: 6, element: 'void', power: 1.5, target: 'enemy', unlock: 1,
        name: { en: 'Shadow Cut', es: 'Corte de Sombra' },
        desc: { en: 'A precise slash that ignores 25% DEF.', es: 'Un tajo preciso que ignora un 25% de DEF.' },
        ignoreDef: 0.25
      },
      {
        id: 'smokeVeil', sp: 9, element: 'void', power: 0, target: 'self', unlock: 1,
        name: { en: 'Smoke Veil', es: 'Velo de Humo' },
        desc: { en: 'Gains Evasion and Haste for 2 turns.', es: 'Obtiene Evasión y Prisa durante 2 turnos.' },
        effects: [
          { status: 'evade', chance: 1, turns: 2, value: 0.5 },
          { status: 'spdUp', chance: 1, turns: 2 }
        ]
      },
      {
        id: 'hexNail', sp: 12, element: 'void', power: 1.0, target: 'enemy', unlock: 3,
        name: { en: 'Hex Nail', es: 'Clavo Maldito' },
        desc: { en: 'Marks the target and lowers its DEF for 3 turns.', es: 'Marca al objetivo y baja su DEF durante 3 turnos.' },
        effects: [
          { status: 'mark', chance: 1, turns: 3 },
          { status: 'defDown', chance: 1, turns: 3 }
        ]
      },
      {
        id: 'voidRift', sp: 20, element: 'void', power: 2.3, target: 'enemy', unlock: 6,
        name: { en: 'Void Rift', es: 'Grieta del Vacío' },
        desc: { en: 'Tears reality. +80% damage to foes below 30% HP.', es: 'Desgarra la realidad. +80% de daño a enemigos bajo el 30% de PV.' },
        executeBonus: { below: 0.3, bonus: 0.8 }
      }
    ],
    ult: {
      id: 'hollowEclipse', sp: 0, element: 'void', power: 2.2, target: 'allEnemies',
      name: { en: 'Hollow Eclipse', es: 'Eclipse Hueco' },
      desc: { en: 'Darkness devours all foes. Ignores 35% DEF and marks them.', es: 'La oscuridad devora a todos. Ignora un 35% de DEF y los marca.' },
      ignoreDef: 0.35,
      effects: [{ status: 'mark', chance: 1, turns: 3 }]
    }
  }
];

/* ---------- Boons (chosen on level up) ---------- */
SR.DATA.boons = {
  ironPetal:   { name: { en: 'Iron Petal', es: 'Pétalo de Hierro' }, desc: { en: '+14% max HP.', es: '+14% de PV máximos.' }, mod: { maxHpPct: 0.14 } },
  bloodSong:   { name: { en: 'Blood Song', es: 'Canción de Sangre' }, desc: { en: '+10% attack.', es: '+10% de ataque.' }, mod: { atkPct: 0.1 } },
  stoneSkin:   { name: { en: 'Stone Skin', es: 'Piel de Piedra' }, desc: { en: '+15% defense.', es: '+15% de defensa.' }, mod: { defPct: 0.15 } },
  swiftWind:   { name: { en: 'Swift Wind', es: 'Viento Veloz' }, desc: { en: '+7 speed.', es: '+7 de velocidad.' }, mod: { spdFlat: 7 } },
  keenEdge:    { name: { en: 'Keen Edge', es: 'Filo Agudo' }, desc: { en: '+8% critical chance.', es: '+8% de probabilidad crítica.' }, mod: { critFlat: 0.08 } },
  deepWound:   { name: { en: 'Deep Wound', es: 'Herida Profunda' }, desc: { en: '+30% critical damage.', es: '+30% de daño crítico.' }, mod: { critDmgPct: 0.3 } },
  firstStrike: { name: { en: 'First Strike', es: 'Primer Golpe' }, desc: { en: '+25% damage during round 1.', es: '+25% de daño durante la ronda 1.' }, mod: { firstStrikePct: 0.25 } },
  executioner: { name: { en: 'Executioner', es: 'Ejecutora' }, desc: { en: '+20% damage to foes below 35% HP.', es: '+20% de daño a enemigos bajo el 35% de PV.' }, mod: { executePct: 0.2 } },
  lifedrain:   { name: { en: 'Petal Thirst', es: 'Sed de Pétalos' }, desc: { en: 'Heal for 12% of damage dealt.', es: 'Cura un 12% del daño infligido.' }, mod: { lifestealPct: 0.12 } },
  guardMaster: { name: { en: 'Guard Master', es: 'Maestra de Guardia' }, desc: { en: 'Guard reduces 70% damage and heals 5% HP.', es: 'La guardia reduce un 70% del daño y cura un 5% de PV.' }, mod: { guardBonus: 0.2, guardHeal: 0.05 } },
  resonant:    { name: { en: 'Resonant Soul', es: 'Alma Resonante' }, desc: { en: 'Start battles with 35 resonance.', es: 'Empiezas los combates con 35 de resonancia.' }, mod: { resonanceStart: 35 } },
  purifier:    { name: { en: 'Purifier', es: 'Purificadora' }, desc: { en: '+25% healing done.', es: '+25% de curación realizada.' }, mod: { healPct: 0.25 } },
  voidtouched: { name: { en: 'Voidtouched', es: 'Tocada por el Vacío' }, desc: { en: 'Attacks ignore 12% DEF.', es: 'Los ataques ignoran un 12% de DEF.' }, mod: { ignoreDefPct: 0.12 } },
  emberHeart:  { name: { en: 'Ember Heart', es: 'Corazón de Brasa' }, desc: { en: '+20% Ember damage.', es: '+20% de daño de Brasa.' }, mod: { dmgElement: { ember: 0.2 } } },
  frostVein:   { name: { en: 'Frost Vein', es: 'Vena de Escarcha' }, desc: { en: '+20% Frost damage.', es: '+20% de daño de Escarcha.' }, mod: { dmgElement: { frost: 0.2 } } },
  galeStep:    { name: { en: 'Gale Step', es: 'Paso de Viento' }, desc: { en: '+20% Gale damage.', es: '+20% de daño de Viento.' }, mod: { dmgElement: { gale: 0.2 } } },
  hollowGift:  { name: { en: 'Hollow Gift', es: 'Don Hueco' }, desc: { en: '+20% Void damage.', es: '+20% de daño de Vacío.' }, mod: { dmgElement: { void: 0.2 } } },
  counter:     { name: { en: 'Counterbloom', es: 'Contraflor' }, desc: { en: '25% chance to counter when hit.', es: '25% de probabilidad de contraatacar al recibir daño.' }, mod: { counterPct: 0.25 } },
  spiritFlow:  { name: { en: 'Spirit Flow', es: 'Flujo Espiritual' }, desc: { en: 'Regenerate 2 extra SP each turn.', es: 'Regenera 2 EP extra por turno.' }, mod: { spRegenFlat: 2 } },
  phantomStep: { name: { en: 'Phantom Step', es: 'Paso Fantasma' }, desc: { en: '+8% evasion.', es: '+8% de evasión.' }, mod: { evadePct: 0.08 } }
};

/* ---------- Relics ---------- */
SR.DATA.relics = {
  sakuraPin:   { price: 120, essence: 1, name: { en: 'Sakura Hairpin', es: 'Horquilla de Sakura' }, desc: { en: '+20 max HP. +1 SP regen.', es: '+20 PV máximos. +1 regeneración de EP.' }, mod: { maxHpFlat: 20, spRegenFlat: 1 } },
  foxBell:     { price: 150, essence: 1, name: { en: 'Fox Bell', es: 'Campana de Zorro' }, desc: { en: '+8 SPD. +5% crit.', es: '+8 VEL. +5% crítico.' }, mod: { spdFlat: 8, critFlat: 0.05 } },
  ironFan:     { price: 130, essence: 1, name: { en: 'Iron Fan', es: 'Abanico de Hierro' }, desc: { en: '+14 DEF.', es: '+14 DEF.' }, mod: { defFlat: 14 } },
  bloodOath:   { price: 160, essence: 2, name: { en: 'Bloodied Oath', es: 'Juramento Sangriento' }, desc: { en: '+20 ATK. -10 max HP.', es: '+20 ATQ. -10 PV máximos.' }, mod: { atkFlat: 20, maxHpFlat: -10 } },
  moonMirror:  { price: 180, essence: 2, name: { en: 'Moon Mirror', es: 'Espejo Lunar' }, desc: { en: '+15% healing. +15 starting resonance.', es: '+15% curación. +15 de resonancia inicial.' }, mod: { healPct: 0.15, resonanceStart: 15 } },
  kitsuneMask: { price: 200, essence: 2, name: { en: 'Kitsune Mask', es: 'Máscara de Kitsune' }, desc: { en: '+15% skill damage.', es: '+15% de daño de habilidades.' }, mod: { skillDmgPct: 0.15 } },
  abyssSigil:  { price: 220, essence: 2, name: { en: 'Abyss Sigil', es: 'Sigilo del Abismo' }, desc: { en: '+20% ultimate damage.', es: '+20% de daño de definitiva.' }, mod: { ultDmgPct: 0.2 } },
  stormBeads:  { price: 170, essence: 1, name: { en: 'Storm Beads', es: 'Cuentas de Tormenta' }, desc: { en: '+20% Gale damage. +4 SPD.', es: '+20% de daño de Viento. +4 VEL.' }, mod: { dmgElement: { gale: 0.2 }, spdFlat: 4 } },
  emberLocket: { price: 170, essence: 1, name: { en: 'Ember Locket', es: 'Relicario de Brasa' }, desc: { en: '+20% Ember damage.', es: '+20% de daño de Brasa.' }, mod: { dmgElement: { ember: 0.2 } } },
  frozenTear:  { price: 170, essence: 1, name: { en: 'Frozen Tear', es: 'Lágrima Helada' }, desc: { en: '+20% Frost damage.', es: '+20% de daño de Escarcha.' }, mod: { dmgElement: { frost: 0.2 } } },
  voidShard:   { price: 190, essence: 2, name: { en: 'Void Shard', es: 'Fragmento de Vacío' }, desc: { en: '+20% Void damage. Ignores 10% DEF.', es: '+20% de daño de Vacío. Ignora un 10% de DEF.' }, mod: { dmgElement: { void: 0.2 }, ignoreDefPct: 0.1 } },
  guardianStone:{ price: 160, essence: 1, name: { en: 'Guardian Stone', es: 'Piedra Guardiana' }, desc: { en: '+25 max HP. +8 DEF.', es: '+25 PV máximos. +8 DEF.' }, mod: { maxHpFlat: 25, defFlat: 8 } },
  dancerVeil:  { price: 200, essence: 2, name: { en: 'Dancer Veil', es: 'Velo de Danza' }, desc: { en: '+8% evasion. +5 SPD.', es: '+8% evasión. +5 VEL.' }, mod: { evadePct: 0.08, spdFlat: 5 } }
};

/* ---------- Items ---------- */
SR.DATA.items = {
  onigiri:      { price: 40,  heal: 0.35, target: 'ally', name: { en: 'Rice Ball', es: 'Onigiri' }, desc: { en: 'Restores 35% HP to one ally.', es: 'Restaura un 35% de PV a un aliado.' } },
  bigOnigiri:   { price: 90,  heal: 0.65, target: 'ally', name: { en: 'Grand Rice Ball', es: 'Onigiri Gigante' }, desc: { en: 'Restores 65% HP to one ally.', es: 'Restaura un 65% de PV a un aliado.' } },
  sake:         { price: 50,  sp: 30, target: 'ally', name: { en: 'Sacred Sake', es: 'Sake Sagrado' }, desc: { en: 'Restores 30 SP to one ally.', es: 'Restaura 30 EP a un aliado.' } },
  petalRevive:  { price: 120, revive: 0.4, target: 'ally', name: { en: 'Revival Petal', es: 'Pétalo de Retorno' }, desc: { en: 'Revives a fallen ally at 40% HP.', es: 'Revive a un aliado caído con un 40% de PV.' } },
  salt:         { price: 60,  cleanse: true, target: 'allAllies', name: { en: 'Purifying Salt', es: 'Sal Purificadora' }, desc: { en: 'Cleanses all debuffs from the party.', es: 'Purifica todas las maldiciones del grupo.' } },
  warDrum:      { price: 90,  buff: { status: 'atkUp', turns: 3, value: 0.3 }, target: 'allAllies', name: { en: 'War Drum', es: 'Tambor de Guerra' }, desc: { en: 'Raises party ATK by 30% for 3 turns.', es: 'Aumenta el ATQ del grupo un 30% por 3 turnos.' } },
  elixir:       { price: 180, heal: 0.6, target: 'allAllies', name: { en: 'Moonlit Elixir', es: 'Elixir Lunar' }, desc: { en: 'Restores 60% HP to the whole party.', es: 'Restaura un 60% de PV a todo el grupo.' } },
  smokeBomb:    { price: 80,  debuff: { status: 'atkDown', turns: 2, value: 0.3 }, target: 'allEnemies', name: { en: 'Smoke Bomb', es: 'Bomba de Humo' }, desc: { en: 'Lowers all enemy ATK by 30% for 2 turns.', es: 'Baja un 30% el ATQ enemigo por 2 turnos.' } },
  moonCharm:    { price: 70,  shield: 0.4, target: 'ally', name: { en: 'Moon Charm', es: 'Amuleto Lunar' }, desc: { en: 'Shields one ally for 40% of max HP.', es: 'Escuda a un aliado un 40% de sus PV máximos.' } }
};

/* ---------- Enemies ---------- */
SR.DATA.enemies = {
  wisp: {
    name: { en: 'Lantern Wisp', es: 'Fuego Errante' }, element: 'ember', color: '#ff9a6b',
    base: { hp: 46, atk: 11, def: 5, spd: 9 }, growth: { hp: 6.5, atk: 1.35, def: 0.7, spd: 0.35 },
    skills: [
      { name: { en: 'Ember Kiss', es: 'Beso de Brasa' }, power: 1.15, element: 'ember', target: 'enemy', weight: 2, effects: [{ status: 'burn', chance: 0.2, turns: 2 }] }
    ]
  },
  wrapper: {
    name: { en: 'Paper Wraith', es: 'Espectro de Papel' }, element: 'gale', color: '#c9f0d8',
    base: { hp: 40, atk: 12, def: 4, spd: 12 }, growth: { hp: 5.5, atk: 1.4, def: 0.6, spd: 0.5 },
    skills: [
      { name: { en: 'Paper Cut', es: 'Corte de Papel' }, power: 1.1, element: 'gale', target: 'enemy', weight: 2 },
      { name: { en: 'Whirling Pages', es: 'Páginas Giratorias' }, power: 0.62, element: 'gale', target: 'allEnemies', weight: 1, cd: 2 }
    ]
  },
  onibi: {
    name: { en: 'Onibi Swarm', es: 'Enjambre Onibi' }, element: 'ember', color: '#ffb36b',
    base: { hp: 34, atk: 9, def: 3, spd: 15 }, growth: { hp: 5, atk: 1.2, def: 0.5, spd: 0.55 },
    skills: [
      { name: { en: 'Firefly Flurry', es: 'Ráfaga de Luciérnagas' }, power: 0.42, element: 'ember', target: 'enemy', hits: 3, weight: 2, effects: [{ status: 'burn', chance: 0.12, turns: 2 }] }
    ]
  },
  kitsune: {
    name: { en: 'Kitsune Trickster', es: 'Kitsune Tramposo' }, element: 'void', color: '#d3a8ff',
    base: { hp: 52, atk: 13, def: 6, spd: 16 }, growth: { hp: 6.5, atk: 1.5, def: 0.8, spd: 0.6 },
    skills: [
      { name: { en: 'Fox Fire', es: 'Fuego Zorro' }, power: 1.25, element: 'void', target: 'enemy', weight: 2, effects: [{ status: 'burn', chance: 0.3, turns: 2 }] },
      { name: { en: 'Illusion', es: 'Ilusión' }, power: 0, target: 'allEnemies', weight: 1, cd: 3, effects: [{ status: 'atkDown', chance: 0.7, turns: 2 }] },
      { name: { en: 'Hex Mark', es: 'Marca Maldita' }, power: 0.8, element: 'void', target: 'enemy', weight: 1, effects: [{ status: 'mark', chance: 1, turns: 2 }] }
    ]
  },
  monk: {
    name: { en: 'Drowned Monk', es: 'Monje Ahogado' }, element: 'frost', color: '#8ec8e8',
    base: { hp: 66, atk: 13, def: 9, spd: 7 }, growth: { hp: 8, atk: 1.4, def: 1.1, spd: 0.3 },
    skills: [
      { name: { en: 'Tide Fist', es: 'Puño de Marea' }, power: 1.2, element: 'frost', target: 'enemy', weight: 2 },
      { name: { en: 'Cold Vigil', es: 'Vigilia Fría' }, power: 0, target: 'allAllies', weight: 1, cd: 3, heal: 0.16 }
    ]
  },
  sentinel: {
    name: { en: 'Clockwork Sentinel', es: 'Centinela de Relojería' }, element: 'gale', color: '#b9c4d8',
    base: { hp: 74, atk: 14, def: 12, spd: 8 }, growth: { hp: 8.5, atk: 1.5, def: 1.3, spd: 0.35 },
    skills: [
      { name: { en: 'Gear Slam', es: 'Golpe de Engranaje' }, power: 1.4, element: 'gale', target: 'enemy', weight: 2 },
      { name: { en: 'Overclock', es: 'Sobrecarga' }, power: 0, target: 'self', weight: 1, cd: 3, effects: [{ status: 'atkUp', chance: 1, turns: 3, value: 0.35 }] }
    ]
  },
  courtier: {
    name: { en: 'Hollow Courtier', es: 'Cortesano Hueco' }, element: 'void', color: '#b28cff',
    base: { hp: 62, atk: 15, def: 8, spd: 13 }, growth: { hp: 7.5, atk: 1.6, def: 0.9, spd: 0.5 },
    skills: [
      { name: { en: 'Whispered Poison', es: 'Veneno Susurrado' }, power: 1.15, element: 'void', target: 'enemy', weight: 2, effects: [{ status: 'poison', chance: 0.35, turns: 3 }] },
      { name: { en: 'Courtly Bow', es: 'Reverencia Cortesana' }, power: 0.7, element: 'void', target: 'allEnemies', weight: 1, cd: 2 }
    ]
  },
  mirror: {
    name: { en: 'Mirror Maiden', es: 'Doncella del Espejo' }, element: 'frost', color: '#b9e6ff',
    base: { hp: 58, atk: 13, def: 10, spd: 14 }, growth: { hp: 7, atk: 1.45, def: 1.0, spd: 0.55 },
    skills: [
      { name: { en: 'Shard Volley', es: 'Lluvia de Esquirlas' }, power: 1.3, element: 'frost', target: 'enemy', weight: 2 },
      { name: { en: 'Reflect', es: 'Reflejo' }, power: 0, target: 'self', weight: 1, cd: 2, effects: [{ status: 'defUp', chance: 1, turns: 2 }] }
    ]
  },
  drummer: {
    name: { en: 'Bone Drummer', es: 'Tamborilero de Hueso' }, element: 'void', color: '#e0c3a0',
    base: { hp: 70, atk: 14, def: 9, spd: 10 }, growth: { hp: 8, atk: 1.5, def: 0.9, spd: 0.4 },
    skills: [
      { name: { en: 'Dirge', es: 'Marcha Fúnebre' }, power: 0.72, element: 'void', target: 'allEnemies', weight: 2, cd: 2, effects: [{ status: 'bleed', chance: 0.35, turns: 3 }] },
      { name: { en: 'Bone Beat', es: 'Latido de Hueso' }, power: 1.2, element: 'void', target: 'enemy', weight: 1 }
    ]
  },
  spider: {
    name: { en: 'Spider of Regret', es: 'Araña del Arrepentimiento' }, element: 'gale', color: '#a9d8b8',
    base: { hp: 60, atk: 14, def: 7, spd: 17 }, growth: { hp: 7, atk: 1.55, def: 0.8, spd: 0.7 },
    skills: [
      { name: { en: 'Binding Web', es: 'Telaraña' }, power: 0.8, element: 'gale', target: 'enemy', weight: 1, effects: [{ status: 'spdDown', chance: 0.7, turns: 2 }] },
      { name: { en: 'Venom Bite', es: 'Mordida Venenosa' }, power: 1.25, element: 'gale', target: 'enemy', weight: 2, effects: [{ status: 'poison', chance: 0.4, turns: 3 }] }
    ]
  },

  /* ----- Bosses ----- */
  blightbloom: {
    name: { en: 'Blightbloom', es: 'Flor de la Ruina' }, element: 'void', boss: true, color: '#d38cff',
    base: { hp: 280, atk: 15, def: 9, spd: 11 }, growth: { hp: 18, atk: 1.7, def: 1.1, spd: 0.4 },
    skills: [
      { name: { en: 'Rotting Petals', es: 'Pétalos Podridos' }, power: 0.78, element: 'void', target: 'allEnemies', weight: 2, cd: 2, effects: [{ status: 'poison', chance: 0.4, turns: 3 }] },
      { name: { en: 'Thorn Lash', es: 'Látigo de Espinas' }, power: 1.45, element: 'void', target: 'enemy', weight: 2 },
      { name: { en: 'Wilt', es: 'Marchitar' }, power: 0, target: 'allEnemies', weight: 1, cd: 3, effects: [{ status: 'defDown', chance: 0.8, turns: 2 }] }
    ],
    phase: { at: 0.5, line: { en: 'The blight blooms wider…', es: 'La ruina florece más…' }, effects: [{ status: 'atkUp', chance: 1, turns: 99, value: 0.3 }] }
  },
  lanternEater: {
    name: { en: 'The Lantern Eater', es: 'El Devorador de Faroles' }, element: 'ember', boss: true, color: '#ff8a5c',
    base: { hp: 420, atk: 18, def: 11, spd: 12 }, growth: { hp: 22, atk: 1.9, def: 1.2, spd: 0.4 },
    skills: [
      { name: { en: 'Gluttonous Flame', es: 'Llama Glotona' }, power: 1.3, element: 'ember', target: 'enemy', weight: 2, effects: [{ status: 'burn', chance: 0.5, turns: 3 }] },
      { name: { en: 'Lantern Feast', es: 'Festín de Faroles' }, power: 0.82, element: 'ember', target: 'allEnemies', weight: 2, cd: 2 },
      { name: { en: 'Gorge', es: 'Atracón' }, power: 0, target: 'self', weight: 1, cd: 4, heal: 0.12, effects: [{ status: 'atkUp', chance: 1, turns: 3 }] }
    ],
    phase: { at: 0.45, line: { en: 'Hunger without end!', es: '¡Hambre sin fin!' }, effects: [{ status: 'atkUp', chance: 1, turns: 99, value: 0.45 }] }
  },
  abbot: {
    name: { en: 'Abbot of Tides', es: 'Abad de las Mareas' }, element: 'frost', boss: true, color: '#7fb6d9',
    base: { hp: 560, atk: 20, def: 15, spd: 10 }, growth: { hp: 26, atk: 2.0, def: 1.5, spd: 0.35 },
    skills: [
      { name: { en: 'Funeral Tide', es: 'Marea Fúnebre' }, power: 0.9, element: 'frost', target: 'allEnemies', weight: 2, cd: 2, effects: [{ status: 'chill', chance: 0.4, turns: 2 }] },
      { name: { en: 'Drowning Palm', es: 'Palma del Ahogo' }, power: 1.6, element: 'frost', target: 'enemy', weight: 2 },
      { name: { en: 'Tidecall', es: 'Llamada de Marea' }, power: 0, target: 'allAllies', weight: 1, cd: 3, heal: 0.18, cleanse: true }
    ],
    phase: { at: 0.5, line: { en: 'The tide remembers every sin.', es: 'La marea recuerda cada pecado.' }, effects: [{ status: 'defUp', chance: 1, turns: 99, value: 0.3 }] }
  },
  shogun: {
    name: { en: 'Shogun Kurogane', es: 'Shogun Kurogane' }, element: 'gale', boss: true, color: '#9fb0c9',
    base: { hp: 720, atk: 23, def: 18, spd: 14 }, growth: { hp: 30, atk: 2.2, def: 1.6, spd: 0.45 },
    skills: [
      { name: { en: 'Thousand Cuts', es: 'Mil Cortes' }, power: 0.5, element: 'gale', target: 'enemy', hits: 3, weight: 2 },
      { name: { en: 'Iron Tempest', es: 'Tempestad de Hierro' }, power: 0.95, element: 'gale', target: 'allEnemies', weight: 2, cd: 2, effects: [{ status: 'bleed', chance: 0.4, turns: 3 }] },
      { name: { en: 'War Machine', es: 'Máquina de Guerra' }, power: 0, target: 'self', weight: 1, cd: 3, effects: [{ status: 'atkUp', chance: 1, turns: 3, value: 0.4 }, { status: 'spdUp', chance: 1, turns: 3 }] }
    ],
    phase: { at: 0.4, line: { en: 'The shogun draws a second blade.', es: 'El shogun desenvaina una segunda hoja.' }, effects: [{ status: 'atkUp', chance: 1, turns: 99, value: 0.35 }] }
  },
  empress: {
    name: { en: 'Mirror Empress', es: 'Emperatriz del Espejo' }, element: 'frost', boss: true, color: '#c8b6ff',
    base: { hp: 880, atk: 25, def: 20, spd: 16 }, growth: { hp: 34, atk: 2.4, def: 1.8, spd: 0.5 },
    skills: [
      { name: { en: 'Shattered Hall', es: 'Salón Roto' }, power: 0.92, element: 'frost', target: 'allEnemies', weight: 2, cd: 2, effects: [{ status: 'mark', chance: 0.5, turns: 2 }] },
      { name: { en: 'Glass Guillotine', es: 'Guillotina de Cristal' }, power: 1.7, element: 'frost', target: 'enemy', weight: 2 },
      { name: { en: 'Vanity', es: 'Vanidad' }, power: 0, target: 'allAllies', weight: 1, cd: 3, heal: 0.15, effects: [{ status: 'defUp', chance: 1, turns: 2 }] }
    ],
    phase: { at: 0.35, line: { en: 'Every reflection is my subject.', es: 'Cada reflejo es mi súbdito.' }, effects: [{ status: 'spdUp', chance: 1, turns: 99 }, { status: 'atkUp', chance: 1, turns: 99, value: 0.25 }] }
  },
  conductor: {
    name: { en: 'The Hollow Conductor', es: 'El Director Hueco' }, element: 'void', boss: true, final: true, color: '#b08cff',
    base: { hp: 1150, atk: 28, def: 22, spd: 18 }, growth: { hp: 38, atk: 2.6, def: 2.0, spd: 0.55 },
    skills: [
      { name: { en: 'Requiem of Thorns', es: 'Réquiem de Espinas' }, power: 0.95, element: 'void', target: 'allEnemies', weight: 2, cd: 2, effects: [{ status: 'bleed', chance: 0.45, turns: 3 }] },
      { name: { en: 'Dissonant Chord', es: 'Acorde Disonante' }, power: 1.55, element: 'void', target: 'enemy', weight: 2, effects: [{ status: 'mark', chance: 0.6, turns: 2 }] },
      { name: { en: 'Final Movement', es: 'Movimiento Final' }, power: 0.75, element: 'void', target: 'allEnemies', weight: 2, cd: 3, effects: [{ status: 'atkDown', chance: 0.5, turns: 2 }] },
      { name: { en: 'Encore', es: 'Bis' }, power: 0, target: 'self', weight: 1, cd: 4, heal: 0.1, effects: [{ status: 'atkUp', chance: 1, turns: 3, value: 0.35 }] }
    ],
    phase: { at: 0.5, line: { en: 'You still remember the melody. Good.', es: 'Aún recuerdas la melodía. Bien.' }, effects: [{ status: 'atkUp', chance: 1, turns: 99, value: 0.35 }] }
  }
};

/* ---------- Chapters & story ---------- */
SR.DATA.chapters = [
  {
    n: 1,
    name: { en: 'Petalfall Shrine', es: 'Santuario de Pétalos' },
    subtitle: { en: 'Where the first petal fell', es: 'Donde cayó el primer pétalo' },
    desc: { en: 'A shrine swallowed by blossoms. Something beneath the roots refuses to sleep.', es: 'Un santuario devorado por las flores. Algo bajo las raíces se niega a dormir.' },
    hue: 330, bg: 'shrine',
    encounters: [['wisp', 'wisp'], ['wrapper', 'wisp'], ['onibi', 'onibi']],
    boss: 'blightbloom',
    rewards: { gold: 60, xp: 60 },
    intro: [
      { s: 'narrator', t: { en: 'The Petal Veil has torn. Between the living world and the Hollow, the dead no longer sleep.', es: 'El Velo de Pétalos se ha rasgado. Entre el mundo de los vivos y el Hueco, los muertos ya no duermen.' } },
      { s: 'yuki', t: { en: 'The shrine is this way. I can hear the bells… though no one has rung them in a hundred years.', es: 'El santuario está por aquí. Puedo oír las campanas… aunque nadie las ha tocado en cien años.' } },
      { s: 'hana', t: { en: 'Good. Let the dead hear us coming. I hate quiet goodbyes.', es: 'Bien. Que los muertos nos oigan llegar. Odio las despedidas silenciosas.' } },
      { s: 'ren', t: { en: 'Then keep your blade loud and your mouth louder. The petals are already moving.', es: 'Entonces mantén la hoja ruidosa y la boca más. Los pétalos ya se mueven.' } },
      { s: 'narrator', t: { en: 'You are the last Conductor. Your song is the only thing keeping the veil from falling entirely.', es: 'Eres el último Director. Tu canción es lo único que impide que el velo caiga por completo.' } }
    ],
    bossIntro: [
      { s: 'blightbloom', t: { en: 'A song… I remember a song. It promised me spring.', es: 'Una canción… Recuerdo una canción. Me prometió primavera.' } },
      { s: 'yuki', t: { en: 'This is not spring. This is grief wearing petals.', es: 'Esto no es primavera. Es el duelo vistiendo pétalos.' } }
    ],
    outro: [
      { s: 'blightbloom', t: { en: 'So warm… the roots are quiet now. Thank you, Conductor.', es: 'Qué cálido… las raíces están en calma. Gracias, Director.' } },
      { s: 'hana', t: { en: 'One down. The lanterns in the market are next — I can smell the smoke from here.', es: 'Uno menos. Ahora los faroles del mercado; puedo oler el humo desde aquí.' } },
      { s: 'ren', t: { en: 'That is not smoke. That is a very hungry thing pretending to be a lantern.', es: 'Eso no es humo. Es algo muy hambriento fingiendo ser un farol.' } }
    ]
  },
  {
    n: 2,
    name: { en: 'Lantern Market', es: 'Mercado de Faroles' },
    subtitle: { en: 'Everything is for sale, including names', es: 'Todo está en venta, incluso los nombres' },
    desc: { en: 'A night market where fox spirits trade memories. The lanterns have started eating the customers.', es: 'Un mercado nocturno donde los espíritus zorro comercian recuerdos. Los faroles empezaron a comerse a los clientes.' },
    hue: 35, bg: 'market',
    encounters: [['kitsune', 'wisp'], ['wrapper', 'onibi', 'wisp'], ['kitsune', 'kitsune']],
    boss: 'lanternEater',
    rewards: { gold: 90, xp: 100 },
    intro: [
      { s: 'narrator', t: { en: 'Lantern Market appears only on moonless nights. Tonight, every lantern burns without oil.', es: 'El Mercado de Faroles aparece solo en noches sin luna. Esta noche, cada farol arde sin aceite.' } },
      { s: 'ren', t: { en: 'Do not give your name to anyone here. Especially not to the one with too many teeth.', es: 'No le des tu nombre a nadie aquí. Menos al que tiene demasiados dientes.' } },
      { s: 'hana', t: { en: 'You say that like I have ever given anything away.', es: 'Lo dices como si alguna vez hubiera regalado algo.' } },
      { s: 'yuki', t: { en: 'Hana. Your name is written on your haori.', es: 'Hana. Tu nombre está bordado en tu haori.' } },
      { s: 'hana', t: { en: '…That is different.', es: '…Eso es distinto.' } }
    ],
    bossIntro: [
      { s: 'lanternEater', t: { en: 'Three little flames, walking into my mouth. How thoughtful.', es: 'Tres llamitas caminando hacia mi boca. Qué considerado.' } },
      { s: 'ren', t: { en: 'It talks. I hate it already.', es: 'Habla. Ya lo odio.' } }
    ],
    outro: [
      { s: 'lanternEater', t: { en: 'I only wanted… to remember what light felt like.', es: 'Solo quería… recordar cómo se sentía la luz.' } },
      { s: 'yuki', t: { en: 'Then remember it gently. Not with a hundred stolen lanterns.', es: 'Entonces recuérdalo con ternura. No con cien faroles robados.' } },
      { s: 'narrator', t: { en: 'Beyond the market, the sea has swallowed a gate. The drowned are singing beneath it.', es: 'Más allá del mercado, el mar se tragó una puerta. Los ahogados cantan bajo ella.' } }
    ]
  },
  {
    n: 3,
    name: { en: 'Drowned Torii', es: 'Torii Ahogado' },
    subtitle: { en: 'The tide keeps what it takes', es: 'La marea conserva lo que toma' },
    desc: { en: 'A flooded gate to the sea. The abbot below has been baptising corpses for a century.', es: 'Una puerta inundada hacia el mar. El abad de abajo lleva un siglo bautizando cadáveres.' },
    hue: 195, bg: 'sea',
    encounters: [['monk', 'wrapper'], ['spider', 'monk'], ['onibi', 'spider', 'monk']],
    boss: 'abbot',
    rewards: { gold: 120, xp: 150 },
    intro: [
      { s: 'narrator', t: { en: 'The torii stands in black water. Each wave carries a name you almost recognise.', es: 'El torii se alza en agua negra. Cada ola lleva un nombre que casi reconoces.' } },
      { s: 'yuki', t: { en: 'The abbot was kind, once. He buried the unclaimed dead when no one else would.', es: 'El abad fue amable, una vez. Enterraba a los muertos sin nombre cuando nadie más lo hacía.' } },
      { s: 'hana', t: { en: 'And now he will not let them leave. Kindness with a locked door is still a prison.', es: 'Y ahora no los deja irse. La bondad con puerta cerrada sigue siendo prisión.' } },
      { s: 'ren', t: { en: 'Careful. The water is listening.', es: 'Cuidado. El agua escucha.' } }
    ],
    bossIntro: [
      { s: 'abbot', t: { en: 'You would take them from me? I gave them names. I gave them rest.', es: '¿Me los quitarías? Les di nombres. Les di descanso.' } },
      { s: 'yuki', t: { en: 'Rest is not something you keep, Abbot. It is something you give.', es: 'El descanso no se retiene, Abad. Se entrega.' } }
    ],
    outro: [
      { s: 'abbot', t: { en: 'The tide… is going out. I had forgotten it could.', es: 'La marea… se retira. Había olvidado que podía.' } },
      { s: 'ren', t: { en: 'The clock tower is awake. I can hear gears counting down.', es: 'La torre del reloj está despierta. Oigo engranajes contando.' } },
      { s: 'narrator', t: { en: 'Somewhere above the clouds, a machine has decided that time is a debt. It intends to collect.', es: 'En algún lugar sobre las nubes, una máquina decidió que el tiempo es una deuda. Piensa cobrarla.' } }
    ]
  },
  {
    n: 4,
    name: { en: 'Clockwork Pagoda', es: 'Pagoda de Engranajes' },
    subtitle: { en: 'Every second is a soldier', es: 'Cada segundo es un soldado' },
    desc: { en: 'A pagoda of brass and bone. The shogun inside has been winning the same war for four hundred years.', es: 'Una pagoda de latón y hueso. El shogun de dentro lleva cuatrocientos años ganando la misma guerra.' },
    hue: 45, bg: 'clock',
    encounters: [['sentinel', 'sentinel'], ['sentinel', 'kitsune'], ['wrapper', 'sentinel', 'monk']],
    boss: 'shogun',
    rewards: { gold: 150, xp: 210 },
    intro: [
      { s: 'narrator', t: { en: 'The pagoda turns without wind. Every gear is a name, and every name has been filed into a weapon.', es: 'La pagoda gira sin viento. Cada engranaje es un nombre, y cada nombre fue archivado como arma.' } },
      { s: 'hana', t: { en: 'I have fought machines before. They break like everything else.', es: 'He luchado contra máquinas antes. Se rompen como todo lo demás.' } },
      { s: 'ren', t: { en: 'This one breaks into more machines. Try to aim for the arrogant part.', es: 'Esta se rompe en más máquinas. Intenta apuntar a la parte arrogante.' } },
      { s: 'yuki', t: { en: 'There is a heartbeat under the ticking. Someone is still in there.', es: 'Hay un latido bajo el tic-tac. Alguien sigue ahí dentro.' } }
    ],
    bossIntro: [
      { s: 'shogun', t: { en: 'You are late. Four hundred years late. The war ended without you.', es: 'Llegan tarde. Cuatrocientos años tarde. La guerra terminó sin ustedes.' } },
      { s: 'hana', t: { en: 'Then why are you still fighting?', es: '¿Entonces por qué sigues luchando?' } },
      { s: 'shogun', t: { en: 'Because stopping would mean I lost something. I no longer remember what.', es: 'Porque detenerme significaría que perdí algo. Ya no recuerdo qué.' } }
    ],
    outro: [
      { s: 'shogun', t: { en: 'Ah. The war is over. I… can put down the blade.', es: 'Ah. La guerra terminó. Puedo… soltar la hoja.' } },
      { s: 'narrator', t: { en: 'The gears stop. In the silence, a mirror at the top of the pagoda reflects a court that should not exist.', es: 'Los engranajes se detienen. En el silencio, un espejo en lo alto refleja una corte que no debería existir.' } },
      { s: 'ren', t: { en: 'The Hollow Court. Where the veil is thinnest. And where our Conductor is waiting.', es: 'La Corte Hueca. Donde el velo es más fino. Y donde nos espera nuestro Director.' } }
    ]
  },
  {
    n: 5,
    name: { en: 'Hollow Court', es: 'Corte Hueca' },
    subtitle: { en: 'A throne of reflections', es: 'Un trono de reflejos' },
    desc: { en: 'A palace with no walls, only mirrors. The Empress wears the face of everyone who ever loved her.', es: 'Un palacio sin muros, solo espejos. La Emperatriz lleva el rostro de todos los que alguna vez la amaron.' },
    hue: 275, bg: 'court',
    encounters: [['courtier', 'mirror'], ['mirror', 'drummer'], ['courtier', 'courtier', 'mirror']],
    boss: 'empress',
    rewards: { gold: 190, xp: 280 },
    intro: [
      { s: 'narrator', t: { en: 'The court has no floor. You walk on your own reflections, and they walk with you.', es: 'La corte no tiene suelo. Caminas sobre tus propios reflejos, y ellos caminan contigo.' } },
      { s: 'yuki', t: { en: 'Do not look too long. Mirrors are where grief learns to flatter itself.', es: 'No mires demasiado. Los espejos son donde el duelo aprende a adularse.' } },
      { s: 'hana', t: { en: 'I see myself with a nicer sword. I am listening.', es: 'Me veo con una espada más bonita. Estoy escuchando.' } },
      { s: 'ren', t: { en: 'I see myself leaving. It looks peaceful. It is lying.', es: 'Me veo yéndome. Parece tranquilo. Está mintiendo.' } }
    ],
    bossIntro: [
      { s: 'empress', t: { en: 'Which one of me do you intend to kill? I have so many lovely choices.', es: '¿A cuál de mis yo pretenden matar? Tengo tantas opciones encantadoras.' } },
      { s: 'yuki', t: { en: 'None. We are here for the Conductor.', es: 'A ninguna. Venimos por el Director.' } },
      { s: 'empress', t: { en: 'He is behind every mirror. He is also behind your eyes. He is very good at being everywhere but here.', es: 'Está detrás de cada espejo. También detrás de tus ojos. Es muy bueno estando en todas partes menos aquí.' } }
    ],
    outro: [
      { s: 'empress', t: { en: 'Shatter me, then. But keep one shard. Someone should remember how beautiful I was.', es: 'Rómpanme, entonces. Pero guarden una esquirla. Alguien debería recordar lo hermosa que fui.' } },
      { s: 'narrator', t: { en: 'The mirrors fall like rain. Beyond them, a staircase of petals leads up into the Hollow.', es: 'Los espejos caen como lluvia. Más allá, una escalera de pétalos asciende hacia el Hueco.' } },
      { s: 'ren', t: { en: 'Hana. Yuki. Whatever he says up there… he knows us. He trained us.', es: 'Hana. Yuki. Lo que sea que diga allí arriba… nos conoce. Nos entrenó.' } },
      { s: 'hana', t: { en: 'Then he should know exactly how stubborn we are.', es: 'Entonces debería saber exactamente lo obstinadas que somos.' } }
    ]
  },
  {
    n: 6,
    name: { en: 'The Requiem', es: 'El Réquiem' },
    subtitle: { en: 'One last song', es: 'Una última canción' },
    desc: { en: 'The Hollow Conductor waits at the end of the veil. He was your teacher. He is also the reason the dead cannot rest.', es: 'El Director Hueco espera al final del velo. Fue tu maestro. También es la razón por la que los muertos no descansan.' },
    hue: 250, bg: 'hollow',
    encounters: [['drummer', 'spider'], ['sentinel', 'courtier', 'mirror'], ['monk', 'kitsune', 'drummer']],
    boss: 'conductor',
    rewards: { gold: 260, xp: 400 },
    intro: [
      { s: 'narrator', t: { en: 'At the top of the veil, the sky is a score with no notes. The Hollow Conductor stands at its centre, baton raised.', es: 'En lo alto del velo, el cielo es una partitura sin notas. El Director Hueco está en el centro, con la batuta alzada.' } },
      { s: 'conductor', t: { en: 'You came. I knew you would. You always did love the difficult passages.', es: 'Viniste. Sabía que lo harías. Siempre amaste los pasajes difíciles.' } },
      { s: 'hana', t: { en: 'Master Sōma… you are the one tearing the veil?', es: 'Maestro Sōma… ¿tú eres quien rasga el velo?' } },
      { s: 'conductor', t: { en: 'I am the one trying to open a door. You are the ones who keep closing it on the dead.', es: 'Soy quien intenta abrir una puerta. Ustedes son quienes se la cierran a los muertos.' } },
      { s: 'yuki', t: { en: 'No. You are keeping them from rest because you cannot bear to say goodbye.', es: 'No. Les niegas el descanso porque no soportas despedirte.' } }
    ],
    bossIntro: [
      { s: 'conductor', t: { en: 'Then sing, Conductor. Sing the song that ends me. If you can.', es: 'Entonces canta, Director. Canta la canción que me termine. Si puedes.' } },
      { s: 'ren', t: { en: 'Do not let him conduct your heartbeat. Fight to your own tempo.', es: 'No dejes que dirija tu corazón. Lucha a tu propio ritmo.' } }
    ],
    outro: [
      { s: 'conductor', t: { en: 'You changed the melody. I wrote it to bring her back, and you… you wrote it to let her go.', es: 'Cambiaste la melodía. La escribí para traerla de vuelta, y tú… la escribiste para dejarla ir.' } },
      { s: 'narrator', t: { en: 'The veil does not close. It opens — gently, like a hand. The dead choose their own doors now.', es: 'El velo no se cierra. Se abre, suavemente, como una mano. Los muertos eligen ahora sus propias puertas.' } },
      { s: 'yuki', t: { en: 'The shrine bells are ringing again. This time, someone is actually ringing them.', es: 'Las campanas del santuario vuelven a sonar. Esta vez, alguien las toca de verdad.' } },
      { s: 'hana', t: { en: 'So. What now? The world is full of quiet goodbyes.', es: 'Entonces. ¿Y ahora? El mundo está lleno de despedidas silenciosas.' } },
      { s: 'ren', t: { en: 'Now we make them loud.', es: 'Ahora las hacemos ruidosas.' } }
    ]
  }
];

SR.DATA.prologue = [
  { s: 'narrator', t: { en: 'Once, the dead slept beneath a song. The Petal Veil kept them gentle.', es: 'Antaño, los muertos dormían bajo una canción. El Velo de Pétalos los mantenía mansos.' } },
  { s: 'narrator', t: { en: 'Now the song has stopped. Spirits wake hungry, wearing the faces of the living.', es: 'Ahora la canción se ha detenido. Los espíritus despiertan hambrientos, con rostros de vivos.' } },
  { s: 'yuki', t: { en: 'Conductor. The shrine is this way. We will keep you safe while you sing.', es: 'Director. El santuario está por aquí. Te protegeremos mientras cantas.' } },
  { s: 'hana', t: { en: 'Keep me safe? I am the one with the sword.', es: '¿Protegerme? Yo soy la que tiene la espada.' } },
  { s: 'ren', t: { en: 'And I am the one with the plan. Try to keep up.', es: 'Y yo el que tiene el plan. Intenta seguirnos.' } },
  { s: 'narrator', t: { en: 'Three wardens. One last Conductor. The requiem begins.', es: 'Tres guardianas. Un último Director. El réquiem comienza.' } }
];

SR.DATA.ending = [
  { s: 'narrator', t: { en: 'Spring returns to the shrine. The petals fall because they choose to, not because they are grieving.', es: 'La primavera vuelve al santuario. Los pétalos caen porque lo eligen, no porque estén de duelo.' } },
  { s: 'hana', t: { en: 'I thought saving the world would feel louder.', es: 'Pensé que salvar el mundo se sentiría más ruidoso.' } },
  { s: 'yuki', t: { en: 'It sounds like this. Listen.', es: 'Suena así. Escucha.' } },
  { s: 'ren', t: { en: 'Bells. Wind. Hana complaining. Yes. That is the sound of a world worth keeping.', es: 'Campanas. Viento. Hana quejándose. Sí. Ese es el sonido de un mundo que vale la pena conservar.' } },
  { s: 'narrator', t: { en: 'Sakura Requiem — thank you for listening.', es: 'Sakura Requiem — gracias por escuchar.' } }
];

/* ---------- Meta upgrades (Embers) ---------- */
SR.DATA.upgrades = [
  { id: 'vitality', icon: '❤', max: 5, costs: [15, 30, 50, 80, 120], name: 'up.vitality', desc: 'up.vitalityDesc' },
  { id: 'might', icon: '⚔', max: 5, costs: [15, 30, 50, 80, 120], name: 'up.might', desc: 'up.mightDesc' },
  { id: 'fortune', icon: '🪙', max: 5, costs: [15, 30, 50, 80, 120], name: 'up.fortune', desc: 'up.fortuneDesc' },
  { id: 'wisdom', icon: '📖', max: 5, costs: [15, 30, 50, 80, 120], name: 'up.wisdom', desc: 'up.wisdomDesc' },
  { id: 'resonance', icon: '✺', max: 5, costs: [15, 30, 50, 80, 120], name: 'up.resonance', desc: 'up.resonanceDesc' }
];

/* ---------- Speaker labels ---------- */
SR.DATA.speakers = {
  narrator: { name: { en: '', es: '' } },
  hana: { name: { en: 'Hana', es: 'Hana' }, hero: 'hana' },
  yuki: { name: { en: 'Yuki', es: 'Yuki' }, hero: 'yuki' },
  ren: { name: { en: 'Ren', es: 'Ren' }, hero: 'ren' },
  blightbloom: { name: { en: 'Blightbloom', es: 'Flor de la Ruina' }, enemy: 'blightbloom' },
  lanternEater: { name: { en: 'The Lantern Eater', es: 'El Devorador de Faroles' }, enemy: 'lanternEater' },
  abbot: { name: { en: 'Abbot of Tides', es: 'Abad de las Mareas' }, enemy: 'abbot' },
  shogun: { name: { en: 'Shogun Kurogane', es: 'Shogun Kurogane' }, enemy: 'shogun' },
  empress: { name: { en: 'Mirror Empress', es: 'Emperatriz del Espejo' }, enemy: 'empress' },
  conductor: { name: { en: 'The Hollow Conductor', es: 'El Director Hueco' }, enemy: 'conductor' }
};
