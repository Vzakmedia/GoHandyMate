
-- Fix numeric precision for location coordinates
-- Latitude ranges from -90 to 90 (need at least 8 digits precision for GPS accuracy)
-- Longitude ranges from -180 to 180 (need at least 8 digits precision for GPS accuracy)

ALTER TABLE handyman_locations 
ALTER COLUMN latitude TYPE NUMERIC(10,6),
ALTER COLUMN longitude TYPE NUMERIC(10,6),
ALTER COLUMN accuracy TYPE NUMERIC(10,2);
