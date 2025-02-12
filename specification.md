# Task Dragon

_A Table-top Roleplaying Game Ledger_

Task Dragon is a simple quest log intended to help TTRPG players more easily
stay focused on their goals and remember their achievements.

## Design Focus

There are plenty of TTRPG tools out there, what sets this one apart is its:

_**SIMPLICITY**_ and _**ACCESSIBILITY**_

## Requirements

- [x] User must be able to add new quests to their ledger.
- [ ] User should be able to remove quests from the ledger.
- [x] User should be able to add updates to a quest in the ledger.
- [x] Closed quests should be distinguished between completed and failed.
- [x] The ledger should group quests as: **ACTIVE**, **TO DO**, or **CLOSED**.
- [x] Quests should have categorical tags to sort their precedence: **MAIN**,
      **SIDE**, **GIG**, or **LEAD**.
- [x] Quests should be sorted based on their priority.
- [ ] User must be able to save and load their ledger to and from a file.
- [ ] User should be able to export the ledger to markdown or csv format.

## Definitions

### Data

Quest

: A goal, enterprise, or responsibility of some sort along with the _updates_
pertaining to it.

Update

: A brief entry that may be added to a quest upon learning new relevant
information.

Ledger

: A record of all quests undertaken within a TTRPG campaign.

### Quest Priority

Critical

: Cannot afford to delay resolution!

High

: Incredibly important, but not dire.

Medium

: Must be done at some point.

Low

: Handle it one day, no rush.

None

: No stress if it doesn't happen.

### Quest Status

Active

: The quest is in progress and unresolved.

To Do

: The quest has yet to be actively pursued.

Closed

: The quest has been either completed or failed.

### Quest Type

Main

: The quest is part of a central story arc.

Side

: The quest may have relevance to the central story, but otherwise is a
self-contained arc.

Gig

: More of an errand than a journey worth telling stories about; potentially
repeatable.

Lead

: A rumor or hints at a something of interest to investigate.

## Design and Implementation

Task Dragon is simple enough to be a small website with limited dependencies. A
website would be best because it is the most accessible option while also being
easy to implement.

### Technologies

- JS Runtime: [Deno](https://deno.com)
- Web Framework: [Fresh](https://fresh.deno.dev)
- Styling Framework: [Bulma](https://bulma.io)
