// Web Audio API Sound Synthesizer for Kids Math Game
// Highly reliable, offline-first, loads instantly without external assets

let audioCtx: any = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("Web Audio API not supported in this browser:", e);
    }
  }
  
  if (audioCtx) {
    try {
      if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
        audioCtx.resume();
      }
    } catch (e) {
      console.warn("Could not resume audio context:", e);
    }
  }
  return audioCtx;
}

// Global user interaction gesture to warm up/unlock AudioContext on older mobile devices (iOS/Android Safari/Chrome)
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
        ctx.resume().then(() => {
          cleanup();
        }).catch(() => {
          // If promise fails, still try to cleanup
          cleanup();
        });
      } else {
        cleanup();
      }
    } catch (e) {
      cleanup();
    }
  };

  const cleanup = () => {
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
    window.removeEventListener("touchend", unlockAudio);
  };

  window.addEventListener("click", unlockAudio);
  window.addEventListener("touchstart", unlockAudio);
  window.addEventListener("touchend", unlockAudio);
}

export const SoundEffects = {
  playClick() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      if (typeof osc.frequency.exponentialRampToValueAtTime === "function") {
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
      }

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      if (typeof gain.gain.exponentialRampToValueAtTime === "function") {
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      }

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
      if (!ctx) return;
      const now = ctx.currentTime;

      // Magical sparkling chime sequence (Arpeggio)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0, now + index * 0.08);
        if (typeof gain.gain.linearRampToValueAtTime === "function") {
          gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
        }
        if (typeof gain.gain.exponentialRampToValueAtTime === "function") {
          gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);
        }

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
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      if (typeof osc.frequency.linearRampToValueAtTime === "function") {
        osc.frequency.linearRampToValueAtTime(110, now + 0.3);
      }

      gain.gain.setValueAtTime(0.2, now);
      if (typeof gain.gain.exponentialRampToValueAtTime === "function") {
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      }

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
      if (!ctx) return;
      const now = ctx.currentTime;

      const chord = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        if (typeof osc.frequency.exponentialRampToValueAtTime === "function") {
          osc.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.5);
        }

        gain.gain.setValueAtTime(0.01, now);
        if (typeof gain.gain.linearRampToValueAtTime === "function") {
          gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        }
        if (typeof gain.gain.exponentialRampToValueAtTime === "function") {
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        }

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
      if (!ctx) return;
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
        if (typeof gain.gain.linearRampToValueAtTime === "function") {
          gain.gain.linearRampToValueAtTime(0.08, now + timeOffset + 0.02);
        }
        if (typeof gain.gain.exponentialRampToValueAtTime === "function") {
          gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + note.duration - 0.02);
        }

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
