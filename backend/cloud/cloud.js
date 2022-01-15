Moralis.Cloud.define("resetWalletAddress", async (request) => {
    // TODO: Generate a reset token (signature from the name of the company wallet permitting the user to set a new private wallet in the contract wallet)
    // Rinkeby
    const web3 = Moralis.web3ByChain("0x4");
    // super secret private key
    const privateKey = "0xd7325de5c2c1cf0009fac77d3d04a9c004b038883446b065871bc3e831dcd098";
    web3.eth.accounts.privateKeyToAccount(privateKey);

    // TODO: Sign something useful
    const email = request.user.get("email");
    const sig = web3.eth.accounts.sign(email, privateKey);

    Moralis.Cloud.sendEmail({
        to: email,
        subject: "Plz Wallet local wallet reset key",
        html: "http://plz.wallet/?" + Object.entries(sig).map(e => e.join('=')).join('&')
    });

    return sig;
}, {
    requireUser: true
});

Moralis.Cloud.define("generateContractWallet", async (request) => {
    // TODO: Actually generate contract address
    if (!request.user.get("contractWalletAddress")) {
        request.user.set("contractWalletAddress", "0x0000000000000000000000000000000000000000");
        await request.user.save(null, { useMasterKey: true });
        return request.user;
    }
    return 2;
}, {
    requireUser: true,
    useMasterKey: true
});
