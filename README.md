# PROJECT 3

Welcome to our team project for EDX BOOTCAMP

TOPIC: **METEORITE LANDINGS**

We created a webapp that connects to the NASA Meteorites Database and gives you different visualizations with the meteorites Data:

URL of the webapp: https://luisg47.github.io/Project3/

## Team Members

[Valeria Itzel Jimenez Paz](https://github.com/valeriajp)   
[Carlos Fernando Sánchez Lozano](https://github.com/CarlosSanchez1999)   
[Miguel Angel Olmos Valderrama](https://github.com/miguelo17)   
[Luis Augusto Galíndez](https://github.com/LUISG47)   


Our app is divided in 4 parts.
The main Sections of the app are these:

<img width="712" alt="Screenshot 2025-02-11 at 10 19 34 p m" src="https://github.com/user-attachments/assets/46e22d7c-e248-4b22-a470-2d5cfcbddb65" />


## SECTION 1.- DASHBOARD

Our initial dashboard contains 3 parts.

The 1st part of the dashboard is a window that gives yoy the main characteristics of the meteorites, and also gives you an item comparison on weight to the meteorite selected:
This is the layout of this section:


<img width="568" alt="Screenshot 2025-02-11 at 10 27 08 p m" src="https://github.com/user-attachments/assets/2899360a-b30c-4613-ac8a-657d4cf3ac39" />

The script that controls this window is on the static/js folder and it's name is **script.js**

The 2nd part of the dashboard is a Bubble Chart that shows the 25 biggest meteorites per year.
This is the layout of this section:

<img width="1214" alt="Screenshot 2025-02-11 at 10 27 27 p m" src="https://github.com/user-attachments/assets/43e0c665-e8f1-4d88-a2ff-da9e6cd15f82" />

The script that controls this window is on the static/js folder and it's name is **app.js**


The 3rd part of the dashboard is a Histogram of Total Count of Meteorite Falls by Year
This is the layout of this section:

<img width="1209" alt="Screenshot 2025-02-11 at 10 27 37 p m" src="https://github.com/user-attachments/assets/8c2e9605-cc14-4a1c-8630-a19b20b49539" />

The script that controls this window is on the static/js folder and it's name is **script2.js**


## SECTION 2.- METEORITE MAP

This section shows you the 2000 most recent meteorites on the nasa database with a FOUND status globally
We also added a region selector so you can select from this regions 

+ Global view
+ USA
+ Mexico
+ Europe
+ Asia
+ South America

This is the layout of this section:

<img width="1710" alt="Screenshot 2025-02-11 at 10 35 04 p m" src="https://github.com/user-attachments/assets/04fcb65b-8505-469f-908f-ff5770635a04" />

We also added other basemap layers for better visualization:

<img width="1714" alt="Screenshot 2025-02-11 at 10 35 47 p m" src="https://github.com/user-attachments/assets/e79f595b-a4d3-40b8-bfe7-daaddf403313" />

The script that controls this window is on the static/js folder and it's name is **logic.js**

## SECTION 3.- CHOROPLETH MAP

This section shows you a Choropleth map by mass of the meteorites

This is the layout of this section:

<img width="1708" alt="Screenshot 2025-02-11 at 10 37 36 p m" src="https://github.com/user-attachments/assets/8ff02a44-b002-478e-b8ad-fe66c04ce550" />

The script that controls this window is on the static/js folder and it's name is **logic2.js**

## SECTION 4.- CREATE YOUR OWN METEORITE!

This section lets you get your own meteorite.

You just need enter your name and year of birth.

The algorithm will search for the same year and name of the meteorite that has the highest number of letters in your name.

This is the layout of this section:

<img width="1406" alt="Screenshot 2025-02-11 at 10 40 52 p m" src="https://github.com/user-attachments/assets/aa899569-043e-484d-8daf-a9e51e1fc49b" />

The script that controls this window is on the static/js folder and it's name is **logic_mname.js**


The script that controls all the flow of the visualization is on the main folder and it's called index.html

### ACCESS TO THE DATASET

We obtained the dataset from this site: https://catalog.data.gov/dataset/meteorite-landings

And the JSON to which you can point to obtain the data has this URL: https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD


## EXTRA.- CREATION OF POSTGRE DATABASE

For this part we created a postgree file in order to be able to make a databse with the csv provided by the dataset 

In this case you need to first create the table of the DB with this instructions:

![Screenshot 2025-02-12 at 10 14 59 p m](https://github.com/user-attachments/assets/59bb9ce2-6952-4e4e-b271-f900a9089522)


One you have created your table you can import the csv file in order to manipulate the data
Please make sure to have this parameters when you import the csv file 

![Screenshot 2025-02-12 at 10 07 30 p m](https://github.com/user-attachments/assets/92972042-51dc-4f52-94ae-828a78fb2690)


One the table is created you can check is displayed correctly with a SELECT * FROM meteorite_landings instruction
You must get this result

![Screenshot 2025-02-12 at 10 07 56 p m](https://github.com/user-attachments/assets/5714d7d2-2d5c-4051-bd34-61d9c0c08bcf)


You then can manipulate the dataset like ordering the meteorites by mass, or count from the database which meteorites were found
That code is also provided in the sql file and you should see this results:


![Screenshot 2025-02-12 at 10 09 29 p m](https://github.com/user-attachments/assets/d4364fe8-b6fe-4b63-9408-c7cb9890dfcc)

![Screenshot 2025-02-12 at 10 18 00 p m](https://github.com/user-attachments/assets/f7a959de-6cc2-4e14-9cf7-06c50633edc6)

The files for the database are located on the Postgre Folder





