#!/usr/bin/env python3
import asyncio
import httpx

async def test_ollama():
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post('http://ollama:11434/api/chat', json={
                'model': 'qwen2.5:3b-instruct',
                'messages': [{'role': 'user', 'content': 'Hello, can you respond with just OK?'}],
                'stream': False
            })
            print(f'Status: {response.status_code}')
            if response.status_code == 200:
                data = response.json()
                print(f'Response: {data.get("message", {}).get("content", "No content")}')
            else:
                print(f'Error: {response.text}')
    except Exception as e:
        print(f'Exception: {e}')

if __name__ == "__main__":
    asyncio.run(test_ollama())
