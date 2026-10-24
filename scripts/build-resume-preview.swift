// Renders each page of files/resume.pdf to images/resume/resume-page-N.jpg
// for the /resume page preview. Run after updating the PDF (macOS only):
//   swift scripts/build-resume-preview.swift [path/to/resume.pdf]
import AppKit
import PDFKit

let source = URL(fileURLWithPath: CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "files/resume.pdf")
let outDir = URL(fileURLWithPath: "images/resume", isDirectory: true)
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

guard let document = PDFDocument(url: source) else {
  fputs("Could not open \(source.path)\n", stderr)
  exit(1)
}

let targetWidth: CGFloat = 1400
for index in 0..<document.pageCount {
  guard let page = document.page(at: index) else { continue }
  let bounds = page.bounds(for: .mediaBox)
  let scale = targetWidth / bounds.width
  let size = NSSize(width: bounds.width * scale, height: bounds.height * scale)
  let image = NSImage(size: size)
  image.lockFocus()
  NSColor.white.setFill()
  NSRect(origin: .zero, size: size).fill()
  if let context = NSGraphicsContext.current?.cgContext {
    context.scaleBy(x: scale, y: scale)
    page.draw(with: .mediaBox, to: context)
  }
  image.unlockFocus()
  guard
    let tiff = image.tiffRepresentation,
    let bitmap = NSBitmapImageRep(data: tiff),
    let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.72])
  else { continue }
  let out = outDir.appendingPathComponent("resume-page-\(index + 1).jpg")
  try jpeg.write(to: out)
  print("wrote \(out.path) (\(Int(size.width))x\(Int(size.height)))")
}
