import { Category } from "../models/category.models.js";
import { Paragraph } from "../models/paragraph.models.js";
import { Question } from "../models/quesion.models.js";

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

export { addScienceQuizData, addMoreToScienceCategory };