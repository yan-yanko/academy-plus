import config from '../../config/config.js';

class API {
    constructor() {
        this.apiKey = config.api.key;
        this.endpoint = config.api.endpoint;
        this.model = config.api.model;
        this.temperature = config.api.temperature;
        this.maxTokens = config.api.maxTokens;
    }
    
    async makeRequest(prompt) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: 'אתה עוזר הוראה מומחה בזיהוי והטמעת מיומנויות תעסוקתיות בקורסים אקדמיים.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: this.temperature,
                    max_tokens: this.maxTokens
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    async analyzeSyllabus(content) {
        const prompt = config.prompts.analyzeSyllabus.replace('CONTENT', content);
        return this.makeRequest(prompt);
    }
    
    async getOccupations(cluster) {
        const prompt = config.prompts.getOccupations.replace('CLUSTER', cluster);
        return this.makeRequest(prompt);
    }
    
    async getSkills(occupation) {
        const prompt = config.prompts.getSkills.replace('OCCUPATION', occupation);
        return this.makeRequest(prompt);
    }
    
    async getExercises(skill) {
        const prompt = config.prompts.getExercises.replace('SKILL', skill);
        return this.makeRequest(prompt);
    }
    
    async getRubric(exercise, skill) {
        const prompt = config.prompts.getRubric
            .replace('EXERCISE', exercise)
            .replace('SKILL', skill);
        return this.makeRequest(prompt);
    }
}

export default new API(); 