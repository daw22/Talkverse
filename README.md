
# Talkvers chat Application

Talkvers is a real-time chat application that transates messages between users, so that users speaking different languages can message each other without a language barrier. Using talkvers a user will be able to pick his/her prefered language so that he/she can recive a translation to that language along with incoming messages.
Talkverse is web application and is built with the MERN stack. For real-time communication it utilizes socket.io and it translates users mesages using Google api studio's Gemini 1.5 pro model.

## To Run The Project Locally

To run the project locally you need to have a running redis instance.
Clone the project

```bash
  git clone https://github.com/daw22/Talkverse
```

Go to the project directory

```bash
  cd Talkverse
```

Install dependencies

```bash
  cd chat-client && npm install
```

```bash
  cd chat-server && npm install
```
Start the server

```bash
  cd chat-client && npm run dev
```

```bash
  cd chat-client && npm run dev
```
## Environment Variables

To run this project, you will need to create .env file in the chat-server folder and add the following environment variables

`DB_URI`=`MongoDB uri`

`JWT_KEY`=`a random key for jwt token creation`

`AI_API`=`api key from Google ai studio`

`PORT`=`for the backend server`


## Authors

- [@Dawit](https://www.linkedin.com/in/dawit-yifru/)

