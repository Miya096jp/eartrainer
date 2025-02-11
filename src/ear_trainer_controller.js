import PromptManager from "./prompt_manager.js";
import TonePlayer from "./tone_player.js";
import ScoreKeeper from "./score_keeper.js";
import QuizComponents from "./quiz_components.js";

export default class EarTrainerController {
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
      const score_keeper = new ScoreKeeper(this.number_of_questions);
      this.#set_game_mode();
      for (let i = 0; i < this.number_of_questions; i++) {
        const quiz_components = new QuizComponents(
          this.current_notes_and_frequencies,
        );
        let [root_freq, top_note, top_freq, choices] =
          quiz_components.get_quiz_components();
        const tone_player = new TonePlayer(
          root_freq,
          top_freq,
          this.#set_volume(),
        );
        await tone_player.play_tones();
        const prompt_manager = new PromptManager(
          choices,
          i,
          top_note,
          this.#set_time_limit(),
        );
        const result = await prompt_manager.runQuestion();
        score_keeper.saveResult(result);
        score_keeper.printMessage();
      }
      score_keeper.printFinalScore(this.number_of_questions);
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
