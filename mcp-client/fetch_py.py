import urllib.request
import json

url = "https://21st.dev/api/mcp"
headers = {
    "x-api-key": "21st_sk_802355ade6e929d62c1a30dfba29d22ab1ff37ab72168d9b39e4f23a3fdbae04",
    "Content-Type": "application/json"
}

def call_mcp(method, params=None):
    data = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method
    }
    if params is not None:
        data["params"] = params
        
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except Exception as e:
        print(f"Error calling {method}: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())
        return None

print("Fetching tools...")
tools = call_mcp("tools/list")
print(json.dumps(tools, indent=2))

if tools and 'result' in tools:
    print("\nSearching for Bento Grid...")
    res = call_mcp("tools/call", {"name": "search", "arguments": {"query": "bento grid dashboard"}})
    with open("bento.json", "w") as f:
        json.dump(res, f, indent=2)
    print("Saved bento.json")
    
    print("\nSearching for Stats Card...")
    res2 = call_mcp("tools/call", {"name": "search", "arguments": {"query": "stats card metric"}})
    with open("stats.json", "w") as f:
        json.dump(res2, f, indent=2)
    print("Saved stats.json")
