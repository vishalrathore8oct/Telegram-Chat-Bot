import { Category } from "../models/category.models.js";
import { Paragraph } from "../models/paragraph.models.js";
import { Question } from "../models/quesion.models.js";

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

export { insertNatureQuizData, addMoreToNatureCategory };