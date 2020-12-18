COMP5703
Project Name: Interactive Platform for Unit Selection
Group ID: CS64-4

The project uses the MEVN framework. MEVN is an MEVN is an acronym for MongoDB, ExpressJS, Vue and NodeJS.
To run this platform, you need to set up the environment first.

Environment setup walkthrough:
a.	Download and install Node.js
    The latest stable version of Node.js can be downloaded from
    https://nodejs.org/dist/v12.16.1/node-v12.16.1-x64.msi
    The package manager npm is distributed with Node.js.
    It will be automatically installed when Node.js is downloaded and installed.

b.	Install Express, body parser, path and express session modules using npm
    Node.js modules can be installed through the npm registry. To install those modules,
    we need to run the commands below within the project directories ("COMP5703-CS64-4\server" and "COMP5703-CS64-4\client"):
        $ npm install
    (Note: Remember to run this command in both directories)

c.	Download and install MongoDB
    The latest community version of MongoDB can be downloaded from
    https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

d.	Install mongoose using npm
    To install mongoose, we need to run the command below within the project directory:
    $ npm install mongoose --save

After successfully setting up the running environment, you need to setup the database for this platform.
Please download the latest version of Robo 3T from the official website. Robo 3T allows you to create an local database
and collections for storing required information.

Before running Robo 3T, you need to create a directory to store the configuration files.
We call this directory "Directory A". After the installation of Robo 3T is completed, you need open the Command Prompt
and change the directory to the installation directory of MongoDB (For example, "C:\Program Files\MongoDB\Server\4.2\bin").
Then, run the command:
   $ mongod.exe --dbpath Directory A

By running this command, MongoDB would create a local database connection on port 27017.
(Note: Do not close the Command Prompt while running the system)
Then, please run Robo 3T and select or create connection on port 27017 with default settings.
We can now create our database and import our data.

---------------------------------------------------------------------------------------------------------------------
Here are several essential steps you need to follow while setting up database in Robo 3T:
1. Create a database called "db" in the connection on port 27017
2. Create 6 collections in the Collections folder under this database
    The names of those collections must be "admin", "course", "course_studied", "major", "sessions" and "student".
3. Import data by right-clicking on the collection
    Please find the json files located in the directory "COMP5703-CS64-4\server\public\dataset\"
    and import them into the corresponding collection. You need to copy the content in the json file first,
    then right click on the corresponding collection and click on "Insert Document...".
    Please paste and replace the content in the pop uo window, then press "Save" button.
    The data would be successfully inserted after you finish the steps above.
---------------------------------------------------------------------------------------------------------------------

After setting up the environment and the database, you should be able to run the platform by running the commands below
in the project directory:
    1. Run "$ node app.js" under the server directory "COMP5703-CS64-4\server"
    2. Run "$ npm run serve" under the client directory "COMP5703-CS64-4\client"

You can now visit the student portal by accessing "http://localhost:8080/"
and the administrator portal by accessing "http://localhost:8080/adminlogin"

Administrator portal provides a default account (called Super Admin), whose ID and password has been stored in 
collection "admin". First time users should log in the portal using this Super Admin account.
Administrator portal contains to two main function modules: Unit management and Major management. You can access 
these modules by clicking labels. You are allowed to process related data viewing and editing functions.

Thank you,

Group CS64-4
