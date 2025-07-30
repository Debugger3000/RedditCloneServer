

#!/bin/bash

# Function to clean up Redis container on exit
cleanup() {
  echo -e "\nCaught CTRL+C or exit. Stopping Redis container..."
  docker stop redis-reddit-dev > /dev/null 2>&1
  echo "Redis container stopped."
  exit
}

# Trap SIGINT (CTRL+C) and SIGTERM signals to run cleanup()
trap cleanup SIGINT SIGTERM

echo "Starting Redis container..."

# Check if Redis container is running
if ! docker ps --filter "name=redis-reddit-dev" --filter "status=running" -q | grep -q .; then
  # Try to start existing container
    if docker start redis-reddit-dev > /dev/null 2>&1; then
        echo "Started existing Redis container."
    else
        echo "Redis container does not exist. Please create it first."
    fi
else
  echo "Redis container already running."
fi

echo "Starting Node.js server..."
npm start

# When npm exits (naturally or via CTRL+C), clean up Redis
cleanup
