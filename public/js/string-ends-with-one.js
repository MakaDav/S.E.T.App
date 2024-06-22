function isLastCharacterOne(courseCode) {
    // Check if the input is a string and not empty
    if (typeof courseCode === 'string' && courseCode.length > 0) {
        // Get the last character of the string
        const lastCharacter = courseCode.charAt(courseCode.length - 1);
        // Check if the last character is '1'
        return lastCharacter === '1';
    }
    // Return false if the input is not a valid string
    return false;
}

export default isLastCharacterOne