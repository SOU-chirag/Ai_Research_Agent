import asyncio, os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
load_dotenv('.env')
async def run():
    llm = ChatGroq(model='llama-3.3-70b-versatile', temperature=0.0)
    try:
        res = await llm.ainvoke('test')
        print('SUCCESS:', res.content)
    except Exception as e:
        print('EXACT ERROR:', repr(e))
asyncio.run(run())
