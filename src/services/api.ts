import ILevelModel from '@models/ILevelModel';
import throwError from '@utils/helpers/throwError';

const baseUrl = new URL(
    'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/ee4dc7be8759183c549b49bc895e6004fc0f05a2/',
);

export const LevelDifficulty: Record<number, string> = {
    0: 'data/wordCollectionLevel1.json',
    1: 'data/wordCollectionLevel2.json',
    2: 'data/wordCollectionLevel3.json',
    3: 'data/wordCollectionLevel4.json',
    4: 'data/wordCollectionLevel5.json',
    5: 'data/wordCollectionLevel6.json',
};

const getLevels = async (
    difficulty: keyof typeof LevelDifficulty,
): Promise<ILevelModel> => {
    const difficultyPath = LevelDifficulty[difficulty];
    if (difficultyPath) {
        const url = new URL(difficultyPath, baseUrl);
        return fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data: ILevelModel) => {
                data.rounds.forEach(({ levelData, words }) => {
                    levelData.imageSrc = new URL(
                        `images/${levelData.imageSrc}`,
                        baseUrl,
                    ).toString();
                    levelData.cutSrc = new URL(
                        `images/${levelData.cutSrc}`,
                        baseUrl,
                    ).toString();
                    words.forEach((word) => {
                        word.audioExample = new URL(
                            word.audioExample,
                            baseUrl,
                        ).toString();
                    });
                });
                return data;
            })
            .catch((e: Error): never => {
                throw e;
            });
    }
    return throwError('No such difficulty');
};

export default getLevels;
