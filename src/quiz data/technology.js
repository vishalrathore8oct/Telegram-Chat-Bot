import { Category } from "../models/category.models.js";
import { Paragraph } from "../models/paragraph.models.js";
import { Question } from "../models/quesion.models.js";


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

export { createTechnologyCategory, addMoreDataToTechnologyCategory };