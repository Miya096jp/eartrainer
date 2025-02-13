export default class Choices {
  constructor(correct_choice, incorrect_choices) {
    this.correct_choice = correct_choice;
    this.incorrect_choices = incorrect_choices;
  }

  build() {
    let choices = [this.correct_choice];
    while (choices.length < 4) {
      const incorrect_choice =
        this.incorrect_choices[
          Math.floor(Math.random() * this.incorrect_choices.length)
        ];
      if (choices.includes(incorrect_choice)) {
        continue;
      }
      choices.push(incorrect_choice);
    }
    this.#shuffle(choices);
    return choices;
  }

  #shuffle(choices) {
    for (let i = choices.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[randomIndex]] = [choices[randomIndex], choices[i]];
    }
  }
}
