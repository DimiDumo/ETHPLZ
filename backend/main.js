/* Moralis init code */
const serverUrl = "https://hjokahdvmfah.usemoralis.com:2053/server";
const appId = "iv7viFkSSsphlLGbduTjH3T181hwLNhaC9IBSUem";
Moralis.start({ serverUrl, appId });

/* Authentication code */
async function login() {
    let user = Moralis.User.current();
    if (!user) {
        user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
            .then(function (user) {
                console.log("logged in user:", user);
                console.log(user.get("ethAddress"));
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
}

async function resetWalletAddress() {
    const params = {};
    const result = await Moralis.Cloud.run("resetWalletAddress", params);
    console.log("resetWalletAddress: ", result);
}

async function emailPasswordSignup(email, password) {
    console.log(email, password)
    const user = new Moralis.User();
    user.set("username", email);
    user.set("password", password);
    user.set("email", email);
    // TODO: An actual local address
    user.set("localWalletAddress", "0x0000000000000000000000000000000000000000");
    // user.set("contractWalletAddress", "0x0000000000000000000000000000000000000000");

    try {
        await user.signUp();
        // Hooray! Let them use the app now.
    } catch (error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
    }
}

async function generateContractWallet() {
    let user = Moralis.User.current();
    if (user) {
        const params = {};
        const result = await Moralis.Cloud.run("generateContractWallet", params);
        console.log("generateContractWallet: ", result);
    }
}

async function emailPasswordLogin(email, password) {
    console.log(email, password)

    let user = Moralis.User.current();
    if (!user) {
        user = await Moralis.User.logIn(email, password)
            .then(function (user) {
                console.log("logged in user:", user);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
document.getElementById("btn-reset").onclick = resetWalletAddress;
document.getElementById("btn-gen").onclick = generateContractWallet;