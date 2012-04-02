This is a learning by doing thing for me and a few friends
----------------------------------------------------------

Precons
-------

1. Install node.js
2. Install mongodb

Run
---
1. Start the mongodaemon

~~~
$> mkdir data/db
$> mongod --dbpath data/db
~~~

2. Run the server from the ccd directory

~~~
$> node app.js
~~~

Tip
---
Node wont recompile code during runtime ans you have to restart node everytime code changed.
You can work around this by starting the app with nodemon instead of node.
Install nodemon globally.

~~~
$> npm install -g nodemon
$> nodemon app.js
~~~
