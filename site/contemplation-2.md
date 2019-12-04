---
prev: ./contemplation-1
next: ./contemplation-3
---

# Contemplation 2

## Introduction

This contemplation explores the sentiment of Kandinsky's writing, specifically from his two major publications. In order to achieve these visualizations digital versions of the book were run against Google's [Natural Language API](https://cloud.google.com/natural-language/#natural-language-api-demo). The returned data is then parsed in real-time below. This deconstructed view of the text offers a different approach to look at and appreciate Kandinsky's writing. It by no means is a substitute. However, in conjunction with his visual paintings offers a first step towards bridging and ultimately codifying his writing to his paintings.

## The Contemplation

<br />

__Concerning the Spiritual in Art__, 2019.

<br />

<Contemplation sketch="/src/2-sentiment-analysis-on-the-spiritual-in-art.js" :params="{ overdraw: true }"></Contemplation>

Animation visualizing sentiment of each sentence from _Concerning the Spiritual in Art_, 1911. Red colors denote positive sentiment, blue colors denote negative sentiment. Each circle is a sentence. The size represents a compound of both the intensity of the sentiment and the length of the sentence. The sentences move from left-to-right and top-to-bottom. A dark gray line connects all the sentences together.

<br />

__Point and Line to Plane__, 2019.

<br />

<Contemplation sketch="/src/2-sentiment-analysis-point-and-line-to-plane.js" :params="{ overdraw: true }"></Contemplation>

Animation visualizing sentiment of each sentence from _Point and Line to Plane_, 1926. Red colors denote positive sentiment, blue colors denote negative sentiment. Each circle is a sentence. The size represents a compound of both the intensity of the sentiment and the length of the sentence. The sentences move from left-to-right and top-to-bottom. A dark gray line connects all the sentences together.^[Source code for this contemplation can be found here: [link](/src/2-sentiment-analysis-on-the-spiritual-in-art.js)]

<br />
