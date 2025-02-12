import Score from "./score.js";
import Quiz from "./quiz.js";

export default class EarTraining {
  constructor(all_notes_and_frequencies, argv) {
    this.all_notes_and_frequencies = all_notes_and_frequencies;
    this.current_notes_and_frequencies = null;
    this.advance_mode = argv["a"] || false;
    this.volume = argv["v"] || 5;
    this.time_limit = argv["t"] || 5;
    this.number_of_questions = argv["q"] || 10;
  }

  async exec() {
    try {
      const score = new Score(this.number_of_questions);
      this.#set_game_mode();
      for (let i = 0; i < this.number_of_questions; i++) {
        const quiz = new Quiz(this.current_notes_and_frequencies, this.#set_volume(), i, this.#set_time_limit());
        const result = await quiz.set();
        score.save_result(result);
        score.print_message();
      }
      score.print_final_score(this.number_of_questions);
    } catch (err) {
      console.error(err.message);
      console.error(err.stack);
      process.exit[0];
    }
  }

  #set_game_mode() {
    if (this.advance_mode) {
      const keys = Object.keys(this.all_notes_and_frequencies);
      const current_key = keys[Math.floor(Math.random() * keys.length)];
      this.current_notes_and_frequencies =
        this.all_notes_and_frequencies[current_key];
    } else {
      this.current_notes_and_frequencies = this.all_notes_and_frequencies["F"];
    }
  }

  #set_volume() {
    if (this.volume > 10) {
      return 10 * 1000;
    } else {
      return this.volume * 1000;
    }
  }

  #set_time_limit() {
    if (this.time_limit > 10) {
      return 10 * 1000;
    } else {
      return this.time_limit * 1000;
    }
  }
}
