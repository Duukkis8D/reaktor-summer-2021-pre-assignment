# Reaktor summer 2021 pre-assignment

## Purpose

The app is for Reaktor developer summer 2021 job application. It is meant to test the applicant's programming and problem solving skills.

Instructions for the pre-assignment: https://www.reaktor.com/junior-dev-assignment/.

## Function

The app is targeted for an imaginary clothing brand that needs a simple web app to use in their warehouses. It shows product information for three product categories: gloves, facemasks and beanies. The current category can be chosen from a drop-down menu. Unfortunately, page loading speed is a bit slow.

## Usage

The app can be started in https://reaktor-2021-duukkis8d.herokuapp.com/.

Alternatively it can be started in local development environment by first cloning this repository to any directory.

After that, please check that the value of the baseUrl variable in this repository's src/App.js file is `'https://reaktor-2021-duukkis8d.herokuapp.com/api'`. Change it if needed.

Finally, the app is started by using `npm start` in the local repository directory. The app connects to the server specified in baseUrl variable. That server acts as a reverse proxy between client (web browser) and Reaktor Bad API (more info about the API on 'instructions for the pre-assignment' link above).
