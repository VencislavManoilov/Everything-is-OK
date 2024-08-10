<h1 align="center">
Everything is OK
</h1>

## Overview
<p align="center">
  "Everything is OK" is a chat-based website designed to calm people's worries or assist them with various tasks using AI. The project idea originated from a ChatGPT suggestion during a moment of boredom.
  You can visit it on <a href="https://devman.site">devman.site</a>
</p>

## Features
- **Account Management**: Create an account or continue as a guest.
- **AI Chat**: Interact with an AI like ChatGPT for help and reassurance.
- **Chat History**: Browse previous conversations.

## Tech Stack
- **Backend**: ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
- **Database**: ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
- **Frontend**: ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white) ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)
- **Hosting**: Kamatera
- **Domain**: Hostinger (available at [devman.site](http://devman.site))

## Setup

### Prerequisites
- OpenAI API key (set as environment variable `OPENAI_API_KEY`)

### Using npm
1. **Setup MySQL**:
   * Run `database.sql` located in `mysql-init` directory.
2. **Backend**:
   ```sh
   cd back-end
   npm install
   npm start
   ```
3. **Frontend**:
   ```sh
    cd front-end
    npm install
    npm run build
    npm install -g serve
    serve -s build
   ```
### Using Docker
1. In the root directory, run:
   ```sh
   docker-compose build
   docker-compose up
   ```
2. Access the site at `localhost:3000`

## Usage
* **Guest Access**: Continue as a guest without an account.
* **Account Access**: Register or log in to save and view chat history and manage your profile.

## Contributing
Contributions are currently not being accepted.

## License
This project does not have a license at the moment.

## Contact
For questions or feedback, contact: [vencislav2.manoilov@gmail.com](mailto:vencislav2.manoilov@gmail.com)
