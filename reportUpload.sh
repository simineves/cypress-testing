#!/bin/bash

# Datadog API key
DD_API_KEY="${DATADOG_API_KEY}"

# Define the service name for Datadog
SERVICE_NAME="techops-cypress-webapp-reports"

# Directory containing report files
REPORT_DIR="cypress/reports"

# Loop through each JSON report file in the directory
for file in "$REPORT_DIR"/*.json; do
  if [ -f "$file" ]; then
    echo "Uploading content of $file to Datadog with service name: $SERVICE_NAME..."

    # Extract file content
    content=$(cat "$file")

    # Send content to Datadog logs
    curl -X POST "https://http-intake.logs.datadoghq.com/v1/input" \
      -H "Content-Type: application/json" \
      -H "DD-API-KEY: $DD_API_KEY" \
      -d "{
            \"message\": $content,
            \"service\": \"$SERVICE_NAME\",
            \"status\": \"info\"
          }"

    echo "Successfully uploaded content of $file to Datadog."
  else
    echo "File $file does not exist or is not a regular file."
  fi
done
