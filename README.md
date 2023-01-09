
# PROJECT NEST

Repository for backend server of Reaktor Summer trainee program
The backend server is running on: https://reaktor-backend-kjit.onrender.com (Works only when connecting from my frontend due to cors)

Frontend repo for this site found at: https://github.com/samikuikka/Reaktor-frontend

and the website for accessing the application: https://reaktor-frontend-l2w4.onrender.com

Due to free tier hosting, the backend do not run all the time if it is not used. It will take small time to start the server

"Web Services on the free instance type are automatically spun down after 15 minutes of inactivity. When a new request for a free service comes in, Render spins it up again so it can process the request. This can cause a response delay of up to 30 seconds for the first request that comes in after a period of inactivity." - Render

## Introduction

Backend server for retrieving drone and pilot information.
Communication with the frontend done with the socket.io (WebSockets)
Node.js server written totally in TypeScript for type-safety.

## Running the application

    npm i
    npm run dev
