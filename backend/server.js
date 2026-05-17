import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Content Generator Backend Running...");
});

app.post("/generate", async (req, res) => {
  try {
    const { productName } = req.body;

   const prompt = `
Generate professional marketing content for this product:

Product Name: ${productName}

STRICT RULES:
- NEVER invent technical specifications.
- NEVER mention processor names, GPU names, RAM, SSD, display refresh rate, battery, dimensions, ports, or hardware details.
- If specifications are unknown, keep the description generic and marketing-focused.
- Keep output realistic, premium, and professional.
- Do NOT use markdown (** or ###).

Return in EXACTLY this format:

PRODUCT DESCRIPTION:
(Short premium marketing description)

MARKETING HOOKS:
- Hook 1
- Hook 2
- Hook 3
- Hook 4
- Hook 5

INSTAGRAM CAPTION:
(Engaging short caption with emojis)

HASHTAGS:
#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8

AD COPY:
(Short persuasive ad copy with CTA)
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-oss-20b:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    

    res.json({
      result:
        response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});