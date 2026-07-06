# Bible Lesson Content Statistics

## Corpus

| Metric | Value |
|---|---:|
| Lessons analyzed | 77 |
| Generated-library lessons | 74 |
| Starter top-level lessons | 3 |
| Lesson pairs compared | 2,926 |
| Bible lesson packs | 5 |

## File Group Split

| Group | Count | Percent |
|---|---:|---:|
| `public/data/bible_lessons/library/*.json` | 74 | 96.1% |
| Top-level starter lesson JSON | 3 | 3.9% |

Top-level starter lessons:

- `noahs-ark`
- `david-and-goliath`
- `daniel-in-the-lions-den`

## Structural Statistics

| Structure | Field count | Count | Percent |
|---|---:|---:|---:|
| Generated-library structure | 33 | 74 | 96.1% |
| Starter structure | 31 | 3 | 3.9% |

Generated-library lessons include `collection` and `sort_order`; starter top-level lessons do not. Otherwise, the broad lesson data model is shared.

## Length Statistics

### Text Fields

| Field | Average characters | Min | Median | Max |
|---|---:|---:|---:|---:|
| summary | 139.7 | 113 | 140 | 168 |
| tell_it | 107.8 | 76 | 106 | 199 |
| understand_it | 190.9 | 153 | 191 | 220 |
| age_5_7_explanation | 88.7 | 78 | 88 | 106 |
| age_8_11_explanation | 168.7 | 111 | 167 | 194 |
| teen_explanation | 210.3 | 143 | 209 | 236 |
| life_application | 167.2 | 151 | 167 | 179 |
| prayer_prompt | 120.2 | 80 | 121 | 135 |

### Lesson Word Counts

| Metric | Average | Min | Median | Max |
|---|---:|---:|---:|---:|
| Main text words | 212.5 | 192 | 212 | 234 |
| All content words | 382.4 | 327 | 381 | 432 |
| All content characters | 2,144.5 | 1,737 | 2,150 | 2,394 |

Reading-time estimate:

- Adult reading speed at 200 words/minute: about 1.9 minutes per lesson.
- Child/teacher aloud speed at 120 words/minute: about 3.2 minutes per lesson.

## Quiz Statistics

| Metric | Value |
|---|---:|
| Average quiz questions per lesson | 2.0 |
| Lessons with exactly 2 quiz questions | 77 |
| Multiple-choice questions | 77 |
| True/false questions | 76 |
| Fill-in-the-blank questions | 1 |

Question type distribution:

| Type | Count | Percent of quiz questions |
|---|---:|---:|
| multiple_choice | 77 | 50.0% |
| true_false | 76 | 49.4% |
| fill_blank | 1 | 0.6% |

Repeated quiz evidence:

| Pattern | Count | Percent of lessons |
|---|---:|---:|
| Generic distractor set present | 74 | 96.1% |
| True/false lesson-truth template | 74 | 96.1% |
| Repeated first-answer explanation template | 74 | 96.1% |
| Repeated true/false explanation template | 74 | 96.1% |

## Teacher Material Statistics

| Metric | Average | Min | Median | Max |
|---|---:|---:|---:|---:|
| Discussion questions per lesson | 3.0 | 3 | 3 | 3 |
| Key truths per lesson | 2.7 | 2 | 3 | 4 |
| Related lessons per lesson | 6.0 | 5 | 6 | 6 |

Repeated teacher patterns:

| Pattern | Count | Percent |
|---|---:|---:|
| Repeated discussion-question set | 74 | 96.1% |
| Repeated prayer prompt template | 74 | 96.1% |
| Repeated activity instruction template | 74 | 96.1% |
| Repeated memory prompt template | 74 | 96.1% |

## Vocabulary Statistics

| Metric | Value |
|---|---:|
| Total analyzed words | 28,590 |
| Unique words | 962 |
| Corpus type-token ratio | 0.0336 |

Top repeated non-stop words:

| Word | Count | Per 1,000 words |
|---|---:|---:|
| truth | 308 | 10.8 |
| word | 192 | 6.7 |
| faithful | 181 | 6.3 |
| following | 164 | 5.7 |
| matters | 158 | 5.5 |
| teach | 157 | 5.5 |
| thing | 154 | 5.4 |
| school | 150 | 5.2 |
| kids | 148 | 5.2 |
| main | 148 | 5.2 |

Interpretation:

The vocabulary is intentionally simple, which is good for children. The problem is that repeated meta-lesson language appears more often than story-specific language.

## Theme Statistics

Most common lesson themes:

| Theme | Lessons | Percent |
|---|---:|---:|
| obedience | 14 | 18.2% |
| trust | 12 | 15.6% |
| faith | 11 | 14.3% |
| prayer | 11 | 14.3% |
| courage | 9 | 11.7% |
| mercy | 8 | 10.4% |
| worship | 6 | 7.8% |
| wisdom | 6 | 7.8% |
| calling | 6 | 7.8% |
| leadership | 6 | 7.8% |
| jesus | 6 | 7.8% |

Most repeated key truths:

| Key truth | Count | Percent |
|---|---:|---:|
| God is faithful and His people can trust Him. | 73 | 94.8% |
| God's people can bring real needs and feelings to Him. | 10 | 13.0% |
| Faith means trusting God enough to respond. | 9 | 11.7% |
| Courage grows when we remember God is with His people. | 7 | 9.1% |
| Jesus is the promised Savior. | 6 | 7.8% |

## Pairwise Similarity Statistics

Every lesson was compared against every other lesson.

Similarity method:

- Word-set similarity: shared vocabulary.
- 5-gram similarity: shared exact phrase patterns.

| Pair group | Pair count | Word similarity min | Word avg | Word median | Word max | 5-gram min | 5-gram avg | 5-gram median | 5-gram max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Generated to generated | 2,701 | 0.703 | 0.766 | 0.766 | 0.844 | 0.333 | 0.386 | 0.385 | 0.491 |
| Generated to starter | 222 | 0.178 | 0.206 | 0.205 | 0.241 | 0.000 | 0.000 | 0.000 | 0.005 |
| Starter to starter | 3 | 0.198 | 0.235 | 0.243 | 0.264 | 0.000 | 0.000 | 0.000 | 0.001 |

Highest 5-gram similarity pairs:

| Lesson A | Lesson B | Word similarity | 5-gram similarity |
|---|---|---:|---:|
| birth-of-jesus | jesus-baptized | 0.821 | 0.491 |
| beatitudes | last-supper | 0.798 | 0.478 |
| pentecost | fruit-of-spirit | 0.806 | 0.477 |
| beatitudes | lords-prayer | 0.801 | 0.469 |
| birth-of-jesus | last-supper | 0.824 | 0.467 |
| zacchaeus | saul-converted | 0.757 | 0.467 |
| jesus-baptized | last-supper | 0.810 | 0.462 |
| jesus-baptized | gethsemane | 0.780 | 0.458 |
| beatitudes | saul-converted | 0.762 | 0.457 |
| josiah-finds-book | parable-of-sower | 0.787 | 0.456 |

Most unique nearest-neighbor results:

| Lesson | Nearest lesson | Nearest 5-gram similarity | Group |
|---|---|---:|---|
| noahs-ark | samuel-hears-god | 0.002 | Starter |
| david-and-goliath | isaac-is-born | 0.003 | Starter |
| daniel-in-the-lions-den | ruth-stays | 0.005 | Starter |
| armor-of-god | jacob-wrestles | 0.393 | Generated |
| made-in-gods-image | creation-good-world | 0.393 | Generated |

Interpretation:

Even the "most unique" generated lessons have nearest-neighbor 5-gram similarity around 0.393. The starter lessons are near zero. That is a measurable corpus split.

## Template Signal Statistics

| Signal | Lessons flagged | Percent |
|---|---:|---:|
| Repeated summary sentence | 74 | 96.1% |
| Repeated Understand It sentence | 74 | 96.1% |
| Repeated teen explanation pattern | 74 | 96.1% |
| Repeated life application template | 74 | 96.1% |
| Generic repeated quiz distractors | 74 | 96.1% |
| Repeated prayer template | 74 | 96.1% |
| Repeated activity template | 74 | 96.1% |
| Repeated discussion template | 74 | 96.1% |

Signal distribution:

| Signals | Count | Percent |
|---:|---:|---:|
| 0 | 3 | 3.9% |
| 8 | 74 | 96.1% |

## Statistical Conclusion

The data supports the claim. The lesson model is consistently structured, which is useful. But 74 of the 77 lessons also carry exact repeated prose and activity/quiz/teacher templates. That is not merely consistency. It is measurable generated-template repetition.
