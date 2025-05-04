from langchain_groq import ChatGroq

# from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import CSVLoader

# from langchain_community.embeddings import OpenAIEmbeddings
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from pathlib import Path
from dotenv import load_dotenv


import os


BASE_DIR = Path(__file__).resolve().parent.parent.parent
CSV_FILE = BASE_DIR / "utils" / "questoes_socio.csv"
load_dotenv(BASE_DIR / "dotenv-files" / ".env")


def ai_connect(question):
    api_key = os.getenv("DS_KEY", "")
    model = "deepseek-r1-distill-llama-70b"
    deepseek = ChatGroq(api_key=api_key, model=model)

    parser = StrOutputParser()
    deepseek_chain = deepseek | parser

    loader = CSVLoader(file_path=CSV_FILE, encoding="utf-8")
    document = loader.load()

    rag_template = """
    Você é o assistente de uma plataforma de estudos.
    Seu trabalho é conversar com os estudantes, consultando a base de conhecimentos
    com as questões da plataforma, e dar uma resposta precisa para eles,
    baseada na base de dados da plataforma fornecida como contexto.

    Contexto: {context}
    Pergunta do estudante: {question}
    """

    final_template = rag_template.format(context=document, question=question)
    answer = deepseek_chain.invoke(final_template)

    return answer


# prompt = ChatPromptTemplate.from_template(rag_template)
# question = "Quais são todos os temas das questões?"
# print(awnswer)
