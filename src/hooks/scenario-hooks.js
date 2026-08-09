const fs = require('fs');
const path = require('path');
const allureReporter = require('@wdio/allure-reporter').default;
const PageFactory = require('../utils/PageFactory');

async function resetStateIfPossible() {
  let currentUrl;

  try {
    currentUrl = await browser.getUrl();
  } catch (error) {
    // Session may already be closing — nothing to reset.
    return;
  }

  if (!currentUrl.includes('inventory.html')) {
    return;
  }

  try {
    await PageFactory.getPage('inventoryPage').resetAppState();
  } catch (error) {
    console.error(`WARNING: failed to reset app state after scenario: ${error.message}`);
  }
}

async function captureFailureArtifact(world, result) {
  if (result.passed) {
    return;
  }

  const scenarioName = world.pickle.name.replace(/\s+/g, '-').toLowerCase();
  const dir = path.join(process.cwd(), 'error-shots');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${scenarioName}-${Date.now()}.png`);
  await browser.saveScreenshot(filePath);

  if (allureReporter && typeof allureReporter.addAttachment === 'function') {
    allureReporter.addAttachment('Failure screenshot', fs.readFileSync(filePath), 'image/png');
  }
}

async function afterScenarioHook(world, result) {
  await captureFailureArtifact(world, result);
  await resetStateIfPossible();
}

module.exports = { afterScenarioHook };