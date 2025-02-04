export default class ScoreKeeper {
  constructor() {
    this.message = "";
    this.score_sheet = [];
    this.point = 0;
  }

  saveResult(result) {
    this.message = result.message;
    this.score_sheet.push(result.score);
    this.point += 1;
  }

  printMessage() {
    console.log(this.message);
  }

  printFinalScore(number_of_questions) {
    console.log("<Result>");
    console.log(`${this.point}/${number_of_questions}`);
    console.log(this.score_sheet.join("\n"));
  }
}
