# Task-App
#### This is a development version of Task App (worked on this as guided by the nodejs course instructor Andrew Mead) which enables the user to create profile(add an avatar for your profile too!) and keep a track of the tasks to be performed/already performed
## Set up
### To set it up on your local machine
##### 1. Install [Nodejs](https://nodejs.org/en/), [MongoDB](https://www.mongodb.com), [Postman](https://www.postman.com/)(to create and save HTTP/s requests and read their responses), [Robo3t](https://robomongo.org/)(GUI for mongoDB) on your machine
##### 2. Use the following git command to clone this repository:
```git clone https://github.com/mitalirs/Task-App.git <where to clone>```
##### or download the zip version
##### 3. Run the following npm command to install dependencies
```npm i```
##### 4. Create a folder with the name 'config' in the project directory and a dev.env file(inside the config folder) to store environment variables(key=value format).
##### 5. Create a task app collection in Postman and create and save get/post/patch/delete requests inside it
##### 5.1 Create a dev environment in Postman with variables 
###### a. url(set the value as localhost:3000) and 
###### b. authtoken
##### 5.2 Edit the collection to select the 'bearer token' type inside the authorization tab and insert the value {{authtoken}} (the syntax for env variable) for the token key.
##### 5.3 To automatically set the value of authtoken for every request after signing up/logging in, inside the Tests tab of signup and login requests write following codes respectively:
##### >>for signup
```if(pm.response.code === 201){pm.environment.set('authtoken', pm.response.json().token)}``` 
##### >>for login
```if(pm.response.code === 200){pm.environment.set('authtoken', pm.response.json().token)}```
##### 5.4 For signup/login requests select the type as 'no auth' under the authorization tab and for rest of the requests select the type 'Inherit auth from parent'
##### 6. After connecting to the database run the following npm command
```npm run dev```
##### now use Postman to perform operations(like creating profile, adding tasks and many others) by running the requests created. Check the database using Robo3t
