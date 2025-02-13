CREATE TABLE meteorite_landings ( 
name TEXT, 
id INTEGER,
nametype TEXT, 
recclass TEXT, 
mass REAL, 
fall TEXT, 
year INTEGER, 
reclat REAL, 
reclong REAL, 
GeoLocation TEXT );

SELECT * FROM meteorite_landings


SELECT * FROM meteorite_landings
ORDER BY mass DESC;


SELECT COUNT(*) AS found_count
FROM meteorite_landings
WHERE fall = 'Found';