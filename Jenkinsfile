pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    parameters {
        string(
            name: 'TEST_BASE_URL',
            defaultValue: 'https://www.runoob.com/',
            description: '远程被测网站地址'
        )
    }

    environment {
        CI = 'true'
        PLAYWRIGHT_HTML_OPEN = 'never'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify tools') {
            steps {
                bat 'git --version'
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install chromium'
            }
        }

        stage('Run UI tests') {
            environment {
                BASE_URL = "${params.TEST_BASE_URL}"
            }
            steps {
                bat 'npm run test:e2e'
            }
        }
    }

    post {
        always {
            junit(
                testResults: 'test-results/junit.xml',
                allowEmptyResults: true
            )

            archiveArtifacts(
                artifacts: 'playwright-report/**,test-results/**',
                allowEmptyArchive: true,
                fingerprint: true
            )
        }
    }
}