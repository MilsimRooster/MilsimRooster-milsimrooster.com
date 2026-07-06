# Bible App Roadmap

This roadmap is ordered by launch risk, not by excitement.

## Fix Before Launch

1. **Review or hide the generated lesson library.**
   The current 77-lesson count is misleading if 74 lessons still contain template language, awkward applications, or weak distractors. Launch only reviewed content, or visibly mark unreviewed lessons as drafts outside the public path.

2. **Decide the public entry path.**
   The mission says game-first Bible learning, but live `/apps/bible-study` redirects to `/bible/`. Decide whether the public front door is Bible Study Arcade, Digital Bible, or Kids Lessons. This must be intentional before sharing widely.

3. **Fix route consistency between local and live.**
   A local static URL can show the arcade while production redirects it. That makes testing feedback unreliable. Use one deliberate public route strategy.

4. **Add content-quality validation beyond schema checks.**
   Current validation catches missing fields and broken graph references. It does not catch bad writing, bad distractors, repeated templates, clumsy theology, or awkward kid applications.

5. **Run a human theological/content review on every public lesson.**
   At minimum, review title, passage, summary, age explanations, key truths, life application, quiz answer, wrong answers, memory verse, discussion questions, prayer prompt, and related lessons.

6. **Clarify Bible version/source wording.**
   The reader has BSB and KJV local text. NIV can be linked externally, but local NIV text has licensing implications. The app should be precise about what it hosts versus links to.

7. **Mobile test the launch path on real devices.**
   Test iPhone Safari, Android Chrome, an older phone, and a large-text accessibility setting. Confirm no horizontal overflow, controls are tappable, and lesson selection does not bury the active lesson.

8. **Make the first action obvious.**
   A first-time visitor should immediately know whether to play, learn, read, or explore. Do not force users to understand the whole system.

9. **Protect elderly readability.**
   Check font size, contrast, button size, bottom chapter navigation, and scrolling behavior with older church members in mind.

10. **Add clear fallback states for failed JSON loads.**
   If lessons, graph data, or Bible text fails to load, the app should explain the problem plainly instead of leaving a blank or broken-looking page.

11. **Separate kid mode from adult depth.**
   Keep kid lesson Connections small. Bible Explorer is valuable, but it should feel like an optional adult/teacher exploration route.

12. **Tighten teacher use.**
   Teacher Notes are useful, but the teacher path needs a clear "how to run this lesson" order before launch promotion to volunteers.

13. **Define launch vocabulary.**
   Use "Bible Study Arcade" and "games and short lessons" consistently. Avoid switching between app, arcade, reader, lessons, explorer, graph, and curriculum without hierarchy.

14. **Verify deployment checks.**
   The release script previously reported an old route HEAD check issue. Launch should include clean checks for `/bible/`, `/bible/lessons/`, `/bible/explorer/`, lesson JSON, graph JSON, BSB, and KJV.

15. **Shrink public claims.**
   Do not call the 77-lesson library polished curriculum yet. Say controlled beta, church family testing, or first-wave lessons.

## Improve After Launch

1. **Rewrite the 74 generated lessons into reviewed, story-specific lessons.**
   Keep the schema, but replace generic language with real kid-friendly teaching.

2. **Create a reviewed lesson quality rubric.**
   Score each lesson for Scripture accuracy, age fit, clarity, application, quiz quality, theological safety, and classroom usefulness.

3. **Add a recommended starter path.**
   A simple "Start Here" pack can reduce choice overload for parents, kids, and volunteers.

4. **Strengthen teen mode.**
   Make teen explanations less generic, less childish, and more context-aware.

5. **Upgrade Play It from reveal cards to small interactions.**
   Matching, ordering, memory, map movement, quick rounds, and "who said it" formats should gradually replace static answer reveals.

6. **Improve teacher flow.**
   Add a concise class plan rhythm: opening question, read, explain, activity, quiz, prayer.

7. **Create printable packs.**
   Make printable output feel like a real handout rather than a webpage dump.

8. **Improve search and filters.**
   Keep filters useful but reduce the feeling of operating a database.

9. **Add small comprehension checks.**
   Let kids answer in ways that prove understanding, not only recognition.

10. **Collect playtester feedback by audience.**
   Separate feedback from kids, parents, volunteers, pastors, and older adults. They will notice different failures.

11. **Track content review status.**
   Use internal metadata for draft, reviewed, needs revision, and public-ready.

12. **Improve cross-links from reader to lessons.**
   If a user reads Daniel 6, make the related lesson easy to find without exposing a giant graph.

13. **Make graph exploration teacher-first.**
   The explorer should become an adult discovery tool, not a kid homework maze.

14. **Build better game progression.**
   Add difficulty curves and question variety without creating pressure mechanics.

15. **Use real feedback to prune, not only add.**
   Remove confusing lessons, games, filters, and labels that users do not understand.

## Save For Later

1. **Open-ended AI Bible tutor.**
   This is high risk for kids and requires a serious theological/safety review layer.

2. **Full account system.**
   Accounts add friction and privacy obligations. Avoid until a real need appears.

3. **Streaks, daily reminders, and pressure loops.**
   These conflict with the product principle.

4. **Full LMS behavior.**
   Grades, classrooms, rosters, assignments, and dashboards are not launch needs.

5. **Giant visual graph trees for kids.**
   The graph should power discovery behind the scenes.

6. **Original language tools.**
   Logos owns that lane. Not needed for children or casual church-family learning.

7. **Video streaming library.**
   BibleProject, Minno, and RightNow Media are too strong there.

8. **Denomination-specific curriculum branches.**
   Stay broadly Christian until the reviewed content base is strong.

9. **Social feeds and public leaderboards.**
   These create moderation, privacy, and comparison problems.

10. **Infinite generated question banks.**
   More questions are not better if they are shallow, repetitive, or unreviewed.

11. **Complex adaptive learning algorithms.**
   First prove that simple reviewed lessons and games work.

12. **Mobile app store release.**
   The web app needs real church testing first.

## 30-Day Practical Roadmap

### Week 1: Trust Pass

- Freeze new features.
- Pick 12 to 20 public-ready lessons.
- Human-review every public lesson.
- Remove or hide obvious generated-template lessons from the public default path.
- Verify Bible references and local reader links.
- Decide the public route hierarchy.

### Week 2: Launch Path Pass

- Test the intended first screen on phone, desktop, and older-user settings.
- Make the first action obvious.
- Confirm `/bible/`, `/bible/lessons/`, `/bible/explorer/`, and any arcade route behave the same locally and live.
- Clean up deployment checks.
- Prepare a short tester script for families and volunteers.

### Week 3: Controlled Church Test

- Test with 3 to 5 kids, 2 to 3 parents, 1 children's pastor, 1 Sunday school volunteer, 1 older adult, and 1 casual adult.
- Watch where they tap first.
- Ask what they think the app is for after 60 seconds.
- Ask which lesson or game they would use again.
- Record confusion, boring moments, and trust concerns.

### Week 4: Fix The Embarrassing Stuff

- Fix content wording that testers notice.
- Fix mobile layout issues that create resize/overflow behavior.
- Tighten labels based on what users misunderstood.
- Promote only the reviewed starter set.
- Keep the graph and generated library as internal infrastructure until reviewed.

## Launch Recommendation

Run a controlled beta, not a broad launch. Share it with known church families and teachers as a first-wave test. Do not publicly market the full lesson library as polished until the generated content is reviewed and the public route strategy matches the game-first promise.
