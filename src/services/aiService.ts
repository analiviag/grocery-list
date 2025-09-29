export const generateRecipeFromIngredients = async (
  ingredients: string[],
  apiKey: string
): Promise<string> => {
  const prompt = `You are a helpful recipe assistant. Generate a simple and delicious recipe using ONLY the following ingredients: ${ingredients.join(
    ", "
  )}. Assume basic pantry staples like oil, salt, and pepper are available. Provide a creative title, the ingredient list, and step-by-step instructions. Format the response nicely with clear headings.`;

  const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`, // Groq uses a Bearer token
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "openai/gpt-oss-20b",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("API Error Body:", errorBody);
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    const recipeText = result.choices[0]?.message?.content;

    if (recipeText) {
      return recipeText;
    } else {
      throw new Error("The AI returned an invalid response.");
    }
  } catch (error) {
    console.error("Failed to generate recipe:", error);
    throw new Error(
      "Sorry, I couldn't generate a recipe right now. Please try again later."
    );
  }
};
