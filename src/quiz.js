import Prompt from "./prompt.js";
import Tone from "./tone.js";
import NoteAndFrequency from "./note_and_frequency.js";
import Choices from "./choices.js";

export default class Quiz {
  constructor(current_notes_and_frequencies, volume, i, time_limit) {
    this.current_notes_and_frequencies = current_notes_and_frequencies;
    this.volume = volume;
    this.i = i;
    this.time_limit = time_limit;
  }

  async set() {
    const note_and_frequency = new NoteAndFrequency(
      this.current_notes_and_frequencies,
    );
    const root_freq = note_and_frequency.root_freq;
    const correct_freq = note_and_frequency.correct_freq;
    const correct_note = note_and_frequency.correct_note;
    const incorrect_notes = note_and_frequency.incorrect_notes;
    const choices = new Choices(correct_note, incorrect_notes).build();
    const tone = new Tone(root_freq, correct_freq, this.volume);
    await tone.play();
    const prompt = new Prompt(choices, this.i, correct_note, this.time_limit);
    return await prompt.run();
  }
}
