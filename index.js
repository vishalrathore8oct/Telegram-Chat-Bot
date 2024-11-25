import dotenv from "dotenv";
import { Telegraf, Markup } from "telegraf";
import { callbackQuery, message } from "telegraf/filters";
import mongoose from "mongoose";
import { Category } from "./src/models/category.models.js";
import { Paragraph } from "./src/models/paragraph.models.js";
import { Question } from "./src/models/quesion.models.js";
import { User } from "./src/models/user.models.js";

dotenv.config();

/* The code is using  to connect to a MongoDB database using Mongoose. It is using
environment variables `process.env.MONGODB_URI` and `process.env.DATABASE_NAME` to construct the
connection URL. Once the connection is successful, it logs "Connected to MongoDB Successfully" and
then launches a bot. If there is an error during the connection process, it logs the error and exits
the process with an exit code of 1. */
(async () => {
    try {
        await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`
        );
        console.log("Connected to MongoDB Successfully");

        bot.launch();
        console.log("Bot is running...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
})();

/* The code is using the Telegraf library to create a bot. It seems to be creating a new instance of a Telegraf bot
using the TELEGRAM_BOT_TOKEN environment variable. */
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

// ---------------------Telegram UI part-------------------//

// -------------------add quiz data in DB------------------


const insertNatureQuizData = async () => {
    try {
        // Step 1: Create Questions
        const question1 = await Question.create({
            questionData: "What is one of the key benefits of nature?",
            allOptions: [
                "(A). Providing oxygen",
                "(B). Enhancing technology",
                "(C). Building infrastructure",
                "(D). Advancing medicine",
            ],
            correctAnswer: "A",
        });

        const question2 = await Question.create({
            questionData: "How does nature influence mental health?",
            allOptions: [
                "(A). Increases stress levels",
                "(B). Reduces stress and improves mood",
                "(C). Causes distraction",
                "(D). Promotes overworking",
            ],
            correctAnswer: "B",
        });

        const question3 = await Question.create({
            questionData: "Which natural resource is essential for life?",
            allOptions: [
                "(A). Plastic",
                "(B). Water",
                "(C). Cement",
                "(D). Glass",
            ],
            correctAnswer: "B",
        });

        const question4 = await Question.create({
            questionData: "What do forests help regulate?",
            allOptions: [
                "(A). Global warming",
                "(B). The Earth's climate",
                "(C). Technological advancements",
                "(D). Urban development",
            ],
            correctAnswer: "B",
        });

        const question5 = await Question.create({
            questionData: "What role do bees play in nature?",
            allOptions: [
                "(A). Transporting seeds",
                "(B). Pollination of plants",
                "(C). Consuming flowers",
                "(D). Producing plastic",
            ],
            correctAnswer: "B",
        });

        const question6 = await Question.create({
            questionData: "What is biodiversity?",
            allOptions: [
                "(A). The variety of ecosystems, species, and genes",
                "(B). A single species in an area",
                "(C). The lack of diversity in nature",
                "(D). Human-made landscapes",
            ],
            correctAnswer: "A",
        });

        const question7 = await Question.create({
            questionData: "How does deforestation impact the environment?",
            allOptions: [
                "(A). Enhances soil fertility",
                "(B). Disrupts ecosystems",
                "(C). Increases oxygen levels",
                "(D). Reduces biodiversity",
            ],
            correctAnswer: "B",
        });

        const question8 = await Question.create({
            questionData: "Which activity helps preserve nature?",
            allOptions: [
                "(A). Recycling waste",
                "(B). Burning fossil fuels",
                "(C). Excessive logging",
                "(D). Building skyscrapers",
            ],
            correctAnswer: "A",
        });

        const question9 = await Question.create({
            questionData: "Why is protecting nature important?",
            allOptions: [
                "(A). For aesthetic value only",
                "(B). To ensure survival and sustainability",
                "(C). To prioritize urban development",
                "(D). To maintain human dominance",
            ],
            correctAnswer: "B",
        });

        const question10 = await Question.create({
            questionData: "What is one way nature inspires humans?",
            allOptions: [
                "(A). By creating a sense of isolation",
                "(B). By inspiring art and innovation",
                "(C). By promoting destruction",
                "(D). By limiting creativity",
            ],
            correctAnswer: "B",
        });

        // Step 2: Create a Paragraph
        const paragraph = await Paragraph.create({
            paragraphData:
                "Nature is essential to life on Earth, providing oxygen, water, and countless resources vital for survival. It influences mental well-being, helping reduce stress and improve mood. Forests regulate the Earth's climate, while bees play a critical role in pollination, sustaining biodiversity. Protecting nature ensures the survival of ecosystems, preserving the balance necessary for life. Activities like recycling and conservation help safeguard these natural resources. Nature inspires creativity and innovation while reminding humanity of its interconnectedness with the planet.",
            questionIds: [
                question1._id,
                question2._id,
                question3._id,
                question4._id,
                question5._id,
                question6._id,
                question7._id,
                question8._id,
                question9._id,
                question10._id,
            ],
        });

        // Step 3: Create the Category
        const category = await Category.create({
            categoryName: "Nature",
            paragraphIds: [paragraph._id],
        });

        console.log("Nature quiz data inserted successfully!");
    } catch (error) {
        console.error("Error inserting Nature quiz data:", error);
    }
};

// insertNatureQuizData();

const addMoreToNatureCategory = async () => {
    try {
        // Step 1: Create New Questions
        const question1 = await Question.create({
            questionData: "What is the primary role of forests in the water cycle?",
            allOptions: [
                "(A). To block rainfall",
                "(B). To store and release water",
                "(C). To increase water pollution",
                "(D). To dry up rivers",
            ],
            correctAnswer: "B",
        });

        const question2 = await Question.create({
            questionData: "Why is soil health important for plants?",
            allOptions: [
                "(A). Provides nutrients and support",
                "(B). Prevents photosynthesis",
                "(C). Absorbs carbon dioxide",
                "(D). Increases global warming",
            ],
            correctAnswer: "A",
        });

        const question3 = await Question.create({
            questionData: "What is one of the key benefits of wetlands?",
            allOptions: [
                "(A). They act as natural water filters",
                "(B). They promote soil erosion",
                "(C). They block rainwater",
                "(D). They increase water pollution",
            ],
            correctAnswer: "A",
        });

        const question4 = await Question.create({
            questionData: "Which gas is primarily released during deforestation?",
            allOptions: [
                "(A). Oxygen",
                "(B). Carbon dioxide",
                "(C). Nitrogen",
                "(D). Methane",
            ],
            correctAnswer: "B",
        });

        const question5 = await Question.create({
            questionData: "What is the role of trees in air quality?",
            allOptions: [
                "(A). They release harmful gases",
                "(B). They filter pollutants and produce oxygen",
                "(C). They block sunlight",
                "(D). They create dust storms",
            ],
            correctAnswer: "B",
        });

        const question6 = await Question.create({
            questionData: "Why are pollinators important for agriculture?",
            allOptions: [
                "(A). They destroy crops",
                "(B). They help plants reproduce",
                "(C). They block sunlight",
                "(D). They promote soil erosion",
            ],
            correctAnswer: "B",
        });

        const question7 = await Question.create({
            questionData: "How does conserving nature benefit humans?",
            allOptions: [
                "(A). It ensures clean air and water",
                "(B). It decreases biodiversity",
                "(C). It promotes soil erosion",
                "(D). It reduces food security",
            ],
            correctAnswer: "A",
        });

        const question8 = await Question.create({
            questionData: "What is the primary source of energy for life on Earth?",
            allOptions: [
                "(A). Wind",
                "(B). Fossil fuels",
                "(C). The Sun",
                "(D). The Moon",
            ],
            correctAnswer: "C",
        });

        const question9 = await Question.create({
            questionData: "Which activity harms marine ecosystems?",
            allOptions: [
                "(A). Overfishing",
                "(B). Coral reef protection",
                "(C). Sustainable fishing",
                "(D). Marine conservation",
            ],
            correctAnswer: "A",
        });

        const question10 = await Question.create({
            questionData: "Why is planting trees vital for urban areas?",
            allOptions: [
                "(A). It increases air pollution",
                "(B). It reduces urban heat and improves air quality",
                "(C). It blocks rainfall",
                "(D). It causes water scarcity",
            ],
            correctAnswer: "B",
        });

        // Step 2: Create a Paragraph
        const paragraph = await Paragraph.create({
            paragraphData:
                "Nature provides countless resources and services vital to life, including clean air, water, and fertile soil. Forests play a crucial role in the water cycle by storing and releasing water, while wetlands act as natural water filters. Pollinators like bees sustain agriculture by helping plants reproduce. Conserving nature ensures clean air and water, supports biodiversity, and protects ecosystems essential for life. Planting trees in urban areas can combat heat and improve air quality, emphasizing the need for balance between human development and natural preservation.",
            questionIds: [
                question1._id,
                question2._id,
                question3._id,
                question4._id,
                question5._id,
                question6._id,
                question7._id,
                question8._id,
                question9._id,
                question10._id,
            ],
        });

        // Step 3: Update the Existing Nature Category
        const natureCategory = await Category.findOneAndUpdate(
            { categoryName: "Nature" }, // Find the "Nature" category
            { $push: { paragraphIds: paragraph._id } }, // Add the new paragraph ID
            { new: true } // Return the updated category
        );

        console.log("New paragraph and questions added successfully!");
    } catch (error) {
        console.error("Error adding data to Nature category:", error);
    }
};

// addMoreToNatureCategory();

const addScienceQuizData = async () => {
    try {
        // Step 1: Create Questions
        const question1 = await Question.create({
            questionData: "What is the smallest unit of matter?",
            allOptions: [
                "(A). Atom",
                "(B). Molecule",
                "(C). Cell",
                "(D). Proton",
            ],
            correctAnswer: "A",
        });

        const question2 = await Question.create({
            questionData: "What is the primary function of the heart in humans?",
            allOptions: [
                "(A). Produces hormones",
                "(B). Pumps blood",
                "(C). Aids digestion",
                "(D). Filters oxygen",
            ],
            correctAnswer: "B",
        });

        const question3 = await Question.create({
            questionData: "Which planet is known as the 'Red Planet'?",
            allOptions: [
                "(A). Venus",
                "(B). Mars",
                "(C). Jupiter",
                "(D). Saturn",
            ],
            correctAnswer: "B",
        });

        const question4 = await Question.create({
            questionData: "What is the process of converting sunlight into chemical energy called?",
            allOptions: [
                "(A). Respiration",
                "(B). Photosynthesis",
                "(C). Transpiration",
                "(D). Fermentation",
            ],
            correctAnswer: "B",
        });

        const question5 = await Question.create({
            questionData: "What is the formula for water?",
            allOptions: [
                "(A). H2O",
                "(B). CO2",
                "(C). O2",
                "(D). NaCl",
            ],
            correctAnswer: "A",
        });

        const question6 = await Question.create({
            questionData: "What is the speed of light in a vacuum?",
            allOptions: [
                "(A). 3 x 10^8 m/s",
                "(B). 1.5 x 10^6 m/s",
                "(C). 9 x 10^9 m/s",
                "(D). 2 x 10^7 m/s",
            ],
            correctAnswer: "A",
        });

        const question7 = await Question.create({
            questionData: "Which gas do plants primarily absorb for photosynthesis?",
            allOptions: [
                "(A). Oxygen",
                "(B). Carbon dioxide",
                "(C). Nitrogen",
                "(D). Helium",
            ],
            correctAnswer: "B",
        });

        const question8 = await Question.create({
            questionData: "What is Newton's First Law of Motion also called?",
            allOptions: [
                "(A). Law of Inertia",
                "(B). Law of Gravity",
                "(C). Conservation of Energy",
                "(D). Principle of Relativity",
            ],
            correctAnswer: "A",
        });

        const question9 = await Question.create({
            questionData: "What is the chemical symbol for gold?",
            allOptions: [
                "(A). Gd",
                "(B). Au",
                "(C). Ag",
                "(D). Go",
            ],
            correctAnswer: "B",
        });

        const question10 = await Question.create({
            questionData: "What is the boiling point of water at sea level?",
            allOptions: [
                "(A). 100°C",
                "(B). 50°C",
                "(C). 212°C",
                "(D). 150°C",
            ],
            correctAnswer: "A",
        });

        // Step 2: Create a Paragraph
        const paragraph = await Paragraph.create({
            paragraphData:
                "Science explores the laws and principles that govern the natural world. Atoms, the building blocks of matter, form molecules and larger structures. Photosynthesis, essential for life, allows plants to convert sunlight into energy. The heart circulates blood, ensuring oxygen and nutrients reach cells. Newton’s laws describe motion, while discoveries like the speed of light and properties of elements like gold have shaped our understanding of the universe. Science connects humanity to its environment, revealing the wonders of the cosmos and the intricacies of life on Earth.",
            questionIds: [
                question1._id,
                question2._id,
                question3._id,
                question4._id,
                question5._id,
                question6._id,
                question7._id,
                question8._id,
                question9._id,
                question10._id,
            ],
        });

        // Step 3: Create the Science Category
        const category = await Category.create({
            categoryName: "Science",
            paragraphIds: [paragraph._id],
        });

        console.log("Science quiz data inserted successfully!");
    } catch (error) {
        console.error("Error inserting Science quiz data:", error);
    }
};

// addScienceQuizData();

const addMoreToScienceCategory = async () => {
    try {
        // Step 1: Create New Questions
        const question1 = await Question.create({
            questionData: "What is the powerhouse of the cell?",
            allOptions: [
                "(A). Nucleus",
                "(B). Mitochondria",
                "(C). Ribosomes",
                "(D). Endoplasmic Reticulum",
            ],
            correctAnswer: "B",
        });

        const question2 = await Question.create({
            questionData: "Which element is essential for the production of thyroid hormones?",
            allOptions: [
                "(A). Iron",
                "(B). Iodine",
                "(C). Calcium",
                "(D). Sodium",
            ],
            correctAnswer: "B",
        });

        const question3 = await Question.create({
            questionData: "What type of bond holds the two strands of a DNA molecule together?",
            allOptions: [
                "(A). Ionic bond",
                "(B). Hydrogen bond",
                "(C). Covalent bond",
                "(D). Metallic bond",
            ],
            correctAnswer: "B",
        });

        const question4 = await Question.create({
            questionData: "What is the primary function of the digestive system?",
            allOptions: [
                "(A). Absorb nutrients and expel waste",
                "(B). Produce hormones",
                "(C). Circulate blood",
                "(D). Filter toxins",
            ],
            correctAnswer: "A",
        });

        const question5 = await Question.create({
            questionData: "Which gas is produced as a byproduct of respiration?",
            allOptions: [
                "(A). Oxygen",
                "(B). Carbon dioxide",
                "(C). Nitrogen",
                "(D). Hydrogen",
            ],
            correctAnswer: "B",
        });

        const question6 = await Question.create({
            questionData: "Which part of the plant is responsible for photosynthesis?",
            allOptions: [
                "(A). Roots",
                "(B). Stems",
                "(C). Leaves",
                "(D). Flowers",
            ],
            correctAnswer: "C",
        });

        const question7 = await Question.create({
            questionData: "What is the chemical process by which plants convert sunlight into food?",
            allOptions: [
                "(A). Respiration",
                "(B). Photosynthesis",
                "(C). Digestion",
                "(D). Transpiration",
            ],
            correctAnswer: "B",
        });

        const question8 = await Question.create({
            questionData: "What does DNA stand for?",
            allOptions: [
                "(A). Deoxyribonucleic Acid",
                "(B). Deoxyribonitric Acid",
                "(C). Dioxyribonucleic Acid",
                "(D). Deoxyribonic Acid",
            ],
            correctAnswer: "A",
        });

        const question9 = await Question.create({
            questionData: "What is the largest organ in the human body?",
            allOptions: [
                "(A). Brain",
                "(B). Heart",
                "(C). Skin",
                "(D). Liver",
            ],
            correctAnswer: "C",
        });

        const question10 = await Question.create({
            questionData: "Which gas is responsible for global warming?",
            allOptions: [
                "(A). Oxygen",
                "(B). Carbon dioxide",
                "(C). Nitrogen",
                "(D). Helium",
            ],
            correctAnswer: "B",
        });

        // Step 2: Create a New Paragraph
        const paragraph = await Paragraph.create({
            paragraphData:
                "Science plays a crucial role in understanding the world around us. From the microscopic level of cells and DNA to the vast expanse of the universe, scientific principles explain the functions and behaviors of all living and non-living systems. The study of biological processes like photosynthesis and respiration highlights the importance of energy flow in ecosystems. Understanding the complex molecular mechanisms in cells and the production of hormones further reveals the intricacies of life. Science continues to shape our understanding of health, technology, and the environment.",
            questionIds: [
                question1._id,
                question2._id,
                question3._id,
                question4._id,
                question5._id,
                question6._id,
                question7._id,
                question8._id,
                question9._id,
                question10._id,
            ],
        });

        // Step 3: Update the Existing Science Category
        const scienceCategory = await Category.findOneAndUpdate(
            { categoryName: "Science" }, // Find the "Science" category
            { $push: { paragraphIds: paragraph._id } }, // Add the new paragraph ID
            { new: true } // Return the updated category
        );

        console.log("New questions and paragraph added successfully to Science category!");
    } catch (error) {
        console.error("Error adding data to Science category:", error);
    }
};

// addMoreToScienceCategory();

const createHistoryCategory = async () => {
    try {
        // Step 1: Create Questions
        const question1 = await Question.create({
            questionData: "Who was the first president of the United States?",
            allOptions: [
                "(A). George Washington",
                "(B). Abraham Lincoln",
                "(C). Thomas Jefferson",
                "(D). Theodore Roosevelt",
            ],
            correctAnswer: "A",
        });

        const question2 = await Question.create({
            questionData: "In which year did World War II end?",
            allOptions: [
                "(A). 1945",
                "(B). 1950",
                "(C). 1939",
                "(D). 1960",
            ],
            correctAnswer: "A",
        });

        const question3 = await Question.create({
            questionData: "Who was the first emperor of China?",
            allOptions: [
                "(A). Qin Shi Huang",
                "(B). Han Wudi",
                "(C). Cao Cao",
                "(D). Sun Tzu",
            ],
            correctAnswer: "A",
        });

        const question4 = await Question.create({
            questionData: "Which ancient civilization built the pyramids?",
            allOptions: [
                "(A). Ancient Rome",
                "(B). Ancient Egypt",
                "(C). Ancient Greece",
                "(D). Ancient Mesopotamia",
            ],
            correctAnswer: "B",
        });

        const question5 = await Question.create({
            questionData: "What was the main cause of the American Civil War?",
            allOptions: [
                "(A). Slavery",
                "(B). Industrialization",
                "(C). Religion",
                "(D). Land Disputes",
            ],
            correctAnswer: "A",
        });

        const question6 = await Question.create({
            questionData: "Who was the leader of the Soviet Union during World War II?",
            allOptions: [
                "(A). Vladimir Lenin",
                "(B). Joseph Stalin",
                "(C). Nikita Khrushchev",
                "(D). Mikhail Gorbachev",
            ],
            correctAnswer: "B",
        });

        const question7 = await Question.create({
            questionData: "Which empire was led by Genghis Khan?",
            allOptions: [
                "(A). Roman Empire",
                "(B). Ottoman Empire",
                "(C). Mongol Empire",
                "(D). Byzantine Empire",
            ],
            correctAnswer: "C",
        });

        const question8 = await Question.create({
            questionData: "In which year did the Titanic sink?",
            allOptions: [
                "(A). 1912",
                "(B). 1905",
                "(C). 1920",
                "(D). 1898",
            ],
            correctAnswer: "A",
        });

        const question9 = await Question.create({
            questionData: "What event triggered the start of World War I?",
            allOptions: [
                "(A). The assassination of Archduke Franz Ferdinand",
                "(B). The signing of the Treaty of Versailles",
                "(C). The invasion of Poland",
                "(D). The bombing of Pearl Harbor",
            ],
            correctAnswer: "A",
        });

        const question10 = await Question.create({
            questionData: "Which civilization is known for creating the first written laws?",
            allOptions: [
                "(A). Ancient Greece",
                "(B). Ancient Mesopotamia",
                "(C). Ancient Egypt",
                "(D). Ancient India",
            ],
            correctAnswer: "B",
        });

        // Step 2: Create a Paragraph
        const paragraph = await Paragraph.create({
            paragraphData:
                "History is the study of past events, and understanding it helps us comprehend the present. The first president of the United States, George Washington, led the country after it gained independence. Throughout history, pivotal events such as the end of World War II in 1945, the reign of Genghis Khan, and the construction of the Egyptian pyramids have shaped the world as we know it. The causes and consequences of wars, like the American Civil War and World War I, continue to influence modern society. The evolution of civilizations, from the ancient Egyptians to the Mongol Empire, offers valuable lessons for the future.",
            questionIds: [
                question1._id,
                question2._id,
                question3._id,
                question4._id,
                question5._id,
                question6._id,
                question7._id,
                question8._id,
                question9._id,
                question10._id,
            ],
        });

        // Step 3: Create the History Category
        const historyCategory = await Category.create({
            categoryName: "History",
            paragraphIds: [paragraph._id],
        });

        console.log("History category created successfully!");
    } catch (error) {
        console.error("Error creating History category:", error);
    }
};

// createHistoryCategory();

const insertHistoryQuizData = async () => {
    try {
        // Step 1: Create Questions
        const question1 = await Question.create({
            questionData: "Who was the first president of the United States?",
            allOptions: [
                "(A). George Washington",
                "(B). Abraham Lincoln",
                "(C). Thomas Jefferson",
                "(D). Theodore Roosevelt",
            ],
            correctAnswer: "A",
        });

        const question2 = await Question.create({
            questionData: "In which year did World War II end?",
            allOptions: [
                "(A). 1945",
                "(B). 1950",
                "(C). 1939",
                "(D). 1960",
            ],
            correctAnswer: "A",
        });

        const question3 = await Question.create({
            questionData: "Who was the first emperor of China?",
            allOptions: [
                "(A). Qin Shi Huang",
                "(B). Han Wudi",
                "(C). Cao Cao",
                "(D). Sun Tzu",
            ],
            correctAnswer: "A",
        });

        const question4 = await Question.create({
            questionData: "Which ancient civilization built the pyramids?",
            allOptions: [
                "(A). Ancient Rome",
                "(B). Ancient Egypt",
                "(C). Ancient Greece",
                "(D). Ancient Mesopotamia",
            ],
            correctAnswer: "B",
        });

        const question5 = await Question.create({
            questionData: "What was the main cause of the American Civil War?",
            allOptions: [
                "(A). Slavery",
                "(B). Industrialization",
                "(C). Religion",
                "(D). Land Disputes",
            ],
            correctAnswer: "A",
        });

        const question6 = await Question.create({
            questionData: "Who was the leader of the Soviet Union during World War II?",
            allOptions: [
                "(A). Vladimir Lenin",
                "(B). Joseph Stalin",
                "(C). Nikita Khrushchev",
                "(D). Mikhail Gorbachev",
            ],
            correctAnswer: "B",
        });

        const question7 = await Question.create({
            questionData: "Which empire was led by Genghis Khan?",
            allOptions: [
                "(A). Roman Empire",
                "(B). Ottoman Empire",
                "(C). Mongol Empire",
                "(D). Byzantine Empire",
            ],
            correctAnswer: "C",
        });

        const question8 = await Question.create({
            questionData: "In which year did the Titanic sink?",
            allOptions: [
                "(A). 1912",
                "(B). 1905",
                "(C). 1920",
                "(D). 1898",
            ],
            correctAnswer: "A",
        });

        const question9 = await Question.create({
            questionData: "What event triggered the start of World War I?",
            allOptions: [
                "(A). The assassination of Archduke Franz Ferdinand",
                "(B). The signing of the Treaty of Versailles",
                "(C). The invasion of Poland",
                "(D). The bombing of Pearl Harbor",
            ],
            correctAnswer: "A",
        });

        const question10 = await Question.create({
            questionData: "Which civilization is known for creating the first written laws?",
            allOptions: [
                "(A). Ancient Greece",
                "(B). Ancient Mesopotamia",
                "(C). Ancient Egypt",
                "(D). Ancient India",
            ],
            correctAnswer: "B",
        });

        // Step 2: Create a Paragraph
        const paragraph = await Paragraph.create({
            paragraphData:
                "History is the study of past events, and understanding it helps us comprehend the present. The first president of the United States, George Washington, led the country after it gained independence. Throughout history, pivotal events such as the end of World War II in 1945, the reign of Genghis Khan, and the construction of the Egyptian pyramids have shaped the world as we know it. The causes and consequences of wars, like the American Civil War and World War I, continue to influence modern society. The evolution of civilizations, from the ancient Egyptians to the Mongol Empire, offers valuable lessons for the future.",
            questionIds: [
                question1._id,
                question2._id,
                question3._id,
                question4._id,
                question5._id,
                question6._id,
                question7._id,
                question8._id,
                question9._id,
                question10._id,
            ],
        });

        // Step 3: Update the History Category
        const historyCategory = await Category.findOneAndUpdate(
            { categoryName: "History" }, // Find the "History" category
            { $push: { paragraphIds: paragraph._id } }, // Add the new paragraph ID
            { new: true } // Return the updated category
        );

        console.log("History quiz data inserted successfully!");
    } catch (error) {
        console.error("Error inserting History quiz data:", error);
    }
};

// insertHistoryQuizData();

const createTechnologyCategory = async () => {
    try {
        // Step 1: Create Questions
        const question1 = await Question.create({
            questionData: "Who is considered the father of computers?",
            allOptions: [
                "(A). Charles Babbage",
                "(B). Alan Turing",
                "(C). Bill Gates",
                "(D). Steve Jobs",
            ],
            correctAnswer: "A",
        });

        const question2 = await Question.create({
            questionData: "What does HTML stand for?",
            allOptions: [
                "(A). Hypertext Markup Language",
                "(B). Hyper Transfer Markup Language",
                "(C). High Transfer Markup Language",
                "(D). HyperText Machine Language",
            ],
            correctAnswer: "A",
        });

        const question3 = await Question.create({
            questionData: "Which company developed the first personal computer?",
            allOptions: [
                "(A). Apple",
                "(B). IBM",
                "(C). Microsoft",
                "(D). HP",
            ],
            correctAnswer: "B",
        });

        const question4 = await Question.create({
            questionData: "What is the primary function of an operating system?",
            allOptions: [
                "(A). To manage hardware resources",
                "(B). To browse the internet",
                "(C). To store data",
                "(D). To play games",
            ],
            correctAnswer: "A",
        });

        const question5 = await Question.create({
            questionData: "Which programming language is known as the foundation of modern web development?",
            allOptions: [
                "(A). C",
                "(B). Java",
                "(C). JavaScript",
                "(D). Python",
            ],
            correctAnswer: "C",
        });

        const question6 = await Question.create({
            questionData: "What does the acronym 'AI' stand for?",
            allOptions: [
                "(A). Automated Interface",
                "(B). Artificial Intelligence",
                "(C). Advanced Integration",
                "(D). Algorithmic Interpretation",
            ],
            correctAnswer: "B",
        });

        const question7 = await Question.create({
            questionData: "Which technology is used to make websites interactive?",
            allOptions: [
                "(A). HTML",
                "(B). CSS",
                "(C). JavaScript",
                "(D). SQL",
            ],
            correctAnswer: "C",
        });

        const question8 = await Question.create({
            questionData: "What is cloud computing?",
            allOptions: [
                "(A). Storing data on remote servers and accessing it over the internet",
                "(B). A type of weather forecasting",
                "(C). A hardware device for computing",
                "(D). A form of energy-efficient computing",
            ],
            correctAnswer: "A",
        });

        const question9 = await Question.create({
            questionData: "Which of the following is NOT a type of programming language?",
            allOptions: [
                "(A). Python",
                "(B). HTML",
                "(C). Ruby",
                "(D). JavaScript",
            ],
            correctAnswer: "B",
        });

        const question10 = await Question.create({
            questionData: "Who is the CEO of Tesla and SpaceX?",
            allOptions: [
                "(A). Jeff Bezos",
                "(B). Bill Gates",
                "(C). Elon Musk",
                "(D). Steve Jobs",
            ],
            correctAnswer: "C",
        });

        // Step 2: Create a Paragraph
        const paragraph = await Paragraph.create({
            paragraphData:
                "Technology has transformed every aspect of our lives, from the invention of the computer to the development of artificial intelligence. Pioneers like Charles Babbage and Alan Turing laid the groundwork for modern computing. The advent of the personal computer and the internet revolutionized communication and information sharing. Today, technologies like AI and cloud computing continue to drive innovation, enabling new applications and industries. Web development languages like HTML, JavaScript, and CSS are the building blocks of the digital world, shaping everything from websites to mobile apps.",
            questionIds: [
                question1._id,
                question2._id,
                question3._id,
                question4._id,
                question5._id,
                question6._id,
                question7._id,
                question8._id,
                question9._id,
                question10._id,
            ],
        });

        // Step 3: Create the Technology Category
        const technologyCategory = await Category.create({
            categoryName: "Technology",
            paragraphIds: [paragraph._id],
        });

        console.log("Technology category created successfully!");
    } catch (error) {
        console.error("Error creating Technology category:", error);
    }
};

// createTechnologyCategory();


const addMoreDataToTechnologyCategory = async () => {
    try {
        // Step 1: Create 10 Additional Questions
        const question1 = await Question.create({
            questionData: "Who is considered the father of the World Wide Web?",
            allOptions: [
                "(A). Tim Berners-Lee",
                "(B). Bill Gates",
                "(C). Steve Jobs",
                "(D). Mark Zuckerberg",
            ],
            correctAnswer: "A",
        });

        const question2 = await Question.create({
            questionData: "Which company developed the first smartphone?",
            allOptions: [
                "(A). Apple",
                "(B). IBM",
                "(C). Nokia",
                "(D). Samsung",
            ],
            correctAnswer: "B",
        });

        const question3 = await Question.create({
            questionData: "What is the main function of the 'GPU' in computers?",
            allOptions: [
                "(A). Data storage",
                "(B). Graphics rendering",
                "(C). Network management",
                "(D). Power supply",
            ],
            correctAnswer: "B",
        });

        const question4 = await Question.create({
            questionData: "What does 'URL' stand for?",
            allOptions: [
                "(A). Uniform Resource Locator",
                "(B). Universal Resource Locator",
                "(C). Universal Retrieval Link",
                "(D). Uniform Retrieval Link",
            ],
            correctAnswer: "A",
        });

        const question5 = await Question.create({
            questionData: "Which language is commonly used for building mobile applications for iOS?",
            allOptions: [
                "(A). Kotlin",
                "(B). Swift",
                "(C). JavaScript",
                "(D). Ruby",
            ],
            correctAnswer: "B",
        });

        const question6 = await Question.create({
            questionData: "What is the most popular programming language for web development?",
            allOptions: [
                "(A). JavaScript",
                "(B). Python",
                "(C). Ruby",
                "(D). C++",
            ],
            correctAnswer: "A",
        });

        const question7 = await Question.create({
            questionData: "Which company is known for creating the Android operating system?",
            allOptions: [
                "(A). Microsoft",
                "(B). Apple",
                "(C). Google",
                "(D). IBM",
            ],
            correctAnswer: "C",
        });

        const question8 = await Question.create({
            questionData: "What does the term 'cloud computing' mean?",
            allOptions: [
                "(A). Using remote servers to store, manage, and process data",
                "(B). Computing within the atmosphere",
                "(C). Using personal devices for computing",
                "(D). Storing data on a personal hard drive",
            ],
            correctAnswer: "A",
        });

        const question9 = await Question.create({
            questionData: "Which technology is used to create interactive websites?",
            allOptions: [
                "(A). HTML",
                "(B). JavaScript",
                "(C). CSS",
                "(D). Python",
            ],
            correctAnswer: "B",
        });

        const question10 = await Question.create({
            questionData: "Which of the following is NOT a cloud service provider?",
            allOptions: [
                "(A). Amazon Web Services (AWS)",
                "(B). Google Cloud",
                "(C). Microsoft Azure",
                "(D). Adobe Photoshop",
            ],
            correctAnswer: "D",
        });

        // Step 2: Create a New Paragraph for the additional content
        const additionalParagraph = await Paragraph.create({
            paragraphData:
                "The technology sector is full of innovation and progress, from the creation of the World Wide Web by Tim Berners-Lee to the development of smartphones by IBM. Technologies like GPU (Graphics Processing Units) have revolutionized gaming and design. The rise of cloud computing allows businesses and individuals to store and manage their data on remote servers, while the development of mobile apps continues to advance with tools like Swift for iOS. In addition, cloud service providers such as Amazon Web Services (AWS), Google Cloud, and Microsoft Azure provide powerful computing solutions for organizations worldwide.",
            questionIds: [
                question1._id,
                question2._id,
                question3._id,
                question4._id,
                question5._id,
                question6._id,
                question7._id,
                question8._id,
                question9._id,
                question10._id,
            ],
        });

        // Step 3: Update the Technology Category with the new paragraph
        const technologyCategory = await Category.findOneAndUpdate(
            { categoryName: "Technology" }, // Find the "Technology" category
            { $push: { paragraphIds: additionalParagraph._id } }, // Add the new paragraph ID
            { new: true } // Return the updated category
        );

        console.log("10 additional questions and content added to Technology category successfully!");
    } catch (error) {
        console.error("Error adding more data to Technology category:", error);
    }
};

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
