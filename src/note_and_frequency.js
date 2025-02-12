export default class NoteAndFrequency {
  constructor(current_notes_and_frequencies) {
    this.current_notes_and_frequencies = current_notes_and_frequencies;
    this._root_freq = null;
    this._answer_note = null;
    this._answer_note_freq = null;
    this._extra_notes = null;
    this.#extract();
  }

  get root_freq() {
    return this._root_freq;
  }

  get answer_note() {
    return this._answer_note;
  }

  get answer_freq() {
    return this._answer_freq;
  }

  get extra_notes() {
    return this._extra_notes;
  }

  #extract() {
    this.#extract_root_frequency();
    this.#extract_answer_note_and_frequency();
    this.#extract_extra_notes();
  }

  #extract_root_frequency() {
    const root_note_and_frequency = this.current_notes_and_frequencies.find(
      (note_and_frequency) => {
        return Object.keys(note_and_frequency).includes("Root");
      },
    );
    this._root_freq = Object.values(root_note_and_frequency)[0];
  }

  #extract_answer_note_and_frequency() {
    const candidates = this.#extract_extra_notes_and_frequencies();
    const extra_note_and_frequency =
      candidates[Math.floor(Math.random() * candidates.length)];
    this._answer_note = Object.keys(extra_note_and_frequency)[0];
    this._answer_freq = Object.values(extra_note_and_frequency)[0];
  }

  #extract_extra_notes() {
    const extra_notes_and_frequencies = this.#extract_extra_notes_and_frequencies();
    this._extra_notes = extra_notes_and_frequencies.map(
      (extra_note_and_frequency) => {
        return Object.keys(extra_note_and_frequency)[0];
      },
    );
  }

  #extract_extra_notes_and_frequencies() {
    return this.current_notes_and_frequencies.filter((note_and_frequency) => {
      return !Object.keys(note_and_frequency).includes("Root");
    });
  }
}
