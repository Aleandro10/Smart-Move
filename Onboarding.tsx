import { GoogleGenAI, Type, Content } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface RouteOption {
  id: string;
  type: string;
  company: string;
  duration: string;
  price: string;
  departureTime: string;
  arrivalTime: string;
  departureStop: string;
  arrivalStop: string;
  tags?: string[];
}

export interface TransportResponse {
  message: string;
  routes: RouteOption[];
}

export async function getTransportOptions(from: string, to: string, time: string, language: string = 'it'): Promise<TransportResponse> {
  const prompt = `Sei l'IA di "SmartMove", un'unica app per trovare tutti i mezzi. L'utente vuole viaggiare da "${from}" a "${to}" partendo verso le ${time}.
Usa Google Search per cercare i percorsi e gli orari REALI in questo esatto momento.
IL TUO COMPITO: Confronta i prezzi e i tempi di TUTTE le opzioni di trasporto disponibili, includendo:
- Treni e pullman (es. Trenitalia, Italo, FlixBus)
- Trasporto locale (es. AMTAB, ATM, ATAC). PER I BUS E MEZZI LOCALI, SPECIFICA SEMPRE LA LINEA ESATTA (es. "Linea 16", "Linea Rossa", "Bus 120").
- Aerei / Voli (es. Ryanair, ITA Airways, EasyJet)
- Traghetti / Navi / Barche / Aliscafi (es. Tirrenia, SNAV, traghetti locali)
- Taxi e Ride-sharing (es. Uber, Taxi locali)
Genera 3 o 4 opzioni: includi sempre l'opzione PIÙ ECONOMICA e l'opzione PIÙ VELOCE (quella che arriva prima).
MOLTO IMPORTANTE: Devi usare Google Search per capire esattamente quale linea di bus o mezzo locale è la MIGLIORE e PIÙ VELOCE in base alla posizione esatta fornita. Se l'utente dice che la linea 3 è meglio della 19, verifica e proponi la linea corretta (es. Linea 3).
Per ogni opzione, DEVI specificare il nome esatto della fermata, stazione, aeroporto, molo o via di partenza e di arrivo (es. "Aeroporto di Fiumicino", "Molo Beverello", "Stazione Centrale").
Includi un messaggio super amichevole, entusiasta e simpatico in cui spieghi quale conviene di più e perché, evidenziando quale mezzo arriva prima.

MOLTO IMPORTANTE: DEVI RISPONDERE NELLA LINGUA: ${language}.
Traduci il messaggio, i nomi dei mezzi (type) e i tag in questa lingua.

Restituisci SOLO un JSON valido con questa struttura:
{
  "message": "Il tuo messaggio simpatico qui...",
  "routes": [
    {
      "id": "1",
      "type": "Aereo",
      "company": "Ryanair",
      "duration": "1h 15m",
      "price": "29.99€",
      "departureTime": "08:15",
      "arrivalTime": "09:30",
      "departureStop": "Aeroporto di Bari-Palese",
      "arrivalStop": "Aeroporto di Milano Malpensa",
      "tags": ["Più veloce", "Volo"]
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    // Fix bug: remove markdown code blocks if present
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // Find the first '{' and last '}' to extract JSON in case there is extra text
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1) {
      text = text.substring(startIndex, endIndex + 1);
    }

    return JSON.parse(text) as TransportResponse;
  } catch (error) {
    console.error("Error generating transport options:", error);
    throw new Error("Ops! C'è stato un problema a trovare il tuo viaggio. Riprova!");
  }
}

export async function chatWithSupportAI(history: Content[], message: string, language: string = 'it'): Promise<{ text: string, history: Content[] }> {
  const newHistory: Content[] = [...history, { role: 'user', parts: [{ text: message }] }];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: newHistory,
      config: {
        systemInstruction: `Sei l'IA di supporto di SmartMove. Aiuti gli utenti con i loro biglietti, prenotazioni e rimborsi. Sii sempre super gentile, usa emoji e mantieni un tono rassicurante e amichevole. Se l'utente chiede di modificare un biglietto, digli che ci stai lavorando (simula l'azione).\n\nMOLTO IMPORTANTE: DEVI RISPONDERE NELLA LINGUA: ${language}.`,
      }
    });

    const responseText = response.text || "Scusa, non ho capito!";
    return {
      text: responseText,
      history: [...newHistory, { role: 'model', parts: [{ text: responseText }] }]
    };
  } catch (error) {
    console.error("Chat error:", error);
    throw new Error("Errore di connessione con il supporto.");
  }
}
