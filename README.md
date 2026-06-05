# Serene

**Une application de méditation qui va à l'essentiel.**

---

## Pourquoi Serene ?

Les applications de méditation existantes partagent un même travers : elles ajoutent sans cesse des fonctionnalités, des abonnements, des parcours guidés, des réseaux sociaux intégrés. Le résultat est une application qui génère plus de bruit mental qu'elle n'en supprime.

Serene fait le choix inverse. Pas de compte utilisateur. Pas de serveur. Pas de contenu premium. Juste un cercle, un minuteur et du son.

L'interface est conçue pour disparaître : quand la session démarre, tout s'efface sauf le cercle qui respire doucement. Le design éditorial (typographies serif et monospace, palette monochrome) crée un espace visuel calme qui invite à la déconnexion.

## Ce que fait Serene

**Méditer** — Un minuteur configurable (5 à 30 minutes) ou un chronomètre libre. Un pré-timer de 5 secondes laisse le temps de s'installer. Un carillon mélodique marque le début et la fin de la session.

**Écouter** — Cinq ambiances sonores générées en temps réel par le navigateur, sans aucun fichier audio embarqué. Du bruit brun profond pour la concentration. De la pluie avec des gouttelettes qui tombent dans le champ stéréo. Un océan avec des vagues à rythmes irréguliers, de l'écume et du ressac. Tout est procédural, rien ne se répète.

**Suivre** — Un historique des sessions passées et des statistiques simples : nombre de sessions, temps total, série de jours consécutifs, graphique de la semaine.

**Personnaliser** — Mode sombre, durée par défaut, volume des ambiances. Les préférences sont stockées localement sur l'appareil.

## Principes de conception

- **Zéro requête externe** — Les polices (Inter, Playfair Display, JetBrains Mono) sont hébergées localement. Aucune donnée ne quitte l'appareil. Conformité RGPD par design.
- **Audio procédural** — Le Web Audio API génère les ambiances en combinant des couches de bruit filtré, des enveloppes de vagues et des micro-événements aléatoires. Le résultat est organique et ne boucle jamais de façon perceptible.
- **Animations intentionnelles** — Entrées en stagger, cercle qui respire pendant la méditation, transitions entre les pages, micro-interactions spring sur les boutons. Chaque mouvement a une raison d'être.
- **Mobile-first** — Plein écran sur Android, safe areas respectées, interface optimisée pour être utilisée d'une main.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Angular 20 (standalone components) |
| UI | Ionic 8 |
| Natif | Capacitor 8 (Android) |
| Audio | Web Audio API (génération procédurale) |
| Style | SCSS avec design tokens CSS custom |
| Polices | Inter, Playfair Display, JetBrains Mono (locales) |

## Démarrage

```bash
npm install
npm start
```

L'application est disponible sur `http://localhost:4200`.

### Build Android

```bash
npx ng build
npx cap sync android
npx cap open android
```

## Structure

```
src/app/
  services/
    audio.service.ts      Moteur audio procédural
    theme.service.ts      Thème clair / sombre
  components/
    sound-picker/         Sélecteur d'ambiance sonore
  pages/
    home/                 Accueil
    timer/                Minuteur et chronomètre
    history/              Historique des sessions
    stats/                Statistiques
    settings/             Réglages
    about/                À propos
  tabs/                   Navigation
```

## Licence

Projet privé — Axel Le Meur.
