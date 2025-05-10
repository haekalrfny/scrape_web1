// Import required libraries
const express = require("express");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const puppeteer = require("puppeteer");

// Load environment variables
dotenv.config();

// Initialize express app & port
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // API key
});

// Function to scrape raw text from a URL
async function scrapeRawText(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Get all text content on the page
  const rawText = await page.evaluate(() => document.body.innerText);

  await browser.close();
  return rawText;
}

// API route to scrape text and send it to OpenAI for extraction
app.post("/scrape", async (req, res) => {
  try {
    const { url, prompt } = req.body;

    // Check if both 'url' and 'prompt' are provided
    if (!url || !prompt) {
      return res
        .status(400)
        .json({ error: "Both 'url' and 'prompt' fields are required." });
    }

    // Scrape raw text from URL
    const rawText = await scrapeRawText(url);

    // Send raw text to OpenAI for data extraction
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-prover-v2:free",
      messages: [
        {
          role: "user",
          content: `Here is the raw page text scraped:\n\n${rawText}\n\n${prompt}\n\nReturn only JSON array.`,
        },
      ],
    });

    // Get AI's response and clean it for JSON parsing
    let aiReply = completion.choices[0].message.content;
    let data;
    try {
      const cleanedResponse = aiReply
        .replace(/^```json\n/, "")
        .replace(/\n```$/, "");
      data = JSON.parse(cleanedResponse);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "AI response is not valid JSON.", raw: aiReply });
    }

    // Return extracted data
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
