const { exec } = require("child_process");

function runCommand(command, label) {
    return new Promise((resolve, reject) => {
        console.log(`\n🚧 ${label}...`);
        const proc = exec(command, { shell: true });

        proc.stdout.on("data", (data) => process.stdout.write(data));
        proc.stderr.on("data", (data) => process.stderr.write(data));

        proc.on("exit", (code) => {
            if (code === 0) {
                console.log(`✅ ${label} completed successfully.`);
                resolve();
            } else {
                console.error(`❌ ${label} failed with code ${code}.`);
                reject(new Error(`${label} failed`));
            }
        });
    });
}

async function main() {
    try {
        console.log("====================================");
        console.log("🚀 Starting Build & Deploy Process...");
        console.log("====================================");

        // STEP 1: Build
        await runCommand("npm run build", "Build");

        // STEP 2: Deploy
        await runCommand("firebase deploy", "Deploy");

        // STEP 3: Cleanup
        await runCommand("rmdir /s /q .firebase", "Cleanup"); // Windows
        // If you want cross-platform:
        // await runCommand("rm -rf .firebase", "Cleanup");

        console.log("====================================");
        console.log("🎉 Build & Deploy process finished!");
        console.log("====================================");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

main();
