import tone from "tonegenerator";
import Speaker from "speaker";

export default class TonePlayer {
  constructor(root_freq, top_freq, volume) {
    this.root_freq = root_freq;
    this.top_freq = top_freq;
    this.length_in_secs = 2;
    this.root_tone = null;
    this.top_tone = null;
    this.chord = null;
    this.volume = volume;
  }

  async play_tones() {
    this.#generate_tones();
    await this.#play_count();
    await this.#amplifier(this.root_tone);
    await this.#amplifier(this.chord);
  }

  async #play_count() {
    const count = this.#tone_generator(850, 0.1);
    for (let i = 0; i < 3; i++) {
      await this.#amplifier(count);
      await this.#delay_helper(1000);
    }
  }

  #delay_helper(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  #generate_tones() {
    this.#get_root_tone();
    this.#get_top_tone();
    this.#get_chord();
  }

  #tone_generator(freq, length_in_secs = this.length_in_secs) {
    return tone({
      freq: freq,
      lengthInSecs: length_in_secs,
      volume: this.volume,
      rate: 44100,
      Int16Array: true,
    });
  }

  #get_root_tone() {
    this.root_tone = this.#tone_generator(this.root_freq, this.length_in_secs);
  }

  #get_top_tone() {
    this.top_tone = this.#tone_generator(this.top_freq, this.length_in_secs);
  }

  #get_chord() {
    const chord = new Int16Array(this.root_tone.length);

    for (let i = 0; i < chord.length; i++) {
      chord[i] = this.root_tone[i] + this.top_tone[i];
    }
    this.chord = chord;
  }

  #amplifier(tone) {
    const speaker = new Speaker({
      channels: 1,
      bitDepth: 16,
      sampleRate: 44100,
    });
    return new Promise((resolve, reject) => {
      try {
        speaker.write(tone, () => {
          speaker.end(() => {
            resolve();
          });
        });
      } catch (err) {
        console.error(err.message);
        console.error(err.stack);
        reject(err);
      }
    });
  }
}
