import PromptManager from "./prompt_manager.js";
import TonePlayer from "./tone_player.js";
import ScoreKeeper from "./score_keeper.js";

export default class EarTrainerController {
  constructor(all_notes_and_frequencies, argv) {
    this.all_notes_and_frequencies = all_notes_and_frequencies;
    this.advance_mode = argv["a"] || false;
    this.volume = argv["v"] || 5;
    this.time_limit = argv["t"] || 5;
    this.number_of_questions = argv["q"] || 10;
    this.root_freq = null;
    this.top_note = null;
    this.top_freq = null;
    this.choices = null;
  }

  async exec() {
    try {
      const score_keeper = new ScoreKeeper(this.number_of_questions);
      this.#set_game_mode();
      for (let i = 0; i < this.number_of_questions; i++) {
        this.#build_quiz_components();
        const tone_player = new TonePlayer(
          this.root_freq,
          this.top_freq,
          this.#set_volume(),
        );
        await tone_player.play_tones();
        const prompt_manager = new PromptManager(
          this.choices,
          i,
          this.top_note,
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

  #build_quiz_components() {
    this.#get_root_frequency();
    this.#get_top_note_and_frequency();
    this.#build_choices();
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
