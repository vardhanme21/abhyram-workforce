import json
import os

def main():
    try:
        # Try different encodings
        try:
            with open('permset_query.json', 'r', encoding='utf-16') as f:
                data = json.load(f)
        except:
            with open('permset_query.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
                
        if data.get('status') == 0:
            result = data.get('result', {})
            records = result.get('records', [])
            print(f"Found {len(records)} records:")
            for rec in records:
                print(f"Name: {rec.get('Name')}, Label: {rec.get('Label')}")
        else:
            print("Query failed")
            
    except Exception as e:
        print(f"Error parsing JSON: {e}")

if __name__ == "__main__":
    main()
