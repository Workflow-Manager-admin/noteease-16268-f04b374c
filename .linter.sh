#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-16268-f04b374c/noteease_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

