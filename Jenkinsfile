pipeline {
    agent {
        docker {
            image 'node:18-slim'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') { 
            steps {
                sh 'chmod +x ./jenkins/scripts/test.sh && ./jenkins/scripts/test.sh' 
            }
        }
    }
}