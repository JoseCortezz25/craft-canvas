import { NextRequest, NextResponse } from 'next/server';
import { Annotation, StateGraph } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  understandingAgentPrompt,
  uiDesignerPrompt,
  htmlGeneratorPrompt,
  jsGeneratorPrompt,
  cssGeneratorPrompt
} from '@/lib/prompts';
import { z } from 'zod';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Function to safely extract code from the content that might contain markdown
const safeExtractCode = (content: string): string => {
  if (!content) return '';

  // Remove markdown code block delimiters
  return content
    .replace(/^```(html|css|javascript|js)$/gm, '') // Remove opening tags
    .replace(/^```$/gm, '') // Remove closing tags
    .trim(); // Remove excess whitespace
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.error('API route error: GOOGLE_API_KEY is not set.');
      return NextResponse.json(
        { error: 'Server configuration error: API key missing.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const prompt = body.prompt;

    const StateAnnotation = Annotation.Root({
      requestUser: Annotation<string>,
      requirements: Annotation<string>,
      outputHTML: Annotation<string>,
      outputCSS: Annotation<string>,
      outputJS: Annotation<string>,
      instructionsHTMLAgent: Annotation<string>,
      instructionsCSSAgent: Annotation<string>,
      instructionsJSAgent: Annotation<string>,
      instructionsUIAgent: Annotation<string>,
      instructionsUXAgent: Annotation<string>,
      outputUIDesignerAgent: Annotation<string>,
      outputUXWriterAgent: Annotation<string>
    });

    // Models
    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash',
      temperature: 0,
      maxRetries: 2,
      apiKey: process.env.GOOGLE_API_KEY
    });

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY
    });

    const AgentInstructionsSchema = z.object({
      html: z
        .string()
        .describe('Instructions for the HTML structure and elements.'),
      css: z
        .string()
        .describe(
          'Instructions for the CSS styling, layout, and responsiveness.'
        ),
      js: z
        .string()
        .describe(
          'Instructions for the JavaScript interactivity and client-side logic.'
        ),
      ui: z
        .string()
        .describe(
          'Instructions for the UI agent regarding visual design and component appearance.'
        ),
      ux: z
        .string()
        .describe(
          'Instructions for the UX agent regarding user flow, accessibility, and interaction.'
        )
    });

    const AgentIntegratorSchema = z.object({
      html: z
        .string()
        .describe(
          'Final HTML instructions/code derived from user requirements, UI design blueprint, and UX writer inputs.'
        ),
      css: z
        .string()
        .describe(
          'Final CSS instructions/code (Tailwind preferred) derived from user requirements, UI design blueprint, and UX writer inputs.'
        ),
      js: z
        .string()
        .describe(
          'Final JavaScript instructions/code for interactivity, derived from user requirements, UI design blueprint, and UX writer inputs.'
        )
    });

    // Agents
    async function understandingAgent(state: typeof StateAnnotation.State) {
      const understandingAgent = understandingAgentPrompt.pipe(llm);
      const requirements = await understandingAgent.invoke({
        requestUser: state.requestUser
      });

      return { requirements: requirements.content };
    }

    async function planningAgent(state: typeof StateAnnotation.State) {
      const { object: instructions } = await generateObject({
        model: google('models/gemini-2.0-flash'),
        schema: AgentInstructionsSchema,
        prompt: `Actúa como un estratega senior en desarrollo de aplicaciones. 
        Tu haces parte de un equipo que consiste en trabajar en conjunto para desarrollar una web app solo con HTML, CSS y JavaScript. Cada agente se encarga de una area diferente.
        Tu misión es crear un plan detallado que asigne tareas específicas y destinadas a que desarrollen la parte correspondiente a los agentes HTML, CSS, JS, UI y UX.
        El plan debe estar basado en los requerimientos proporcionados.
        
        Requerimientos:
        ${state.requirements}

        Instrucciones importantes:
        - No hagas preguntas. Si la información es incompleta, añade items que consideres que pueden sustituir tus dudas.
        - La respuesta debe ser clara, detallada, profesional y técnica.
        - El plan debe estar muy detallado, mencionando detalles técnicos específicos para cada agente.
        - Las instrucciones deben estar destinadas a que los agentes puedan construir un producto de software en su respectivo campo.
        `
      });

      const { html, js, css, ui, ux } = instructions;

      console.log('[ Vercel AI SDK Instructions ]', instructions);

      return {
        instructionsHTMLAgent: html,
        instructionsJSAgent: js,
        instructionsCSSAgent: css,
        instructionsUIAgent: ui,
        instructionsUXAgent: ux
      };
    }

    async function uiDesignerAgent(state: typeof StateAnnotation.State) {
      const uiDesignerAgentLLM = uiDesignerPrompt.pipe(llm);
      const requirements = await uiDesignerAgentLLM.invoke({
        instructions: state.instructionsUXAgent
      });

      return { outputUIDesignerAgent: requirements.content };
    }

    async function uxWriterAgent(state: typeof StateAnnotation.State) {
      const uxWriterAgentLLM = uiDesignerPrompt.pipe(llm);
      const requirements = await uxWriterAgentLLM.invoke({
        instructions: state.instructionsUIAgent
      });

      return { outputUXWriterAgent: requirements.content };
    }

    async function integratorAgent(state: typeof StateAnnotation.State) {
      const { outputUIDesignerAgent, outputUXWriterAgent, requestUser } = state;

      const { object: instructions } = await generateObject({
        model: google('models/gemini-2.0-flash'),
        schema: AgentIntegratorSchema,
        prompt: ` Eres un Agente Integrador especializado en consolidar información de diseño de interfaces y contenido textual para aplicaciones web.
          Tu tarea es fusionar los aportes del UI Designer y del UX Writer en un conjunto coherente de requerimientos, listos para ser utilizados por los agentes generadores de código: HTML, CSS y JavaScript.

          **Contexto**:
          - **UI Designer**: Profesional responsable de la estética y disposición de la interfaz de usuario. Define la estructura visual, paleta de colores, tipografía, componentes interactivos y su comportamiento, asegurando una experiencia intuitiva y atractiva para el usuario.
          - **UX Writer**: Especialista en contenido que se centra en la creación de textos claros y útiles dentro de la interfaz. Su objetivo es guiar al usuario a través de la aplicación mediante microcopias efectivas, mensajes de error comprensibles y etiquetas intuitivas.


          **Indicaciones del UI Designer**
          ${outputUIDesignerAgent}

          **Indicaciones del UX Writer**
          ${outputUXWriterAgent}

          **Contexto del requerimiento del usuario**
          ${requestUser}

          **Expectativa**:

          Tu salida debe estar organizada en tres bloques principales:

          1. **html_instructions**:
            - Para cada sección y componente, describe su propósito y estructura.
            - Sugiere etiquetas HTML semánticas apropiadas.
            - Incluye el texto asociado proporcionado por el UX Writer (títulos, descripciones, botones, etc.).

          2. **css_instructions**:
            - Especifica estilos visuales basados en la paleta de colores, tipografía, tamaños y espaciados definidos por el UI Designer.
            - Detalla los estados de interacción como 'hover', 'focus', 'disabled', etc.

          3. **js_instructions**:
            - Describe los comportamientos funcionales, incluyendo interacciones, animaciones, validaciones y navegación.
            - Indica eventos disparadores y comportamientos esperados para cada componente interactivo.

          **Consideraciones**:

          - Asegúrate de que la información esté armonizada, sin duplicidades ni contradicciones.
          - Proporciona detalles claros y específicos para que los agentes de generación de código trabajen sin ambigüedades.
          - Mantén una estructura consistente y utiliza terminología estándar en la industria para facilitar la comprensión y aplicación de los requerimientos.

          Tu objetivo es garantizar que el producto final sea coherente, funcional y alineado con las especificaciones de diseño y contenido establecidas.
          `
      });

      const { html, css, js } = instructions;

      return {
        instructionsHTMLAgent: html,
        instructionsCSSAgent: css,
        instructionsJSAgent: js
      };
    }

    async function htmlDeveloperAgent(state: typeof StateAnnotation.State) {
      const htmlDeveloperLLM = htmlGeneratorPrompt.pipe(llm);
      const outputHTML = await htmlDeveloperLLM.invoke({
        uiDesignerInstructions: state.outputUIDesignerAgent,
        uxWriterOutput: state.outputUXWriterAgent,
        planningAgentOutput: state.instructionsHTMLAgent
      });

      return { outputHTML: outputHTML.content };
    }

    async function cssDeveloperAgent(state: typeof StateAnnotation.State) {
      const cssDeveloperLLM = cssGeneratorPrompt.pipe(llm);
      const outputCSS = await cssDeveloperLLM.invoke({
        uiDesignerInstructions: state.outputUIDesignerAgent,
        uxWriterOutput: state.outputUXWriterAgent,
        planningAgentOutput: state.instructionsCSSAgent,
        htmlGeneratorOutput: state.outputHTML
      });

      return { outputCSS: outputCSS.content };
    }

    async function jsDeveloperAgent(state: typeof StateAnnotation.State) {
      const jsDeveloperLLM = jsGeneratorPrompt.pipe(llm);
      const outputJS = await jsDeveloperLLM.invoke({
        uiDesignerInstructions: state.outputUIDesignerAgent,
        uxWriterOutput: state.outputUXWriterAgent,
        planningAgentOutput: state.instructionsJSAgent,
        htmlGeneratorOutput: state.outputHTML
      });

      return { outputJS: outputJS.content };
    }

    const chain = new StateGraph(StateAnnotation)
      .addNode('understandingAgent', understandingAgent)
      .addNode('planningAgent', planningAgent)
      .addNode('uxWriterAgent', uxWriterAgent)
      .addNode('uiDesignerAgent', uiDesignerAgent)
      .addNode('integratorAgent', integratorAgent)
      .addNode('htmlDeveloperAgent', htmlDeveloperAgent)
      .addNode('cssDeveloperAgent', cssDeveloperAgent)
      .addNode('jsDeveloperAgent', jsDeveloperAgent)

      .addEdge('__start__', 'understandingAgent')
      .addEdge('understandingAgent', 'planningAgent')

      // Parallel UI/UX design phase
      .addEdge('planningAgent', 'uxWriterAgent')
      .addEdge('planningAgent', 'uiDesignerAgent')

      // Integration phase (depends on both UI and UX)
      .addEdge('uiDesignerAgent', 'integratorAgent')
      .addEdge('uxWriterAgent', 'integratorAgent')

      // HTML generation phase (depends on integration)
      .addEdge('integratorAgent', 'htmlDeveloperAgent')

      // Parallel CSS/JS generation phase (depends on HTML)
      .addEdge('htmlDeveloperAgent', 'cssDeveloperAgent')
      .addEdge('htmlDeveloperAgent', 'jsDeveloperAgent')

      // End state (depends on both CSS and JS)
      .addEdge('cssDeveloperAgent', '__end__')
      .addEdge('jsDeveloperAgent', '__end__')

      .compile();

    const state = await chain.invoke({ requestUser: prompt });

    // Clean the output code to remove markdown code block delimiters
    const cleanedHtml = safeExtractCode(state.outputHTML);
    const cleanedCss = safeExtractCode(state.outputCSS);
    const cleanedJs = safeExtractCode(state.outputJS);

    // Return the final generated code
    return NextResponse.json({
      html: cleanedHtml,
      css: cleanedCss,
      js: cleanedJs
    });
  } catch (error) {
    console.error('[API Generate Error - Request Level]', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Optional: GET handler
export async function GET() {
  return NextResponse.json({
    message:
      'Generate API endpoint (LangGraph) is active. Use POST with a { "prompt": "your prompt" } body.'
  });
}
