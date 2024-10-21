# Cuvette Assignment

## Overview

This project includes both a client and a server. Follow the instructions below to set up and run both components. Please note that I haven't deployed the application because I am using trial accounts with Twilio and Mailgun, which only allow sending SMS and emails to registered numbers and addresses in their respective dashboards. If I had deployed it, you wouldn't be able to receive emails or SMS messages, as my accounts only permit communication to my own registered contacts. However, you can test the functionality locally by providing your own Twilio and Mailgun credentials. If you use paid account credentials, the application can send messages to any phone number or email address. 

## Getting Started

### Running the Client

1. Navigate to the client directory:
```bash
cd client
```
   

2. Install the necessary dependencies:
```bash
npm install
```

3. Create a .env file based on example.env and provide all the values.

4. Start the client:
```bash
npm run dev
```
   

### Running the Server

1. Navigate to the server directory:
```bash
cd server
```
   

2. Install the necessary dependencies:
```bash
npm install
```
   

3. Create a .env file based on example.env and provide all the values.

4. Start the server:
```bash
npm run dev
```
   
## Notes

- Ensure you have Node.js and npm installed on your machine.
- Make sure to configure the .env files correctly for both the client and server to ensure proper functionality.
