import json
from pathlib import Path
from typing import Any

from django.db import transaction
from langchain_core.caches import InMemoryCache
from langchain_core.exceptions import OutputParserException
from langchain_core.globals import set_llm_cache
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
)
from langchain_core.output_parsers import JsonOutputParser
from langgraph.graph.state import RunnableConfig
from pydantic import ValidationError
from rich import print

from ai_agent.graph import build_graph
from ai_agent.prompts import HUMAN_PROMPT, SYSTEM_PROMPT
from apps.question.models import Answer, Question


def _content_to_text(content: str | list[str | dict[str, Any]]) -> str:
    text = ""

    if isinstance(content, str):
        text = content

    if isinstance(content, list):
        parts: list[str] = []

        for item in content:
            if isinstance(item, str) and item.strip():
                parts.append(item)

            elif isinstance(item, dict):
                txt = item.get("text", "")
                if txt and txt.strip():
                    parts.append(txt)

                elif (
                    isinstance(item.get("content", None), str)
                    and item["content"].strip()
                ):
                    parts.append(item["content"])
        text = "\n".join(parts)

    else:
        text = str(content)

    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]

    text = text.removesuffix("```")

    return text.strip()


class AIAgentService:
    async def extract_questions_from_exam(
        self, exam_file_path: str, answer_key_file_path: str
    ) -> dict:

        set_llm_cache(InMemoryCache())

        config = RunnableConfig(configurable={"thread_id": 1})
        graph = build_graph()

        human_prompt = HUMAN_PROMPT.format(
            exam_file_path, answer_key_file_path
        )

        messages: list[BaseMessage] = [
            SystemMessage(SYSTEM_PROMPT),
            HumanMessage(human_prompt),
        ]

        result = await graph.ainvoke({"messages": messages}, config=config)

        final_message = result["messages"][-1]
        if isinstance(final_message, AIMessage):
            content = final_message.content
            raw_text: str = _content_to_text(content)
            try:

                parsed = JsonOutputParser().invoke(raw_text)
                for question in parsed:
                    has_url = any(
                        "http" in source
                        for source in question.get("sources", [])
                    )
                    is_text_empty = not question.get(
                        "passage_text", ""
                    ).strip()

                    if has_url and is_text_empty:
                        question["image"] = True

                json_path = Path(__file__).parent / "final_output.json"

                with json_path.open("w", encoding="utf-8") as file:
                    json.dump(parsed, file, indent=4, ensure_ascii=False)

            except (ValidationError, OutputParserException) as e:
                print(f"Error while parsing JSON response: {e}")
                print(f"Response content: {content[:100]}")

        else:
            print("content não foi parsable.")


def process_exam_import(exam_import_instance) -> None:
    try:
        service = AIAgentService()
        import asyncio

        data = asyncio.run(
            service.extract_questions_from_exam(
                exam_import_instance.exam_file.path,
                exam_import_instance.answer_key_file.path,
            )
        )
        print()
        print(type(data))
        print()
        print(f"Extracted data: {data[:100]}")

        with transaction.atomic():
            for question_data in data:
                question = Question.objects.create(
                    exam=exam_import_instance,
                    stem=question_data.get("statement", ""),
                    passage_text=question_data.get("passage_text", ""),
                    correct_answer=question_data.get("correct_answer", ""),
                    has_image=question_data.get("image", False),
                )

                for option_data in question_data.get("options", []):
                    Answer.objects.create(
                        question=question,
                        option_text=option_data.get("option_text", ""),
                    )

    except Exception as e:
        print(f"Error processing exam import: {e}")
