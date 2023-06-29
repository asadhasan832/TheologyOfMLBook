const TITLE = 1
const BODY = 0
const AUTHOR = "Asad Hasan"
const AUTHOR_TITLE = "Theoretical Computational Scientist"
// Edit these title patterns
const titlePatterns = [
  "Preface",
  "Foreword",
  "Chapter\\s\\d.+"
]

function renderDoc() {
  const {chapterTitle, chapterTitleTest} = chapterRegex()
  let doc = DocumentApp.getActiveDocument()
  let text = doc.getBody().getText()
  let title = doc.getName()
  let chapterTexts = text.split(chapterTitle)
  let template = initializeTemplate(title)
  let i = 0
  for(let chapterText of chapterTexts) {
    if(chapterText) {
      if(chapterTitleTest.test(chapterText)) {
        template += `\\chapter*{${chapterText.trim()}}
`
      } else {
        template += `${chapterText.trim()}
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

% for placeholder text
\\usepackage{lipsum}

\\title{${title}}
\\author{${AUTHOR} \\\\ ${AUTHOR_TITLE}}

% Remove the generated chapter title
\\titleformat{\\chapter}[display]
  {\\normalfont\\huge\\bfseries}{}{0pt}{\\Huge}
\\titlespacing*{\\chapter}{0pt}{-50pt}{40pt}

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

