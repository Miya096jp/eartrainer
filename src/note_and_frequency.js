export default class NoteAndFrequency {
  constructor(current_notes_and_frequencies) {
    this.current_notes_and_frequencies = current_notes_and_frequencies;
    this._root_freq = null;
    this._correct_note = null;
    this._incorrect_notes = null;
    this.#extract();
  }

  get root_freq() {
    return this._root_freq;
  }

  get correct_note() {
    return this._correct_note;
  }

  get correct_freq() {
    return this._correct_freq;
  }

  get incorrect_notes() {
    return this._incorrect_notes;
  }

  #extract() {
    this.#extract_root_frequency();
    this.#extract_correct_note_and_frequency();
    this.#extract_incorrect_notes();
  }

  #extract_root_frequency() {
    const root_note_and_frequency = this.current_notes_and_frequencies.find(
      (note_and_frequency) => {
        return Object.keys(note_and_frequency).includes("Root");
      },
    );
    this._root_freq = Object.values(root_note_and_frequency)[0];
  }

  #extract_correct_note_and_frequency() {
    const candidates = this.#remove_root_from_notes_and_frequencies();
    const correct_note_and_frequency =
      candidates[Math.floor(Math.random() * candidates.length)];
    this._correct_note = Object.keys(correct_note_and_frequency)[0];
    this._correct_freq = Object.values(correct_note_and_frequency)[0];
  }

  #extract_incorrect_notes() {
    const incorrect_notes_and_frequencies =
      this.#remove_root_from_notes_and_frequencies();
    this._incorrect_notes = incorrect_notes_and_frequencies.map(
      (incorrect_note_and_frequency) => {
        return Object.keys(incorrect_note_and_frequency)[0];
      },
    );
  }

  #remove_root_from_notes_and_frequencies() {
    return this.current_notes_and_frequencies.filter((note_and_frequency) => {
      return !Object.keys(note_and_frequency).includes("Root");
    });
  }
}
