export default class QuizComponents {
  constructor(current_notes_and_frequencies) {
    this.current_notes_and_frequencies = current_notes_and_frequencies;
    this.root_freq = null;
    this.top_note = null;
    this.top_freq = null;
    this.choices = null;
  }

  get_quiz_components() {
    this.#get_root_frequency();
    this.#get_top_note_and_frequency();
    this.#build_choices();
    return [this.root_freq, this.top_note, this.top_freq, this.choices];
  }

  #get_root_frequency() {
    const root_note_and_frequency = this.current_notes_and_frequencies.find(
      (note_and_frequency) => {
        return Object.keys(note_and_frequency)[0] === "Root";
      },
    );
    this.root_freq = Object.values(root_note_and_frequency)[0];
  }

  #get_candidates_of_choices() {
    return this.current_notes_and_frequencies.filter((note_and_frequency) => {
      return Object.keys(note_and_frequency)[0] !== "Root";
    });
  }

  #get_top_note_and_frequency() {
    const candidates = this.#get_candidates_of_choices();
    const selected_candidate =
      candidates[Math.floor(Math.random() * candidates.length)];
    const [selected_note] = Object.keys(selected_candidate);
    const [selected_frequency] = Object.values(selected_candidate);
    this.top_note = selected_note;
    this.top_freq = selected_frequency;
  }

  #build_choices() {
    const candidates = this.#get_candidates_of_choices();
    let choices = [this.top_note];
    while (choices.length < 4) {
      const selected_candidate =
        candidates[Math.floor(Math.random() * candidates.length)];
      const [selected_note] = Object.keys(selected_candidate);
      if (choices.includes(selected_note)) {
        continue;
      }
      choices.push(selected_note);
    }
    this.#shuffle(choices);
    this.choices = choices;
  }

  #shuffle(choices) {
    for (let i = choices.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[randomIndex]] = [choices[randomIndex], choices[i]];
    }
  }
}
