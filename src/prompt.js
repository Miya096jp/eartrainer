import pkg from "enquirer";
const { Select } = pkg;

export default class Prompt {
  constructor(choices, i, correct_choice, time_limit) {
    this.prompt = null;
    this.choices = choices;
    this.question_no = i + 1;
    this.correct_choice = correct_choice;
    this.time_limit = time_limit;
  }

  async run() {
    await this.#set_prompt();
    const result = await Promise.race([
      this.#run_prompt(),
      this.#timer(this.time_limit),
    ]);
    if (result === "timeup") {
      await this.prompt.cancel();
      return {
        message: `Timeup! the correct answer is ${this.correct_choice}`,
        score: `Q${this.question_no}:×(${this.correct_choice})`,
        point: 0,
      };
    } else if (result === this.correct_choice) {
      return {
        message: "correct!",
        score: `Q${this.question_no}:○`,
        point: 1,
      };
    } else {
      return {
        message: `incorrect! the correct answer is ${this.correct_choice}`,
        score: `Q${this.question_no}:×(${this.correct_choice})`,
        point: 0,
      };
    }
  }

  async #set_prompt() {
    this.prompt = new Select({
      message: `Question${this.question_no}`,
      choices: this.choices,
    });
  }

  async #run_prompt() {
    const user_choice = await this.prompt.run();
    return user_choice;
  }

  #timer(time_limit) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("timeup");
      }, time_limit);
    });
  }
}
