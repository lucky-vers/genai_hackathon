import asyncio
from flask import Flask, request, jsonify
from conva_ai import AsyncConvaAI
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
client = AsyncConvaAI(
    assistant_id="ffffffffffffffffffffffffffffffff",
    assistant_version="10.0.0",
    api_key="ffffffffffffffffffffffffffffffff",
)

# Store conversation history globally (for demo purposes)
history = "{}"

@app.route('/query', methods=['POST'])
async def query_ai():
    global history
    data = request.get_json()

    query = data.get("query")

    # Exit if no query is provided
    if not query:
        return jsonify({"error": "No query provided"}), 400

    # Send the query to the assistant
    try:
        response = await client.invoke_capability(query, stream=False)

        # Return the AI's response as JSON
        return jsonify({
            "message": response.message,
            "history": response.conversation_history
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)
