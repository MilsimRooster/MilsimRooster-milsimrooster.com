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

The first version ships with 220 Southern phrase entries, 100 English-to-Southern translation entries, and 120 random wisdom entries.

## Research Notes

The content is original, not copied from source collections. Research themes used for tone and structure:

- Southern phrases often rely on tone and context, especially "bless your heart": https://en.wikipedia.org/wiki/Bless_your_heart
- Phrase collections show common domains such as family, food, weather, and everyday manners: https://parade.com/living/southern-sayings
- Public discussion threads are useful for checking what feels real versus fake or forced: https://www.reddit.com/r/Appalachia/comments/1mv2egg/southern_phrases_and_sayings_give_me_all_of_them/

## Validation

From `E:\games\website`:

```powershell
node tests/validate-southern-translator.mjs
npm run build
```
