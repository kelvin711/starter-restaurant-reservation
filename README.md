# Restaurant Reservation System

## Live Links

- [Backend](#)
- [Frontend](#)

## About

Restaurant reservation system for a final capstone at Chegg Skills Engineering program. The project used:

- React for the client
- Node.js and Express for the API
- PostgreSQL for the database

### User Stories

The user stories included functions such as listing reservations, creating reservations, creating tables, assigning reservations to tables, updating the status of a reservation and table once it's assigned.

### Client Descriptions

#### Dashboard

The Dashboard page displays all reservations for a given date and all tables. Each reservation has options to seat, edit, or cancel the reservation. Each table displays the capacity and status. If the table is occupied, it also displays the reservation_id and a button to clear the table once it's done.

#### New Reservation

The New Reservation page allows you to create a new reservation by providing a first name, last name, mobile number, date of reservation, time of reservation, and number of people in the party.

#### New Table Page

The New Table page allows you to add a new table to the restaurant by providing a table name and table capacity.

#### Edit Reservation

The Edit Reservation page allows you to edit the selected reservation.

#### Seat Reservation

The Seat Reservation page allows you to assign the selected reservation to a particular table.

#### Search

The Search page allows you to search for a reservation by a partial or complete mobile number.

### API

| Request | Path                              | Description                                    |
| ------- | --------------------------------- | ---------------------------------------------- |
| POST    | /reservations                     | Create a new reservation                      |
| GET     | /reservations/:reservation_id      | Read a reservation by a reservation_id         |
| PUT     | /reservations/:reservation_id      | Update a reservation by a reservation_id      |
| PUT     | /reservations/:reservation_id/status | Update a reservation status by a reservation_id |
| GET     | /reservations?mobile_number=XXXXXX | List all reservations containing the mobile number |
| GET     | /reservations?date=XXXX-XX-XX      | List all reservations for a given date        |
| GET     | /tables                           | List all tables                                |
| POST    | /tables                           | Create a new table                             |
| PUT     | /tables/:table_id/seat            | Update the table with a reservation            |
| DELETE  | /tables/:table_id/seat            | Delete a reservation from a table              |

### Installation

1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URLs to your ElephantSQL database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5005`.
6. Run `npm install` to install project dependencies.
7. Run `npm run start:dev` to start your server in development mode.
