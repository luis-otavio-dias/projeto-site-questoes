import asyncio
import json
import re
import time
from asyncio import Semaphore
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from rich import print

RE_QUESTION_SPLIT = re.compile(r"(QUESTÃO\s+\d+)")
RE_NORMALIZE_Q = re.compile(r"(\d+)")

SYSTEM_INSTRUCTION = """
You are a precise question extraction assistant. Extract the following from
question text:
You do NOT need to validate the correct_option provided; just include it in the
output.
You only need to extract the data as specified below.

- question: "QUESTÃO XX" format (pad single digits: "01", "02")
- image: true if image/graph present OR (URL exists AND passage_text is empty)
- passage_text: Any text before the statement (preserve line breaks). Exclude
sources.
- sources:
  * URLs: Return as ["full_url", "DD mmm. YYYY"]
  (extract date from "Acesso em:")
  * Books/articles: Single string with full reference
  * Max 5, only from THIS question
- statement: Main question text
- options: A, B, C, D, E (full text each)

Return ONLY valid JSON (no markdown, no comments):
{{
    "question": str,
    "image": bool,
    "passage_text": str,
    "sources": [str],
    "statement": str,
    "options": {{"A": str, "B": str, "C": str, "D": str, "E": str}},
    "correct_option": str
}}
"""


def extract_pdf_text(pdf_path: Path) -> str:
    """Abre o PDF de forma segura e extrai o texto."""
    text_content = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                page_text = page.get_text()
                text_content += str(page_text)

    except Exception as e:
        print(f"[bold red]Erro ao ler PDF {pdf_path}:[/] {e}")
        return ""
    return text_content


def chunk_by_questions(text: str) -> list[str]:
    parts = RE_QUESTION_SPLIT.split(text)
    chunks = []
    for i in range(1, len(parts), 2):
        if i + 1 < len(parts):
            header = parts[i]
            content = parts[i + 1]
            clean_content = re.sub(r"\n{3,}", "\n\n", content.strip())
            chunks.append(f"{header}\n{clean_content}")
    return chunks


async def process_question(
    chunk: str,
    answer_key_text: str,
    semaphore: Semaphore,
    chain: Any,
    index: int,
) -> dict[str, Any] | None:
    """
    Processa um chunk. Retorna um dict já parseado ou None em caso de erro.
    """
    async with semaphore:
        try:
            return await chain.ainvoke(
                {"text": chunk, "answer_key_text": answer_key_text}
            )
        except Exception as e:
            print(f"[red]❌ Erro no chunk {index}: {e}[/]")
            return None


async def structure_question_data(
    exam_file_path: str, answer_key_file_path: str
) -> list[dict[str, Any]]:
    start = time.perf_counter()
    print(f"Started at {time.strftime('%X')}")

    exam_text = extract_pdf_text(exam_file_path)
    answer_key_text = extract_pdf_text(answer_key_file_path)

    questions_chunks = chunk_by_questions(exam_text)
    print(f"Total de chunks de questões encontrados: {len(questions_chunks)}")

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_INSTRUCTION),
            (
                "human",
                "Question text:\n{text}\n\nCorrect option: {answer_key_text}",
            ),
        ]
    )

    chain = prompt | llm | JsonOutputParser()

    semaphore = Semaphore(30)  # Ajustar conforme necessário
    tasks = []

    for i, chunk in enumerate(questions_chunks, 1):
        if "QUESTÃO" not in chunk:
            continue
        tasks.append(
            process_question(chunk, answer_key_text, semaphore, chain, i)
        )

    results = await asyncio.gather(*tasks)

    valid_data = []
    for res in results:
        if res is None:
            continue

        has_url = any(
            "http" in str(source) for source in res.get("sources", [])
        )
        is_text_empty = not res.get("passage_text", "").strip()

        if has_url and is_text_empty:
            res["image"] = True

        valid_data.append(res)

    print(
        f"✅ Processadas com sucesso: {len(valid_data)}/{len(questions_chunks)}"
    )

    output_path = Path(__file__).parent / "final_output.json"
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(valid_data, f, indent=4, ensure_ascii=False)

    end = time.perf_counter()
    print(f"\nTempo de execução: {end - start:.2f} segundos")
    return valid_data


if __name__ == "__main__":
    base_path = Path(__file__).parent.parent.parent / "pdfs"
    prova_path = base_path / "prova.pdf"
    gabarito_path = base_path / "gabarito.pdf"

    valid_data = asyncio.run(
        structure_question_data(prova_path, gabarito_path)
    )
    print(type(valid_data))
    for item in valid_data:
        print(type(item))
        print(item)
