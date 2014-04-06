### Fave Backend

## Setup

####Clone repo
    git clone git@github.com:sqren/fave-backend.git && cd fave-backend

####Install NoDemon globally
    npm install -g nodemon

####Install Node modules
    npm install

### MongoDB

####Install MongoDB
    brew install mongodb

####Start MongoDB
    mongod --config /usr/local/etc/mongod.conf

### Start Backend Server
    nodemon --debug app.js

### Import/Export data to/from MongoDB
    cd db-exports

#### Import
    mongoimport --collection meals --file meals.json
    mongoimport --collection restaurants --file restaurants.json

#### Export
    mongoexport --collection meals --out meals.json
    mongoexport --collection restaurants --out restaurants.json
