export function generateUniqueRandomList(min: number, max: number,
                                         length: number) {
    const tempArr: number[] = [];

    for (let i = min; i <= max; i++) {
        tempArr.push(i);
    }

    // Shuffle the array
    for (let i = tempArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = tempArr[i];
        tempArr[i] = tempArr[j];
        tempArr[j] = temp;
    }

    const randomList = tempArr.slice(0, length);

    return randomList;
}