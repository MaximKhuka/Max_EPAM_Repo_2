const allureReporter = require('@wdio/allure-reporter').default;

function logStep(label, description) {
  const message = `${label}: ${description}`;
  console.log(message);

  if (allureReporter && typeof allureReporter.addStep === 'function') {
    allureReporter.addStep(message);
  }
}

module.exports = {
  given: (description) => logStep('Given', description),
  when: (description) => logStep('When', description),
  then: (description) => logStep('Then', description),
};