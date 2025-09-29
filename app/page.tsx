export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Node.js Contact Form Backend</h1>
            <p className="text-xl text-gray-600">Professional email handling API for contact forms</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">🚀 API Endpoints</h2>
              <div className="space-y-4">
                <div className="bg-white rounded p-4">
                  <code className="text-green-600 font-mono">GET /health</code>
                  <p className="text-gray-600 mt-2">Health check endpoint</p>
                </div>
                <div className="bg-white rounded p-4">
                  <code className="text-blue-600 font-mono">POST /api/contact</code>
                  <p className="text-gray-600 mt-2">Submit contact form</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">✨ Features</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Professional email templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Dual email system
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Input validation with Zod
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Security middleware
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  cPanel hosting ready
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">📝 Contact Form Example</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              {`POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "subject": "General Inquiry",
  "message": "Hello, I would like to know more about your services."
}`}
            </pre>
          </div>

          <div className="mt-8 bg-yellow-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-yellow-900 mb-4">🔧 Deployment Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                Build the project: <code className="bg-gray-200 px-2 py-1 rounded">npm run build</code>
              </li>
              <li>
                Upload <code>dist/</code>, <code>node_modules/</code>, <code>package.json</code>, and <code>.env</code>{" "}
                to cPanel
              </li>
              <li>
                Configure Node.js app in cPanel with startup file: <code>dist/index.js</code>
              </li>
              <li>Add environment variables in cPanel Node.js settings</li>
              <li>Start the application</li>
            </ol>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">Ready for production deployment on cPanel shared hosting</p>
          </div>
        </div>
      </div>
    </div>
  )
}
