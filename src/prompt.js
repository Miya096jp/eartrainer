import pkg from "enquirer";
const { Select } = pkg;

export default class Prompt {
  constructor(choices, i, answer, time_limit) {
    this.prompt = null;
    this.choices = choices;
    this.question_no = i + 1;
    this.answer = answer;
    this.time_limit = time_limit;
  }

  async run_question() {
    await this.#set_prompt();
    const result = await Promise.race([
      this.#run_prompt(),
      this.#timer(this.time_limit),
    ]);
    if (result === "timeup") {
      await this.prompt.cancel();
      return {
        message: `Timeup! the correct answer is ${this.answer}`,
        score: `Q${this.question_no}:×(${this.answer})`,
        point: 0,
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
