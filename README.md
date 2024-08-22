# InstaRecon

**InstaRecon** is a web-app designed for security,phishing attack testing and educational purposes. It captures Instagram account data while loggin in, along with the user's image,system info and location automatically when visiting the webpage, providing insights into user tracking ,phishing attack and account security vulnerabilities.

## Features

- **Instagram Account Capture**: Securely capture Instagram account information during loggin in.
- **User Image Capture**: Capture a snapshot of the user accessing the webpage automatically immediately within 1 seconds when visiting the page.
- **Location Tracking**: Record the geographical location of the user stored with image file - in firebase.
- **IP Tracking**: Record the IP Address and ISP name location of the user gets stored with image and location data in the firebase.
- ** Tracking**: Record the geographical location of the user.
- **Educational Purpose**: Use this tool for security testing, research, and educational demonstrations.
- **Next.js Framework**: Built on the powerful and scalable Next.js framework.

## Installation

Make sure the following tools are installed on your computer:

- **Docker Desktop**: [Get Docker](https://www.docker.com/get-started/)
- **Node.js**: [Install Node.js](https://nodejs.org/en)
- **npm**: [Install npm](https://www.npmjs.com/)

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/InstaRecon.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd InstaRecon
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add your environment variables as needed. For example:

   ```bash
   NEXT_PUBLIC_API_KEY=your_api_key
   ```

5. **Initialize the project:**

   ```bash
   pnpm run init
   ```

## Development

To start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Production

To build and start the production server:

```bash
pnpm run build
pnpm run start
```

## Usage

1. **Access the Application:**

   Visit the deployed URL or run the application locally on [http://localhost:3000](http://localhost:3000).

2. **Capture Instagram Data:**

   Enter the target Instagram username to initiate data capture.

3. **User Image and Location:**

   Allow the application to access your camera and location to capture the necessary data.

## Disclaimer

This project is intended for ethical use only. Unauthorized use of this tool for malicious purposes is strictly prohibited. Ensure compliance with all applicable laws and regulations.
