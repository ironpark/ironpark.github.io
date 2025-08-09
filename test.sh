#!/bin/bash
source .env

LOCAL_POST_PATH="$HOME/Documents/Brain/2.Areas/Blog"
LOCAL_ASSETS_PATH="$HOME/Documents/Brain/Z.Assets"
rm -rf "./cache/mermaid/*"
rm -rf "./posts"
rm -rf "./assets"

cp -r $LOCAL_POST_PATH "./posts"
cp -r $LOCAL_ASSETS_PATH "./assets"

GITHUB_TOKEN=$GITHUB_TOKEN pnpm build

# rm -rf "./posts"
# rm -rf "./assets"