#!/usr/bin/env node

/* eslint-disable import/no-unused-modules, unicorn/filename-case */

import { argv } from 'yargs';
import main from '../lib/app';
import { outputError } from '../lib/outputs';

main(process.argv.splice(2), argv).catch(outputError);
