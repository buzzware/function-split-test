# The "Firebuilder" pattern for structuring Firebase functions apps

## Goals
* To create a clean organised convention for structuring one or more Firebase Functions apps, in a single project functions folder
* To be compatible with Firebase Functions hosting, local "firebase serve" emulation, and plain node.js for local debugging eg. in Jetbrains WebStorm/IntelliJ IDEA etc
* To encourage use of express.js to host an entire app per function
* To make efficient use of how Firebase Functions creates a something like a container per function, that contains code for all of our functions, and to minimise unnecessary cold start time wasted in setting up other functions that will never be executed.  
* To support express-compatible frameworks - Feathersjs in particular 

## Background
* GCP creates a separate runtime per function, and each function
executes with FUNCTION_NAME set to the name of the assigned function.
* There is no need to initialise dependencies for functions that the
current runtime will never serve. So we can save memory and startup time
by conditionally setting each one up.
* We must appear to export all functions we ever serve here, for firebase functions
to find and allocate runtimes. In reality, we only export a blank express app for
functions we will never execute in each runtime.
* There are undocumented rules for how Firebase discovers exported functions, and
some methods of conditional exports caused them to fail to be found, so this is code
is a bit fragile.

## Description

We have :
1. the index.js file required by Firebase Functions, and an equivalent index_node.js entry point for plain node.js
2. the firebuilder.js file that contains the loadAndBuild method and documentation of this pattern. This is only used by index.js and index_node.js
3. one build_*.js file per app, named by the exported firebase function names 

### index.js
* This creates the main express app, perhaps using loadAndBuild and build_main.js. This is not for application logic - it is for framework type functionality
* It then uses loadAndBuild to conditionally add one app to the main app
* It then exports all endpoints with the main app. Remember that in the Firebase Functions runtime, there will be a runtime created per exported function, and only the FUNCTION_NAME function will actually be used for each.   

### index_node.js
* This creates the main express app, perhaps using loadAndBuild and build_main.js. This is not for application logic - it is for framework type functionality
* It then builds each app and attaches it to the main app
* It then calls listen on the main app.
* Unlike index.js, this hosts all apps in the normal way
