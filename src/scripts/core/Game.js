// =============================================================================
// GAME — Controlador central
// Compone todos los sistemas y orquesta el ciclo de juego.
// =============================================================================

import { bus, EVENTS } from './EventBus.js';
import { SceneManager } from './SceneManager.js';
import { TimeSystem } from '../systems/TimeSystem.js';
import { ClueSystem } from '../systems/ClueSystem.js';
import { CaseSystem } from '../systems/CaseSystem.js';
import { AchievementSystem } from '../systems/AchievementSystem.js';
import { saveSystem } from '../systems/SaveSystem.js';
import { audio } from '../systems/AudioSystem.js';
import { generateSuspectRoster } from '../generators/SuspectGenerator.js';

import { TitleScene } from '../scenes/TitleScene.js';
import { IntroScene } from '../scenes/IntroScene.js';
import { OfficeScene } from '../scenes/OfficeScene.js';
import { ArchiveScene } from '../scenes/ArchiveScene.js';
import { MapScene } from '../scenes/MapScene.js';
import { TravelScene } from '../scenes/TravelScene.js';
import { InterrogationScene } from '../scenes/InterrogationScene.js';
import { CaptureScene } from '../scenes/CaptureScene.js';
import { VictoryScene } from '../scenes/VictoryScene.js';
import { DefeatScene } from '../scenes/DefeatScene.js';
import { CreditsScene } from '../scenes/CreditsScene.js';

export class Game {
  constructor(rootElement) {
    this.root = rootElement;
    this.time = new TimeSystem(7);
    this.clues = new ClueSystem();
    this.case = new CaseSystem();
    this.achievements = new AchievementSystem();

    // Roster de sospechosos fijo por sesión (120 personajes)
    this.suspectRoster = generateSuspectRoster(120);

    // Construir contexto compartido para escenas
    this.context = {
      game: this,
      time: this.time,
      clues: this.clues,
      case: this.case,
      achievements: this.achievements,
      suspectRoster: this.suspectRoster,
      audio,
      bus,
    };

    this.sceneManager = new SceneManager(this.root, this.context);
    this._registerScenes();
    this._listenGlobal();
  }

  _registerScenes() {
    this.sceneManager.register('title', new TitleScene());
    this.sceneManager.register('intro', new IntroScene());
    this.sceneManager.register('office', new OfficeScene());
    this.sceneManager.register('archive', new ArchiveScene());
    this.sceneManager.register('map', new MapScene());
    this.sceneManager.register('travel', new TravelScene());
    this.sceneManager.register('interrogation', new InterrogationScene());
    this.sceneManager.register('capture', new CaptureScene());
    this.sceneManager.register('victory', new VictoryScene());
    this.sceneManager.register('defeat', new DefeatScene());
    this.sceneManager.register('credits', new CreditsScene());
  }

  _listenGlobal() {
    bus.on(EVENTS.TIME_EXPIRED, () => {
      saveSystem.updateStats(s => ({ ...s, casesLost: s.casesLost + 1 }));
      bus.emit(EVENTS.CASE_LOSE, { reason: 'time' });
      this.sceneManager.goTo('defeat', { reason: 'time' });
    });

    bus.on(EVENTS.SUSPECT_CAPTURED, () => {
      const daysUsed = Math.ceil((this.time.totalHours - this.time.remainingHours) / 24);
      saveSystem.updateStats(s => {
        const visited = { ...(s.provincesVisited || {}) };
        for (const id of this.case.visitedProvinces) visited[id] = true;
        return {
          ...s,
          casesWon: s.casesWon + 1,
          casesPlayed: s.casesPlayed + 1,
          provincesVisited: visited,
        };
      });
      const regionsCovered = [...this.case.visitedProvinces]
        .map(id => this.case.activeCase.route.find(p => p.id === id)?.region)
        .filter(Boolean);
      bus.emit(EVENTS.CASE_WIN, {
        daysUsed,
        regionsCovered,
        warrantAttempts: this.case.warrantAttempts,
      });
      this.sceneManager.goTo('victory');
    });
  }

  startNewGame() {
    this.time.reset(7);
    this.clues.reset();
    const seed = `case-${Date.now()}`;
    this.case.startCase(seed);
    saveSystem.updateStats(s => ({ ...s, casesPlayed: (s.casesPlayed || 0) + 1 }));
    this.sceneManager.goTo('intro');
  }

  continueGame() {
    const data = saveSystem.loadGame();
    if (!data) return false;
    this.time.loadJSON(data.time);
    this.clues.loadJSON({
      geographicClues: data.cluesGathered?.geographic ?? [],
      identityClues: data.cluesGathered?.identity ?? [],
      knownAttributes: data.knownAttributes ?? {},
    });
    const loaded = this.case.loadJSON(
      {
        seed: data.caseSeed,
        currentStopIndex: data.stopIndex,
        visitedProvinces: data.visitedProvinces,
        warrantIssued: data.warrantIssued,
      },
      this.suspectRoster
    );
    if (!loaded) return false;
    this.sceneManager.goTo('office');
    return true;
  }

  saveCurrentGame() {
    saveSystem.saveGame({
      caseSeed: this.case.activeCase?.seed,
      time: this.time.toJSON(),
      cluesGathered: {
        geographic: this.clues.geographicClues,
        identity: this.clues.identityClues,
      },
      knownAttributes: this.clues.knownAttributes,
      visitedProvinces: [...this.case.visitedProvinces],
      currentProvinceId: this.case.currentProvince?.id,
      warrantIssued: this.case.warrantIssued,
      stopIndex: this.case.currentStopIndex,
    });
  }

  boot() {
    this.sceneManager.goTo('title');
  }
}
