import chalk from 'chalk';
import fuzzy from 'fuzzy';
import combineTypeScope from './helpers/combineTypeScope';
import ruleWarningMessages from './rules/ruleWarningMessages';

const choices = (config) => {
  const choicesList = [];

  config.types.forEach((type) => {
    const emoji = config.emoji && type.emoji ? `${type.emoji} ` : '';
    const configType = config.lowercaseTypes ? type.type.toLowerCase() : type.type;
    const description = type.description || '';

    choicesList.push({
      value: emoji + configType,
      name: `${chalk.bold(configType)} ${description}`,
    });
  });

  return choicesList;
};

const scopeChoices = (config) => {
  const choicesList = [];

  config.scopes.forEach((scope) => {
    const transformScope = config.lowercaseScopes ? scope.toLowerCase() : scope;
    choicesList.push(transformScope);
  });

  return choicesList;
};

const initMessage = (config) => {
  let message = '';

  if (config.emoji &&
    typeof config.initialCommit === 'object' &&
    config.initialCommit.isEnabled) {
    message = `${config.initialCommit.emoji} ${config.initialCommit.message}`;
  } else {
    message = config.initialCommit.message;
  }

  return message;
};

const initQuestion = (config) => {
  const message = initMessage(config);

  return {
    type: 'confirm',
    name: 'initCommit',
    message: `Confirm as first commit message: "${message}"`,
    default: true,
  };
};

let typeChoicesList = [];
let scopeChoicesList = [];

const searchScopeAsync = (previousAnswers, input) => {
  const filterInput = input || '';
  return new Promise((resolve) => {
    const fuzzyResult = fuzzy.filter(filterInput, scopeChoicesList);
    resolve(
      fuzzyResult.map(el => el.original),
    );
  });
};

const searchTypeAsync = (previousAnswers, input) => {
  const filterInput = input || '';
  return new Promise((resolve) => {
    const fuzzyResult = fuzzy.filter(filterInput, typeChoicesList);
    resolve(
      fuzzyResult.map(el => el.original),
    );
  });
};

const questions = (config) => {
  const choicesList = choices(config);
  // change global let
  scopeChoicesList = scopeChoices(config);
  typeChoicesList = choicesList.map(item => item.value + item.name);
  const questionsList = [
    {
      type: 'autocomplete',
      name: 'type',
      message: 'What\'s the type of your commit:',
      filter: input => (input && input.split(':', 1)[0] ? `${input.split(':', 1)[0]}:` : 'chore:'),
      source: searchTypeAsync,
      pageSize: 15,
    },
    {
      type: 'input',
      name: 'scope',
      message: 'Enter your scope (no whitespaces allowed):',
      when: () => config.scope,
      validate: input => (input.match(/\s/) !== null ? 'No whitespaces allowed' : true),
      filter: input => (input ? `(${input})` : 'No scope'),
      pageSize: 15,
    },
    {
      type: 'autocomplete',
      name: 'scope',
      message: 'What\'s the scope of your commit:',
      when: () => config.scopeList,
      source: searchScopeAsync,
      filter: input => (input ? `(${input})` : 'No scope'),
      pageSize: 15,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter your commit message:',
      validate: (input, answers) => {
        if (input.length === 0) {
          return 'The commit message is not allowed to be empty';
        }

        const scope = answers.scope || '';
        const type = combineTypeScope(answers.type, scope.trim());
        const combinedInput = `${type} ${input.trim()}`;
        const warnings = ruleWarningMessages(combinedInput, config);

        return warnings || true;
      },
    },
    {
      type: 'confirm',
      name: 'body',
      message: 'Do you want to add a body?',
      when: () => config.body,
      default: false,
    },
    {
      type: 'editor',
      name: 'editor',
      message: 'This will let you add more information',
      when: answers => answers.body,
      default: (answers) => {
        const type = combineTypeScope(answers.type, answers.scope);

        return `${type} ${answers.description}\n\n\n`;
      },
    },
  ];

  return questionsList;
};

export default questions;
export {
  choices,
  initMessage,
  initQuestion,
};
