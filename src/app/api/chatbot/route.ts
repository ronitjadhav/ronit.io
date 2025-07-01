import { NextRequest, NextResponse } from 'next/server';
import faqData from '@/data/faq-data.json';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  suggestions?: string[];
}

interface FAQData {
  faqs: FAQ[];
  context: string;
  personality: string;
  expertise_areas: string[];
}

// Rate limiting storage (in production, use Redis or a database)
const rateLimitMap = new Map();

// Rate limiting function
function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }

  const requests = rateLimitMap.get(identifier);
  const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart);

  if (recentRequests.length >= limit) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 },
      );
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(clientIP, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    // Check if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback to simple FAQ matching
      const result = await getFallbackResponse(message);
      return NextResponse.json(result);
    }

    // Use Gemini API
    const result = await getGeminiResponse(message, apiKey);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 },
    );
  }
}

async function getGeminiResponse(
  message: string,
  apiKey: string,
): Promise<{ response: string; suggestions?: string[] }> {
  try {
    const prompt = `${faqData.context}

PERSONALITY: ${faqData.personality}

EXPERTISE AREAS: ${faqData.expertise_areas.join(', ')}

COMPREHENSIVE FAQ KNOWLEDGE:
${faqData.faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}\nSuggestions: ${faq.suggestions?.join(' | ') || 'N/A'}`).join('\n\n')}

USER QUESTION: "${message}"

INSTRUCTIONS:
1. Answer based on the FAQ knowledge above
2. Use the personality guidelines to maintain consistent tone
3. If the question relates to any expertise area, provide detailed, helpful information
4. For technical questions, explain concepts clearly but don't oversimplify
5. If question is unrelated to Ronit's professional profile, politely redirect
6. Keep responses conversational but professional
7. Highlight relevant expertise areas when appropriate
8. If asked about specific projects, mention technologies used
9. For general questions, encourage further specific questions
10. Always maintain enthusiasm for geospatial technology and open-source solutions

Provide a helpful, accurate response (max 150 words). Do not include any formatting labels in your response.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
            stopSequences: [],
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error details:', errorData);
      throw new Error(
        `Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`,
      );
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const fullResponse = data.candidates[0].content.parts[0].text.trim();

      // Clean up any potential formatting artifacts
      let cleanResponse = fullResponse;

      // Remove any remaining RESPONSE: or SUGGESTIONS: labels
      cleanResponse = cleanResponse.replace(/^RESPONSE:\s*/i, '');
      cleanResponse = cleanResponse.replace(/\s*SUGGESTIONS:.*$/i, '');

      // Find relevant suggestions based on the user question and response
      const suggestions = findRelevantSuggestions(message, cleanResponse, faqData as FAQData);

      return { response: cleanResponse, suggestions };
    } else {
      console.error('Invalid Gemini response structure:', data);
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to enhanced FAQ matching
    return getFallbackResponse(message);
  }
}

function findRelevantSuggestions(
  userMessage: string,
  aiResponse: string,
  faqData: FAQData,
): string[] {
  const lowerMessage = userMessage.toLowerCase();
  const lowerResponse = aiResponse.toLowerCase();

  // Keywords to suggest related topics
  const topicKeywords = {
    current_role: ['camptocamp', 'current', 'job', 'work', 'role', 'position'],
    technologies: ['tech', 'programming', 'languages', 'tools', 'frameworks'],
    projects: ['project', 'work', 'portfolio', 'built', 'created'],
    experience: ['experience', 'career', 'background', 'history'],
    education: ['education', 'study', 'degree', 'university'],
    contact: ['contact', 'email', 'hire', 'freelance'],
    gis: ['gis', 'mapping', 'spatial', 'qgis', 'arcgis'],
    services: ['services', 'offer', 'consulting', 'available'],
  };

  // Find the best matching FAQ for suggestions
  let bestMatches: FAQ[] = [];

  for (const faq of faqData.faqs) {
    let relevanceScore = 0;

    // Check if FAQ topic is related to the current conversation
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      const messageHasKeywords = keywords.some(
        (keyword) => lowerMessage.includes(keyword) || lowerResponse.includes(keyword),
      );
      const faqHasKeywords = keywords.some(
        (keyword) =>
          faq.question.toLowerCase().includes(keyword) ||
          faq.answer.toLowerCase().includes(keyword),
      );

      if (messageHasKeywords && faqHasKeywords) {
        relevanceScore += 1;
      }
    });

    if (relevanceScore > 0 && faq.suggestions) {
      bestMatches.push(faq);
    }
  }

  // If we found relevant FAQs, use their suggestions
  if (bestMatches.length > 0) {
    const allSuggestions = bestMatches.flatMap((faq) => faq.suggestions || []);
    // Remove duplicates and return first 3
    return [...new Set(allSuggestions)].slice(0, 3);
  }

  // Fallback: return general suggestions
  return [
    "What is Ronit's current role and company?",
    'What notable projects has he worked on?',
    'How can I contact Ronit?',
  ];
}

async function getFallbackResponse(
  message: string,
): Promise<{ response: string; suggestions?: string[] }> {
  const lowerMessage = message.toLowerCase();

  // Enhanced keyword matching for FAQ with multiple keywords per question
  const keywordMap = {
    camptocamp: ['current', 'job', 'work', 'company', 'role', 'position'],
    education: ['study', 'degree', 'university', 'college', 'school', 'master', 'msc'],
    technologies: ['tech', 'tools', 'programming', 'languages', 'frameworks', 'skills'],
    projects: ['project', 'work', 'portfolio', 'built', 'created', 'developed'],
    contact: ['contact', 'email', 'reach', 'hire', 'message'],
    experience: ['experience', 'career', 'history', 'background', 'timeline'],
    gis: ['gis', 'mapping', 'maps', 'geospatial', 'spatial', 'qgis', 'arcgis'],
    freelance: ['freelance', 'consulting', 'available', 'hire', 'services'],
    location: ['germany', 'berlin', 'where', 'location', 'based'],
    interests: ['hobbies', 'interests', 'personal', 'chess', 'dance', 'f1', 'potter'],
  };

  // Find the best matching FAQ based on keywords
  let bestMatch: FAQ | null = null;
  let maxScore = 0;

  for (const faq of (faqData as FAQData).faqs) {
    let score = 0;
    const questionWords = faq.question.toLowerCase().split(' ');
    const answerWords = faq.answer.toLowerCase().split(' ');

    // Check for direct keyword matches in question and answer
    questionWords.forEach((word) => {
      if (word.length > 3 && lowerMessage.includes(word)) {
        score += 3;
      }
    });

    // Check for semantic keyword matches
    Object.entries(keywordMap).forEach(([topic, keywords]) => {
      const topicInMessage = keywords.some((keyword) => lowerMessage.includes(keyword));
      const topicInFAQ = keywords.some(
        (keyword) =>
          faq.question.toLowerCase().includes(keyword) ||
          faq.answer.toLowerCase().includes(keyword),
      );

      if (topicInMessage && topicInFAQ) {
        score += 2;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatch = faq;
    }
  }

  if (bestMatch && maxScore > 1) {
    return {
      response: bestMatch.answer,
      suggestions: bestMatch.suggestions,
    };
  }

  // Enhanced greeting responses
  if (
    lowerMessage.includes('hello') ||
    lowerMessage.includes('hi') ||
    lowerMessage.includes('hey')
  ) {
    return {
      response:
        "Hello! 👋 I'm Ronit's AI assistant, here to help you learn about his work in geospatial development and software engineering. Feel free to ask about his projects, skills, experience at Camptocamp, or anything else related to his professional background!",
      suggestions: [
        "What is Ronit's current role and company?",
        'What technologies does he work with?',
        'What notable projects has he worked on?',
      ],
    };
  }

  // Help/guidance responses
  if (
    lowerMessage.includes('help') ||
    lowerMessage.includes('what can') ||
    lowerMessage.includes('tell me')
  ) {
    return {
      response:
        'I can help you learn about Ronit Jadhav! Ask me about: 🗺️ His geospatial expertise (QGIS, OpenLayers, GIS) 💻 Programming skills (Python, JavaScript, TypeScript) 🏢 Current role at Camptocamp 🚀 Projects like Digipin, QGIS Hub Plugin 🎓 Education and career journey 📧 How to get in touch. What interests you most?',
      suggestions: [
        'Who is Ronit Jadhav?',
        'What makes him unique as a developer?',
        'How can I contact Ronit?',
      ],
    };
  }

  // Default intelligent response with suggestions
  return {
    response:
      "I'm here to share information about Ronit Jadhav's professional background! You can ask me about his work at Camptocamp, his expertise in geospatial technologies, specific projects he's worked on, his education, or how to contact him. What would you like to know? 🤔",
    suggestions: [
      'Who is Ronit Jadhav?',
      "What is Ronit's current role and company?",
      'What technologies does he work with?',
    ],
  };
}
