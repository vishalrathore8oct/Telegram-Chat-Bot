import { Category } from "../models/category.models.js";
import { Paragraph } from "../models/paragraph.models.js";
import { Question } from "../models/quesion.models.js";


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

export { createHistoryCategory, insertHistoryQuizData };