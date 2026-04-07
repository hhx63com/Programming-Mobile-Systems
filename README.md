## How to run code

If you want to run the code in this project, please follow these steps:

1. **Download all files**  
   Please ensure that the following all files have been downloaded:
   - `index.html`
   - `style.css`
   - `main.js`
   - `main.ts`
   - `tsconfig.json`

2. **Running code**  
   In a terminal or command line, navigate to the directory where the file is located, and then execute the following command:
 ### Step 1: Prepare the environment
1. **Install Node.js**：Visit official website (https://nodejs.org/) of Node.jsd to download and install the version of Node.js suitable for your device.
2. **Install TypeScript**：Open a terminal (command prompt or PowerShell) and run the following command:
   ```
   npm install -g typescript
   ```

### Step 2: Get the project file.
Copy the following files to a new folder:
- `index.html`
- `main.ts`
- `styles.css`
- `tsconfig.json`

### Step 3: Compile TypeScript file
1. Open a terminal and navigate to the project folder.
2. Run the following command to compile the TypeScript file:
   ```
   tsc --target ES2015 main.ts
   ```
   This will generate the `main.js` file.
   
### Step 4: Run the project
**Open HTML file**
1. Open the `index.html` file directly in the browser.
2. The browser will automatically load the files `main.js` and `styles.css`.
