/* Sakura Requiem — configuration
 * Edit this file to point the game at your own store, donation page and ad slots.
 * Nothing here phones home by default: analytics and ads are disabled.
 */
window.SR = window.SR || {};

SR.VERSION = '1.0.0';
SR.BUILD = '2026.10';

SR.config = {
  gameId: 'sakura-requiem',

  // Where players can support the project. Leave a field empty to hide that button.
  support: {
    enabled: true,
    kofi: '',
    patreon: '',
    itch: '',
    github: 'https://github.com/LeandroCarlino/sakura-requiem',
    email: ''
  },

  // Optional ads (only shown if you set enabled:true and fill a provider).
  // Supported providers: 'custom' (your own iframe/script in ads.slotHtml) or 'none'.
  ads: {
    enabled: false,
    provider: 'none',
    showOnResults: false,
    showOnMap: false,
    slotHtml: ''
  },

  // One-time cosmetic "Moonlight Supporter Pack".
  // For a static game, codes are checked client-side (see MONETIZATION.md).
  premium: {
    enabled: true,
    productName: 'Moonlight Supporter Pack',
    price: '$4.99',
    // Change these before publishing. Codes are normalised (uppercase, no spaces).
    codes: ['SAKURA-MOON-2026', 'PETAL-SUPPORTER'],
    bonusEmbers: 500,
    perks: ['moonlightSkins', 'bonusEmbers', 'artCard']
  },

  // Privacy-friendly analytics stub. No requests are made unless enabled.
  analytics: {
    enabled: false,
    endpoint: ''
  },

  links: {
    privacy: 'PRIVACY.md',
    readme: 'README.md'
  },

  debug: false
};
