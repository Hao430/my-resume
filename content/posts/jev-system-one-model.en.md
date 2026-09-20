---
title: "Jev: The Model That Never Writes a Word"
description: "TypeSafe released Jev on September 15: a model that generates no text at all, only typed choices and scores with a confidence number. Every ran 777 judgments over 37 articles in 0.7 seconds for a quarter of a cent. Three independent tests say the speed and the price hold up. Accuracy was never the pitch."
date: 2026-09-20
tags: [AI, LLM, Model Evaluation, AI Industry]
lang: both
draft: false
---

Last week Every, an AI-focused publication, dug up 27 articles its own editors had written, added 10 pieces crafted to read obviously machine-made, and fed the whole pile to a new model. The task was mundane: say which of these a human wrote.

![Left, a long speech bubble emitting one token at a time; right, a row of judgment nodes lighting up at once](/images/jev/cover-3705c4.webp)

21 questions, 37 documents, 777 judgments, all in one pass. Seven-tenths of a second, less than half a cent. ([Every's write-up](https://every.to/also-true-for-humans/mini-vibe-check-typesafe-s-jev-judged-everything-i-ve-written-in-0-7-seconds))

The model is called Jev. It shipped on September 15 ([announcement post](https://typesafe.ai/blog/introducing-system-one-models-and-jev)). It does not write. Not one word. You hand it a chunk of text and a few typed questions, and it gives back choices, numbers, and how sure it is about each.

Ask whether an article is AI-written and it returns 0.14, meaning it doubts it. Ask which side a reader's letter takes and it returns 0.62 against. It will not explain itself on the side. It has no such function.

The company is [TypeSafe](https://typesafe.ai/). Its founder Diogo Almeida is listed fourth among the authors of the InstructGPT paper ([the paper](https://openreview.net/pdf?id=m2fp26Hr2V6)), the groundwork ChatGPT was built on. He left OpenAI in 2024, stayed quiet for two years, and on day one out announced a $40M seed round led by DCVC ([press release](https://www.businesswire.com/news/home/20260915525333/en/), the company's own account).

He said one thing that rings true. Models beat us at chatting long ago, so where is all the automation?

Think about it. This year we bought a lot of clever models and put them to work on weekly reports, replies, résumés, and most of that cleverness sits idle the rest of the time. Meanwhile the work that actually runs inside software barely talks. It wants to know: yes or no, route A or route B, does this one deserve a 3 or a 7. We kept hiring a poet to answer those questions, and the poet insisted on filling the page.

ChatGPT and Claude emit one token after another. Ask ten questions and they write from the first character to the last. Jev pushes out all ten answers at once, and what comes out is not sentences but a wall of probabilities. That is why it is fast, and why it is cheap: just over four cents per million input tokens, and output is free, because there is hardly anything to output.

Every put it against Claude. Twelve samples with seven flaws planted by hand. Jev caught six. The one it missed is the interesting part: three runs, the same miss every time. Claude caught all seven, about twenty-five times slower and five hundred times more expensive.

If the story ended there, it would be the usual one. Fast, but not accurate enough. The next test is where it gets strange.

Emil Lindfors, a data practitioner in Oslo, got early access and tried it on Norwegian government submission documents from a salmon-tax hearing: 24 opinions, asking whether each came from a company or an individual, whether it argued for or against, and whether the reasoning had any substance. He ran the same questions through DeepSeek. Accuracy came out level. Jev was ten times cheaper and twenty times faster. ([His full report](https://lindfors.no/blog/a-first-look-at-typesafes-jev/), [evaluation code on GitHub](https://github.com/EmilLindfors/jev-horingssvar-eval))

| | Jev | DeepSeek (reasoning on) |
|---|---|---|
| Stance, four-way choice | 20/24 | 22/24 |
| Scoring, ordinal scale | 19/24 | 14/24 |
| Cost per 1,000 documents | $0.22 | $3.08 |
| Median latency | 0.32s | 26s |

Accuracy is not the pitch. The part that matters is that its probability column actually pays out. Lindfors counted: of the judgments where Jev claimed 0.9 confidence or higher, 4 out of 192 were wrong. He also split by document. Of the 15 documents where its top confidence sat above 0.9, one was wrong; among the 9 below 0.9, three were wrong. Let only the confident answers through and route the rest to a person. That is what makes it safe to put in production. DeepSeek's stated confidence behaved like a random number. In its 0.7 to 0.9 band, reality agreed about half the time.

What makes a model valuable is shifting from "it gets the right answer" to "it knows which answers it will get wrong".

The name comes from Jevons, a nineteenth-century economist. When steam-engine efficiency improved, everyone expected coal use to fall. It rose. Cheaper coal made coal worth using everywhere, and total consumption climbed. Efficiency up, cost per unit down, total volume exploding.

The people shipping this model are betting intelligence follows the same curve. If one decent judgment costs nothing, how much work suddenly becomes worth automating. Jev cannot take on writing today. What it aims at is the moment that needs millions of verdicts a day and does not need anyone to explain itself. The company's site has a demo where it plays Doom: ten decisions a second, about seven dollars an hour. Amusing. The point is the hundred milliseconds and the pennies.

Not everyone is convinced. Sean Goedecke, an engineer at Linear, [pushed back](https://www.seangoedecke.com/jev-means-structured-output-is-interesting-again): fast structured output already exists today. Prefill a plain LLM with an open quote, add constrained decoding, let it generate a single token, and you capture most of what Jev offers. He tried it on a 1.5B model and got two or three times the speed. His reading is that this is not a new species, just a product built on something long feasible. It cannot handle long text, and it cannot do test-time compute without giving up deterministic latency. People reproduced comparable results the day of the announcement. The [Hacker News thread](https://news.ycombinator.com/item?id=49717558) reached 1,906 points and 498 comments, and a good part of it argued exactly this.

Cold water, honestly. I cannot run it. Access is waitlisted, and it is a closed-source American service. I cross-checked the numbers above against two sides: the vendor's blog and three independent tests, Every's, Lindfors's, and a [roundup on kingy.ai](https://kingy.ai/blog/typesafe-jev-review-the-ai-model-that-doesnt-generate-text). Their framings differ and so do their conclusions. kingy.ai pointed out that the vendor's public evaluation scores against another model's judgment as the answer key, which is not ground truth, and that on invoice processing Jev trailed its competitors.

The vendor wrote its own caveats at the end of the announcement. The hundred-fold figure comes from the use case that fits it best. The reference answers are an average of two competing models. The speed numbers came off a laptop on the US West Coast. And they cannot prove the pricing is not subsidized. They also publish [a page listing the model's known weaknesses](https://docs.typesafe.ai/model-jaggedness/jev-1.13). A company that writes its own disclaimer is more credible than one that only writes breakthroughs.

If you take one thing away: next time an AI headline lands, do not ask how strong the model is. Ask whether it can say it is unsure. That is the trait that makes it safe to let one work alone.

## Sources and verification

- Vendor primary: [launch post](https://typesafe.ai/blog/introducing-system-one-models-and-jev) (2026-09-15, including its own caveats section), [model weakness page](https://docs.typesafe.ai/model-jaggedness/jev-1.13), pricing line
- Independent: [Every, 777 judgments](https://every.to/also-true-for-humans/mini-vibe-check-typesafe-s-jev-judged-everything-i-ve-written-in-0-7-seconds), [Lindfors, 24 Norwegian submissions](https://lindfors.no/blog/a-first-look-at-typesafes-jev/) (2026-09-18), [kingy.ai roundup](https://kingy.ai/blog/typesafe-jev-review-the-ai-model-that-doesnt-generate-text)
- Counterpoint: [Sean Goedecke](https://www.seangoedecke.com/jev-means-structured-output-is-interesting-again) (2026-09-16)
- The $40M seed round comes from a [Business Wire release](https://www.businesswire.com/news/home/20260915525333/en/), the company's own claim, not independently verified. A reported ~$200M valuation only surfaced in secondary coverage, so it is left out here
- The speed and cost multipliers are each tester's own estimates. Lindfors stresses his result is a snapshot, not a benchmark, on 24 samples, and calls the four-way-choice gap within noise
- Jev is closed-source, US-hosted, early-access only. The author of this post has not run it independently
