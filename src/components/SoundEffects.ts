// Web Audio API Sound Synthesizer for Kids Math Game
// Highly reliable, offline-first, loads instantly without external assets

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const SoundEffects = {
  playClick() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playCorrect() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Magical sparkling chime sequence (Arpeggio)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.4);
      });
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playIncorrect() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playLevelUp() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const chord = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.5);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(now + 0.5);
      });
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  },

  playWin() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Trumpet victory fanfare
      const melody = [
        { freq: 392.00, duration: 0.15 }, // G4
        { freq: 392.00, duration: 0.15 }, // G4
        { freq: 392.00, duration: 0.15 }, // G4
        { freq: 523.25, duration: 0.4 },  // C5
        { freq: 659.25, duration: 0.4 },  // E5
        { freq: 783.99, duration: 0.8 }   // G5
      ];

      let timeOffset = 0;
      melody.forEach((note) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sawtooth";
        osc2.type = "triangle";

        osc1.frequency.setValueAtTime(note.freq, now + timeOffset);
        osc2.frequency.setValueAtTime(note.freq * 1.005, now + timeOffset); // subtle detune for fullness

        gain.gain.setValueAtTime(0, now + timeOffset);
        gain.gain.linearRampToValueAtTime(0.08, now + timeOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + note.duration - 0.02);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + timeOffset);
        osc1.stop(now + timeOffset + note.duration);
        osc2.start(now + timeOffset);
        osc2.stop(now + timeOffset + note.duration);

        timeOffset += note.duration + 0.02;
      });
    } catch (e) {
      console.warn("Audio play failed:", e);
    }
  }
};
