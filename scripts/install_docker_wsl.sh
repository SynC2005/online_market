#!/bin/bash
set -e

echo "============================================"
echo "  Docker Engine Installation on WSL Ubuntu"
echo "============================================"

# Step 1: Remove old versions
echo ""
echo "[1/6] Removing old Docker packages..."
sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Step 2: Update apt and install prerequisites
echo ""
echo "[2/6] Installing prerequisites..."
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Step 3: Add Docker official GPG key
echo ""
echo "[3/6] Adding Docker GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Step 4: Set up the Docker repository
echo ""
echo "[4/6] Adding Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Step 5: Install Docker Engine
echo ""
echo "[5/6] Installing Docker Engine..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Step 6: Post-install - add user to docker group
echo ""
echo "[6/6] Adding user to docker group..."
sudo usermod -aG docker $USER

# Start Docker daemon
echo ""
echo "Starting Docker daemon..."
sudo service docker start

# Verify installation
echo ""
echo "============================================"
echo "  Verifying Docker installation..."
echo "============================================"
sudo docker --version
sudo docker run hello-world

echo ""
echo "============================================"
echo "  ✅ Docker Engine installed successfully!"
echo "  NOTE: Log out and back in (or restart WSL)"
echo "  to use docker without sudo."
echo "============================================"
