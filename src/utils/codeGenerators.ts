import type { EndpointInfo } from '../data/endpointMap';

const AUTH_BASE_URL = "https://j0dos52r5e.execute-api.us-east-1.amazonaws.com/dev";
const DEFAULT_MOCK_URL = "https://cd140b74-ed23-4980-834b-a966ac3393c1.mock.pstmn.io";

export interface CodeGenerationOptions {
  endpoint: EndpointInfo;
  mockServerUrl?: string;
  includeAuth?: boolean;
}

export function generatePythonCode(options: CodeGenerationOptions): string {
  const { endpoint, mockServerUrl = DEFAULT_MOCK_URL, includeAuth = true } = options;
  const timestamp = new Date().toISOString();
  
  return `#!/usr/bin/env python3
"""
C2M API - ${endpoint.path}
Generated: ${timestamp}
Description: ${endpoint.description}
"""
import requests
import json
from typing import Dict, Any

# Configuration
API_BASE_URL = "${mockServerUrl}"  # Mock server or production API endpoint
AUTH_BASE_URL = "${AUTH_BASE_URL}"  # C2M Auth service

# Note: Using test credentials for the mock server
CLIENT_ID = "test-client-123"  # Replace with your client ID
CLIENT_SECRET = "super-secret-password-123"  # Replace with your client secret

def print_request(method: str, url: str, headers: Dict, body: Any = None):
    """Pretty print HTTP request"""
    print("\\n" + "="*60)
    print("REQUEST")
    print("="*60)
    print(f"{method} {url}")
    print("\\nHeaders:")
    for key, value in headers.items():
        print(f"  {key}: {value}")
    if body:
        print("\\nBody:")
        print(json.dumps(body, indent=2))

def print_response(response: requests.Response):
    """Pretty print HTTP response"""
    print("\\n" + "="*60)
    print("RESPONSE")
    print("="*60)
    print(f"Status: {response.status_code}")
    print("\\nHeaders:")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")
    if response.text:
        print("\\nBody:")
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)

${includeAuth ? `def get_access_token(client_id: str, client_secret: str) -> str:
    """Exchange client credentials for JWT access token"""
    print("\\n🔐 AUTHENTICATION FLOW")
    print("="*60)
    
    # Step 1: Get long-term token
    print("\\n1. Getting long-term token...")
    url = f"{AUTH_BASE_URL}/auth/tokens/long"
    
    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }
    
    headers = {"Content-Type": "application/json"}
    print_request("POST", url, headers, payload)
    
    response = requests.post(url, json=payload, headers=headers)
    print_response(response)
    
    if response.status_code != 200:
        raise Exception(f"Failed to get long-term token: {response.text}")
    
    long_term_token = response.json()["access_token"]
    print("\\n✅ Long-term token obtained")
    
    # Step 2: Exchange for short-term token
    print("\\n2. Exchanging for short-term token...")
    url = f"{AUTH_BASE_URL}/auth/tokens/short"
    
    headers = {
        "Authorization": f"Bearer {long_term_token}",
        "Content-Type": "application/json"
    }
    
    payload = {"grant_type": "token_exchange"}
    print_request("POST", url, headers, payload)
    
    response = requests.post(url, json=payload, headers=headers)
    print_response(response)
    
    if response.status_code != 200:
        raise Exception(f"Failed to get short-term token: {response.text}")
    
    short_term_token = response.json()["access_token"]
    print("\\n✅ Short-term token obtained")
    
    return short_term_token

` : ''}def submit_request(token: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Submit API request to ${endpoint.path}"""
    url = f"{API_BASE_URL}${endpoint.path}"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"\\n📤 SUBMITTING REQUEST TO {endpoint.path}")
    print("="*60)
    print_request("${endpoint.method}", url, headers, payload)
    
    response = requests.${endpoint.method.toLowerCase()}(url, json=payload, headers=headers)
    print_response(response)
    
    response.raise_for_status()
    return response.json()

# Main execution
if __name__ == "__main__":
    try:
        # Authenticate
        ${includeAuth ? 'token = get_access_token(CLIENT_ID, CLIENT_SECRET)' : 'token = "YOUR_ACCESS_TOKEN"  # Replace with your token'}
        
        # Prepare payload
        payload = ${JSON.stringify(endpoint.payloadExample, null, 8).split('\n').map((line, i) => i === 0 ? line : '        ' + line).join('\n')}
        
        # Submit request
        result = submit_request(token, payload)
        
        print("\\n✅ SUCCESS!")
        print("="*60)
        print("Job submitted successfully")
        
    except Exception as e:
        print(f"\\n❌ ERROR: {str(e)}")
        exit(1)`;
}

export function generateJavaScriptCode(options: CodeGenerationOptions): string {
  const { endpoint, mockServerUrl = DEFAULT_MOCK_URL, includeAuth = true } = options;
  const timestamp = new Date().toISOString();
  
  return `#!/usr/bin/env node
/**
 * C2M API - ${endpoint.path}
 * Generated: ${timestamp}
 * Description: ${endpoint.description}
 */

// Configuration
const API_BASE_URL = '${mockServerUrl}'; // Mock server or production API endpoint
const AUTH_BASE_URL = '${AUTH_BASE_URL}'; // C2M Auth service

// Note: Using test credentials for the mock server
const CLIENT_ID = 'test-client-123'; // Replace with your client ID
const CLIENT_SECRET = 'super-secret-password-123'; // Replace with your client secret

/**
 * Pretty print HTTP request
 */
function printRequest(method, url, headers, body = null) {
  console.log('\\n' + '='.repeat(60));
  console.log('REQUEST');
  console.log('='.repeat(60));
  console.log(\`\${method} \${url}\`);
  console.log('\\nHeaders:');
  Object.entries(headers).forEach(([key, value]) => {
    console.log(\`  \${key}: \${value}\`);
  });
  if (body) {
    console.log('\\nBody:');
    console.log(JSON.stringify(body, null, 2));
  }
}

/**
 * Pretty print HTTP response
 */
function printResponse(response, body) {
  console.log('\\n' + '='.repeat(60));
  console.log('RESPONSE');
  console.log('='.repeat(60));
  console.log(\`Status: \${response.status}\`);
  console.log('\\nHeaders:');
  response.headers.forEach((value, key) => {
    console.log(\`  \${key}: \${value}\`);
  });
  if (body) {
    console.log('\\nBody:');
    console.log(JSON.stringify(body, null, 2));
  }
}

${includeAuth ? `/**
 * Exchange client credentials for JWT access token
 */
async function getAccessToken(clientId, clientSecret) {
  console.log('\\n🔐 AUTHENTICATION FLOW');
  console.log('='.repeat(60));
  
  // Step 1: Get long-term token
  console.log('\\n1. Getting long-term token...');
  const longTermUrl = \`\${AUTH_BASE_URL}/auth/tokens/long\`;
  
  const longTermPayload = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret
  };
  
  const longTermHeaders = { 'Content-Type': 'application/json' };
  printRequest('POST', longTermUrl, longTermHeaders, longTermPayload);
  
  const longTermResponse = await fetch(longTermUrl, {
    method: 'POST',
    headers: longTermHeaders,
    body: JSON.stringify(longTermPayload)
  });
  
  const longTermData = await longTermResponse.json();
  printResponse(longTermResponse, longTermData);
  
  if (!longTermResponse.ok) {
    throw new Error(\`Failed to get long-term token: \${JSON.stringify(longTermData)}\`);
  }
  
  const longTermToken = longTermData.access_token;
  console.log('\\n✅ Long-term token obtained');
  
  // Step 2: Exchange for short-term token
  console.log('\\n2. Exchanging for short-term token...');
  const shortTermUrl = \`\${AUTH_BASE_URL}/auth/tokens/short\`;
  
  const shortTermHeaders = {
    'Authorization': \`Bearer \${longTermToken}\`,
    'Content-Type': 'application/json'
  };
  
  const shortTermPayload = { grant_type: 'token_exchange' };
  printRequest('POST', shortTermUrl, shortTermHeaders, shortTermPayload);
  
  const shortTermResponse = await fetch(shortTermUrl, {
    method: 'POST',
    headers: shortTermHeaders,
    body: JSON.stringify(shortTermPayload)
  });
  
  const shortTermData = await shortTermResponse.json();
  printResponse(shortTermResponse, shortTermData);
  
  if (!shortTermResponse.ok) {
    throw new Error(\`Failed to get short-term token: \${JSON.stringify(shortTermData)}\`);
  }
  
  const shortTermToken = shortTermData.access_token;
  console.log('\\n✅ Short-term token obtained');
  
  return shortTermToken;
}

` : ''}/**
 * Submit API request to ${endpoint.path}
 */
async function submitRequest(token, payload) {
  const url = \`\${API_BASE_URL}${endpoint.path}\`;
  
  const headers = {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  };
  
  console.log(\`\\n📤 SUBMITTING REQUEST TO ${endpoint.path}\`);
  console.log('='.repeat(60));
  printRequest('${endpoint.method}', url, headers, payload);
  
  const response = await fetch(url, {
    method: '${endpoint.method}',
    headers: headers,
    body: JSON.stringify(payload)
  });
  
  const data = await response.json();
  printResponse(response, data);
  
  if (!response.ok) {
    throw new Error(\`Request failed: \${JSON.stringify(data)}\`);
  }
  
  return data;
}

// Main execution
(async () => {
  try {
    // Authenticate
    ${includeAuth ? 'const token = await getAccessToken(CLIENT_ID, CLIENT_SECRET);' : 'const token = "YOUR_ACCESS_TOKEN"; // Replace with your token'}
    
    // Prepare payload
    const payload = ${JSON.stringify(endpoint.payloadExample, null, 4).split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n')};
    
    // Submit request
    const result = await submitRequest(token, payload);
    
    console.log('\\n✅ SUCCESS!');
    console.log('='.repeat(60));
    console.log('Job submitted successfully');
    
  } catch (error) {
    console.error(\`\\n❌ ERROR: \${error.message}\`);
    process.exit(1);
  }
})();`;
}

export function generateCurlCode(options: CodeGenerationOptions): string {
  const { endpoint, mockServerUrl = DEFAULT_MOCK_URL, includeAuth = true } = options;
  
  if (!includeAuth) {
    return `# Direct API call (requires valid token)
curl -X ${endpoint.method} \\
  ${mockServerUrl}${endpoint.path} \\
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(endpoint.payloadExample, null, 2).replace(/'/g, "'\"'\"'")}'`;
  }
  
  return `#!/bin/bash
# C2M API - ${endpoint.path}
# Description: ${endpoint.description}

# Configuration
API_BASE_URL="${mockServerUrl}"
AUTH_BASE_URL="${AUTH_BASE_URL}"

# Test credentials for mock server
CLIENT_ID="test-client-123"
CLIENT_SECRET="super-secret-password-123"

echo "🔐 AUTHENTICATION FLOW"
echo "======================================"

# Step 1: Get long-term token
echo ""
echo "1. Getting long-term token..."
LONG_TERM_RESPONSE=$(curl -s -X POST \\
  $AUTH_BASE_URL/auth/tokens/long \\
  -H 'Content-Type: application/json' \\
  -d '{
    "grant_type": "client_credentials",
    "client_id": "'$CLIENT_ID'",
    "client_secret": "'$CLIENT_SECRET'"
  }')

echo "Response: $LONG_TERM_RESPONSE"
LONG_TERM_TOKEN=$(echo $LONG_TERM_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$LONG_TERM_TOKEN" ]; then
  echo "❌ Failed to get long-term token"
  exit 1
fi

echo "✅ Long-term token obtained"

# Step 2: Exchange for short-term token
echo ""
echo "2. Exchanging for short-term token..."
SHORT_TERM_RESPONSE=$(curl -s -X POST \\
  $AUTH_BASE_URL/auth/tokens/short \\
  -H "Authorization: Bearer $LONG_TERM_TOKEN" \\
  -H 'Content-Type: application/json' \\
  -d '{"grant_type": "token_exchange"}')

echo "Response: $SHORT_TERM_RESPONSE"
SHORT_TERM_TOKEN=$(echo $SHORT_TERM_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$SHORT_TERM_TOKEN" ]; then
  echo "❌ Failed to get short-term token"
  exit 1
fi

echo "✅ Short-term token obtained"

# Step 3: Submit API request
echo ""
echo "📤 SUBMITTING REQUEST TO ${endpoint.path}"
echo "======================================"

curl -X ${endpoint.method} \\
  $API_BASE_URL${endpoint.path} \\
  -H "Authorization: Bearer $SHORT_TERM_TOKEN" \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(endpoint.payloadExample, null, 2).replace(/'/g, "'\"'\"'")}'

echo ""
echo "✅ Request submitted"`;
}