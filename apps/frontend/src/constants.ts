import { ChipIssuer } from "@types";

export const communitiesEnum: { [key: string]: string } = {
  lanna: ChipIssuer.EDGE_CITY_LANNA,
  devcon: ChipIssuer.DEVCON_2024,
  testing: ChipIssuer.TESTING,
};

export const communitiesHumanReadable: { [key: string]: string } = {
  lanna: "Edge City Lanna",
  devcon: "Dev Con 2014",
  testing: "Testing",
};

export const ERROR_SUPPORT_CONTACT = "https://t.me/vivboop";

export const devconLocationMapping: {
  [key: string]: { name: string; exhibitor: string; description: string };
} = {
  [process.env.NEXT_PUBLIC_DEVCON_MPC_HISTORY_LOCATION_ID!]: {
    name: "Whispers of Privacy: MPC Through the Years",
    exhibitor: "Ais",
    description: `If cryptography can enhance human connection, it will be through MPC.
    This exhibit traces the evolution of Multiparty Computation—the science that enables people to collaborate on shared goals without exposing their private data. From the earliest frameworks to the sophisticated coSNARKs of today, MPC is both technically interesting and a tribute to human connection. The researchers who pioneered it—Shamir, Yao, Beaver, Damgård, and others—built a foundation for secure computation, leading to tools that protect privacy even as data flows and evolves between parties.
    Each paper and artifact here represents a quiet revolution, turning cryptographic theory into a shared digital trust. Abstractly, MPC can be seen as a new geometry of trust, preserving individuality within shared spaces. In this exhibit, we invite you to explore the science of cryptography and MPC, discovering how they bring people closer without compromise. Don’t be shy to sit and learn.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_MPC_INTERACTIVE_LOCATION_ID!]: {
    name: "Privacy in Plain Sight",
    exhibitor: "Ais",
    description: `Although cryptographic theory and MPC can seem complex on paper, they’re built on surprisingly simple, natural ideas. In *Privacy in Plain Sight*, these foundations come to life as visitors act out classic protocols like Yao’s Millionaires’ Problem and the Dining Cryptographers, using coins, cards, and easy rules. By stepping into these roles, participants get a hands-on feel for the cryptographic techniques behind modern protocols like coSNARKs, used here at the event. In a setting like Devcon, where thousands gather, this exhibit demonstrates that privacy and trust can thrive in collaborative spaces, showing how we can engage, connect, and build confidence in each other—all without revealing a thing.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_ZK_JARGON_DECODER_LOCATION_ID!]: {
    name: "ZK Jargon Decoder (Print Edition)",
    exhibitor: "Nicolas Mohnblatt",
    description: `The ZK Jargon Decoder is a collection of practical definitions for the jargon you’ll often find in ZK blog posts, tweets and even papers. It aims to always give a one-sentence quick reference before giving more in-depth definitions. Importantly, the ZK Jargon Decoder does not shy away from indicating that some terms are overloaded and (hopefully) gives readers the tools for disambiguation. This paper edition is the first of its kind and is printed in collaboration with the Cursive team.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_AR_ETHEREUM_LOCATION_ID!]: {
    name: "Ethereum Artifacts",
    exhibitor: "Justin Melillo, Scuube",
    description: `"Ethereum Artifacts" is a series of five unique 3D digital sculptures that delve into the foundational concepts of the Ethereum network. Each piece represents a core element of Ethereum—including Smart Contracts, Decentralization, Blockchain, Security, and Ether—translating complex digital principles into tangible art forms. Built for spatial computing and tokenized as one-of-one NFTs on Ethereum, the series seamlessly bridges the physical and digital realms while demonstrating the value of true digital asset ownership.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_UNVEILING_EMOTIONS_LOCATION_ID!]: {
    name: "Unveiling Emotions",
    exhibitor: "Gordon Berger",
    description: `‘Unveiling Emotions’ is a series of artworks whose meaning is hidden and can only be proven through cryptography.

Exploring abstraction and cryptography as distinct sources of artistic expression, this series goes beyond the visual realm.

Zero-Knowledge Proofs, used as an integral part of the artworks, allow us to prove information without revealing it—enabling the use of secrecy as a medium.

In this series, the artist’s intent (meaning/emotion) behind each piece is a secret, while its visual manifestation is unveiled and exhibited.

Inviting the viewers to decipher which emotion was creatively expressed through these creations, leading the audience from the seen to the unseen by shifting awareness to their ‘inner world’ and feeling what emotions these artworks manifest or provoke within themselves.

Viewers are able to submit their emotions by scanning the QR codes. 
The paradox of a verifiable truth,
where the truth in art remains subjective.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_OVERHEARD_LOCATION_ID!]: {
    name: "OH at Devcon",
    exhibitor: "Flashbots X",
    description: `How it works:

Each of these tokens grants the owner 1 tweet from the "OH at Devcon" account at x.com/OverheardX.
Please grab a token and save it for when you overhear a banger quote during the week. Once you're ready to post, simply tap the token with your phone to activate it!
The best quotes will be rewarded with extra tweets and/or bonus perks, so make sure to save your redeemed tokens after use.

Users can verify the system's integrity through certificate transparency and trusted-execution-environments (TEE) remote attestation. One post is one post, and there is no skipping of the LLM safeguard. 
OH at Devcon uses Teleport, a Flashbots X project — More information about the experiment can be found at OH.Teleport.best.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_PROOF_OF_PASSPORT_LOCATION_ID!]: {
    name: "Steal the Flag!!",
    exhibitor: "Rémi, Nico, Florent, Febryan",
    description: `"Steal the flag!!" is a gamified immersive experience that empowers users to replace a country’s flag displayed on screen with their own. We aim to gather people from different countries into this unique flag dance by channeling the most powerful of all sins: pride. Seven years ago Reddit launched the first edition of r/place; we revisited this social experiment by using the new possibilities unlocked by ZK. No information besides proof of a valid passport issued by your country is shared with the game. Each second a flag remains on screen, it increments its score by 1 point. The winner will be declared at the end of DevCon.

Organize, create alliances and betray, but most of all, engage with others.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_POLARIZER_LOCATION_ID!]: {
    name: "End to End Encryption",
    exhibitor: "Aayush Gupta",
    description: `When you look at this screen without polarized glasses, you see only a bright white display. But put on any polarized glasses — and hidden information suddenly appears. While this demonstration uses the physics of light polarization rather than true cryptography, it illustrates a key principle of modern secure communication: only those with the right "key" can decode the message. Just as these glasses unlock the screen's hidden content, encryption keys in the digital world transform scrambled data into readable information. The concept is similar to PGP encryption used in secure email, where your private key, like these special glasses, is the only thing that can reveal messages encoded with your public key.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_ZKTLS_LOCATION_ID!]: {
    name: "Hands on zkTLS",
    exhibitor: "Sachin, Richard",
    description: `In this exhibition, the viewer follows a set of detailed instructions to understand a novel cryptography scheme called zkTLS. This scheme demonstrates a simple yet elegant way to generate proofs about your web data, liberating it from the walled gardens of Web2 companies. The demo is hands-on, ensuring that users understand concepts like TLS, proxies, OAuth, authenticity, zk-SNARK proofs, signatures, and how each of these function together to complete the whole zkTLS flow.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_SOCIAL_GRAPH_VISUALIZATION_LOCATION_ID!]: {
    name: "Glimpses of Connection",
    exhibitor: "Micah Fitch, Rithikha Rajamohan",
    description: `Collective Social Graph-making at the Edges of Observability.

Mapmaking takes observations of complex, dynamic, multi-dimensional landscapes and collapses them down into low-dimensional, lo-fi representations. Just as geographical maps cannot capture the fullness of places they represent, attempts to graph social connections result in simplifications and distortions of our social realities and relationships, and yet just as geographical maps influence our movement through the world, so too do social maps carry the potential to affect our sense of social reality.
Glimpses of Connection is a social graph visualization created through mutual participation, in which pairs of conference attendees choose to upload anonymized traces of their digital connection in a way where neither is able to reveal information about the other to the graph. This collective experiment explores feedback loops between processes of legibility and the realities they represent, surfacing questions about the interplay between social sensemaking, privacy, identity, and digital agency:
How does making social connections visible transform our understanding and experience of those relationships?
What paradoxes emerge when mapping fluid, living relationships using static tools of representation?
How might our desire to preserve privacy while mapping social networks reveal deeper truths about human connection and collective identity?`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_DIGITAL_PHEROMONES_LOCATION_ID!]: {
    name: "GEND.AR",
    exhibitor: `Botao 'Amber' Hu`,
    description: `Privacy-Preserving Gender Identity Matching in Extended Reality for Spontaneous Social Encounters Using Secure Two Party Computation.

In today's increasingly gender-diverse society, spontaneous social interactions present a unique challenge: distinguishing gender identity, expression, and sexual orientation from appearance alone is both unreliable and potentially disrespectful. This creates a coordination problem where directly inquiring about such personal attributes can be intrusive, while misgendering or making incorrect assumptions can lead to uncomfortable situations and damaged social connections.

We propose GEND.AR, a speculative extended reality application that addresses this challenge. The system enables users to discover compatible individuals in their immediate vicinity (10-20 meters) without compromising personal information. Using secure two-party computation protocols over Apple's MultipeerConnectivity framework, when two users are in proximity, GEND.AR performs encrypted compatibility calculations without revealing individual preferences to anyone—including non-matching users and third parties. Upon detecting a mutual match, the interface discretely displays an animated visual indicator connecting the matched users. Non-matches receive no notification, thereby preserving privacy and preventing social awkwardness.

This design demonstrates how secure computation and extended reality can work together to facilitate authentic social connections while maintaining individual privacy and dignity in gender-inclusive spaces.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_RSA_SHIRT_LOCATION_ID!]: {
    name: "This Shirt Is a Weapon",
    exhibitor: "Tessa Maneewong",
    description: `This artifact challenges the boundaries of free speech and cryptography. Printed with RSA encryption code, this T-shirt once fell under U.S. export restrictions, classifying it as a “munition” and forbidding its display to foreign nationals. This protest piece emerged during a time when cryptography faced strict export controls, and developers questioned why algorithms could be censored like weapons.

The RSA T-shirt is more than clothing; it’s a statement on digital rights and expression. Its simple printed code symbolizes the push for open cryptographic tools, demonstrating how the power to encrypt and secure communication is essential to modern privacy. Today, it reminds us of the evolving landscape of cryptography and the rights of individuals to share and protect their ideas freely.`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_HASH_MANIFESTATION_LOCATION_ID!]: {
    name: "Hash Manifestation",
    exhibitor: "Vivek Bhupatiraju",
    description: `Hash Manifestations blend the practice of intentionally writing down hopes and dreams with modern cryptography's commit-reveal pattern. Participants share a SHA-256 hash — a unique digital fingerprint — of their aspirations, keeping the original message private until they choose to share it. When their visions materialize, they can reveal the original text, providing mathematical proof of when they first recorded their intentions. This practice makes the concept of a cryptographic hash more approachable by connecting it to personal growth and goal-setting. Tap the NFC sticker to create a hash manifestation and post it on Twitter, and quote tweet it later when you wish to reveal what you manifested!`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_CURSIVE_HISTORY_LOCATION_ID!]: {
    name: "Cursive: A Time Capsule",
    exhibitor: "Vivek Bhupatiraju",
    description: `Journey through the 2+ year evolution of Cursive’s technology by digging through a time capsule of physical artifacts from our activations. From QR codes in SBC ‘22 to our current lineup of cryptography-enabled NFC accessories, each artifact provides a snapshot of how our ideas have developed as we iterated through different features & cryptographic technologies. Ask one of the core Cursive team members (Andrew, Vivek, and Rachel) about any artifacts that pique your interest!`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_SECRET_SHARING_LOCATION_ID!]: {
    name: "How to Share a Secret",
    exhibitor: "Andrew Lu, Ais",
    description: `How can you share a secret without revealing it? Secret sharing, a technique in Multiparty Computation (MPC), allows exactly that. In this exhibit, you’ll see how private data can be split across multiple parties, each holding only a fragment that looks like meaningless noise. Individually, these pieces reveal nothing, but when brought together, the secret emerges.

This demonstration, called Visual Secret Sharing, uses an image to illustrate the concept. The image is divided into multiple "shares" that, when viewed separately, are simply random patterns. But overlay these shares, and the hidden image reappears—just as multiple parties can combine their encrypted shares to reveal a private computation’s result without anyone learning the data alone.
`,
  },
  [process.env.NEXT_PUBLIC_DEVCON_ENCRYPTION_GOD_LOCATION_ID!]: {
    name: "Infinity Loom",
    exhibitor: "IOQ",
    description: `A tapestry of endless, intertwining digital threads—a living web spun from fragments of countless lives. Each interaction is a thread, binding strangers across boundaries, ideas across time.`,
  },
};
