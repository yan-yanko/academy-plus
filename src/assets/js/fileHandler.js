import config from '../../config/config.js';

class FileHandler {
    constructor() {
        this.allowedTypes = config.system.allowedFileTypes;
        this.maxSize = config.system.maxFileSize;
    }

    validateFile(file) {
        // בדיקת סוג הקובץ
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!this.allowedTypes.includes(fileExtension)) {
            throw new Error(config.messages.invalidFileType);
        }

        // בדיקת גודל הקובץ
        if (file.size > this.maxSize) {
            throw new Error(config.messages.fileTooLarge);
        }

        return true;
    }

    async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (fileExtension === 'pdf') {
                reader.onload = async (event) => {
                    try {
                        const pdfData = new Uint8Array(event.target.result);
                        const text = await this.extractTextFromPDF(pdfData);
                        resolve(text);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.readAsArrayBuffer(file);
            } else {
                reader.onload = (event) => {
                    resolve(event.target.result);
                };
                reader.readAsText(file);
            }

            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    async extractTextFromPDF(pdfData) {
        try {
            const pdf = await window.pdfjsLib.getDocument({ data: pdfData }).promise;
            let text = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items.map(item => item.str).join(' ');
                text += pageText + '\n';
            }

            return text;
        } catch (error) {
            console.error('Error extracting text from PDF:', error);
            throw error;
        }
    }

    async handleFileUpload(file) {
        try {
            // וידוא תקינות הקובץ
            this.validateFile(file);

            // קריאת תוכן הקובץ
            const content = await this.readFile(file);

            return {
                success: true,
                content: content,
                fileName: file.name
            };
        } catch (error) {
            console.error('File handling error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new FileHandler(); 