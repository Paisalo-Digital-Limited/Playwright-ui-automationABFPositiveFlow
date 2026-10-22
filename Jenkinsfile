pipeline {
    agent any

    environment {
        IMAGE_NAME  = "pdl-erp-ui-automation"
        IMAGE_TAG   = "latest"
        REPORT_DIR  = "playwright-report"
        VOLUME_NAME = "playwright_report_volume"

        // ERP Environment Variables
        ERP_URL      = "https://testerp.paisalo.in:8825/"
        ERP_EMAIL    = "dotnetdev6@paisalo.in"
        ERP_PASSWORD = "Himanshu@321"
        ERP_OTP      = "123456"
        ERP_EMP_CODE = "PDLA000154"

        // HR
        ERP_EMAIL_HR    = "headhr@paisalo.in"
        ERP_PASSWORD_HR = "Admin@123"
        ERP_OTP_HR      = "123456"

        // HOD
        ERP_EMAIL_HOD    = "svpit@paisalo.in"
        ERP_PASSWORD_HOD = "Admin@123"
        ERP_OTP_HOD      = "123456"

        // Coordinator
        ERP_EMAIL_COORDINATOR    = "coordinator.rahul@paisalo.in"
        ERP_PASSWORD_COORDINATOR = "Admin@123"
        ERP_OTP_COORDINATOR      = "123456"

        // OEM Admin
        ERP_EMAIL_OemAdmin    = "admin.himanshu@paisalo.in"
        ERP_PASSWORD_OemAdmin = "Admin@123"
        ERP_OTP_OemAdmin      = "123456"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {

                    sh "docker volume rm -f ${VOLUME_NAME} || true"
                    sh "docker volume create ${VOLUME_NAME}"

                    def exitCode = sh(
                        script: """
                            docker run --rm \
                            -e CI=true \
                            -e ERP_URL='${ERP_URL}' \
                            -e ERP_EMAIL='${ERP_EMAIL}' \
                            -e ERP_PASSWORD='${ERP_PASSWORD}' \
                            -e ERP_OTP='${ERP_OTP}' \
                            -e ERP_EMP_CODE='${ERP_EMP_CODE}' \
                            -e ERP_EMAIL_HR='${ERP_EMAIL_HR}' \
                            -e ERP_PASSWORD_HR='${ERP_PASSWORD_HR}' \
                            -e ERP_OTP_HR='${ERP_OTP_HR}' \
                            -e ERP_EMAIL_HOD='${ERP_EMAIL_HOD}' \
                            -e ERP_PASSWORD_HOD='${ERP_PASSWORD_HOD}' \
                            -e ERP_OTP_HOD='${ERP_OTP_HOD}' \
                            -e ERP_EMAIL_COORDINATOR='${ERP_EMAIL_COORDINATOR}' \
                            -e ERP_PASSWORD_COORDINATOR='${ERP_PASSWORD_COORDINATOR}' \
                            -e ERP_OTP_COORDINATOR='${ERP_OTP_COORDINATOR}' \
                            -e ERP_EMAIL_OemAdmin='${ERP_EMAIL_OemAdmin}' \
                            -e ERP_PASSWORD_OemAdmin='${ERP_PASSWORD_OemAdmin}' \
                            -e ERP_OTP_OemAdmin='${ERP_OTP_OemAdmin}' \
                            -v ${VOLUME_NAME}:/app/${REPORT_DIR} \
                            ${IMAGE_NAME}:${IMAGE_TAG} \
                            npx playwright test --reporter=html
                        """,
                        returnStatus: true
                    )

                    if (exitCode != 0) {
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Copy Report to Workspace') {
            steps {
                script {
                    sh "docker create --name report_temp_container -v ${VOLUME_NAME}:/data busybox"
                    sh "rm -rf ${WORKSPACE}/playwright-report || true"
                    sh "mkdir -p ${WORKSPACE}/playwright-report"
                    sh "docker cp report_temp_container:/data/. ${WORKSPACE}/playwright-report/"
                    sh "docker rm report_temp_container"
                }
            }
        }

        stage('Publish Artifacts') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo "Pipeline completed."
        }
    }
}
