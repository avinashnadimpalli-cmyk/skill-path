import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing GEMINI_API_KEY environment variable' },
      { status: 500 }
    );
  }

  try {
    const { resume, targetJob } = await req.json();

    const prompt = `
      You are an elite, highly critical technical Recruiter and Career Architect.
      Analyze the user's raw resume/experience profile against the industry expectations for the target role: "${targetJob}".

      Tasks:
      1. Identify the 3 most critical, realistic skill gaps they have for this exact role.
      2. Calculate a strict, realistic match score (0-100) based on their background.
      3. Build a targeted 4-week learning curriculum to bridge those exact gaps.

      User Resume/Experience Profile:
      ${resume}
    `;

    const response = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER },
            gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  focus: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  project: { type: Type.STRING },
                  resourceSearchQuery: { type: Type.STRING },
                },
                required: ['weekNumber', 'focus', 'skills', 'project', 'resourceSearchQuery'],
              },
            },
          },
          required: ['matchScore', 'gaps', 'weeks'],
        },
      },
    });

    let data;
    try {
      // Prefer `response.text` but fall back to `candidates[].content.parts` if present
      let rawText = '';
      if (response && (response as any).text) {
        rawText = (response as any).text;
      } else if (response && (response as any).candidates && (response as any).candidates.length) {
        const parts = (response as any).candidates[0].content.parts || [];
        rawText = parts.map((p: any) => p.text || '').join('');
      }

      console.log('RAW AI RESPONSE TEXT:', rawText);

      data = JSON.parse(rawText);
      return NextResponse.json(data);
    } catch (parseErr) {
      console.error('Failed to parse AI response as JSON:', parseErr);
      console.error('Raw text was:', response.text);
      return NextResponse.json({ error: 'AI returned non-JSON response', raw: response.text }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    // Surface underlying API error details when available to help debugging
    const message = (error && (error as any).message) ? (error as any).message : 'AI Synthesis Failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
