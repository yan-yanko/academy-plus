import ui from './ui.js';
import api from './api.js';
import fileHandler from './fileHandler.js';
import config from '../../config/config.js';

class Chat {
    constructor() {
        this.currentState = 'initial';
        this.selectedCluster = '';
        this.selectedOccupation = '';
        this.selectedSkill = '';
        this.selectedExercise = '';
        
        this.initialize();
    }
    
    initialize() {
        // הגדרת מאזינים לאירועים
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        document.querySelector('.send-button').addEventListener('click', () => {
            this.sendMessage();
        });
        
        // הגדרת הטיפול באפשרויות ובהעלאת קבצים
        ui.setHandleOptionClick((action, text) => this.handleOptionClick(action, text));
        ui.setInitiateFileUpload(() => this.initiateFileUpload());
        
        // הצגת הודעת פתיחה
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        ui.addBotMessage(
            'שלום! אני עוזר הוראה מבוסס בינה מלאכותית המתמחה בזיהוי והטמעת מיומנויות תעסוקתיות בקורסים אקדמיים. ' +
            'אנתח את תוכן הקורס שלך, אזהה מיומנויות רלוונטיות לשוק העבודה, ואציע דרכים מעשיות לשילובן בהוראה שלך.'
        );
        
        setTimeout(() => {
            ui.addBotMessage(
                'בוא נתחיל מהעלאת הסילבוס שאתה מתכוון ללמד.',
                [{ text: 'העלאת סילבוס', action: 'uploadSyllabus' }]
            );
        }, 1000);
    }
    
    async sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (message) {
            ui.addUserMessage(message);
            ui.clearInput();
            
            // טיפול בהודעה בהתאם למצב הנוכחי
            await this.processUserInput(message);
        }
    }
    
    async processUserInput(message) {
        const loadingMessage = ui.addBotMessage('', null, false, true);
        
        try {
            switch (this.currentState) {
                case 'initial':
                    ui.updateLoadingMessage(loadingMessage,
                        'תודה. האם תוכל להעלות את הסילבוס כדי שנוכל להמשיך?',
                        [{ text: 'העלאת סילבוס', action: 'uploadSyllabus' }]
                    );
                    break;
                    
                default:
                    ui.updateLoadingMessage(loadingMessage,
                        'מצטער, לא הבנתי. האם תוכל להעלות את הסילבוס כדי שנוכל להמשיך?',
                        [{ text: 'העלאת סילבוס', action: 'uploadSyllabus' }]
                    );
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ui.updateLoadingMessage(loadingMessage, 'מצטער, אירעה שגיאה. אנא נסה שוב.');
        }
    }
    
    async handleOptionClick(action, text) {
        switch(action) {
            case 'uploadSyllabus':
                this.initiateFileUpload();
                break;
                
            case 'selectCluster':
                await this.handleClusterSelection(text);
                break;
                
            case 'selectOccupation':
                await this.handleOccupationSelection(text);
                break;
                
            case 'selectSkill':
                await this.handleSkillSelection(text);
                break;
                
            case 'selectExercise':
                await this.handleExerciseSelection(text);
                break;
        }
    }
    
    initiateFileUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = config.system.allowedFileTypes.join(',');
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            ui.showToast('מעלה קובץ...');
            
            try {
                const result = await fileHandler.handleFileUpload(file);
                
                if (result.success) {
                    ui.addUserMessage(`הקובץ הועלה: ${result.fileName}`);
                    ui.showToast('הקובץ הועלה בהצלחה');
                    
                    // ניתוח הסילבוס
                    await this.analyzeSyllabus(result.content);
                } else {
                    ui.showToast(result.error);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                ui.showToast(config.messages.uploadError);
            }
        };
        
        input.click();
    }
    
    async analyzeSyllabus(content) {
        const loadingMessage = ui.addBotMessage('מנתח את הסילבוס...', null, false, true);
        
        try {
            const analysis = await api.analyzeSyllabus(content);
            const clusters = this.parseAnalysis(analysis);
            
            ui.updateLoadingMessage(loadingMessage,
                'על סמך ניתוח הסילבוס שהעלית, זיהיתי מספר אשכולות מיומנויות רלוונטיים. עם איזה מהם תרצה להמשיך?',
                clusters.map(cluster => ({
                    text: cluster,
                    action: 'selectCluster'
                }))
            );
            
            this.currentState = 'selectingCluster';
        } catch (error) {
            console.error('Error analyzing syllabus:', error);
            ui.updateLoadingMessage(loadingMessage, 'מצטער, אירעה שגיאה בניתוח הסילבוס. אנא נסה שוב.');
        }
    }
    
    async handleClusterSelection(cluster) {
        this.selectedCluster = cluster;
        ui.addUserMessage(cluster);
        
        const loadingMessage = ui.addBotMessage('', null, false, true);
        
        try {
            const occupations = await api.getOccupations(cluster);
            const occupationsList = this.parseList(occupations);
            
            ui.updateLoadingMessage(loadingMessage,
                `מעולה. בחרת באשכול ${cluster}. להלן העיסוקים שרלוונטיים לאשכול שנבחר. מה העיסוק אותו נרצה לתרגל?`,
                occupationsList.map(occupation => ({
                    text: occupation,
                    action: 'selectOccupation'
                }))
            );
            
            this.currentState = 'selectingOccupation';
        } catch (error) {
            console.error('Error getting occupations:', error);
            ui.updateLoadingMessage(loadingMessage, 'מצטער, אירעה שגיאה בקבלת העיסוקים. אנא נסה שוב.');
        }
    }
    
    async handleOccupationSelection(occupation) {
        this.selectedOccupation = occupation;
        ui.addUserMessage(occupation);
        
        const loadingMessage = ui.addBotMessage('', null, false, true);
        
        try {
            const skills = await api.getSkills(occupation);
            const skillsList = this.parseList(skills);
            
            ui.updateLoadingMessage(loadingMessage,
                `מעולה. איזה כישור נרצה לפתח לעיסוק ${occupation}?`,
                skillsList.map(skill => ({
                    text: skill,
                    action: 'selectSkill'
                }))
            );
            
            this.currentState = 'selectingSkill';
        } catch (error) {
            console.error('Error getting skills:', error);
            ui.updateLoadingMessage(loadingMessage, 'מצטער, אירעה שגיאה בקבלת הכישורים. אנא נסה שוב.');
        }
    }
    
    async handleSkillSelection(skill) {
        this.selectedSkill = skill;
        ui.addUserMessage(skill);
        
        const loadingMessage = ui.addBotMessage('', null, false, true);
        
        try {
            const exercises = await api.getExercises(skill);
            const exercisesList = this.parseExercises(exercises);
            
            ui.updateLoadingMessage(loadingMessage,
                `על סמך הסילבוס, העיסוק והכישור שנבחר, להלן שתי הצעות למשימות שיאפשרו לתרגל ולפתח את הכישור ${skill}:`
            );
            
            // הצגת התרגילים
            exercisesList.forEach(exercise => {
                if (typeof exercise === 'object') {
                    ui.addBotMessage(`<b>${exercise.name}</b><br>${exercise.description}`);
                } else {
                    ui.addBotMessage(exercise);
                }
            });
            
            // הצגת אפשרויות בחירה
            ui.addBotMessage('עם איזו משימה תרצה להמשיך?',
                exercisesList.map(exercise => ({
                    text: typeof exercise === 'object' ? exercise.name : exercise.split(':')[0],
                    action: 'selectExercise'
                }))
            );
            
            this.currentState = 'selectingExercise';
        } catch (error) {
            console.error('Error getting exercises:', error);
            ui.updateLoadingMessage(loadingMessage, 'מצטער, אירעה שגיאה בקבלת התרגילים. אנא נסה שוב.');
        }
    }
    
    async handleExerciseSelection(exercise) {
        this.selectedExercise = exercise;
        ui.addUserMessage(exercise);
        
        const loadingMessage = ui.addBotMessage('', null, false, true);
        
        try {
            const rubric = await api.getRubric(exercise, this.selectedSkill);
            
            ui.updateLoadingMessage(loadingMessage,
                `להלן המחוון שיעזור לך לבדוק את המשימה "${exercise}"`
            );
            
            ui.addBotMessage(rubric);
            
            ui.addBotMessage('האם תרצה להוריד את המחוון או להעלות סילבוס נוסף?', [
                { text: 'הורד מחוון', action: 'downloadRubric' },
                { text: 'העלאת סילבוס נוסף', action: 'uploadSyllabus' }
            ]);
            
            this.currentState = 'finished';
        } catch (error) {
            console.error('Error getting rubric:', error);
            ui.updateLoadingMessage(loadingMessage, 'מצטער, אירעה שגיאה בקבלת המחוון. אנא נסה שוב.');
        }
    }
    
    parseAnalysis(analysis) {
        // המרת תשובת ה-API לרשימת אשכולות
        return analysis.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // הסרת המספור והסוגריים מריבועים
                const match = line.match(/\d+\.\s*\[?(.*?)\]?$/);
                return match ? match[1].trim() : line;
            });
    }
    
    parseList(text) {
        // המרת תשובת ה-API לרשימה
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // הסרת המספור והסוגריים מריבועים
                const match = line.match(/\d+\.\s*\[?(.*?)\]?$/);
                return match ? match[1].trim() : line;
            });
    }
    
    parseExercises(text) {
        // המרת תשובת ה-API לרשימת תרגילים
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                // הסרת המספור והפרדה בין שם התרגיל לתיאור
                const match = line.match(/\d+\.\s*\[?(.*?)\]?:\s*(.*)$/);
                if (match) {
                    return {
                        name: match[1].trim(),
                        description: match[2].trim()
                    };
                }
                return line;
            });
    }
}

// יצירת אובייקט הצ'אט והתחלת האפליקציה
const chat = new Chat(); 