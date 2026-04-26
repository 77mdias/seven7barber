#!/bin/bash
# Health check script for monitoring

API_URL=${API_URL:-http://localhost:3000}
WEB_URL=${WEB_URL:-http://localhost:3001}
FAILED=0

echo "Checking API health..."
if curl -sf "$API_URL/health" > /dev/null; then
  echo "✓ API: OK"
else
  echo "✗ API: FAILED"
  FAILED=1
fi

echo "Checking Web health..."
if curl -sf "$WEB_URL/health" > /dev/null; then
  echo "✓ Web: OK"
else
  echo "✗ Web: FAILED"
  FAILED=1
fi

if [ $FAILED -eq 1 ]; then
  echo "Health check failed!"
  exit 1
fi

echo "All services healthy"
exit 0