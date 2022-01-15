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

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;
document.getElementById("btn-reset").onclick = resetWalletAddress;