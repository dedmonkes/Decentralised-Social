# Identifiers Program

## Overview

A program that handles an individual identifier for an individual and there data allowing profiles to stay decoupled from their identities. Multiple pubkeys/pdas can be associated to a certain identifier allowing individuals to hold there identity on a cold wallet while having hot wallets still represent there identifier.

The identifier has one owner pubkey that is the primary address.

Identifiers should represent any actor in the graph. This should include communties and can be achieved by delegating or owner of the identifier being a DAO governance account.

### Identifiers

Identifiers are a base58 encoded pubkey mined to have a prefix of “idX”.