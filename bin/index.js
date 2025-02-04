#!/usr/bin/env node

import minimist from "minimist";
import { all_notes_and_frequencies } from "../src/all_notes_and_frequencies.js";
import EarTrainerController from "../src/ear_trainer_controller.js";

const argv = minimist(process.argv.slice(1));
const ear_trainer = new EarTrainerController(all_notes_and_frequencies, argv);
ear_trainer.exec();
