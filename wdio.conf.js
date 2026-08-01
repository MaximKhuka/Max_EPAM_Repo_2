const { afterScenarioHook } = require('./src/hooks/scenario-hooks');

exports.config = {
    runner: 'local',

    specs: [
        './features/**/*.feature'
    ],
    exclude: [],

    maxInstances: 2,

    capabilities: [
        {
            browserName: 'firefox',
            browserVersion: 'latest',
            acceptInsecureCerts: true,
            'moz:firefoxOptions': {
                args: ['-width=1920', '-height=1080']
            }
        },
        {
            browserName: 'MicrosoftEdge',
            browserVersion: 'latest',
            acceptInsecureCerts: true,
            'ms:edgeOptions': {
                args: ['--window-size=1920,1080', '--start-maximized']
            }
        }
    ],

    logLevel: 'error',
    bail: 0,
    baseUrl: 'https://www.saucedemo.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'cucumber',

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false
        }]
    ],

    cucumberOpts: {
        require: [
            './src/step-definitions/**/*.steps.js'
        ],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        format: ['pretty'],
        colorsEnabled: true,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },

    afterScenario: async function (world, result) {
        await afterScenarioHook(world, result);
    }
};