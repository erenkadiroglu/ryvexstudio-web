---
title: "How PerSayar recognises tiles on your phone"
description: "From one photo of a rack to 21 tiles: two-stage recognition, correction by the rules and no internet needed."
date: 2026-11-09
lang: en
translationKey: persayar-recognition
tags: ["PerSayar", "how it works"]
draft: true
---

When you take a photo of your rack in PerSayar, the photo goes nowhere. The models that find and read the tiles come inside the app and run directly on your phone, which is also why no internet connection is needed.

## First, the photo is prepared

The photo is turned the right way using the orientation your phone recorded, then scaled so its long edge is 1280 pixels. That keeps enough detail to read the tiles while keeping the work quick.

## Stage one: finding the tiles

The first model finds where each tile sits in the photo. When needed, the photo is also looked at turned 90 degrees, and overlapping boxes found for the same tile are merged into one.

If the photo was taken from far away, the tiles stay small. PerSayar then crops the area where the tiles are and searches again in that closer view.

## Stage two: reading each tile

Each tile found is cut out, made into a small square and given to the second model. This model guesses the tile's number (1 to 13, or the fake okey) and its colour (red, blue, yellow, black) separately. Together they tell which of the 53 possible tiles it is.

## Correcting by the rules

An Okey set has at most two of each tile. The models can occasionally confuse two similar tiles; if a third copy of the same tile turns up, the least certain guess is moved to its next most likely tile. That way no hand appears that could not exist in the game.

## Then the counting begins

The recognised tiles are laid out on the rack. PerSayar looks for runs and pairs by the rules, takes the okey and the indicator into account, and shows whether your hand reaches the threshold. If a tile was read wrongly, tap it to correct it or add a tile by hand.
