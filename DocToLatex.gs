const TITLE = 1
const BODY = 0
const AUTHOR = "Asad Hasan (Alex)"
const AUTHOR_TITLE = "Theoretical Computational Scientist"
// Edit these title patterns
const titlePatterns = [
  "Preface",
  "Foreword",
  "Chapter\\s\\d.+"
]

const noIndentChapterPatterns = [
  "Preface",
  "Chapter 11.+"
]

function indentParagraph(paragraphText) {
    return paragraphText.trim().replace(/^/g, "\n\\indent ").replace(/\n/g, "\n\n\\indent ")
}

function main() {
  const {chapterTitle, chapterTitleTest} = chapterRegex()
  let noIndentRegex = chapterIndentRegex()
  let doc = DocumentApp.getActiveDocument()
  let text = doc.getBody().getText()
  let title = doc.getName()
  let chapterTexts = text.split(chapterTitle)
  let template = initializeTemplate(title)
  let previousNoIndent = false
  let i = 0
  for(let chapterText of chapterTexts) {
    if(chapterText) {
      if(chapterTitleTest.test(chapterText)) {
        previousNoIndent = false
        if(noIndentRegex.test(chapterText)) previousNoIndent = true
        template += `\\chapter*{${chapterText.trim()}}
`
      } else if(previousNoIndent) {
        template += `${chapterText}
`
      } else {
        template += `${indentParagraph(chapterText)}
`
      }
    }
  }
  template += `\\end{document}`
  // Create a file in Google Drive
  let folder = DriveApp.getRootFolder(); // Change to the desired folder if needed
  let fileName = `${title}.tex`; // Name of the file
  folder.createFile(fileName, template);
}

function initializeTemplate(title) {
  let template = `\\documentclass[ebook,12pt,oneside,openany]{memoir}
\\usepackage[utf8x]{inputenc}
\\usepackage[english]{babel}
\\usepackage{url}
\\usepackage{titlesec}
\\usepackage{lettrine}
\\usepackage{amsthm}
\\usepackage{amssymb}

% for placeholder text
\\usepackage{lipsum}

\\title{${title}}
\\author{${AUTHOR} \\\\ ${AUTHOR_TITLE}}

% Remove the generated chapter title
\\titleformat{\\chapter}[display]
  {\\normalfont\\huge\\bfseries}{}{0pt}{\\Huge}
\\titlespacing*{\\chapter}{0pt}{-50pt}{40pt}

\\newtheorem*{proposition}{Proposition} % Define theorem environment without numbering
\\newtheorem*{thoughtexperiment}{Thought Experiment} % Define theorem environment without numbering

\\begin{document}
\\makeatletter
\\renewcommand{\\@date}{} % Remove the definition of \\@date
\\makeatother
\\maketitle
`
  return template
}

function chapterRegex() {
  let chapterTitleLiteral = ""
  let chapterTitleTestLiteral = ""
  for(let p of titlePatterns) {
    chapterTitleLiteral += `(${p})|`
    chapterTitleTestLiteral += `(^${p})|`
  }
  chapterTitleLiteral = chapterTitleLiteral.replace(/\|$/, '')
  chapterTitleTestLiteral = chapterTitleTestLiteral.replace(/\|$/, '')
  const chapterTitle = new RegExp(chapterTitleLiteral, "g")
  const chapterTitleTest = new RegExp(chapterTitleTestLiteral, "g")
  return {chapterTitle, chapterTitleTest}
}

function chapterIndentRegex() {
  let chapterTitleLiteral = ""
  for(let p of noIndentChapterPatterns) {
    chapterTitleLiteral += `(${p})|`
  }
  chapterTitleLiteral = chapterTitleLiteral.replace(/\|$/, '')
  const chapterTitle = new RegExp(chapterTitleLiteral, "g")
  return chapterTitle
}
