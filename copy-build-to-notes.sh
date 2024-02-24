#!/bin/bash
echo Running from
pwd

if [ -f .env ]
then
    export $(cat .env | xargs)
else
    echo Environment not set
    return
fi

rm ${NOTES_DIR}/main.js
cp ${DEV_DIR}/main.js ${NOTES_DIR}/main.js
echo "js copied to ${NOTES_DIR}/main.js"

rm ${NOTES_DIR}/manifest.json
cp ${DEV_DIR}/manifest.json ${NOTES_DIR}/manifest.json
echo "manifest copied to ${NOTES_DIR}/manifest.json"

rm ${NOTES_DIR}/styles.css
cp ${DEV_DIR}/styles.css ${NOTES_DIR}/styles.css
echo "styles copied to ${NOTES_DIR}/styles.css"