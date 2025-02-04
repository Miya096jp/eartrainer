import pkg from "enquirer";
const { Select } = pkg;

export default class PromptManager {
  constructor(choices, i, answer, time_limit) {
    this.prompt = null;
    this.choices = choices;
    this.question_no = i + 1;
    this.answer = answer;
    this.time_limit = time_limit;
  }

  async runQuestion() {
    await this.#setPrompt();
    const result = await Promise.race([
      this.#runPrompt(),
      this.#timer(this.time_limit),
    ]);
    if (result === "timeup") {
      await this.prompt.cancel();
      return {
        message: `Timeup! the correct answer is ${this.answer}`,
        score: `Q${this.question_no}:×(${this.answer})`,
        point: 1,
      };
    } else if (result === this.answer) {
      return {
        message: "correct!",
        score: `Q${this.question_no}:○`,
        point: 1,
      };
    } else {
      return {
        message: `incorrect! the correct answer is ${this.answer}`,
        score: `Q${this.question_no}:×(${this.answer})`,
        point: 1,
      };
    }
  }

  async #setPrompt() {
    this.prompt = new Select({
      message: `Question${this.question_no}`,
      choices: this.choices,
    });
  }

  async #runPrompt() {
    const user_answer = await this.prompt.run();
    return user_answer;
  }

  #timer(time_limit) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("timeup");
      }, time_limit);
    });
  }
}
