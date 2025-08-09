#! /bin/bash

POST_PATH="$HOME/Projects/Personal/ironpark.github.io.sync/output/posts/*.md"

rm -rf "./src/content/blog"
mkdir -p "./src/content/blog"
cp $POST_PATH "./src/content/blog"


rm -rf "./static/posts"
mkdir -p "./static/posts"
cp -r "$HOME/Projects/Personal/ironpark.github.io.sync/output/static/posts" "./static"