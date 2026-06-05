# Serene

**Une application de méditation qui va à l'essentiel.**

---

## Pourquoi Serene ?

Les applications de méditation existantes partagent un même travers : elles ajoutent sans cesse des fonctionnalités, des abonnements, des parcours guidés, des réseaux sociaux intégrés. Le résultat est une application qui génère plus de bruit mental qu'elle n'en supprime.

Serene fait le choix inverse. Pas de compte utilisateur. Pas de serveur. Pas de contenu premium. Juste un cercle, un minuteur et du son.

L'interface est conçue pour disparaître : quand la session démarre, tout s'efface sauf le cercle qui respire doucement. Le design éditorial (typographies serif et monospace, palette monochrome) crée un espace visuel calme qui invite à la déconnexion.

## Ce que fait Serene

**Méditer** — Un minuteur configurable (1 à 60 minutes) ou un chronomètre libre avec jalons visuels. Un pré-timer de 5 secondes avec décompte sonore laisse le temps de s'installer. Un carillon mélodique ascendant marque le début, un carillon descendant marque la fin.

**Respirer** — Un guide de respiration visuel et textuel synchronisé sur le cercle du timer. Cinq rythmes disponibles : rapide (4s), cohérence cardiaque (6s), calme (8s), profond (10s) et relaxation 4-7-8 (14s). Le cercle respire avec un double halo concentrique et un trait de progression qui s'épaissit à l'inspire. Le texte "Inspirez" / "Expirez" alterne au centre. Désactivable dans les réglages.

**Écouter** — Cinq ambiances sonores générées en temps réel par le navigateur, sans aucun fichier audio embarqué :

- *Silence* — aucun son
- *Bruit brun* — grave et enveloppant, filtré à 250 Hz
- *Bruit blanc* — adouci en bruit rose par filtrage bandpass
- *Pluie* — lit sonore continu, quatre types de gouttelettes, filets d'eau, tonnerre distant
- *Océan* — quatre couches de vagues à périodes irrationnelles, écume, clapotis, ressac, rumble sub-bass

Le volume est ajustable en temps réel pendant la session. L'ambiance peut être changée même quand le timer tourne.

**Suivre** — Un historique des sessions passées groupées par jour, avec possibilité de supprimer des sessions individuelles. Des statistiques détaillées : nombre total de sessions, temps cumulé, série actuelle et meilleure série de jours consécutifs, graphique hebdomadaire animé, durée moyenne par mois.

**Personnaliser** — Sept thèmes de couleurs, prénom personnalisé sur l'accueil, choix du mode de sélection du temps (boutons ou curseur), visibilité des éléments d'interface configurable. Toutes les préférences sont stockées localement sur l'appareil.

## Thèmes

| Thème | Ambiance |
|-------|----------|
| Clair | Gris clair, blanc, noir — minimaliste |
| Sombre | Fond #111, texte doux — par défaut |
| Minuit | Noir pur AMOLED, contrastes minimaux |
| Chaleureux | Crème et brun — cosy et naturel |
| Forêt | Verts désaturés sombres — retraite en nature |
| Crépuscule | Bleu-violet profond — ciel de fin de journée |
| Brume | Gris bleutés clairs — matin éthéré |

## Principes de conception

- **Zéro requête externe** — Les polices (Inter, Playfair Display, JetBrains Mono) sont hébergées localement. Aucune donnée ne quitte l'appareil. Conformité RGPD par design.
- **Audio procédural** — Le Web Audio API génère les ambiances en combinant des couches de bruit filtré, des enveloppes de vagues et des micro-événements aléatoires. Buffers stéréo de 30 secondes avec crossfade de 4 secondes. Le résultat est organique et ne boucle jamais de façon perceptible.
- **Animations intentionnelles** — Entrées en stagger, cercle qui respire avec double halo et trait adaptatif, transition morphing entre l'accueil et le timer, micro-interactions spring sur tous les boutons, modales bottom sheet animées. Chaque mouvement a une raison d'être.
- **Mobile-first** — Plein écran sur Android, safe areas respectées, interface optimisée pour être utilisée d'une main.
- **Persistance locale** — Architecture trois couches (StorageService, SessionService, SettingsService) avec BehaviorSubject pour la réactivité. Données stockées en localStorage, prêt pour migration vers Capacitor Preferences.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Angular 20 (standalone components) |
| UI | Ionic 8 |
| Natif | Capacitor 8 (Android) |
| Audio | Web Audio API (génération procédurale) |
| Persistance | localStorage + BehaviorSubject |
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
  models/
    session.model.ts        Interfaces Session, Settings
  services/
    storage.service.ts      Wrapper localStorage async
    session.service.ts      SessionService + SettingsService
    audio.service.ts        Moteur audio procédural
  components/
    sound-picker/           Sélecteur d'ambiance sonore
  pages/
    home/                   Accueil personnalisée
    timer/                  Minuteur, chronomètre, guide de respiration
    history/                Historique des sessions
    stats/                  Statistiques de progression
    settings/               Réglages avec modales
    about/                  À propos
  tabs/                     Navigation par onglets
```

## Licence

Projet privé — Axel Le Meur.
