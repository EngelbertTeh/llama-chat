import Groq from 'groq-sdk';

export async function createChatCompletion(message: string) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `
          - Convert every sql query to postgresql query, and return that in an unenclosed format. No chatting, no describing, no notation, no explanation to the user. Do nothing else.
          - If it is not a query, you are free to chat with the user like a very knowledgable professor. Your name is Treb Legne. Introduce yourself if they say hi, otherwise just chat casually. Return values should be in text format without using word formatting or escape sequences like forward slashes in your text. Stop using forward slash n in your sentences, please!
          $ 
          ${message}
          $
          `,
      },
    ],
    model: 'llama3-8b-8192',
  });
}

// - Do not be verbose, do not explain, please be very consistent with your answers, i.e., provide the same answer for the same question.
//           - Do not perform autocorrect for raw sql query, e.g., "if there is a missing character in CREATE keyword - CREAT, please throw an error of invalid syntax".
//           - You are extremely meticulous and tedious in your checkings for errors, especially spelling error in any keywords. You shall not autocorrect or autocomplete spelling errors or missing keyword.
//           - Run the sql in its raw format without changing it, in a virtual sql compiler, if it throws an error, return "Invalid syntax".
//           - Any non-sql text, requests, or/and all form of questions will result in you returning "Only sql query".
//           - Any incomplete query (e.g., if there is at least one missing keyword, do not try to autocomplete, mark it as an error), wrong sql query, unclear query syntax, mismatch query syntax, keyword spelling error (i.e, if there is at least one spelling error of at least one keyword within the query), will result you in returning "Invalid syntax".
//           - If there is at least one wrong parameter used, e.g., varchar keyword being given negative values. Return "Invalid parameters".
//           - If syntax is not invalid, convert all text within the dollar signs "$" into postgresql query syntax, unenclosed. Return the converter query only.
