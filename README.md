
# Welcome to your Vicidial Nexus project - Agent Call Center Dashboard

This project is a web application designed to serve as a dashboard for call center agents. It provides tools for managing leads, making calls, and tracking performance.

## Project info

**URL**: https://lovable.dev/projects/a23f20e2-ed8d-4c52-a5b8-4cde003b87db

## Project Features

The Agent Call Center Dashboard is packed with features to enhance agent productivity and streamline call center operations. Here’s a closer look at what it offers:

### Agent Dashboard
The central hub for agents. It provides an integrated view of the dialer, current lead information, and key performance statistics for the day. Everything an agent needs is right at their fingertips.

### Dial Pad
A fully functional dial pad that allows agents to manually dial numbers. It supports standard call controls like initiating calls, transferring, and hanging up.

### Lead Information Display
This component shows comprehensive details of the currently active lead, including name, phone number, email, status, and historical notes, ensuring the agent is always well-informed.

### Agent Statistics
Agents can view their performance metrics in real-time. This includes total calls, average talk time, break duration, and other key indicators to help them track their productivity throughout the day.

### Add Lead
A convenient modal allows agents to quickly add new leads into the system without leaving their dashboard. It captures all necessary information to create a new lead record instantly.

### Update Lead
*(Placeholder)* This feature will allow agents to update existing lead information directly from the dashboard, ensuring data accuracy.

### Search Lead
Agents can search for specific leads using various criteria like name or phone number. The search results allow for quick selection to make a lead active.

### View Callbacks
A dedicated modal displays a list of all scheduled callbacks, helping agents stay organized and follow up with leads at the agreed-upon time.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a23f20e2-ed8d-4c52-a5b8-4cde003b87db) and start prompting.

Changes made via Lovable will be committed automatically to this repo if GitHub integration is enabled.

**Use your preferred IDE (Local Development Setup)**

To work on this project locally, you'll need to set up a development environment on your computer. Below are the requirements and a detailed guide for Ubuntu users. The steps for macOS and Windows are similar.

### System Requirements

Before you start, ensure you have the following software installed:

*   **Git:** For version control and cloning the project. You can download it from [git-scm.com](https://git-scm.com/).
*   **Node.js:** The JavaScript runtime environment. This project doesn't use PHP. We recommend using the latest Long-Term Support (LTS) version. As of June 2025, the recommended version is **v20.x**. You can check the current LTS version on the [Node.js website](https://nodejs.org/).
*   **npm (Node Package Manager):** This comes bundled with Node.js and is used to manage the project's dependencies.

The easiest way to manage Node.js and npm versions is by using **nvm (Node Version Manager)**.

### Project Dependencies (The "Requirements File")

In Node.js projects, the `package.json` file serves as the "requirements file." It lists all the specific libraries and their versions that the project needs to run correctly.

You don't need to install these dependencies one by one. The `npm install` command, which we'll cover below, reads this file and automatically downloads everything for you.

### Step-by-Step Guide for Ubuntu Beginners

This guide will walk you through setting up the project on a fresh Ubuntu system. Each command block can be copied and pasted directly into your terminal.

**1. Open Your Terminal**
You can find it by searching for "Terminal" in your applications or by pressing `Ctrl+Alt+T`.

**2. Install Git and cURL**
First, update your package list. Then, install `git` (for downloading the code) and `curl` (for downloading installers).
```sh
# Update your list of available software packages
sudo apt update

# Install git and curl. The -y flag automatically answers "yes" to prompts.
sudo apt install git curl -y
```

**3. Install nvm (Node Version Manager)**
`nvm` helps you install and switch between different versions of Node.js easily. We'll use `curl` to download and run the official installation script.
```sh
# Download and execute the nvm installation script.
# For the latest version, always check the official nvm GitHub page.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
> **Important:** After the script finishes, you must **close and reopen your terminal** for the `nvm` command to be available.

**4. Install Node.js and npm**
Use `nvm` to install the latest Long-Term Support (LTS) version of Node.js. This is the most stable and recommended version. `npm` is included automatically.
```sh
# Install the latest LTS version of Node.js
nvm install --lts

# Set the LTS version as the one to use for the current session
nvm use --lts
```
To verify the installation was successful, check the versions:
```sh
# Check Node.js version (e.g., v20.14.0)
node -v

# Check npm version (e.g., 10.7.0)
npm -v
```

**5. Clone the Project Repository**
Now, create a copy of the project on your local machine using `git`. You'll need the project's Git URL from GitHub.
```sh
# Replace <YOUR_GIT_URL> with the actual URL
git clone <YOUR_GIT_URL>
```

**6. Navigate to the Project Directory**
Move into the newly created project folder.
```sh
# Replace <YOUR_PROJECT_NAME> with the folder name
cd <YOUR_PROJECT_NAME>
```

**7. Install Project Dependencies**
This command reads the `package.json` file and installs all the required libraries for the project to run. This might take a few minutes.
```sh
npm install
```

**8. Start the Development Server**
You're all set! This command starts a local web server and opens the application. It will also automatically reload the page in your browser whenever you save a file.
```sh
npm run dev
```

**9. View Your Application**
Open your web browser and go to `http://localhost:8080`. You should now see the application running!

### Notes for macOS and Windows Users
*   **macOS:** You can use [Homebrew](https://brew.sh/) to install Git (`brew install git`). The `nvm` installation steps are the same as for Ubuntu.
*   **Windows:** You can download Git from the official website. For Node.js, you can either use the official Windows installer or use [nvm-windows](https://github.com/coreybutler/nvm-windows), a separate but similar tool to `nvm`.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with a modern JavaScript stack. All the libraries and tools listed below are automatically downloaded and installed when you run the `npm install` command, as they are defined in the project's `package.json` file.

- **Vite:** A fast build tool that serves your code during development and bundles it for production.
- **TypeScript:** A superset of JavaScript that adds type safety to your code.
- **React:** A JavaScript library for building user interfaces.
- **shadcn-ui:** A collection of beautifully designed, reusable UI components.
- **Tailwind CSS:** A utility-first CSS framework for rapid and custom styling.
- **Recharts:** A composable charting library for creating data visualizations.
- **Lucide React:** A library of clean and consistent icons.

## Project Documentation

For more detailed technical documentation, please refer to the files in the [`/docs`](./docs) directory. This includes information about the project's architecture, API integrations, and developer guides.

## How to Contribute

We welcome contributions to enhance the Agent Call Center Dashboard! To contribute, please follow these steps:

1.  **Fork the Repository:** Create your own fork of the project on GitHub.
2.  **Create a Branch:** Make a new branch in your fork for your feature or bug fix (e.g., `feature/new-widget` or `fix/dialer-bug`).
3.  **Make Changes:** Implement your changes, ensuring code quality and adherence to the project's style.
4.  **Test Your Changes:** Verify that your changes work as expected and do not introduce new issues.
5.  **Commit Your Changes:** Write clear and concise commit messages.
6.  **Push to Your Fork:** Push your changes to your forked repository.
7.  **Submit a Pull Request:** Open a pull request from your branch to the main project's `main` branch. Provide a detailed description of your changes.

We'll review your pull request as soon as possible!

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a23f20e2-ed8d-4c52-a5b8-4cde003b87db) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

