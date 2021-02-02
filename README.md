# Footprint

Connect your physical footprint to your digital footprint! A simple safety/social media app that utilizes 
the Geolocation API in your browser to fetch your current location and posts a path on a Leaflet map and feed
along with a picture and description for friends to view. Footprint is MEAN stack application 
generated with MongoDB, Express.js, Angular, and Node.js.

## Motivation
The creation of Footprint was inspired by the idea of keeping documentation of a user's location 
in case of an emergency. This way, friends can report to missing person services the last known
location of a missing user. Officials will find extremely useful details including the coordinates,
descriptions, pictures, and dates of a person if they went missing while using this app during a short walk 
or a long trip out of the country.

## Installation
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

## Preview
![alt text](src/assets/images/preview.png?raw=true "Preview")

## Notable Features
- Authentication/Authorization Services
- Password encryption
- Scrollable Feed
- Upload jpg or png (validation)
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
trips will be connected by the path. You will have to delete all posts in the current trip 
to start a new path.

## Next Steps
- Add feature to showcase more than one trip
- Refactor code for mobile
- Implement "Take picture" button instead of "Choose File"
- Create an "Add friends" page
- Modify backend to only GET your posts and friends' posts

### Misc.
The bulk of the feed/map component code is located in the post-list folder. Mongoose 
connects to the database in the /backend/app.js file. The password connecting you to the 
demo database is only temporary!

### Credits
- Luke Macy
  - https://github.com/missionloyd

### Additional Resources
#### Leaflet
- https://github.com/Leaflet/Leaflet

#### AntPath
- https://github.com/rubenspgcavalcante/leaflet-ant-path
