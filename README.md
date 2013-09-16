What is this?
-------------

A quick hack by Lenny Burdette. Choose a song to listen to and share this app with a friend so they can listen along anywhere in the world. Tell them you love a song (you'll see a flashing heart when they love it.)

What’s it made of?
------------------

* Backend: Node + Express + Socket.IO + ejs
* Frontend: Ractive.js + Underscore + Compass
* Dev: Grunt + Bower + Vagrant
* Deployed to: AWS Opsworks
* Background from icondeposit
* Icon font from bootstrap
* Music from bootiesf

Why doesn’t it work?
--------------------

I only tested it in recent versions of Chrome, Safari and Firefox, and barely tested it at that.

More stuff to do:
-----------------

* keyboard controls
* mobile friendliness (and general layout cleanup)
* better presence notifications
* better error handling if audio file can't load

Getting started
---------------

    $ vagrant up
    $ vagrant ssh
    $ cd /vagrant
    $ npm install
    $ bower install
    $ grunt

then open localhost:8080/ on the host machine