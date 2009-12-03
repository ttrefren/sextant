#!/bin/bash
# Create a new branch, push to remote, and begin tracking it

git branch $1
git push origin $1
git branch -f $1 origin/$1
git checkout $1
