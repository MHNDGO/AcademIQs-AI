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
    const removeResponseButton = document.getElementById('remove-response-btn');

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

    removeResponseButton.addEventListener("click", function () {
        aiResponseContainer.style.display = "none";
        form.style.display = "block";
    });

    // Hide the form and show the loading div
    form.style.display = 'none';
    loadingDiv.style.display = 'block';

    // Construct the prompt for the AI
    const prompt = `
        I want you to create questions for ${userAge} year old people which are in the same layout of an exam, Go ahead
        and generate ${questionCount} questions of a ${examType} ${examContent}, Make the questions ${difficulty} 
        difficulty and make them ${questionTypes.join(', ')}, Make space between a,b,c and d in MCQ questions.
        Then I want you to go ahead and give an answer sheet below the generated question with all the answers.
        Also make sure the exam is in ${examLanguage} and adhere to ${examNotes}.
    `;

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

    // Define custom fonts
    pdfMake.fonts = {
        notoSans: {
            normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
            bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
            italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
            bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
    };

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
        defaultStyle: {
            font: 'notoSans'
        },
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
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
