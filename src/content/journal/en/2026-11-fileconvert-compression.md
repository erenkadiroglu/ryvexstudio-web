---
title: "How FileConvert shrinks a PDF without sending it anywhere"
description: "Without your file leaving your phone, without touching the text, and measuring what you gain: inside Compress PDF."
date: 2026-11-09
lang: en
translationKey: fileconvert-compression
tags: ["FileConvert", "how it works"]
draft: true
---

The easiest way to shrink a PDF is to upload it to a website. But that file might be a contract, a copy of an ID card or a medical report. That is why Compress PDF in FileConvert runs entirely on your phone; your file is never sent to any server.

## What takes up space in a PDF?

Text, fonts and drawings are often surprisingly small. Images are what take up space: a photo taken with a phone sits in the file at full resolution even when it looks tiny on the page.

So FileConvert first walks through every page and finds how large each image is actually drawn. What matters is not an image's pixel count but the sharpness it gives at its size on the page.

## Three levels

- **Light:** Images are not touched at all. Only lossless improvements are made.
- **Balanced:** Images sharper than 150 DPI at their size on the page are brought down to that resolution and re-encoded at 75% quality.
- **Strong:** The same at 110 DPI and 60% quality.

An image only slightly above the target is left as it is, because re-encoding it would cost more than it saves. If the new version is not smaller than the old one, the old one is kept.

## At every level

An image used several times in a document is merged into a single copy. Uncompressed data streams are compressed without loss, and unused objects are left out when saving.

Text, fonts, drawings, links and bookmarks are not touched. Text in the compressed document stays selectable and searchable.

## Nothing is skipped silently

Some kinds of images (for example JBIG2, JPEG 2000 or CMYK images made for print) cannot be safely re-encoded on a phone. FileConvert leaves them as they are and tells you on the result screen how many there were. The image does not disappear; it just does not get smaller.

The output is first written to a temporary file and moved into place only when the job succeeds. You can cancel at any moment.

## The result screen measures, it does not guess

Every number on the result is a measurement: the size before, the size after and the difference. For example, a four-page product catalogue went from 3.3 MB to 164 KB. If a file did not get smaller, FileConvert says so plainly.
