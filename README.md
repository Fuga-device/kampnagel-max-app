# Kampnagel Max patch

This program is a Max patch designed and developed for the Kampnagel project.
It allows to connect up to 5 R-IoT devices via WiFi and use them to generate a real-time soundtrack of the performance.

A R-IoT device is a WiFi enabled electronic board embedding a 3 axis accelerometer, a 3 axis gyroscope, and a 3 axis magnetometer.
In this project, each R-IoT is attached to a wrist or an ankle of one of the dancers, and the sensors' raw movement data is streamed to the Max patch.

Each connected R-IoT can be assigned to a track. A track has 2 functions :

* It can trigger a sound when a peak in the movement's energy is detected (the sound is randomly picked from 3 preloaded sounds per track)
* It can modulate the volume of a looping sound according to the incoming energy data stream.

The main file to open with Max to run the program is `kampnagel.maxpat`.
More documentation on how to use the patch is included inside and accessible from the main interface.
The patch only depends on this folder's contents, no external dependencies are required.

