# The Fifth Team:
This project aims to:
 - To stream a flux of detected emotions of all individuals in a group into a Database.
 - Carry out cluster analysis on the data to divide the group into various subgroups.

  ![](./gif.gif)

## Group Members
* ### Abobker Elaghel – Product Owner
* ### Ahmed Wheida – Scrum Master
* ### Ali Jalal
* ### Jihed Abdelly


### Description
The Idea of the project is to automate and/or facilitate the process of checking the mental state/health of a specific institution, workspace, school, etc.
By constantly checking and analyzing the face expressions, of the personnel who work and/or study in that specific place.
And send that data to the superior authority of that place or the concerned party to be psychoanalyzed.
Also, real-time monitoring and analyzing, of all the cameras monitoring personnel, students, workers etc. available in the interface connected to the database.

### Motivation:
The emotional health of team members is a good indicator of whether the team reaches its
objective or not.
At my workplace, we are required to fill-out emotional health survey twice a day.
 The issue is that I can deliberately wrongfully fill out the simple survey. However, I would not be
able to express disingenuous facial expression for the whole time.

Build status
Build status of continuous integration i.e. travis, appveyor etc. Ex. -

### Structure of the App
src
│   server/server.js    # App entry point
└───GraphQL             # GraphQL controller for app endpoint
└───config              # Environment variables and configuration
└───Models              # Database models
└───services            # All the business logic is here
└───tests               # All the tests are here


### Code style
MDB [mdbootstrap](https://mdbootstrap.com/)
Bootstrap [bootstrap]([https://getbootstrap.com/](https://getbootstrap.com/))
js-standard-style

Tech/framework used
VueJS, GraphQl, Express, NodeJs, MongoDB

### Built with
javascript

### Features
* Face Recognition - identify who is the person through his face
* Emotional identification - can recognize of the person looking at the camera is Happy, Sad, Neutral, Surprised, Angry, fearful or disgusted
* has Multiple Charts, and Bar chart, River chart, Radar charts, etc..., to see chronological statistics of the emotions during a time period
* Cluster analysis on the data
* Has complete admin Dashboard, with the charts mounted above and other features, jwt token, CSV report downloading, password reset functionality, etc...

### API Reference
Face Api reference [GitHub](https://github.com/justadudewhohacks/face-api.js/)

Tests
1. Fork
2. Clone it
3. run `npm i` in the terminal inside of the project file
4. run `npm test`

### How to use?
1. Fork
2. Clone it
3. run `npm i` in the terminal inside of the project file
4. run `npm start`

## The-Fifth