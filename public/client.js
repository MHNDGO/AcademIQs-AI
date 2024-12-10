let aiResponse = ''; // Declare aiResponse in the global scope

// Function to get selected checkbox values
function getSelectedCheckboxValues(name) {
    const checkboxes = document.getElementsByName(name);
    const values = [];
    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            values.push(checkbox.value);
        }
    }
    return values;
}

// Function to get selected radio value
function getSelectedRadioValue(name) {
    const radios = document.getElementsByName(name);
    for (const radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

// Main function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form, loading div, and response container elements
    const form = document.getElementById('habit-form');
    const loadingDiv = document.querySelector('.loading');
    const aiResponseContainer = document.getElementById('ai-response-container');
    const aiResponseElement = document.getElementById('ai-response');
    const removeResponseButton = document.getElementById('remove-response-btn')
    // Get the values from the form
    const userName = document.getElementById('user-name').value;
    const examContent = document.getElementById('exam-content').value;
    const examNotes = document.getElementById('extra-information').value;
    const questionTypes = getSelectedCheckboxValues('question_type');
    const examLanguage = getSelectedCheckboxValues('exam_language');
    const date = new Date();
    const userAge = document.getElementById('user-age').value;
    const examType = getSelectedRadioValue('exam_type');
    const difficulty = getSelectedRadioValue('difficulty_level');
    const extraInformation = document.getElementById('extra-information').value;
    const questionCount = document.getElementById('question-count').value;
    const examDuration = document.getElementById('exam-duration').value;

    // Check if any required value is null
    if (questionTypes.length === 0 || !userAge || !examType) {
        alert('Please fill out all required fields.');
        return;
    }
    removeResponseButton.addEventListener("click", function() {
        aiResponseContainer.style.display = "none"
        form.style.display = "block"
    })
    // Hide the form and show the loading div
    form.style.display = 'none';
    loadingDiv.style.display = 'block';

    // Construct the prompt for the AI
    const prompt = `
    I want you to create questions for ${userAge} year old people which are in the same layout of an exam, Go ahead
    and generate ${questionCount} questions of a ${examType} ${examContent}, Make the questions ${difficulty} 
    difficulty and make them ${questionTypes.join(', ')}, Make space between a,b,c and d in MCQ questions.
    Then I want you to go ahead and give an answer sheet below the generated question with all the answers or
    the closest one available and absolutely make sure to double check your answers because I want all answers to be
    100% accurate. And also make sure to explain the answers you just generated. Make sure if the user selects a lot of questions to generate all questions and all answers.
    , Don't be lazy generate everything in any language that the user selects no exceptions. Don't say repeat the following pattern
    or any of this, it's your job to do so, i don't care what you think,Also make sure the exam is in ${examLanguage} and never ever mention yourself or say "I", It's prohibited
    , instead it's better if you don't mention anyone and in absolute cases say "We", Also make sure to say at the end of the
     response that results aren't 100% accurate and mistakes may occur just like real teachers do. Also avoid using stars(the symbol *)
     at all costs. And side notes please ${examNotes}, Never ever say things like "insert a picture" or anything that requires the user to 
     interact with it, Don't include any pictures or diagrams as the questions should be text only. only, and i do mean ONLY, ONLY then ONLY 
     answer prompts about studying, If i mentioned anything that is not related to studying or is irrelevant
     please refuse to answer me. Don't ever say things like "Continue this pattern", no, if a user asks for a 100 questions you give them a hundred questions
     don't be lazy. I want you to absolutelt check this this is extremely important, if a user asks for you to generate a 100 questions go ahead and generate
     don't say continue patern, This is extremely important and you cannot at all do things like this, Only provide questions with 1 correct answer, if you really want to add 2 correct answers you
     can make d for example : Both b and c, or both a and c or both a and b. It doesn't matter but don't include more than 1 correct answer please. 
    `;

    // Log the prompt to the console
    console.log('Constructed Prompt:', prompt);

    // Send the prompt to the server
    try {
        const response = await fetch('https://academiqs.up.railway.app/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, questionTypes, userAge, examType, extraInformation, questionCount, examDuration })
        });

        const data = await response.json();
        console.log('Server Response:', data);

        // Store the AI response for later use
        aiResponse = data.aiResponse;

        // Format the AI response
        let formattedResponse = aiResponse.replace(/\*/g, '').replace(/\n/g, '<br>');

        // Display the AI response
        aiResponseElement.innerHTML = `Quiz:<br>${formattedResponse}`;
        aiResponseContainer.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Hide the loading div
        loadingDiv.style.display = 'none';
    }
}

// PDF Generation
document.getElementById("generate-pdf").addEventListener("click", () => {
    if (!aiResponse) {
        alert('Please generate questions first before creating a PDF.');
        return;
    }
    pdfMake.fonts = {notoSans: {normal: ["https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100..900&display=swap"]}}

    // Use the AI response to populate the PDF content
    const documentDefinition = {
        content: [
            { text: 'بس يا معرض', style: 'header' },
            { text: `Date: ${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`, style: 'header' },
            { text: `Target audience: ${document.getElementById('user-age').value} year old people`, style: 'header' },
            { text: `Name: ${document.getElementById('user-name').value}`, style: 'subheader' },
            { text: `Time: ${document.getElementById('exam-duration').value} minutes`, style: 'subheader' },
            { text: aiResponse, style: 'question' },
            { text: 'Good luck!', style: 'footer' },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
                font:"notoSans"
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 5, 0, 5]
            },
            question: {
                fontSize: 12,
                margin: [0, 5, 0, 5]
            },
            footer: {
                fontSize: 10,
                italics: true,
                margin: [0, 10, 0, 0]
            }
        }
       
    };
    // Generate the PDF and download it
    pdfMake.createPdf(documentDefinition).download(`${document.getElementById('user-name').value}-AcademIQs-quiz.pdf`);
});

// Add event listener for form submission
document.getElementById('habit-form').addEventListener('submit', handleFormSubmit);
