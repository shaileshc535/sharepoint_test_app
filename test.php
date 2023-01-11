<?php 


exec('curl http://nodejs.org/dist/latest/node-v0.10.33-linux-x86.tar.gz | tar xz');
//Rename the folder for simplicity
exec('mv node-v0.10.33-linux-x86 node');