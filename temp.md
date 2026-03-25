# Voici l'analyse complète de rétrocompatibilité:

## ❌ Ce qui **cassera** avec `Component`

### 1. `static affix = ''` au lieu de `'-ponent'`
- **Impact critique sur le HTML.** Tous les composants existants changeront de nom de tag.  
  Ex: `<my-title-ponent>` → `<my-title>`  
  Tous les fichiers HTML existants dans examples seront brisés.

### 2. `this._$` supprimé
- **index.js** l'utilise directement (`this._$.href.value`).  
  Component n'a pas de `_$`, donc erreur runtime garantie.

### 3. `this.rendered` supprimé du constructeur
- **index.js**, **TabGroup.js**, **index.js** en dépendent.  
  Ça fonctionnera quand même (JS accepte des propriétés non déclarées), mais la valeur initiale ne sera plus `null` — elle sera `undefined`. À vérifier cas par cas.

### 4. `createProperty` retourne un format différent
| | `Webponent` | `Component` |
|---|---|---|
| Retour | `{ name: { get(){}, set(){} } }` (descripteur JS) | `{ name: normalizeProperty(desc) }` (config interne) |

- Dans bundle.js on voit `static properties = { icon: this.createProperty("icon", {...}) }` — ce pattern **cassera** avec Component car le retour est de type différent.

### 5. Setter : comportement différent quand `prop.set` est défini
| | `Webponent` | `Component` |
|---|---|---|
| si `prop.set` défini | appelle `set` **ET** stocke dans `this._[name]` | appelle `set` **SEULEMENT** (pas de stockage auto) |

Tout composant qui se fie au fait que `this._[name]` soit mis à jour automatiquement **même quand** `prop.set` est fourni verra des bugs silencieux.

### 6. `attributeChangedCallback` — nouvelle garde
- Component vérifie `name in definitions` avant d'assigner. Si un attribut est observé sans être dans `properties`/`props`, il sera **silencieusement ignoré**.

### 7. Import : named vs default
- Component.js exporte `export class Component` ET `export default Component`.
- Webponent.js exporte seulement `export default Webponent`.
- Les `import Webponent from Webponent.js"` dans Menu, Toolbar, Title, etc. doivent être mis à jour.

---

## ✅ Ce qui est **compatible** (ou amélioré)

- `static properties`, `observedAttributes`, `defineProperties`, `defineProperty` (base) — API publique identique.
- `static setMeta`, `getUrlData`, `toKebabCase`, `fixed`, `register` — fonctionnellement équivalents.
- Nouvelles méthodes `fill`, `watchText`, `watchHTML`, `watchAttribute` — ajouts non-cassants.
- `static props` — alias de `properties`, non-cassant.