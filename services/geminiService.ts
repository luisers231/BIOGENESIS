import { GoogleGenAI, Type } from "@google/genai";
import { ThemeId, QuizQuestion, ActivityItem, GameShowQuestion } from '../types';

// Helper to get safe API Client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
};

// --- Content Generators ---

export const generateDefinitions = async (topic: ThemeId): Promise<ActivityItem[]> => {
  try {
    const ai = getAiClient();
    const prompt = `Genera 10 definiciones clave sobre el tema: "${topic}". 
    Devuelve un JSON con un array de objetos, donde cada objeto tiene "id" (string unico), "question" (el termino) y "answer" (la definición breve).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]') as ActivityItem[];
  } catch (e) {
    console.error("Error generating definitions:", e);
    return [];
  }
};

export const generateQuiz = async (topic: ThemeId, count: number = 20): Promise<QuizQuestion[]> => {
  try {
    const ai = getAiClient();
    const prompt = `Genera un quiz de ${count} preguntas de opción múltiple sobre "${topic}".
    Nivel: Educación secundaria/universitaria.
    Devuelve JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]') as QuizQuestion[];
  } catch (e) {
    console.error("Error generating quiz:", e);
    return [];
  }
};

export const generateGalileanosQuestion = async (topic: string): Promise<GameShowQuestion> => {
    try {
      const ai = getAiClient();
      const prompt = `Genera una pregunta estilo "100 personas dijeron" (Family Feud) relacionada con ciencias naturales, especificamente: "${topic}".
      Debe tener entre 4 y 8 respuestas posibles con puntajes que sumen 100.
      Devuelve JSON.`;
  
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answers: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    points: { type: Type.INTEGER }
                  }
                }
              }
            }
          }
        }
      });
  
      const data = JSON.parse(response.text || '{}');
      return {
          question: data.question,
          answers: data.answers.map((a: any) => ({ ...a, revealed: false }))
      };
    } catch (e) {
      console.error("Error generating galileanos:", e);
      return {
          question: "Error cargando pregunta",
          answers: []
      };
    }
  };

export const generateHangmanWord = async (topic: ThemeId): Promise<{ word: string, hint: string }> => {
    try {
        const ai = getAiClient();
        const prompt = `Dame una sola palabra (sin acentos, mayusculas) clave relacionada con: ${topic}, y una pista breve. JSON.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        word: {type: Type.STRING},
                        hint: {type: Type.STRING}
                    }
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch(e) {
        return { word: 'CIENCIA', hint: 'Estudio de la naturaleza' };
    }
}