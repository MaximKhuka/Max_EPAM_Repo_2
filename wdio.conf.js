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
            acceptInsecureCerts: true,
            'moz:firefoxOptions': {
                binary: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
                args: ['-width=1920', '-height=1080', '-no-remote'],
                prefs: {
                    'browser.shell.checkDefaultBrowser': false,
                    'browser.startup.homepage': 'about:blank',
                    'startup.homepage_welcome_url': 'about:blank',
                    'startup.homepage_welcome_url.additional': 'about:blank',
                    'browser.aboutwelcome.enabled': false,
                    'app.update.auto': false,
                    'app.update.enabled': false,
                    'datareporting.policy.dataSubmissionEnabled': false,
                    'toolkit.telemetry.reportingpolicy.firstRun': false
                }
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