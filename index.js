import dotenv from "dotenv";
import { Telegraf, Markup } from "telegraf";
import { callbackQuery, message } from "telegraf/filters";
import mongoose from "mongoose";
import { Category } from "./src/models/category.models.js";
import { Paragraph } from "./src/models/paragraph.models.js";
import { Question } from "./src/models/quesion.models.js";
import { User } from "./src/models/user.models.js";

dotenv.config();

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

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ---------------------Telegram UI part-------------------//

bot.start(async (ctx) => {
    try {
        await ctx.reply(`Hello ${ctx.from.first_name} ${ctx.from.last_name}!`);
        await ctx.reply(`Plese Enter or Press /startquiz to start the quiz!`);
    } catch (error) {
        console.log("Error starting the bot:", error);
    }
});

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
    }
});

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
    }
}

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
    }
}

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
                                selectedOption: question.allOptions[0],
                            }),
                        },
                    ],
                    [
                        {
                            text: question.allOptions[1],
                            callback_data: JSON.stringify({
                                selectedOption: question.allOptions[1],
                            }),
                        },
                    ],
                    [
                        {
                            text: question.allOptions[2],
                            callback_data: JSON.stringify({
                                selectedOption: question.allOptions[2],
                            }),
                        },
                    ],
                    [
                        {
                            text: question.allOptions[3],
                            callback_data: JSON.stringify({
                                selectedOption: question.allOptions[3],
                            }),
                        },
                    ],
                ],
            },
        };

        await ctx.reply(question.questionData, optionKeyboard);
    } catch (error) {
        console.log("Error sending question:", error);
    }
}

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

                await ctx.reply(`Good try! The correct answer
is ${question.correctAnswer}`);
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
                await ctx.reply("Next Question");
                await sendQuestion(ctx, questionIdsArr);
            } else {

                await ctx.reply(`Congratulations! You have completed the Quiz.
                Correct Answers: ${user.correctAnswerCount}
                Wrong Answers: ${user.wrongAnswerCount}
            You got ${user.correctAnswerCount} out of ${questionIdsArr.length} questions correctly!`);


                await ctx.reply("Click on /startquiz for start a new Quiz.");
            }

        } else {
            console.log("Unknown callback data:", callbackData);
        }
    } catch (error) {
        console.log("Error processing callback query:", error);
    }
});

// ---------------------Telegram UI part-------------------//

// -------------------add quiz data in DB------------------

const insertTechnologyQuizData = async () => {
    try {
        const question1 = await Question.create({
            questionData: "What does technology primarily aim to achieve?",
            allOptions: [
                "Enhance human life",
                "Preserve ancient traditions",
                "Predict natural disasters",
                "Study the past",
            ],
            correctAnswer: "Enhance human life",
        });

        const question2 = await Question.create({
            questionData: "What is one of the key tools of modern technology?",
            allOptions: [
                "Artificial intelligence",
                "Historical records",
                "Human intuition",
                "Cultural traditions",
            ],
            correctAnswer: "Artificial intelligence",
        });

        const question3 = await Question.create({
            questionData: "Which sector has been greatly transformed by technology?",
            allOptions: [
                "Communication",
                "Archaeology",
                "Folklore studies",
                "Linguistics",
            ],
            correctAnswer: "Communication",
        });

        const paragraph = await Paragraph.create({
            paragraphData:
                "Technology is a driving force behind the rapid progress of modern society. It focuses on enhancing human life by creating innovative solutions to everyday problems. From smartphones to smart cities, technology has significantly transformed how we communicate, work, and live. Modern tools such as artificial intelligence and automation have revolutionized industries, enabling faster and more efficient processes. Among its many impacts, technology has bridged gaps in communication, making the world more interconnected than ever before.",
            questionIds: [question1._id, question2._id, question3._id],
        });

        const category = await Category.create({
            categoryName: "Technology",
            paragraphIds: [paragraph._id],
        });

        console.log("Data inserted successfully!");
        console.log({
            category,
            paragraph,
            questions: [question1, question2, question3],
        });
    } catch (error) {
        console.error("Error inserting data:", error);
    }
};

// insertTechnologyQuizData()

const addMoreToTechnologyCategory = async () => {
    try {
        const question1 = await Question.create({
            questionData: "What is a key benefit of automation in technology?",
            allOptions: [
                "Increases efficiency",
                "Preserves cultural heritage",
                "Explores outer space",
                "Enhances artistic creativity",
            ],
            correctAnswer: "Increases efficiency",
        });

        const question2 = await Question.create({
            questionData: "Which area is most impacted by cloud computing?",
            allOptions: [
                "Data storage",
                "Historical research",
                "Wildlife conservation",
                "Traditional art forms",
            ],
            correctAnswer: "Data storage",
        });

        const question3 = await Question.create({
            questionData: "What is the primary goal of cybersecurity?",
            allOptions: [
                "Protecting digital information",
                "Developing AI models",
                "Improving physical health",
                "Preserving ancient manuscripts",
            ],
            correctAnswer: "Protecting digital information",
        });

        const paragraph = await Paragraph.create({
            paragraphData:
                "Modern technology has introduced automation, which simplifies repetitive tasks and improves efficiency in various industries. Cloud computing has revolutionized data storage and sharing, making information easily accessible globally. However, with these advancements comes the need for cybersecurity, which aims to protect digital information from theft and misuse. As technology evolves, it continues to shape how we work, live, and secure our data.",
            questionIds: [question1._id, question2._id, question3._id],
        });

        const technologyCategory = await Category.findOneAndUpdate(
            { categoryName: "Technology" },
            { $push: { paragraphIds: paragraph._id } },
            { new: true }
        );

        console.log("New paragraph and questions added successfully!");
        console.log({
            technologyCategory,
            paragraph,
            questions: [question1, question2, question3],
        });
    } catch (error) {
        console.error("Error adding data:", error);
    }
};

// addMoreToTechnologyCategory()

const insertHistoryQuizData = async () => {
    try {
        const question1 = await Question.create({
            questionData: "What does studying history help us understand?",
            allOptions: [
                "Human behavior and societal changes",
                "Modern technology advancements",
                "Future predictions",
                "Global economic systems",
            ],
            correctAnswer: "Human behavior and societal changes",
        });

        const question2 = await Question.create({
            questionData: "Which of these is a key focus of history?",
            allOptions: [
                "Exploring ancient civilizations",
                "Creating cultural trends",
                "Advancing scientific knowledge",
                "Building economic strategies",
            ],
            correctAnswer: "Exploring ancient civilizations",
        });

        const question3 = await Question.create({
            questionData: "Why is it important to learn about history?",
            allOptions: [
                "To avoid repeating past mistakes",
                "To focus on technological development",
                "To predict the future accurately",
                "To prioritize economic growth",
            ],
            correctAnswer: "To avoid repeating past mistakes",
        });

        const paragraph = await Paragraph.create({
            paragraphData:
                "History is the study of human actions, societies, and events over time. It offers a window into how different civilizations thrived, adapted, and overcame challenges. By studying history, we gain valuable insights into human behavior and societal changes. This knowledge allows us to understand the complexities of the present by connecting it with the past. History emphasizes the importance of learning from earlier mistakes to avoid repeating them. It also celebrates the achievements of diverse cultures, enabling us to appreciate our shared heritage and the events that shaped our world today.",
            questionIds: [question1._id, question2._id, question3._id],
        });

        const category = await Category.create({
            categoryName: "History",
            paragraphIds: [paragraph._id],
        });

        console.log("Data inserted successfully!");
        console.log({
            category,
            paragraph,
            questions: [question1, question2, question3],
        });
    } catch (error) {
        console.error("Error inserting data:", error);
    }
};

// insertHistoryQuizData();

const addMoreToHistoryCategory = async () => {
    try {
        const question1 = await Question.create({
            questionData: "What major benefit does studying history provide?",
            allOptions: [
                "Understanding societal evolution",
                "Learning advanced technology",
                "Improving health systems",
                "Exploring outer space",
            ],
            correctAnswer: "Understanding societal evolution",
        });

        const question2 = await Question.create({
            questionData: "What is one focus area of history?",
            allOptions: [
                "Analyzing past conflicts",
                "Predicting weather patterns",
                "Designing technological solutions",
                "Developing new medicines",
            ],
            correctAnswer: "Analyzing past conflicts",
        });

        const question3 = await Question.create({
            questionData: "Why do we study history?",
            allOptions: [
                "To learn from past mistakes",
                "To avoid cultural diversity",
                "To improve athletic performance",
                "To understand mathematical formulas",
            ],
            correctAnswer: "To learn from past mistakes",
        });

        const paragraph = await Paragraph.create({
            paragraphData:
                "History is a vital field that explores the evolution of human societies, cultures, and civilizations. It focuses on analyzing past conflicts, achievements, and decisions to derive meaningful lessons for the future. By studying history, we gain an understanding of societal changes and the factors that have shaped our world. This knowledge helps us learn from past mistakes, appreciate cultural diversity, and make informed decisions that guide humanity forward.",
            questionIds: [question1._id, question2._id, question3._id],
        });

        const historyCategory = await Category.findOneAndUpdate(
            { categoryName: "History" },
            { $push: { paragraphIds: paragraph._id } },
            { new: true }
        );

        console.log(
            "New paragraph and questions added to the 'History' category successfully!"
        );
        console.log({
            historyCategory,
            paragraph,
            questions: [question1, question2, question3],
        });
    } catch (error) {
        console.error("Error adding data to 'History' category:", error);
    }
};

// addMoreToHistoryCategory();

// ----------------add quiz data in DB--------------------

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
