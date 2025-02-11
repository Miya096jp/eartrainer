#!/usr/bin/env node

import minimist from "minimist";
import { all_notes_and_frequencies } from "../src/all_notes_and_frequencies.js";
import EarTraining from "../src/ear_training.js";

const argv = minimist(process.argv.slice(1));
const ear_training = new EarTraining(all_notes_and_frequencies, argv);
ear_training.exec();
