# Project-1
Beaker project 1
Link: https://competent-keller-89a6f8.netlify.app/

Technologies Used:
-HTML, CSS, JQuery/Javascript

Approach Taken:
The user can input up to four fields (1, the character field, required) to search
for a character's frame data. Other than the character field, the user can filter
moves based on its initial active frame (filters by the inputted number or less),
total active frames (filters by the inputted number or more), and endlag (filters
by the inputted number or less). If something other than a number number is
inputted into the fields, the search will not happen and the user is notified
of the proper format.

Once valid input is received, the character is inserted into the ajax link that
connects to The KuroganeHammer.com API. This is where all the data will come from.
Using the fields "FirstActionableFrame" and "HitboxActive" (if the data exists),
I can calculate the move's initial active frame, total active frames, and endlag.

The moves that match the user's requirements are all stored into an array of
objects with their own details. Once all of the moves have been checked and
separated, the moves in that array are transferred to the page via a carousel.
The user can see how many moves were returned by their search, and a picture of
the character they were searching for appears as well.

Unsolved Problems:
-empty data fields: some moves had "-" or "null" as their value of
"FirstActionableFrame" or "HitboxActive"
-lack of data: there is not data for some of the cast of Smash Bros (Byleth,
Kazuya, Isabelle, Steve/Alex, and Dark Samus).

Things to improve upon:
I think more regex checks can be done to improve the strength of my current
calculation methods in accordance to how some of the data comes back.
