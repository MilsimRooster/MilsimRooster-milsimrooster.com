export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function createRound(challenges, roundLength, random = Math.random) {
  const length = Math.min(roundLength, challenges.length);
  return shuffle(challenges, random).slice(0, length);
}

export function createQuizSession(pack, options = {}) {
  const random = options.random || Math.random;
  const requestedLength = options.roundLength || pack.defaultRoundLength || 8;
  const round = createRound(pack.challenges, requestedLength, random);
  let currentIndex = 0;
  let answered = false;
  let correctCount = 0;
  let lastResult = null;

  function currentChallenge() {
    return round[currentIndex];
  }

  function correctChoice(challenge) {
    return challenge.choices.find((choice) => choice.correct);
  }

  return {
    pack,
    round,
    get current() {
      return currentChallenge();
    },
    get currentIndex() {
      return currentIndex;
    },
    get total() {
      return round.length;
    },
    get answered() {
      return answered;
    },
    get complete() {
      return answered && currentIndex + 1 >= round.length;
    },
    get correctCount() {
      return correctCount;
    },
    get lastResult() {
      return lastResult;
    },
    get progress() {
      return round.length === 0 ? 0 : currentIndex / round.length;
    },
    answer(choiceId) {
      if (answered) return lastResult;

      const challenge = currentChallenge();
      const choice = challenge.choices.find((item) => item.id === choiceId);
      if (!choice) {
        throw new Error(`Unknown choice: ${choiceId}`);
      }

      answered = true;
      if (choice.correct) correctCount += 1;

      lastResult = {
        challenge,
        choice,
        correct: Boolean(choice.correct),
        correctChoice: correctChoice(challenge),
        feedback: choice.correct ? challenge.explanation : choice.wrongNote
      };

      return lastResult;
    },
    next() {
      if (currentIndex + 1 >= round.length) return false;
      currentIndex += 1;
      answered = false;
      lastResult = null;
      return true;
    },
    restart() {
      return createQuizSession(pack, options);
    }
  };
}
