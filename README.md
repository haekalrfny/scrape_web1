# Web Scraper + AI

This is a simple Node.js API built with Express. It scrapes raw text from a given URL using Puppeteer and then uses OpenAI models (via OpenRouter) to extract structured data based on your prompt.

## Features

* Scrape raw text from any public webpage.
* Extract structured data using an LLM.
* Returns a clean JSON array response.

## Tech Stack

* Node.js
* Express
* Puppeteer
* OpenAI API (via OpenRouter)
* dotenv

## Requirements

* Node.js
* OpenRouter API key: process.env.OPENROUTER_API_KEY

## Installation

1. **Clone the repo**

```bash
git clone https://github.com/haekalrfny/scrape_web1.git
cd scrape_web1
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add:

```env
PORT=3000
OPENROUTER_API_KEY=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
```

## Running the API

```bash
node index.js
```

Server will run at:
`http://localhost:3000`

## API Endpoints

### POST `/scrape`

Scrapes a webpage and returns extracted JSON data.

#### Request Body

```json
{
  "url": "https://www.ebay.com/sch/i.html?_from=R40&_nkw=nike&_sacat=0&rt=nc&_pgn=1",
  "prompt": "Please extract all products with the fields: product_name, price, and detail description."
}
```

#### Response

```json
{
  "data": [
    {
      "product_name": "Product 1",
      "price": "IDR2,147,434.80"
      "desc": "lorem ipsum"
    },
    {
      "name": "Product 2",
      "price": "IDR3,282,358.80 to IDR5,236,840.00",
      "desc": "lorem ipsum"
    }
  ]
}
```

## Notes

* Make sure the target URL is publicly accessible.
* The AI model used is: `deepseek/deepseek-prover-v2:free`
* This API expects the model to return only a JSON array in its reply.
* Heavy pages may take a few seconds to scrape due to Puppeteer.

---
