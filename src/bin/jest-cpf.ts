#!/usr/bin/env node

/* eslint-disable import/no-unused-modules, unicorn/filename-case */

import { argv } from 'yargs';
import { outputError } from '../lib/outputs';
import main from '../lib/app';

main(process.argv.splice(2), argv).catch(outputError);
