# Bible Lesson Content Forensics

## Verdict

The statement "74 of 77 lessons show generated-template quality" is supported by evidence.

This is not based on vibe. The corpus separates cleanly:

- 77 lessons analyzed.
- 74 lessons live under `public/data/bible_lessons/library/`.
- 3 lessons live as starter top-level lessons: `noahs-ark`, `david-and-goliath`, and `daniel-in-the-lions-den`.
- 74 lessons show all 8 measured template signals.
- The same 3 starter lessons show 0 of 8 measured template signals.

## Method

Every lesson was parsed from `public/data/bible_lessons/index.json`, then loaded from its JSON file.

The analysis compared:

- JSON field structure and field order.
- Text fields: summary, Tell It, Understand It, age explanations, life application, and prayer prompt.
- Quiz fields: type, question, choices, answer, and explanation.
- Teacher fields: discussion questions, activity, memory verse prompt, and prayer prompt.
- Theme and key truth fields.
- Pairwise similarity across every lesson pair.

Pairwise comparison count:

`77 * 76 / 2 = 2,926 lesson pairs`

The comparison used two similarity views:

- Word-set Jaccard similarity, which catches shared vocabulary.
- 5-gram Jaccard similarity, which catches repeated exact phrasing and sentence cadence.

## Template Signal Definition

A lesson was flagged for one signal when it contained one of these repeated patterns:

1. Repeated summary sentence.
2. Repeated Understand It sentence.
3. Repeated teen-mode pattern.
4. Repeated life-application template.
5. Generic repeated quiz distractors.
6. Repeated prayer template.
7. Repeated activity template.
8. Repeated discussion-question template.

Signal distribution:

| Template signals per lesson | Lesson count | Percent |
|---:|---:|---:|
| 0 | 3 | 3.9% |
| 8 | 74 | 96.1% |

There were no middle cases. That is the strongest evidence in the whole review.

## Good Consistency vs Boring Repetition

Good consistency:

- Every lesson follows the same learning ladder.
- Every lesson has Scripture, explanations, quiz questions, memory verse, discussion questions, activity, prayer prompt, tags, difficulty, and graph links.
- Every lesson has exactly 2 quiz questions and 3 discussion questions.
- The section order is predictable for kids, parents, and teachers.

Boring repetition:

- 74 lessons repeat the same summary closer.
- 74 lessons repeat the same Understand It closer.
- 74 lessons repeat the same teen-explanation cadence.
- 74 lessons repeat the same life-application sentence with only the topic swapped.
- 74 lessons reuse the same weak quiz distractors.
- 74 lessons reuse the same teacher discussion questions.
- 74 lessons reuse the same activity instruction shape.
- 73 lessons repeat the key truth "God is faithful and His people can trust Him."

The structure is good. The prose reuse is excessive.

## 1. Structural Repetition

Field-order signatures:

| Structure | Lesson count | Percent | Description |
|---|---:|---:|---|
| Generated-library structure | 74 | 96.1% | 33 fields, includes `collection` and `sort_order`, identical field order |
| Starter structure | 3 | 3.9% | 31 fields, no `collection` or `sort_order`, otherwise same lesson model |

Section count:

| Field count | Lesson count | Percent |
|---:|---:|---:|
| 33 | 74 | 96.1% |
| 31 | 3 | 3.9% |

Assessment:

This structural consistency is mostly good. The issue is not that the lesson model is consistent. The issue is that the 74 generated-library lessons also repeat exact writing patterns inside that structure.

## 2. Writing Style

Exact repeated sentences:

| Repeated sentence | Count | Field |
|---|---:|---|
| "This short lesson helps kids read, understand, and play through the passage." | 74 | `summary` |
| "This lesson keeps the main point simple: God is faithful, His Word is true, and His people can respond with faith and obedience." | 74 | `understand_it` |
| "It also asks how belief becomes action." | 74 | `teen_explanation` |
| "Teach me to trust You, listen to Your Word, and live this truth this week." | 74 | `prayer_prompt` |

Repeated cadence:

- `[Title] reminds us that God is good and we can trust Him. [Theme] matters.`
- `[Title] shows that following God is not only knowing the story. It means learning this truth: [truth].`
- `[Title] gives older students room to think about faith under pressure. The passage teaches that [truth]. It also asks how belief becomes action.`

Assessment:

This is clear generated-template behavior. The facts may be correct, but the voice is not sufficiently lesson-specific.

## 3. Life Application

Exact normalized template:

`A kid can practice this when [topic] is needed: at school, with siblings, during disappointment, or when choosing between an easy wrong thing and a harder right thing.`

Count:

| Life application pattern | Lesson count | Percent |
|---|---:|---:|
| Exact normalized template | 74 | 96.1% |
| Unique handmade application | 3 | 3.9% |

Most repeated topic slots:

| Topic slot | Count |
|---|---:|
| prayer | 6 |
| faith | 5 |
| obedience | 4 |
| courage | 3 |
| provision | 3 |
| jesus | 3 |

Examples of stronger unique applications:

- `David and Goliath`: applies courage to someone at school being picked on.
- `Daniel in the Lions' Den`: applies faithfulness to peer pressure and humility.
- `Noah's Ark`: applies obedience to honesty and unpopular choices.

Assessment:

The life-application template is the clearest proof of generated sameness. It creates awkward lines such as "when sin is needed" or "when jesus is needed." This is not just consistent; it is mechanically recycled.

## 4. Quiz Analysis

Quiz count:

| Quiz questions per lesson | Lesson count | Percent |
|---:|---:|---:|
| 2 | 77 | 100% |

Question type distribution:

| Type | Count | Percent of quiz questions |
|---|---:|---:|
| multiple_choice | 77 | 50.0% |
| true_false | 76 | 49.4% |
| fill_blank | 1 | 0.6% |

Repeated distractors:

| Distractor | Count |
|---|---:|
| "To make themselves look important" | 74 |
| "Because God forgot His people" | 74 |
| "Because obeying never matters" | 74 |

Repeated explanation templates:

| Explanation pattern | Count |
|---|---:|
| "The passage points us back to this answer: [answer]. It helps kids remember the main event and the truth it teaches." | 74 |
| "That is the plain lesson focus for this passage, stated in kid-friendly language." | 74 |

Assessment:

The quiz formula is measurable. The first quiz usually points to the main answer with three generic distractors. The second quiz usually restates the lesson truth as a true/false question. These can confirm recall, but they do not yet create enough varied learning or replay value.

## 5. Teacher Notes

Repeated discussion questions:

| Template | Count |
|---|---:|
| "What happened in [title]?" | 74 |
| "What does this passage teach us about God or following Him?" | 74 |
| "Where could this lesson help you at home, school, church, or with friends?" | 74 |

Other repeated teacher patterns:

| Pattern | Count | Percent |
|---|---:|---:|
| Prayer prompt template | 74 | 96.1% |
| Activity instruction template | 74 | 96.1% |
| Memory prompt template | 74 | 96.1% |

Assessment:

The teacher-note structure is useful. The repeated questions are not useless, but they are too generic to feel prepared for a real classroom. The best teacher notes are the handmade starter lessons because they ask story-specific questions.

## 6. Age Differentiation

Generated age-mode signals:

| Pattern set | Lesson count | Percent |
|---|---:|---:|
| All 3 generated age-mode patterns present | 74 | 96.1% |
| No generated age-mode patterns present | 3 | 3.9% |

Best age differentiation:

| Lesson | Average age-mode similarity |
|---|---:|
| david-and-goliath | 0.111 |
| daniel-in-the-lions-den | 0.138 |
| noahs-ark | 0.149 |

Worst age differentiation:

| Lesson | Average age-mode similarity |
|---|---:|
| jonah-prays | 0.311 |
| mount-carmel | 0.308 |
| lords-prayer | 0.304 |
| tower-of-babel | 0.303 |
| hannah-prays | 0.303 |

Assessment:

The generated lessons do have longer text for older ages, so they are not exact copies. But 74 lessons use the same age-mode scaffolding. The starter lessons feel more naturally differentiated.

## 7. Vocabulary Diversity

Corpus stats:

| Metric | Value |
|---|---:|
| Total analyzed words | 28,590 |
| Unique words | 962 |
| Corpus type-token ratio | 0.0336 |
| Average all-content words per lesson | 382.4 |
| Median all-content words per lesson | 381 |

Most repeated non-stop words:

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

Assessment:

The vocabulary is narrow because the template repeats the same meta-language: truth, matters, following, lesson, main, kids, school, this week. Some of that is kid-friendly. Too much of it makes different passages feel interchangeable.

## 8. Theme Diversity

Most common themes:

| Theme | Lessons | Percent |
|---|---:|---:|
| obedience | 14 | 18.2% |
| trust | 12 | 15.6% |
| faith | 11 | 14.3% |
| prayer | 11 | 14.3% |
| courage | 9 | 11.7% |
| mercy | 8 | 10.4% |

Repeated key truths:

| Key truth | Count |
|---|---:|
| "God is faithful and His people can trust Him." | 73 |
| "God's people can bring real needs and feelings to Him." | 10 |
| "Faith means trusting God enough to respond." | 9 |
| "Courage grows when we remember God is with His people." | 7 |
| "Jesus is the promised Savior." | 6 |

Assessment:

The broad themes are biblically safe, but the lessons often collapse into the same takeaway. "Trust God" is true, but 73 repeated uses of the same faithful/trust key truth weaken passage-specific learning.

## 9. Engagement Score

Engagement was scored from 6 to 30:

- Curiosity: does the lesson make the student want to know more?
- Storytelling: does it sound like a real Bible story instead of a generic summary?
- Emotional impact: does it connect to fear, courage, grief, joy, pressure, hope, or failure?
- Memorability: does the lesson have a clear specific hook?
- Replay value: would the quiz/activity feel worth repeating?
- Classroom usefulness: would a teacher have enough specific material?

Each category was scored 1 to 5. Template signals lowered the score.

Score distribution:

- Starter lessons: 28/30.
- Generated-library lessons: mostly 13/30, with a few at 14/30.

This does not mean the starter lessons are perfect. It means they are far more specific by the measured criteria.

## 10. Statistical Report

Main measurements:

| Metric | Value |
|---|---:|
| Lessons analyzed | 77 |
| Pairwise comparisons | 2,926 |
| Generated-library lessons | 74 |
| Starter top-level lessons | 3 |
| Lessons with 0 template signals | 3 |
| Lessons with 8 template signals | 74 |
| Average all-content words per lesson | 382.4 |
| Median all-content words per lesson | 381 |
| Average text-only words per lesson | 212.5 |
| Average quiz count | 2.0 |
| Average discussion-question count | 3.0 |
| Average key-truth count | 2.7 |
| Average related-lesson count | 6.0 |

Pairwise similarity:

| Pair group | Pair count | Avg word similarity | Avg 5-gram similarity |
|---|---:|---:|---:|
| generated to generated | 2,701 | 0.766 | 0.386 |
| generated to starter | 222 | 0.206 | 0.000 |
| starter to starter | 3 | 0.235 | 0.000 |

The pairwise result matters because every lesson was compared against every other lesson. Generated lessons are measurably similar to one another, while the starter lessons do not share the same exact phrase structure.

## Final Answer

Was the statement "74 of 77 lessons show generated-template quality" actually supported by evidence?

**Yes.**

The claim is supported by:

- 74 lessons with all 8 measured template signals.
- 74 repeated summary sentences.
- 74 repeated Understand It sentences.
- 74 repeated teen-mode closing sentences.
- 74 repeated life-application templates.
- 74 repeated generic quiz distractor sets.
- 74 repeated quiz explanation templates.
- 74 repeated discussion-question templates.
- 74 repeated prayer/activity/memory prompt templates.
- 2,701 generated-to-generated pairwise comparisons averaging 0.386 5-gram similarity, while starter comparisons average effectively 0.000.

The original claim was not just defensible. It was slightly understated: the 74 lessons do not merely "show generated-template quality." They share a highly measurable common template.
