# SEM Engine & Visualizer

A structural equation modeling (SEM) calculator and path diagram visualizer built with React. Enter your variable relationships, compute SEM metrics, and get AI-generated examples to test with — powered by the Gemini API.

## What it does

- Calculates complex variable relationships in SEM models
- Visualizes path diagrams to make abstract SEM theory concrete
- Built-in AI example recommender — enter a topic and get relevant SEM test cases generated via Gemini

## Tech Stack

React, JavaScript, Vite, Gemini API

## Getting Started

### 1. Clone the repo

git clone https://github.com/SHINCHANN007/react-dummy.git
cd react-dummy/react-dummy

### 2. Install dependencies

npm install

### 3. Add your Gemini API key

Create a `.env` file in the root and add:

VITE_GEMINI_API_KEY=your_api_key_here

You can get a free API key at https://aistudio.google.com/app/apikey

### 4. Run the app

npm run dev

## Notes

- No live demo currently — run locally using the steps above
- Gemini API key required for the example recommender feature
