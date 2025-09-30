declare module '*.md' {
    const content: string
    export default content
}

// Разрешаем импорты через inline raw-loader (например, '!!raw-loader!../../RESUME.md')
declare module '!!raw-loader!*' {
    const content: string
    export default content
}

// html2pdf.js typings (light)
declare module 'html2pdf.js' {
    const html2pdf: any
    export default html2pdf
}
