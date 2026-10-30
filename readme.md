#AS OF NOW, PROJECT IS UNDER MAINTENANCE, PLEASE AWAIT FIXES

# AcademIQs AI: An easy-to-use AI quiz generator

## Overview
AcademIQs AI is a simple and user-friendly AI quiz generator designed to create engaging and challenging quizzes for various subjects.
It mainly works using the Google Gemini API (specifically model: gemini-1.5-pro), which is a large language model that can generate text based on a given prompt, making it ideal for creating quizzes.
Then the user can input their exam preferences into an HTML form, which is then sent to the server via a POST request and can be processed to generate a quiz based on these preferences.

## How to start up
In order to start up the server and be able to use the website, you need to do the following:

1. The required packages already come installed in the node_modules folder, so there is no need to install any packcages by yourself, the only thing you should have installed however is Node.js itself, as it's the main framework for everything to work correctly
2. Open the terminal and navigate to the root directory of the project
3. run the following command in the terminal:
`node server.mjs`
This will insure that the server is up and running.
4. Make sure that the terminal is kept open and do not by any means close it.
5. Open a web browser and navigate to `http://localhost:3000/` to access the website itself, make sure you are online in order for the website to work
6. You can now input your preferences into the form and submit it to generate a quiz based on your personal preferences.

An APK for the project is insluded in the releases folder, in order to run it on Android mobile devices.
