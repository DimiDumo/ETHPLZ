# PLZ Wallet - The gateway into NFT ecosystem for casual users

This is what we submitted to ETH Global NFTHack2022.

An NFT wallet with Instagram-like user-experience and social recovery feature:
- We help our users discover art and artists
- We give them the possibility to start an NFT collection without purchasing crypto.
- We take the responsibility of securing our users assets until they decide to add their friends and family as guardians.

# Final Pitch

Slides: https://docs.google.com/presentation/d/1lAO4I-FuAbMLM30kiNdcC65GPEUiOHjnpHRGEmpzLis/

Text: (see PITCHTEXT.md)

## Sponsor Presentation (live)
Starting point for Flow 1: https://ethplz.herokuapp.com/login

Starting point for Flow 2: https://ethplz.herokuapp.com/recover

## Video Presentation (Figma):
F1: New User Flow: https://www.figma.com/proto/ysHpIN1CiM8C5NstXwgXZF/PLZ-Wallet?node-id=161%3A8747&starting-point-node-id=161%3A8747&show-proto-sidebar=1&scaling=scale-down

F2: Lost Key/Device Flow: https://www.figma.com/proto/ysHpIN1CiM8C5NstXwgXZF/PLZ-Wallet?node-id=161%3A6612&starting-point-node-id=161%3A6612&show-proto-sidebar=1&scaling=scale-down

F2.1: Key Guardian User Flow: https://www.figma.com/proto/ysHpIN1CiM8C5NstXwgXZF/PLZ-Wallet?node-id=201%3A6597&starting-point-node-id=201%3A6597&show-proto-sidebar=1&scaling=scale-down


# How To Deploy

Deploy to Heroku (app name: ethplz) by running 

```
./scripts/build_and_push.sh
./scripts/realease.sh
```

# How to run for local development

```
npm i
npm run start
```

