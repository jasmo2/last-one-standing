#!/bin/bash

rm build.txt
cd angular-example && echo '\n\n--- ANGULAR --- \n\n' >> ../build.txt && npm run build-prod >> ../build.txt && cd .. && cd react-example && echo '\n\n--- REACT --- \n\n' >> ../build.txt && npm run build >> ../build.txt && cd .. && cd vue-example && echo '\n\n--- VUE --- \n\n' >> ../build.txt && npm run build >> ../build.txt && cd ..

