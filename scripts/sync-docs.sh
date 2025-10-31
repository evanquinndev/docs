#!/bin/bash
# Sync Documentation Script
# Automatically regenerates OpenAPI spec and syncs to Mintlify
# Run this as part of your deployment pipeline

set -e # Exit on error

echo "🔄 Starting documentation sync..."

# Step 1: Regenerate OpenAPI spec
echo "📋 Regenerating OpenAPI specification..."
tsx scripts/generate-openapi.ts

if [ $? -ne 0 ]; then
  echo "❌ OpenAPI generation failed"
  exit 1
fi

# Step 2: Verify OpenAPI file exists
if [ ! -f "docs/openapi.json" ]; then
  echo "❌ OpenAPI spec not found at docs/openapi.json"
  exit 1
fi

echo "✅ OpenAPI spec generated successfully"

# Step 3: Check if Mintlify is installed (optional)
if command -v mintlify &> /dev/null; then
  echo "📚 Building Mintlify docs..."
  cd docs && mintlify dev --port 3333 &
  MINTLIFY_PID=$!
  sleep 3
  
  # Check if Mintlify started successfully
  if kill -0 $MINTLIFY_PID 2>/dev/null; then
    echo "✅ Mintlify docs server started at http://localhost:3333"
    echo "   Press Ctrl+C to stop"
    wait $MINTLIFY_PID
  else
    echo "⚠️  Mintlify dev server failed to start"
  fi
else
  echo "ℹ️  Mintlify CLI not installed. Skipping local preview."
  echo "   Install with: npm install -g mintlify"
fi

echo ""
echo "✨ Documentation sync complete!"
echo ""
echo "Next steps:"
echo "  1. Review docs/openapi.json for accuracy"
echo "  2. Test docs locally: cd docs && mintlify dev"
echo "  3. Deploy docs: git push (auto-deploys to Mintlify)"
echo ""
