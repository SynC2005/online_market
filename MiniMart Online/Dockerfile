FROM jenkins/jenkins:lts-jdk17

USER root

# Menggabungkan instalasi untuk mengurangi jumlah layer Docker
# Menggunakan direktori keyrings terbaru sesuai standar dokumentasi Docker saat ini
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    && install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc \
    && chmod a+r /etc/apt/keyrings/docker.asc \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
       $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && rm -rf /var/lib/apt/lists/*

USER jenkins

# Mengunduh versi terbaru dari plugin yang kompatibel dengan versi Jenkins saat ini
RUN jenkins-plugin-cli --plugins "blueocean docker-workflow"
