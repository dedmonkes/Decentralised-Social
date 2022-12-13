# Identifiers Program

## Overview

A program that handles an individual identifier for an individual and there data allowing profiles to stay decoupled from their identities. Multiple pubkeys/pdas can be associated to a certain identifier allowing individuals to hold there identity on a cold wallet while having hot wallets still represent there identifier.

The identifier has one owner pubkey that is the primary address.

Identifiers should represent any actor in the graph. DAO can be represented in the graph by being owned by a pda of a program.

### Identifiers

Identifiers are a base58 encoded pubkey mined to have a prefix of “id”.

Delegation can be used to abstract away the use of mulitple wallet for any program that implementes the protocol, we use this idea in align to stake nfts from any account.

### Owner Record
And owner record account can be created for any identifier but must verified from the main owner key before being trusted by programs. Once ownership has been verified a program can assert its relationship to the identifier and other associated address and treat them as one idenity.