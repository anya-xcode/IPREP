const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Generates a professional interview answer for a given question.
 * @param {Object} question - The question object containing description, role, techStack, etc.
 * @returns {Promise<string>} - The generated answer.
 */
exports.generateAnswer = async (question) => {
    if (!process.env.GROQ_API_KEY) {
        console.warn("GROQ_API_KEY is not defined in .env. Skipping AI generation.");
        return "AI Answer generation is pending API key configuration.";
    }

    try {
        const prompt = `
            You are a senior technical interviewer and expert software engineer.
            Provide a concise, professional, and well-structured answer to the following interview question.
            
            Context:
            - Role: ${question.role}
            - Company: ${question.company}
            - Tech Stack: ${question.techStack.join(", ")}
            - Question: ${question.description}
            
            Requirements:
            1. Keep the answer professional and easy to understand.
            2. Use bullet points for steps or key points if applicable.
            3. If it's a coding question, provide a brief logic explanation.
            4. Keep the total length under 300 words.
            5. Do not include any introductory or concluding remarks like "Here is the answer".
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that provides professional interview answers."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile", // Using a supported Groq model
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        return chatCompletion.choices[0]?.message?.content || "No answer generated.";
    } catch (error) {
        console.error("Error generating answer with Groq:", error);
        return "Failed to generate AI answer. Please try again later.";
    }
};
