import json from 'json-extra';
import merge from 'lodash.merge';
import os from 'os';
import path from 'path';

const cwd = process.cwd();
const homedir = os.homedir();

const getConfig = (altPath) => {
  const pathString = altPath || path.join(cwd, '.mgcrc');
  const configObject = json.readToObjSync(pathString);
  const globalConfig = json.readToObjSync(path.join(homedir, '.mgcrc'));
  const packageConfig = json.readToObjSync(path.join(cwd, 'package.json')).sgc;
  const mgcrcDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.mgcrc'));
  const mgcrcTestDefaultConfig = json.readToObjSync(path.join(__dirname, '..', '.mgcrc_default'));

  const mgcrcDefault = mgcrcDefaultConfig || mgcrcTestDefaultConfig;

  // priority order (1. highest priority):
  // 1. local config
  //   - 1. .mgcrc
  //   - 2. (package.json).sgc
  // 2. global config
  // 3. default config
  //   - 1. from ../.mgcrc
  //   - 2. test case ../.mgcrc is renamed to ../.mgcrc_default
  const config = configObject || packageConfig || globalConfig || mgcrcDefault;

  // set defaults which are necessary
  const tempConfig = merge({}, mgcrcDefault, config);

  // do not merge types
  // so return them to their set default
  if (config.types) {
    tempConfig.types = config.types;
  }

  if (config.initialCommit) {
    tempConfig.initialCommit = config.initialCommit;
  }

  // next will remove "inherit" from the config
  // eslint-disable-next-line
  const { inherit, ...copiedConfig } = tempConfig;

  return copiedConfig;
};

export default getConfig;
