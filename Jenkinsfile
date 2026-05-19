pipeline {
    agent {
        docker {
            image 'node:20-slim'
            args '-p 3000:3000'
        }
    }
    environment {
        NEXT_PUBLIC_SUPABASE_URL = credentials('supabase-url')
        NEXT_PUBLIC_SUPABASE_ANON_KEY = credentials('supabase-anon-key')
        SUPABASE_SERVICE_ROLE_KEY = credentials('supabase-service-role-key')
        JWT_SECRET_KEY = credentials('jwt-secret-key')
        MIDTRANS_SERVER_KEY = credentials('midtrans-server-key')
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') { 
            steps {
                sh './jenkins/scripts/test.sh' 
            }
        }
    }
}
