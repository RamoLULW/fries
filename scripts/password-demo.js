import { comparePassword, hashPassword } from "../utils/password.js";

const samplePassword = "papitas123";
const slightlyDifferentPassword = "papitas124";

const runDemo = async () => {
    const firstHash = await hashPassword(samplePassword);
    const secondHash = await hashPassword(samplePassword);
    const comparisonWithSameText = await comparePassword(samplePassword, firstHash);
    const comparisonWithDifferentText = await comparePassword(slightlyDifferentPassword, firstHash);

    console.log("Original text:", samplePassword);
    console.log("First hash:", firstHash);
    console.log("Second hash:", secondHash);
    console.log("Same text matches first hash:", comparisonWithSameText);
    console.log("Different text matches first hash:", comparisonWithDifferentText);
};

runDemo().catch((error) => {
    console.error("Password demo failed:", error.message);
    process.exitCode = 1;
});
