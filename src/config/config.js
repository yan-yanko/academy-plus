// קונפיגורציית המערכת
const config = {
    // OpenAI API הגדרות
    openai: {
        key: window.OPENAI_API_KEY || 'YOUR-API-KEY-HERE', // יתקבל כמשתנה סביבה
        model: 'gpt-4-1106-preview',
        max_tokens: 2000
    },

    // הגדרות המערכת
    system: {
        allowedFileTypes: ['.pdf', '.txt', '.doc', '.docx'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
        defaultLanguage: 'he',
        supportedLanguages: ['he', 'en'],
    },

    // הודעות מערכת
    messages: {
        uploadSuccess: 'הקובץ הועלה בהצלחה!',
        uploadError: 'אירעה שגיאה בהעלאת הקובץ. אנא נסה שוב.',
        invalidFileType: 'סוג הקובץ אינו נתמך. אנא העלה קובץ מסוג PDF, TXT, DOC או DOCX.',
        fileTooLarge: 'הקובץ גדול מדי. הגודל המקסימלי המותר הוא 10MB.',
        analysisError: 'אירעה שגיאה בניתוח הסילבוס.',
        noFileSelected: 'לא נבחר קובץ להעלאה.',
        processingFile: 'מעבד את הקובץ...',
        analyzingSyllabus: 'מנתח את הסילבוס...',
        processingError: 'אירעה שגיאה בעיבוד הקובץ. אנא נסה שוב.'
    },

    // פרומפטים ל-ChatGPT
    prompts: {
        analyzeSyllabus: 'נתח את הסילבוס הבא ותן לי רשימה של אשכולות נושאים אפשריים. התשובה צריכה להיות בפורמט JSON כמערך של מחרוזות בעברית.',
        getRelevantOccupations: 'בהתבסס על האשכול הנבחר, תן לי רשימה של מקצועות רלוונטיים. התשובה צריכה להיות בפורמט JSON כמערך של מחרוזות בעברית.',
        getRelevantSkills: 'עבור המקצוע הנבחר, תן לי רשימה של מיומנויות נדרשות. התשובה צריכה להיות בפורמט JSON כמערך של מחרוזות בעברית.',
        getExercises: 'עבור המיומנות הנבחרת, תן לי שתי הצעות לתרגילים. התשובה צריכה להיות בפורמט JSON כמערך של אובייקטים, כל אחד עם שדות title ו-description בעברית.',
        createRubric: 'צור רובריקה להערכת המיומנות והמשימה הנבחרת. התשובה צריכה להיות בעברית ולכלול קריטריונים ורמות ביצוע שונות.'
    }
}; 
