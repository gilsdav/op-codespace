sleep 10
# Clone git
git clone $GITHUB_REPOSITORY ./workspace/;
# Read config file
sudo node config-executor.js
# Start Vs Code
code-server --bind-addr 0.0.0.0:8080 ./workspace;