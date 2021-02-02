# Footprint

Connect your physical footprint to your digital footprint! A simple safety/social media app that utilizes 
the Geolocation API in your browser to fetch your current location and posts a path on a Leaflet map + feed
along with a picture and description for friends to view. Footprint is a MEAN stack application 
generated with MongoDB, Express.js, Angular, and Node.js.

## Motivation
The creation of Footprint was inspired by the idea of keeping documentation of a user's location 
in case of an emergency. This way, friends can report to missing person services the last known
location of a missing user. Officials will find extremely useful details including the coordinates,
descriptions, pictures, and dates of a person if they went missing while using this app during a short walk 
or a long trip out of the country.

## Demo (Chrome)
- Live: http://footprint-mean.s3-website.us-east-2.amazonaws.com/

  - Read only login ~ email: demo@demo.com, pwd: demo
    - (or create your own!)

  - Read and write login ~ email: test@test.com, pwd: test  
    - (modify cluster data for everyone, only use to verify functionality)

- REST api: http://footprint-env.eba-m2w5qfkx.us-east-2.elasticbeanstalk.com/api/posts

## Local Installation
- node v15.4.0
- npm v7.0.15
```
npm install @angular/cli
```
```
npm install express
```
```
npm install nodemon
```
```
npm install
```

## Running Locally
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

Run `npm run start:server` in a separate terminal to connect to the database.

Chrome seems to run this app better than other browsers.

# If connecting to the database fails...
You will either have to create your own cluster on MongoDB and modify backend/app.js 
or email me and I can add your IP address! The issue here is that 
even though I whitelisted all IP addresses, there must be some unspoken secruity issue 
preventing you from connecting - still working on this issue!

## Preview
![alt text](src/assets/images/preview.png?raw=true "Preview")

## Notable Features
- Authentication/Authorization Services
- Password encryption
- Scrollable Feed
- Upload jpg or png (with validation)
- Connects to Geolocation API
- Pagination
- Leaflet Map with Antpath and Circlemarkers
- Map controls
- RESTful API
- Error handling

## Bugs
Refreshing your browser while viewing the feed clashes with the authentication service
and therefore hides the edit and delete buttons on each post even though you are still
recognized as logged in. You have to logout and login to view these buttons again.

## Version Limitations
This current version only supports displaying one trip at a time on the map or else the 
trips will be connected by a single path. You will have to delete all posts in the current trip 
to start a new path.

## Next Steps
- Add feature to showcase more than one trip
- Refactor code for mobile
- Implement "Take picture" button instead of "Choose File"
- Create an "Add friends" page
- Modify backend to only GET your posts and friends' posts

### Misc.
The bulk of the feed/map component code is located in the post-list folder. Mongoose 
connects to the database in the backend/app.js file. The password connecting you to the 
demo database is only temporary! Hope you liked the project!

### Credits
- Luke Macy
  - https://github.com/missionloyd

### Additional Resources
#### Leaflet
- https://github.com/Leaflet/Leaflet

#### AntPath
- https://github.com/rubenspgcavalcante/leaflet-ant-path
