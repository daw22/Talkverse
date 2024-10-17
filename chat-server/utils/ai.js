import  {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-002",
  safetySettings: safetySettings,
  systemInstruction: "i want you translate messages for me word by word with out any alteration. i will send you a json like this '{\"from\":  'german', \"to\": \"english\", \"content\": \"the message\"}' after translating from geramn to english send me back a json with the format '{\"language\": \"english\", \"content\": \"translated language\"} ",
});

const generationConfig = {
  temperature: 0,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function run(from, to, message) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });
  const result = await chatSession.sendMessage(
    `{ from: ${from}, to: ${to}, content: ${message}}`);
  return result;
}

export default run;