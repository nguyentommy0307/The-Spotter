# The Spotter 🏋️‍♂️

A full-stack web application for discovering, rating, and reviewing gyms.

**Live Website:** (https://the-spotter-2.onrender.com/) 

The Spotter is an interactive platform built from the ground up for gym enthusiasts. It allows users to register, log in, and contribute to a growing database of gyms. Each listing features detailed information, user-submitted reviews, photo galleries, and an interactive map showing its precise location.

The project demonstrates a complete development lifecycle with a secured backend API, a responsive UI, and a comprehensive test suite for both backend logic(Jest) and frontend user flows(Playwright).

---

## ## Features

* **User Authentication:** Secure user registration and login with Passport.js.
* **Gym CRUD Operations:** Authenticated users can create, read, update, and delete gym listings.
* **Authorization:** Users can only edit or delete their own listings and reviews.
* **Interactive Maps:**
    * Cluster map on the index page to show all gym locations (MapTiler).
    * Individual map on each gym's show page.
* **Reviews and Ratings:** Users can leave reviews and star ratings on gyms.
* **Image Uploads:** Image uploads are handled with Multer and stored on Cloudinary.
* **Responsive Design:** Minimal and clean UI built with Bootstrap.

---

## ## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Frontend:** EJS, Bootstrap
* **Maps:** MapTiler API
* **Image Storage:** Cloudinary
* **Authentication:** Passport.js
* **Backend Testing:** Jest & Supertest
* **E2E Testing:** Playwright
* **Deployment:** Render