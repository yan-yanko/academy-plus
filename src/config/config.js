// קונפיגורציית המערכת
const config = {
    // OpenAI API הגדרות
    api: {
        key: 'YOUR-API-KEY-HERE', // יש להחליף עם המפתח שלך
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2048
    },

    // הגדרות המערכת
    system: {
        allowedFileTypes: ['.txt', '.pdf', '.doc', '.docx'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
        defaultLanguage: 'he',
        supportedLanguages: ['he', 'en'],
    },

    // הודעות מערכת
    messages: {
        uploadSuccess: 'הקובץ הועלה בהצלחה!',
        uploadError: 'אירעה שגיאה בהעלאת הקובץ.',
        invalidFileType: 'סוג הקובץ אינו נתמך. אנא העלה קובץ מסוג PDF, TXT, DOC או DOCX.',
        fileTooLarge: 'הקובץ גדול מדי. הגודל המקסימלי המותר הוא 10MB.',
        analysisError: 'אירעה שגיאה בניתוח הסילבוס.',
        noFileSelected: 'לא נבחר קובץ להעלאה.',
        processingFile: 'מעבד את הקובץ...',
        analyzingSyllabus: 'מנתח את הסילבוס...'
    },

    // פרומפטים ל-ChatGPT
    prompts: {
        analyzeSyllabus: 'נתח את הסילבוס הבא ותן לי רשימה של אשכולות נושאים אפשריים. התשובה צריכה להיות בעברית ובפורמט הבא:\nאשכול 1\nאשכול 2\nאשכול 3',
        getOccupations: 'בהתבסס על האשכול CLUSTER, תן לי רשימה של מקצועות רלוונטיים. התשובה צריכה להיות בעברית ובפורמט הבא:\nמקצוע 1\nמקצוע 2\nמקצוע 3',
        getSkills: 'עבור המקצוע OCCUPATION, תן לי רשימה של מיומנויות נדרשות. התשובה צריכה להיות בעברית ובפורמט הבא:\nמיומנות 1\nמיומנות 2\nמיומנות 3',
        getExercises: 'עבור המיומנות SKILL, תן לי רשימה של תרגילים מומלצים. התשובה צריכה להיות בעברית ובפורמט הבא:\nשם התרגיל 1: תיאור התרגיל\nשם התרגיל 2: תיאור התרגיל\nשם התרגיל 3: תיאור התרגיל',
        getRubric: 'צור רובריקה להערכת המיומנות SKILL. התשובה צריכה להיות בעברית ובפורמט הבא:\nקריטריון 1:\n- רמה מתחילה: תיאור\n- רמה מתקדמת: תיאור\n- רמה מצוינת: תיאור\n\nקריטריון 2:\n- רמה מתחילה: תיאור\n- רמה מתקדמת: תיאור\n- רמה מצוינת: תיאור'
    }
};

export default config; 
