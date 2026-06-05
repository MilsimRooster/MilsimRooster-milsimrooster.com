# Southern Translator

Static browser app for `https://milsimrooster.com/apps/southern-translator/`.

## Shape

- Southern to English translator
- English to Southern translator
- Random Southern Wisdom generator
- Search and category browser
- Copyable share text and downloadable card image
- No backend, login, database, or tracking

## Content

The app keeps content in separate modules:

- `categories.js`
- `phrases.js`
- `sayings.js`

The expanded version ships with 2,112 Southern phrase entries, 100 English-to-Southern translation entries, and 120 random wisdom entries.

Each phrase entry includes:

```js
{
  phrase,
  translation,
  explanation,
  region,
  generation,
  category,
  confidence
}
```

The app also preserves the UI-facing fields used by the current card renderer.

## Research Notes

The content is original, not copied from source collections. Research themes used for tone and structure:

- Southern phrases often rely on tone and context, especially "bless your heart": https://en.wikipedia.org/wiki/Bless_your_heart
- Phrase collections show common domains such as family, food, weather, and everyday manners: https://parade.com/living/southern-sayings
- Public discussion threads are useful for checking what feels real versus fake or forced: https://www.reddit.com/r/Appalachia/comments/1mv2egg/southern_phrases_and_sayings_give_me_all_of_them/
- Alabama foodways and rural food history: https://encyclopediaofalabama.org/article/alabama-foodways/
- Southern food terminology and foodways context: https://www.southernfoodways.org/pubtype/sfa-encyclopedia/
- Appalachian culture and outdoor/community context: https://www.arc.gov/preserving-and-promoting-our-regions-nature-and-culture/
- Common military lingo context: https://www.va.gov/VETSINWORKPLACE/docs/em_termsLingo.asp

## Validation

From `E:\games\website`:

```powershell
node tests/validate-southern-translator.mjs
npm run build
```
