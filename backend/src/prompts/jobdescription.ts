export const jobDescriptionPrompt = (jobDescription: string): string => {
    const prompt = `
    Analyze the job description to see if it is indeed a job description.
    Text: """
    Job Description: ${jobDescription}
    """

    The response will return a JSON format object. The only field in the object will be a field called "isJob".
    If the input is a job description, then set isJob to true. Otherwise, set it to false 
    `
    return prompt
};
