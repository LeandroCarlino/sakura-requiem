# Privacy Policy / Política de Privacidad

**Last updated / Última actualización:** 24 October 2026

Sakura Requiem is a static, offline-first browser game. This policy explains,
in plain language, what the game does and does not do with your information.

---

## English

### The short version

- No account is required.
- No personal data is collected, transmitted or sold.
- No cookies, fingerprinting, advertising identifiers or third-party trackers.
- Your progress is stored **only in your own browser** using `localStorage`.
- Analytics and ads are **disabled by default** and make no network requests.

### What is stored on your device

The game saves the following in your browser's `localStorage`:

| Key | Contents |
| --- | --- |
| `sr.saves.v1` | Your three save slots: chapter progress, party levels, inventory, relics, story flags and play time. |
| `sr.meta.v1` | Meta progression shared by all slots: Embers, unlocked upgrades, best Rift Trials wave, endings seen and supporter status. |
| `sr.settings.v1` | Language, music/SFX volume, reduced motion, text speed and other display preferences. |

This data never leaves your device. It is not uploaded, synced or backed up by
the game. Clearing your browser's site data deletes it permanently. Use the
in-game **Save → Export** feature if you want a portable backup code.

### Third-party links

The Support screen may link to external pages (for example Ko-fi, itch.io or
GitHub). Opening a link leaves the game and is subject to that site's own
privacy policy. The game does not embed third-party scripts, pixels or iframes
unless the operator explicitly enables the ad slot in `js/config.js`.

### Analytics (disabled by default)

`js/config.js` contains an empty analytics stub. With `analytics.enabled: false`
no request is made. If an operator enables it and supplies an endpoint, the game
can send anonymous events (screen name, chapter reached, language). No names,
emails, IP-derived identifiers or free-text data are ever sent by the built-in
stub. Operators who enable analytics are responsible for disclosing and
complying with the laws that apply to them (GDPR, CCPA, etc.).

### Advertising (disabled by default)

`js/config.js` contains a disabled ad configuration. This repository ships with
no ad network SDK. If an operator enables ads, the chosen provider's own privacy
policy and consent requirements apply.

### Children

The game does not knowingly collect any information from anyone, including
children under 13. There are no chat features, accounts or user-generated
content.

### Your rights

Because the game collects nothing, there is nothing for us to access, correct,
export or delete on a server. You can delete all local data at any time from
**Settings → Erase all progress** or by clearing site data in your browser.

### Changes

Any future change to this policy will be published in this file in the game's
repository. The "last updated" date above will change accordingly.

### Contact

Questions? Open an issue in the project repository, or write to the address the
operator lists in `js/config.js` (`support.email`). This file ships with a
placeholder and must be completed before publishing.

---

## Español

### La versión corta

- No hace falta crear una cuenta.
- No se recogen, transmiten ni venden datos personales.
- No hay cookies, huellas digitales, identificadores publicitarios ni rastreadores de terceros.
- Tu progreso se guarda **solo en tu propio navegador** mediante `localStorage`.
- Las analíticas y los anuncios están **desactivados por defecto** y no hacen peticiones de red.

### Qué se guarda en tu dispositivo

El juego guarda lo siguiente en el `localStorage` de tu navegador:

| Clave | Contenido |
| --- | --- |
| `sr.saves.v1` | Tus tres ranuras de guardado: capítulo, niveles del grupo, inventario, reliquias, banderas de la historia y tiempo jugado. |
| `sr.meta.v1` | Progreso meta compartido entre ranuras: Brasas, mejoras compradas, mejor oleada de Pruebas de la Grieta, finales vistos y estado de apoyo. |
| `sr.settings.v1` | Idioma, volumen de música y efectos, movimiento reducido, velocidad del texto y otras preferencias. |

Estos datos nunca salen de tu dispositivo. El juego no los sube, sincroniza ni
respalda. Si borras los datos del sitio desde el navegador, se eliminan de forma
permanente. Usa **Guardar → Exportar** si quieres un código de respaldo.

### Enlaces a terceros

La pantalla de Apoyo puede enlazar a páginas externas (por ejemplo Ko-fi,
itch.io o GitHub). Al abrir un enlace sales del juego y se aplica la política de
privacidad de ese sitio. El juego no incrusta scripts, píxeles ni iframes de
terceros salvo que el operador active el espacio publicitario en `js/config.js`.

### Analíticas (desactivadas por defecto)

`js/config.js` incluye un stub de analíticas vacío. Con `analytics.enabled: false`
no se realiza ninguna petición. Si un operador lo activa y configura un endpoint,
el juego puede enviar eventos anónimos (pantalla, capítulo alcanzado, idioma).
El stub incluido nunca envía nombres, correos, identificadores derivados de la IP
ni texto libre. Quien active las analíticas es responsable de informar y cumplir
la legislación aplicable (RGPD, CCPA, etc.).

### Publicidad (desactivada por defecto)

`js/config.js` incluye una configuración de anuncios desactivada. Este
repositorio no incluye ningún SDK de publicidad. Si un operador activa anuncios,
se aplican la política de privacidad y los requisitos de consentimiento del
proveedor elegido.

### Menores

El juego no recoge conscientemente información de nadie, incluidos menores de
13 años. No hay chat, cuentas ni contenido generado por usuarios.

### Tus derechos

Como el juego no recoge nada, no hay nada que podamos consultar, corregir,
exportar ni borrar en un servidor. Puedes eliminar todos los datos locales en
cualquier momento desde **Ajustes → Borrar todo el progreso** o borrando los
datos del sitio en tu navegador.

### Cambios

Cualquier cambio futuro de esta política se publicará en este archivo, dentro del
repositorio del juego, y se actualizará la fecha indicada arriba.

### Contacto

¿Dudas? Abre un issue en el repositorio del proyecto o escribe a la dirección que
el operador indique en `js/config.js` (`support.email`). Este archivo incluye un
marcador de posición que debe completarse antes de publicar.
