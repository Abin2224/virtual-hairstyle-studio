Virtual Hairstyle Studio
_________________________

An AI-powered web app that lets users upload a photo and preview realistic hairstyles instantly.


Live Demo : 
https://ai.studio/apps/drive/14vRqs8cGhm4-g9MoxZiquGyJnOeKxhGY?fullscreenApplet=true

This demo runs on Google’s AI infrastructure and does not require any setup or API keys.



What This Project Does :
_________________________
Virtual Hairstyle Studio allows users to:
  Select a gender
  Upload a photo
  Choose a hairstyle and hair length
  Generate a realistic AI preview of how that hairstyle would look on them
  The goal is to provide a simple, visual way to try different haircuts before making a real-world decision.


Features :
____________
  Modern, responsive UI
  Image upload and live preview
  Hairstyle and length selection
  AI-powered hairstyle generation
  Mobile and desktop support


Tech Stack :
______________
  Frontend: React + TypeScript + Vite
  UI: Custom CSS
  AI: Google Gemini via Google AI Studio
  Hosting: Google AI Studio


How It Works : 
_______________
This project is built and hosted inside Google AI Studio.
Google handles:
  AI model access
  Authentication
  Usage quotas

  
Hosting :
    When a user uploads an image and clicks Generate, the request is processed by Gemini’s image model running on Google’s infrastructure.

Running Locally :
  You can run the UI locally if you want to modify or extend it.
    npm install
    npm run dev


Note:
  The AI functionality depends on Google AI Studio. Local builds are mainly for UI development.


Project Structure :
____________________
  components/      UI components  
  services/        AI request logic  
  App.tsx          Main app  
  index.tsx        Entry point  
  vite.config.ts   Vite config  



Why This Project Exists : 
  
  This project was built as an exploration of:
    Multimodal AI (image + text)
    Real-world AI product UX
    How modern AI tools can be integrated into web apps
  It is designed as a portfolio-grade prototype.

License

MIT License — feel free to use, modify, and build on this project.  
