import { useState } from "react";
import { generate } from "random-words";

const API_URL =
  "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";

export default function Home() {
  let {initialPrompt} = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState([]);
  const [inputText, setInputText] = useState("");
  const [styleText, setStyleText] = useState("");
  const [artType, setArtType] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    initialPrompt = generate(10).toString().trim(",")

    event.preventDefault();
    setLoading(true);
    try {
      setError(null); // Clear any previous errors

      const responses = await Promise.all(
        Array.from({ length: 10 }).map(async () => {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer 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",
            },
            body: JSON.stringify({
              inputs: `${inputText} in the style of:  ${styleText} painted with or in ${artType}`,
              num_inference_steps: 1200,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to generate image");
          }

          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          return imageUrl;
        })
      );

      setOutput(responses);
    } catch (error) {
      setError(error.message); // Set the error message
      console.error("Error:", error.message); // Log the error to console
    } finally {
      setLoading(false);
    }
  };
    return (
        <div className="bg-indigo-800 max-w-full min-h-screen text-center">
            <div>
                <h1 className="text-4xl font-semibold mb-4 pt-8 text-white">Generate Random Image</h1>
            </div>
            <p className="text-white">{initialPrompt}</p>
            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="inputText" className="block text-gray-700 text-sm font-semibold mb-1 text-white">
                        Art Prompt
                    </label>
                    <input
                        type="text"
                        id="inputText"
                        name="input"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your prompt here..."
                        className="w-full rounded-lg py-2 px-4 border border-gray-300 text-blue-950 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="styleText" className="block text-gray-700 text-sm font-semibold mb-1 text-white">
                        Art Style
                    </label>
                    <input
                        type="text"
                        id="styleText"
                        name="style"
                        value={styleText}
                        onChange={(e) => setStyleText(e.target.value)}
                        placeholder="Type your style here..."
                        className="w-full rounded-lg py-2 px-4 border border-gray-300 text-blue-950 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="artType" className="block text-gray-700 text-sm font-semibold mb-1 text-white">
                        Art Type
                    </label>
                    <input
                        type="text"
                        id="artType"
                        name="artType"
                        value={artType}
                        onChange={(e) => setArtType(e.target.value)}
                        placeholder="Type the art type..."
                        className="w-full rounded-lg py-2 px-4 border border-gray-300 text-blue-950 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold rounded-lg focus:outline-none"
                    >
                        Generate Art
                    </button>
                </div>
            </form>
            {error && <p className="text-red-500 font-semibold mt-2 text-center">{error}</p>}
            <div className="mt-8">
                {loading && <div className="text-center text-white">Loading...</div>}
                {!loading && output.length > 0 && (
                    <div>
                        <p className="text-2xl font-semibold mb-4 text-center text-white">Style: {styleText}</p>
                        <p className="text-2xl font-semibold mb-4 text-center text-white">Art Type: {artType}</p>
                        <div className="grid grid-cols-2 gap-4">
                            {output.map((imageUrl, index) => (
                                <div key={index} className="result-image">
                                    <img
                                        src={imageUrl}
                                        alt={`Generated Art ${index}`}
                                        className="rounded-lg w-full"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
