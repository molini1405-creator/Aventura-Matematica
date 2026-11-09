/**
 * Web Audio procedural sound effects & Web Speech API helper
 * Designed for 2nd grade elementary school students in Mendoza, Argentina.
 * Voice configured for Argentine Spanish: slow, clear, articulate, and warm.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private speechVoice: SpeechSynthesisVoice | null = null;
  public speechEnabled: boolean = true;
  public speechRate: number = 0.80; // Clear, calm, unhurried cadence for children
  public speechPitch: number = 1.02; // Warm, natural teacher tone

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.speechVoice = this.pickBestArgentineVoice();
  }

  /**
   * Specifically picks the best Argentine female / clear educator voice available
   */
  private pickBestArgentineVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Strict Argentine voice, prioritizing female / natural voices (e.g. Elena, Victoria, Isabela, Natural)
    const arFemale = voices.find(v => {
      const lang = v.lang.toLowerCase().replace('_', '-');
      const name = v.name.toLowerCase();
      const isAr = lang === 'es-ar' || name.includes('argentina') || name.includes('argentinian');
      const isFemale =
        name.includes('female') ||
        name.includes('mujer') ||
        name.includes('natural') ||
        name.includes('victoria') ||
        name.includes('elena') ||
        name.includes('isabela') ||
        name.includes('paulina') ||
        name.includes('soledad') ||
        name.includes('camila');
      return isAr && isFemale;
    });
    if (arFemale) return arFemale;

    // 2. Any Argentine voice (male or neutral)
    const anyAr = voices.find(v => {
      const lang = v.lang.toLowerCase().replace('_', '-');
      const name = v.name.toLowerCase();
      return lang === 'es-ar' || name.includes('argentina') || name.includes('argentinian');
    });
    if (anyAr) return anyAr;

    // 3. Clear Latin American Spanish female / natural voice (e.g. Sabina, Paulina, Mia, Sofia, Natural)
    const latamFemale = voices.find(v => {
      const lang = v.lang.toLowerCase().replace('_', '-');
      const name = v.name.toLowerCase();
      const isLatam =
        lang.startsWith('es-419') ||
        lang.startsWith('es-mx') ||
        lang.startsWith('es-cl') ||
        lang.startsWith('es-co') ||
        lang.startsWith('es-us');
      const isFemale =
        name.includes('female') ||
        name.includes('mujer') ||
        name.includes('sabina') ||
        name.includes('paulina') ||
        name.includes('paloma') ||
        name.includes('mia') ||
        name.includes('sofia') ||
        name.includes('isabel') ||
        name.includes('natural');
      return isLatam && isFemale;
    });
    if (latamFemale) return latamFemale;

    // 4. Any Latin American Spanish voice
    const anyLatam = voices.find(v => {
      const lang = v.lang.toLowerCase().replace('_', '-');
      return (
        lang.startsWith('es-419') ||
        lang.startsWith('es-mx') ||
        lang.startsWith('es-cl') ||
        lang.startsWith('es-co') ||
        lang.startsWith('es-us')
      );
    });
    if (anyLatam) return anyLatam;

    // 5. Any Spanish female voice
    const anyEsFemale = voices.find(v => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return (
        lang.startsWith('es') &&
        (name.includes('female') ||
          name.includes('mujer') ||
          name.includes('elena') ||
          name.includes('monica') ||
          name.includes('laura') ||
          name.includes('natural'))
      );
    });
    if (anyEsFemale) return anyEsFemale;

    // 6. Any Spanish voice available in the browser
    const anyEs = voices.find(v => v.lang.toLowerCase().startsWith('es'));
    if (anyEs) return anyEs;

    return null;
  }

  /**
   * Prepares and cleans text for clear, unhurried, natural pronunciation in Argentine Spanish.
   * Expands math symbols into words and inserts natural pauses between ideas.
   */
  private prepareTextForSpeech(rawText: string): string {
    let clean = rawText;

    // Remove emoji symbols that screen synthesizers might read awkwardly
    clean = clean.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ');

    // Normalize math symbols into natural Spanish words with breathing pauses
    clean = clean.replace(/(\d+)\s*[×xX*]\s*(\d+)/g, '$1 por $2');
    clean = clean.replace(/(\d+)\s*\+\s*(\d+)/g, '$1 más $2');
    clean = clean.replace(/\s*=\s*\?/g, ', ¿cuánto es?');
    clean = clean.replace(/\s*=\s*(\d+)/g, ', es igual a $1');
    clean = clean.replace(/2°\s*Grado/gi, 'segundo grado');
    clean = clean.replace(/1°/gi, 'primer');

    // Replace harsh punctuation with gentle commas and breath pauses for clarity
    clean = clean.replace(/[«»]/g, '');
    clean = clean.replace(/·/g, ',');
    clean = clean.replace(/\s{2,}/g, ' ').trim();

    return clean;
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /** Soft pop sound when clicking or adding a grape */
  public playPop(frequency = 520) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.6, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // AudioContext fallback
    }
  }

  /** Cheerful chime for a correct answer */
  public playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /** Magic transformation sound when 'VECES' becomes '×' */
  public playMagic() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  /** Gentle harp celebration for level completion */
  public playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const chord = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = ctx.currentTime + i * 0.1;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(st);
      osc.stop(st + 0.65);
    });
  }

  /** Gentle 'try again' encouraging sound */
  public playEncouraging() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 493.88]; // A4 -> B4 gently upward
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.24);
    });
  }

  /**
   * Speak text out loud for early 2nd grade primary readers.
   * Uses Argentine Spanish, slower pacing (0.80), clear articulation, and natural pauses.
   */
  public speak(text: string) {
    if (this.isMuted || !this.speechEnabled || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any pending speech

    // Ensure best Argentine voice is selected
    if (!this.speechVoice) {
      this.speechVoice = this.pickBestArgentineVoice();
    }

    const naturalText = this.prepareTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(naturalText);

    utterance.lang = 'es-AR';
    utterance.rate = this.speechRate; // 0.80: unhurried, calm, articulate pace
    utterance.pitch = this.speechPitch; // 1.02: natural, warm teacher voice

    if (this.speechVoice) {
      utterance.voice = this.speechVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /** Get name of the current voice for display or testing */
  public getCurrentVoiceName(): string {
    if (!this.speechVoice) {
      this.speechVoice = this.pickBestArgentineVoice();
    }
    return this.speechVoice ? this.speechVoice.name : 'Voz en Español de Argentina';
  }
}

export const sound = new SoundEngine();
