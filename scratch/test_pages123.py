import sys
sys.stdout.reconfigure(encoding='utf-8')
import urllib.request

token = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3OTUzMjQxNDMsImlhdCI6MTc5MjczMjE0MywiaXNzIjoic2NyaWJkLW1vbm9saXRoIiwiZm9ybWF0X3V1aWQiOiI0dWxyM2lqYnk4OHcxdWhrIiwieF9zY3JpYmRfdXVpZCI6IjIxMjcxZTI5LTVmMWYtNGM5YS1hYjQwLTY5ODAzOWJiMjVkZSIsInhfcmVxdWVzdF9pZCI6IjQ3MTEwNDEwMGE5MjYzY2RkNjQ0MGI0YTk4ODgwZTVhYzRkNjE4ZWVlYTc1ODYxMTExODU5MWZhZGNjOTAzMjAiLCJwYWdlX21pbiI6MSwicGFnZV9tYXgiOjExMywiZW5mb3JjZSI6dHJ1ZX0.LelvSgqU2lRK21hbXO1cxGtiLs2O0LlLCc4ukrzEWXc'
format_uuid = '4ulr3ijby88w1uhk'

urls = [
    f'https://html.scribdassets.com/{format_uuid}/images/1-a21fc908ce.png?token={token}',
    f'https://html.scribdassets.com/{format_uuid}/images/1-a21fc908ce.jpg?token={token}',
    f'https://html.scribdassets.com/{format_uuid}/images/2-4f2fa079c0.jpg?token={token}',
    f'https://html.scribdassets.com/{format_uuid}/images/3-4817701d39.jpg?token={token}',
]

for u in urls:
    req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            print(f'OK ({resp.status}): {u.split("?")[0]} - {len(resp.read())} bytes')
    except Exception as e:
        print(f'FAIL: {u.split("?")[0]} - {e}')
