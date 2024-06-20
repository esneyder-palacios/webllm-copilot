import { CreateMLCEngine } from "@mlc-ai/web-llm";

class WebLLM {
    constructor(selectedModel = "Llama-3-8B-Instruct-q4f32_1-MLC") {
        this.selectedModel = selectedModel;
        this.engine = null;
    }
    progress(initProgress) {
        console.log(initProgress);
    }
    async init() {
        this.engine = await CreateMLCEngine(this.selectedModel, { initProgressCallback: this.progress });
        return this.onReady;
    };
    onReady(callback) {
        callback(this.engine);
    }
    async ask(messages = []) {
        const reply = await this.engine.chat.completions.create({
            messages,
        });
        return reply.choices[0].message;
        // console.log(reply.usage);
    }
}
/*
const messages = [
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: "Hello!" },
  ]
*/
export default { WebLLM };  
