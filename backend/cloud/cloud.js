Moralis.Cloud.define("resetWalletAddress", async (request) => {
    // TODO: Generate a reset token (signature from the name of the company wallet permitting the user to set a new private wallet in the contract wallet)
    // TODO: Send the generated token in a link to the users email
    // Rinkeby
    const web3 = Moralis.web3ByChain("0x4");
    // super secret private key
    const privateKey = "0xd7325de5c2c1cf0009fac77d3d04a9c004b038883446b065871bc3e831dcd098";
    web3.eth.accounts.privateKeyToAccount(privateKey);
    const sig = web3.eth.accounts.sign("Some data", privateKey);

    return sig;
}, {
    requireUser: true
});
