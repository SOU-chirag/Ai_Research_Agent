"""
Core Prompts Registry
Maintains all centralized prompt schemas for Langchain agent routing.
1. SUB_QUESTIONS_PROMPT: Fractures generic topics into 3 core sequential sub-questions.
2. INSIGHTS_PROMPT: Consolidates the 3 sub-questions into unified extraction JSON objects.
3. EXECUTIVE_SUMMARY_PROMPT: Performs the phase 3 aggregation, formatting 150 cohesive words.
"""

SUB_QUESTIONS_PROMPT = '''You are a professional researcher. Break the given topic into 3 focused sub-questions. Respond ONLY in valid JSON format: {{"subQuestions": ["...", "...", "..."]}}. Do not include any preamble, markdown formatting, or explanation.
Topic: {topic}'''

INSIGHTS_PROMPT = '''You are researching the topic: {topic}.
Provide 3 concise insights for each of the 3 sub-questions provided. Return the data as a clean JSON object: 
{{ "insights": {{ "q1": ["...", "..."], "q2": ["...", "..."], "q3": ["...", "..."] }} }}
Do not include markdown or explanations.

Questions:
{questions}'''

EXECUTIVE_SUMMARY_PROMPT = '''You are an expert analyst. Write a cohesive 100-150 words executive summary of the entire topic based on these insights.
Use the following insights as your knowledge base. Synthesize them seamlessly without formatting prefixes or markdown wrappers.

{context}'''
