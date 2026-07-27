import urllib.request
import json
import sys

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
        return None

cid = int(sys.argv[1])
res = call_mcp("tools/call", {"name": "get_component", "arguments": {"id": cid}})
with open(f"comp_{cid}.json", "w") as f:
    json.dump(res, f, indent=2)
print(f"Saved comp_{cid}.json")
