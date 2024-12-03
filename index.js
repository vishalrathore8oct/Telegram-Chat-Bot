import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { dbConnection } from "./src/db/db.connection.js";

import { Category } from "./src/models/category.models.js";
import { Paragraph } from "./src/models/paragraph.models.js";
import { Question } from "./src/models/quesion.models.js";
import { User } from "./src/models/user.models.js";

import { insertNatureQuizData, addMoreToNatureCategory } from "./src/quiz data/nature.js";
import { addScienceQuizData, addMoreToScienceCategory } from "./src/quiz data/science.js";
import { createHistoryCategory, insertHistoryQuizData } from "./src/quiz data/history.js";
import { createTechnologyCategory, addMoreDataToTechnologyCategory } from "./src/quiz data/technology.js";


dotenv.config();


/* The above code snippet is written in JavaScript and it seems to be setting up a connection to a
MongoDB database using `dbConnection()`. Once the connection is established successfully, it
launches a bot and logs a message "Bot is running...". If there is an error during the connection
process, it logs an error message "Error Bot connecting to MongoDB:" along with the error details
and exits the process with code 1. */
dbConnection().then(() => {
    bot.launch();
    console.log("Bot is running...");
}).catch((error) => {
    console.error("Error Bot connecting to MongoDB:", error);
    process.exit(1);
});


/* The above code is creating a new instance of the Telegraf bot using the TELEGRAM_BOT_TOKEN
environment variable. This code is likely part of a Telegram bot implementation in JavaScript using
the Telegraf library. */
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ---------------------Telegram UI part-------------------//

/* The code is setting up a start command for a bot. When the bot receives the start
command, it will reply with a greeting message addressing the user by their first name and then
prompt the user to enter or press /startquiz to begin a quiz. If any errors occur during this
process, the bot will log the error, reply to the user that an error occurred, and stop the bot. */
bot.start(async (ctx) => {
    try {
        await ctx.reply(`Hello ${ctx.from.first_name}!`);
        await ctx.reply(`Plese Enter or Press /startquiz to start the quiz!`);
    } catch (error) {
        console.log("Error starting the bot:", error);
        await ctx.reply("An error occurred while starting the bot. Please try again later.");
        bot.stop("SIGTERM");
    }
});


/* This Function code is triggered when the "startquiz" command is called. It
first updates or creates a user document in a MongoDB database using Mongoose. It sets the initial
values for correctAnswerCount, wrongAnswerCount, and currentQuestionIndex for the user. Then it
sends a welcome message to the user and calls the function sendCategory to start the quiz by sending
the categories to choose from. If any error occurs during the process, it catches the error, logs
it, sends an error message to the user, and stops the bot. */
bot.command("startquiz", async (ctx) => {
    try {
        await User.findOneAndUpdate(
            { telegramId: ctx.from.id },
            {
                $set: {
                    correctAnswerCount: 0,
                    wrongAnswerCount: 0,
                    currentQuesionIndex: 0,
                },
            },
            { upsert: true }
        );

        const telegramId = ctx.from.id;
        const username = ctx.from.username;
        let user = await User.findOne({ telegramId: telegramId });
        if (!user) {
            user = await User.create({ telegramId: telegramId, username: username });
        }
        await ctx.reply(`Welcome to the Quiz world!`);
        await sendCategory(ctx);
    } catch (error) {
        console.log("Error starting the Quiz:", error);
        await ctx.reply("An error occurred while starting the quiz. Please try again later.");
        bot.stop("SIGTERM");
    }
});

/**
 * The function `sendCategory` fetches categories, creates a keyboard with category options, and sends
 * a message to select a category to the user.
 * @param ctx - ctx is an object that represents the context of the current operation in a Telegram
 * bot. It typically includes information about the message, user, chat, and other relevant data needed
 * to handle the user's interaction. In this case, the `sendCategory` function is using `ctx` to
 * interact with the user and send them a message with a keyboard of categories to choose from.
 */
async function sendCategory(ctx) {
    try {
        const categories = await Category.find();

        const categoryArray = categories.map((category) => ({
            text: category.categoryName,
            callback_data: JSON.stringify({ seletedCategoryId: category._id }),
        }));

        const keyboard = {
            reply_markup: {
                inline_keyboard: [categoryArray],
            },
        };

        await ctx.reply("Please select a category and click on it:", keyboard);
    } catch (error) {
        console.log("Error sending categories:", error);
        await ctx.reply("An error occurred while fetching categories. Please try again later.");
        bot.stop("SIGTERM");
    }
}

/**
 * The function `sendParagraph` selects a random paragraph from an array of paragraph IDs, retrieves
 * the paragraph data, sends it to a chat context, and provides a button to start a quiz related to the
 * paragraph. If an error occurs during the process, it sends an error message to the chat context.
 * @param ctx - The `ctx` parameter in the `sendParagraph` function likely refers to the context object
 * or context data that is being passed to the function. This context object typically contains
 * information about the current state of the application or the environment in which the function is
 * being executed. It may include details such as user
 * @param paragraphIdsArr - The `paragraphIdsArr` parameter is an array containing the IDs of multiple
 * paragraphs. The function `sendParagraph` randomly selects an ID from this array, fetches the
 * corresponding paragraph data using the `Paragraph.findById` method, and then sends the paragraph
 * content to the user in a chat context (`ctx
 */
async function sendParagraph(ctx, paragraphIdsArr) {
    try {
        const randomIndex = Math.floor(Math.random() * paragraphIdsArr.length);
        // console.log(randomIndex);

        const paragraph = await Paragraph.findById(paragraphIdsArr[randomIndex]);
        // console.log(paragraph);

        await ctx.reply("Please Read the Paragraph carefully Before Starting!");

        await ctx.reply(paragraph.paragraphData);

        // console.log(paragraph._id);

        const startKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Start Quiz",
                            callback_data: JSON.stringify({
                                seletedParagraphId: paragraph._id,
                            }),
                        },
                    ],
                ],
            },
        };

        await ctx.reply(
            "After Reading the Paragraph Press Start to Start the Quiz",
            startKeyboard
        );
    } catch (error) {
        console.log("Error sending paragraph:", error);
        await ctx.reply("An error occurred while fetching the paragraph. Please try again later.");
        bot.stop("SIGTERM");
    }
}

/**
 * The function `sendQuestion` fetches a question based on the user's current question index and sends
 * it to the user with multiple choice options as a reply keyboard.
 * @param ctx - `ctx` is an object that represents the context of the current message or interaction in
 * a chat application. It typically contains information about the user, the message, and other
 * relevant details needed to process the user's request or respond to their actions. In your code
 * snippet, `ctx` seems to be
 * @param questionIdsArr - The `questionIdsArr` parameter in the `sendQuestion` function is an array
 * containing the IDs of questions that need to be sent to the user. The function retrieves the user's
 * information, updates the current question ID in the database, fetches the question data based on the
 * current index, and
 */
async function sendQuestion(ctx, questionIdsArr) {
    try {
        console.log(questionIdsArr);

        let user = await User.findOne({ telegramId: ctx.from.id });

        let questionCurrentIndex = user.currentQuesionIndex;

        await User.findOneAndUpdate(
            { telegramId: ctx.from.id },
            { $set: { currentQuestionId: questionIdsArr[questionCurrentIndex] } },
            { upsert: true }
        );


        const question = await Question.findById(
            questionIdsArr[questionCurrentIndex]
        );

        // console.log(question);

        const optionKeyboard = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: question.allOptions[0],
                            callback_data: JSON.stringify({
                                selectedOption: "A",
                            }),
                        },
                    ],
                    [
                        {
                            text: question.allOptions[1],
                            callback_data: JSON.stringify({
                                selectedOption: "B",
                            }),
                        },
                    ],
                    [
                        {
                            text: question.allOptions[2],
                            callback_data: JSON.stringify({
                                selectedOption: "C",
                            }),
                        },
                    ],
                    [
                        {
                            text: question.allOptions[3],
                            callback_data: JSON.stringify({
                                selectedOption: "D",
                            }),
                        },
                    ],
                ],
            },
        };

        await ctx.reply(`${questionCurrentIndex + 1}.  ${question.questionData}`, optionKeyboard);
    } catch (error) {
        console.log("Error sending question:", error);
        await ctx.reply("An error occurred while fetching the question. Please try again later.");
        bot.stop("SIGTERM");
    }
}

/* The below code is an event handler for a Telegram bot that listens for callback queries. When a
callback query is received, the code parses the data from the query, performs different actions
based on the decoded data, and responds accordingly. Here is a breakdown of the main
functionalities: */
bot.on("callback_query", async (ctx) => {
    try {
        const callbackData = ctx.callbackQuery.data;

        console.log("Received callback data:", callbackData);

        let decodeData;

        try {
            decodeData = JSON.parse(callbackData);
        } catch (error) {
            console.error("Error parsing callback data:", error);
            return;
        }

        if (decodeData.seletedCategoryId) {
            let selectedCategoryId = decodeData.seletedCategoryId;

            const selectedCategory = await Category.findById(selectedCategoryId);

            // console.log("Selected Category:", selectedCategory);

            const paragraphIdsArr = selectedCategory.paragraphIds;

            await User.findOneAndUpdate(
                { telegramId: ctx.from.id },
                { $set: { selectedCategoryId: selectedCategory._id } },
                { upsert: true }
            );

            await sendParagraph(ctx, paragraphIdsArr);

        } else if (decodeData.seletedParagraphId) {
            let selectedParagraphId = decodeData.seletedParagraphId;

            await User.findOneAndUpdate(
                { telegramId: ctx.from.id },
                { $set: { selectedParagraphId: selectedParagraphId } },
                { upsert: true }
            );

            const selectedParagraph = await Paragraph.findById(selectedParagraphId);
            // console.log("Selected Paragraph:", selectedParagraph);

            const questionIdsArr = selectedParagraph.questionIds;
            // console.log(questionIdsArr);

            await sendQuestion(ctx, questionIdsArr);
        } else if (decodeData.selectedOption) {
            let selectedOption = decodeData.selectedOption;

            let user = await User.findOne({ telegramId: ctx.from.id });

            let currentQuestionId = user.currentQuestionId;

            const question = await Question.findById(currentQuestionId);

            if (selectedOption === question.correctAnswer) {
                await User.findOneAndUpdate(
                    { telegramId: ctx.from.id },
                    { $inc: { correctAnswerCount: 1 } },
                    { upsert: true }
                );

                await ctx.reply("Great job! That’s correct!");
            } else {
                await User.findOneAndUpdate(
                    { telegramId: ctx.from.id },
                    { $inc: { wrongAnswerCount: 1 } },
                    { upsert: true }
                );

                await ctx.reply(`Good try! The correct answer is \n"${question.correctAnswer}"`);
            }

            await User.findOneAndUpdate(
                { telegramId: ctx.from.id },
                { $inc: { currentQuesionIndex: 1 } },
                { upsert: true }
            );

            let paragraphId = user.selectedParagraphId;

            const selectedParagraph = await Paragraph.findById(paragraphId);

            const questionIdsArr = selectedParagraph.questionIds;

            user = await User.findOne({ telegramId: ctx.from.id });

            if (user.currentQuesionIndex < questionIdsArr.length) {

                const nextKeyboard = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Next Question",
                                    callback_data: JSON.stringify({ action: "nextQuestion" }),
                                },
                            ],
                            [
                                {
                                    text: "Select Another Category",
                                    callback_data: JSON.stringify({ action: "selectCategory" }),
                                },
                            ],
                        ],
                    },
                };

                await ctx.reply(
                    "Click on Next Question to move to the next question. \nClick on Select Another Category to start a new Quiz.",
                    nextKeyboard
                );

                // await ctx.reply("Next Question");

                // await sendQuestion(ctx, questionIdsArr);
            } else {

                await ctx.reply(`Congratulations! 🎊🎊🎉  You have completed the Quiz. \nCorrect Answers: ${user.correctAnswerCount} \nWrong Answers: ${user.wrongAnswerCount} \nYou got ${user.correctAnswerCount} out of ${questionIdsArr.length} questions correctly!`);


                await ctx.reply("Click on /startquiz for start a new Quiz.");
            }

        } else if (decodeData.action === "nextQuestion") {
            let user = await User.findOne({ telegramId: ctx.from.id });

            let paragraphId = user.selectedParagraphId;

            const selectedParagraph = await Paragraph.findById(paragraphId);

            const questionIdsArr = selectedParagraph.questionIds;

            await sendQuestion(ctx, questionIdsArr);

        } else if (decodeData.action === "selectCategory") {
            await User.findOneAndUpdate(
                { telegramId: ctx.from.id },
                {
                    $set: {
                        correctAnswerCount: 0,
                        wrongAnswerCount: 0,
                        currentQuesionIndex: 0,
                    },
                },
                { upsert: true }
            );

            await sendCategory(ctx);
        }
    } catch (error) {
        console.log("Error processing callback query:", error);
        await ctx.reply("An error occurred while processing your request. Please try again later.");
        bot.stop("SIGTERM");
    }
});

bot.on(message("text"), async (ctx) => {
    await ctx.reply("We are currently working on other's feature. Still you can use our quiz bot by typing /startquiz");
})

// ---------------------Telegram UI part-------------------//

// -------------------add quiz data in DB------------------


// insertNatureQuizData();

// addMoreToNatureCategory();



// addScienceQuizData();

// addMoreToScienceCategory();



// createHistoryCategory();

// insertHistoryQuizData();



// createTechnologyCategory();

// addMoreDataToTechnologyCategory();


// ----------------add quiz data in DB--------------------


/* The below code is setting up event listeners for the `SIGINT` and `SIGTERM` signals in a Node.js
application. When the application receives a `SIGINT` signal (generally sent by pressing `Ctrl + C`
in the terminal), it will log "SIGINT Bot Stopped!" to the console and then stop the bot. Similarly,
when the application receives a `SIGTERM` signal (often used for graceful shutdown in production
environments), it will log "SIGTERM Bot Stopped!" to the console and stop the bot as well. */
process.once("SIGINT", () => {
    console.log("SIGINT Bot Stopped!");
    bot.stop("SIGINT")
});
process.once("SIGTERM", () => {
    console.log("SIGTERM Bot Stopped!");
    bot.stop("SIGTERM")
});
