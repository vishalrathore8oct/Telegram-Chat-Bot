# Telegram Quiz Bot

This Telegram bot allows users to take interactive quizzes on various topics. Users can choose a category, read a paragraph, and answer questions based on the content. The bot tracks their progress and provides feedback for each question.

---

## Features

- **Category Selection**: Users can choose a topic of interest.
- **Interactive Paragraphs**: Each quiz starts with a short paragraph related to the topic.
- **Multiple-Choice Questions**: Users answer questions with clickable options in Telegram.
- **Progress Tracking**: The bot tracks correct and incorrect answers.
- **MongoDB Integration**: User data, quiz categories, questions, and paragraphs are stored in a MongoDB database.

---

## Prerequisites

Before setting up the bot, make sure you have:

1. **Node.js** installed (v14 or later). Download it from [Node.js Official Website](https://nodejs.org/).
2. **npm** (Node Package Manager), which comes with Node.js.
3. **MongoDB** installed locally or have access to a remote MongoDB server.
4. **Telegram Bot Token**. You can create a bot and get the token using [BotFather](https://core.telegram.org/bots#botfather).

---

## Steps to get bot token form BotFather

1. First you have to login your Telegram Profile.
2. Find telegram bot named "@botfarther", he will help you with creating and managing your bot.
![Screenshot](https://www.siteguarding.com/images/telegram_1.png)
3. Print “/help” and you will see all possible commands that the botfather can operate.
![Screenshot](https://www.siteguarding.com/images/telegram_2.png)

4. To create a new bot type “/newbot” or click on it.

    Follow instructions he given and create a new name to your bot. If you are making a bot only for experimentation, as it has to be a unique name, you can use namespace your bot by placing your name before it in its username. By the way, its screen name can be anything you like.

5. Congratulations! You've just created your Telegram bot. You will see a new API token generated for it.
In sample above it's 270485614:AAHfiqksKZ8WmR2zSjiQ7_v4TMAKdiHm9T0

Copy your API token to Your Project configration file name .evn .



## How to Set It Up Locally

### Step 1: Clone the Project

1. Open a terminal or command prompt.
2. Run the following command to clone the repository:

   ```bash
   git clone https://github.com/vishalrathore8oct/Telegram-Chat-Bot.git
   cd telegram-chat-bot
   ```

### Step 2: Install Dependencies
1. Run the following command in the project directory to install all required dependencies:

    ```bash
    npm install
    ```

    This will install packages like telegraf, dotenv, and mongoose from your package.json file.y

### Step 3: Rename the .env.sample File into .env file

1. Now Replace the following environment variables values to the file:

    ```bash
    TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>
    MONGODB_URI=<your-mongodb-uri>
    DATABASE_NAME=<your-database-name>
    ```

    1. Replace <your-telegram-bot-token> with the token you got from BotFather.
    2. Replace <your-mongodb-uri> with your MongoDB connection string (e.g., mongodb://localhost:27017 for local MongoDB).
    3. Replace <your-database-name> with the name you want for your database.

### Step 4: Start Your MongoDB Server
**For Local MongoDB:**

1. Ensure MongoDB is installed on your machine.

2. Start MongoDB by running the following command in a terminal:

    ```bash
    sudo systemctl start mongod
    ```


    If you're using MongoDB Compass or another GUI, ensure the connection string matches your .env configuration MONGODB_URI .

### Step 5: Start the Bot
1. To run the bot in normal mode, use:

    ```bash
    npm run start
    ```

2. For development mode (with automatic reloading), use:

    ```bash
    npm run dev
    ``` 

3. The bot will start, and you should see a message like:


    ```bash
    Connected to MongoDB Successfully
    Bot is running...
    ```

Open Telegram, search for your bot (the one created using BotFather), and start interacting!


### Step 6: Add quiz data in your database

1. You can add Quiz data categories, paragraphs, and questions to your database. Use the pre-defined functions in the index.js file, such as 

    ```
    insertNatureQuizData()
    addMoreToNatureCategory();
    addScienceQuizData();
    addMoreToScienceCategory();
    createHistoryCategory();
    insertHistoryQuizData();
    createTechnologyCategory();
    addMoreDataToTechnologyCategory();
    ```
Now you have to call all those function once a time in your code after start the bot and make database connection.
and then you have to comment that function calls, because we use this function just to add quiz data in our DB. 



### How to Use the Bot
1. Open Telegram and start the bot.
2. Type /start to initiate the conversation.
3. Use the /startquiz command to begin the quiz.
4. Choose a category by clicking the buttons provided by the bot.
5. Read the paragraph and proceed to answer the multiple-choice questions.
6. Get instant feedback after each question and view your final score at the end.

### Project Structure
1. Here’s a breakdown of the project files:

    ```
    telegram-chat-bot/
    |-- src/
    │   |-- models/
    │   │   |-- category.models.js   # Schema for quiz categories
    │   │   |-- paragraph.models.js  # Schema for quiz paragraphs
    │   │   |-- question.models.js   # Schema for quiz questions
    │   │   |-- user.models.js       # Schema for user data
    |-- .env                          # Stores environment variables
    |-- .gitignore
    |-- index.js                      # Main bot logic
    |-- package.json                  # Project info and dependencies
    |-- README.md

    ```
### Tech Stack
- **Node.js:** Runtime for the bot.
- **Telegraf:** Framework for Telegram bot development.
- **MongoDB:** Database for storing quiz-related data.
- **dotenv:** For secure environment variable management.

## Common Issues and Solutions
1. Error: "MongoDB connection failed"

    - Ensure MongoDB is running and the MONGODB_URI in the .env file is correct.
2. Bot Not Responding in Telegram

    - Double-check the TELEGRAM_BOT_TOKEN in your .env file.
    - Ensure the bot is running by checking the terminal for messages like Bot is running....
3. Missing Dependencies

    - Run npm install again to ensure all packages are installed.

### About Me
1. I’m a junior developer who enjoys learning by building fun projects like this one. If you have suggestions or questions, feel free to share them on my Socials, which you will find on my [GitHub](https://github.com/vishalrathore8oct) Profile!






