
# Welcome to your Vicidial Nexus project - Agent Call Center Dashboard

This project is a web application designed to serve as a dashboard for call center agents. It provides tools for managing leads, making calls, and tracking performance.

## Project info

**URL**: https://lovable.dev/projects/a23f20e2-ed8d-4c52-a5b8-4cde003b87db

## Project Features

The Agent Call Center Dashboard includes the following key features:

*   **Agent Dashboard:** Central hub displaying dialer, current lead information, and agent statistics.
*   **Dial Pad:** Interface for manually dialing numbers.
*   **Lead Information Display:** Shows details of the currently active or selected lead.
*   **Agent Statistics:** Real-time and historical performance metrics for the agent.
*   **Add Lead:** Modal to manually add new leads into the system.
*   **Update Lead:** (Placeholder) Modal to update existing lead information.
*   **Search Lead:** Modal to search for specific leads within the system.
*   **View Callbacks:** Modal to display a list of scheduled callbacks.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a23f20e2-ed8d-4c52-a5b8-4cde003b87db) and start prompting.

Changes made via Lovable will be committed automatically to this repo if GitHub integration is enabled.

**Use your preferred IDE (Ubuntu Setup Guide for Beginners)**

If you want to work locally using your own IDE on an Ubuntu system, this guide will walk you through the setup. For other operating systems, the general steps for installing Node.js, npm, and Git will be similar, but specific commands may vary.

**Prerequisites for Ubuntu:**

Before you begin, you'll need:
*   `git`: To clone the repository (copy the project files to your computer).
*   `curl`: A tool to transfer data, which we'll use to download the nvm installer.
*   `nvm` (Node Version Manager): This is the recommended way to install Node.js and npm (Node Package Manager). Node.js is the environment where your application runs, and npm is used to manage project dependencies (libraries and tools the project needs). `nvm` allows you to easily switch between different Node.js versions.

**Step-by-step Installation on Ubuntu:**

1.  **Open your terminal.**
    You can usually find it by searching for "Terminal" in your applications or by pressing `Ctrl+Alt+T`.

2.  **Update your package list:**
    This command refreshes the list of available software packages.
    ```sh
    sudo apt update
    ```

3.  **Install Git:**
    If you don't have Git installed already. The `-y` flag automatically confirms the installation.
    ```sh
    sudo apt install git -y
    ```

4.  **Install cURL:**
    cURL is needed to download the nvm installation script.
    ```sh
    sudo apt install curl -y
    ```

5.  **Install nvm (Node Version Manager):**
    This command downloads and runs the nvm installation script. For the very latest version and command, you can always check the [official nvm GitHub page](https://github.com/nvm-sh/nvm#installing-and-updating).
    ```sh
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
    After the script finishes, you'll likely need to close and reopen your terminal, or run a command like `source ~/.bashrc` (or `source ~/.zshrc` if you use Zsh) for the `nvm` command to become available. The script usually tells you what to do.

6.  **Install Node.js and npm using nvm:**
    Now, use nvm to install the latest Long-Term Support (LTS) version of Node.js. LTS versions are stable and recommended for most users. This will also install npm.
    ```sh
    nvm install --lts
    ```
    Then, tell nvm to use this version:
    ```sh
    nvm use --lts
    ```
    Verify that Node.js and npm are installed correctly by checking their versions:
    ```sh
    node -v
    npm -v
    ```
    You should see version numbers printed for both.

7.  **Clone the Repository:**
    Now, you'll copy the project files to your computer. You'll need the project's Git URL. If you've connected your Lovable project to GitHub, you can find this URL in your Lovable project settings under "GitHub integration".
    ```sh
    git clone <YOUR_GIT_URL>
    ```
    Replace `<YOUR_GIT_URL>` with the actual URL (e.g., `https://github.com/your-username/your-project-name.git`).

8.  **Navigate to the Project Directory:**
    After cloning, a new folder will be created. Change your terminal's current location into this new folder.
    Replace `<YOUR_PROJECT_NAME>` with the name of the folder that was created (it's usually the same as the repository name).
    ```sh
    cd <YOUR_PROJECT_NAME>
    ```

9.  **Install Project Dependencies:**
    This project uses several external libraries and tools. This command reads the `package.json` file in the project and downloads/installs everything listed there.
    ```sh
    npm install
    ```
    (You can also use the shorthand: `npm i`)

10. **Start the Development Server:**
    This command starts the local web server, builds your application, and watches for any file changes to automatically rebuild and refresh your browser.
    ```sh
    npm run dev
    ```

11. **View Your Application:**
    Once the server starts (you'll see some output in the terminal, often mentioning a URL), open your web browser (like Firefox or Chrome) and go to:
    `http://localhost:8080`
    This is the default address where your application will be running. You should now see the Agent Call Center Dashboard!

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

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Recharts (for charts)
- Lucide React (for icons)

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

