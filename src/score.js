export default class Score {
  constructor() {
    this.message = "";
    this.score_sheet = [];
    this.point = 0;
  }

  save_result(result) {
    this.message = result.message;
    this.score_sheet.push(result.score);
    this.point += result.point;
  }

  print_message() {
    console.log(this.message);
  }

  print_final_score(number_of_questions) {
    console.log("<Result>");
    console.log(`${this.point}/${number_of_questions}`);
    console.log(this.score_sheet.join("\n"));
  }
}
