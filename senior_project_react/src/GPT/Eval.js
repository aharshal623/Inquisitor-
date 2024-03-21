import React, { useState } from "react";
const CommentEvaluator = () => {
  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [evaluation, setEvaluation] = useState();
  const [loading, setLoading] = useState(false);
  const apikey = "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";

  /* Helper Function - analyzeComment(String comment):
Takes in a comment from a user and outputs a JSON object containing
- "thoughtfulness" a numerical score 1-10 on the comment.
- "context" why the engine believes the comment deserves the score.

AT THIS MOMENT this function cannot utilize article context. 
Needs to access the supabase info on a given article for that which requires front end implementation.

INFO - "evaluation" as return value, is string object. Must convert using JSON.parse()
return() statement is example for how to handle async/await for the API in the context
of the comment submissions and user feedback.

*/
  const analyzeComment = async (comment) => {
    const ms2 = `Imagine this comment is in response to a nonpartisan news article: "${comment}" \n 1. Evaluate its thoughtfulness objectively on a scale from 1-10. Do not elaborate only provide a number.\n 2. Now, briefly provide context for this score.`;
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-1106",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: "Provide response as JSON" },
              { role: "user", content: ms2 },
            ],
            max_tokens: 70,
            temperature: 0,
          }),
        }
      );
      const json = await response.json();

      console.log(
        "GPT-3 Response:",
        JSON.parse(json.choices[0].message.content)
      );
      setEvaluation(json.choices[0].message.content);
    } catch (error) {
      console.error("Error analyzing comment:", error);
      setEvaluation("Failed to analyze the comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    analyzeComment(comment);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Your Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          Evaluate Comment
        </button>
      </form>
      {evaluation && <p>Evaluation: {evaluation}</p>}
    </div>
  );
};

export default CommentEvaluator;
