// =============================================================================
// AUDIO SYSTEM
// Genera SFX y música proceduralmente con Web Audio API.
// Esto evita problemas de copyright y permite que el juego corra sin archivos
// de audio externos. Las pistas son sintetizadas en tiempo real.
// =============================================================================

import { bus, EVENTS } from '../core/EventBus.js';
import { saveSystem } from './SaveSystem.js';

export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.currentMusic = null;
    this.settings = saveSystem.getSettings();
    this._listen();
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.settings.musicVolume;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.settings.audioVolume;
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn('[AudioSystem] AudioContext no disponible:', e);
    }
  }

  _listen() {
    bus.on(EVENTS.PLAY_SFX, ({ name }) => this.playSFX(name));
    bus.on(EVENTS.PLAY_MUSIC, ({ track }) => this.playMusic(track));
    bus.on(EVENTS.STOP_MUSIC, () => this.stopMusic());
  }

  setVolume({ master, music, sfx }) {
    if (!this.ctx) return;
    if (master != null) this.masterGain.gain.value = master;
    if (music != null) this.musicGain.gain.value = music;
    if (sfx != null) this.sfxGain.gain.value = sfx;
  }

  // === SFX ===
  playSFX(name) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    switch (name) {
      case 'click': this._beep(880, 0.04, 'square', 0.15); break;
      case 'confirm': this._chord([523, 659, 784], 0.15, 0.2); break;
      case 'error': this._beep(220, 0.2, 'sawtooth', 0.2); break;
      case 'document': this._beep(440, 0.08, 'triangle', 0.18); break;
      case 'discover': this._chord([523, 659, 784, 1047], 0.3, 0.25); break;
      case 'airplane': this._airplane(); break;
      case 'capture': this._fanfare(); break;
      default: this._beep(440, 0.05, 'sine', 0.1);
    }
  }

  _beep(freq, duration, type = 'sine', volume = 0.2) {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  _chord(freqs, duration, volume) {
    freqs.forEach(f => this._beep(f, duration, 'sine', volume / freqs.length));
  }

  _airplane() {
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 1.5);
    osc.frequency.exponentialRampToValueAtTime(60, t + 3);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.3);
    gain.gain.linearRampToValueAtTime(0, t + 3);
    osc.connect(gain).connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 3.1);
  }

  _fanfare() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => {
      setTimeout(() => this._beep(f, 0.2, 'triangle', 0.25), i * 120);
    });
  }

  // === MÚSICA PROCEDURAL ===
  playMusic(trackName) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.currentMusic?.name === trackName) return;
    this.stopMusic();

    const tracks = {
      menu:        { tempo: 95,  pattern: [0, 4, 7, 4, 2, 5, 9, 5], key: 220 }, // Am
      investigate: { tempo: 80,  pattern: [0, 3, 7, 3, 0, 5, 8, 5], key: 196 }, // Dm
      travel:      { tempo: 110, pattern: [0, 4, 7, 12, 7, 4, 0, 7], key: 261 }, // C
      victory:     { tempo: 130, pattern: [0, 4, 7, 12, 16, 12, 7, 4], key: 293 }, // D
      defeat:      { tempo: 60,  pattern: [0, 3, 7, 3, 0, -2, -5, -2], key: 174 }, // F minor low
    };
    const track = tracks[trackName] || tracks.menu;
    const interval = 60 / track.tempo / 2;

    let step = 0;
    this.currentMusic = {
      name: trackName,
      timer: setInterval(() => {
        if (!this.ctx) return;
        const semitone = track.pattern[step % track.pattern.length];
        const freq = track.key * Math.pow(2, semitone / 12);
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + interval * 0.9);
        osc.connect(gain).connect(this.musicGain);
        osc.start(t);
        osc.stop(t + interval);
        step++;
      }, interval * 1000),
    };
  }

  stopMusic() {
    if (this.currentMusic?.timer) {
      clearInterval(this.currentMusic.timer);
      this.currentMusic = null;
    }
  }
}

export const audio = new AudioSystem();
