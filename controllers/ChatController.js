const path = require('path');
const fs = require('fs')

require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


exports.submitPrompt =  async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const prompt = req.body.prompt;
        const history = req.body.history;
        const image = req.body.image;
        const fileType = req.body.fileType;

        // Set headers for chunked streaming
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');

        if (image) {
            const imagePath = `uploads/${image}`;
            const imageParts = image ? [await fileToGenerativePart(imagePath, fileType)] : [];
            const result = await model.generateContentStream([prompt, ...imageParts]);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                res.write(chunkText);
            }

        }else {

            const chat = model.startChat({
                history: history
            });    
            const result = await chat.sendMessageStream(prompt);
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                res.write(chunkText);
            }

        }
        
        res.end(); // End the response
        
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred during content generation.', details: error.message });
    }
};

async function fileToGenerativePart(path, mimeType) {
    try {
        const fileBuffer = await fs.promises.readFile(path); // Asynchronous file read
        return {
            inlineData: {
                data: fileBuffer.toString('base64'), // Convert file to base64
                mimeType
            }
        };
    } catch (error) {
        console.error(`Error reading file from path ${path}:`, error);
        throw new Error('File read error');
    }
}

exports.getRecentTitle =  async (req, res) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
    const prompt = req.body.prompt;
    const history = req.body.history;
    
    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 40
        }
    });    
    const result = await chat.sendMessage(prompt);
    const response = result.response.text()

    return res.status(200).json(response)
}
