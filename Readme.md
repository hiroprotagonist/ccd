This is a learning by doing thing for me and a few friends
----------------------------------------------------------

The Tek Stack
-------------
Serverside
==========
1. node.js as web server
2. express.js (web framework)
3. everyauth.js for authentication
4. redis server used for session store
5. mongodb/mongoose.js datastore
6. Jade a server side template engine

Clientside
==========
1. underscore.js for client side templating
2. backbone.js client side mvc
3. jquery as ui event glue

Precons
-------

1. Install node.js
2. Install mongodb
3. Install redis-server
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
