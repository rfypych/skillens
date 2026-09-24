"""
PDF text extraction with OCR fallback.

Strategy:
1. Try pure text extraction with pypdf (fast, works for text-based PDFs).
2. If the extracted text is empty or suspiciously short, treat the PDF as a
   scanned/image document and run OCR:
   - PyMuPDF (fitz) renders each page to an image.
   - RapidOCR (rapidocr-onnxruntime, ONNX runtime) reads the text from the
     rendered page. It ships its own models and needs no system binaries.
"""

import logging
import io

from pypdf import PdfReader

logger = logging.getLogger(__name__)

MIN_TEXT_LENGTH = 40

# Lazy-loaded so a missing optional dependency never breaks imports.
_ocr_engine = None
_fitz = None


def _get_fitz():
    global _fitz
    if _fitz is None:
        try:
            import pymupdf as fitz  # PyMuPDF (>=1.24 modern import)
        except ImportError:
            try:
                import fitz
            except ImportError:
                _fitz = False
            else:
                _fitz = fitz
        else:
            _fitz = fitz
    return _fitz


def _get_ocr():
    global _ocr_engine
    if _ocr_engine is None:
        try:
            from rapidocr_onnxruntime import RapidOCR
        except ImportError:
            logger.warning("RapidOCR not installed; scanned PDFs will not be readable.")
            _ocr_engine = False
        else:
            try:
                _ocr_engine = RapidOCR()
            except Exception as e:
                logger.warning(f"RapidOCR failed to initialise: {e}")
                _ocr_engine = False
    return _ocr_engine


def extract_pdf_text(file_path: str) -> str:
    """Return text from a PDF, falling back to OCR for scanned documents."""
    text = _extract_with_pypdf(file_path)
    if text and len(text.strip()) >= MIN_TEXT_LENGTH:
        return text

    ocr_text = _extract_with_ocr(file_path)
    if ocr_text and len(ocr_text.strip()) >= MIN_TEXT_LENGTH:
        logger.info("PDF appeared scanned; recovered %d chars via OCR", len(ocr_text))
        return ocr_text

    # Return the best we have (may be empty).
    return (text or ocr_text or "").strip()


def _extract_with_pypdf(file_path: str) -> str:
    try:
        reader = PdfReader(file_path)
        pages = []
        for page in reader.pages:
            content = page.extract_text()
            if content:
                pages.append(content)
        return "\n".join(pages).strip()
    except Exception as e:
        logger.warning(f"pypdf extraction failed for {file_path}: {e}")
        return ""


def _extract_with_ocr(file_path: str) -> str:
    fitz = _get_fitz()
    if not fitz:
        return ""
    ocr = _get_ocr()
    if not ocr:
        return ""

    try:
        doc = fitz.open(file_path)
    except Exception as e:
        logger.warning(f"PyMuPDF could not open {file_path}: {e}")
        return ""

    try:
        chunks = []
        for page in doc:
            pix = page.get_pixmap(dpi=200)
            img_bytes = pix.tobytes("png")
            result, _ = ocr(img_bytes)
            if result:
                page_text = "\n".join(line[1] for line in result)
                chunks.append(page_text)
        return "\n".join(chunks).strip()
    except Exception as e:
        logger.warning(f"OCR failed for {file_path}: {e}")
        return ""
    finally:
        try:
            doc.close()
        except Exception:
            pass


MAX_PORTFOLIO_IMAGES = 6


def extract_pdf_images(file_path: str, max_images: int = MAX_PORTFOLIO_IMAGES, min_px: int = 200) -> list:
    """Return PNG bytes of embedded raster images (portfolio documentation
    photos). Skips tiny icons/logos. Returns [] when PyMuPDF is unavailable.
    NOTE: no AI interpretation here — pixel-level analysis requires a vision
    model, which our current LLM provider does not expose. The images are
    preserved as human-verifiable evidence for recruiters."""
    fitz = _get_fitz()
    if not fitz:
        return []
    try:
        doc = fitz.open(file_path)
    except Exception as e:
        logger.warning(f"PyMuPDF could not open {file_path}: {e}")
        return []
    try:
        out = []
        for page in doc:
            for img in page.get_images(full=True):
                if len(out) >= max_images:
                    break
                try:
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)
                    if pix.width < min_px or pix.height < min_px:
                        continue
                    if pix.n - pix.alpha > 3:  # CMYK → RGB
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    out.append(pix.tobytes("png"))
                except Exception:
                    continue
            if len(out) >= max_images:
                break
        return out
    except Exception as e:
        logger.warning(f"Image extraction failed for {file_path}: {e}")
        return []
    finally:
        try:
            doc.close()
        except Exception:
            pass


def extract_pdf_text_from_bytes(file_bytes: bytes) -> str:
    """Extract text from raw PDF bytes (used when no temp file is available)."""
    import tempfile
    import os

    fd, path = tempfile.mkstemp(suffix=".pdf")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(file_bytes)
        return extract_pdf_text(path)
    finally:
        try:
            os.remove(path)
        except Exception:
            pass
