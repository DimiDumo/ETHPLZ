Hello, we are ETHPLZ and this weekend we worked on onboarding casual users into the NFT ecosystem.

---- Slide 2 ---- 

Web2 is a "customer is king" environment, companies abstract away a lot of complexity. In the world of web3 users are left on their own - they have full control but also full responsibility. This transition can be pretty brutal for non-tech users.

Our mission is to hold our customers' hands while they are making first steps with NFTs.

---- Slide 3 ---- 

To achieve that we developed an NFT wallet with Instagram-like user-experience and social recovery feature:
- We help our users discover art and artists
- We give them the possibility to start an NFT collection without purchasing crypto.
- We take the responsibility of securing our users assets until they decide to add their friends and family as guardians.

Let's take a look at our prototype.

---- Flow 1 ----

The user first goes through a usual web2 signup process and sees the Discover screen. This is an algrorithmic feed that aggregates NFTs from different chains and takes user likes into account.

Experience of buying an NFT is no different from what the users are accustomed to. Provide us with a credit card and billing details and get the NFT delivered straight into your portfolio.

---- Flow 2 ----

User never had to confirm any transaction but this is still happening under the hood using the private key that was generated and stored on user's device. What happens if the user loses his phone and logs in from a new one?

To regenerate the key using social recovery (by default) the user needs to confirm his identity with PLZ Wallet using 2FA. If the user has already assigned his friends as guardians they need enter the app and confirm the reset.

Access to the PLZ Wallet is restored and NFTs are accessible again!

---- TECH ----

Such User Experience is only possible thanks to the products of our sponsors. Let's see how those technologies fit into our architecture.

Cornerstone of our app is Moralis and Phillipe will talk a bit about how we are using.

Circle is responsible for seamlessly bridging credit card payments to crypto. Once we confirm that USDC have entered our master wallet, we use our own funds on whatever chain the NFT contract is located on to purchase an NFT and transfer it to user's wallet.

NFTPort powers our algorithmic discover page. We first allow our user to search for things relevant for him, for example photographs. Once we collect some likes from the user we can start using NFTPort Recommendation AI to provide more relevant content.

Transaction price, speed and decentralization are the main points why we chose Polygon to host our Wallets.
We are paying the gas fees when users interact with wallets so we would like to keep our costs low while still making our users into web3-citizens
We are laser-focused on user experience so fast transactions are also a must