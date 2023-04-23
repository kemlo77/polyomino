/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/typedef */
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
    {
        serverUrl: 'http://localhost:9000',
        options: {
            'sonar.login': 'admin',
            'sonar.password': 'test1234',
            'sonar.projectName': 'polyomino-project',
            'sonar.projectDescription': 'Description for "My App" project...',
            'sonar.sources': 'src',
            'sonar.tests': 'test',
            'sonar.exclusions': 'coverage/*, node_modules/*, test/*',
            'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info'
        }
    },
    () => process.exit()
);